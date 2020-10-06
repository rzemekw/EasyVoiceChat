using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VoiceChat.Web.Models
{
    public class VoiceRoomModel
    {
        public Dictionary<string, string> Users { get; set; }
        public string Key { get; set; }
    }
}
