import React, { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { SidebarNavigation } from './components/layout/SidebarNavigation';
const DesignSystemPreview = React.lazy(() => import('./components/preview/DesignSystemPreview').then(module => ({ default: module.DesignSystemPreview })));
import { SearchCommand, SearchResultItem } from './components/search/SearchCommand';
import { Toast } from './components/ui/Toast';
const SimulatorPage = React.lazy(() => import('./pages/SimulatorPage').then(module => ({ default: module.SimulatorPage })));
import { HomePage } from './pages/HomePage';
const LessonPage = React.lazy(() => import('./pages/LessonPage').then(module => ({ default: module.LessonPage })));
import type { ThemeMode, AffinityTrackId, ModuleSummary } from './types/design-system';
import { ALL_PILOT_MODULES, ALL_PILOT_LESSONS, getLessonById } from './data/curriculum/index';
import { lessonTranslationsVi } from './data/curriculum/translationsVi';
import { useLearningProgress } from './lib/learning-store';
import {
  parseLocationPathname,
  getRoutePath,
  getLessonCanonicalPath,
  type ParsedRouteState,
} from './lib/seo-router';
import { useSeoMetadata } from './lib/seo-metadata';

const CatalogPage = React.lazy(() => import('./pages/CatalogPage'));
const EncyclopediaPage = React.lazy(() => import('./pages/EncyclopediaPage'));
const PlaygroundPage = React.lazy(() => import('./pages/PlaygroundPage'));
const ResourcesPage = React.lazy(() => import('./pages/ResourcesPage'));
const CapstoneAssessmentPage = React.lazy(() => import('./pages/CapstoneAssessmentPage'));
const KnowledgePage = React.lazy(() => import('./pages/KnowledgePage'));
const ChallengesPage = React.lazy(() => import('./pages/ChallengesPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

function getInitialParsedState(): ParsedRouteState {
  if (typeof window !== 'undefined') {
    return parseLocationPathname(window.location.pathname);
  }
  return { route: 'home' };
}

export const App: React.FC = () => {
  const [initialState] = useState<ParsedRouteState>(getInitialParsedState);
  const [activeRoute, setActiveRoute] = useState<string>(initialState.route);
  const [activeTrack, setActiveTrack] = useState<AffinityTrackId>(
    initialState.trackId ?? 'designer'
  );
  const [activeModuleId, setActiveModuleId] = useState<string>(
    initialState.moduleId ?? 'D01'
  );
  const [activeLessonId, setActiveLessonId] = useState<string | null>(
    initialState.lessonId ?? null
  );
  const [playgroundSymbolId, setPlaygroundSymbolId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message?: string } | null>(null);

  const { getModuleProgress } = useLearningProgress();

  const handleNavigate = (route: string, trackOverride?: AffinityTrackId) => {
    const resolvedTrack = trackOverride ?? activeTrack;
    if (trackOverride) {
      setActiveTrack(trackOverride);
    }
    setActiveRoute(route);
    if (typeof window !== 'undefined') {
      const targetPath = getRoutePath(route, {
        trackId: route === 'catalog' ? resolvedTrack : undefined,
      });
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
    if (route !== 'lesson') {
      setActiveLessonId(null);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseLocationPathname(window.location.pathname);
      setActiveRoute(parsed.route);
      if (parsed.trackId) setActiveTrack(parsed.trackId);
      if (parsed.moduleId) setActiveModuleId(parsed.moduleId);
      setActiveLessonId(parsed.lessonId ?? null);
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
    const target = getLessonById(lessonId);
    if (target) {
      setActiveTrack(target.trackId);
      setActiveModuleId(target.moduleId);
    }
    setActiveLessonId(lessonId);
    setActiveRoute('lesson');
    if (typeof window !== 'undefined') {
      const targetPath = target ? getLessonCanonicalPath(target) : `/bai-hoc/${lessonId.toLowerCase()}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  const currentLesson = activeLessonId ? getLessonById(activeLessonId) : ALL_PILOT_LESSONS[0];
  const currentModule = currentLesson
    ? ALL_PILOT_MODULES.find((m) => m.id === currentLesson.moduleId)
    : undefined;

  useSeoMetadata({
    activeRoute,
    activeTrack,
    activeLesson: activeRoute === 'lesson' ? currentLesson : null,
    activeModule: activeRoute === 'lesson' ? currentModule : null,
  });

  const renderContent = () => {
    if (activeRoute === 'lesson' && currentLesson) {
      const lessonTitleVi = lessonTranslationsVi[currentLesson.id] || currentLesson.title;
      return (
        <div className="py-2">
          <LessonPage
            lesson={currentLesson}
            module={currentModule}
            allLessons={ALL_PILOT_LESSONS}
            onSelectLesson={handleLaunchLesson}
            onBackToCatalog={() => handleNavigate('catalog')}
            onNavigate={handleNavigate}
            onLessonComplete={(id) => {
              setActiveToast({
                title: 'Hoàn thành bài học!',
                message: `Bạn đã hoàn thành ${id}: ${lessonTitleVi}. Tiến độ đã được lưu vào Hồ sơ học tập.`,
              });
            }}
          />
        </div>
      );
    }

    switch (activeRoute) {
      case 'reset-password':
        return <ResetPasswordPage />;
      case 'not-found':
        return <section className="space-y-4"><h1 className="text-2xl font-bold">Không tìm thấy trang</h1><a href="/" className="underline">Về trang chủ</a></section>;
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onSelectTrack={(trackId) => {
              handleNavigate('catalog', trackId);
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
              if (typeof window !== 'undefined') {
                const trackPath = getRoutePath('catalog', { trackId });
                if (window.location.pathname !== trackPath) {
                  window.history.replaceState(null, '', trackPath);
                }
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
        return (
          <KnowledgePage
            initialTab="search"
            onNavigate={handleNavigate}
            onLaunchLesson={handleLaunchLesson}
          />
        );
      case 'shortcuts':
        return (
          <KnowledgePage
            initialTab="shortcuts"
            onNavigate={handleNavigate}
            onLaunchLesson={handleLaunchLesson}
          />
        );
      case 'cheatsheet':
        return (
          <KnowledgePage
            initialTab="cheatsheet"
            onNavigate={handleNavigate}
            onLaunchLesson={handleLaunchLesson}
          />
        );
      case 'glossary':
        return (
          <KnowledgePage
            initialTab="glossary"
            onNavigate={handleNavigate}
            onLaunchLesson={handleLaunchLesson}
          />
        );
      case 'encyclopedia':
        return (
          <EncyclopediaPage
            onOpenInPlayground={(className) => {
              setPlaygroundSymbolId(className);
              handleNavigate('playground');
            }}
          />
        );
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
          <PlaygroundPage
            initialSymbolId={playgroundSymbolId}
            onNavigateToEncyclopedia={() => handleNavigate('encyclopedia')}
          />
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
