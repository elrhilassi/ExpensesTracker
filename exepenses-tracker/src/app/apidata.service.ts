import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApidataService {
  private apiUrl = 'http://localhost:5141/api'; // Base URL

  constructor(private http: HttpClient) {}

  // Fetch budgets by userId
  getBudgets(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Budgets?userId=${userId}`);
  }

  getExpenses(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Expenses?userId=${userId}`);
  }
  getFilteredExpenses(userId: number, categoryId?: number): Observable<any[]> {
    let params = new HttpParams().set('userId', userId.toString());

    // If categoryId is provided, add it to the params
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/Expenses/filter`, { params });
  }

  createExpense(expense: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Expenses`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Expenses/${id}`);
  }

  updateBudget(budgetId: number, newAmount: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Budgets/${budgetId}`, newAmount);
  }
}
