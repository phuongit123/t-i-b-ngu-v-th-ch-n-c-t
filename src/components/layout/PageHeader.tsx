import React from 'react';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import type { BreadcrumbItem } from '@/types/design-system';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  className,
}) => {
  return (
    <div className={cn('pb-6 mb-6 border-b border-hairline', className)}>
      {breadcrumbs && <div className="mb-3">{<Breadcrumbs items={breadcrumbs} />}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{title}</h1>
            {badge && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-hairline">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
