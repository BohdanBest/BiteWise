using System;
using System.Security.Claims;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Diary;
using BiteWise.BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiteWise.API.Controllers
{
    [Authorize] // Захищає всі ендпоінти в цьому контролері
    [ApiController]
    [Route("api/[controller]")]
    public class DiaryController : ControllerBase
    {
        private readonly IDiaryService _diaryService;

        public DiaryController(IDiaryService diaryService)
        {
            _diaryService = diaryService;
        }

        private Guid GetUserId()
        {
            // Дістаємо ID користувача безпосередньо з JWT токена
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token.");
            }
            return userId;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddFoodEntry([FromBody] AddFoodEntryDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetUserId();
                var response = await _diaryService.AddEntryAsync(userId, dto);
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("summary/{date}")]
        public async Task<IActionResult> GetDailySummary(string date)
        {
            try
            {
                if (!DateTime.TryParse(date, out DateTime parsedDate))
                {
                    return BadRequest(new { message = "Invalid date format." });
                }

                var utcDate = DateTime.SpecifyKind(parsedDate, DateTimeKind.Utc);
                var userId = GetUserId();
                var summary = await _diaryService.GetDailySummaryAsync(userId, utcDate);
                
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("statistics/weekly/{endDate}")]
        public async Task<IActionResult> GetWeeklyStatistics(string endDate)
        {
            try
            {
                if (!DateTime.TryParse(endDate, out DateTime parsedDate))
                {
                    return BadRequest(new { message = "Invalid date format." });
                }

                var utcDate = DateTime.SpecifyKind(parsedDate, DateTimeKind.Utc);
                var userId = GetUserId();
                var stats = await _diaryService.GetWeeklyStatisticsAsync(userId, utcDate);
                
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{entryId}")]
        public async Task<IActionResult> DeleteFoodEntry(Guid entryId)
        {
            try
            {
                var userId = GetUserId();
                await _diaryService.RemoveEntryAsync(userId, entryId);
                return Ok(new { message = "Запис успішно видалено." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
