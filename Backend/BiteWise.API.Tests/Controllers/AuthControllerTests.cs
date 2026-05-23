using System;
using System.Threading.Tasks;
using BiteWise.API.Controllers;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.BLL.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BiteWise.API.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly AuthController _sut;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _sut = new AuthController(_mockAuthService.Object);
        }

        [Fact]
        public async Task Register_ValidDto_ReturnsOk()
        {
            // Arrange
            var dto = new RegisterDto();
            var expectedResponse = new AuthResponseDto();
            _mockAuthService.Setup(s => s.RegisterAsync(dto)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _sut.Register(dto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async Task Register_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _sut.ModelState.AddModelError("Email", "Email is required");
            var dto = new RegisterDto();

            // Act
            var result = await _sut.Register(dto);

            // Assert
            var badResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badResult.StatusCode.Should().Be(400);
            _mockAuthService.Verify(s => s.RegisterAsync(It.IsAny<RegisterDto>()), Times.Never);
        }

        [Fact]
        public async Task Register_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var dto = new RegisterDto();
            _mockAuthService.Setup(s => s.RegisterAsync(dto)).ThrowsAsync(new Exception("Email exists"));

            // Act
            var result = await _sut.Register(dto);

            // Assert
            var badResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badResult.StatusCode.Should().Be(400);
        }

        [Fact]
        public async Task Login_ValidDto_ReturnsOk()
        {
            // Arrange
            var dto = new LoginDto();
            var expectedResponse = new AuthResponseDto();
            _mockAuthService.Setup(s => s.LoginAsync(dto)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _sut.Login(dto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async Task Login_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _sut.ModelState.AddModelError("Email", "Required");
            var dto = new LoginDto();

            // Act
            var result = await _sut.Login(dto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            _mockAuthService.Verify(s => s.LoginAsync(It.IsAny<LoginDto>()), Times.Never);
        }

        [Fact]
        public async Task Login_ServiceThrowsException_ReturnsUnauthorized()
        {
            // Arrange
            var dto = new LoginDto();
            _mockAuthService.Setup(s => s.LoginAsync(dto)).ThrowsAsync(new Exception("Wrong password"));

            // Act
            var result = await _sut.Login(dto);

            // Assert
            var unauthResult = result.Should().BeOfType<UnauthorizedObjectResult>().Subject;
            unauthResult.StatusCode.Should().Be(401);
        }

        [Fact]
        public async Task RefreshToken_ValidDto_ReturnsOk()
        {
            // Arrange
            var dto = new TokenRequestDto();
            var expectedResponse = new AuthResponseDto();
            _mockAuthService.Setup(s => s.RefreshTokenAsync(dto)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _sut.RefreshToken(dto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
            okResult.Value.Should().BeEquivalentTo(expectedResponse);
        }

        [Fact]
        public async Task RefreshToken_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _sut.ModelState.AddModelError("Token", "Required");
            var dto = new TokenRequestDto();

            // Act
            var result = await _sut.RefreshToken(dto);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
            _mockAuthService.Verify(s => s.RefreshTokenAsync(It.IsAny<TokenRequestDto>()), Times.Never);
        }

        [Fact]
        public async Task RefreshToken_ServiceThrowsException_ReturnsUnauthorized()
        {
            // Arrange
            var dto = new TokenRequestDto();
            _mockAuthService.Setup(s => s.RefreshTokenAsync(dto)).ThrowsAsync(new Exception("Invalid token"));

            // Act
            var result = await _sut.RefreshToken(dto);

            // Assert
            var unauthResult = result.Should().BeOfType<UnauthorizedObjectResult>().Subject;
            unauthResult.StatusCode.Should().Be(401);
        }
    }
}
