
using System.Security.Claims;
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
        public async Task<ActionResult<List<TransactionResponseDto>>> GetAllTransactions()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            var transactions = await _transactionRepository.GetAllTransactionsAsync(userId);

            return Ok(transactions);
        }
    }
}