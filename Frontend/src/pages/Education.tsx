import React from 'react';
import { Wallet, TrendingUp, ArrowDownRight, Award, ChevronRight } from 'lucide-react';

export function EducationView() {
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
