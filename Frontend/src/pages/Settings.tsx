import React, { useState } from 'react';
import { userStore, type User } from '@/store/financeStore';

interface SettingsProps {
  user: User;
  onUserChange: (u: User) => void;
}

export function SettingsView({ user, onUserChange }: SettingsProps) {
  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const updated = { name, currency };
    userStore.save(updated);
    onUserChange(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h4 className="text-lg font-bold">Settings</h4>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card">
          <h5 className="text-sm font-bold uppercase tracking-widest mb-4">Profile</h5>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Display Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none focus:border-accent-blue"
            />
          </div>
        </div>
        <div className="card">
          <h5 className="text-sm font-bold uppercase tracking-widest mb-4">Preferences</h5>
          <div>
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1 block">Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full p-2.5 bg-bg-deep rounded-lg border border-border-subtle text-sm text-text-primary outline-none"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="PKR">PKR - Pakistani Rupee</option>
              <option value="AED">AED - UAE Dirham</option>
            </select>
          </div>
        </div>
        <button type="submit" className="px-6 py-2.5 bg-accent-blue text-white font-black text-[11px] uppercase tracking-widest rounded-lg hover:brightness-110 transition-all active:scale-95">
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
