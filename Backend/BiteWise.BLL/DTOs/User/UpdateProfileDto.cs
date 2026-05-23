using BiteWise.DAL.Enums;

namespace BiteWise.BLL.DTOs.User
{
    public class UpdateProfileDto
    {
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public float WeightKg { get; set; }
        public float HeightCm { get; set; }
        public Goal Goal { get; set; }
    }
}
