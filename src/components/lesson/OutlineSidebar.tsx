import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  PanelLeftClose,
} from 'lucide-react';
import type { CurriculumLesson, CurriculumModule } from '@/types/curriculum';
import { lessonTranslationsVi, moduleTranslationsVi } from '@/data/curriculum/translationsVi';
import { useLearningProgress } from '@/lib/learning-store';
import { cn } from '@/lib/utils';

const STANDARD_SECTION_LABELS = [
  '01 · Mục tiêu bài học',
  '02 · Kiến thức nền tảng',
  '03 · Công cụ & Phím tắt',
  '04 · Thực hành từng bước',
  '05 · Ví dụ & Sơ đồ',
  '06 · Thực hành hướng dẫn',
  '07 · Thử thách độc lập',
  '08 · Lỗi hay gặp & Khắc phục',
  '09 · Kiểm tra kiến thức',
  '10 · Tổng kết & Học liệu',
];

export interface OutlineSidebarProps {
  lesson: CurriculumLesson;
  module?: CurriculumModule;
  viewMode: 'slides' | 'sections';
  activeSectionIndex: number | null;
  onSelectLesson: (lessonId: string) => void;
  onSelectSection: (sectionNumber: number) => void;
  onSelectViewMode: (mode: 'slides' | 'sections') => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  className?: string;
}

/**
 * Multi-pane collapsible outline sidebar showing sibling lessons in the current module
 * and all 10 standard pedagogical sections of the active lesson.
 * NOTE: Deliberately uses <h3>/<div> instead of <h1>/<h2> so SlidePlayer retains unique h1/h2 headings.
 */
export const OutlineSidebar: React.FC<OutlineSidebarProps> = ({
  lesson,
  module,
  viewMode,
  activeSectionIndex,
  onSelectLesson,
  onSelectSection,
  onSelectViewMode,
  isOpen,
  onToggleOpen,
  className,
}) => {
  const { completedLessonIds, getModuleProgress } = useLearningProgress();

  if (!isOpen) {
    return null;
  }

  const moduleTitleVi = module ? moduleTranslationsVi[module.id]?.title || module.title : lesson.moduleId;
  const modProgress = getModuleProgress(lesson.moduleId);
  const siblingLessons = module?.lessons ?? [lesson];

  return (
    <aside
      data-testid="outline-sidebar"
      aria-label="Mục lục học phần và 10 phần bài học"
      className={cn(
        'w-full lg:w-72 xl:w-80 shrink-0 rounded-xl border border-hairline bg-surface p-4 space-y-5 self-start lg:sticky lg:top-20',
        className
      )}
    >
      {/* Header & Collapse Button */}
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-hairline">
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
            Học phần {lesson.moduleId}
          </div>
          <h3 className="text-sm font-bold text-white leading-snug mt-0.5 line-clamp-2">
            {moduleTitleVi}
          </h3>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>Tiến độ học phần</span>
            <span className="text-emerald-400 font-semibold">
              {modProgress.completed}/{modProgress.total} ({modProgress.percentage}%)
            </span>
          </div>
          <div className="mt-1 h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${modProgress.percentage}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleOpen}
          className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-canvas border border-transparent hover:border-hairline transition-colors shrink-0"
          title="Thu gọn thanh mục lục"
          aria-label="Thu gọn thanh mục lục"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Sibling Lessons in Module */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-1">
          Bài học trong học phần
        </div>
        <div className="space-y-1">
          {siblingLessons.map((sib) => {
            const isCurrent = sib.id === lesson.id;
            const isDone = completedLessonIds.includes(sib.id);
            const sibTitle = lessonTranslationsVi[sib.id] || sib.title;
            return (
              <button
                key={sib.id}
                type="button"
                data-testid={`outline-lesson-${sib.id}`}
                onClick={() => onSelectLesson(sib.id)}
                className={cn(
                  'w-full text-left rounded-lg border px-2.5 py-2 flex items-start gap-2.5 transition-colors',
                  isCurrent
                    ? 'border-cyan-400/50 bg-canvas text-white'
                    : 'border-transparent hover:border-hairline hover:bg-canvas/50 text-zinc-300'
                )}
              >
                <span className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Circle
                      className={cn(
                        'w-3.5 h-3.5',
                        isCurrent ? 'text-cyan-400' : 'text-zinc-500'
                      )}
                    />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono text-zinc-400">{sib.id}</div>
                  <div className="text-xs font-medium leading-snug truncate">{sibTitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reading Mode Quick Switch + 10 Standard Sections Index */}
      <div className="space-y-2 pt-3 border-t border-hairline">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-cyan-400" />
            <span>Mục lục 10 phần chuẩn</span>
          </span>
          <button
            type="button"
            onClick={() => onSelectViewMode(viewMode === 'slides' ? 'sections' : 'slides')}
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300"
          >
            {viewMode === 'slides' ? 'Xem toàn bộ' : 'Về Slide'}
          </button>
        </div>

        <nav className="space-y-1" aria-label="10 học phần tiêu chuẩn">
          {STANDARD_SECTION_LABELS.map((label, index) => {
            const secNumber = index + 1;
            const isSelected = viewMode === 'sections' && activeSectionIndex === secNumber;
            return (
              <button
                key={secNumber}
                type="button"
                data-testid={`outline-section-${secNumber}`}
                onClick={() => onSelectSection(secNumber)}
                className={cn(
                  'w-full text-left rounded-md px-2.5 py-1.5 text-xs flex items-center justify-between gap-2 transition-colors',
                  isSelected
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-canvas/60 border border-transparent'
                )}
              >
                <span className="truncate">{label}</span>
                <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default OutlineSidebar;
