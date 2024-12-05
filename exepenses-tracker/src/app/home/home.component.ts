import { Component, ViewChild } from '@angular/core';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApidataService } from '../apidata.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Corrected key
})
export class HomeComponent {
  constructor(private apidataService: ApidataService) {}

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  pieChartPlugins = [DataLabelsPlugin];

  pieChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [], // Dynamically populated
        backgroundColor: ['#49b8ad', '#f97316', '#22c55e'],
      },
    ],
    labels: [], // Dynamically populated
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      datalabels: {
        formatter: (value: number) => `€${value.toLocaleString()}`,
        color: 'white',
        font: {
          weight: 'bold',
          size: 12,
        },
      },
    },
  };

  Budget: number = 0;
  ReamaingBudget: number = 0;
  spinding: number = 0;
  expensePercentage: number = 0;
  expensesList: any = [];

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
        // Populate chart data and labels
        const chartData = this.expensesList.map(
          (expense: any) => expense.amount
        );
        const chartLabels = this.expensesList.map(
          (expense: any) => expense.name
        );

        // Update the chart configuration
        this.pieChartData.datasets[0].data = chartData;
        this.pieChartData.labels = chartLabels;

        // Refresh the chart
        this.chart?.update();
      },

      (err) => {
        console.error('Error fetching expenses:', err);
      }
    );
  }
}
