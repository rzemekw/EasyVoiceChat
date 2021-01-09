using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Channels;

namespace VoiceChat.Logic
{
    public class VoiceRoom
    {
        public string Key { get; set; }
        public ConcurrentDictionary<string, (string, string)> Users { get; set; } = new ConcurrentDictionary<string, (string, string)>();
        public ConcurrentDictionary<string, ChannelWriter<(string, object)>> UserChannels { get; set; }
            = new ConcurrentDictionary<string, ChannelWriter<(string, object)>>();
    }
}
