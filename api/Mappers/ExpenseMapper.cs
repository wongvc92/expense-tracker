
using api.Dtos.expense;
using api.Models;

namespace api.Mappers
{
    public static class ExpenseMapper
    {
        public static ExpenseResponseDto ToExpenseDto(this Expense expense)
        {
            return new ExpenseResponseDto
            {
                Id = expense.Id,
                Amount = expense.Amount,
                Description = expense.Description,
                Date = expense.Date,
                CreatedAt = expense.CreatedAt,
                CategoryId = expense.CategoryId,
                Category = expense.Category
            };
        }

        public static Expense ToExpenseFromCreate(this CreateExpenseDto expense)
        {
            return new Expense
            {
                Amount = expense.Amount,
                Description = expense.Description,
                Date = expense.Date,
                CategoryId = expense.CategoryId
            };

        }


    }
}