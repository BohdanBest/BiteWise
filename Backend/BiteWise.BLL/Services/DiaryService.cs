using System;
using System.Linq;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Diary;
using BiteWise.BLL.Interfaces;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Interfaces;

namespace BiteWise.BLL.Services
{
    public class DiaryService : IDiaryService
    {
        private readonly IFoodEntryRepository _foodEntryRepository;
        private readonly IUserRepository _userRepository;
        private readonly AutoMapper.IMapper _mapper;
        private readonly IAchievementService _achievementService;

        public DiaryService(IFoodEntryRepository foodEntryRepository, IUserRepository userRepository, AutoMapper.IMapper mapper, IAchievementService achievementService)
        {
            _foodEntryRepository = foodEntryRepository;
            _userRepository = userRepository;
            _mapper = mapper;
            _achievementService = achievementService;
        }

        public async Task<FoodEntryResponseDto> AddEntryAsync(Guid userId, AddFoodEntryDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Користувача не знайдено.");
            }

            var entry = new FoodEntry
            {
                UserId = userId,
                FoodName = dto.FoodName,
                Calories = dto.Calories,
                Proteins = dto.Proteins,
                Fats = dto.Fats,
                Carbs = dto.Carbs,
                WeightGrams = dto.WeightGrams,
                MealType = dto.MealType,
                ConsumedAt = DateTime.UtcNow // Завжди зберігаємо в UTC
            };

            await _foodEntryRepository.AddAsync(entry);
            await _foodEntryRepository.SaveChangesAsync();

            // Перевіряємо та видаємо досягнення після додавання їжі
            await _achievementService.CheckAndAwardAchievementsAsync(userId);

            return _mapper.Map<FoodEntryResponseDto>(entry);
        }

        public async Task<DailySummaryDto> GetDailySummaryAsync(Guid userId, DateTime date)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Користувача не знайдено.");
            }

            var entries = await _foodEntryRepository.GetEntriesByDateAsync(userId, date);

            var summary = new DailySummaryDto
            {
                DailyCalorieGoal = user.DailyCalorieGoal,
                TotalCaloriesConsumed = entries.Sum(e => e.Calories),
                TotalProteins = entries.Sum(e => e.Proteins),
                TotalFats = entries.Sum(e => e.Fats),
                TotalCarbs = entries.Sum(e => e.Carbs),
                Entries = _mapper.Map<System.Collections.Generic.List<FoodEntryResponseDto>>(entries)
            };

            summary.RemainingCalories = summary.DailyCalorieGoal - summary.TotalCaloriesConsumed;

            return summary;
        }

        public async Task<WeeklyStatisticsDto> GetWeeklyStatisticsAsync(Guid userId, DateTime endDate)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Користувача не знайдено.");
            }

            // Ми беремо 7 днів включно з endDate
            var startDate = endDate.Date.AddDays(-6);
            
            var entries = await _foodEntryRepository.GetEntriesByDateRangeAsync(userId, startDate, endDate);
            
            var result = new WeeklyStatisticsDto
            {
                DailyCalorieGoal = user.DailyCalorieGoal
            };

            // Масив днів тижня українською
            string[] ukrainianDays = { "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" };

            // 1. Рахуємо калорії по кожному з 7 днів (навіть якщо вони порожні)
            for (int i = 0; i <= 6; i++)
            {
                var currentDate = startDate.AddDays(i);
                var dayEntries = entries.Where(e => e.ConsumedAt.Date == currentDate).ToList();
                
                result.DailyCalories.Add(new DailyCalorieStatDto
                {
                    Date = currentDate,
                    DayOfWeek = ukrainianDays[(int)currentDate.DayOfWeek],
                    Calories = dayEntries.Sum(e => e.Calories)
                });
            }

            // Середнє значення зазвичай рахують за всі 7 днів тижня, 
            // щоб бачити реальну середню кількість калорій на день.
            result.AverageCalories = (int)result.DailyCalories.Average(d => d.Calories);

            var activeDays = result.DailyCalories.Where(d => d.Calories > 0).ToList();

            if (activeDays.Any())
            {
                var maxDay = activeDays.OrderByDescending(d => d.Calories).First();
                result.MaxCalories = new StatRecordDto { Value = maxDay.Calories, DayOfWeek = maxDay.DayOfWeek };

                var minDay = activeDays.OrderBy(d => d.Calories).First();
                result.MinCalories = new StatRecordDto { Value = minDay.Calories, DayOfWeek = minDay.DayOfWeek };
            }
            else
            {
                result.AverageCalories = 0;
                result.MaxCalories = new StatRecordDto { Value = 0, DayOfWeek = "-" };
                result.MinCalories = new StatRecordDto { Value = 0, DayOfWeek = "-" };
            }

            // 3. Топ-5 страв
            var topFoods = entries
                .GroupBy(e => e.FoodName)
                .Select(g => new TopFoodDto
                {
                    FoodName = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(f => f.Count)
                .Take(5)
                .ToList();

            result.TopFoods = topFoods;

            return result;
        }

        public async Task RemoveEntryAsync(Guid userId, Guid entryId)
        {
            var entry = await _foodEntryRepository.GetByIdAsync(entryId);
            if (entry == null || entry.UserId != userId)
            {
                throw new Exception("Запис не знайдено або немає прав на видалення.");
            }

            await _foodEntryRepository.DeleteAsync(entry);
            await _foodEntryRepository.SaveChangesAsync();
        }
    }
}
