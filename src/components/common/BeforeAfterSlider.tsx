import React, { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  altBefore?: string;
  altAfter?: string;
  initialPosition?: number;
  className?: string;
}

/**
 * Interactive Before/After comparison slider for Affinity RAW & color grading plates.
 * Uses GPU clip-path instead of resizing the underlying images so layers stay locked pixel-for-pixel.
 */
export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Ảnh Gốc (RAW)',
  afterLabel = 'Hậu Kỳ Curves & LUT',
  altBefore = 'Ảnh gốc trước khi hậu kỳ màu trong Pixel Studio',
  altAfter = 'Ảnh đã cân chỉnh màu sắc bằng Curves và Adjustment Layer',
  initialPosition = 50,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<number>(() =>
    Math.min(95, Math.max(5, initialPosition))
  );
  const [isDragging, setIsDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.round(Math.min(96, Math.max(4, pct)) * 10) / 10);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromClientX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 5;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setPosition((prev) => Math.max(4, prev - step));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPosition((prev) => Math.min(96, prev + step));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setPosition(4);
    } else if (event.key === 'End') {
      event.preventDefault();
      setPosition(96);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        ref={containerRef}
        data-testid="before-after-slider"
        role="slider"
        tabIndex={0}
        aria-label="Thanh trượt so sánh ảnh gốc RAW và ảnh đã chỉnh màu hậu kỳ"
        aria-valuemin={4}
        aria-valuemax={96}
        aria-valuenow={Math.round(position)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-hairline bg-obsidian select-none cursor-ew-resize touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        {/* Bottom Layer: Graded / Processed Output */}
        <img
          src={afterSrc}
          alt={altAfter}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />

        {/* Top Clipped Layer: Unprocessed / Before Plate */}
        <img
          src={beforeSrc}
          alt={altBefore}
          draggable={false}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />

        {/* Labels */}
        <span className="pointer-events-none absolute top-3.5 left-3.5 rounded-full bg-obsidian/85 backdrop-blur-md border border-hairline px-3 py-1 text-[11px] font-mono text-zinc-200 shadow-subtle">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute top-3.5 right-3.5 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400/40 px-3 py-1 text-[11px] font-mono text-cyan-200 shadow-subtle">
          {afterLabel}
        </span>

        {/* Split Hairline & Drag Handle */}
        <div
          aria-hidden="true"
          style={{ left: `${position}%` }}
          className="pointer-events-none absolute inset-y-0 -translate-x-1/2 flex items-center justify-center"
        >
          <div className="h-full w-0.5 bg-gradient-to-b from-cyan-400/80 via-white to-amber-400/80 shadow-[0_0_12px_rgba(34,211,238,0.65)]" />
          <div className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/70 bg-obsidian/90 text-cyan-300 shadow-lg backdrop-blur-md">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Interactive Range Companion Bar for precise percentage control */}
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <span>Kéo thanh dọc hoặc dùng phím mũi tên Trái/Phải để đối chiếu chi tiết vùng sáng tối</span>
        <span className="text-cyan-400 font-semibold shrink-0">{Math.round(position)}% RAW</span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
