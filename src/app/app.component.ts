import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { MonthlySummaryComponent } from './components/monthly-summary/monthly-summary.component';
import { CategoryManagerComponent } from './components/category-manager/category-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    DashboardComponent,
    AddTransactionComponent,
    TransactionListComponent,
    MonthlySummaryComponent,
    CategoryManagerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeTab = 'dashboard';

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
