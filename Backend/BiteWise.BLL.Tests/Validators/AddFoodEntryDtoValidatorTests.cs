using BiteWise.BLL.DTOs.Diary;
using BiteWise.BLL.Validators;
using FluentValidation.TestHelper;
using Xunit;

namespace BiteWise.BLL.Tests.Validators
{
    public class AddFoodEntryDtoValidatorTests
    {
        private readonly AddFoodEntryDtoValidator _validator;

        public AddFoodEntryDtoValidatorTests()
        {
            _validator = new AddFoodEntryDtoValidator();
        }

        [Fact]
        public void ValidDto_ShouldNotHaveValidationErrors()
        {
            var dto = new AddFoodEntryDto
            {
                FoodName = "Apple",
                Calories = 50,
                Proteins = 0.5f,
                Fats = 0.1f,
                Carbs = 10f,
                WeightGrams = 100,
                MealType = DAL.Enums.MealType.Breakfast
            };

            var result = _validator.TestValidate(dto);
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Theory]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData(null)]
        public void EmptyFoodName_ShouldHaveValidationError(string foodName)
        {
            var dto = new AddFoodEntryDto { FoodName = foodName, Calories = 50, WeightGrams = 100 };
            var result = _validator.TestValidate(dto);
            result.ShouldHaveValidationErrorFor(x => x.FoodName);
        }

        [Theory]
        [InlineData(-1)]
        public void InvalidCalories_ShouldHaveValidationError(int calories)
        {
            var dto = new AddFoodEntryDto { FoodName = "Apple", Calories = calories, WeightGrams = 100 };
            var result = _validator.TestValidate(dto);
            result.ShouldHaveValidationErrorFor(x => x.Calories);
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public void InvalidWeightGrams_ShouldHaveValidationError(int weight)
        {
            var dto = new AddFoodEntryDto { FoodName = "Apple", Calories = 50, WeightGrams = weight };
            var result = _validator.TestValidate(dto);
            result.ShouldHaveValidationErrorFor(x => x.WeightGrams);
        }
    }
}
