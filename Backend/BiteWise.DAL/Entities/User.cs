using System;
using System.ComponentModel.DataAnnotations;
using BiteWise.DAL.Enums;

namespace BiteWise.DAL.Entities
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // --- Onboarding Data ---
        [Required]
        public Gender Gender { get; set; }

        [Required]
        public int Age { get; set; }

        [Required]
        public float WeightKg { get; set; }

        [Required]
        public float HeightCm { get; set; }

        [Required]
        public Goal Goal { get; set; }

        [Required]
        public int DailyCalorieGoal { get; set; }

        public string? RefreshToken { get; set; }
        
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
