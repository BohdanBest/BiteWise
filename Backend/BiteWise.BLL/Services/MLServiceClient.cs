using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using BiteWise.BLL.DTOs.Scan;
using BiteWise.BLL.Interfaces;

namespace BiteWise.BLL.Services
{
    public class MLServiceClient : IMLServiceClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public MLServiceClient(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _baseUrl = configuration["MLService:BaseUrl"] ?? "http://localhost:8000";
        }

        public async Task<MLRecognitionResult> RecognizeImageAsync(Stream imageStream, string fileName, string contentType)
        {
            using var content = new MultipartFormDataContent();
            
            var fileContent = new StreamContent(imageStream);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
            
            content.Add(fileContent, "file", fileName);

            // Відправляємо POST запит на Python ML сервіс
            var response = await _httpClient.PostAsync($"{_baseUrl}/api/v1/recognize", content);

            if (!response.IsSuccessStatusCode)
            {
                var errorMsg = await response.Content.ReadAsStringAsync();
                throw new Exception($"Помилка ML сервісу: {response.StatusCode} - {errorMsg}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<MLRecognitionResult>(jsonResponse);

            if (result == null)
            {
                throw new Exception("Не вдалося розпарсити відповідь від ML сервісу.");
            }

            return result;
        }
    }
}
