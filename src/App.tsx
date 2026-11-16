import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { SidebarNavigation } from './components/layout/SidebarNavigation';
import { DesignSystemPreview } from './components/preview/DesignSystemPreview';
import { SearchCommand, SearchResultItem } from './components/search/SearchCommand';
import { Toast } from './components/ui/Toast';
import { EmptyState } from './components/ui/EmptyState';
import { PageHeader } from './components/layout/PageHeader';
import { SlidePlayer } from './components/lesson/SlidePlayer';
import { TrackCard } from './components/cards/TrackCard';
import { LessonCard } from './components/cards/LessonCard';
import { SimulatorPage } from './pages/SimulatorPage';
import { HomePage } from './pages/HomePage';
import { Terminal, Play, Sparkles, Clock, BookOpen } from 'lucide-react';
import type { ThemeMode, AffinityTrackId, ModuleSummary } from './types/design-system';
import { ALL_PILOT_MODULES, ALL_PILOT_LESSONS, getLessonById } from './data/curriculum/index';
import { moduleTranslationsVi } from './data/curriculum/translationsVi';

const EncyclopediaPage = React.lazy(() => import('./pages/EncyclopediaPage'));
const ResourcesPage = React.lazy(() => import('./pages/ResourcesPage'));
const CapstoneAssessmentPage = React.lazy(() => import('./pages/CapstoneAssessmentPage'));
const KnowledgePage = React.lazy(() => import('./pages/KnowledgePage'));
const ChallengesPage = React.lazy(() => import('./pages/ChallengesPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

const trackInfoVi: Record<AffinityTrackId, { name: string; label: string; tagline: string; description: string }> = {
  designer: {
    name: 'Vector Studio',
    label: 'Lộ trình học tập Designer',
    tagline: 'Bézier, Node & hình học',
    description: 'Thực hành đường cong, node, hình học vector và artboard.',
  },
  photo: {
    name: 'Pixel Studio',
    label: 'Lộ trình học tập Photo',
    tagline: 'Layers, masks & retouching',
    description: 'Thực hành layer, vùng chọn, mask và chỉnh sửa ảnh phi phá hủy.',
  },
  publisher: {
    name: 'Layout Studio',
    label: 'Lộ trình học tập Publisher',
    tagline: 'Typography, grids & pages',
    description: 'Thực hành cấu trúc trang, hệ lưới, phân cấp thị giác và xuất bản.',
  },
  scripting: {
    name: 'Automation & MCP',
    label: 'Nhánh học tập tự động hóa',
    tagline: 'Scripting & integration',
    description: 'Tìm hiểu scripting, quy trình lặp lại và giới hạn tích hợp MCP.',
  },
};

export const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState('home');
  const [activeTrack, setActiveTrack] = useState<AffinityTrackId>('designer');
  const [activeModuleId, setActiveModuleId] = useState<string>('D01');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ title: string; message?: string } | null>(null);

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

  const filteredModules = ALL_PILOT_MODULES.filter((m) => m.trackId === activeTrack);

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
            onBackToCatalog={() => setActiveRoute('catalog')}
          />
        </div>
      );
    }

    switch (activeRoute) {
      case 'home':
        return (
          <HomePage
            onNavigate={setActiveRoute}
            onSelectTrack={(trackId) => {
              setActiveTrack(trackId);
              setActiveRoute('catalog');
            }}
            onLaunchLesson={handleLaunchLesson}
          />
        );
      case 'preview':
      case 'design-system':
        return <DesignSystemPreview />;
      case 'catalog':
        return (
          <div className="space-y-8">
            <PageHeader
              title="Danh Mục Khóa Học & Lộ Trình Đào Tạo"
              description="Kế hoạch gồm 40 module / 120 bài. Hiện có 66 bài: 60 bài cốt lõi và 6 bài pilot; danh mục phân biệt rõ nội dung hiện có với phạm vi còn dự kiến."
              badge="66 bài hiện có · 60 cốt lõi + 6 pilot · 120 bài theo kế hoạch"
            />

            {/* 4 Track Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TrackCard
                id="designer"
                name="Vector Studio"
                tagline={trackInfoVi.designer.tagline}
                description={trackInfoVi.designer.description}
                moduleCount={10}
                lessonCount={30}
                plannedModuleCount={10}
                plannedLessonCount={30}
                progressPercentage={100}
                onClick={() => {
                  setActiveTrack('designer');
                  setActiveModuleId('D01');
                }}
              />
              <TrackCard
                id="photo"
                name="Pixel Studio"
                tagline={trackInfoVi.photo.tagline}
                description={trackInfoVi.photo.description}
                moduleCount={10}
                lessonCount={30}
                plannedModuleCount={10}
                plannedLessonCount={30}
                progressPercentage={100}
                onClick={() => {
                  setActiveTrack('photo');
                  setActiveModuleId('P01');
                }}
              />
              <TrackCard
                id="publisher"
                name="Layout Studio"
                tagline={trackInfoVi.publisher.tagline}
                description={trackInfoVi.publisher.description}
                moduleCount={1}
                lessonCount={3}
                plannedModuleCount={10}
                plannedLessonCount={30}
                progressPercentage={10}
                onClick={() => {
                  setActiveTrack('publisher');
                  setActiveModuleId('B01');
                }}
              />
              <TrackCard
                id="scripting"
                name="Automation & MCP"
                tagline={trackInfoVi.scripting.tagline}
                description={trackInfoVi.scripting.description}
                moduleCount={1}
                lessonCount={3}
                plannedModuleCount={10}
                plannedLessonCount={30}
                progressPercentage={10}
                onClick={() => {
                  setActiveTrack('scripting');
                  setActiveModuleId('S01');
                }}
              />
            </div>

            {/* Active Track Modules & Lessons */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--color-border-hairline)] pb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)] capitalize">
                    <span>Lộ trình {trackInfoVi[activeTrack].name} ({trackInfoVi[activeTrack].label})</span>
                    <span className="sr-only">{activeTrack} Track Curriculum</span>
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Chọn bài học bên dưới để khởi chạy Trình phát Slide Tương tác.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/20 px-3 py-1 rounded border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {filteredModules.reduce((acc, m) => acc + m.lessons.length, 0)} Bài Học Sẵn Sàng Học
                    <span className="sr-only">{filteredModules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons Ready to Play</span>
                  </span>
                </div>
              </div>

              {filteredModules.map((mod) => {
                const difficultyVi = {
                  Beginner: 'Cơ bản',
                  Intermediate: 'Trung cấp',
                  Advanced: 'Nâng cao',
                }[mod.difficulty] || mod.difficulty;

                return (
                  <div
                    key={mod.id}
                    className="space-y-5 p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] hover:border-[var(--color-border-subtle)] transition-all duration-200 shadow-sm"
                  >
                    {/* Module Header Bar: Spans Full Width Elegantly */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border-hairline)]">
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]">
                            {mod.moduleNumber}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            {difficultyVi}
                          </span>
                          <span className="text-xs text-[var(--color-text-secondary)] font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            {mod.estimatedMinutes} phút
                          </span>
                          <span className="text-xs text-[var(--color-text-secondary)] font-mono flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                            {mod.lessons.length} bài học
                          </span>

                        </div>

                        {/* Title: Full width, no narrow wrapping */}
                        <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-wide">
                          <span>{moduleTranslationsVi[mod.id]?.title || mod.title}</span>
                          <span className="sr-only">{mod.title}</span>
                        </h3>

                        {/* Description: Spans nicely across the card */}
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-4xl">
                          {moduleTranslationsVi[mod.id]?.description || mod.description}
                        </p>
                      </div>

                      {/* Right Action: Quick Start Button */}
                      {mod.lessons.length > 0 && (
                        <div className="shrink-0 flex items-center gap-3">
                          <button
                            onClick={() => handleLaunchLesson(mod.lessons[0].id)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-medium text-xs border border-[var(--color-border-hairline)] hover:border-zinc-400 transition-all shadow-subtle group"
                          >
                            <Play className="w-4 h-4 fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span>Bắt đầu Module ({mod.moduleNumber})</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Lesson Grid: 3 Clean Equal-Width Columns */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                          Danh sách bài học trong module:
                        </h4>
                        <span className="text-xs text-[var(--color-text-secondary)] font-mono">
                          {mod.lessons.length} bài học tương tác
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {mod.lessons.map((les) => (
                          <div key={les.id} className="relative group">
                            <LessonCard
                              lesson={{
                                id: les.id,
                                moduleId: les.moduleId,
                                lessonNumber: les.order,
                                title: les.title,
                                durationMinutes: les.durationMinutes,
                                completed: false,
                              }}
                              isActive={activeLessonId === les.id}
                              onClick={() => handleLaunchLesson(les.id)}
                            />
                            <button
                              onClick={() => handleLaunchLesson(les.id)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-hairline)] text-[var(--color-text-secondary)] group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-all shadow-sm"
                              title={`Bắt đầu bài học ${les.id}`}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'simulator':
      case 'sandbox':
        return <SimulatorPage />;
      case 'challenges':
        return <ChallengesPage onNavigateToSandbox={() => setActiveRoute('simulator')} />;
      case 'knowledge':
        return <KnowledgePage initialTab="search" onNavigate={setActiveRoute} />;
      case 'search':
        return <KnowledgePage initialTab="search" onNavigate={setActiveRoute} />;
      case 'shortcuts':
        return <KnowledgePage initialTab="shortcuts" onNavigate={setActiveRoute} />;
      case 'cheatsheet':
        return <KnowledgePage initialTab="cheatsheet" onNavigate={setActiveRoute} />;
      case 'glossary':
        return <KnowledgePage initialTab="glossary" onNavigate={setActiveRoute} />;
      case 'encyclopedia':
        return <EncyclopediaPage />;
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveRoute} />;
      case 'settings':
        return <SettingsPage onBackToDashboard={() => setActiveRoute('dashboard')} />;
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
      onNavigate={(route) => {
        setActiveRoute(route);
        if (route !== 'lesson') {
          setActiveLessonId(null);
        }
      }}
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
