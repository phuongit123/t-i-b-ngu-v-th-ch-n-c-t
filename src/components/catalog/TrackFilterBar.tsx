import React from 'react';
import { cn } from '@/lib/utils';
import { LayoutGrid, PenTool, Image, BookOpen, Terminal } from 'lucide-react';
import type { AffinityTrackId } from '@/types/design-system';

export type CatalogTrackFilter = 'all' | AffinityTrackId;

export interface TrackCounts {
  modules: number;
  lessons: number;
}

export interface TrackFilterOption {
  id: CatalogTrackFilter;
  label: string;
  studioName?: string;
  accentClass: string;
  activeClass: string;
  icon: React.ReactNode;
}

export interface TrackFilterBarProps {
  activeTrack: CatalogTrackFilter;
  onSelectTrack: (track: CatalogTrackFilter) => void;
  trackCounts?: Partial<Record<CatalogTrackFilter, TrackCounts>>;
  className?: string;
}

const TRACK_FILTER_OPTIONS: TrackFilterOption[] = [
  {
    id: 'all',
    label: 'Tất cả lộ trình',
    accentClass: 'text-zinc-300',
    activeClass: 'bg-zinc-800 text-zinc-100 font-bold border-zinc-700 shadow-subtle',
    icon: <LayoutGrid className="w-3.5 h-3.5 text-zinc-300" />,
  },
  {
    id: 'designer',
    label: 'Vector Studio',
    studioName: 'Thiết kế Vector',
    accentClass: 'text-cyan-400',
    activeClass: 'bg-cyan-950/40 text-cyan-300 font-bold border-cyan-500/40 shadow-glow-designer',
    icon: <PenTool className="w-3.5 h-3.5 text-cyan-400" />,
  },
  {
    id: 'photo',
    label: 'Pixel Studio',
    studioName: 'Chỉnh sửa ảnh',
    accentClass: 'text-sky-400',
    activeClass: 'bg-sky-950/40 text-sky-300 font-bold border-sky-500/40 shadow-glow-photo',
    icon: <Image className="w-3.5 h-3.5 text-sky-400" />,
  },
  {
    id: 'publisher',
    label: 'Layout Studio',
    studioName: 'Dàn trang',
    accentClass: 'text-rose-400',
    activeClass: 'bg-rose-950/40 text-rose-300 font-bold border-rose-500/40 shadow-glow-publisher',
    icon: <BookOpen className="w-3.5 h-3.5 text-rose-400" />,
  },
  {
    id: 'scripting',
    label: 'Tự động hóa',
    studioName: 'Scripting & MCP',
    accentClass: 'text-emerald-400',
    activeClass: 'bg-emerald-950/40 text-emerald-300 font-bold border-emerald-500/40 shadow-glow-brand',
    icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" />,
  },
];

export const TrackFilterBar: React.FC<TrackFilterBarProps> = ({
  activeTrack,
  onSelectTrack,
  trackCounts,
  className,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Lọc khóa học theo chuyên ngành"
      className={cn(
        'flex items-center gap-1.5 p-1.5 rounded-xl bg-surface/80 border border-hairline backdrop-blur-md overflow-x-auto scrollbar-none',
        className
      )}
    >
      {TRACK_FILTER_OPTIONS.map((option) => {
        const isActive = activeTrack === option.id;
        const counts = trackCounts?.[option.id];

        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isActive}
            data-track={option.id}
            data-testid={`track-filter-${option.id}`}
            type="button"
            onClick={() => onSelectTrack(option.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
              isActive
                ? option.activeClass
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border-transparent'
            )}
          >
            {option.icon}
            <span>
              {option.label}
              {option.studioName && (
                <span className="text-[10px] text-zinc-400 ml-1">({option.studioName})</span>
              )}
            </span>
            {counts && (
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.2 rounded-full border transition-colors',
                  isActive
                    ? 'bg-zinc-900/90 text-zinc-300 border-zinc-700/60'
                    : 'bg-zinc-900/60 text-zinc-500 border-hairline'
                )}
              >
                {counts.modules} học phần · {counts.lessons} bài
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
