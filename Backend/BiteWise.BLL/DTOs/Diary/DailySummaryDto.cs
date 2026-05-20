using System.Collections.Generic;

namespace BiteWise.BLL.DTOs.Diary
{
    public class DailySummaryDto
    {
        public int TotalCaloriesConsumed { get; set; }
        public int DailyCalorieGoal { get; set; }
        public int RemainingCalories { get; set; }

        public float TotalProteins { get; set; }
        public float TotalFats { get; set; }
        public float TotalCarbs { get; set; }

        public List<FoodEntryResponseDto> Entries { get; set; } = new List<FoodEntryResponseDto>();
    }
}
