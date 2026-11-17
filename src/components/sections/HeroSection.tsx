import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Terminal, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface HeroSectionProps {
  onExploreTracks: () => void;
  onLaunchPlayground: () => void;
  isMcpActive?: boolean;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreTracks,
  onLaunchPlayground,
  isMcpActive = true,
  className,
}) => {
  return (
    <section className={cn('relative py-12 md:py-20 text-center overflow-hidden', className)}>
      {/* Background subtle radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-blue-500/10 blur-[100px] pointer-events-none -z-10" />

      {/* Live Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-hairline text-[11px] font-mono text-zinc-300 mb-6 shadow-subtle">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>AFFINITY ACADEMY &bull; TƯ DUY THIẾT KẾ &amp; LÀM CHỦ STUDIO</span>
        {isMcpActive && (
          <span className="flex items-center gap-1 text-emerald-400 font-semibold pl-1.5 border-l border-hairline">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SẴN SÀNG THỰC HÀNH
          </span>
        )}
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-100 max-w-4xl mx-auto leading-[1.1]">
        Làm Chủ Tư Duy Thiết Kế &amp;{' '}
        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Tự Động Hóa Đồ Họa
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-5 leading-relaxed font-normal">
        Học viện tương tác thực chiến cho Vector Studio, Pixel Studio và Layout Studio kết hợp lập trình tự động hóa JavaScript DOM.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Button
          size="lg"
          variant="primary"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={onExploreTracks}
        >
          Khám Phá 22 Học Phần
        </Button>
        <Button
          size="lg"
          variant="outline"
          leftIcon={<Terminal className="w-4 h-4 text-emerald-400" />}
          onClick={onLaunchPlayground}
        >
          Mở Phòng Thực Hành DOM
        </Button>
      </div>

      {/* Proof Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-14 pt-8 border-t border-hairline text-left">
        <div>
          <span className="text-2xl font-bold font-mono text-zinc-100">22</span>
          <p className="text-xs text-zinc-500 uppercase font-mono mt-0.5">Học Phần Thực Chiến</p>
        </div>
        <div>
          <span className="text-2xl font-bold font-mono text-zinc-100">66</span>
          <p className="text-xs text-zinc-500 uppercase font-mono mt-0.5">Bài Học Tương Tác</p>
        </div>
        <div>
          <span className="text-2xl font-bold font-mono text-cyan-400">401</span>
          <p className="text-xs text-zinc-500 uppercase font-mono mt-0.5">Chủ Đề DOM API</p>
        </div>
        <div>
          <span className="text-2xl font-bold font-mono text-emerald-400">180ms</span>
          <p className="text-xs text-zinc-500 uppercase font-mono mt-0.5">Độ Trễ Kết Xuất</p>
        </div>
      </div>
    </section>
  );
};
