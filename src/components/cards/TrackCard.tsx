import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, PenTool, Image, BookOpen, Terminal } from 'lucide-react';
import type { AffinityTrackId } from '@/types/design-system';

export interface TrackCardProps {
  id: AffinityTrackId;
  name: string;
  tagline: string;
  description: string;
  moduleCount: number;
  lessonCount: number;
  progressPercentage?: number;
  onClick: () => void;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  id,
  name,
  tagline,
  description,
  moduleCount,
  lessonCount,
  progressPercentage = 0,
  onClick,
  className,
}) => {
  const trackTheme = {
    designer: {
      accentText: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      glowClass: 'hover:shadow-glow-designer hover:border-cyan-500/40',
      progressBar: 'bg-cyan-400',
      icon: <PenTool className="w-5 h-5 text-cyan-400" />,
    },
    photo: {
      accentText: 'text-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      glowClass: 'hover:shadow-glow-photo hover:border-blue-500/40',
      progressBar: 'bg-blue-400',
      icon: <Image className="w-5 h-5 text-blue-400" />,
    },
    publisher: {
      accentText: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      glowClass: 'hover:shadow-glow-publisher hover:border-rose-500/40',
      progressBar: 'bg-rose-400',
      icon: <BookOpen className="w-5 h-5 text-rose-400" />,
    },
    scripting: {
      accentText: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      glowClass: 'hover:shadow-glow-brand hover:border-emerald-500/40',
      progressBar: 'bg-emerald-400',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
    },
  }[id];

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
        'group relative flex flex-col justify-between p-6 rounded-sm bg-surface border border-hairline transition-all duration-200 cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
        trackTheme.glowClass,
        className
      )}
    >
      <div>
        {/* Header Icon & Tagline */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-sm bg-zinc-850 flex items-center justify-center border border-hairline group-hover:scale-105 transition-transform">
            {trackTheme.icon}
          </div>
          <span className={cn('text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border', trackTheme.badgeBg)}>
            {tagline}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
          {name}
        </h3>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Progress & Lesson Metrics */}
      <div className="mt-6 pt-4 border-t border-hairline flex flex-col gap-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>{moduleCount} Modules &bull; {lessonCount} Lessons</span>
          <span className="font-semibold text-zinc-200">{progressPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', trackTheme.progressBar)}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Action Link */}
        <div className="flex items-center justify-between text-xs font-medium text-zinc-300 pt-1 group-hover:text-white transition-colors">
          <span>Explore Track</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
