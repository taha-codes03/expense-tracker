# 💸 SpendWise – Angular Expense Tracker

A visually stunning, full-featured expense tracker built with Angular 17 (standalone components).

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ → https://nodejs.org
- **npm** v9+

### Setup

```bash
# 1. Extract the zip and enter the project
cd expense-tracker

# 2. Install dependencies
npm install

# 3. Run the dev server
npm start
```

Open **http://localhost:4200** in your browser.

---

## 📁 Project Structure

```
expense-tracker/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/              ← Nav bar + branding
│   │   │   ├── dashboard/           ← Overview, balance, recent txns
│   │   │   ├── add-transaction/     ← Reactive Form to add income/expense
│   │   │   ├── transaction-list/    ← Searchable, filterable list
│   │   │   ├── monthly-summary/     ← Month-by-month analytics
│   │   │   └── category-manager/    ← Create/delete categories
│   │   ├── models/
│   │   │   └── transaction.model.ts ← Interfaces + default data
│   │   ├── pipes/
│   │   │   └── format-currency.pipe.ts ← Custom currency pipe (PKR)
│   │   ├── services/
│   │   │   └── transaction.service.ts  ← BehaviorSubject state + localStorage
│   │   ├── app.component.*          ← Root component + tab routing
│   │   └── app.config.ts
│   ├── styles.css                   ← Global dark theme variables
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
└── tsconfig.json
```

---

## ✨ Features

| Feature                | Details                                                               |
| ---------------------- | --------------------------------------------------------------------- |
| **Add Income/Expense** | Reactive form with validation, category picker, date, notes           |
| **Dashboard**          | Balance card, income/expense stats, recent transactions, top spending |
| **Transaction List**   | Search, filter by type/category, sort by date/amount, delete          |
| **Monthly Summary**    | Navigate months, savings rate progress bar, category breakdown        |
| **Category Manager**   | Add custom categories with icon & color picker, delete any            |
| **Local Storage**      | All data persists in browser storage                                  |
| **Dark Theme**         | Deep space dark UI with gradient accents                              |

---

## 🎯 Angular Concepts Used

- **Standalone Components** (Angular 17)
- **Reactive Forms** with validators
- **Services + BehaviorSubject** for reactive state
- **Custom Pipe** (`formatCurrency`)
- **Component Communication** (`@Input`, `@Output`, `EventEmitter`)
- **AsyncPipe** with Observables
- **RxJS** (`combineLatest`, `map`, `filter`)
- **LocalStorage** persistence

---
