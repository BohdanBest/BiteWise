namespace BiteWise.BLL.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int DailyCalorieGoal { get; set; }
    }
}
