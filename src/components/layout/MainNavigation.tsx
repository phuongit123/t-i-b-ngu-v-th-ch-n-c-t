import React from 'react';
import { cn } from '@/lib/utils';
import { Search, Moon, Sun, Terminal, Compass, BookOpen, Layers, Download, User, Award } from 'lucide-react';
import type { ThemeMode } from '@/types/design-system';

export interface MainNavigationProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  isMcpConnected?: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  className?: string;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  activeRoute,
  onNavigate,
  isMcpConnected = true,
  theme,
  onToggleTheme,
  onOpenSearch,
  className,
}) => {
  const navItems = [
    { id: 'catalog', label: 'Lộ trình', srText: 'Tracks', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'simulator', label: 'Bộ mô phỏng', srText: 'Simulator', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'capstone', label: 'Đồ án A5', srText: 'Capstone A5', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'encyclopedia', label: 'Bách khoa thư', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'playground', label: 'Thực hành MCP', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'resources', label: 'Tài nguyên', icon: <Download className="w-3.5 h-3.5" /> },
    { id: 'dashboard', label: 'Hồ sơ học tập', icon: <User className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className={cn('sticky top-0 z-40 w-full bg-canvas/80 backdrop-blur-md border-b border-hairline', className)}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-sm"
          >
            <div className="w-6 h-6 rounded-xs bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 flex items-center justify-center font-mono font-bold text-black text-xs shadow-subtle">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-wider uppercase text-zinc-100">
                AFFINITY ACADEMY
              </span>
              <span className="text-[10px] text-zinc-500 tracking-tight font-mono">
                LAYOUT · VECTOR · PIXEL · DESIGN THINKING
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-colors',
                    isActive
                      ? 'text-zinc-100 bg-surface font-semibold shadow-subtle'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface/50'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.srText && <span className="sr-only">{item.srText}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Tools: Search, MCP Status Badge, Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1 text-xs text-zinc-400 bg-surface border border-hairline rounded-sm hover:border-subtle transition-colors"
            aria-label="Mở bảng tìm kiếm lệnh"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Tìm kiếm tài liệu &amp; công cụ...</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded-xs border border-hairline">
              Ctrl+K
            </kbd>
          </button>

          {/* Affinity MCP Live Connection Pill */}
          <div
            className={cn(
              'flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono rounded-full border',
              isMcpConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border-hairline'
            )}
            title={isMcpConnected ? 'Affinity MCP đã kết nối' : 'Máy chủ MCP đang ngoại tuyến'}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                isMcpConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
              )}
            />
            <span className="hidden md:inline">
              {isMcpConnected ? 'MCP: HOẠT ĐỘNG' : 'MCP: NGOẠI TUYẾN'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-surface rounded-sm transition-colors"
            aria-label={`Chuyển sang chế độ ${theme === 'dark' ? 'sáng' : 'tối'}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
