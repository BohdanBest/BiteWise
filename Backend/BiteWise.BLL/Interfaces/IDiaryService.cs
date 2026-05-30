using System;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Diary;

namespace BiteWise.BLL.Interfaces
{
    public interface IDiaryService
    {
        Task<FoodEntryResponseDto> AddEntryAsync(Guid userId, AddFoodEntryDto dto);
        Task<DailySummaryDto> GetDailySummaryAsync(Guid userId, DateTime date);
        Task<WeeklyStatisticsDto> GetWeeklyStatisticsAsync(Guid userId, DateTime endDate);
        Task RemoveEntryAsync(Guid userId, Guid entryId);
    }
}
