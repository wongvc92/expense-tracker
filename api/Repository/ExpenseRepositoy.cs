using api.Data;
using api.Dtos.expense;
using api.interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;


namespace api.Repository
{
    public class ExpenseRepositoy : IExpenseRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;
        public ExpenseRepositoy(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        public async Task<Expense?> GetExpenseByIdAsync(int id)
        {
            return await _context.Expenses.FindAsync(id);
        }
        public async Task<Expense?> CreateExpenseAsync(ApplicationUser user, CreateExpenseDto expenseDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {

                if (user.Balance < expenseDto.Amount)
                    return null; // Prevent overspending

                user.Balance -= expenseDto.Amount;

                var expense = new Expense
                {
                    UserId = user.Id,
                    Amount = expenseDto.Amount,
                    CategoryId = expenseDto.CategoryId,
                    Date = expenseDto.Date
                };

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



    }
}