using BiteWise.BLL.DTOs.User;
using BiteWise.BLL.Validators;
using BiteWise.DAL.Enums;
using FluentValidation.TestHelper;
using Xunit;

namespace BiteWise.BLL.Tests.Validators
{
    public class UpdateProfileDtoValidatorTests
    {
        private readonly UpdateProfileDtoValidator _validator = new();

        [Fact]
        public void Validate_ValidDto_PassesWithNoErrors()
        {
            // Arrange
            var dto = new UpdateProfileDto
            {
                Name = "John Doe",
                Age = 25,
                WeightKg = 75.5f,
                HeightCm = 180,
                Goal = Goal.MaintainWeight
            };

            // Act
            var result = _validator.TestValidate(dto);

            // Assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void Validate_EmptyName_HasValidationError(string? name)
        {
            // Arrange
            var dto = new UpdateProfileDto { Name = name!, Age = 25, WeightKg = 75, HeightCm = 180, Goal = Goal.LoseWeight };

            // Act
            var result = _validator.TestValidate(dto);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Name);
        }

        [Fact]
        public void Validate_NameTooLong_HasValidationError()
        {
            // Arrange
            var dto = new UpdateProfileDto 
            { 
                Name = new string('A', 101), 
                Age = 25, 
                WeightKg = 75, 
                HeightCm = 180, 
                Goal = Goal.LoseWeight 
            };

            // Act
            var result = _validator.TestValidate(dto);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Name);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(121)]
        public void Validate_AgeOutOfRange_HasValidationError(int age)
        {
            // Arrange
            var dto = new UpdateProfileDto { Name = "Valid", Age = age, WeightKg = 75, HeightCm = 180, Goal = Goal.LoseWeight };

            // Act
            var result = _validator.TestValidate(dto);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Age);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(301)]
        public void Validate_WeightOutOfRange_HasValidationError(float weight)
        {
            // Arrange
            var dto = new UpdateProfileDto { Name = "Valid", Age = 25, WeightKg = weight, HeightCm = 180, Goal = Goal.LoseWeight };

            // Act
            var result = _validator.TestValidate(dto);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.WeightKg);
        }

        [Theory]
        [InlineData(49)]
        [InlineData(251)]
        public void Validate_HeightOutOfRange_HasValidationError(float height)
        {
            // Arrange
            var dto = new UpdateProfileDto { Name = "Valid", Age = 25, WeightKg = 75, HeightCm = height, Goal = Goal.LoseWeight };

            // Act
            var result = _validator.TestValidate(dto);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.HeightCm);
        }

        [Fact]
        public void Validate_InvalidGoal_HasValidationError()
        {
            // Arrange
            var dto = new UpdateProfileDto { Name = "Valid", Age = 25, WeightKg = 75, HeightCm = 180, Goal = (Goal)999 };

            // Act
            var result = _validator.TestValidate(dto);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Goal);
        }
    }
}
