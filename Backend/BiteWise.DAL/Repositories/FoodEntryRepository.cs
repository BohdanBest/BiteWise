using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BiteWise.DAL.Context;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Interfaces;

namespace BiteWise.DAL.Repositories
{
    public class FoodEntryRepository : IFoodEntryRepository
    {
        private readonly ApplicationDbContext _context;

        public FoodEntryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FoodEntry>> GetEntriesByDateAsync(Guid userId, DateTime date)
        {
            // Отримуємо записи лише за обраний день
            return await _context.FoodEntries
                .Where(e => e.UserId == userId && e.ConsumedAt.Date == date.Date)
                .OrderBy(e => e.ConsumedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<FoodEntry>> GetEntriesByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
        {
            return await _context.FoodEntries
                .Where(e => e.UserId == userId && e.ConsumedAt.Date >= startDate.Date && e.ConsumedAt.Date <= endDate.Date)
                .OrderBy(e => e.ConsumedAt)
                .ToListAsync();
        }

        public async Task AddAsync(FoodEntry entry)
        {
            await _context.FoodEntries.AddAsync(entry);
        }

        public async Task<FoodEntry> GetByIdAsync(Guid id)
        {
            return await _context.FoodEntries.FindAsync(id);
        }

        public Task DeleteAsync(FoodEntry entry)
        {
            _context.FoodEntries.Remove(entry);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
