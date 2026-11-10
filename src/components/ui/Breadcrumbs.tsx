import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '@/types/design-system';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-zinc-400', className)}>
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        <li className="flex items-center">
          <button
            onClick={() => onNavigate && onNavigate('/')}
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
              {isLast || !item.href ? (
                <span className="text-zinc-200 font-medium truncate max-w-[200px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => item.href && onNavigate && onNavigate(item.href)}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
