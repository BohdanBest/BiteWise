using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BiteWise.DAL.Entities
{
    public class UserAchievement
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        [Required]
        public Guid AchievementId { get; set; }

        [ForeignKey(nameof(AchievementId))]
        public Achievement? Achievement { get; set; }

        [Required]
        public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
    }
}
