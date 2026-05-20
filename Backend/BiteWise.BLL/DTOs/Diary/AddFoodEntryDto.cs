using System.ComponentModel.DataAnnotations;
using BiteWise.DAL.Enums;

namespace BiteWise.BLL.DTOs.Diary
{
    public class AddFoodEntryDto
    {
        [Required]
        [MaxLength(200)]
        public string FoodName { get; set; } = string.Empty;

        [Required]
        public int Calories { get; set; }

        public float Proteins { get; set; }
        public float Fats { get; set; }
        public float Carbs { get; set; }

        [Required]
        [Range(1, 10000)]
        public int WeightGrams { get; set; }

        [Required]
        public MealType MealType { get; set; }
    }
}
