using api.Dtos.transaction;
using api.Models;

namespace api.interfaces
{
    public interface ITransactionRepository
    {
        public Task<List<TransactionResponseDto>> GetAllTransactionsAsync(string userId);
        public Task AddTransactionAsync(Guid expenseId, string userId, decimal amount, DateTime date, string transactionType);
    }
}