using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VoiceChat.Logic;
using VoiceChat.Web.Models;

namespace VoiceChat.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly VoiceChatService _voiceChatService;
        private readonly IMapper _mapper;

        public HomeController(ILogger<HomeController> logger, VoiceChatService voiceChatService, IMapper mapper)
        {
            _logger = logger;
            _voiceChatService = voiceChatService;
            _mapper = mapper;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CreateVoiceRoom()
        {
            var key = _voiceChatService.CreateVoiceRoom();
            return RedirectToAction("VoiceRoom", "Home", new { key });
        }

        public IActionResult VoiceRoom(string key)
        {
            if (key == null)
                return BadRequest();

            var model = _mapper.Map<VoiceRoomModel>(_voiceChatService.GetVoiceRoom(key));
            if (model == null)
                return NotFound();

            model.Key = key;

            return View(model);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
