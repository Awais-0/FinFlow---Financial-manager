import React from 'react';
import { DollarSign, User as UserIcon, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/store/financeStore';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems: NavItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  user: User;
}

export function Sidebar({ navItems, activeTab, setActiveTab, user }: SidebarProps) {
  return (
    <aside className="w-[220px] bg-bg-surface border-r border-border-subtle hidden lg:flex flex-col sticky top-0 h-screen">
      <div className="p-8 flex items-center gap-3">
        <div className="w-6 h-6 bg-accent-blue rounded-[4px] flex items-center justify-center text-white">
          <DollarSign size={16} />
        </div>
        <span className="text-lg font-extrabold tracking-tighter text-accent-blue uppercase">FinFlow</span>
      </div>
      <nav className="flex-1 px-6 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn('nav-item w-full', activeTab === item.id && 'active')}
          >
            <item.icon size={18} className={cn(activeTab === item.id ? 'text-accent-blue' : 'text-text-secondary')} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-6 mt-auto border-t border-border-subtle">
        <div className="bg-bg-card border border-border-subtle rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center">
              <UserIcon size={16} className="text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-text-primary truncate">{user.name}</p>
              <p className="text-[10px] text-text-secondary truncate">{user.currency}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
