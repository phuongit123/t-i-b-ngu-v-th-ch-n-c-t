import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedBeamProps {
  className?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  fromRef?: React.RefObject<HTMLElement | null>;
  toRef?: React.RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  pathColor = 'gray',
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = '#ffaa40',
  gradientStopColor = '#9c40ff',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId();

  // Curvature calculation for smooth curve
  const d = `M ${20 + startXOffset} ${80 + startYOffset} Q 150 ${curvature + 30} ${280 + endXOffset} ${80 + endYOffset}`;

  return (
    <svg
      fill="none"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('pointer-events-none absolute inset-0 size-full', className)}
      viewBox="0 0 300 160"
    >
      <path
        d={d}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={d}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth * 1.5}
        strokeLinecap="round"
        className={reverse ? 'animate-beam-reverse' : 'animate-beam'}
        style={{
          strokeDasharray: '30 200',
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
