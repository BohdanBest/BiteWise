using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BiteWise.BLL.DTOs.Scan
{
    public class FatSecretSearchResponse
    {
        [JsonPropertyName("foods")]
        public FatSecretFoods Foods { get; set; } = new();
    }

    public class FatSecretFoods
    {
        [JsonPropertyName("food")]
        // FatSecret can return a single object or an array depending on results, 
        // but with format=json it usually returns an array if multiple, or object if one. 
        // We will assume array for simplicity, but if it fails, we handle it in service.
        public List<FatSecretFoodItem>? FoodList { get; set; }
    }

    public class FatSecretFoodItem
    {
        [JsonPropertyName("food_id")]
        public string FoodId { get; set; } = string.Empty;

        [JsonPropertyName("food_name")]
        public string FoodName { get; set; } = string.Empty;

        [JsonPropertyName("food_description")]
        public string FoodDescription { get; set; } = string.Empty;
    }
}
