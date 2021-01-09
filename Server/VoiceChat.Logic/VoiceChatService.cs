using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VoiceChat.Logic
{
    public class VoiceChatService
    {
        private readonly ConcurrentDictionary<string, VoiceRoom> voiceRooms = new ConcurrentDictionary<string, VoiceRoom>();
        private readonly ConcurrentDictionary<string, VoiceRoom> userVoiceRooms = new ConcurrentDictionary<string, VoiceRoom>();

        private const int keyLength = 10;
        private const string chars = "abcdefghijklmnopqrstuvwxyz1234567890";
        private const int secondsToJoin = 120;

        private string CreateRandomKey()
        {
            var random = new Random();
            return new string(Enumerable.Repeat(chars, keyLength).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task AutoDeleteRoomIfNoUsersJoined(string key)
        {
            await Task.Delay(1000 * secondsToJoin);
            voiceRooms.TryGetValue(key, out var room);
            if (room != null)
            {
                if (!room.Users.Any())
                    voiceRooms.TryRemove(key, out _);
            }
        }

        public string CreateVoiceRoom()
        {
            var key = CreateRandomKey();
            var room = new VoiceRoom();

            while (!voiceRooms.TryAdd(key, room))
                key = CreateRandomKey();

            room.Key = key;

            _ = Task.Factory.StartNew(() => AutoDeleteRoomIfNoUsersJoined(key));

            return key;
        }

        public bool AddUserToVoiceRoom(string key, string userName, string connectionId, string mimeType)
        {
            if (!voiceRooms.TryGetValue(key, out var room))
                return false;

            room.Users.TryAdd(connectionId, (userName, mimeType));
            userVoiceRooms.TryAdd(connectionId, room);
            return true;
        }

        public Dictionary<string, (string, string)> GetOtherUsers(string connectionId)
        {
            if (!userVoiceRooms.TryGetValue(connectionId, out var room))
                return new Dictionary<string, (string, string)>();

            return room.Users.Where(p => p.Key != connectionId).ToDictionary(p => p.Key, p => p.Value);
        }

        public VoiceRoom GetVoiceRoom(string key)
        {
            voiceRooms.TryGetValue(key, out var room);
            return room;
        }

        public VoiceRoom GetUsersVoiceRoom(string connectionId)
        {
            userVoiceRooms.TryGetValue(connectionId, out var room);
            return room;
        }

        /// <summary>
        /// Removes User from voice group and returns his voiceRoom
        /// </summary>
        public VoiceRoom RemoveUser(string connectionId)
        {
            if (!userVoiceRooms.TryRemove(connectionId, out var room))
                return null;

            room.UserChannels.TryRemove(connectionId, out var channel);
            channel.TryComplete();
            room.Users.TryRemove(connectionId, out _);

            if (!room.Users.Any())
                Task.Factory.StartNew(() => AutoDeleteRoomIfNoUsersJoined(room.Key));

            return room;
        }
    }
}
