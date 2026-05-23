using BiteWise.DAL.Enums;

namespace BiteWise.BLL.DTOs.Diary
{
    public class AddFoodEntryDto
    {
        public string FoodName { get; set; } = string.Empty;
        public int Calories { get; set; }
        public float Proteins { get; set; }
        public float Fats { get; set; }
        public float Carbs { get; set; }
        public int WeightGrams { get; set; }
        public MealType MealType { get; set; }
    }
}
