using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BiteWise.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiteWise.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private Guid GetUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token.");
            }
            return userId;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = GetUserId();
                var profile = await _userService.GetProfileAsync(userId);
                
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] BiteWise.BLL.DTOs.User.UpdateProfileDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserId();
                var updatedProfile = await _userService.UpdateProfileAsync(userId, dto);
                
                return Ok(updatedProfile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("me")]
        public async Task<IActionResult> DeleteProfile()
        {
            try
            {
                var userId = GetUserId();
                await _userService.DeleteAccountAsync(userId);
                
                return Ok(new { message = "Account successfully deleted." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
