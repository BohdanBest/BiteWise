using System;
using System.Linq;
using System.Threading.Tasks;
using BiteWise.DAL.Context;
using BiteWise.DAL.Repositories;
using BiteWise.DAL.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace BiteWise.DAL.Tests.Repositories
{
    public class FoodEntryRepositoryTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly FoodEntryRepository _sut;

        public FoodEntryRepositoryTests()
        {
            _context = DbContextFactory.Create();
            _sut = new FoodEntryRepository(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetEntriesByDateAsync_DateWithEntries_ReturnsEntries()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var targetDate = new DateTime(2023, 10, 10, 12, 0, 0); // 12 PM
            var entry1 = TestDataBuilder.CreateFoodEntry(userId, targetDate);
            var entry2 = TestDataBuilder.CreateFoodEntry(userId, targetDate.AddHours(2)); // Same day, 2 PM
            var otherUserEntry = TestDataBuilder.CreateFoodEntry(Guid.NewGuid(), targetDate); // Different user
            var otherDateEntry = TestDataBuilder.CreateFoodEntry(userId, targetDate.AddDays(1)); // Different date

            await _context.FoodEntries.AddRangeAsync(entry1, entry2, otherUserEntry, otherDateEntry);
            await _context.SaveChangesAsync();

            // Act
            var result = await _sut.GetEntriesByDateAsync(userId, targetDate);

            // Assert
            var resultList = result.ToList();
            resultList.Should().HaveCount(2);
            resultList.Should().Contain(e => e.Id == entry1.Id);
            resultList.Should().Contain(e => e.Id == entry2.Id);
            // Verify ordering by ConsumedAt
            resultList[0].ConsumedAt.Should().BeBefore(resultList[1].ConsumedAt);
        }

        [Fact]
        public async Task GetEntriesByDateAsync_DateWithoutEntries_ReturnsEmpty()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var targetDate = new DateTime(2023, 10, 10);
            var otherDateEntry = TestDataBuilder.CreateFoodEntry(userId, targetDate.AddDays(1));
            
            await _context.FoodEntries.AddAsync(otherDateEntry);
            await _context.SaveChangesAsync();

            // Act
            var result = await _sut.GetEntriesByDateAsync(userId, targetDate);

            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetEntriesByDateRangeAsync_RangeWithEntries_ReturnsEntries()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var startDate = new DateTime(2023, 10, 1);
            var endDate = new DateTime(2023, 10, 5);
            
            var entry1 = TestDataBuilder.CreateFoodEntry(userId, new DateTime(2023, 10, 2)); // Inside range
            var entry2 = TestDataBuilder.CreateFoodEntry(userId, new DateTime(2023, 10, 5, 23, 59, 59)); // Inside range (boundary)
            var entryBefore = TestDataBuilder.CreateFoodEntry(userId, new DateTime(2023, 9, 30)); // Outside
            var entryAfter = TestDataBuilder.CreateFoodEntry(userId, new DateTime(2023, 10, 6)); // Outside

            await _context.FoodEntries.AddRangeAsync(entry1, entry2, entryBefore, entryAfter);
            await _context.SaveChangesAsync();

            // Act
            var result = await _sut.GetEntriesByDateRangeAsync(userId, startDate, endDate);

            // Assert
            var resultList = result.ToList();
            resultList.Should().HaveCount(2);
            resultList.Should().Contain(e => e.Id == entry1.Id);
            resultList.Should().Contain(e => e.Id == entry2.Id);
        }

        [Fact]
        public async Task GetEntriesByDateRangeAsync_RangeWithoutEntries_ReturnsEmpty()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var startDate = new DateTime(2023, 10, 1);
            var endDate = new DateTime(2023, 10, 5);

            // Act
            var result = await _sut.GetEntriesByDateRangeAsync(userId, startDate, endDate);

            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task AddAsync_ValidEntry_SavesToDatabase()
        {
            // Arrange
            var entry = TestDataBuilder.CreateFoodEntry(Guid.NewGuid(), DateTime.UtcNow);

            // Act
            await _sut.AddAsync(entry);
            await _sut.SaveChangesAsync();

            // Assert
            _context.FoodEntries.Should().HaveCount(1);
            _context.FoodEntries.Should().Contain(e => e.Id == entry.Id);
        }
    }
}
