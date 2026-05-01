import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-accent-blue text-white hover:brightness-110 shadow-[0_0_12px_rgba(10,132,255,0.3)]',
    secondary: 'bg-bg-surface text-text-primary border border-border-subtle hover:bg-white/5',
    outline: 'bg-transparent border border-border-subtle text-text-primary hover:bg-white/5',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
    danger: 'text-accent-red hover:underline',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-2.5 text-[11px]',
    lg: 'px-8 py-3.5 text-[13px]',
  };

  return (
    <button 
      className={cn(
        'rounded-lg font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
