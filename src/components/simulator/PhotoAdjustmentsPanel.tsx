import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { AdjustmentParams } from './pixel-processing';

interface PhotoAdjustmentsPanelProps {
  params: AdjustmentParams;
  histogram: number[];
  onChange: (next: AdjustmentParams) => void;
  onReset: () => void;
}

export const PhotoAdjustmentsPanel: React.FC<PhotoAdjustmentsPanelProps> = ({
  params,
  histogram,
  onChange,
  onReset,
}) => {
  const width = 220;
  const height = 100;

  const toY = (val255: number) =>
    height - Math.max(0, Math.min(255, val255)) * (height / 255);

  const p0 = { x: 0, y: height };
  const p1 = { x: width * 0.25, y: toY(64 + params.curveShadow) };
  const p2 = { x: width * 0.5, y: toY(128 + params.curveMidtone) };
  const p3 = { x: width * 0.75, y: toY(192 + params.curveHighlight) };
  const p4 = { x: width, y: 0 };

  const curvePath = `M ${p0.x} ${p0.y} Q ${(p0.x + p1.x) / 2} ${
    (p0.y + p1.y) / 2
  }, ${p1.x} ${p1.y} T ${p2.x} ${p2.y} T ${p3.x} ${p3.y} T ${p4.x} ${p4.y}`;

  const update = (key: keyof AdjustmentParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div
      data-testid="photo-adjustments-panel"
      className="mt-3 p-3 bg-zinc-950/90 border border-zinc-800 rounded-lg space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Curves LUT & HSL Thực tế
        </span>
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 underline"
        >
          Đặt lại 0
        </button>
      </div>

      {/* SVG Histogram + Tone Curve Preview (Never creates extra <canvas> in DOM) */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-24 rounded bg-zinc-900 border border-zinc-800 block"
      >
        {/* Grid lines */}
        <line x1={width * 0.25} y1={0} x2={width * 0.25} y2={height} stroke="rgba(255,255,255,0.06)" />
        <line x1={width * 0.5} y1={0} x2={width * 0.5} y2={height} stroke="rgba(255,255,255,0.08)" />
        <line x1={width * 0.75} y1={0} x2={width * 0.75} y2={height} stroke="rgba(255,255,255,0.06)" />
        <line x1={0} y1={height * 0.5} x2={width} y2={height * 0.5} stroke="rgba(255,255,255,0.08)" />

        {/* Live Luminance Histogram */}
        {histogram.map((pct, idx) => {
          const barW = width / Math.max(1, histogram.length);
          const barH = (pct / 100) * (height - 8);
          return (
            <rect
              key={idx}
              x={idx * barW}
              y={height - barH}
              width={Math.max(1, barW - 1)}
              height={barH}
              fill="rgba(56, 189, 248, 0.22)"
            />
          );
        })}

        {/* Diagonal baseline */}
        <line
          x1={0}
          y1={height}
          x2={width}
          y2={0}
          stroke="rgba(255,255,255,0.18)"
          strokeDasharray="3 3"
        />

        {/* Active Tone Curve */}
        <path d={curvePath} fill="none" stroke="#f59e0b" strokeWidth="2" />
        {[p1, p2, p3].map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3.5"
            fill="#fbbf24"
            stroke="#09090b"
            strokeWidth="1.2"
          />
        ))}
      </svg>

      {/* Sliders operating directly on pixel ImageData */}
      <div className="space-y-1.5 text-[11px]">
        {[
          { label: 'Vùng tối (Shadows)', key: 'curveShadow' as const, min: -60, max: 60, unit: '' },
          { label: 'Trung tính (Midtones)', key: 'curveMidtone' as const, min: -60, max: 60, unit: '' },
          { label: 'Vùng sáng (Highlights)', key: 'curveHighlight' as const, min: -60, max: 60, unit: '' },
          { label: 'Tương phản (Contrast)', key: 'contrast' as const, min: -80, max: 80, unit: '' },
          { label: 'Bão hòa màu (Saturation)', key: 'saturation' as const, min: -100, max: 100, unit: '%' },
          { label: 'Dịch tông màu (Hue)', key: 'hueShift' as const, min: -180, max: 180, unit: '°' },
        ].map((ctrl) => (
          <div key={ctrl.key} className="flex items-center justify-between gap-2">
            <label className="text-zinc-400 truncate">{ctrl.label}:</label>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="range"
                data-testid={`adj-slider-${ctrl.key}`}
                min={ctrl.min}
                max={ctrl.max}
                value={params[ctrl.key]}
                onChange={(e) => update(ctrl.key, Number(e.target.value))}
                className="w-20 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-amber-400"
              />
              <span className="font-mono text-zinc-300 w-9 text-right">
                {params[ctrl.key]}
                {ctrl.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
