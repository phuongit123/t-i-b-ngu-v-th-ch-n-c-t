import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps {
  name: string;
  className?: string;
  background: React.ReactNode;
  Icon?: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
  tag?: string;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta = 'Xem chi tiết',
  tag,
  onClick,
}) => {
  const content = (
    <div
      key={name}
      onClick={onClick}
      className={cn(
        'group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl',
        // Dark theme styling from elhussary
        'bg-zinc-950/70 [box-shadow:0_0_0_1px_rgba(255,255,255,.08)] hover:[box-shadow:0_0_0_1px_rgba(255,255,255,.2)] transition-all duration-300 backdrop-blur-sm',
        (onClick || href) && 'cursor-pointer',
        className
      )}
    >
      {/* Top Preview Background with Gradient Mask */}
      <div className="relative h-44 w-full overflow-hidden [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)]">
        {background}
      </div>

      {/* Content */}
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />}
            <h3 className="text-lg font-semibold text-white tracking-tight">{name}</h3>
          </div>
          {tag && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
              {tag}
            </span>
          )}
        </div>
        <p className="max-w-lg text-xs sm:text-sm text-zinc-400 leading-relaxed mt-1">{description}</p>
      </div>

      {/* Bottom CTA on hover */}
      <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
          <span>{cta}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-white/[.02]" />
    </div>
  );

  if (href) {
    return <a href={href} className="block">{content}</a>;
  }
  return content;
};
