using System;
using System.Threading.Tasks;
using BiteWise.API.Controllers;
using BiteWise.API.Tests.Helpers;
using BiteWise.BLL.DTOs.User;
using BiteWise.BLL.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BiteWise.API.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _mockUserService;
        private readonly UserController _sut;
        private readonly Guid _userId;

        public UserControllerTests()
        {
            _mockUserService = new Mock<IUserService>();
            _sut = new UserController(_mockUserService.Object);
            
            _userId = Guid.NewGuid();
            ControllerTestHelper.SetupControllerContext(_sut, _userId);
        }

        [Fact]
        public async Task GetProfile_ReturnsOk_WithProfileDto()
        {
            // Arrange
            var expectedProfile = new UserProfileDto { Name = "Test User" };
            _mockUserService.Setup(s => s.GetProfileAsync(_userId)).ReturnsAsync(expectedProfile);

            // Act
            var result = await _sut.GetProfile();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(expectedProfile);
        }

        [Fact]
        public async Task GetProfile_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            _mockUserService.Setup(s => s.GetProfileAsync(_userId)).ThrowsAsync(new Exception("Користувача не знайдено."));

            // Act
            var result = await _sut.GetProfile();

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.StatusCode.Should().Be(400);
        }

        [Fact]
        public async Task UpdateProfile_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _sut.ModelState.AddModelError("Name", "Name is required");
            var dto = new UpdateProfileDto();

            // Act
            var result = await _sut.UpdateProfile(dto);

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.StatusCode.Should().Be(400);
            _mockUserService.Verify(s => s.UpdateProfileAsync(It.IsAny<Guid>(), It.IsAny<UpdateProfileDto>()), Times.Never);
        }

        [Fact]
        public async Task UpdateProfile_ValidModel_ReturnsOk_WithUpdatedProfile()
        {
            // Arrange
            var dto = new UpdateProfileDto { Name = "Updated User" };
            var expectedProfile = new UserProfileDto { Name = "Updated User" };
            _mockUserService.Setup(s => s.UpdateProfileAsync(_userId, dto)).ReturnsAsync(expectedProfile);

            // Act
            var result = await _sut.UpdateProfile(dto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(expectedProfile);
            _mockUserService.Verify(s => s.UpdateProfileAsync(_userId, dto), Times.Once);
        }
    }
}
