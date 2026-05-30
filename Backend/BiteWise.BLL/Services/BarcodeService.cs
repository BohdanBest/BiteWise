using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Scan;
using BiteWise.BLL.Interfaces;
using Microsoft.Extensions.Logging;

namespace BiteWise.BLL.Services
{
    public class BarcodeService : IBarcodeService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<BarcodeService> _logger;

        public BarcodeService(HttpClient httpClient, ILogger<BarcodeService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<ScanResultDto?> GetProductByBarcodeAsync(string barcode)
        {
            try
            {
                var requestUri = $"https://world.openfoodfacts.org/api/v0/product/{barcode}.json";
                var response = await _httpClient.GetAsync(requestUri);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"OpenFoodFacts API returned status code {response.StatusCode} for barcode {barcode}.");
                    return null;
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(jsonResponse);
                
                var root = document.RootElement;
                if (root.TryGetProperty("status", out var statusProp) && statusProp.GetInt32() == 1)
                {
                    if (root.TryGetProperty("product", out var product))
                    {
                        string foodName = product.TryGetProperty("product_name", out var nameProp) ? nameProp.GetString() ?? "Невідомий продукт" : "Невідомий продукт";
                        
                        var nutriments = product.TryGetProperty("nutriments", out var n) ? n : default;
                        
                        float calories = 0f;
                        string? warningText = null;

                        if (nutriments.ValueKind != JsonValueKind.Undefined)
                        {
                            if (nutriments.TryGetProperty("energy-kcal_100g", out var kcalProp) && kcalProp.TryGetSingle(out var kcalVal))
                            {
                                calories = kcalVal;
                            }
                            else if (nutriments.TryGetProperty("energy_100g", out var kjProp) && kjProp.TryGetSingle(out var kjVal))
                            {
                                calories = kjVal / 4.184f; // Перевід кДж у ккал
                            }
                            else
                            {
                                warningText = "У базі відсутня інформація про калорії. Встановлено 0 ккал.";
                            }
                        }

                        float proteins = nutriments.ValueKind != JsonValueKind.Undefined && nutriments.TryGetProperty("proteins_100g", out var pProp) && pProp.TryGetSingle(out var pVal) ? pVal : 0f;
                        float fats = nutriments.ValueKind != JsonValueKind.Undefined && nutriments.TryGetProperty("fat_100g", out var fProp) && fProp.TryGetSingle(out var fVal) ? fVal : 0f;
                        float carbs = nutriments.ValueKind != JsonValueKind.Undefined && nutriments.TryGetProperty("carbohydrates_100g", out var cProp) && cProp.TryGetSingle(out var cVal) ? cVal : 0f;

                        int weightGrams = 100;
                        if (product.TryGetProperty("product_quantity", out var qProp) && qProp.ValueKind == JsonValueKind.String && int.TryParse(qProp.GetString(), out int qVal))
                        {
                            weightGrams = qVal;
                        }

                        return new ScanResultDto
                        {
                            FoodName = foodName,
                            Calories = (int)Math.Round(calories),
                            Proteins = (float)Math.Round(proteins, 1),
                            Fats = (float)Math.Round(fats, 1),
                            Carbs = (float)Math.Round(carbs, 1),
                            WeightGrams = weightGrams,
                            Confidence = 100f,
                            Warning = warningText
                        };
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception occurred while fetching barcode {barcode} from OpenFoodFacts");
                return null;
            }
        }
    }
}
