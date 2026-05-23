using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Scan;
using BiteWise.BLL.Interfaces;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

using System.Diagnostics.CodeAnalysis;

namespace BiteWise.BLL.Services
{
    [ExcludeFromCodeCoverage]
    public class NutritionService : INutritionService
    {
        private readonly IFatSecretAuthService _authService;
        private readonly HttpClient _httpClient;
        private readonly IDistributedCache _cache;
        private readonly ILogger<NutritionService> _logger;

        public NutritionService(IFatSecretAuthService authService, HttpClient httpClient, IDistributedCache cache, ILogger<NutritionService> logger)
        {
            _authService = authService;
            _httpClient = httpClient;
            _cache = cache;
            _logger = logger;
        }

        public async Task<NutritionInfo> GetNutritionInfoAsync(string foodName)
        {
            if (foodName == "unknown/not_food")
            {
                return new NutritionInfo { LocalizedName = "Невідома їжа", CaloriesPer100g = 0, ProteinsPer100g = 0.0f, FatsPer100g = 0.0f, CarbsPer100g = 0.0f };
            }

            // Додали "v2", щоб інвалідувати старий кеш (який зберігся без альтернатив)
            string cacheKey = $"food_nutrition_v2_{foodName.ToLower()}";

            try
            {
                // 1. Перевіряємо Redis кеш (огортаємо в окремий try-catch, щоб падіння Redis не блокувало API)
                try
                {
                    var cachedData = await _cache.GetStringAsync(cacheKey);
                    if (!string.IsNullOrEmpty(cachedData))
                    {
                        var cachedNutrition = JsonSerializer.Deserialize<NutritionInfo>(cachedData);
                        if (cachedNutrition != null)
                        {
                            return cachedNutrition;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Redis is down or unavailable. Proceeding to FatSecret API.");
                }

                // 2. Якщо немає в кеші або Redis впав - йдемо до FatSecret API
                var token = await _authService.GetAccessTokenAsync();

                var requestUri = $"https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression={Uri.EscapeDataString(foodName)}&format=json&max_results=5";
                var request = new HttpRequestMessage(HttpMethod.Get, requestUri);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var searchData = JsonSerializer.Deserialize<FatSecretSearchResponse>(jsonResponse);

                    var foodsList = searchData?.Foods?.FoodList;
                    if (foodsList != null && foodsList.Any())
                    {
                        NutritionInfo? mainNutrition = null;
                        var alternatives = new List<NutritionInfo>();

                        foreach (var food in foodsList)
                        {
                            if (string.IsNullOrEmpty(food.FoodDescription)) continue;

                            var caloriesMatch = Regex.Match(food.FoodDescription, @"Calories:\s*([\d\.]+)kcal");
                            var fatMatch = Regex.Match(food.FoodDescription, @"Fat:\s*([\d\.]+)g");
                            var carbsMatch = Regex.Match(food.FoodDescription, @"Carbs:\s*([\d\.]+)g");
                            var proteinMatch = Regex.Match(food.FoodDescription, @"Protein:\s*([\d\.]+)g");

                            float.TryParse(caloriesMatch.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture, out float calories);
                            float.TryParse(fatMatch.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture, out float fat);
                            float.TryParse(carbsMatch.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture, out float carbs);
                            float.TryParse(proteinMatch.Groups[1].Value, System.Globalization.CultureInfo.InvariantCulture, out float protein);

                            if (calories > 0)
                            {
                                var parsedInfo = new NutritionInfo
                                {
                                    LocalizedName = food.FoodName,
                                    CaloriesPer100g = (int)calories,
                                    ProteinsPer100g = protein,
                                    FatsPer100g = fat,
                                    CarbsPer100g = carbs
                                };

                                if (mainNutrition == null)
                                {
                                    mainNutrition = parsedInfo;
                                }
                                else
                                {
                                    // Щоб уникнути дублікатів (наприклад дві "Cheese Pizza" з однаковими макросами)
                                    if (!alternatives.Any(a => a.LocalizedName == parsedInfo.LocalizedName))
                                    {
                                        alternatives.Add(parsedInfo);
                                    }
                                }
                            }
                        }

                        if (mainNutrition != null)
                        {
                            mainNutrition.Alternatives = alternatives;

                            // 3. Зберігаємо в Redis на 7 днів (огортаємо в try-catch)
                            try
                            {
                                var cacheOptions = new DistributedCacheEntryOptions
                                {
                                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7)
                                };
                                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(mainNutrition), cacheOptions);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, "Failed to save to Redis cache.");
                            }

                            return mainNutrition;
                        }
                        else
                        {
                            _logger.LogWarning($"Regex failed to parse calories for {foodName} from any of the {foodsList.Count} items returned.");
                        }
                    }
                    else
                    {
                        _logger.LogWarning($"FatSecret returned no items or empty description for {foodName}. JSON: {jsonResponse}");
                    }
                }
                else
                {
                    _logger.LogError($"FatSecret API returned {(int)response.StatusCode}: {await response.Content.ReadAsStringAsync()}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Exception occurred while fetching nutrition for {foodName}");
            }

            return new NutritionInfo
            {
                LocalizedName = $"Невідома страва ({foodName})",
                CaloriesPer100g = 100,
                ProteinsPer100g = 5.0f,
                FatsPer100g = 5.0f,
                CarbsPer100g = 10.0f
            };
        }
    }
}
