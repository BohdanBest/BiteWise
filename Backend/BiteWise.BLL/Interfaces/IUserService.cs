using System;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.User;

namespace BiteWise.BLL.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto> GetProfileAsync(Guid userId);
        Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
    }
}
