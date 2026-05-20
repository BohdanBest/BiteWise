using System.Text.Json.Serialization;

namespace BiteWise.BLL.DTOs.Scan
{
    public class MLRecognitionResult
    {
        [JsonPropertyName("class_name")]
        public string ClassName { get; set; } = string.Empty;

        [JsonPropertyName("estimated_weight_grams")]
        public int EstimatedWeightGrams { get; set; }

        [JsonPropertyName("confidence")]
        public float Confidence { get; set; }

        [JsonPropertyName("warning")]
        public string? Warning { get; set; }
    }
}
