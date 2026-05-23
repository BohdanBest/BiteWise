using System;
using System.Threading.Tasks;
using System.Security.Claims;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.BLL.Interfaces;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Interfaces;
using BiteWise.DAL.Enums;
using BCrypt.Net;

namespace BiteWise.BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly AutoMapper.IMapper _mapper;

        public AuthService(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator, AutoMapper.IMapper mapper)
        {
            _userRepository = userRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
            _mapper = mapper;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                throw new Exception("Користувач з таким Email вже існує.");
            }

            double bmr = dto.Gender == Gender.Male
                ? 88.362 + (13.397 * dto.WeightKg) + (4.799 * dto.HeightCm) - (5.677 * dto.Age)
                : 447.593 + (9.247 * dto.WeightKg) + (3.098 * dto.HeightCm) - (4.330 * dto.Age);

            double dailyCalories = bmr * 1.2;
            dailyCalories += dto.Goal switch
            {
                Goal.LoseWeight => -500,
                Goal.GainWeight => 400,
                _ => 0
            };

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            string refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            var user = _mapper.Map<User>(dto);
            user.PasswordHash = passwordHash;
            user.DailyCalorieGoal = (int)Math.Round(dailyCalories);
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                Name = user.Name,
                DailyCalorieGoal = user.DailyCalorieGoal
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new Exception("Невірний Email або пароль.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                throw new Exception("Невірний Email або пароль.");
            }

            var token = _jwtTokenGenerator.GenerateToken(user);
            var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userRepository.SaveChangesAsync();

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                Name = user.Name,
                DailyCalorieGoal = user.DailyCalorieGoal
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(TokenRequestDto dto)
        {
            var principal = _jwtTokenGenerator.GetPrincipalFromExpiredToken(dto.AccessToken);
            if (principal == null)
            {
                throw new Exception("Invalid access token or refresh token");
            }

            // Дістаємо ID або Email з токена
            var emailClaim = principal.FindFirst(ClaimTypes.Email) 
                             ?? principal.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email);

            if (emailClaim == null)
            {
                throw new Exception("Invalid access token claims");
            }

            var user = await _userRepository.GetByEmailAsync(emailClaim.Value);

            if (user == null || user.RefreshToken != dto.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new Exception("Invalid access token or refresh token");
            }

            var newAccessToken = _jwtTokenGenerator.GenerateToken(user);
            var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            // Подовжуємо час дії refresh токена ще на 7 днів
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userRepository.SaveChangesAsync();

            return new AuthResponseDto
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
                Name = user.Name,
                DailyCalorieGoal = user.DailyCalorieGoal
            };
        }
    }
}
