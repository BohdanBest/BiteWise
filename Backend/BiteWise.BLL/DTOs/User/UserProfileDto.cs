namespace BiteWise.BLL.DTOs.User
{
    public class UserProfileDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int Age { get; set; }
        public float WeightKg { get; set; }
        public float HeightCm { get; set; }
        public string GoalName { get; set; } = string.Empty;
        public int DailyCalorieGoal { get; set; }
        public string FormulaDetails { get; set; } = string.Empty;
    }
}
