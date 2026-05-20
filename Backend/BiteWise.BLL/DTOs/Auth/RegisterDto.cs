using System.ComponentModel.DataAnnotations;
using BiteWise.DAL.Enums;

namespace BiteWise.BLL.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public Gender Gender { get; set; }

        [Required]
        [Range(10, 120)]
        public int Age { get; set; }

        [Required]
        [Range(30, 300)]
        public float WeightKg { get; set; }

        [Required]
        [Range(100, 250)]
        public float HeightCm { get; set; }

        [Required]
        public Goal Goal { get; set; }
    }
}
