import React from 'react';
import { cn } from '@/lib/utils';
import { PenTool, Image, BookOpen, Terminal, CheckCircle2, Circle } from 'lucide-react';
import type { AffinityTrackId, ModuleSummary } from '@/types/design-system';

export interface SidebarNavigationProps {
  activeTrackId: AffinityTrackId;
  onSelectTrack: (trackId: AffinityTrackId) => void;
  modules: ModuleSummary[];
  activeModuleId?: string;
  onSelectModule: (moduleId: string) => void;
  className?: string;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTrackId,
  onSelectTrack,
  modules,
  activeModuleId,
  onSelectModule,
  className,
}) => {
  const tracks: { id: AffinityTrackId; label: string; icon: React.ReactNode; colorClass: string }[] = [
    { id: 'designer', label: 'Designer Track', icon: <PenTool className="w-3.5 h-3.5" />, colorClass: 'text-cyan-400' },
    { id: 'photo', label: 'Photo Track', icon: <Image className="w-3.5 h-3.5" />, colorClass: 'text-blue-400' },
    { id: 'publisher', label: 'Publisher Track', icon: <BookOpen className="w-3.5 h-3.5" />, colorClass: 'text-rose-400' },
    { id: 'scripting', label: 'Scripting & MCP', icon: <Terminal className="w-3.5 h-3.5" />, colorClass: 'text-emerald-400' },
  ];

  const filteredModules = modules.filter((m) => m.trackId === activeTrackId);

  return (
    <aside className={cn('w-64 border-r border-hairline bg-surface/50 p-4 flex flex-col gap-6', className)}>
      {/* Track Selector */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mb-1">
          Learning Track
        </span>
        {tracks.map((track) => {
          const isSelected = track.id === activeTrackId;
          return (
            <button
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs font-medium transition-colors text-left',
                isSelected
                  ? 'bg-elevated text-zinc-100 font-semibold border border-hairline shadow-subtle'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
              )}
            >
              <span className={track.colorClass}>{track.icon}</span>
              <span className="flex-1">{track.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modules List */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mb-1">
          Modules ({filteredModules.length})
        </span>
        {filteredModules.map((m) => {
          const isActive = m.id === activeModuleId;
          const isComplete = (m.progressPercentage || 0) >= 100;

          return (
            <button
              key={m.id}
              onClick={() => onSelectModule(m.id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xs text-xs transition-colors text-left group',
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-zinc-600 shrink-0 group-hover:text-zinc-400" />
              )}
              <span className="font-mono text-[11px] text-zinc-500 shrink-0">{m.moduleNumber}</span>
              <span className="truncate flex-1">{m.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
