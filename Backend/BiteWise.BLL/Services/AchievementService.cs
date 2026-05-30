using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BiteWise.BLL.Interfaces;
using BiteWise.BLL.DTOs;
using BiteWise.DAL.Context;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Enums;

namespace BiteWise.BLL.Services
{
    public class AchievementService : IAchievementService
    {
        private readonly ApplicationDbContext _context;

        public AchievementService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AchievementDto>> GetMyAchievementsAsync(Guid userId)
        {
            var achievements = await _context.Achievements.ToListAsync();
            var userAchievements = await _context.UserAchievements
                .Where(ua => ua.UserId == userId)
                .ToDictionaryAsync(ua => ua.AchievementId, ua => ua.EarnedAt);

            var dtos = achievements.Select(a => new AchievementDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                IconName = a.IconName,
                IsEarned = userAchievements.ContainsKey(a.Id),
                EarnedAt = userAchievements.ContainsKey(a.Id) ? userAchievements[a.Id] : null
            }).OrderByDescending(a => a.IsEarned).ThenBy(a => a.Title).ToList();

            return dtos;
        }

        public async Task CheckAndAwardAchievementsAsync(Guid userId)
        {
            var earnedAchievementIds = await _context.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Select(ua => ua.AchievementId)
                .ToListAsync();

            var unearnedAchievements = await _context.Achievements
                .Where(a => !earnedAchievementIds.Contains(a.Id))
                .ToListAsync();

            if (!unearnedAchievements.Any()) return; // Всі отримані

            var userEntries = await _context.FoodEntries
                .Where(f => f.UserId == userId)
                .OrderBy(f => f.ConsumedAt)
                .ToListAsync();

            var newEarned = new List<UserAchievement>();

            foreach (var achievement in unearnedAchievements)
            {
                bool awarded = false;

                switch (achievement.CriteriaType)
                {
                    case AchievementCriteria.FirstEntry:
                        if (userEntries.Any()) awarded = true;
                        break;
                    case AchievementCriteria.Streak3Days:
                        if (HasStreak(userEntries, 3)) awarded = true;
                        break;
                    case AchievementCriteria.Streak7Days:
                        if (HasStreak(userEntries, 7)) awarded = true;
                        break;
                    case AchievementCriteria.AiScannerUsed:
                        // Для курсової можемо симулювати, що якщо калорій більше 0, то використовував (або додати поле)
                        // Поки що спростимо: просто якщо є їжа, вважаємо, що пробував сканер, або можемо перевірити, чи це не дефолтна назва
                        if (userEntries.Any()) awarded = true; // Заглушка, оскільки ми не зберігаємо джерело введення (руками чи ШІ)
                        break;
                }

                if (awarded)
                {
                    newEarned.Add(new UserAchievement
                    {
                        UserId = userId,
                        AchievementId = achievement.Id,
                        EarnedAt = DateTime.UtcNow
                    });
                }
            }

            if (newEarned.Any())
            {
                _context.UserAchievements.AddRange(newEarned);
                await _context.SaveChangesAsync();
            }
        }

        private bool HasStreak(List<FoodEntry> entries, int requiredDays)
        {
            if (entries.Count == 0) return false;

            var dates = entries.Select(e => e.ConsumedAt.Date).Distinct().OrderByDescending(d => d).ToList();
            if (dates.Count < requiredDays) return false;

            int streak = 1;
            for (int i = 0; i < dates.Count - 1; i++)
            {
                if ((dates[i] - dates[i + 1]).TotalDays == 1)
                {
                    streak++;
                    if (streak >= requiredDays) return true;
                }
                else
                {
                    streak = 1;
                }
            }

            return false;
        }
    }
}
