
using api.Data;
using api.interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Repository
{
    public class IncomeRepository : IIncomeRepository
    {

        private readonly AppDbContext _context;

        private readonly UserManager<ApplicationUser> _userManager;
        public IncomeRepository(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        public async Task<Income?> GetIncomeByIdAsync(Guid id)
        {
            return await _context.Incomes.FindAsync(id);
        }
        public async Task<Income?> AddIncomeAsync(string userId, decimal amount, string source)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return null;

                user.Balance += amount;
                user.TotalIncome += amount;

                var income = new Income
                {
                    Amount = amount,
                    Source = source,
                    UserId = user.Id,
                };

                _context.Incomes.Add(income);
                await _userManager.UpdateAsync(user);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return income;
            }
            catch
            {
                await transaction.RollbackAsync();
                return null;
            }

        }

    }
}