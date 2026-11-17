import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  Moon,
  Sun,
  Terminal,
  Compass,
  BookOpen,
  Layers,
  Download,
  User,
  Award,
  Trophy,
  Menu,
  X,
  Settings,
  HelpCircle,
  Cloud,
  CloudOff,
  RefreshCw,
} from 'lucide-react';
import type { ThemeMode } from '@/types/design-system';
import { useAuth } from '@/lib/supabase/auth-context';
import { subscribeSyncStatus, type SyncStatus } from '@/lib/supabase/progress-sync';
import { AuthModal } from '@/components/auth/AuthModal';

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
  theme,
  onToggleTheme,
  onOpenSearch,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  const { user, profile, role } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeSyncStatus((status) => {
      setSyncStatus(status);
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { id: 'catalog', label: 'Lộ trình', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'simulator', label: 'Bộ mô phỏng', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'challenges', label: 'Thử thách', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'knowledge', label: 'Tri thức', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'capstone', label: 'Đồ án', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'encyclopedia', label: 'Bách khoa thư', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'playground', label: 'Tự động hóa', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'resources', label: 'Tài nguyên', icon: <Download className="w-3.5 h-3.5" /> },
    { id: 'dashboard', label: 'Hồ sơ', icon: <User className="w-3.5 h-3.5" /> },
  ];

  const handleNavClick = (routeId: string) => {
    onNavigate(routeId);
    setIsMobileMenuOpen(false);
  };

  const getSyncBadge = () => {
    switch (syncStatus) {
      case 'syncing':
        return (
          <div
            data-testid="sync-status-badge"
            title="Đang đồng bộ tiến độ"
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3 h-3 animate-spin text-blue-400 shrink-0" />
            <span className="hidden 2xl:inline">ĐỒNG BỘ...</span>
          </div>
        );
      case 'pending':
        return (
          <div
            data-testid="sync-status-badge"
            title="Đang chờ lưu tiến độ"
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap shrink-0"
          >
            <Cloud className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="hidden 2xl:inline">CHỜ LƯU</span>
          </div>
        );
      case 'offline':
        return (
          <div
            data-testid="sync-status-badge"
            title="Chế độ lưu ngoại tuyến trên trình duyệt"
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono rounded-full bg-zinc-800 text-zinc-400 border border-hairline whitespace-nowrap shrink-0"
          >
            <CloudOff className="w-3 h-3 text-zinc-500 shrink-0" />
            <span className="hidden 2xl:inline">NGOẠI TUYẾN</span>
          </div>
        );
      case 'error':
        return (
          <div
            data-testid="sync-status-badge"
            title="Lỗi đồng bộ đám mây"
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono rounded-full bg-red-500/10 text-red-400 border border-red-500/30 whitespace-nowrap shrink-0"
          >
            <CloudOff className="w-3 h-3 text-red-400 shrink-0" />
            <span className="hidden 2xl:inline">LỖI ĐỒNG BỘ</span>
          </div>
        );
      case 'synced':
      default:
        return (
          <div
            data-testid="sync-status-badge"
            title="Đã đồng bộ tiến độ học tập"
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0"
          >
            <Cloud className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="hidden 2xl:inline">ĐÃ ĐỒNG BỘ</span>
          </div>
        );
    }
  };

  return (
    <header className={cn('sticky top-0 z-40 w-full border-b border-hairline bg-canvas/85 backdrop-blur-md', className)}>
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            type="button"
            data-testid="nav-home"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none whitespace-nowrap shrink-0"
            aria-label="Về trang chủ Affinity Academy"
          >
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-subtle group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <span className="font-serif font-black text-sm text-zinc-950 tracking-tighter">A</span>
            </div>
            <div className="leading-tight min-w-0">
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase font-mono text-zinc-200 block">
                AFFINITY<span className="text-amber-400 font-bold ml-1">ACADEMY</span>
              </span>
              <span className="hidden sm:block text-[9px] text-zinc-400 uppercase tracking-widest font-mono">
                Học Viện Đồ Họa
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                activeRoute === item.id ||
                (item.id === 'knowledge' &&
                  ['search', 'shortcuts', 'cheatsheet', 'glossary'].includes(activeRoute)) ||
                (item.id === 'simulator' && activeRoute === 'sandbox');

              return (
                <button
                  type="button"
                  key={item.id}
                  data-testid={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xs transition-colors whitespace-nowrap shrink-0',
                    isActive
                      ? 'text-zinc-100 bg-surface font-semibold shadow-subtle'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface/50'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Tools: Search, Cloud Sync, Auth/Profile, Settings, Theme */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs text-zinc-400 bg-surface border border-hairline rounded-sm hover:border-subtle transition-colors whitespace-nowrap shrink-0"
            aria-label="Mở bảng tìm kiếm lệnh"
            title="Tìm kiếm nhanh (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="hidden 2xl:inline">Tìm kiếm...</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded-xs border border-hairline">
              Ctrl+K
            </kbd>
          </button>

          {getSyncBadge()}

          <button
            type="button"
            data-testid="nav-auth-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-medium rounded-sm border transition-colors bg-surface border-hairline hover:border-amber-500/40 text-zinc-300 hover:text-zinc-100 whitespace-nowrap shrink-0"
            aria-label="Tài khoản và hồ sơ học viên"
          >
            <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
              {(profile?.display_name || user?.email || 'H')[0].toUpperCase()}
            </div>
            <span className="hidden md:inline max-w-[96px] truncate">
              {profile?.display_name || (user?.email ? user.email.split('@')[0] : 'Đăng nhập')}
            </span>
            {role !== 'student' && (
              <span className="hidden 2xl:inline px-1 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                {role === 'evaluator' ? 'Giám khảo' : 'Quản trị'}
              </span>
            )}
          </button>

          <button
            type="button"
            data-testid="nav-settings"
            onClick={() => handleNavClick('settings')}
            className={cn(
              'p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-surface rounded-sm transition-colors shrink-0',
              activeRoute === 'settings' && 'text-zinc-100 bg-surface'
            )}
            title="Cài đặt hệ thống & tài khoản"
            aria-label="Cài đặt hệ thống & tài khoản"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-surface rounded-sm transition-colors shrink-0"
            aria-label={`Chuyển sang chế độ ${theme === 'dark' ? 'sáng' : 'tối'}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-surface rounded-sm transition-colors shrink-0"
            aria-label={isMobileMenuOpen ? 'Đóng menu di động' : 'Mở menu di động'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-b border-hairline bg-canvas/95 backdrop-blur-md px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-testid={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors',
                  isActive
                    ? 'text-zinc-100 bg-surface font-semibold border border-hairline shadow-subtle'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface/50'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNavClick('settings')}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors',
              activeRoute === 'settings'
                ? 'text-zinc-100 bg-surface font-semibold border border-hairline shadow-subtle'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface/50'
            )}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cài đặt hệ thống</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAuthModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left text-amber-400 bg-amber-500/10 border border-amber-500/20"
          >
            <User className="w-3.5 h-3.5" />
            <span>Hồ sơ học viên &amp; Xác thực ({profile?.display_name || 'Đăng nhập'})</span>
          </button>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
