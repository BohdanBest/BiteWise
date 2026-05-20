using System.ComponentModel.DataAnnotations;
using BiteWise.DAL.Enums;

namespace BiteWise.BLL.DTOs.User
{
    public class UpdateProfileDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(1, 120)]
        public int Age { get; set; }

        [Required]
        [Range(1, 300)]
        public float WeightKg { get; set; }

        [Required]
        [Range(50, 250)]
        public float HeightCm { get; set; }

        [Required]
        public Goal Goal { get; set; }
    }
}
