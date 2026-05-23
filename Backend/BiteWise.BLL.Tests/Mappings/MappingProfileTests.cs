using AutoMapper;
using BiteWise.BLL.DTOs.User;
using BiteWise.BLL.Mappings;
using BiteWise.DAL.Entities;
using BiteWise.DAL.Enums;
using FluentAssertions;
using Xunit;

namespace BiteWise.BLL.Tests.Mappings
{
    public class MappingProfileTests
    {
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _config;

        public MappingProfileTests()
        {
            _config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>(), Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);
            _mapper = _config.CreateMapper();
        }

        [Fact]
        public void MappingProfile_ConfigurationIsValid()
        {
            // Assert
            _config.AssertConfigurationIsValid();
        }

        [Fact]
        public void Map_UserToUserProfileDto_MapsCorrectly()
        {
            // Arrange
            var user = new User
            {
                Name = "Map Test",
                Email = "map@test.com",
                Age = 30,
                WeightKg = 80,
                HeightCm = 185,
                Goal = Goal.GainWeight,
                DailyCalorieGoal = 3000
            };

            // Act
            var result = _mapper.Map<UserProfileDto>(user);

            // Assert
            result.Name.Should().Be("Map Test");
            result.Email.Should().Be("map@test.com");
            result.Age.Should().Be(30);
            result.WeightKg.Should().Be(80);
            result.HeightCm.Should().Be(185);
            result.GoalName.Should().Be("Набір маси");
            result.DailyCalorieGoal.Should().Be(3000);
            result.FormulaDetails.Should().Be("ФОРМУЛА ХАРРІСА-БЕНЕДИКТА · КОЕФ. 1.2");
        }
    }
}
