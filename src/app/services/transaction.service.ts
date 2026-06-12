import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Transaction, Category, DEFAULT_CATEGORIES, TransactionType } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly TRANSACTIONS_KEY = 'expense_tracker_transactions';
  private readonly CATEGORIES_KEY = 'expense_tracker_categories';

  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.loadTransactions());
  private categoriesSubject = new BehaviorSubject<Category[]>(this.loadCategories());

  transactions$ = this.transactionsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();

  totalIncome$ = this.transactions$.pipe(
    map(txns => txns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))
  );

  totalExpense$ = this.transactions$.pipe(
    map(txns => txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))
  );

  balance$ = combineLatest([this.totalIncome$, this.totalExpense$]).pipe(
    map(([income, expense]) => income - expense)
  );

  private loadTransactions(): Transaction[] {
    try {
      return JSON.parse(localStorage.getItem(this.TRANSACTIONS_KEY) || '[]');
    } catch { return []; }
  }

  private loadCategories(): Category[] {
    try {
      const stored = localStorage.getItem(this.CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : [...DEFAULT_CATEGORIES];
    } catch { return [...DEFAULT_CATEGORIES]; }
  }

  private saveTransactions(txns: Transaction[]) {
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(txns));
    this.transactionsSubject.next(txns);
  }

  private saveCategories(cats: Category[]) {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(cats));
    this.categoriesSubject.next(cats);
  }

  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const txns = [...this.transactionsSubject.value, { ...transaction, id: this.generateId() }];
    this.saveTransactions(txns);
  }

  deleteTransaction(id: string): void {
    this.saveTransactions(this.transactionsSubject.value.filter(t => t.id !== id));
  }

  addCategory(category: Omit<Category, 'id'>): void {
    const cats = [...this.categoriesSubject.value, { ...category, id: this.generateId() }];
    this.saveCategories(cats);
  }

  deleteCategory(id: string): void {
    this.saveCategories(this.categoriesSubject.value.filter(c => c.id !== id));
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoriesSubject.value.find(c => c.id === id);
  }

  getTransactionsByMonth(year: number, month: number): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(txns => txns.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }))
    );
  }

  getMonthlySummary(year: number, month: number) {
    return this.getTransactionsByMonth(year, month).pipe(
      map(txns => {
        const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expense, balance: income - expense, transactions: txns };
      })
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
