using System;
using System.Threading.Tasks;
using BiteWise.DAL.Context;
using BiteWise.DAL.Repositories;
using BiteWise.DAL.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace BiteWise.DAL.Tests.Repositories
{
    public class UserRepositoryTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly UserRepository _sut;

        public UserRepositoryTests()
        {
            _context = DbContextFactory.Create();
            _sut = new UserRepository(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetByIdAsync_ExistingId_ReturnsUser()
        {
            // Arrange
            var user = TestDataBuilder.CreateUser();
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _sut.GetByIdAsync(user.Id);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(user.Id);
        }

        [Fact]
        public async Task GetByIdAsync_NonExistingId_ReturnsNull()
        {
            // Act
            var result = await _sut.GetByIdAsync(Guid.NewGuid());

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetByEmailAsync_ExistingEmail_ReturnsUser()
        {
            // Arrange
            var user = TestDataBuilder.CreateUser(email: "unique@test.com");
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _sut.GetByEmailAsync("unique@test.com");

            // Assert
            result.Should().NotBeNull();
            result!.Email.Should().Be("unique@test.com");
        }

        [Fact]
        public async Task GetByEmailAsync_NonExistingEmail_ReturnsNull()
        {
            // Act
            var result = await _sut.GetByEmailAsync("nonexistent@test.com");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetByNameAsync_ExistingName_ReturnsUser()
        {
            // Arrange
            var user = TestDataBuilder.CreateUser(name: "UniqueName");
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _sut.GetByNameAsync("UniqueName");

            // Assert
            result.Should().NotBeNull();
            result!.Name.Should().Be("UniqueName");
        }

        [Fact]
        public async Task GetByNameAsync_NonExistingName_ReturnsNull()
        {
            // Act
            var result = await _sut.GetByNameAsync("NonExistentName");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task AddAsync_ValidUser_SavesToDatabase()
        {
            // Arrange
            var user = TestDataBuilder.CreateUser();

            // Act
            await _sut.AddAsync(user);
            await _sut.SaveChangesAsync();

            // Assert
            _context.Users.Should().HaveCount(1);
            _context.Users.Should().Contain(u => u.Id == user.Id);
        }
    }
}
