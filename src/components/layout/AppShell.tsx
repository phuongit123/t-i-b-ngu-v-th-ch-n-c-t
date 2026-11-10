import React from 'react';
import { cn } from '@/lib/utils';
import { MainNavigation } from './MainNavigation';
import type { ThemeMode } from '@/types/design-system';

export interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  isMcpConnected?: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebar,
  activeRoute,
  onNavigate,
  isMcpConnected = true,
  theme,
  onToggleTheme,
  onOpenSearch,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-canvas text-primary flex flex-col', className)} data-theme={theme}>
      <MainNavigation
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        isMcpConnected={isMcpConnected}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenSearch={onOpenSearch}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {sidebar}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>

      <footer className="border-t border-hairline py-6 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AFFINITY ACADEMY &copy; 2026 &mdash; MASTERO &amp; MINIMALISM</span>
          <span>SERIF AFFINITY 3.0 &bull; JAVASCRIPT DOM SCRIPTING &bull; MCP ENGINE</span>
        </div>
      </footer>
    </div>
  );
};
