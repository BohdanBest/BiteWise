using System;
using System.Threading.Tasks;
using AutoMapper;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.BLL.Interfaces;
using BiteWise.BLL.Services;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Enums;
using BiteWise.DAL.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace BiteWise.BLL.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IJwtTokenGenerator> _mockJwtGenerator;
        private readonly Mock<IMapper> _mockMapper;
        private readonly AuthService _sut;

        public AuthServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockJwtGenerator = new Mock<IJwtTokenGenerator>();
            _mockMapper = new Mock<IMapper>();

            _sut = new AuthService(_mockUserRepository.Object, _mockJwtGenerator.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task RegisterAsync_ExistingEmail_ThrowsException()
        {
            var dto = new RegisterDto { Email = "test@test.com" };
            _mockUserRepository.Setup(r => r.GetByEmailAsync(dto.Email)).ReturnsAsync(new User());

            await FluentActions.Invoking(() => _sut.RegisterAsync(dto))
                .Should().ThrowAsync<Exception>().WithMessage("Користувач з таким Email вже існує.");
        }

        [Fact]
        public async Task RegisterAsync_ValidDto_ReturnsAuthResponse()
        {
            var dto = new RegisterDto { Email = "new@test.com", Password = "Pass123", Gender = Gender.Male, WeightKg = 80, HeightCm = 180, Age = 25, Goal = Goal.LoseWeight };
            var user = new User { Id = Guid.NewGuid(), Name = "Test" };
            
            _mockUserRepository.Setup(r => r.GetByEmailAsync(dto.Email)).ReturnsAsync((User)null);
            _mockMapper.Setup(m => m.Map<User>(dto)).Returns(user);
            _mockJwtGenerator.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("access_token");
            _mockJwtGenerator.Setup(j => j.GenerateRefreshToken()).Returns("refresh_token");

            var result = await _sut.RegisterAsync(dto);

            result.Should().NotBeNull();
            result.Token.Should().Be("access_token");
            result.RefreshToken.Should().Be("refresh_token");
            _mockUserRepository.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
            _mockUserRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_InvalidEmail_ThrowsException()
        {
            var dto = new LoginDto { Email = "bad@test.com" };
            _mockUserRepository.Setup(r => r.GetByEmailAsync(dto.Email)).ReturnsAsync((User)null);

            await FluentActions.Invoking(() => _sut.LoginAsync(dto))
                .Should().ThrowAsync<Exception>().WithMessage("Невірний Email або пароль.");
        }

        [Fact]
        public async Task LoginAsync_InvalidPassword_ThrowsException()
        {
            var dto = new LoginDto { Email = "test@test.com", Password = "Wrong" };
            var user = new User { PasswordHash = BCrypt.Net.BCrypt.HashPassword("Correct") };
            _mockUserRepository.Setup(r => r.GetByEmailAsync(dto.Email)).ReturnsAsync(user);

            await FluentActions.Invoking(() => _sut.LoginAsync(dto))
                .Should().ThrowAsync<Exception>().WithMessage("Невірний Email або пароль.");
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
        {
            var dto = new LoginDto { Email = "test@test.com", Password = "Correct" };
            var user = new User { Id = Guid.NewGuid(), PasswordHash = BCrypt.Net.BCrypt.HashPassword("Correct") };
            
            _mockUserRepository.Setup(r => r.GetByEmailAsync(dto.Email)).ReturnsAsync(user);
            _mockJwtGenerator.Setup(j => j.GenerateToken(user)).Returns("access_token");
            _mockJwtGenerator.Setup(j => j.GenerateRefreshToken()).Returns("refresh_token");

            var result = await _sut.LoginAsync(dto);

            result.Should().NotBeNull();
            result.Token.Should().Be("access_token");
            _mockUserRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task RefreshTokenAsync_InvalidPrincipal_ThrowsException()
        {
            var dto = new TokenRequestDto { AccessToken = "bad", RefreshToken = "ref" };
            _mockJwtGenerator.Setup(j => j.GetPrincipalFromExpiredToken(dto.AccessToken)).Returns((System.Security.Claims.ClaimsPrincipal)null);

            await FluentActions.Invoking(() => _sut.RefreshTokenAsync(dto))
                .Should().ThrowAsync<Exception>().WithMessage("Invalid access token or refresh token");
        }
    }
}
