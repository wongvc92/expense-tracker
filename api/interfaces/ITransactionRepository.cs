using api.Dtos;
using api.Dtos.transaction;
using api.Models;

namespace api.interfaces
{
    public interface ITransactionRepository
    {
        public Task<PaginatedResponse<TransactionResponseDto>> GetAllTransactionsAsync(
  string userId,
  int pageNumber,
  int pageSize,
  DateTime? dateFrom = null,
  DateTime? dateTo = null,
  List<int>? categoryIds = null,
  string? sortBy = "date", // Default to sorting by date
  string? sortOrder = "desc" // Default to descending order
);
        public Task AddTransactionAsync(Guid expenseId, string userId, decimal amount, DateTime date, string transactionType);
    }
}