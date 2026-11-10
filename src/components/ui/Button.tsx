import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { ButtonVariant, ButtonSize } from '@/types/design-system';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:opacity-40 disabled:pointer-events-none select-none';

    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200',
      secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-850 border border-hairline',
      outline: 'bg-transparent text-zinc-200 border border-hairline hover:bg-zinc-900 active:bg-zinc-800',
      ghost: 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800/60 active:bg-zinc-800',
      'accent-designer': 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 active:bg-cyan-500/30',
      'accent-photo': 'bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 active:bg-blue-500/30',
      'accent-publisher': 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 active:bg-rose-500/30',
      'accent-scripting': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 active:bg-emerald-500/30',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs h-7 px-2.5 gap-1.5',
      md: 'text-sm h-9 px-3.5 gap-2',
      lg: 'text-base h-11 px-5 gap-2.5',
      icon: 'h-9 w-9 p-0 justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
