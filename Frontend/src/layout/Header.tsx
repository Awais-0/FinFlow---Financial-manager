import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  title: string;
  currency: string;
  onAddClick: () => void;
}

export function Header({ title, currency, onAddClick }: HeaderProps) {
  return (
    <header className="h-16 bg-bg-deep/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 border-b border-border-subtle">
      <h1 className="text-lg font-bold tracking-tight text-text-primary">
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-[12px] font-medium text-text-secondary hidden md:block tracking-wide uppercase">{currency}</span>
        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 bg-accent-blue text-white px-4 py-1.5 rounded-lg font-black text-[11px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-[0_0_12px_rgba(10,132,255,0.3)]"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </header>
  );
}
