using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.BLL.DTOs.Diary;
using BiteWise.IntegrationTests.Infrastructure;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BiteWise.IntegrationTests.Controllers
{
    public class DiaryControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public DiaryControllerIntegrationTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
            
            using var scope = factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<BiteWise.DAL.Context.ApplicationDbContext>();
            DatabaseSeeder.Seed(db);
        }

        private async Task AuthenticateAsync()
        {
            var dto = new LoginDto
            {
                Email = "integration@test.com",
                Password = "TestPass123!"
            };
            var response = await _client.PostAsJsonAsync("/api/auth/login", dto);
            var result = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result!.Token);
        }

        [Fact]
        public async Task GetDailySummary_Unauthorized_Returns401()
        {
            var response = await _client.GetAsync($"/api/diary/summary/{DateTime.UtcNow:yyyy-MM-dd}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task GetDailySummary_Authorized_ReturnsOk()
        {
            // Arrange
            await AuthenticateAsync();

            // Act
            var response = await _client.GetAsync($"/api/diary/summary/{DateTime.UtcNow:yyyy-MM-dd}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<DailySummaryDto>();
            result.Should().NotBeNull();
            result!.DailyCalorieGoal.Should().Be(2000);
            result.Entries.Should().HaveCountGreaterThanOrEqualTo(1); // One from seeder
        }

        [Fact]
        public async Task AddEntry_Authorized_ReturnsOk()
        {
            // Arrange
            await AuthenticateAsync();
            var dto = new AddFoodEntryDto
            {
                FoodName = "Banana",
                Calories = 105,
                Proteins = 1.3f,
                Fats = 0.4f,
                Carbs = 27f,
                WeightGrams = 118,
                MealType = DAL.Enums.MealType.Breakfast
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/diary/add", dto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<FoodEntryResponseDto>();
            result.Should().NotBeNull();
            result!.FoodName.Should().Be("Banana");
            result.Id.Should().NotBeEmpty();
        }
    }
}
