using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace VoiceChat.Logic
{
    public class VoiceChatService
    {
        private readonly ConcurrentDictionary<string, VoiceRoom> voiceRooms = new ConcurrentDictionary<string, VoiceRoom>();
        private readonly ConcurrentDictionary<string, string> usersGroups = new ConcurrentDictionary<string, string>();

        private const int keyLength = 10;
        private const string chars = "abcdefghijklmnopqrstuvwxyz1234567890";
        private const int secondsToJoin = 15;

        private string CreateRandomKey()
        {
            var random = new Random();
            return new string(Enumerable.Repeat(chars, keyLength).Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private async Task AutoDeleteRoomIfNoUsersJoined(string key)
        {
            await Task.Delay(1000 * secondsToJoin);
            voiceRooms.TryGetValue(key, out var room);
            if(room != null)
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

            Task.Factory.StartNew(() => AutoDeleteRoomIfNoUsersJoined(key));

            return key;
        }

        public bool AddUserToVoiceRoom(string key, string userName, string connectionId)
        {
            if (!voiceRooms.TryGetValue(key, out var room))
                return false;

            room.Users.TryAdd(connectionId, userName);
            usersGroups.TryAdd(connectionId, key);
            return true;
        }

        public VoiceRoom GetVoiceRoom(string key)
        {
            voiceRooms.TryGetValue(key, out var room);
            return room;
        }

        public string GetUsersGroup(string connectionId)
        {
            usersGroups.TryGetValue(connectionId, out var key);
            return key;
        }

        /// <summary>
        /// Removes User from voice group
        /// </summary>
        /// <returns>Returns User's voice groups's key</returns>
        public string RemoveUser(string connectionId)
        {
            if (!usersGroups.TryRemove(connectionId, out var key))
                return null;

            voiceRooms.TryGetValue(key, out var room);
            room.Users.TryRemove(connectionId, out _);
            room.UsersChannels.TryRemove(connectionId, out _);

            if (!room.Users.Any())
                Task.Factory.StartNew(() => AutoDeleteRoomIfNoUsersJoined(key));

            return key;
        }
    }
}
