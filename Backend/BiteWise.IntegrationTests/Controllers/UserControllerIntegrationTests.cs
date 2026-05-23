using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.BLL.DTOs.User;
using BiteWise.IntegrationTests.Infrastructure;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BiteWise.IntegrationTests.Controllers
{
    public class UserControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public UserControllerIntegrationTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
            
            using var scope = factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<BiteWise.DAL.Context.ApplicationDbContext>();
            DatabaseSeeder.Seed(db);
        }

        private async Task AuthenticateAsync()
        {
            var dto = new LoginDto { Email = "integration@test.com", Password = "TestPass123!" };
            var response = await _client.PostAsJsonAsync("/api/auth/login", dto);
            var result = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result!.Token);
        }

        [Fact]
        public async Task GetProfile_Authorized_ReturnsProfile()
        {
            await AuthenticateAsync();

            var response = await _client.GetAsync("/api/user/me");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var profile = await response.Content.ReadFromJsonAsync<UserProfileDto>();
            profile.Should().NotBeNull();
            profile!.Email.Should().Be("integration@test.com");
            profile.Name.Should().Be("Test Integration User");
        }

        [Fact]
        public async Task UpdateProfile_Authorized_UpdatesAndReturnsNewProfile()
        {
            await AuthenticateAsync();
            var updateDto = new UpdateProfileDto
            {
                Name = "Updated Name",
                Age = 26,
                WeightKg = 75,
                HeightCm = 175,
                Goal = DAL.Enums.Goal.LoseWeight
            };

            var response = await _client.PutAsJsonAsync("/api/user/me", updateDto);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var profile = await response.Content.ReadFromJsonAsync<UserProfileDto>();
            profile.Should().NotBeNull();
            profile!.Name.Should().Be("Updated Name");
            profile.WeightKg.Should().Be(75);
        }
    }
}
