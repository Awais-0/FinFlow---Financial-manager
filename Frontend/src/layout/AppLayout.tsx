import React from 'react';

interface AppLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}

export function AppLayout({ sidebar, header, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {sidebar}
      <main className="flex-1 overflow-x-hidden min-h-screen bg-bg-deep">
        {header}
        <div className="p-6 max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
