using api.Data;
using api.Dtos;
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

        public async Task<PaginatedResponse<TransactionResponseDto>> GetAllTransactionsAsync(
      string userId,
      int pageNumber,
      int pageSize,
      DateTime? dateFrom = null,
      DateTime? dateTo = null,
      List<int>? categoryIds = null,
      string? sortBy = "date", // Default to sorting by date
      string? sortOrder = "desc" // Default to descending order
  )
        {
            IQueryable<Transaction> query = _context.Transactions
                .Where(t => t.UserId == userId)
                .Include(t => t.Income)
                .Include(t => t.Expense)
                .ThenInclude(e => e!.Category);

            // ✅ Apply date filtering
            if (dateFrom.HasValue)
                query = query.Where(t => t.Date >= dateFrom.Value);

            if (dateTo.HasValue)
                query = query.Where(t => t.Date <= dateTo.Value);

            // ✅ Apply category filtering
            if (categoryIds != null && categoryIds.Any())
                query = query.Where(t => t.Expense != null && categoryIds.Contains(t.Expense.CategoryId));

            // ✅ Apply sorting
            query = sortBy?.ToLower() switch
            {
                "amount" => sortOrder == "asc" ? query.OrderBy(t => t.Amount) : query.OrderByDescending(t => t.Amount),
                "type" => sortOrder == "asc" ? query.OrderBy(t => t.TransactionType) : query.OrderByDescending(t => t.TransactionType),
                "category" => sortOrder == "asc" ? query.OrderBy(t => t.Expense!.Category!.Name) : query.OrderByDescending(t => t.Expense!.Category!.Name),
                _ => sortOrder == "asc" ? query.OrderBy(t => t.Date) : query.OrderByDescending(t => t.Date) // Default to Date sorting
            };

            // ✅ Get total count after filtering
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            // ✅ Apply Pagination
            var transactions = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
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

            return new PaginatedResponse<TransactionResponseDto>
            {
                Data = transactions,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalCount = totalCount
            };
        }






    }
}