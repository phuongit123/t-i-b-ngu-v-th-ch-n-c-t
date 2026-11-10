import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center border border-rose-500/20 bg-rose-500/5 rounded-sm max-w-md mx-auto',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-3 border border-rose-500/30">
        <AlertCircle className="w-5 h-5 text-rose-400" />
      </div>
      <h3 className="text-sm font-semibold text-rose-200">{title}</h3>
      <p className="text-xs text-rose-300/80 mt-1 max-w-xs leading-relaxed font-mono">
        {message}
      </p>
      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={onRetry}
            className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
          >
            Retry Operation
          </Button>
        </div>
      )}
    </div>
  );
};
