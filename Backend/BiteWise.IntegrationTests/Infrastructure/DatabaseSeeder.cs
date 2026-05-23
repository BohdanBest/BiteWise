using System;
using BiteWise.DAL.Context;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Enums;

namespace BiteWise.IntegrationTests.Infrastructure
{
    public static class DatabaseSeeder
    {
        public static Guid TestUserId = Guid.NewGuid();

        public static void Seed(ApplicationDbContext context)
        {
            // Очищаємо і наповнюємо — стан завжди передбачуваний
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // Створюємо тестового користувача
            var testUser = new User
            {
                Id = TestUserId,
                Name = "Test Integration User",
                Email = "integration@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("TestPass123!"),
                Age = 25,
                WeightKg = 70,
                HeightCm = 175,
                Gender = Gender.Male,
                Goal = Goal.MaintainWeight,
                DailyCalorieGoal = 2000,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(testUser);

            // Створюємо записи в щоденнику
            var entry1 = new FoodEntry
            {
                Id = Guid.NewGuid(),
                UserId = TestUserId,
                FoodName = "Test Apple",
                Calories = 52,
                Proteins = 0.3f,
                Fats = 0.2f,
                Carbs = 14f,
                WeightGrams = 100,
                MealType = MealType.Snack,
                ConsumedAt = DateTime.UtcNow
            };

            context.FoodEntries.Add(entry1);

            context.SaveChanges();
        }
    }
}
