using System.Security.Claims;
using api.Dtos.expense;
using api.interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers
{
    [ApiController]
    [Route("api/expenses")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseRepository _expenseRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public ExpensesController(IExpenseRepository expenseRepository, ICategoryRepository categoryRepository, UserManager<ApplicationUser> userManager)
        {
            _expenseRepository = expenseRepository;
            _categoryRepository = categoryRepository;
            _userManager = userManager;
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
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User is not authenticated");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (expenseDto.Amount <= 0)
            {
                return BadRequest("Amount must be greater than 0");
            }

            var category = await _categoryRepository.GetCategoryByIdAsync(expenseDto.CategoryId);
            if (category == null)
            {
                return BadRequest("Category not found");
            }

            var createdExpense = await _expenseRepository.CreateExpenseAsync(user, expenseDto);

            if (createdExpense == null)
                return BadRequest(new { message = "Insufficient balance or transaction failed" });
            return CreatedAtAction(nameof(GetExpense), new { id = createdExpense.Id }, createdExpense.ToExpenseDto());
        }
    }
}