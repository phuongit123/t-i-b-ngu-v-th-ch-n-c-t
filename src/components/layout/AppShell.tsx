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
  const isHome = activeRoute === 'home';

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

      <div className={cn('flex-1 flex w-full mx-auto', isHome ? 'max-w-none p-0' : 'max-w-7xl')}>
        {sidebar}
        <main className={cn('flex-1 overflow-x-hidden min-w-0', isHome ? 'p-0' : 'p-6 md:p-8')}>
          {children}
        </main>
      </div>

      {!isHome && (
        <footer className="border-t border-hairline py-6 text-center text-xs text-zinc-500 font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Affinity Academy &copy; 2026 &bull; Nền tảng học thiết kế đồ họa &amp; tự động hóa tương tác</span>
            <span>66 bài học tương tác &bull; Layout &bull; Vector &bull; Pixel &bull; Tự động hóa</span>
          </div>
        </footer>
      )}
    </div>
  );
};
