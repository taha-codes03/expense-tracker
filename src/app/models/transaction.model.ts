export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  note?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: '💼', color: '#10b981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#6366f1', type: 'income' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#f59e0b', type: 'income' },
  { id: 'other-income', name: 'Other', icon: '💰', color: '#14b8a6', type: 'income' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#ef4444', type: 'expense' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#f97316', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
  { id: 'utilities', name: 'Utilities', icon: '⚡', color: '#8b5cf6', type: 'expense' },
  { id: 'health', name: 'Health', icon: '🏥', color: '#06b6d4', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#f43f5e', type: 'expense' },
  { id: 'education', name: 'Education', icon: '📚', color: '#3b82f6', type: 'expense' },
  { id: 'other-expense', name: 'Other', icon: '📦', color: '#6b7280', type: 'expense' },
];
