
using api.Models;

namespace api.interfaces
{
    public interface IIncomeRepository
    {
        Task<Income?> GetIncomeByIdAsync(Guid id);
        Task<Income?> AddIncomeAsync(string userId, decimal amount, string source);
    }
}