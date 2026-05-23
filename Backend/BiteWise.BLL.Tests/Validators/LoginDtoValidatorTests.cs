using BiteWise.BLL.DTOs.Auth;
using BiteWise.BLL.Validators;
using FluentValidation.TestHelper;
using Xunit;

namespace BiteWise.BLL.Tests.Validators
{
    public class LoginDtoValidatorTests
    {
        private readonly LoginDtoValidator _validator;

        public LoginDtoValidatorTests()
        {
            _validator = new LoginDtoValidator();
        }

        [Fact]
        public void ValidDto_ShouldNotHaveValidationErrors()
        {
            var dto = new LoginDto { Email = "test@example.com", Password = "Password123" };
            var result = _validator.TestValidate(dto);
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Theory]
        [InlineData("")]
        [InlineData("not-an-email")]
        public void InvalidEmail_ShouldHaveValidationError(string email)
        {
            var dto = new LoginDto { Email = email, Password = "Password123" };
            var result = _validator.TestValidate(dto);
            result.ShouldHaveValidationErrorFor(x => x.Email);
        }

        [Fact]
        public void EmptyPassword_ShouldHaveValidationError()
        {
            var dto = new LoginDto { Email = "test@example.com", Password = "" };
            var result = _validator.TestValidate(dto);
            result.ShouldHaveValidationErrorFor(x => x.Password);
        }
    }
}
