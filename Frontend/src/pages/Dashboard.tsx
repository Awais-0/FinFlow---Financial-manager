import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';
import { type Transaction } from '@/store/financeStore';

interface DashboardProps {
  transactions: Transaction[];
  currency: string;
}

export function DashboardView({ transactions, currency }: DashboardProps) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const chartData = transactions.slice(0, 7).reverse().map(t => ({
    name: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
    income: t.type === 'income' ? t.amount : 0,
    expenses: t.type === 'expense' ? t.amount : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card">
          <div className="stat-label">Balance</div>
          <h3 className={cn('stat-value', balance >= 0 ? 'text-accent-green' : 'text-accent-red')}>{formatCurrency(balance, currency)}</h3>
          <p className="text-[10px] text-text-secondary mt-1 font-medium italic">Current balance</p>
        </div>
        <div className="card">
          <div className="stat-label">Income</div>
          <h3 className="stat-value text-accent-green">{formatCurrency(totalIncome, currency)}</h3>
          <p className="text-[10px] text-text-secondary mt-1 font-medium uppercase">Total income</p>
        </div>
        <div className="card">
          <div className="stat-label">Expenses</div>
          <h3 className="stat-value text-accent-red">{formatCurrency(totalExpenses, currency)}</h3>
          <p className="text-[10px] text-text-secondary mt-1 font-medium uppercase">Total expenses</p>
        </div>
        <div className="card">
          <div className="stat-label">Transactions</div>
          <h3 className="stat-value">{transactions.length}</h3>
          <p className="text-[10px] text-text-secondary mt-1 font-medium uppercase">Total count</p>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <h2 className="text-base font-bold text-text-primary mb-4">Recent Activity</h2>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF453A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF453A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '8px', border: '1px solid #2C2C2E', color: '#FFF' }} />
                <Area type="monotone" dataKey="income" stroke="#0A84FF" strokeWidth={2} fill="url(#colorBlue)" />
                <Area type="monotone" dataKey="expenses" stroke="#FF453A" strokeWidth={2} fill="url(#colorRed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card">
        <h4 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">Recent Transactions</h4>
        {transactions.length === 0 ? (
          <p className="text-text-secondary text-sm">No transactions yet. Add one to get started.</p>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border-subtle/50">
                <div>
                  <p className="font-semibold text-xs text-text-primary">{t.description || t.category}</p>
                  <p className="text-[10px] text-text-secondary">{new Date(t.date).toLocaleDateString()} · {t.category}</p>
                </div>
                <p className={cn('font-mono font-bold text-xs', t.type === 'income' ? 'text-accent-green' : 'text-accent-red')}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
