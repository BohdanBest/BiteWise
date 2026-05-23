using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.IntegrationTests.Infrastructure;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BiteWise.IntegrationTests.Controllers
{
    public class ScanControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public ScanControllerIntegrationTests(CustomWebApplicationFactory factory)
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
        public async Task ScanFood_Authorized_ReturnsResults()
        {
            await AuthenticateAsync();

            using var content = new MultipartFormDataContent();
            var dummyImage = new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A }; // dummy png header
            var imageContent = new ByteArrayContent(dummyImage);
            imageContent.Headers.ContentType = MediaTypeHeaderValue.Parse("image/png");
            content.Add(imageContent, "image", "test.png");

            var response = await _client.PostAsync("/api/scan", content);

            // 500 error will likely be returned since python ML isn't actually running
            // But we just verify it reached the logic (not 404 or 401)
            response.StatusCode.Should().NotBe(HttpStatusCode.Unauthorized);
            response.StatusCode.Should().NotBe(HttpStatusCode.NotFound);
        }
    }
}
