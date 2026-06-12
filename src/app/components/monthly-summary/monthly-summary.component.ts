import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, Category } from '../../models/transaction.model';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';

interface MonthlySummary {
  income: number;
  expense: number;
  balance: number;
  transactions: Transaction[];
}

@Component({
  selector: 'app-monthly-summary',
  standalone: true,
  imports: [CommonModule, FormatCurrencyPipe],
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.css']
})
export class MonthlySummaryComponent implements OnInit {
  currentDate = new Date();
  selectedYear: number;
  selectedMonth: number;

  summary: MonthlySummary = { income: 0, expense: 0, balance: 0, transactions: [] };
  categoryBreakdown: { category: Category; income: number; expense: number }[] = [];
  categories: Category[] = [];

  months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  years: number[] = [];

  constructor(private txService: TransactionService) {
    this.selectedYear = this.currentDate.getFullYear();
    this.selectedMonth = this.currentDate.getMonth();
    const y = this.currentDate.getFullYear();
    for (let i = y - 3; i <= y; i++) this.years.push(i);
  }

  ngOnInit() {
    this.txService.categories$.subscribe(cats => {
      this.categories = cats;
      this.loadSummary();
    });
    this.txService.transactions$.subscribe(() => this.loadSummary());
  }

  loadSummary() {
    this.txService.getMonthlySummary(this.selectedYear, this.selectedMonth).subscribe(s => {
      this.summary = s;
      this.buildBreakdown(s.transactions);
    });
  }

  buildBreakdown(txns: Transaction[]) {
    const map = new Map<string, { income: number; expense: number }>();
    txns.forEach(t => {
      if (!map.has(t.categoryId)) map.set(t.categoryId, { income: 0, expense: 0 });
      const entry = map.get(t.categoryId)!;
      if (t.type === 'income') entry.income += t.amount;
      else entry.expense += t.amount;
    });
    this.categoryBreakdown = Array.from(map.entries())
      .map(([catId, vals]) => ({ category: this.txService.getCategoryById(catId)!, ...vals }))
      .filter(x => x.category)
      .sort((a, b) => (b.income + b.expense) - (a.income + a.expense));
  }

  prevMonth() {
    if (this.selectedMonth === 0) { this.selectedMonth = 11; this.selectedYear--; }
    else this.selectedMonth--;
    this.loadSummary();
  }

  nextMonth() {
    const now = new Date();
    if (this.selectedYear === now.getFullYear() && this.selectedMonth === now.getMonth()) return;
    if (this.selectedMonth === 11) { this.selectedMonth = 0; this.selectedYear++; }
    else this.selectedMonth++;
    this.loadSummary();
  }

  isCurrentMonth(): boolean {
    const now = new Date();
    return this.selectedYear === now.getFullYear() && this.selectedMonth === now.getMonth();
  }

  getSavingsRate(): number {
    if (this.summary.income === 0) return 0;
    return Math.round((this.summary.balance / this.summary.income) * 100);
  }

  getExpensePercent(): number {
    if (this.summary.income === 0) return this.summary.expense > 0 ? 100 : 0;
    return Math.min(100, Math.round((this.summary.expense / this.summary.income) * 100));
  }
}
