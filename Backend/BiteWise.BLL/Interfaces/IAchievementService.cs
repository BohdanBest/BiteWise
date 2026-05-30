using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs;

namespace BiteWise.BLL.Interfaces
{
    public interface IAchievementService
    {
        Task<IEnumerable<AchievementDto>> GetMyAchievementsAsync(Guid userId);
        Task CheckAndAwardAchievementsAsync(Guid userId);
    }
}
