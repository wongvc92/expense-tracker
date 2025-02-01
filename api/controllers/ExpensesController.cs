using api.Dtos.expense;
using api.interfaces;
using api.Mappers;
using api.validation;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers
{
    [ApiController]
    [Route("api/expenses")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseRepository _expenseRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITransactionRepository _TransactionRepository;
        private readonly IUserService _userService;

        public ExpensesController(IExpenseRepository expenseRepository, ICategoryRepository categoryRepository, IUserService userService, ITransactionRepository TransactionRepository)
        {
            _expenseRepository = expenseRepository;
            _categoryRepository = categoryRepository;
            _userService = userService;
            _TransactionRepository = TransactionRepository;

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseResponseDto>> GetExpense(int id)
        {
            var expense = await _expenseRepository.GetExpenseByIdAsync(id);
            if (expense == null)
            {
                return NotFound();
            }
            return Ok(expense.ToExpenseDto());
        }


        [HttpPost("create-expense")]
        public async Task<ActionResult<ExpenseResponseDto>> CreateExpense([FromBody] CreateExpenseDto expenseDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userService.GetAuthenticatedUserAsync(User);

            if (user == null) return NotFound("User not found.");


            var validationError = ExpenseValidator.ValidateAmount(expenseDto.Amount);
            if (validationError != null) return BadRequest(validationError);

            var category = await _categoryRepository.GetCategoryByIdAsync(expenseDto.CategoryId);
            if (category == null) return BadRequest("Category not found");


            var createdExpense = await _expenseRepository.CreateExpenseAsync(user, expenseDto);

            if (createdExpense == null) return BadRequest("Insufficient balance or transaction failed");

            await _TransactionRepository.AddTransactionAsync(createdExpense.Id, user.Id, expenseDto.Amount, expenseDto.Date, "expense");

            return CreatedAtAction(nameof(GetExpense), new { id = createdExpense.Id }, createdExpense.ToExpenseDto());
        }
    }
}