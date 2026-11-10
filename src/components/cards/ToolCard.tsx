import React from 'react';
import { cn } from '@/lib/utils';
import { Wrench } from 'lucide-react';
import type { ToolEncyclopediaItem } from '@/types/design-system';

export interface ToolCardProps {
  tool: ToolEncyclopediaItem;
  onClick: () => void;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  className,
}) => {
  const appBadgeColors = {
    designer: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    photo: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    publisher: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    universal: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  }[tool.app];

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
        'group flex flex-col justify-between p-4 rounded-sm bg-surface border border-hairline hover:border-subtle transition-all duration-150 cursor-pointer text-left select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xs bg-zinc-850 flex items-center justify-center border border-hairline text-zinc-300 group-hover:text-white">
            <Wrench className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border', appBadgeColors)}>
              {tool.app}
            </span>
            {tool.shortcut.windows && (
              <kbd className="px-1.5 py-0.5 text-[11px] font-mono font-bold bg-zinc-800 text-zinc-200 border border-hairline rounded-xs shadow-subtle">
                {tool.shortcut.windows}
              </kbd>
            )}
          </div>
        </div>

        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
          {tool.name}
        </h4>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span className="uppercase tracking-wider">Persona: {tool.persona}</span>
        {tool.modifiers && tool.modifiers.length > 0 && (
          <span className="text-zinc-400">{tool.modifiers.length} Modifiers</span>
        )}
      </div>
    </div>
  );
};
