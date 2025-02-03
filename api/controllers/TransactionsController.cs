
using System.Security.Claims;
using api.Dtos;
using api.Dtos.transaction;
using api.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepository;
        public TransactionsController(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<List<PaginatedResponse<TransactionResponseDto>>>> GetAllTransactions([FromQuery] string page, [FromQuery] string limit, [FromQuery] string? dateFrom, [FromQuery] string? dateTo, [FromQuery] string? categoryIds, [FromQuery] string? sortBy = "date",
    [FromQuery] string? sortOrder = "desc")
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            if (!int.TryParse(page, out int pageNumber) || pageNumber < 1) pageNumber = 1;
            if (!int.TryParse(limit, out int pageSize) || pageSize < 1) pageSize = 10;

            DateTime? fromDate = null;
            DateTime? toDate = null;

            if (!string.IsNullOrEmpty(dateFrom) && DateTime.TryParse(dateFrom, out DateTime parsedFromDate))
            {
                fromDate = parsedFromDate.ToUniversalTime(); // Convert to UTC to match database format
            }

            if (!string.IsNullOrEmpty(dateTo) && DateTime.TryParse(dateTo, out DateTime parsedToDate))
            {
                toDate = parsedToDate.ToUniversalTime();
            }

            List<int>? categoryList = null;
            if (!string.IsNullOrEmpty(categoryIds))
            {
                categoryList = categoryIds.Split(',').Select(int.Parse).ToList();
            }
            var transactions = await _transactionRepository.GetAllTransactionsAsync(userId, pageNumber, pageSize, fromDate, toDate, categoryList, sortBy, sortOrder);

            return Ok(transactions);
        }
    }
}