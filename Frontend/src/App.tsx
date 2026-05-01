import React, { useState } from 'react';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  TrendingUp,
  Target,
  BookOpen,
  Settings,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useFinanceData } from '@/hooks/useFinanceData';

// Layout
import { AppLayout } from '@/layout/AppLayout';
import { Sidebar } from '@/layout/Sidebar';
import { Header } from '@/layout/Header';

// Components & Pages
import { TransactionForm } from '@/components/TransactionForm';
import { DashboardView } from '@/pages/Dashboard';
import { TransactionsView } from '@/pages/Transactions';
import { BudgetsView } from '@/pages/Budgets';
import { GoalsView } from '@/pages/Goals';
import { EducationView } from '@/pages/Education';
import { SettingsView } from '@/pages/Settings';
import { cn } from '@/lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const { 
    user, 
    transactions, 
    budgets, 
    setUser, 
    refreshTransactions, 
    removeTransaction, 
    removeBudget 
  } = useFinanceData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentTitle = navItems.find(i => i.id === activeTab)?.label || 'FinFlow';

  return (
    <AppLayout
      sidebar={
        <Sidebar 
          navItems={navItems} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
        />
      }
      header={
        <Header 
          title={currentTitle} 
          currency={user.currency} 
          onAddClick={() => setShowTransactionForm(true)} 
        />
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && <DashboardView transactions={transactions} currency={user.currency} />}
          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              currency={user.currency}
              onAdd={() => setShowTransactionForm(true)}
              onDelete={removeTransaction}
            />
          )}
          {activeTab === 'budgets' && (
            <BudgetsView budgets={budgets} currency={user.currency} onDelete={removeBudget} />
          )}
          {activeTab === 'investments' && (
            <div className="card text-center py-12">
              <TrendingUp size={48} className="mx-auto mb-4 text-accent-blue" />
              <h4 className="text-xl font-extrabold mb-2">Investments</h4>
              <p className="text-text-secondary text-sm">Track your investment portfolio and performance.</p>
            </div>
          )}
          {activeTab === 'goals' && <GoalsView />}
          {activeTab === 'education' && <EducationView />}
          {activeTab === 'settings' && (
            <SettingsView
              user={user}
              onUserChange={setUser}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSuccess={refreshTransactions}
        />
      )}
    </AppLayout>
  );
}
