using System.Threading.Tasks;
using BiteWise.BLL.DTOs.Auth;

namespace BiteWise.BLL.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto> RefreshTokenAsync(TokenRequestDto dto);
    }
}
