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
  const isLesson = activeRoute === 'lesson';

  return (
    <div className={cn('academy-shell min-h-screen bg-canvas text-primary flex flex-col', className)} data-theme={theme}>
      <a href="#main-content" className="academy-skip">Đến nội dung</a>
      <MainNavigation
        activeRoute={activeRoute}
        onNavigate={onNavigate}
        isMcpConnected={isMcpConnected}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenSearch={onOpenSearch}
      />

      <div
        className={cn(
          'flex-1 flex w-full mx-auto',
          isHome ? 'max-w-none p-0' : 'academy-width'
        )}
      >
        {sidebar}
        <main id="main-content" tabIndex={-1} className={cn('flex-1 min-w-0', isHome ? 'p-0' : isLesson ? 'academy-lesson-main' : 'academy-page')}>
          {children}
        </main>
      </div>

      <footer className="academy-site-footer">
        <div className="academy-width">
          <button type="button" onClick={() => onNavigate('home')}>Affinity Academy</button>
          <p>Học thiết kế với Vector, Pixel và Layout.</p>
          <button type="button" onClick={() => onNavigate('resources')}>Thư viện tài liệu</button>
        </div>
      </footer>
    </div>
  );
};
