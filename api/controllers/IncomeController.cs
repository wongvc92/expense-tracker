using api.Dtos.income;
using api.interfaces;
using api.validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomeController : ControllerBase
    {

        private readonly ITransactionRepository _transactionRepository;
        private readonly IIncomeRepository _incomeRepository;
        private readonly IUserService _userService;

        public IncomeController(IIncomeRepository incomeRepository, IUserService userService, ITransactionRepository transactionRepository)
        {
            _incomeRepository = incomeRepository;
            _userService = userService;
            _transactionRepository = transactionRepository;
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<IncomeResponseDto>> GetIncome(Guid id)
        {
            var income = await _incomeRepository.GetIncomeByIdAsync(id);

            if (income == null)
                return NotFound(new { message = "Income not found." });

            return Ok(income);
        }

        [Authorize]
        [HttpPost("add-income")]
        public async Task<ActionResult<IncomeResponseDto>> AddIncome([FromBody] AddIncomeDto incomeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userService.GetAuthenticatedUserAsync(User);
            if (user == null) return NotFound("User not found.");


            var validationError = IncomeValidator.ValidateAmount(incomeDto.Amount);
            if (validationError != null) return BadRequest(validationError);

            var createdIncome = await _incomeRepository.AddIncomeAsync(user.Id, incomeDto.Amount, incomeDto.Source);

            if (createdIncome == null) return BadRequest("Failed to add income.");

            await _transactionRepository.AddTransactionAsync(createdIncome.Id, user.Id, createdIncome.Amount, createdIncome.Date, "income");
            return CreatedAtAction(nameof(GetIncome), new
            {
                id = createdIncome.Id
            }, createdIncome);
        }
    }
}