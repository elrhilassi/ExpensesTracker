import { Component } from '@angular/core';
import { ApidataService } from '../apidata.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
})
export class ExpensesComponent {
  constructor(private apidataService: ApidataService) {}
  Budget: number = 0;
  ReamaingBudget: number = 0;
  spinding: number = 0;
  expensesList: any = [];
  expensePercentage: number = 0;
  ngOnInit(): void {
    this.apidataService.getBudgets(1).subscribe({
      next: (data) => {
        this.Budget = data.amount;
      },
      error: (err) => {
        console.error('Error fetching budgets:', err);
      },
    });

    this.apidataService.getExpenses(1).subscribe(
      (data: any[]) => {
        // Transform data for visualization
        this.expensesList = data.map((expense) => ({
          name: expense.category?.name || 'No Category', // Extract name from category
          description: expense.description,
          amount: expense.amount,

          date: new Date(expense.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        }));
        const totalSpending = this.expensesList.reduce(
          (total: any, expense: any) => total + expense.amount,
          0
        );

        // Assuming 'budget' is defined elsewhere in your component
        this.ReamaingBudget = this.Budget - totalSpending; // Calculate remaining budget
        this.spinding = totalSpending; // Store total spending
        this.expensePercentage = Math.round(
          (this.spinding / this.Budget) * 100
        );
      },

      (err) => {
        console.error('Error fetching expenses:', err);
      }
    );
  }
}
