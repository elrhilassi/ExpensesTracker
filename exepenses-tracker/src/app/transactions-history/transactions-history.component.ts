import { Component } from '@angular/core';
import { ApidataService } from '../apidata.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
interface Transaction {
  id: number;
  date: string;
  status: string;
  type: string;
  receipt: string;
  amount: number;
  // Additional details for the show modal
  customerName?: string;
  description?: string;
  paymentMethod?: string;
  referenceNumber?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Expense {
  id: number;
  userId: number;
  categoryId: number;
  amount: number;
  description: string;
  date: string;
  user: any; // Or you can define a more specific type for `user` if needed
  category: Category;
}

@Component({
  selector: 'app-transactions-history',
  templateUrl: './transactions-history.component.html',
  styleUrl: './transactions-history.component.css',
})
export class TransactionsHistoryComponent {
  transactions: Transaction[] = [];
  expensesList: any = [];
  addExpenseForm: FormGroup;
  Budget: any;
  constructor(
    private apidataService: ApidataService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {
    this.addExpenseForm = this.fb.group({
      userId: ['', Validators.required],
      categoryId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
  }
  // Pagination

  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  displayedTransactions: Transaction[] = [];
  expenseToDelete: any = null; // Store the expense to delete
  showModal = false;
  deleteModal = false;
  addModel = false;
  selectedTransaction: Transaction | null = null;

  ngOnInit() {
    console.log('coou');
    // Load sample data with additional fields
    this.filterForm = this.fb.group({
      categoryId: [''], // Dropdown for CategoryId
      userId: [1], // Default userId (replace with actual logic if needed)
    });
    this.loadExpenses();
    this.applyFilters();
    this.apidataService.getBudgets(1).subscribe({
      next: (data) => {
        this.Budget = data.amount;
      },
      error: (err) => {
        console.error('Error fetching budgets:', err);
      },
    });
    this.checkValues();
  }
  secondList: any = [];
  spending: number = 0;
  checkValues(): void {
    this.apidataService.getExpenses(1).subscribe(
      (data: any[]) => {
        // Transform data for visualization
        this.secondList = data.map((expense) => ({
          amount: expense.amount,
        }));
        const totalSpending = this.secondList.reduce(
          (total: any, expense: any) => total + expense.amount,
          0
        );

        // Assuming 'budget' is defined elsewhere in your component

        this.spending = totalSpending; // Store total spending
        console.log('coou', this.spending);
      },

      (err) => {
        console.error('Error fetching expenses:', err);
      }
    );
  }

  loadExpenses() {
    this.apidataService.getExpenses(1).subscribe(
      (data: any[]) => {
        // Transform data for visualization
        this.expensesList = data;
        console.log('Expenses:', this.expensesList[1].category.name);
        this.totalItems = this.expensesList.length;
        console.log('Total Items:', this.totalItems);
      },
      (err) => {
        console.error('Error fetching expenses:', err);
      }
    );
  }
  onSubmit(): void {
    this.openSnackBar('Expense added successfully!', 'success');
    console.log('coou', this.spending);

    if (this.addExpenseForm.valid) {
      const expenseData = { ...this.addExpenseForm.value };

      if (this.Budget - (this.spending + expenseData.amount) < 0) {
        console.log('exceeded');
        this.openSnackBar('Budget Exceeded', 'error');
        return;
      }

      if (expenseData.date) {
        expenseData.date = new Date(expenseData.date).toISOString();
      }

      this.apidataService.createExpense(expenseData).subscribe({
        next: (response) => {
          console.log('Expense added successfully:', response);
          this.addModel = false;
          this.addExpenseForm.reset();
          this.loadExpenses();
          this.openSnackBar('Expense added successfully!', 'success');
        },
        error: (error) => {
          if (error.status === 400 && error.error.message) {
            this.openSnackBar(error.error.message, 'error');
          } else {
            console.error('Error adding expense:', error);
            this.openSnackBar(
              'Error adding expense. Please try again.',
              'error'
            );
          }
        },
      });
    }
  }

  private openSnackBar(message: string, type: 'success' | 'error'): void {
    const config = {
      duration: 3000,
      horizontalPosition: 'right' as const,
      verticalPosition: 'top' as const,
      panelClass: [
        'min-w-[250px]',
        'p-4',
        'rounded-lg',
        'shadow-lg',
        type === 'success' ? 'bg-green-500' : 'bg-red-500',
        'text-white',
      ],
    };

    this.snackBar.open(message, 'Close', config);
  }

  showDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction;
    this.showModal = true;
  }

  addExpensesModal() {
    this.addModel = true;
  }

  confirmDelete(expense: any): void {
    this.expenseToDelete = expense;
    this.deleteModal = true;
  }

  DeleteExpenses(): void {
    if (this.expenseToDelete) {
      this.apidataService.deleteExpense(this.expenseToDelete.id).subscribe({
        next: () => {
          console.log(
            `Expense with ID ${this.expenseToDelete.id} deleted successfully.`
          );
          this.loadExpenses(); // Optionally refresh your expense list
          this.deleteModal = false; // Close the modal after deletion
        },
        error: (error) => {
          console.error(`Error deleting expense: ${error.message}`);
        },
      });
    }
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedTransactions();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedTransactions();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedTransactions();
  }

  private updateDisplayedTransactions(): void {
    this.loadExpenses();
    const start = this.startIndex;
    const end = this.endIndex;
    this.displayedTransactions = this.expensesList.slice(start, end);
  }
  filterForm!: FormGroup;
  categories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Gas' },
    // Add more categories here
  ];
  applyFilters(): void {
    const userId = 1; // Replace with the actual logged-in user ID

    const filters = this.filterForm.value; // Get form values

    this.apidataService
      .getFilteredExpenses(filters.userId, filters.categoryId)
      .subscribe((data: any[]) => {
        this.expensesList = data; // Update the table with results
      });
  }
}
