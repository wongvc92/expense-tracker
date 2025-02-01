using api.Data;
using api.Dtos.transaction;
using api.interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly AppDbContext _context;
        public TransactionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddTransactionAsync(Guid relatedEntityId, string userId, decimal amount, DateTime date, string transactionType)
        {
            if (transactionType != "income" && transactionType != "expense")
                throw new ArgumentException("Invalid transaction type");

            var transactionRecord = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = transactionType == "expense" ? -amount : amount, // Negative for expenses
                TransactionType = transactionType,
                Date = date,
                CreatedAt = DateTime.UtcNow
            };

            // Ensure only one foreign key is set
            if (transactionType == "income")
            {
                transactionRecord.IncomeId = relatedEntityId;
            }
            else
            {
                transactionRecord.ExpenseId = relatedEntityId;
            }

            _context.Transactions.Add(transactionRecord);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TransactionResponseDto>> GetAllTransactionsAsync(string userId)
        {
            return await _context.Transactions
                .Where(t => t.UserId == userId)
                .Include(t => t.Income)
                .Include(t => t.Expense)
                .ThenInclude(e => e!.Category) // Ensure category is included for expenses
                .Select(t => new TransactionResponseDto
                {
                    Id = t.Id,
                    Amount = t.Amount,
                    TransactionType = t.TransactionType,
                    IncomeId = t.IncomeId,
                    ExpenseId = t.ExpenseId,
                    Income = t.Income != null ? new Income
                    {
                        Id = t.Income.Id,
                        UserId = t.Income.UserId,
                        Amount = t.Income.Amount,
                        Source = t.Income.Source,
                        Date = t.Income.Date
                    } : null,
                    Expense = t.Expense != null ? new Expense
                    {
                        Id = t.Expense.Id,
                        UserId = t.Expense.UserId,
                        Amount = t.Expense.Amount,
                        Description = t.Expense.Description,
                        Date = t.Expense.Date,
                        CategoryId = t.Expense.CategoryId,
                        Category = t.Expense.Category != null ? new Category
                        {
                            Id = t.Expense.Category.Id,
                            Name = t.Expense.Category.Name
                        } : null
                    } : null,
                    Date = t.Date
                })
                .ToListAsync();
        }



    }
}