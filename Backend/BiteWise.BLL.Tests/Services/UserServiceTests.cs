using System;
using System.Threading.Tasks;
using AutoMapper;
using BiteWise.BLL.DTOs.User;
using BiteWise.BLL.Services;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Enums;
using BiteWise.DAL.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace BiteWise.BLL.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _mockRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly UserService _sut;

        public UserServiceTests()
        {
            _mockRepo = new Mock<IUserRepository>();
            _mockMapper = new Mock<IMapper>();
            _sut = new UserService(_mockRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetProfileAsync_UserExists_ReturnsProfile()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Name = "Test User" };
            var expectedDto = new UserProfileDto { Name = "Test User" };

            _mockRepo.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);
            _mockMapper.Setup(m => m.Map<UserProfileDto>(user)).Returns(expectedDto);

            // Act
            var result = await _sut.GetProfileAsync(userId);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Test User");
            _mockRepo.Verify(r => r.GetByIdAsync(userId), Times.Once);
            _mockMapper.Verify(m => m.Map<UserProfileDto>(user), Times.Once);
        }

        [Fact]
        public async Task GetProfileAsync_UserDoesNotExist_ThrowsException()
        {
            // Arrange
            var userId = Guid.NewGuid();
            _mockRepo.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync((User?)null);

            // Act
            Func<Task> act = async () => await _sut.GetProfileAsync(userId);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Користувача не знайдено.");
            _mockMapper.Verify(m => m.Map<UserProfileDto>(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task UpdateProfileAsync_UserExists_RecalculatesCaloriesAndSaves()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Name = "Old Name",
                Gender = Gender.Male,
                Age = 20,
                WeightKg = 70,
                HeightCm = 175,
                Goal = Goal.MaintainWeight
            };

            var updateDto = new UpdateProfileDto
            {
                Name = "New Name",
                Age = 25, // changed
                WeightKg = 80, // changed
                HeightCm = 180, // changed
                Goal = Goal.GainWeight // changed
            };

            var expectedProfileDto = new UserProfileDto { Name = "New Name" };

            _mockRepo.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);
            _mockMapper.Setup(m => m.Map<UserProfileDto>(user)).Returns(expectedProfileDto);

            // Act
            var result = await _sut.UpdateProfileAsync(userId, updateDto);

            // Assert
            result.Should().NotBeNull();
            user.Name.Should().Be("New Name");
            user.Age.Should().Be(25);
            user.WeightKg.Should().Be(80);
            user.HeightCm.Should().Be(180);
            user.Goal.Should().Be(Goal.GainWeight);

            // Verify math logic
            // Male: 88.362 + (13.397 * 80) + (4.799 * 180) - (5.677 * 25) = 88.362 + 1071.76 + 863.82 - 141.925 = 1882.017
            // BMR * 1.2 = 2258.4204
            // Goal GainWeight (+400) = 2658.4204 -> Round -> 2658
            user.DailyCalorieGoal.Should().Be(2658);

            _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateProfileAsync_UserDoesNotExist_ThrowsException()
        {
            // Arrange
            var userId = Guid.NewGuid();
            _mockRepo.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync((User?)null);

            // Act
            Func<Task> act = async () => await _sut.UpdateProfileAsync(userId, new UpdateProfileDto());

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Користувача не знайдено.");
            _mockRepo.Verify(r => r.SaveChangesAsync(), Times.Never);
        }
    }
}
