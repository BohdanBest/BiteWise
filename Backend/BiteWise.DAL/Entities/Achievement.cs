using System;
using System.ComponentModel.DataAnnotations;
using BiteWise.DAL.Enums;

namespace BiteWise.DAL.Entities
{
    public class Achievement
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string IconName { get; set; } = "Award";

        [Required]
        public AchievementCriteria CriteriaType { get; set; }
        
        // Кількість чогось для отримання (напр. 3 для 3-денного стріка)
        public int RequiredValue { get; set; } = 1;
    }
}
