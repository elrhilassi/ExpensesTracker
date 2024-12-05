using ExpensesApi.Data;
using ExpensesApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpensesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExpensesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses([FromQuery] int userId)
        {
            return await _context.Expenses
                .Where(e => e.UserId == userId)
                .Include(e => e.Category)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Expense>> CreateExpense(Expense expense)
        {
            _context.Expenses.Add(expense);

            // Update remaining budget
            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.UserId == expense.UserId &&
                    b.Month.Month == expense.Date.Month &&
                    b.Month.Year == expense.Date.Year);

            if (budget != null)
            {
                budget.RemainingBudget -= expense.Amount;

                // Check if total expenses exceed the monthly budget
                var totalExpenses = await _context.Expenses
                    .Where(e => e.UserId == expense.UserId &&
                                e.Date.Month == expense.Date.Month &&
                                e.Date.Year == expense.Date.Year)
                    .SumAsync(e => e.Amount);

                if (totalExpenses > budget.Amount)
                {
                    // Notify the user about the exceeded budget
                    return BadRequest(new
                    {
                        message = "Your total expenses have exceeded the monthly budget.",
                        expense = expense
                    });
                }
            }

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
        }




        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound();
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetFilteredExpenses(
        [FromQuery] int userId,
        [FromQuery] int? categoryId)
        {
            var query = _context.Expenses
                .Where(e => e.UserId == userId)
                .Include(e => e.Category) // Assuming Category is a navigation property
                .AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(e => e.CategoryId == categoryId.Value); // Filtering by CategoryId
            }

            var expenses = await query.ToListAsync();
            return Ok(expenses);
        }


    }
}
