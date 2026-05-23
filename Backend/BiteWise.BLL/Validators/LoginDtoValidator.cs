using BiteWise.BLL.DTOs.Auth;
using FluentValidation;

namespace BiteWise.BLL.Validators
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email є обов'язковим.")
                .EmailAddress().WithMessage("Невірний формат Email.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль є обов'язковим.");
        }
    }
}
