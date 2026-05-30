using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BiteWise.BLL.Interfaces;

namespace BiteWise.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AchievementController : ControllerBase
    {
        private readonly IAchievementService _achievementService;

        public AchievementController(IAchievementService achievementService)
        {
            _achievementService = achievementService;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyAchievements()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized(new { message = "Невірний токен користувача." });
            }

            var achievements = await _achievementService.GetMyAchievementsAsync(userId);
            return Ok(achievements);
        }
    }
}
