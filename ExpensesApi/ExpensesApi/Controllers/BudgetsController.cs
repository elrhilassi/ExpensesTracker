using ExpensesApi.Data;
using ExpensesApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpensesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BudgetsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Budget>> GetBudget([FromQuery] int userId)
        {
            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.UserId == userId);

            if (budget == null)
            {
                return NotFound();
            }

            return budget;
        }

        [HttpPost]
        public async Task<ActionResult<Budget>> CreateBudget(Budget budget)
        {
            budget.RemainingBudget = budget.Amount;
            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBudget), new { id = budget.Id }, budget);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBudget(int id, [FromBody] decimal newAmount)
        {
            var existingBudget = await _context.Budgets.FindAsync(id);
            if (existingBudget == null)
            {
                return NotFound();
            }

            // Update both Amount and RemainingBudget with the new value
            existingBudget.Amount = newAmount;
            existingBudget.RemainingBudget = newAmount;

            await _context.SaveChangesAsync();
            return Ok(existingBudget);
        }
    }
}
