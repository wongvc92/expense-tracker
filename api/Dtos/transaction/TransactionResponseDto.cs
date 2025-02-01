

using api.Models;

namespace api.Dtos.transaction
{
    public class TransactionResponseDto
    {

        public Guid Id { get; set; }

        public decimal Amount { get; set; }

        public string TransactionType { get; set; } = "expense"; // "income" or "expense"

        public Guid? IncomeId { get; set; } // Nullable if not an income


        public Guid? ExpenseId { get; set; } // Nullable if not an expense

        public Income? Income { get; set; }
        public Expense? Expense { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

    }
}