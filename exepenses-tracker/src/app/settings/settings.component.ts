import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApidataService } from '../apidata.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  budgetForm: FormGroup;

  currentBudget: any;
  userId = 1; // or however you're getting the userId

  constructor(
    private fb: FormBuilder,
    private apidataService: ApidataService,
    private snackBar: MatSnackBar
  ) {
    this.budgetForm = this.fb.group({
      newBudget: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadBudget();
  }
  loadBudget() {
    this.apidataService.getBudgets(this.userId).subscribe({
      next: (data) => {
        this.currentBudget = data.amount;
      },
      error: (error) => {
        this.openSnackBar('Error loading budget', 'error');
        console.error('Error loading budget:', error);
      },
    });
  }
  onSubmit() {
    if (this.budgetForm.valid && this.currentBudget) {
      const newAmount = this.budgetForm.value.newBudget;

      this.apidataService.updateBudget(1, newAmount).subscribe({
        next: () => {
          this.openSnackBar('Budget updated successfully!', 'success');

          this.budgetForm.reset();
        },
        error: (error) => {
          this.openSnackBar('Error updating budget', 'error');
          console.error('Error updating budget:', error);
        },
      });
    }
  }

  onCancel() {
    this.budgetForm.reset();
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
}
