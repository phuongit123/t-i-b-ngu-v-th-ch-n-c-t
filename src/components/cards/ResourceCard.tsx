import React from 'react';
import { cn } from '@/lib/utils';
import { Download, FileCode } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ResourceItem } from '@/types/design-system';

export interface ResourceCardProps {
  resource: ResourceItem;
  onDownload: () => void;
  className?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onDownload,
  className,
}) => {
  const formatBadges = {
    '.afpalette': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    '.afbrushes': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    '.aftemplate': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    '.afassets': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    '.pdf': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  }[resource.format];

  return (
    <div
      className={cn(
        'flex flex-col justify-between p-5 rounded-sm bg-surface border border-hairline hover:border-subtle transition-all duration-150',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xs bg-zinc-850 flex items-center justify-center border border-hairline text-zinc-300">
            <FileCode className="w-4 h-4" />
          </div>
          <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full border', formatBadges)}>
            {resource.format}
          </span>
        </div>

        <h4 className="text-sm font-bold text-zinc-100">{resource.title}</h4>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
          {resource.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-hairline flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
          <span>{resource.fileSize}</span>
          <span>&bull;</span>
          <span>{resource.downloadsCount} downloads</span>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={onDownload}
          className="text-xs"
        >
          Download
        </Button>
      </div>
    </div>
  );
};
