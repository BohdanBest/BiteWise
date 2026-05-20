using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BiteWise.DAL.Entities;

namespace BiteWise.DAL.Interfaces
{
    public interface IFoodEntryRepository
    {
        Task<IEnumerable<FoodEntry>> GetEntriesByDateAsync(Guid userId, DateTime date);
        Task<IEnumerable<FoodEntry>> GetEntriesByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
        Task AddAsync(FoodEntry entry);
        Task SaveChangesAsync();
    }
}
