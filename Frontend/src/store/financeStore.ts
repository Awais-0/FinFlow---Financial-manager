// Local storage keys
const TRANSACTIONS_KEY = 'finflow_transactions';
const BUDGETS_KEY = 'finflow_budgets';
const USER_KEY = 'finflow_user';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  category: string;
}

export interface Budget {
  id: string;
  category_name: string;
  amount: number;
  period: 'monthly' | 'yearly';
}

export interface User {
  name: string;
  currency: string;
}

// --- User ---
export const userStore = {
  get: (): User => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : { name: 'User', currency: 'USD' };
  },
  save: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

// --- Transactions ---
export const transactionStore = {
  getAll: (): Transaction[] => {
    const stored = localStorage.getItem(TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  },
  add: (tx: Omit<Transaction, 'id'>): Transaction => {
    const all = transactionStore.getAll();
    const newTx: Transaction = { ...tx, id: crypto.randomUUID() };
    all.unshift(newTx);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(all));
    return newTx;
  },
  remove: (id: string) => {
    const all = transactionStore.getAll().filter(t => t.id !== id);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(all));
  },
};

// --- Budgets ---
export const budgetStore = {
  getAll: (): Budget[] => {
    const stored = localStorage.getItem(BUDGETS_KEY);
    if (stored) return JSON.parse(stored);
    // Default budgets
    const defaults: Budget[] = [
      { id: crypto.randomUUID(), category_name: 'Food', amount: 500, period: 'monthly' },
      { id: crypto.randomUUID(), category_name: 'Transport', amount: 200, period: 'monthly' },
      { id: crypto.randomUUID(), category_name: 'Entertainment', amount: 150, period: 'monthly' },
    ];
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(defaults));
    return defaults;
  },
  add: (budget: Omit<Budget, 'id'>): Budget => {
    const all = budgetStore.getAll();
    const newBudget: Budget = { ...budget, id: crypto.randomUUID() };
    all.push(newBudget);
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(all));
    return newBudget;
  },
  remove: (id: string) => {
    const all = budgetStore.getAll().filter(b => b.id !== id);
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(all));
  },
};
