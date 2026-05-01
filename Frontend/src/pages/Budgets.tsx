import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { budgetStore, type Budget } from '@/store/financeStore';

interface BudgetsProps {
  budgets: Budget[];
  currency: string;
  onDelete: (id: string) => void;
}

export function BudgetsView({ budgets, currency, onDelete }: BudgetsProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [, forceUpdate] = useState(0);

  function handleAddBudget(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount) return;
    budgetStore.add({ category_name: name, amount: parseFloat(amount), period });
    setName(''); setAmount(''); setShowForm(false);
    forceUpdate(n => n + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold">Budgets</h4>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-accent-blue text-white px-5 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95">
          <Plus size={16} />
          Add Budget
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h5 className="text-xs font-bold uppercase tracking-widest mb-4">New Budget</h5>
          <form onSubmit={handleAddBudget} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Category</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Travel" required className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none focus:border-accent-blue" />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Amount</label>
              <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none focus:border-accent-blue" />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Period</label>
              <select value={period} onChange={e => setPeriod(e.target.value as any)} className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none">
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <button type="submit" className="py-2.5 px-5 bg-accent-blue text-white font-black text-[11px] uppercase tracking-widest rounded-lg hover:brightness-110 transition-all">Save</button>
          </form>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="card">
          <p className="text-text-secondary text-sm">No budgets set up yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6">Budget Distribution</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgets}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                  <XAxis dataKey="category_name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '8px', border: '1px solid #2C2C2E' }} />
                  <Bar dataKey="amount" fill="#0A84FF" radius={[4, 4, 0, 0]} barSize={40} name="Budget" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6">Budget List</h4>
            <div className="space-y-3">
              {budgets.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border border-border-subtle/50 group">
                  <div>
                    <p className="font-bold text-sm text-text-primary">{b.category_name}</p>
                    <p className="text-[10px] text-text-secondary uppercase">{b.period}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-mono font-bold text-sm text-text-primary">{formatCurrency(b.amount, currency)}</p>
                    <button onClick={() => onDelete(b.id)} className="text-text-secondary hover:text-accent-red transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
