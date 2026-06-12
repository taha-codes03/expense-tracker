import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Category, TransactionType } from '../../models/transaction.model';

const ICONS = ['🍽️','🚗','🛍️','⚡','🏥','🎬','📚','📦','💼','💻','📈','💰','🏠','✈️','🎵','🎮','🐾','🌿','☕','💊','🎁','📱','🔧','🏋️'];
const COLORS = ['#ef4444','#f97316','#f59e0b','#10b981','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#6366f1','#14b8a6','#84cc16','#f43f5e'];

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css']
})
export class CategoryManagerComponent implements OnInit {
  form!: FormGroup;
  incomeCategories: Category[] = [];
  expenseCategories: Category[] = [];
  showForm = false;
  selectedType: TransactionType = 'expense';
  icons = ICONS;
  colors = COLORS;

  constructor(private fb: FormBuilder, private txService: TransactionService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      icon: ['📦', Validators.required],
      color: ['#6b7280', Validators.required],
      type: ['expense']
    });

    this.txService.categories$.subscribe(cats => {
      this.incomeCategories = cats.filter(c => c.type === 'income');
      this.expenseCategories = cats.filter(c => c.type === 'expense');
    });
  }

  selectIcon(icon: string) { this.form.patchValue({ icon }); }
  selectColor(color: string) { this.form.patchValue({ color }); }
  setType(type: TransactionType) {
    this.selectedType = type;
    this.form.patchValue({ type });
  }

  addCategory() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.txService.addCategory({
      name: this.form.value.name,
      icon: this.form.value.icon,
      color: this.form.value.color,
      type: this.form.value.type
    });
    this.form.reset({ icon: '📦', color: '#6b7280', type: 'expense' });
    this.showForm = false;
  }

  deleteCategory(id: string) {
    if (confirm('Delete this category?')) this.txService.deleteCategory(id);
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
