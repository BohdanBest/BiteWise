using System;
using System.Collections.Generic;

namespace BiteWise.BLL.DTOs.Diary
{
    public class WeeklyStatisticsDto
    {
        public int DailyCalorieGoal { get; set; }
        public List<DailyCalorieStatDto> DailyCalories { get; set; } = new();
        
        public int AverageCalories { get; set; }
        public StatRecordDto MaxCalories { get; set; } = new();
        public StatRecordDto MinCalories { get; set; } = new();
        
        public List<TopFoodDto> TopFoods { get; set; } = new();
    }

    public class DailyCalorieStatDto
    {
        public DateTime Date { get; set; }
        public string DayOfWeek { get; set; } = string.Empty; // "Пн", "Вт", "Ср"...
        public int Calories { get; set; }
    }

    public class StatRecordDto
    {
        public int Value { get; set; }
        public string DayOfWeek { get; set; } = string.Empty;
    }

    public class TopFoodDto
    {
        public string FoodName { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
