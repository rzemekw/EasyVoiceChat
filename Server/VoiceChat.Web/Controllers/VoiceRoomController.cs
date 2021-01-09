using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VoiceChat.Logic;

namespace VoiceChat.Web.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class VoiceRoomController : ControllerBase
    {
        private readonly ILogger<VoiceRoomController> _logger;
        private readonly VoiceChatService _voiceChatService;
                                                              
        public VoiceRoomController(ILogger<VoiceRoomController> logger, VoiceChatService voiceChatService)
        {
            _logger = logger;
            _voiceChatService = voiceChatService;
        }

        [HttpGet]
        public string Create()
        {
            return _voiceChatService.CreateVoiceRoom();
        }

        [HttpGet("{id:int}")]
        public int Get(int id)
        {
            return id;
        }
    }
}
