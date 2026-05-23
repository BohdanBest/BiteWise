using System;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Enums;

namespace BiteWise.DAL.Tests.Helpers
{
    public static class TestDataBuilder
    {
        public static User CreateUser(Guid? id = null, string name = "Test User", string email = "test@example.com")
        {
            return new User
            {
                Id = id ?? Guid.NewGuid(),
                Name = name,
                Email = email,
                PasswordHash = "hashed_password",
                Gender = Gender.Male, // Assuming this exists in your enums
                Age = 25,
                WeightKg = 70.5f,
                HeightCm = 175.0f,
                Goal = Goal.MaintainWeight, // Assuming this exists
                DailyCalorieGoal = 2000
            };
        }

        public static FoodEntry CreateFoodEntry(Guid userId, DateTime consumedAt, Guid? id = null, string name = "Apple")
        {
            return new FoodEntry
            {
                Id = id ?? Guid.NewGuid(),
                UserId = userId,
                FoodName = name,
                Calories = 95,
                Proteins = 0.5f,
                Fats = 0.3f,
                Carbs = 25.0f,
                WeightGrams = 180,
                MealType = MealType.Snack, // Assuming this exists
                ConsumedAt = consumedAt
            };
        }
    }
}
