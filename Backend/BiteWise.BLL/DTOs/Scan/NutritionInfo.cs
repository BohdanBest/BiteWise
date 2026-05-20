using System.Collections.Generic;

namespace BiteWise.BLL.DTOs.Scan
{
    public class NutritionInfo
    {
        public string LocalizedName { get; set; } = string.Empty;
        public int CaloriesPer100g { get; set; }
        public float ProteinsPer100g { get; set; }
        public float FatsPer100g { get; set; }
        public float CarbsPer100g { get; set; }
        public List<NutritionInfo> Alternatives { get; set; } = new();
    }
}
