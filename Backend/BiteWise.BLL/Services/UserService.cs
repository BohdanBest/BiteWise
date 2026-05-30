using System;
using System.Threading.Tasks;
using BiteWise.BLL.DTOs.User;
using BiteWise.BLL.Interfaces;
using BiteWise.DAL.Enums;
using BiteWise.DAL.Interfaces;

namespace BiteWise.BLL.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly AutoMapper.IMapper _mapper;

        public UserService(IUserRepository userRepository, AutoMapper.IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<UserProfileDto> GetProfileAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Користувача не знайдено.");
            }

            return _mapper.Map<UserProfileDto>(user);
        }
        public async Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Користувача не знайдено.");
            }

            // Оновлюємо базові поля
            user.Name = dto.Name;
            user.Age = dto.Age;
            user.WeightKg = dto.WeightKg;
            user.HeightCm = dto.HeightCm;
            user.Goal = dto.Goal;

            // Перераховуємо калорії заново (Формула Харріса-Бенедикта)
            double bmr = user.Gender == Gender.Male
                ? 88.362 + (13.397 * user.WeightKg) + (4.799 * user.HeightCm) - (5.677 * user.Age)
                : 447.593 + (9.247 * user.WeightKg) + (3.098 * user.HeightCm) - (4.330 * user.Age);

            double dailyCalories = bmr * 1.2;
            dailyCalories += user.Goal switch
            {
                Goal.LoseWeight => -500,
                Goal.GainWeight => 400,
                _ => 0
            };

            user.DailyCalorieGoal = (int)Math.Round(dailyCalories);

            // Зберігаємо зміни
            await _userRepository.SaveChangesAsync();

            // Повертаємо оновлений профіль
            return await GetProfileAsync(userId);
        }

        public async Task DeleteAccountAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Користувача не знайдено.");
            }

            await _userRepository.DeleteAsync(user);
            await _userRepository.SaveChangesAsync();
        }
    }
}
