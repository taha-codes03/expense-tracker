import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, Category } from '../../models/transaction.model';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormatCurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();

  balance$!: Observable<number>;
  totalIncome$!: Observable<number>;
  totalExpense$!: Observable<number>;
  recentTransactions$!: Observable<Transaction[]>;
  categories$!: Observable<Category[]>;
  topCategories$!: Observable<{ category: Category; total: number }[]>;

  constructor(public txService: TransactionService) {}

  ngOnInit() {
    this.balance$ = this.txService.balance$;
    this.totalIncome$ = this.txService.totalIncome$;
    this.totalExpense$ = this.txService.totalExpense$;
    this.categories$ = this.txService.categories$;

    this.recentTransactions$ = this.txService.transactions$.pipe(
      map(txns => [...txns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5))
    );

    this.topCategories$ = this.txService.transactions$.pipe(
      map(txns => {
        const expense = txns.filter(t => t.type === 'expense');
        const map2 = new Map<string, number>();
        expense.forEach(t => map2.set(t.categoryId, (map2.get(t.categoryId) || 0) + t.amount));
        return Array.from(map2.entries())
          .map(([catId, total]) => ({ category: this.txService.getCategoryById(catId)!, total }))
          .filter(x => x.category)
          .sort((a, b) => b.total - a.total)
          .slice(0, 4);
      })
    );
  }

  getCategoryById(id: string): Category | undefined {
    return this.txService.getCategoryById(id);
  }

  getBarWidth(amount: number, transactions: Transaction[]): number {
    const max = Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 1);
    return (amount / max) * 100;
  }
}
