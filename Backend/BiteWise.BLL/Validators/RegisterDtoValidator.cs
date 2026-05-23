using BiteWise.BLL.DTOs.Auth;
using FluentValidation;

namespace BiteWise.BLL.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Ім'я є обов'язковим.")
                .MaximumLength(100).WithMessage("Ім'я не може перевищувати 100 символів.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email є обов'язковим.")
                .EmailAddress().WithMessage("Невірний формат Email.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль є обов'язковим.")
                .MinimumLength(6).WithMessage("Пароль повинен містити щонайменше 6 символів.");

            RuleFor(x => x.Gender).IsInEnum().WithMessage("Некоректна стать.");
            
            RuleFor(x => x.Age)
                .InclusiveBetween(10, 120).WithMessage("Вік повинен бути від 10 до 120 років.");

            RuleFor(x => x.WeightKg)
                .InclusiveBetween(30, 300).WithMessage("Вага повинна бути від 30 до 300 кг.");

            RuleFor(x => x.HeightCm)
                .InclusiveBetween(100, 250).WithMessage("Зріст повинен бути від 100 до 250 см.");

            RuleFor(x => x.Goal).IsInEnum().WithMessage("Некоректна ціль.");
        }
    }
}
