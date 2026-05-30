using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BiteWise.BLL.DTOs.Scan;
using BiteWise.BLL.Interfaces;

namespace BiteWise.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ScanController : ControllerBase
    {
        private readonly IMLServiceClient _mlServiceClient;
        private readonly INutritionService _nutritionService;
        private readonly IBarcodeService _barcodeService;

        public ScanController(IMLServiceClient mlServiceClient, INutritionService nutritionService, IBarcodeService barcodeService)
        {
            _mlServiceClient = mlServiceClient;
            _nutritionService = nutritionService;
            _barcodeService = barcodeService;
        }

        [HttpPost]
        public async Task<IActionResult> ScanFood(IFormFile image)
        {
            try
            {
                if (image == null || image.Length == 0)
                {
                    return BadRequest(new { message = "Будь ласка, завантажте зображення." });
                }

                // 1. Відправляємо фото на Python ML-сервіс
                using var stream = image.OpenReadStream();
                var mlResult = await _mlServiceClient.RecognizeImageAsync(stream, image.FileName, image.ContentType);

                // Якщо низька впевненість або не їжа
                if (mlResult.ClassName == "unknown/not_food" || mlResult.Confidence < 0.50)
                {
                    return Ok(new ScanResultDto
                    {
                        FoodName = "Не розпізнано",
                        Warning = mlResult.Warning ?? "Модель не впевнена, що це їжа.",
                        Confidence = mlResult.Confidence
                    });
                }

                // 2. Отримуємо нутрієнти з нашої бази (за назвою класу)
                var nutrition = await _nutritionService.GetNutritionInfoAsync(mlResult.ClassName);

                // 3. Рахуємо фінальні значення пропорційно до ваги
                float weightMultiplier = mlResult.EstimatedWeightGrams / 100f;

                var finalResult = new ScanResultDto
                {
                    FoodName = nutrition.LocalizedName,
                    WeightGrams = mlResult.EstimatedWeightGrams,
                    Calories = (int)(nutrition.CaloriesPer100g * weightMultiplier),
                    Proteins = nutrition.ProteinsPer100g * weightMultiplier,
                    Fats = nutrition.FatsPer100g * weightMultiplier,
                    Carbs = nutrition.CarbsPer100g * weightMultiplier,
                    Confidence = mlResult.Confidence,
                    Warning = mlResult.Warning
                };

                // Додаємо альтернативи
                if (nutrition.Alternatives != null)
                {
                    foreach (var alt in nutrition.Alternatives)
                    {
                        finalResult.Alternatives.Add(new ScanAlternativeDto
                        {
                            FoodName = alt.LocalizedName,
                            Calories = alt.CaloriesPer100g,
                            Proteins = alt.ProteinsPer100g,
                            Fats = alt.FatsPer100g,
                            Carbs = alt.CarbsPer100g
                        });
                    }
                }

                return Ok(finalResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Помилка сервера: {ex.Message}" });
            }
        }

        [HttpGet("barcode/{barcode}")]
        public async Task<IActionResult> ScanBarcode(string barcode)
        {
            try
            {
                var result = await _barcodeService.GetProductByBarcodeAsync(barcode);
                
                if (result == null)
                {
                    return NotFound(new { message = "Продукт не знайдено в базі даних штрихкодів." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Помилка сервера: {ex.Message}" });
            }
        }
    }
}
