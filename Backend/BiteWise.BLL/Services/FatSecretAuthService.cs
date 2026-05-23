using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Scan;
using BiteWise.BLL.Interfaces;

using System.Diagnostics.CodeAnalysis;

namespace BiteWise.BLL.Services
{
    [ExcludeFromCodeCoverage]
    public class FatSecretAuthService : IFatSecretAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly string _clientId;
        private readonly string _clientSecret;
        
        // Кешування токена в пам'яті
        private string? _cachedToken;
        private DateTime _tokenExpirationTime;

        public FatSecretAuthService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _clientId = Environment.GetEnvironmentVariable("FATSECRET_CLIENT_ID") 
                ?? throw new Exception("FATSECRET_CLIENT_ID not set in .env");
            _clientSecret = Environment.GetEnvironmentVariable("FATSECRET_CLIENT_SECRET")
                ?? throw new Exception("FATSECRET_CLIENT_SECRET not set in .env");
        }

        public async Task<string> GetAccessTokenAsync()
        {
            // Якщо токен ще дійсний (з запасом в 5 хвилин), повертаємо його з кешу
            if (!string.IsNullOrEmpty(_cachedToken) && DateTime.UtcNow < _tokenExpirationTime.AddMinutes(-5))
            {
                return _cachedToken;
            }

            var request = new HttpRequestMessage(HttpMethod.Post, "https://oauth.fatsecret.com/connect/token");

            // OAuth 2.0 Client Credentials Flow
            var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "grant_type", "client_credentials" },
                { "scope", "basic" }
            });

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Не вдалося отримати токен від FatSecret: {response.StatusCode} - {error}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var tokenData = JsonSerializer.Deserialize<FatSecretTokenResponse>(jsonResponse);

            if (tokenData == null || string.IsNullOrEmpty(tokenData.AccessToken))
            {
                throw new Exception("Невірний формат відповіді з токеном від FatSecret.");
            }

            _cachedToken = tokenData.AccessToken;
            // Зберігаємо час життя токена
            _tokenExpirationTime = DateTime.UtcNow.AddSeconds(tokenData.ExpiresIn);

            return _cachedToken;
        }
    }
}
