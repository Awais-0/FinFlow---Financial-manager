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
  Globe
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
  Bar
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency } from './lib/utils';

// Mock Data
const MOCK_DATA = {
  balance: 12450.80,
  monthlyIncome: 4500,
  monthlyExpenses: 2840,
  savingsGoal: 20000,
  currentSavings: 8500,
  currency: 'USD',
  chartData: [
    { name: 'Mon', income: 150, expenses: 80 },
    { name: 'Tue', income: 200, expenses: 120 },
    { name: 'Wed', income: 100, expenses: 250 },
    { name: 'Thu', income: 300, expenses: 100 },
    { name: 'Fri', income: 450, expenses: 200 },
    { name: 'Sat', income: 50, expenses: 150 },
    { name: 'Sun', income: 80, expenses: 60 },
  ],
  transactions: [
    { id: 1, name: 'Grocery Store', amount: -84.20, category: 'Food', date: '2024-03-18' },
    { id: 2, name: 'Salary Deposit', amount: 2200.00, category: 'Income', date: '2024-03-15' },
    { id: 3, name: 'Netflix', amount: -15.99, category: 'Subscription', date: '2024-03-14' },
    { id: 4, name: 'Electricity Bill', amount: -120.00, category: 'Utilities', date: '2024-03-12' },
  ],
  investments: [
    { name: 'VTI Index Fund', value: 8400, change: 12.5 },
    { name: 'Bitcoin', value: 2100, change: 4.2 },
    { name: 'Apple Inc.', value: 1500, change: -1.8 },
  ],
  budgets: [
    { category: 'Food', limit: 500, spent: 420 },
    { category: 'Transport', limit: 200, spent: 180 },
    { category: 'Entertainment', limit: 150, spent: 40 },
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState<string[]>([]);
  const [streak] = useState(12); // Gamification

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

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
      {/* Sidebar */}
      <aside className="w-[220px] bg-bg-surface border-r border-border-subtle hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-6 h-6 bg-accent-blue rounded-[4px] flex items-center justify-center text-white">
            <DollarSign size={16} />
          </div>
          <span className="text-lg font-extrabold tracking-tighter text-accent-blue uppercase">Finsight</span>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "nav-item w-full",
                activeTab === item.id && "active"
              )}
            >
              <item.icon size={18} className={cn(activeTab === item.id ? "text-accent-blue" : "text-text-secondary")} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-border-subtle">
          <div className="bg-bg-card border border-border-subtle rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">XP Progress</span>
              <span className="xp-badge">LVL {streak}</span>
            </div>
            <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
              <div className="h-full bg-accent-orange w-3/4 rounded-full" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden min-h-screen bg-bg-deep">
        {/* Topbar */}
        <header className="h-16 bg-bg-deep/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-8 border-b border-border-subtle">
          <h1 className="text-lg font-bold tracking-tight text-text-primary">
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="user-profile flex items-center gap-4">
            <span className="text-[12px] font-medium text-text-secondary hidden md:block tracking-wide uppercase">USD • EUR • GBP</span>
            <div className="relative">
              <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-red rounded-full shadow-[0_0_8px_rgba(255,69,58,0.5)]" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-border-subtle">
              <span className="text-sm font-medium text-text-primary hidden sm:block">Alex Sterling</span>
              <div className="w-8 h-8 rounded-full bg-accent-blue overflow-hidden cursor-pointer ring-2 ring-border-subtle ring-offset-2 ring-offset-bg-deep">
                <img 
                  src="https://picsum.photos/seed/user/100/100" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
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
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'budgets' && <BudgetsView />}
            {activeTab === 'investments' && <InvestmentsView />}
            {activeTab === 'education' && <EducationView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card">
          <div className="stat-label">Total Net Worth</div>
          <div className="flex items-baseline justify-between">
            <h3 className="stat-value">{formatCurrency(142500.42)}</h3>
            <span className="text-[12px] font-bold text-accent-green">
              +4.2%
            </span>
          </div>
          <p className="text-[10px] text-text-secondary mt-1 font-medium italic">this month</p>
        </div>
        <div className="card">
          <div className="stat-label">Available Cash</div>
          <h3 className="stat-value">{formatCurrency(MOCK_DATA.balance)}</h3>
          <p className="text-[10px] text-text-secondary mt-1 font-medium uppercase tracking-tight">Across 4 accounts</p>
        </div>
        <div className="card">
          <div className="stat-label">Investments</div>
          <div className="flex items-baseline justify-between">
            <h3 className="stat-value">{formatCurrency(98400.12)}</h3>
            <span className="text-[12px] font-bold text-accent-green">
              +8.1%
            </span>
          </div>
          <p className="text-[10px] text-text-secondary mt-1 font-medium uppercase tracking-tight">YTD</p>
        </div>
        <div className="card">
          <div className="stat-label">Debt Ratio</div>
          <h3 className="stat-value">18.4%</h3>
          <p className="text-[10px] text-accent-green mt-1 font-bold uppercase tracking-widest">Low Risk Level</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-base font-bold text-text-primary">Portfolio Growth</h2>
              <p className="text-[12px] text-text-secondary">Projected performance vs goal</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-accent-blue" /> Income
              </span>
              <span className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-accent-red" /> Expenses
              </span>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA.chartData}>
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '8px', border: '1px solid #2C2C2E', color: '#FFF' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="income" stroke="#0A84FF" strokeWidth={2} fillOpacity={1} fill="url(#colorBlue)" />
                <Area type="monotone" dataKey="expenses" stroke="#FF453A" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals / Savings */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-tighter">Savings Goal: Tesla Model 3</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-text-secondary">$34,200 / $50,000</span>
              <span className="text-sm font-black text-accent-blue">68%</span>
            </div>
            <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-green rounded-full shadow-[0_0_10px_rgba(48,209,88,0.4)]"
                style={{ width: '68%' }}
              />
            </div>
          </div>

          <div className="card flex-1 flex flex-col justify-center bg-gradient-to-br from-bg-card to-border-subtle">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-tighter">Critical Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent-red/10 border border-accent-red/20">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-red" />
                  <span className="text-xs font-semibold">Dining Overage</span>
                </div>
                <span className="text-[10px] font-bold bg-accent-red/20 text-accent-red px-2 py-0.5 rounded">-$150.00</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-accent-orange/10 border border-accent-orange/20">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-orange" />
                <span className="text-xs font-semibold">Rent due in 2d</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Recent Transactions</h4>
            <button className="text-[11px] font-bold text-accent-blue uppercase hover:underline underline-offset-4">View History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-[1px] border-b border-border-subtle">
                  <th className="pb-3">Asset / Desc</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {MOCK_DATA.transactions.map((t) => (
                  <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-3">
                      <span className="font-semibold text-xs text-text-primary">{t.name}</span>
                    </td>
                    <td className="py-3 text-[11px] font-bold text-text-secondary uppercase">{t.category}</td>
                    <td className={cn(
                      "py-3 text-right font-mono font-bold text-xs",
                      t.amount > 0 ? "text-accent-green" : "text-text-primary"
                    )}>
                      {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card bg-gradient-to-tr from-bg-card to-[#2C2C2E]">
          <div className="flex justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-tighter">Debt Reduction Strategy</h3>
            <span className="text-[10px] font-bold text-accent-blue uppercase">Snowball Method</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl border border-border-subtle bg-bg-deep/50">
               <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">Auto Loan</div>
               <div className="text-xl font-bold font-mono">$4,500.00</div>
            </div>
            <div className="p-4 rounded-xl border border-border-subtle bg-bg-deep/50">
               <div className="text-[9px] font-bold text-text-secondary uppercase mb-1">Credit Card A</div>
               <div className="text-xl font-bold font-mono">$1,200.00</div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[11px] font-bold text-text-secondary uppercase italic">Estimated Freedom: Oct 2026</p>
            <button className="bg-accent-blue text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all">
              Make Extra Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionsView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-bg-surface p-6 rounded-[12px] border border-border-subtle">
        <div>
          <h4 className="text-base font-bold text-text-primary uppercase tracking-tight mb-1">Add Transaction</h4>
          <p className="text-[12px] text-text-secondary font-medium">Record a new manual entry for your ledger</p>
        </div>
        <button className="flex items-center gap-2 bg-accent-blue hover:brightness-110 text-white px-5 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(10,132,255,0.3)] active:scale-95">
          <Plus size={16} />
          Create Entry
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card h-fit sticky top-24">
            <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-4">Filters</h5>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2 block">Category</label>
                <select className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-[13px] text-text-primary outline-none focus:border-accent-blue transition-all">
                  <option>All Categories</option>
                  <option>Food</option>
                  <option>Income</option>
                  <option>Transport</option>
                </select>
              </div>
              <button className="w-full py-2.5 text-accent-blue font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 rounded-lg transition-colors">
                Clear All
              </button>
            </div>
         </div>
         <div className="md:col-span-2 card">
            <h5 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6">Historical Ledger</h5>
            <div className="space-y-3">
              {MOCK_DATA.transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-border-subtle/50 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-bg-surface flex items-center justify-center text-text-secondary font-bold font-mono">
                      $
                    </div>
                    <div>
                      <p className="font-bold text-sm text-text-primary tracking-tight">{t.name}</p>
                      <p className="text-[10px] text-text-secondary font-bold uppercase">{t.category} • {t.date}</p>
                    </div>
                  </div>
                  <p className={cn(
                    "font-bold font-mono text-sm",
                    t.amount > 0 ? "text-accent-green" : "text-text-primary"
                  )}>
                    {formatCurrency(t.amount)}
                  </p>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function BudgetsView() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6">Budget Distribution</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA.budgets}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8E8E93', fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '8px', border: '1px solid #2C2C2E' }} />
                <Bar dataKey="spent" fill="#0A84FF" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="limit" fill="#2C2C2E" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card education-banner border-none text-white flex flex-col justify-center">
          <Globe className="mb-4 text-accent-blue" size={40} />
          <h4 className="text-2xl font-extrabold tracking-tighter mb-2 uppercase">Financial Intelligence</h4>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm font-medium">
            Connect international bank accounts or manually add multi-currency transactions for unified reporting.
          </p>
          <button className="mt-6 self-start px-6 py-2.5 bg-accent-blue text-white font-black text-[11px] uppercase tracking-[2px] rounded-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(10,132,255,0.2)]">
            Configure FX
          </button>
        </div>
      </div>
    </div>
  );
}

function InvestmentsView() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card col-span-2">
          <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6">Portfolio Intelligence</h4>
          <div className="space-y-5">
            {MOCK_DATA.investments.map((inv) => (
              <div key={inv.name} className="flex items-center justify-between p-2 hover:bg-white/[0.02] rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-bg-surface flex items-center justify-center">
                    <TrendingUp size={18} className="text-accent-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-text-primary tracking-tight">{inv.name}</p>
                    <p className="text-[10px] text-text-secondary font-bold uppercase">Asset Class: General</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold font-mono text-sm text-text-primary">{formatCurrency(inv.value)}</p>
                  <p className={cn(
                    "text-[11px] font-black flex items-center justify-end gap-1 uppercase tracking-tight",
                    inv.change > 0 ? "text-accent-green" : "text-accent-red"
                  )}>
                    {inv.change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(inv.change)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card bg-gradient-to-br from-bg-card to-[#121212]">
          <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6 border-b border-border-subtle pb-3">Operational Risk</h4>
          <div className="space-y-5">
            <div className="p-4 rounded-xl border border-accent-orange/20 bg-accent-orange/5">
              <h5 className="text-[10px] font-black text-accent-orange uppercase tracking-widest mb-1">Debt Exposure</h5>
              <div className="text-xl font-bold font-mono text-text-primary">$5,700.00</div>
            </div>
            <div className="p-4 rounded-xl border border-accent-blue/20 bg-accent-blue/5">
              <h5 className="text-[10px] font-black text-accent-blue uppercase tracking-widest mb-1">Leverage Ratio</h5>
              <div className="text-xl font-bold font-mono text-text-primary">1.2x</div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 bg-bg-deep rounded-lg border border-border-subtle text-[11px] font-black uppercase tracking-[2px] hover:border-accent-blue/50 transition-all active:scale-95 text-text-secondary hover:text-text-primary">
            Risk Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

function EducationView() {
  const resources = [
    { title: "Budgeting 101", desc: "Master the 50/30/20 rule for your finances.", icon: Wallet },
    { title: "Investing for Beginners", desc: "Understanding stocks, bonds, and indexes.", icon: TrendingUp },
    { title: "Debt Management", desc: "Strategies to pay off debt faster and save on interest.", icon: ArrowDownRight },
    { title: "Compound Interest", desc: "The secret to long-term wealth building.", icon: Award },
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
            <p className="text-[13px] text-text-secondary leading-relaxed mb-6 font-medium">
              {res.desc}
            </p>
            <div className="flex items-center gap-2 text-accent-blue font-bold text-[11px] uppercase tracking-widest">
              Read Module <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

