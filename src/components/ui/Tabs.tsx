import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pill';
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className,
  variant = 'underline',
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 border-b border-hairline',
        variant === 'pill' && 'border-b-0 bg-surface p-1 rounded-sm border',
        className
      )}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 text-xs font-medium px-3 py-2 transition-colors select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
              variant === 'underline' && [
                'text-zinc-400 hover:text-zinc-200',
                isActive && 'text-zinc-100 font-semibold',
              ],
              variant === 'pill' && [
                'rounded-xs text-zinc-400 hover:text-zinc-200',
                isActive && 'bg-zinc-800 text-zinc-100 font-semibold shadow-subtle',
              ]
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                  isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-850 text-zinc-500'
                )}
              >
                {tab.badge}
              </span>
            )}
            {variant === 'underline' && isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-200" />
            )}
          </button>
        );
      })}
    </div>
  );
};
