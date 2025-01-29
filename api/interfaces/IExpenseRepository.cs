
using api.Dtos.expense;
using api.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace api.interfaces
{
    public interface IExpenseRepository
    {

        Task<Expense?> GetExpenseByIdAsync(int id);
        Task<Expense?> CreateExpenseAsync(ApplicationUser user, CreateExpenseDto expenseDto);

    }
}