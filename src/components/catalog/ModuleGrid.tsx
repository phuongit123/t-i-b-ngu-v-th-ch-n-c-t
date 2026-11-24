import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, BookOpen, Play, Inbox, CheckCircle2 } from 'lucide-react';
import { LessonCard } from '@/components/cards/LessonCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { CurriculumModule } from '@/types/curriculum';
import { moduleTranslationsVi } from '@/data/curriculum/translationsVi';
import { useLearningProgress } from '@/lib/learning-store';

export interface ModuleGridProps {
  modules: CurriculumModule[];
  activeLessonId?: string | null;
  onLaunchLesson: (lessonId: string) => void;
  onResetFilters?: () => void;
  className?: string;
}

const TRACK_BADGE_VI: Record<string, string> = {
  designer: 'Vector Studio',
  photo: 'Pixel Studio',
  publisher: 'Layout Studio',
  scripting: 'Tự động hóa',
};

function getModuleThumbnail(moduleId: string): { src: string; alt: string } {
  if (moduleId === 'D01') {
    return {
      src: '/assets/lessons/diagram-vector-workspace-vi.svg',
      alt: 'Sơ đồ giao diện Vector Studio và thanh công cụ Affinity',
    };
  }
  if (moduleId === 'D02') {
    return {
      src: '/assets/lessons/diagram-bezier-nodes-vi.svg',
      alt: 'Sơ đồ giải phẫu điểm neo và tay nắm tiếp tuyến Bézier',
    };
  }
  if (moduleId === 'D03') {
    return {
      src: '/assets/lessons/diagram-boolean-ops-vi.svg',
      alt: 'Sơ đồ phép toán hình học Boolean (Add, Subtract, Intersect, Xor)',
    };
  }
  if (moduleId.startsWith('D')) {
    return {
      src: '/assets/academy/studio-vector-art.png',
      alt: 'Tác phẩm minh họa hình học chính xác trong Vector Studio',
    };
  }
  if (moduleId === 'P01' || moduleId === 'P02' || moduleId === 'P03') {
    return {
      src: '/assets/lessons/diagram-pixel-masking-vi.svg',
      alt: 'Sơ đồ cấu trúc mặt nạ lớp (Layer Mask) và chỉnh sửa phi phá hủy',
    };
  }
  if (moduleId === 'P04' || moduleId === 'P05' || moduleId === 'P06') {
    return {
      src: '/assets/lessons/after-color-graded.png',
      alt: 'Mẫu hậu kỳ cân chỉnh màu sắc Curves & RAW trong Pixel Studio',
    };
  }
  if (moduleId.startsWith('P')) {
    return {
      src: '/assets/academy/studio-pixel-retouch.png',
      alt: 'Ảnh ghép thương mại ánh sáng phòng studio Pixel Studio',
    };
  }
  if (moduleId.startsWith('B')) {
    return {
      src: '/assets/lessons/diagram-layout-bleed-vi.svg',
      alt: 'Sơ đồ hệ lưới trang đôi, Margin và tràn lề Bleed 3mm trong Layout Studio',
    };
  }
  return {
    src: '/assets/lessons/diagram-mcp-bridge-vi.svg',
    alt: 'Sơ đồ kiến trúc cầu nối JavaScript DOM và Affinity MCP',
  };
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  modules,
  activeLessonId = null,
  onLaunchLesson,
  onResetFilters,
  className,
}) => {
  const { completedLessonIds, getModuleProgress } = useLearningProgress();

  if (modules.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="w-6 h-6 text-zinc-400" />}
        title="Không tìm thấy học phần phù hợp"
        description="Không có học phần hoặc bài học nào khớp với bộ lọc chuyên ngành, độ khó hoặc từ khóa tìm kiếm của bạn."
        action={
          onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-4 py-1.5 text-xs font-mono font-medium rounded-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-hairline transition-colors"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          )
        }
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {modules.map((mod) => {
        const difficultyConfig = {
          Beginner: {
            label: 'Cơ bản',
            badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          },
          Intermediate: {
            label: 'Trung cấp',
            badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          },
          Advanced: {
            label: 'Nâng cao',
            badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          },
        }[mod.difficulty] || {
          label: mod.difficulty,
          badgeClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
        };

        const modNumber = mod.moduleNumber || mod.id;
        const displayTitle = moduleTranslationsVi[mod.id]?.title || mod.title;
        const displayDescription = moduleTranslationsVi[mod.id]?.description || mod.description;
        const modProgress = getModuleProgress(mod.id);
        const thumbnail = getModuleThumbnail(mod.id);

        return (
          <div
            key={mod.id}
            data-testid={`module-card-${mod.id}`}
            data-track={mod.trackId}
            data-module-id={mod.id}
            className="space-y-5 p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] hover:border-[var(--color-border-subtle)] transition-all duration-200 shadow-sm"
          >
            {/* Module Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border-hairline)]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                <div className="w-full sm:w-40 h-24 shrink-0 overflow-hidden rounded-lg border border-[var(--color-border-hairline)] bg-[#090b10]">
                  <img
                    src={thumbnail.src}
                    alt={thumbnail.alt}
                    className={cn(
                      'h-full w-full',
                      thumbnail.src.endsWith('.svg') ? 'object-contain p-1.5' : 'object-cover'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]">
                      {modNumber}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-hairline">
                      {TRACK_BADGE_VI[mod.trackId] || mod.trackId}
                    </span>
                    <span
                      className={cn(
                        'text-xs px-2.5 py-0.5 rounded-full font-mono border',
                        difficultyConfig.badgeClass
                      )}
                    >
                      {difficultyConfig.label}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {mod.estimatedMinutes} phút
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] font-mono flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                      {mod.lessons.length} bài học
                    </span>
                    <span className="text-xs font-mono flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900/80 border border-hairline text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã hoàn thành {modProgress.completed}/{modProgress.total} bài
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-wide">
                    {displayTitle}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-4xl">
                    {displayDescription}
                  </p>
                </div>
              </div>

              {/* Right Action: Quick Start Button */}
              {mod.lessons.length > 0 && (
                <div className="shrink-0 flex items-center gap-3">
                  <button
                    type="button"
                    data-testid={`start-module-${modNumber}`}
                    onClick={() => onLaunchLesson(mod.lessons[0].id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-primary)] font-medium text-xs border border-[var(--color-border-hairline)] hover:border-zinc-400 transition-all shadow-subtle group"
                  >
                    <Play className="w-4 h-4 fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Bắt đầu học phần ({modNumber})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Lesson Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Danh sách bài học trong học phần:
                </h4>
                <span className="text-xs text-[var(--color-text-secondary)] font-mono">
                  {mod.lessons.length} bài học tương tác
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {mod.lessons.map((les) => (
                  <LessonCard
                    key={les.id}
                    lesson={{
                      id: les.id,
                      moduleId: les.moduleId,
                      lessonNumber: les.order,
                      title: les.title,
                      durationMinutes: les.durationMinutes,
                      completed: completedLessonIds.includes(les.id),
                    }}
                    isActive={activeLessonId === les.id}
                    onClick={() => onLaunchLesson(les.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
