using System;
using System.IO;
using System.Threading.Tasks;
using BiteWise.API.Controllers;
using BiteWise.BLL.DTOs.Scan;
using BiteWise.BLL.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BiteWise.API.Tests.Controllers
{
    public class ScanControllerTests
    {
        private readonly Mock<IMLServiceClient> _mockMlService;
        private readonly Mock<INutritionService> _mockNutritionService;
        private readonly ScanController _sut;

        public ScanControllerTests()
        {
            _mockMlService = new Mock<IMLServiceClient>();
            _mockNutritionService = new Mock<INutritionService>();
            _sut = new ScanController(_mockMlService.Object, _mockNutritionService.Object);
        }

        [Fact]
        public async Task ScanFood_ImageNull_ReturnsBadRequest()
        {
            // Act
            var result = await _sut.ScanFood(null);

            // Assert
            var badResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badResult.StatusCode.Should().Be(400);
            _mockMlService.Verify(s => s.RecognizeImageAsync(It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task ScanFood_ImageEmpty_ReturnsBadRequest()
        {
            // Arrange
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.Length).Returns(0);

            // Act
            var result = await _sut.ScanFood(mockFile.Object);

            // Assert
            var badResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badResult.StatusCode.Should().Be(400);
        }

        [Fact]
        public async Task ScanFood_UnknownFood_ReturnsOkWithWarning()
        {
            // Arrange
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.Length).Returns(100);
            mockFile.Setup(f => f.OpenReadStream()).Returns(new MemoryStream());
            mockFile.Setup(f => f.FileName).Returns("test.jpg");
            mockFile.Setup(f => f.ContentType).Returns("image/jpeg");

            var mlResult = new MLRecognitionResult 
            { 
                ClassName = "unknown/not_food", 
                Confidence = 0.99f 
            };
            
            _mockMlService.Setup(s => s.RecognizeImageAsync(It.IsAny<Stream>(), "test.jpg", "image/jpeg"))
                          .ReturnsAsync(mlResult);

            // Act
            var result = await _sut.ScanFood(mockFile.Object);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            var scanDto = okResult.Value.Should().BeOfType<ScanResultDto>().Subject;
            scanDto.FoodName.Should().Be("Не розпізнано");
            
            _mockNutritionService.Verify(s => s.GetNutritionInfoAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task ScanFood_ValidFood_ReturnsOkWithNutrition()
        {
            // Arrange
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.Length).Returns(100);
            mockFile.Setup(f => f.OpenReadStream()).Returns(new MemoryStream());
            mockFile.Setup(f => f.FileName).Returns("apple.jpg");
            mockFile.Setup(f => f.ContentType).Returns("image/jpeg");

            var mlResult = new MLRecognitionResult 
            { 
                ClassName = "apple", 
                Confidence = 0.9f,
                EstimatedWeightGrams = 200
            };
            var nutritionInfo = new NutritionInfo 
            { 
                LocalizedName = "Яблуко", 
                CaloriesPer100g = 52,
                ProteinsPer100g = 0.3f,
                FatsPer100g = 0.2f,
                CarbsPer100g = 13.8f
            };
            
            _mockMlService.Setup(s => s.RecognizeImageAsync(It.IsAny<Stream>(), "apple.jpg", "image/jpeg"))
                          .ReturnsAsync(mlResult);
            _mockNutritionService.Setup(s => s.GetNutritionInfoAsync("apple"))
                                 .ReturnsAsync(nutritionInfo);

            // Act
            var result = await _sut.ScanFood(mockFile.Object);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            var scanDto = okResult.Value.Should().BeOfType<ScanResultDto>().Subject;
            scanDto.FoodName.Should().Be("Яблуко");
            scanDto.Calories.Should().Be(104); // 52 * 2
        }

        [Fact]
        public async Task ScanFood_ServiceThrowsException_Returns500()
        {
            // Arrange
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.Length).Returns(100);
            mockFile.Setup(f => f.OpenReadStream()).Throws(new Exception("Stream error"));

            // Act
            var result = await _sut.ScanFood(mockFile.Object);

            // Assert
            var statusCodeResult = result.Should().BeOfType<ObjectResult>().Subject;
            statusCodeResult.StatusCode.Should().Be(500);
        }
    }
}
