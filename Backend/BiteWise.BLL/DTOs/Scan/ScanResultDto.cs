using System.Collections.Generic;

namespace BiteWise.BLL.DTOs.Scan
{
    public class ScanAlternativeDto
    {
        public string FoodName { get; set; } = string.Empty;
        public int Calories { get; set; }
        public float Proteins { get; set; }
        public float Fats { get; set; }
        public float Carbs { get; set; }
    }

    public class ScanResultDto
    {
        public string FoodName { get; set; } = string.Empty;
        public int WeightGrams { get; set; }
        public int Calories { get; set; }
        public float Proteins { get; set; }
        public float Fats { get; set; }
        public float Carbs { get; set; }
        public float Confidence { get; set; }
        public string? Warning { get; set; }
        
        public List<ScanAlternativeDto> Alternatives { get; set; } = new();
    }
}
