using System;
using System.Threading.Tasks;
using BiteWise.API.Controllers;
using BiteWise.API.Tests.Helpers;
using BiteWise.BLL.DTOs.Diary;
using BiteWise.BLL.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BiteWise.API.Tests.Controllers
{
    public class DiaryControllerTests
    {
        private readonly Mock<IDiaryService> _mockDiaryService;
        private readonly DiaryController _sut;
        private readonly Guid _userId;

        public DiaryControllerTests()
        {
            _mockDiaryService = new Mock<IDiaryService>();
            _sut = new DiaryController(_mockDiaryService.Object);
            
            _userId = Guid.NewGuid();
            ControllerTestHelper.SetupControllerContext(_sut, _userId);
        }

        [Fact]
        public async Task AddFoodEntry_ValidData_ReturnsOk_WithResponseDto()
        {
            // Arrange
            var dto = new AddFoodEntryDto { FoodName = "Apple", Calories = 50, WeightGrams = 100 };
            var expectedResponse = new FoodEntryResponseDto { Id = Guid.NewGuid(), FoodName = "Apple" };
            
            _mockDiaryService.Setup(s => s.AddEntryAsync(_userId, dto)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _sut.AddFoodEntry(dto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(expectedResponse);
            _mockDiaryService.Verify(s => s.AddEntryAsync(_userId, dto), Times.Once);
        }

        [Fact]
        public async Task AddFoodEntry_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _sut.ModelState.AddModelError("Calories", "Must be greater than 0");
            var dto = new AddFoodEntryDto();

            // Act
            var result = await _sut.AddFoodEntry(dto);

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.StatusCode.Should().Be(400);
            _mockDiaryService.Verify(s => s.AddEntryAsync(It.IsAny<Guid>(), It.IsAny<AddFoodEntryDto>()), Times.Never);
        }

        [Fact]
        public async Task GetDailySummary_ReturnsOk_WithSummaryDto()
        {
            // Arrange
            var date = DateTime.UtcNow.Date;
            var expectedSummary = new DailySummaryDto();
            _mockDiaryService.Setup(s => s.GetDailySummaryAsync(_userId, date)).ReturnsAsync(expectedSummary);

            // Act
            var result = await _sut.GetDailySummary(date.ToString("yyyy-MM-dd"));

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(expectedSummary);
        }

        [Fact]
        public async Task GetDailySummary_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var date = DateTime.UtcNow.Date;
            _mockDiaryService.Setup(s => s.GetDailySummaryAsync(_userId, date)).ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _sut.GetDailySummary(date.ToString("yyyy-MM-dd"));

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.StatusCode.Should().Be(400);
        }
        [Fact]
        public async Task GetWeeklyStatistics_ReturnsOk_WithStatsDto()
        {
            // Arrange
            var date = DateTime.UtcNow.Date;
            var expectedStats = new WeeklyStatisticsDto();
            _mockDiaryService.Setup(s => s.GetWeeklyStatisticsAsync(_userId, date)).ReturnsAsync(expectedStats);

            // Act
            var result = await _sut.GetWeeklyStatistics(date.ToString("yyyy-MM-dd"));

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(expectedStats);
        }

        [Fact]
        public async Task GetWeeklyStatistics_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var date = DateTime.UtcNow.Date;
            _mockDiaryService.Setup(s => s.GetWeeklyStatisticsAsync(_userId, date)).ThrowsAsync(new Exception("Error"));

            // Act
            var result = await _sut.GetWeeklyStatistics(date.ToString("yyyy-MM-dd"));

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.StatusCode.Should().Be(400);
        }
    }
}
