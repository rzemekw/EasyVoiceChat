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

        public async Task Join(string key, string userName, string mimeType)
        {
            if (string.IsNullOrEmpty(userName))
                return;

            var room = _voiceChatService.GetVoiceRoom(key);
            if (room == null)
                return;

            if (!_voiceChatService.AddUserToVoiceRoom(key, userName, Context.ConnectionId, mimeType))
                return;

            await Clients.Group(key).SendAsync("NewUser", Context.ConnectionId, userName, mimeType);

            await Groups.AddToGroupAsync(Context.ConnectionId, key);
        }

        public Dictionary<string, (string, string)> GetOtherUsers()
        {
            return _voiceChatService.GetOtherUsers(Context.ConnectionId);
        }

        public ChannelReader<(string, object)> StartListening()
        {
            var room = _voiceChatService.GetUsersVoiceRoom(Context.ConnectionId);
            if (room == null)
                return null;

            var channel = Channel.CreateUnbounded<(string, object)>();

            if (!room.UserChannels.TryAdd(Context.ConnectionId, channel.Writer))
                return null;

            return channel.Reader;
        }

        public async Task SendMessage(string content)
        {
            var room = _voiceChatService.GetUsersVoiceRoom(Context.ConnectionId);
            if (room == null)
                return;
            await Clients.Group(room.Key).SendAsync("NewMessage", Context.ConnectionId, content);
        }

        public async Task SendVoice(IAsyncEnumerable<object> buffers)
        {
            var room = _voiceChatService.GetUsersVoiceRoom(Context.ConnectionId);
            if (room == null)
                return;

            if (!room.Users.TryGetValue(Context.ConnectionId, out _))
                return;

            await foreach (var obj in buffers)
            {
                foreach (var channel in room.UserChannels.Where(p => p.Key != Context.ConnectionId).Select(p => p.Value))
                {
                    channel.TryWrite((Context.ConnectionId, obj));
                }
            }

            await Clients.OthersInGroup(room.Key).SendAsync("VoiceEnded", Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var room = _voiceChatService.RemoveUser(Context.ConnectionId);

            if (room != null)
                await Clients.Group(room.Key).SendAsync("UserDisconnected", Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }

    }
}
