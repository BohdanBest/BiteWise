using BiteWise.DAL.Enums;

namespace BiteWise.BLL.DTOs.Auth
{
    public class RegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public int Age { get; set; }
        public float WeightKg { get; set; }
        public float HeightCm { get; set; }
        public Goal Goal { get; set; }
    }
}
