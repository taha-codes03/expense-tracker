import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() activeTab: string = 'dashboard';
  @Output() tabChange = new EventEmitter<string>();

  tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add', label: 'Add', icon: '➕' },
    { id: 'transactions', label: 'Transactions', icon: '📋' },
    { id: 'summary', label: 'Summary', icon: '📅' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
  ];

  setTab(tab: string) {
    this.tabChange.emit(tab);
  }
}
