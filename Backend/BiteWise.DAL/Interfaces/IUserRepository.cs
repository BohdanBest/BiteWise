using System;
using System.Threading.Tasks;
using BiteWise.DAL.Entities;

namespace BiteWise.DAL.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByNameAsync(string name);
        Task AddAsync(User user);
        Task SaveChangesAsync();
    }
}
