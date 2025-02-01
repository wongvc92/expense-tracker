using api.Data;
using api.Dtos.expense;
using api.interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;


namespace api.Repository
{
    public class ExpenseRepositoy : IExpenseRepository
    {

        private readonly AppDbContext _context;



        public ExpenseRepositoy(AppDbContext context)
        {

            _context = context;

        }

        public async Task<Expense?> GetExpenseByIdAsync(int id)
        {
            return await _context.Expenses.FindAsync(id);
        }
        public async Task<Expense?> CreateExpenseAsync(ApplicationUser user, CreateExpenseDto expenseDto)
        {

            if (!CanUserAffordExpense(user, expenseDto.Amount))
                return null; // Prevent overspending
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var expense = new Expense
                {
                    UserId = user.Id,
                    Amount = expenseDto.Amount,
                    CategoryId = expenseDto.CategoryId,
                    Date = expenseDto.Date
                };

                user.Balance -= expenseDto.Amount;

                _context.Expenses.Add(expense);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return expense; // Return created expense
            }
            catch
            {
                await transaction.RollbackAsync();
                return null;
            }
        }

        private static bool CanUserAffordExpense(ApplicationUser user, decimal amount)
        {
            return user.Balance >= amount;
        }

    }
}