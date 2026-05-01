import React, { useState } from 'react';
import { transactionStore } from '@/store/financeStore';

interface TransactionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [error, setError] = useState('');

  const categories = type === 'expense'
    ? ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Other']
    : ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    transactionStore.add({
      amount: parsed,
      type,
      description,
      date: new Date().toISOString().split('T')[0],
      category,
    });
    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="card w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Add Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Type</label>
            <select
              value={type}
              onChange={e => { setType(e.target.value as 'income' | 'expense'); setCategory(''); }}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none focus:border-accent-blue"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none focus:border-accent-blue"
              placeholder="What's this for?"
            />
          </div>
          {error && <p className="text-accent-red text-xs">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border-subtle rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-accent-blue text-white font-black text-[11px] uppercase tracking-widest rounded-lg hover:brightness-110 transition-all">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
