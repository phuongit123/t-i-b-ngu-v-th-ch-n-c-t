import React from 'react';
import { cn } from '@/lib/utils';
import { PlayCircle, CheckCircle2, Clock } from 'lucide-react';
import type { LessonSummary } from '@/types/design-system';

export interface LessonCardProps {
  lesson: LessonSummary;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isActive = false,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group flex items-center justify-between p-3.5 rounded-sm border transition-all duration-150 cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
        isActive
          ? 'bg-zinc-800/90 border-zinc-500 shadow-subtle'
          : 'bg-surface border-hairline hover:border-subtle hover:bg-surface/80',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-7 h-7 rounded-xs bg-zinc-850 flex items-center justify-center shrink-0 border border-hairline">
          {lesson.completed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <PlayCircle className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
          )}
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Lesson {lesson.lessonNumber}
          </span>
          <h5 className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white">
            {lesson.title}
          </h5>
        </div>
      </div>

      <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 shrink-0 ml-3">
        <Clock className="w-3 h-3 text-zinc-500" />
        <span>{lesson.durationMinutes}m</span>
      </div>
    </div>
  );
};
