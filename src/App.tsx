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
import { ModuleCard } from './components/cards/ModuleCard';
import { LessonCard } from './components/cards/LessonCard';
import { SimulatorPage } from './pages/SimulatorPage';
import { BookOpen, Terminal, Download, User, Play, Sparkles } from 'lucide-react';
import type { ThemeMode, AffinityTrackId, ModuleSummary } from './types/design-system';
import { ALL_PILOT_MODULES, ALL_PILOT_LESSONS, getLessonById } from './data/curriculum/index';

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
    progressPercentage: m.id === 'D01' ? 100 : 0,
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
                title: 'Lesson Completed! 🎉',
                message: `You have successfully completed ${id}: ${currentLesson.title}.`,
              });
            }}
            onBackToCatalog={() => setActiveRoute('catalog')}
          />
        </div>
      );
    }

    switch (activeRoute) {
      case 'home':
        return <DesignSystemPreview />;
      case 'catalog':
        return (
          <div className="space-y-8">
            <PageHeader
              title="Course Catalog & Tracks"
              description="Explore the comprehensive 40-module curriculum across Serif Affinity suite and MCP automation."
              badge="Phase 3 Pilot (12 Lessons Verified)"
            />

            {/* 4 Track Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TrackCard
                id="designer"
                name="Affinity Designer"
                tagline="Vector curves, artboards & geometry"
                description="Master vector precision, personas, and responsive artboards."
                moduleCount={10}
                lessonCount={30}
                progressPercentage={30}
                onClick={() => {
                  setActiveTrack('designer');
                  setActiveModuleId('D01');
                }}
              />
              <TrackCard
                id="photo"
                name="Affinity Photo"
                tagline="RAW develop, 32-bit HDR & retouching"
                description="Master non-destructive retouching and 32-bit color."
                moduleCount={10}
                lessonCount={30}
                progressPercentage={30}
                onClick={() => {
                  setActiveTrack('photo');
                  setActiveModuleId('P01');
                }}
              />
              <TrackCard
                id="publisher"
                name="Affinity Publisher"
                tagline="Publication layout & master pages"
                description="Master editorial spreads, 3mm bleed, and grids."
                moduleCount={10}
                lessonCount={30}
                progressPercentage={30}
                onClick={() => {
                  setActiveTrack('publisher');
                  setActiveModuleId('B01');
                }}
              />
              <TrackCard
                id="scripting"
                name="Scripting & MCP"
                tagline="V8 JavaScript DOM & port 6767"
                description="Master programmatic automation and MCP tools."
                moduleCount={10}
                lessonCount={30}
                progressPercentage={30}
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
                    {activeTrack} Track Curriculum
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Click any lesson below to launch the interactive Slide Lesson Engine.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/20 px-3 py-1 rounded border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3 Pilot Lessons Ready to Play</span>
                </div>
              </div>

              {filteredModules.map((mod) => (
                <div key={mod.id} className="space-y-4 p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)]">
                          {mod.moduleNumber}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          {mod.difficulty} &bull; {mod.estimatedMinutes} minutes
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <ModuleCard
                        module={{
                          id: mod.id,
                          trackId: mod.trackId,
                          moduleNumber: mod.moduleNumber,
                          title: mod.title,
                          description: mod.description,
                          lessonCount: mod.lessons.length,
                          estimatedMinutes: mod.estimatedMinutes,
                          difficulty: mod.difficulty,
                          progressPercentage: mod.id === 'D01' ? 100 : 0,
                        }}
                        onClick={() => handleLaunchLesson(mod.lessons[0].id)}
                      />
                    </div>
                  </div>

                  {/* Lesson List */}
                  <div className="mt-4 pt-4 border-t border-[var(--color-border-hairline)] space-y-2">
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2">
                      Interactive Slide Lessons in this Module:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-hairline)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-brand-cyan)] group-hover:border-[var(--color-brand-cyan)] transition-all shadow-sm"
                            title={`Start Lesson ${les.id}`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'simulator':
        return <SimulatorPage />;
      case 'encyclopedia':
        return (
          <div>
            <PageHeader
              title="Complete Tool Encyclopedia & Shortcuts Matrix"
              description="Comprehensive reference dictionary for every tool, persona, and modifier key across Designer, Photo, and Publisher 3.0."
              badge="Phase 5 Implementation"
            />
            <EmptyState
              icon={<BookOpen className="w-5 h-5 text-rose-400" />}
              title="Encyclopedia UI Scheduled for Phase 5"
              description="Searchable matrix and detail modals will be assembled in Phase 5 based on verified tool database."
            />
          </div>
        );
      case 'playground':
        return (
          <div>
            <PageHeader
              title="Affinity MCP Scripting & Automation Playground"
              description="Write JavaScript directly against your running Affinity 3.3.3 desktop instance and view instant live spread renders."
              badge="Phase 4 Implementation"
            />
            <EmptyState
              icon={<Terminal className="w-5 h-5 text-emerald-400" />}
              title="Monaco Editor & Live Render Viewport Scheduled for Phase 4"
              description="The split-pane IDE and localhost:6767 SSE live rendering bridge will be integrated in Phase 4."
            />
          </div>
        );
      case 'resources':
        return (
          <div>
            <PageHeader
              title="Resource Library & Asset Download Center"
              description="Download verified Affinity color palettes, brushes, layout templates, vector assets, and shortcut cheat sheets."
              badge="Phase 5 Implementation"
            />
            <EmptyState
              icon={<Download className="w-5 h-5 text-blue-400" />}
              title="Download Center Scheduled for Phase 5"
              description="Asset cards and Supabase storage download triggers will be wired in Phase 5."
            />
          </div>
        );
      case 'dashboard':
        return (
          <div>
            <PageHeader
              title="Student Dashboard & Learning Portfolio"
              description="Track your mastery across all 40 modules, 120 lessons, challenge submissions, and earned achievement badges."
              badge="Phase 5 Implementation"
            />
            <EmptyState
              icon={<User className="w-5 h-5 text-purple-400" />}
              title="Student Dashboard Scheduled for Phase 5"
              description="Supabase user profile synchronization and portfolio gallery will be wired in Phase 5 & 6."
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
      isMcpConnected={true}
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
      {renderContent()}

      {/* Global Command Palette */}
      <SearchCommand
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item: SearchResultItem) => {
          setActiveToast({
            title: `Navigated to ${item.title}`,
            message: `Selected from category: ${item.category}`,
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
