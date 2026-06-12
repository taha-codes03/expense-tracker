import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { Category, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {
  @Output() added = new EventEmitter<void>();

  form!: FormGroup;
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedType: TransactionType = 'expense';
  showSuccess = false;

  constructor(private fb: FormBuilder, private txService: TransactionService) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      type: ['expense'],
      categoryId: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      note: ['']
    });

    this.txService.categories$.subscribe(cats => {
      this.categories = cats;
      this.filterCategories('expense');
    });

    this.form.get('type')!.valueChanges.subscribe(type => {
      this.selectedType = type;
      this.filterCategories(type);
      this.form.patchValue({ categoryId: '' });
    });
  }

  filterCategories(type: TransactionType) {
    this.filteredCategories = this.categories.filter(c => c.type === type);
  }

  setType(type: TransactionType) {
    this.selectedType = type;
    this.form.patchValue({ type });
  }

  selectCategory(id: string) {
    this.form.patchValue({ categoryId: id });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.txService.addTransaction({
      title: this.form.value.title,
      amount: +this.form.value.amount,
      type: this.form.value.type,
      categoryId: this.form.value.categoryId,
      date: this.form.value.date,
      note: this.form.value.note,
    });
    this.showSuccess = true;
    this.form.reset({ type: 'expense', date: new Date().toISOString().split('T')[0] });
    this.selectedType = 'expense';
    this.filterCategories('expense');
    setTimeout(() => { this.showSuccess = false; }, 2500);
    this.added.emit();
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
