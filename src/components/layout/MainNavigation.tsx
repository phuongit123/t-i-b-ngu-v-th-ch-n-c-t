import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Cloud, CloudOff, Menu, Moon, RefreshCw, Search, Settings, Sun, User, X } from 'lucide-react';
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

const practiceLinks = [
  { id: 'simulator', label: 'Bộ mô phỏng' },
  { id: 'challenges', label: 'Thử thách' },
  { id: 'capstone', label: 'Đồ án' },
  { id: 'playground', label: 'Tự động hóa' },
];

const resourceLinks = [
  { id: 'resources', label: 'Thư viện học liệu' },
  { id: 'knowledge', label: 'Tri thức' },
  { id: 'encyclopedia', label: 'Bách khoa API' },
];

const statusText: Record<SyncStatus, string> = {
  synced: 'Đã đồng bộ tiến độ học tập',
  syncing: 'Đang đồng bộ tiến độ',
  pending: 'Đang chờ lưu tiến độ',
  offline: 'Đang lưu ngoại tuyến trên trình duyệt',
  error: 'Lỗi đồng bộ đám mây',
};

export function MainNavigation({ activeRoute, onNavigate, theme, onToggleTheme, onOpenSearch, className }: MainNavigationProps) {
  const [menu, setMenu] = useState<'practice' | 'resources' | 'mobile' | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const { profile } = useAuth();

  useEffect(() => subscribeSyncStatus(setSyncStatus), []);

  function navigate(route: string) {
    setMenu(null);
    onNavigate(route);
  }

  const visibleRoute = ['lesson', 'journey'].includes(activeRoute) ? 'catalog'
    : ['search', 'shortcuts', 'cheatsheet', 'glossary'].includes(activeRoute) ? 'knowledge'
    : activeRoute === 'sandbox' ? 'simulator' : activeRoute;

  function renderLink(link: { id: string; label: string }, mobile = false) {
    return (
      <button key={link.id} type="button" data-testid={`${mobile ? 'mobile-' : ''}nav-${link.id}`}
        aria-current={visibleRoute === link.id ? 'page' : undefined} onClick={() => navigate(link.id)}>
        {link.label}
      </button>
    );
  }

  const StatusIcon = syncStatus === 'syncing' ? RefreshCw : syncStatus === 'error' || syncStatus === 'offline' ? CloudOff : Cloud;

  return (
    <header className={`academy-nav ${className ?? ''}`} onBlur={(event) => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setMenu(null);
    }} onKeyDown={(event) => {
      if (event.key === 'Escape' && menu) {
        document.getElementById(`academy-${menu}-trigger`)?.focus();
        setMenu(null);
      }
    }}>
      <div className="academy-width academy-nav-row">
        <button type="button" data-testid="nav-home" className="academy-brand" aria-label="Về trang chủ Affinity Academy" onClick={() => navigate('home')}>
          <span className="academy-mark" aria-hidden="true">Aa</span><span>Affinity Academy</span>
        </button>
        <nav className="academy-main-links" aria-label="Điều hướng chính">
          {renderLink({ id: 'catalog', label: 'Khóa học' })}
          {([
            { id: 'practice', label: 'Thực hành', links: practiceLinks },
            { id: 'resources', label: 'Học liệu', links: resourceLinks },
          ] as const).map(({ id, label, links }) => (
            <div className="academy-nav-group" key={id}>
              <button type="button" id={`academy-${id}-trigger`} aria-expanded={menu === id} aria-controls={`academy-${id}-links`}
                data-active={links.some((item) => item.id === visibleRoute)} onClick={() => setMenu(menu === id ? null : id)}>
                {label}<ChevronDown size={14} aria-hidden="true" />
              </button>
              <div id={`academy-${id}-links`} hidden={menu !== id} className="academy-nav-popover">
                {links.map((link) => renderLink(link))}
              </div>
            </div>
          ))}
        </nav>
        <div className="academy-nav-actions">
          <button type="button" className="academy-icon" aria-label="Mở bảng tìm kiếm lệnh" title="Tìm kiếm nhanh (Ctrl+K)" onClick={onOpenSearch}><Search size={17} /></button>
          <span data-testid="sync-status-badge" role="status" aria-label={statusText[syncStatus]} title={statusText[syncStatus]} className="academy-sync" data-status={syncStatus}><StatusIcon aria-hidden="true" size={16} /></span>
          <button type="button" data-testid="nav-auth-btn" className="academy-icon" onClick={(event) => {
            event.currentTarget.focus();
            setAuthOpen(true);
          }} aria-label="Tài khoản và hồ sơ học viên" title={profile?.display_name || 'Tài khoản'}><User size={17} /></button>
          <button type="button" data-testid="nav-settings" className="academy-icon academy-wide-action" aria-label="Cài đặt hệ thống & tài khoản" onClick={() => navigate('settings')}><Settings size={17} /></button>
          <button type="button" className="academy-icon academy-wide-action" aria-label={`Chuyển sang chế độ ${theme === 'dark' ? 'sáng' : 'tối'}`} onClick={onToggleTheme}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
          <button type="button" data-testid="nav-dashboard" className="academy-learning-link" onClick={() => navigate('dashboard')}>Đang học <ArrowUpRight size={16} /></button>
          <button type="button" id="academy-mobile-trigger" className="academy-icon academy-mobile-trigger" aria-label={menu === 'mobile' ? 'Đóng menu di động' : 'Mở menu di động'} aria-expanded={menu === 'mobile'} aria-controls="academy-mobile-links" onClick={() => setMenu(menu === 'mobile' ? null : 'mobile')}>{menu === 'mobile' ? <X /> : <Menu />}</button>
        </div>
      </div>
      <nav id="academy-mobile-links" hidden={menu !== 'mobile'} className="academy-width academy-mobile-links" aria-label="Điều hướng di động">
        {[{ id: 'catalog', label: 'Khóa học' }, ...practiceLinks, ...resourceLinks, { id: 'dashboard', label: 'Đang học' }, { id: 'settings', label: 'Cài đặt' }].map((link) => renderLink(link, true))}
        <button type="button" onClick={onToggleTheme}>Giao diện {theme === 'light' ? 'tối' : 'sáng'}</button>
      </nav>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
