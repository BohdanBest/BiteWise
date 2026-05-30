using System;
using Microsoft.EntityFrameworkCore;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Enums;

namespace BiteWise.DAL.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<FoodEntry> FoodEntries { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<UserAchievement> UserAchievements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // За необхідності тут додаються конфігурації таблиць (Fluent API)
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
                
            modelBuilder.Entity<UserAchievement>()
                .HasIndex(ua => new { ua.UserId, ua.AchievementId })
                .IsUnique();

            // Seed Data для Досягнень
            modelBuilder.Entity<Achievement>().HasData(
                new Achievement
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Title = "Перший укус",
                    Description = "Додай свою першу страву в щоденник",
                    IconName = "Utensils",
                    CriteriaType = AchievementCriteria.FirstEntry,
                    RequiredValue = 1
                },
                new Achievement
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Title = "Стабільність",
                    Description = "Введи їжу 3 дні поспіль",
                    IconName = "Flame",
                    CriteriaType = AchievementCriteria.Streak3Days,
                    RequiredValue = 3
                },
                new Achievement
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Title = "Тиждень дисципліни",
                    Description = "Введи їжу 7 днів поспіль",
                    IconName = "Target",
                    CriteriaType = AchievementCriteria.Streak7Days,
                    RequiredValue = 7
                },
                new Achievement
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Title = "Майстер ШІ",
                    Description = "Відскануй страву за допомогою ШІ-камери",
                    IconName = "Camera",
                    CriteriaType = AchievementCriteria.AiScannerUsed,
                    RequiredValue = 1
                }
            );
        }
    }
}
