import React, { useState, useEffect } from 'react';
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
import { lessonTranslationsVi } from './data/curriculum/translationsVi';
import { useLearningProgress } from './lib/learning-store';

const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const EncyclopediaPage = React.lazy(() => import('./pages/EncyclopediaPage'));
const ResourcesPage = React.lazy(() => import('./pages/ResourcesPage'));
const CapstoneAssessmentPage = React.lazy(() => import('./pages/CapstoneAssessmentPage'));
const KnowledgePage = React.lazy(() => import('./pages/KnowledgePage'));
const ChallengesPage = React.lazy(() => import('./pages/ChallengesPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

const KNOWN_ROUTES = new Set([
  'home',
  'catalog',
  'simulator',
  'sandbox',
  'dashboard',
  'encyclopedia',
  'resources',
  'challenges',
  'knowledge',
  'search',
  'shortcuts',
  'cheatsheet',
  'glossary',
  'settings',
  'capstone',
  'playground',
  'preview',
  'design-system',
]);

export const App: React.FC = () => {
  const getInitialRoute = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (KNOWN_ROUTES.has(path)) return path;
    }
    return 'home';
  };

  const [activeRoute, setActiveRoute] = useState<string>(getInitialRoute);
  const [activeTrack, setActiveTrack] = useState<AffinityTrackId>('designer');
  const [activeModuleId, setActiveModuleId] = useState<string>('D01');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message?: string } | null>(null);

  const { getModuleProgress } = useLearningProgress();

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

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path && KNOWN_ROUTES.has(path)) {
        setActiveRoute(path);
      } else {
        setActiveRoute('home');
      }
      setActiveLessonId(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const sidebarModules: ModuleSummary[] = ALL_PILOT_MODULES.map((m) => ({
    id: m.id,
    trackId: m.trackId,
    moduleNumber: m.moduleNumber || m.id,
    title: m.title,
    description: m.description,
    lessonCount: m.lessons.length,
    estimatedMinutes: m.estimatedMinutes,
    difficulty: m.difficulty,
    progressPercentage: getModuleProgress(m.id).percentage,
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
    if (activeRoute === 'lesson' && currentLesson) {
      const lessonTitleVi = lessonTranslationsVi[currentLesson.id] || currentLesson.title;
      return (
        <div className="py-4">
          <SlidePlayer
            lesson={currentLesson}
            onLessonComplete={(id) => {
              setActiveToast({
                title: 'Hoàn thành bài học!',
                message: `Bạn đã hoàn thành ${id}: ${lessonTitleVi}. Tiến độ đã được lưu vào Hồ sơ học tập.`,
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
              description="Thực hành tự động hóa JavaScript DOM và theo dõi cấu trúc đối tượng tài liệu trong môi trường kiểm thử an toàn."
              badge="Thực hành tự động hóa"
            />
            <EmptyState
              icon={<Terminal className="w-5 h-5 text-emerald-400" />}
              title="Trình Soạn Thảo Kịch Bản & Mô Phỏng Tài Liệu"
              description="Không gian chạy kịch bản tự động hóa tương tác trực quan đang được nâng cấp trong lộ trình phát triển công cụ."
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
              const firstMod = ALL_PILOT_MODULES.find((m) => m.trackId === t);
              if (firstMod) setActiveModuleId(firstMod.id);
            }}
            modules={sidebarModules}
            activeModuleId={activeModuleId}
            onSelectModule={(mId) => {
              setActiveModuleId(mId);
              const targetMod = ALL_PILOT_MODULES.find((m) => m.id === mId);
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
            Đang tải dữ liệu học phần...
          </div>
        }
      >
        {renderContent()}
      </React.Suspense>

      <SearchCommand
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item: SearchResultItem) => {
          setIsSearchOpen(false);
          if (item.category === 'lesson') {
            handleLaunchLesson(item.id);
          } else if (item.category === 'module') {
            setActiveTrack(
              item.id.startsWith('D')
                ? 'designer'
                : item.id.startsWith('P')
                ? 'photo'
                : item.id.startsWith('B')
                ? 'publisher'
                : 'scripting'
            );
            handleNavigate('catalog');
          } else if (item.category === 'tool') {
            handleNavigate('shortcuts');
          } else if (item.category === 'glossary') {
            handleNavigate('glossary');
          } else if (item.category === 'doc') {
            handleNavigate('encyclopedia');
          }
          setActiveToast({
            title: `Đã chuyển đến ${item.title}`,
            message: item.subtitle,
          });
        }}
      />

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
