using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using BiteWise.BLL.DTOs.Diary;
using BiteWise.BLL.Interfaces;
using BiteWise.BLL.Services;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace BiteWise.BLL.Tests.Services
{
    public class DiaryServiceTests
    {
        private readonly Mock<IFoodEntryRepository> _mockEntryRepo;
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IAchievementService> _mockAchievementService;
        private readonly DiaryService _sut;
        private readonly Guid _userId;

        public DiaryServiceTests()
        {
            _mockEntryRepo = new Mock<IFoodEntryRepository>();
            _mockUserRepo = new Mock<IUserRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockAchievementService = new Mock<IAchievementService>();

            _sut = new DiaryService(_mockEntryRepo.Object, _mockUserRepo.Object, _mockMapper.Object, _mockAchievementService.Object);
            _userId = Guid.NewGuid();
        }

        [Fact]
        public async Task AddEntryAsync_UserNotFound_ThrowsException()
        {
            var dto = new AddFoodEntryDto();
            _mockUserRepo.Setup(r => r.GetByIdAsync(_userId)).ReturnsAsync((User)null);

            await FluentActions.Invoking(() => _sut.AddEntryAsync(_userId, dto))
                .Should().ThrowAsync<Exception>().WithMessage("Користувача не знайдено.");
        }

        [Fact]
        public async Task AddEntryAsync_ValidData_ReturnsDto()
        {
            var dto = new AddFoodEntryDto { FoodName = "Apple", Calories = 50 };
            var user = new User { Id = _userId };
            var expectedDto = new FoodEntryResponseDto { FoodName = "Apple" };

            _mockUserRepo.Setup(r => r.GetByIdAsync(_userId)).ReturnsAsync(user);
            _mockMapper.Setup(m => m.Map<FoodEntryResponseDto>(It.IsAny<FoodEntry>())).Returns(expectedDto);

            var result = await _sut.AddEntryAsync(_userId, dto);

            result.Should().BeEquivalentTo(expectedDto);
            _mockEntryRepo.Verify(r => r.AddAsync(It.IsAny<FoodEntry>()), Times.Once);
            _mockEntryRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetDailySummaryAsync_UserNotFound_ThrowsException()
        {
            _mockUserRepo.Setup(r => r.GetByIdAsync(_userId)).ReturnsAsync((User)null);

            await FluentActions.Invoking(() => _sut.GetDailySummaryAsync(_userId, DateTime.UtcNow))
                .Should().ThrowAsync<Exception>().WithMessage("Користувача не знайдено.");
        }

        [Fact]
        public async Task GetDailySummaryAsync_ValidData_ReturnsSummary()
        {
            var user = new User { Id = _userId, DailyCalorieGoal = 2000 };
            var date = DateTime.UtcNow;
            var entries = new List<FoodEntry>
            {
                new FoodEntry { Calories = 500, Proteins = 50 },
                new FoodEntry { Calories = 300, Proteins = 30 }
            };
            
            _mockUserRepo.Setup(r => r.GetByIdAsync(_userId)).ReturnsAsync(user);
            _mockEntryRepo.Setup(r => r.GetEntriesByDateAsync(_userId, date)).ReturnsAsync(entries);
            _mockMapper.Setup(m => m.Map<List<FoodEntryResponseDto>>(entries)).Returns(new List<FoodEntryResponseDto>());

            var result = await _sut.GetDailySummaryAsync(_userId, date);

            result.Should().NotBeNull();
            result.DailyCalorieGoal.Should().Be(2000);
            result.TotalCaloriesConsumed.Should().Be(800);
            result.RemainingCalories.Should().Be(1200);
            result.TotalProteins.Should().Be(80);
        }

        [Fact]
        public async Task GetWeeklyStatisticsAsync_UserNotFound_ThrowsException()
        {
            _mockUserRepo.Setup(r => r.GetByIdAsync(_userId)).ReturnsAsync((User)null);

            await FluentActions.Invoking(() => _sut.GetWeeklyStatisticsAsync(_userId, DateTime.UtcNow))
                .Should().ThrowAsync<Exception>().WithMessage("Користувача не знайдено.");
        }

        [Fact]
        public async Task GetWeeklyStatisticsAsync_ValidData_ReturnsStats()
        {
            var user = new User { Id = _userId, DailyCalorieGoal = 2000 };
            var endDate = DateTime.UtcNow;
            var entries = new List<FoodEntry>
            {
                new FoodEntry { Calories = 500, ConsumedAt = endDate, FoodName = "Apple" }
            };

            _mockUserRepo.Setup(r => r.GetByIdAsync(_userId)).ReturnsAsync(user);
            _mockEntryRepo.Setup(r => r.GetEntriesByDateRangeAsync(_userId, It.IsAny<DateTime>(), endDate)).ReturnsAsync(entries);

            var result = await _sut.GetWeeklyStatisticsAsync(_userId, endDate);

            result.Should().NotBeNull();
            result.DailyCalorieGoal.Should().Be(2000);
            result.DailyCalories.Should().HaveCount(7);
            result.TopFoods.Should().NotBeEmpty();
        }
    }
}
