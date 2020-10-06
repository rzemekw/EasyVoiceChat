using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using VoiceChat.Logic;
using VoiceChat.Web.Controllers;

namespace VoiceChat.Web.Hubs
{
    public class VoiceRoomHub : Hub
    {
        private readonly VoiceChatService _voiceChatService;

        public VoiceRoomHub(VoiceChatService voiceChatService)
        {
            _voiceChatService = voiceChatService;
        }

        public async Task<UserModel[]> Join(string key, string userName)
        {
            if (string.IsNullOrEmpty(userName))
                return null;

            var room = _voiceChatService.GetVoiceRoom(key);
            if (room == null)
                return null;

            if (!_voiceChatService.AddUserToVoiceRoom(key, userName, Context.ConnectionId))
                return null;

            await Clients.Group(key).SendAsync("NewUser", Context.ConnectionId, userName);

            await Groups.AddToGroupAsync(Context.ConnectionId, key);

            return room.Users.Select(p => new UserModel { ConnectionId = p.Key, Name = p.Value }).ToArray();
        }

        public ChannelReader<(string, object)> StartListening(string key)
        {
            var room = _voiceChatService.GetVoiceRoom(key);
            if (room == null)
                return null;

            if (!room.Users.TryGetValue(Context.ConnectionId, out _))
                return null;

            var channel = Channel.CreateUnbounded<(string, object)>();

            if (!room.UsersChannels.TryAdd(Context.ConnectionId, channel.Writer))
                return null;

            return channel.Reader;
        }

        public async Task SendMessage(string key, string content)
        {
            await Clients.Group(key).SendAsync("NewMessage", Context.ConnectionId, content);
        }

        public async Task SendVoice(IAsyncEnumerable<object> buffers, string key)
        {
            var room = _voiceChatService.GetVoiceRoom(key);
            if (room == null)
                return;

            if (!room.Users.TryGetValue(Context.ConnectionId, out _))
                return;

            await foreach (var obj in buffers)
            {
                foreach(var channel in room.UsersChannels.Where(p => p.Key != Context.ConnectionId).Select(p => p.Value))
                {
                    channel.TryWrite((Context.ConnectionId, obj));
                }
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = _voiceChatService.RemoveUser(Context.ConnectionId);

            if(group != null)
                await Clients.Group(group).SendAsync("UserDisconnected", Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }

    }
}
