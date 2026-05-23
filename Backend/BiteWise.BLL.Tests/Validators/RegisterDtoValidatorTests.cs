using BiteWise.BLL.DTOs.Auth;
using BiteWise.BLL.Validators;
using FluentValidation.TestHelper;
using Xunit;

namespace BiteWise.BLL.Tests.Validators
{
    public class RegisterDtoValidatorTests
    {
        private readonly RegisterDtoValidator _validator;

        public RegisterDtoValidatorTests()
        {
            _validator = new RegisterDtoValidator();
        }

        [Fact]
        public void ValidDto_ShouldNotHaveValidationErrors()
        {
            var dto = new RegisterDto 
            { 
                Name = "John Doe",
                Email = "john@example.com", 
                Password = "Password123!",
                Age = 25,
                WeightKg = 80,
                HeightCm = 180
            };
            var result = _validator.TestValidate(dto);
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Fact]
        public void EmptyName_ShouldHaveValidationError()
        {
            var dto = new RegisterDto { Name = "", Email = "john@example.com", Password = "Password123!" };
            var result = _validator.TestValidate(dto);
            result.ShouldHaveValidationErrorFor(x => x.Name);
        }

        [Theory]
        [InlineData("")]
        [InlineData("invalid-email")]
        public void InvalidEmail_ShouldHaveValidationError(string email)
        {
            var dto = new RegisterDto { Name = "John", Email = email, Password = "Password123!" };
            var result = _validator.TestValidate(dto);
            result.ShouldHaveValidationErrorFor(x => x.Email);
        }

        [Theory]
        [InlineData("")]
        [InlineData("short")] // too short
        public void InvalidPassword_ShouldHaveValidationError(string password)
        {
            var dto = new RegisterDto { Name = "John", Email = "john@example.com", Password = password };
            var result = _validator.TestValidate(dto);
            result.ShouldHaveValidationErrorFor(x => x.Password);
        }
    }
}
