﻿namespace ExpensesApi.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? CategoryId { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }

        public virtual User? User { get; set; }
        public virtual Category? Category { get; set; }
    }
}
