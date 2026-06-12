import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { Transaction, Category, TransactionType } from '../../models/transaction.model';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatCurrencyPipe],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  allTransactions: Transaction[] = [];
  filtered: Transaction[] = [];
  categories: Category[] = [];

  searchTerm = '';
  filterType: 'all' | TransactionType = 'all';
  filterCategory = '';
  sortBy = 'date-desc';

  constructor(private txService: TransactionService) {}

  ngOnInit() {
    this.txService.transactions$.subscribe(txns => {
      this.allTransactions = txns;
      this.applyFilters();
    });
    this.txService.categories$.subscribe(cats => this.categories = cats);
  }

  applyFilters() {
    let result = [...this.allTransactions];
    if (this.filterType !== 'all') result = result.filter(t => t.type === this.filterType);
    if (this.filterCategory) result = result.filter(t => t.categoryId === this.filterCategory);
    if (this.searchTerm) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.note?.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (this.sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (this.sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (this.sortBy === 'amount-desc') return b.amount - a.amount;
      if (this.sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
    this.filtered = result;
  }

  getCategoryById(id: string): Category | undefined {
    return this.txService.getCategoryById(id);
  }

  deleteTransaction(id: string) {
    if (confirm('Delete this transaction?')) {
      this.txService.deleteTransaction(id);
    }
  }

  getTotalFiltered(): number {
    return this.filtered.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
  }
}
