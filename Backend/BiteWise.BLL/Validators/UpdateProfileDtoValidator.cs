using BiteWise.BLL.DTOs.User;
using FluentValidation;

namespace BiteWise.BLL.Validators
{
    public class UpdateProfileDtoValidator : AbstractValidator<UpdateProfileDto>
    {
        public UpdateProfileDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Ім'я є обов'язковим.")
                .MaximumLength(100).WithMessage("Ім'я не може перевищувати 100 символів.");

            RuleFor(x => x.Age)
                .InclusiveBetween(1, 120).WithMessage("Вік повинен бути від 1 до 120 років.");

            RuleFor(x => x.WeightKg)
                .InclusiveBetween(1, 300).WithMessage("Вага повинна бути від 1 до 300 кг.");

            RuleFor(x => x.HeightCm)
                .InclusiveBetween(50, 250).WithMessage("Зріст повинен бути від 50 до 250 см.");

            RuleFor(x => x.Goal).IsInEnum().WithMessage("Некоректна ціль.");
        }
    }
}
