using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Channels;

namespace VoiceChat.Logic
{
    public class VoiceRoom
    {
        public ConcurrentDictionary<string, string> Users { get; set; } = new ConcurrentDictionary<string, string>();
        public ConcurrentDictionary<string, ChannelWriter<(string, object)>> UsersChannels { get; set; } = new ConcurrentDictionary<string, ChannelWriter<(string, object)>>();
    }
}
