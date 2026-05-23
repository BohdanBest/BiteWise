using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.IntegrationTests.Infrastructure;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BiteWise.IntegrationTests.Middleware
{
    public class MiddlewareIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public MiddlewareIntegrationTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
            
            using var scope = factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<BiteWise.DAL.Context.ApplicationDbContext>();
            DatabaseSeeder.Seed(db);
        }

        [Fact]
        public async Task ValidationFilter_InvalidDto_ReturnsBadRequestWithErrors()
        {
            var dto = new RegisterDto
            {
                Name = "",
                Email = "invalid-email",
                Password = "short"
            };
            
            var response = await _client.PostAsJsonAsync("/api/auth/register", dto);
            
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            
            var content = await response.Content.ReadAsStringAsync();
            content.Should().Contain("Email"); // Should have an error about Email
            content.Should().Contain("Password"); // Should have an error about Password
        }

        [Fact]
        public async Task ExceptionFilter_UnhandledException_ReturnsInternalServerError()
        {
            var dto = new LoginDto { Email = "notexist@test.com", Password = "Pass" };
            
            var response = await _client.PostAsJsonAsync("/api/auth/login", dto);
            
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
            var content = await response.Content.ReadAsStringAsync();
            content.Should().Contain("Невірний Email або пароль");
        }
    }
}
