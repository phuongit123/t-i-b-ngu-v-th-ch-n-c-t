import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { SidebarNavigation } from './components/layout/SidebarNavigation';
import { DesignSystemPreview } from './components/preview/DesignSystemPreview';
import { SearchCommand, SearchResultItem } from './components/search/SearchCommand';
import { Toast } from './components/ui/Toast';
import { EmptyState } from './components/ui/EmptyState';
import { PageHeader } from './components/layout/PageHeader';
import { SlidePlayer } from './components/lesson/SlidePlayer';
import { SimulatorPage } from './pages/SimulatorPage';
import { HomePage } from './pages/HomePage';
import { Terminal } from 'lucide-react';
import type { ThemeMode, AffinityTrackId, ModuleSummary } from './types/design-system';
import { ALL_PILOT_MODULES, ALL_PILOT_LESSONS, getLessonById } from './data/curriculum/index';

const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const EncyclopediaPage = React.lazy(() => import('./pages/EncyclopediaPage'));
const ResourcesPage = React.lazy(() => import('./pages/ResourcesPage'));
const CapstoneAssessmentPage = React.lazy(() => import('./pages/CapstoneAssessmentPage'));
const KnowledgePage = React.lazy(() => import('./pages/KnowledgePage'));
const ChallengesPage = React.lazy(() => import('./pages/ChallengesPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

export const App: React.FC = () => {
  const getInitialRoute = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path === 'catalog') return 'catalog';
      if (path === 'simulator' || path === 'sandbox') return 'simulator';
      if (path === 'dashboard') return 'dashboard';
      if (path === 'encyclopedia') return 'encyclopedia';
      if (path === 'resources') return 'resources';
      if (path === 'challenges') return 'challenges';
      if (path === 'knowledge') return 'knowledge';
      if (path === 'settings') return 'settings';
      if (path === 'capstone') return 'capstone';
      if (path === 'preview' || path === 'design-system') return 'preview';
    }
    return 'home';
  };

  const [activeRoute, setActiveRoute] = useState(getInitialRoute);
  const [activeTrack, setActiveTrack] = useState<AffinityTrackId>('designer');
  const [activeModuleId, setActiveModuleId] = useState<string>('D01');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message?: string } | null>(null);

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    if (typeof window !== 'undefined') {
      const targetPath = route === 'home' ? '/' : `/${route}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
    if (route !== 'lesson') {
      setActiveLessonId(null);
    }
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path) setActiveRoute(path);
      else setActiveRoute('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const sampleModules: ModuleSummary[] = ALL_PILOT_MODULES.map((m) => ({
    id: m.id,
    trackId: m.trackId,
    moduleNumber: m.moduleNumber,
    title: m.title,
    description: m.description,
    lessonCount: m.lessons.length,
    estimatedMinutes: m.estimatedMinutes,
    difficulty: m.difficulty,
    progressPercentage: 0,
  }));

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleLaunchLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveRoute('lesson');
  };

  const currentLesson = activeLessonId ? getLessonById(activeLessonId) : ALL_PILOT_LESSONS[0];

  const renderContent = () => {
    // 1. Interactive Slide Lesson Player View
    if (activeRoute === 'lesson' && currentLesson) {
      return (
        <div className="py-4">
          <SlidePlayer
            lesson={currentLesson}
            onLessonComplete={(id) => {
              setActiveToast({
                title: 'Hoàn thành bài học! 🎉',
                message: `Bạn đã hoàn thành xuất sắc ${id}: ${currentLesson.title}.`,
              });
            }}
            onBackToCatalog={() => handleNavigate('catalog')}
          />
        </div>
      );
    }

    switch (activeRoute) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onSelectTrack={(trackId) => {
              setActiveTrack(trackId);
              handleNavigate('catalog');
            }}
            onLaunchLesson={handleLaunchLesson}
          />
        );
      case 'preview':
      case 'design-system':
        return <DesignSystemPreview />;
      case 'catalog':
        return (
          <CatalogPage
            activeTrack={activeTrack}
            onSelectTrack={(trackId) => {
              setActiveTrack(trackId);
              const firstMod = ALL_PILOT_MODULES.find((m) => m.trackId === trackId);
              if (firstMod) {
                setActiveModuleId(firstMod.id);
              }
            }}
            onLaunchLesson={handleLaunchLesson}
            activeLessonId={activeLessonId}
          />
        );
      case 'simulator':
      case 'sandbox':
        return <SimulatorPage />;
      case 'challenges':
        return <ChallengesPage onNavigateToSandbox={() => handleNavigate('simulator')} />;
      case 'knowledge':
        return <KnowledgePage initialTab="search" onNavigate={handleNavigate} />;
      case 'search':
        return <KnowledgePage initialTab="search" onNavigate={handleNavigate} />;
      case 'shortcuts':
        return <KnowledgePage initialTab="shortcuts" onNavigate={handleNavigate} />;
      case 'cheatsheet':
        return <KnowledgePage initialTab="cheatsheet" onNavigate={handleNavigate} />;
      case 'glossary':
        return <KnowledgePage initialTab="glossary" onNavigate={handleNavigate} />;
      case 'encyclopedia':
        return <EncyclopediaPage />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onBackToDashboard={() => handleNavigate('dashboard')} />;
      case 'resources':
        return <ResourcesPage />;
      case 'capstone':
        return <CapstoneAssessmentPage />;
      case 'playground':
        return (
          <div>
            <PageHeader
              title="Phòng Thí Nghiệm Lập Trình Scripting & MCP"
              description="Thực thi JavaScript DOM trực tiếp trên phiên bản Affinity chạy ngầm và theo dõi hình ảnh trang đôi kết xuất tức thì."
              badge="Phân hệ tự động hóa giai đoạn 4"
            />
            <EmptyState
              icon={<Terminal className="w-5 h-5 text-emerald-400" />}
              title="Trình Soạn Thảo Monaco & Cổng Kết Xuất Trực Tiếp"
              description="Không gian lập trình chia đôi màn hình và kết nối SSE qua localhost:6767 sẽ được tích hợp trong giai đoạn 4."
            />
          </div>
        );
      default:
        return <DesignSystemPreview />;
    }
  };

  return (
    <AppShell
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      theme={theme}
      onToggleTheme={handleToggleTheme}
      onOpenSearch={() => setIsSearchOpen(true)}
      isMcpConnected={false}
      sidebar={
        activeRoute === 'catalog' ? (
          <SidebarNavigation
            activeTrackId={activeTrack}
            onSelectTrack={(t) => {
              setActiveTrack(t);
              const firstMod = ALL_PILOT_MODULES.find(m => m.trackId === t);
              if (firstMod) setActiveModuleId(firstMod.id);
            }}
            modules={sampleModules}
            activeModuleId={activeModuleId}
            onSelectModule={(mId) => {
              setActiveModuleId(mId);
              const targetMod = ALL_PILOT_MODULES.find(m => m.id === mId);
              if (targetMod && targetMod.lessons.length > 0) {
                handleLaunchLesson(targetMod.lessons[0].id);
              }
            }}
          />
        ) : undefined
      }
    >
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-sm text-[var(--color-text-secondary)] font-mono">
            Đang tải dữ liệu module...
          </div>
        }
      >
        {renderContent()}
      </React.Suspense>

      {/* Global Command Palette */}
      <SearchCommand
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item: SearchResultItem) => {
          setIsSearchOpen(false);
          if (item.category === 'module') {
            setActiveTrack(item.id.startsWith('D') ? 'designer' : item.id.startsWith('P') ? 'photo' : item.id.startsWith('B') ? 'publisher' : 'scripting');
            setActiveRoute('catalog');
          } else if (item.category === 'tool') {
            setActiveRoute('shortcuts');
          } else if (item.category === 'doc') {
            setActiveRoute('encyclopedia');
          }
          setActiveToast({
            title: `Đã chuyển đến ${item.title}`,
            message: `Danh mục: ${item.category}`,
          });
        }}
      />

      {/* Global Toast */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast
            type="info"
            title={activeToast.title}
            message={activeToast.message}
            onClose={() => setActiveToast(null)}
          />
        </div>
      )}
    </AppShell>
  );
};

export default App;
