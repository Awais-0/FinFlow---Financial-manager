import { useState, useEffect } from 'react';
import { transactionStore, budgetStore, userStore, type Transaction, type Budget, type User } from '@/store/financeStore';

export function useFinanceData() {
  const [user, setUser] = useState<User>(userStore.get());
  const [transactions, setTransactions] = useState<Transaction[]>(transactionStore.getAll());
  const [budgets, setBudgets] = useState<Budget[]>(budgetStore.getAll());

  const refreshTransactions = () => setTransactions(transactionStore.getAll());
  const refreshBudgets = () => setBudgets(budgetStore.getAll());
  const refreshUser = () => setUser(userStore.get());

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    transactionStore.add(tx);
    refreshTransactions();
  };

  const removeTransaction = (id: string) => {
    transactionStore.remove(id);
    refreshTransactions();
  };

  const removeBudget = (id: string) => {
    budgetStore.remove(id);
    refreshBudgets();
  };

  return {
    user,
    transactions,
    budgets,
    setUser,
    refreshTransactions,
    refreshBudgets,
    refreshUser,
    addTransaction,
    removeTransaction,
    removeBudget
  };
}
