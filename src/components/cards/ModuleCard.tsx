import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import type { ModuleSummary } from '@/types/design-system';

export interface ModuleCardProps {
  module: ModuleSummary;
  onClick: () => void;
  className?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onClick,
  className,
}) => {
  const isComplete = (module.progressPercentage || 0) >= 100;

  const difficultyColors = {
    Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Advanced: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }[module.difficulty];

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
        'group flex flex-col justify-between p-5 rounded-sm bg-surface border border-hairline hover:border-subtle transition-all duration-150 cursor-pointer text-left select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-xs bg-zinc-800 text-zinc-300 border border-hairline">
            {module.moduleNumber}
          </span>
          <div className="flex items-center gap-2">
            <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border', difficultyColors)}>
              {module.difficulty}
            </span>
            {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
        </div>

        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
          {module.title}
        </h4>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-zinc-400" />
          {module.lessonCount} Lessons
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-zinc-400" />
          {module.estimatedMinutes}m
        </span>
      </div>
    </div>
  );
};
