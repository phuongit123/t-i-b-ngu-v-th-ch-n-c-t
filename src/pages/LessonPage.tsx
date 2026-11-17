import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Download,
  Layers,
  PanelLeftOpen,
} from 'lucide-react';
import type { CurriculumLesson, CurriculumModule } from '@/types/curriculum';
import { OutlineSidebar } from '@/components/lesson/OutlineSidebar';
import { SlidePlayer } from '@/components/lesson/SlidePlayer';
import { resolveCurriculumAssetUrl } from '@/lib/curriculum-asset-urls';

export interface LessonPageProps {
  lesson: CurriculumLesson;
  module?: CurriculumModule;
  allLessons: CurriculumLesson[];
  onSelectLesson: (lessonId: string) => void;
  onBackToCatalog: () => void;
  onNavigate: (route: string) => void;
  onLessonComplete?: (lessonId: string) => void;
}

const TRACK_LABELS_VI: Record<string, string> = {
  designer: 'Vector Studio',
  photo: 'Pixel Studio',
  publisher: 'Layout Studio',
  scripting: 'Tự động hóa',
};

/**
 * Multi-pane Lesson Viewer container uniting:
 * - Breadcrumb + Starter Asset direct download + Simulator jump + Prev/Next lesson controls
 * - Collapsible OutlineSidebar (sibling lessons + 10 standard sections index)
 * - Upgraded SlidePlayer (Presentation Slide mode + 10-Section Reader + Lightbox)
 *
 * NOTE: Strictly avoids rendering <h1> or <h2> here so SlidePlayer keeps unique h1/h2 headings.
 */
export const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  module,
  allLessons,
  onSelectLesson,
  onBackToCatalog,
  onNavigate,
  onLessonComplete,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'slides' | 'sections'>('slides');
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);

  const { prevLesson, nextLesson } = useMemo(() => {
    const idx = allLessons.findIndex((item) => item.id === lesson.id);
    return {
      prevLesson: idx > 0 ? allLessons[idx - 1] : null,
      nextLesson: idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
    };
  }, [allLessons, lesson.id]);

  const starterAsset =
    lesson.standardSections.independentChallenge.starterAsset ??
    lesson.practiceAsset ??
    module?.starterAsset;
  const starterDownloadUrl = starterAsset
    ? resolveCurriculumAssetUrl(starterAsset.filepath) ??
      resolveCurriculumAssetUrl(starterAsset.filename)
    : null;

  const handleSelectSection = (sectionNumber: number) => {
    setViewMode('sections');
    setActiveSectionIndex(sectionNumber);
  };

  const handleLessonSwitch = (targetId: string) => {
    setActiveSectionIndex(null);
    onSelectLesson(targetId);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Top Multi-Pane Utility & Breadcrumb Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface px-4 py-3">
        {/* Left: Outline Toggle + Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <button
            type="button"
            data-testid="toggle-outline-btn"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-canvas px-3 py-1.5 text-xs font-mono text-zinc-200 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors"
            title={isSidebarOpen ? 'Ẩn mục lục bài học' : 'Mở mục lục bài học'}
          >
            <PanelLeftOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isSidebarOpen ? 'Ẩn mục lục' : 'Mục lục'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="hover:text-cyan-300 transition-colors"
            >
              Danh mục khóa học
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-300">
              {TRACK_LABELS_VI[lesson.trackId] || lesson.trackId}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-cyan-300 font-semibold">{lesson.moduleId}</span>
          </div>
        </div>

        {/* Right: Direct Starter Download, Quick Simulator Jump & Prev/Next Lesson */}
        <div className="flex flex-wrap items-center gap-2">
          {starterAsset && starterDownloadUrl && (
            <a
              href={starterDownloadUrl}
              download={starterAsset.filename}
              data-testid="lesson-starter-download"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-1.5 text-xs font-mono text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              title={`Tải học liệu thực hành: ${starterAsset.filename}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tải học liệu</span>
              <span className="font-semibold">({starterAsset.filename})</span>
            </a>
          )}

          <button
            type="button"
            onClick={() =>
              onNavigate(lesson.trackId === 'scripting' ? 'playground' : 'simulator')
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-canvas px-3 py-1.5 text-xs font-mono text-amber-300 hover:border-amber-400/50 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              {lesson.trackId === 'scripting' ? 'Mở Thực hành DOM' : 'Mở Bộ mô phỏng'}
            </span>
          </button>

          <div className="flex items-center gap-1.5 pl-1 border-l border-hairline">
            <button
              type="button"
              data-testid="prev-lesson-btn"
              disabled={!prevLesson}
              onClick={() => prevLesson && handleLessonSwitch(prevLesson.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 text-xs font-mono text-zinc-300 hover:border-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title={prevLesson ? `Bài trước: ${prevLesson.id}` : 'Đây là bài đầu tiên'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bài trước</span>
            </button>
            <button
              type="button"
              data-testid="next-lesson-btn"
              disabled={!nextLesson}
              onClick={() => nextLesson && handleLessonSwitch(nextLesson.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-canvas px-2.5 py-1.5 text-xs font-mono text-zinc-200 hover:border-cyan-400/60 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title={nextLesson ? `Bài tiếp theo: ${nextLesson.id}` : 'Đã đến bài cuối cùng'}
            >
              <span className="hidden sm:inline">Bài tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Pane Split Body: Collapsible OutlineSidebar + Main Reader */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <OutlineSidebar
          lesson={lesson}
          module={module}
          viewMode={viewMode}
          activeSectionIndex={activeSectionIndex}
          onSelectLesson={handleLessonSwitch}
          onSelectSection={handleSelectSection}
          onSelectViewMode={(mode) => setViewMode(mode)}
          isOpen={isSidebarOpen}
          onToggleOpen={() => setIsSidebarOpen((prev) => !prev)}
        />

        <div className="flex-1 min-w-0 w-full">
          <SlidePlayer
            lesson={lesson}
            onLessonComplete={onLessonComplete}
            onBackToCatalog={onBackToCatalog}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            activeSectionIndex={activeSectionIndex}
            onSelectLesson={handleLessonSwitch}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
