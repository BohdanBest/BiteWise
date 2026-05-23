using BiteWise.BLL.DTOs.Diary;
using FluentValidation;

namespace BiteWise.BLL.Validators
{
    public class AddFoodEntryDtoValidator : AbstractValidator<AddFoodEntryDto>
    {
        public AddFoodEntryDtoValidator()
        {
            RuleFor(x => x.FoodName)
                .NotEmpty().WithMessage("Назва їжі є обов'язковою.")
                .MaximumLength(200).WithMessage("Назва їжі не може перевищувати 200 символів.");

            RuleFor(x => x.Calories)
                .GreaterThanOrEqualTo(0).WithMessage("Калорії не можуть бути від'ємними.");

            RuleFor(x => x.Proteins).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Fats).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Carbs).GreaterThanOrEqualTo(0);

            RuleFor(x => x.WeightGrams)
                .InclusiveBetween(1, 10000).WithMessage("Вага порції повинна бути від 1 до 10000 грамів.");

            RuleFor(x => x.MealType).IsInEnum().WithMessage("Некоректний тип прийому їжі.");
        }
    }
}
