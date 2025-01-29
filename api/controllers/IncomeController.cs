
using System.Security.Claims;
using api.Dtos.income;
using api.interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomeController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IIncomeRepository _incomeRepository;

        public IncomeController(UserManager<ApplicationUser> userManager, IIncomeRepository incomeRepository)
        {
            _userManager = userManager;
            _incomeRepository = incomeRepository;
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

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User is not authenticated" });

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            if (incomeDto.Amount <= 0)
            {
                return BadRequest(new { message = "Amount must be greater than 0" });
            }

            var newIncome = await _incomeRepository.AddIncomeAsync(user.Id, incomeDto.Amount, incomeDto.Source);

            if (newIncome == null)
                return BadRequest(new { message = "Failed to add income." });

            return CreatedAtAction(nameof(GetIncome), new { id = newIncome.Id }, newIncome);
        }
    }
}