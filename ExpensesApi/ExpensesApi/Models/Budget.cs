namespace ExpensesApi.Models
{
    public class Budget
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime Month { get; set; }
        public decimal Amount { get; set; }
        public decimal RemainingBudget { get; set; }

        public virtual User User { get; set; }
        
    }
}
