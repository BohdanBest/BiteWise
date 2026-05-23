using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.IntegrationTests.Infrastructure;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BiteWise.IntegrationTests.Controllers
{
    public class AuthControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public AuthControllerIntegrationTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
            
            // Ініціалізуємо БД
            using var scope = factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<BiteWise.DAL.Context.ApplicationDbContext>();
            DatabaseSeeder.Seed(db);
        }

        [Fact]
        public async Task Register_ValidRequest_ReturnsOkWithToken()
        {
            // Arrange
            var dto = new RegisterDto
            {
                Name = "New User",
                Email = "newuser@test.com",
                Password = "Password123!",
                Age = 30,
                WeightKg = 80,
                HeightCm = 180,
                Gender = DAL.Enums.Gender.Male,
                Goal = DAL.Enums.Goal.MaintainWeight
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/register", dto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
            result.Should().NotBeNull();
            result!.Token.Should().NotBeNullOrEmpty();
            result.RefreshToken.Should().NotBeNullOrEmpty();
            result.Name.Should().Be("New User");
        }

        [Fact]
        public async Task Register_ExistingEmail_ReturnsBadRequest()
        {
            // Arrange - Email from Seeder
            var dto = new RegisterDto
            {
                Name = "Another User",
                Email = "integration@test.com",
                Password = "Password123!",
                Age = 30,
                WeightKg = 80,
                HeightCm = 180,
                Gender = DAL.Enums.Gender.Male,
                Goal = DAL.Enums.Goal.MaintainWeight
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/register", dto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            var content = await response.Content.ReadAsStringAsync();
            content.Should().Contain("Користувач з таким Email вже існує");
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOk()
        {
            // Arrange - User from Seeder
            var dto = new LoginDto
            {
                Email = "integration@test.com",
                Password = "TestPass123!"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/login", dto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
            result.Should().NotBeNull();
            result!.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task Login_InvalidPassword_ReturnsBadRequest()
        {
            // Arrange
            var dto = new LoginDto
            {
                Email = "integration@test.com",
                Password = "WrongPassword!"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/login", dto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
            var content = await response.Content.ReadAsStringAsync();
            content.Should().Contain("Невірний Email або пароль");
        }
    }
}
