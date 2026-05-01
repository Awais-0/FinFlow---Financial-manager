import React from 'react';
import { Target, Plus } from 'lucide-react';

export function GoalsView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold">Financial Goals</h4>
        <button className="flex items-center gap-2 bg-accent-blue text-white px-5 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all">
          <Plus size={16} />
          Add Goal
        </button>
      </div>
      <div className="card bg-gradient-to-br from-bg-card to-[#2C2C2E] text-center py-12">
        <Target size={48} className="mx-auto mb-4 text-accent-blue" />
        <h4 className="text-xl font-extrabold tracking-tighter mb-2">Set Your Goals</h4>
        <p className="text-text-secondary text-sm max-w-md mx-auto">
          Create financial goals to track your progress towards major purchases, savings targets, and debt reduction.
        </p>
      </div>
    </div>
  );
}
