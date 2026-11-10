import React from 'react';
import { cn } from '@/lib/utils';
import { Award, CheckCircle, Flame } from 'lucide-react';

export interface ProgressCardProps {
  completedLessons: number;
  totalLessons?: number;
  streakDays?: number;
  earnedBadgesCount?: number;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  completedLessons,
  totalLessons = 120,
  streakDays = 1,
  earnedBadgesCount = 0,
  className,
}) => {
  const percentage = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

  return (
    <div className={cn('p-6 rounded-sm bg-surface border border-hairline', className)}>
      <div className="flex items-center justify-between pb-4 border-b border-hairline mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
            Overall Curriculum Progress
          </span>
          <h3 className="text-xl font-bold text-zinc-100 mt-0.5">
            {percentage}% Completed
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full border border-hairline bg-zinc-850 flex items-center justify-center font-mono font-bold text-sm text-emerald-400 shadow-subtle">
          {percentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xs bg-zinc-850/60 border border-hairline">
          <div className="flex items-center justify-center gap-1 text-zinc-400 text-[10px] uppercase font-mono mb-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Lessons
          </div>
          <span className="font-mono font-bold text-zinc-200">
            {completedLessons}/{totalLessons}
          </span>
        </div>

        <div className="p-2.5 rounded-xs bg-zinc-850/60 border border-hairline">
          <div className="flex items-center justify-center gap-1 text-zinc-400 text-[10px] uppercase font-mono mb-1">
            <Flame className="w-3 h-3 text-amber-400" />
            Streak
          </div>
          <span className="font-mono font-bold text-zinc-200">
            {streakDays} Days
          </span>
        </div>

        <div className="p-2.5 rounded-xs bg-zinc-850/60 border border-hairline">
          <div className="flex items-center justify-center gap-1 text-zinc-400 text-[10px] uppercase font-mono mb-1">
            <Award className="w-3 h-3 text-blue-400" />
            Badges
          </div>
          <span className="font-mono font-bold text-zinc-200">
            {earnedBadgesCount}
          </span>
        </div>
      </div>
    </div>
  );
};
