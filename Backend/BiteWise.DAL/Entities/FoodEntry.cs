using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BiteWise.DAL.Enums;

namespace BiteWise.DAL.Entities
{
    public class FoodEntry
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        [Required]
        [MaxLength(200)]
        public string FoodName { get; set; } = string.Empty;

        [Required]
        public int Calories { get; set; }

        [Required]
        public float Proteins { get; set; }

        [Required]
        public float Fats { get; set; }

        [Required]
        public float Carbs { get; set; }

        [Required]
        public int WeightGrams { get; set; }

        [Required]
        public MealType MealType { get; set; }

        [Required]
        public DateTime ConsumedAt { get; set; } = DateTime.UtcNow;
    }
}
