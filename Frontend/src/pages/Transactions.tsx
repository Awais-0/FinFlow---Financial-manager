import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { type Transaction } from '@/store/financeStore';

interface TransactionsProps {
  transactions: Transaction[];
  currency: string;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export function TransactionsView({
  transactions,
  currency,
  onAdd,
  onDelete,
}: TransactionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-bg-surface p-6 rounded-[12px] border border-border-subtle">
        <div>
          <h4 className="text-base font-bold text-text-primary uppercase tracking-tight mb-1">Transactions</h4>
          <p className="text-[12px] text-text-secondary font-medium">Manage your transaction history</p>
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 bg-accent-blue hover:brightness-110 text-white px-5 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(10,132,255,0.3)] active:scale-95">
          <Plus size={16} />
          Add Transaction
        </button>
      </div>
      <div className="card">
        {transactions.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-8">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-[1px] border-b border-border-subtle">
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-semibold text-xs text-text-primary">{t.description || '—'}</td>
                    <td className="py-3 text-[11px] text-text-secondary">{t.category}</td>
                    <td className="py-3 text-[11px] font-bold text-text-secondary uppercase">{t.type}</td>
                    <td className="py-3 text-[11px] text-text-secondary">{new Date(t.date).toLocaleDateString()}</td>
                    <td className={cn('py-3 text-right font-mono font-bold text-xs', t.type === 'income' ? 'text-accent-green' : 'text-accent-red')}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                    </td>
                    <td className="py-3 pl-3">
                      <button onClick={() => onDelete(t.id)} className="text-text-secondary hover:text-accent-red transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
