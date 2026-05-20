using System.Security.Claims;
using BiteWise.DAL.Entities;

namespace BiteWise.BLL.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}
