import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  TrendingUp,
  Target,
  BookOpen,
  Settings,
  Plus,
  Bell,
  Moon,
  Sun,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Globe,
  LogOut,
  User,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from './lib/utils';
import { authApi, financeApi } from './services/api';

// --- Auth Page ---
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = isLogin
        ? await authApi.login(email, password)
        : await authApi.register(email, password, name);
      if (res.error) throw new Error(res.error);
      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-accent-blue rounded-[4px] flex items-center justify-center text-white">
            <DollarSign size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tighter text-accent-blue uppercase">FinFlow</span>
        </div>
        <h2 className="text-lg font-bold mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none focus:border-accent-blue"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none focus:border-accent-blue"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none focus:border-accent-blue"
              placeholder="••••••"
              required
              minLength={6}
            />
          </div>
          {error && <p className="text-accent-red text-xs font-semibold">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent-blue text-white font-black text-[11px] uppercase tracking-[2px] rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-xs text-text-secondary mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="ml-1 text-accent-blue font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

// --- Transaction Form Modal ---
function TransactionForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await financeApi.addTransaction({
        amount: parseFloat(amount),
        type,
        description,
        date: new Date().toISOString().split('T')[0],
        category_id: 1,
        account_id: 1,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
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
              onChange={e => setType(e.target.value as 'income' | 'expense')}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
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
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-accent-blue text-white font-black text-[11px] uppercase tracking-widest rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Dashboard View ---
function DashboardView({ transactions, currency }: { transactions: any[]; currency: string }) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const balance = totalIncome - totalExpenses;

  const chartData = transactions.slice(0, 7).reverse().map(t => ({
    name: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
    income: t.type === 'income' ? parseFloat(t.amount) : 0,
    expenses: t.type === 'expense' ? parseFloat(t.amount) : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card">
          <div className="stat-label">Balance</div>
          <h3 className="stat-value">{formatCurrency(balance, currency)}</h3>
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
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '8px', border: '1px solid #2C2C2E', color: '#FFF' }} />
                <Area type="monotone" dataKey="income" stroke="#0A84FF" strokeWidth={2} fill="url(#colorBlue)" />
                <Area type="monotone" dataKey="expenses" stroke="#FF453A" strokeWidth={2} fillOpacity={0} />
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
                  <p className="font-semibold text-xs text-text-primary">{t.description || 'No description'}</p>
                  <p className="text-[10px] text-text-secondary">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <p className={cn('font-mono font-bold text-xs', t.type === 'income' ? 'text-accent-green' : 'text-text-primary')}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(t.amount), currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Transactions View ---
function TransactionsView({ transactions, currency, onAdd }: { transactions: any[]; currency: string; onAdd: () => void }) {
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
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-semibold text-xs text-text-primary">{t.description || 'N/A'}</td>
                    <td className="py-3 text-[11px] font-bold text-text-secondary uppercase">{t.type}</td>
                    <td className="py-3 text-[11px] text-text-secondary">{new Date(t.date).toLocaleDateString()}</td>
                    <td className={cn('py-3 text-right font-mono font-bold text-xs', t.type === 'income' ? 'text-accent-green' : 'text-accent-red')}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(t.amount), currency)}
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

// --- Budgets View ---
function BudgetsView({ budgets, currency }: { budgets: any[]; currency: string }) {
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-bold">Budgets</h4>
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
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border border-border-subtle/50">
                  <div>
                    <p className="font-bold text-sm text-text-primary">{b.category_name}</p>
                    <p className="text-[10px] text-text-secondary uppercase">{b.period}</p>
                  </div>
                  <p className="font-mono font-bold text-sm text-text-primary">{formatCurrency(parseFloat(b.amount), currency)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Goals View ---
function GoalsView({ currency }: { currency: string }) {
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

// --- Education View ---
function EducationView() {
  const resources = [
    { title: 'Budgeting 101', desc: 'Master the 50/30/20 rule for your finances.', icon: Wallet },
    { title: 'Investing for Beginners', desc: 'Understanding stocks, bonds, and indexes.', icon: TrendingUp },
    { title: 'Debt Management', desc: 'Strategies to pay off debt faster and save on interest.', icon: ArrowDownRight },
    { title: 'Compound Interest', desc: 'The secret to long-term wealth building.', icon: Award },
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-2xl">
        <h4 className="text-3xl font-extrabold tracking-tighter mb-4 text-text-primary uppercase">Financial Intelligence</h4>
        <p className="text-base text-text-secondary leading-relaxed font-medium">
          Unlock your potential with our curated financial modules. Knowledge is the foundation of high-performance wealth management.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {resources.map((res) => (
          <div key={res.title} className="card group cursor-pointer hover:border-accent-blue/50 bg-gradient-to-br from-bg-card to-bg-surface">
            <div className="w-12 h-12 rounded-xl bg-bg-deep flex items-center justify-center text-accent-blue mb-6 group-hover:bg-accent-blue group-hover:text-white transition-all duration-300">
              <res.icon size={22} />
            </div>
            <h5 className="text-base font-bold mb-2 uppercase tracking-tight text-text-primary">{res.title}</h5>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-6 font-medium">{res.desc}</p>
            <div className="flex items-center gap-2 text-accent-blue font-bold text-[11px] uppercase tracking-widest">
              Read Module <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Settings View ---
function SettingsView({ user, currency, onLogout }: { user: any; currency: string; onLogout: () => void }) {
  const [newCurrency, setNewCurrency] = useState(currency);

  return (
    <div className="space-y-6 max-w-2xl">
      <h4 className="text-lg font-bold">Settings</h4>
      <div className="card">
        <h5 className="text-sm font-bold uppercase tracking-widest mb-4">Profile</h5>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Name</label>
            <input value={user?.name || ''} disabled className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Email</label>
            <input value={user?.email || ''} disabled className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none" />
          </div>
        </div>
      </div>
      <div className="card">
        <h5 className="text-sm font-bold uppercase tracking-widest mb-4">Preferences</h5>
        <div>
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Currency</label>
          <select
            value={newCurrency}
            onChange={e => setNewCurrency(e.target.value)}
            className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="PKR">PKR - Pakistani Rupee</option>
          </select>
        </div>
      </div>
      <div className="card">
        <button onClick={onLogout} className="flex items-center gap-2 text-accent-red font-bold text-sm hover:underline">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const isAuthenticated = !!token;

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    async function loadUserAndData() {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        const [txRes, budRes] = await Promise.all([
          financeApi.getTransactions(),
          financeApi.getBudgets(),
        ]);
        setTransactions(Array.isArray(txRes) ? txRes : []);
        setBudgets(Array.isArray(budRes) ? budRes : []);
      } catch (err: any) {
        if (err.message?.includes('401') || err.message?.includes('403')) {
          handleLogout();
        } else {
          console.error('Failed to load data', err);
        }
      } finally {
        setLoading(false);
      }
    }
    loadUserAndData();
  }, [token]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setTransactions([]);
    setBudgets([]);
  }

  function handleTransactionAdded() {
    financeApi.getTransactions().then(res => setTransactions(Array.isArray(res) ? res : []));
  }

  if (!isAuthenticated) return <AuthPage />;
  if (loading) return <div className="min-h-screen bg-bg-deep flex items-center justify-center text-text-secondary">Loading...</div>;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
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
                <User size={16} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-text-primary truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-text-secondary truncate">{user?.email || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden min-h-screen bg-bg-deep">
        <header className="h-16 bg-bg-deep/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 border-b border-border-subtle">
          <h1 className="text-lg font-bold tracking-tight text-text-primary">
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-medium text-text-secondary hidden md:block tracking-wide uppercase">{currency}</span>
            <button onClick={handleLogout} className="p-2 rounded-lg text-text-secondary hover:text-accent-red transition-colors" title="Sign out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 max-w-[1200px] mx-auto"
          >
            {activeTab === 'dashboard' && <DashboardView transactions={transactions} currency={currency} />}
            {activeTab === 'transactions' && <TransactionsView transactions={transactions} currency={currency} onAdd={() => setShowTransactionForm(true)} />}
            {activeTab === 'budgets' && <BudgetsView budgets={budgets} currency={currency} />}
            {activeTab === 'investments' && (
              <div className="card text-center py-12">
                <TrendingUp size={48} className="mx-auto mb-4 text-accent-blue" />
                <h4 className="text-xl font-extrabold mb-2">Investments</h4>
                <p className="text-text-secondary text-sm">Track your investment portfolio and performance.</p>
              </div>
            )}
            {activeTab === 'goals' && <GoalsView currency={currency} />}
            {activeTab === 'education' && <EducationView />}
            {activeTab === 'settings' && <SettingsView user={user} currency={currency} onLogout={handleLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSuccess={handleTransactionAdded}
        />
      )}
    </div>
  );
}
