import React from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export const AnimatedShinyText: React.FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          '--shiny-width': `${shimmerWidth}px`,
        } as React.CSSProperties
      }
      className={cn(
        'mx-auto max-w-md text-neutral-400/70',
        // Shine effect
        'animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%]',
        // Shine gradient
        'bg-gradient-to-r from-transparent via-white/80 via-50% to-transparent dark:via-white/80',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
