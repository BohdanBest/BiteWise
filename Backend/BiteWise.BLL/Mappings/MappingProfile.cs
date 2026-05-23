using AutoMapper;
using BiteWise.BLL.DTOs.Auth;
using BiteWise.BLL.DTOs.Diary;
using BiteWise.BLL.DTOs.User;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Enums;

namespace BiteWise.BLL.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User -> UserProfileDto
            CreateMap<User, UserProfileDto>()
                .ForMember(dest => dest.GoalName, opt => opt.MapFrom(src => MapGoalToName(src.Goal)))
                .ForMember(dest => dest.FormulaDetails, opt => opt.MapFrom(src => "ФОРМУЛА ХАРРІСА-БЕНЕДИКТА · КОЕФ. 1.2"));

            // RegisterDto -> User
            CreateMap<RegisterDto, User>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.DailyCalorieGoal, opt => opt.Ignore())
                .ForMember(dest => dest.RefreshToken, opt => opt.Ignore())
                .ForMember(dest => dest.RefreshTokenExpiryTime, opt => opt.Ignore());

            // FoodEntry -> FoodEntryResponseDto
            CreateMap<FoodEntry, FoodEntryResponseDto>();
        }

        private string MapGoalToName(Goal goal)
        {
            return goal switch
            {
                Goal.LoseWeight => "Схуднення",
                Goal.MaintainWeight => "Підтримка ваги",
                Goal.GainWeight => "Набір маси",
                _ => "Невідомо"
            };
        }
    }
}
