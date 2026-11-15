import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'color-dodge'
  | 'soft-light';

export interface SimLayer {
  id: string;
  name: string;
  type: 'background' | 'subject' | 'adjustment' | 'filter';
  visible: boolean;
  opacity: number; // 0 - 100
  blendMode: BlendMode;
  isClipped?: boolean;
  hasMask?: boolean;
  color?: string;
}

// Canvas dimensions
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 420;

// Convert Affinity Blend Mode string to Canvas globalCompositeOperation
const getCanvasCompositeOp = (mode: BlendMode): GlobalCompositeOperation => {
  switch (mode) {
    case 'multiply':
      return 'multiply';
    case 'screen':
      return 'screen';
    case 'overlay':
      return 'overlay';
    case 'color-dodge':
      return 'color-dodge';
    case 'soft-light':
      return 'soft-light';
    default:
      return 'source-over';
  }
};

// Helper to draw a stylized subject silhouette / fashion figure
const drawSubjectFigure = (ctx: CanvasRenderingContext2D, isGrayscale: boolean) => {
  ctx.save();

  // Center Subject coordinates
  const cx = CANVAS_WIDTH * 0.38;
  const cy = CANVAS_HEIGHT * 0.58;

  // Body / Torso
  ctx.fillStyle = isGrayscale ? '#4b5563' : '#0284c7';
  ctx.beginPath();
  ctx.moveTo(cx - 55, cy + 120);
  ctx.lineTo(cx - 40, cy - 20);
  ctx.lineTo(cx + 40, cy - 20);
  ctx.lineTo(cx + 55, cy + 120);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = isGrayscale ? '#9ca3af' : '#fbcfe8';
  ctx.beginPath();
  ctx.arc(cx, cy - 65, 38, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = isGrayscale ? '#1f2937' : '#92400e';
  ctx.beginPath();
  ctx.arc(cx, cy - 80, 42, Math.PI * 0.8, Math.PI * 2.2);
  ctx.lineTo(cx + 52, cy - 25);
  ctx.lineTo(cx + 35, cy - 10);
  ctx.lineTo(cx - 35, cy - 10);
  ctx.lineTo(cx - 52, cy - 25);
  ctx.closePath();
  ctx.fill();

  // Sunglasses / Glasses
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(cx - 28, cy - 72, 22, 14);
  ctx.fillRect(cx + 6, cy - 72, 22, 14);
  ctx.fillRect(cx - 7, cy - 68, 14, 4);

  // Collar / Gold Accent Chain
  ctx.strokeStyle = isGrayscale ? '#d1d5db' : '#facc15';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 24, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
};

export const PhotoLayerSimulator: React.FC = () => {

  // Layer State
  const [layers, setLayers] = useState<SimLayer[]>([
    {
      id: 'filter-vignette',
      name: 'Live Vignette & Blur Filter',
      type: 'filter',
      visible: true,
      opacity: 80,
      blendMode: 'normal',
    },
    {
      id: 'adj-curves',
      name: 'Black & White / Curves Adjustment',
      type: 'adjustment',
      visible: false,
      opacity: 100,
      blendMode: 'normal',
      isClipped: true,
    },
    {
      id: 'layer-subject',
      name: 'Main Subject (Fashion Model)',
      type: 'subject',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      hasMask: true,
    },
    {
      id: 'layer-bg',
      name: 'Background Plate (Sunset Sky)',
      type: 'background',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
    },
  ]);

  const [activeLayerId, setActiveLayerId] = useState<string>('layer-subject');
  const [brushMode, setBrushMode] = useState<'black' | 'white'>('black');
  const [brushSize, setBrushSize] = useState<number>(35);
  const [brushHardness, setBrushHardness] = useState<number>(20); // 0 - 100
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<number>(1);
  const [vignetteRadius, setVignetteRadius] = useState<number>(50); // %

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize offscreen mask canvas
  useEffect(() => {
    if (!maskCanvasRef.current) {
      const offscreen = document.createElement('canvas');
      offscreen.width = CANVAS_WIDTH;
      offscreen.height = CANVAS_HEIGHT;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        // Initialize mask as solid white (White reveals all)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      maskCanvasRef.current = offscreen;
    }
  }, []);

  // Render composite to visual canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw Background Checkerboard (Transparency indicator)
    const checkSize = 16;
    for (let py = 0; py < CANVAS_HEIGHT; py += checkSize) {
      for (let px = 0; px < CANVAS_WIDTH; px += checkSize) {
        ctx.fillStyle = (px / checkSize + py / checkSize) % 2 === 0 ? '#1f242e' : '#171a22';
        ctx.fillRect(px, py, checkSize, checkSize);
      }
    }

    // Process layers from bottom to top (layer-bg -> layer-subject -> adj-curves -> filter-vignette)
    const bgLayer = layers.find((l) => l.id === 'layer-bg');
    const subjectLayer = layers.find((l) => l.id === 'layer-subject');
    const adjLayer = layers.find((l) => l.id === 'adj-curves');
    const filterLayer = layers.find((l) => l.id === 'filter-vignette');

    // --- A. Render Background Plate ---
    if (bgLayer && bgLayer.visible) {
      ctx.save();
      ctx.globalAlpha = bgLayer.opacity / 100;
      ctx.globalCompositeOperation = getCanvasCompositeOp(bgLayer.blendMode);

      // Sunset Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      skyGrad.addColorStop(0, '#1a103c'); // Deep twilight purple
      skyGrad.addColorStop(0.4, '#c2410c'); // Warm sunset orange
      skyGrad.addColorStop(0.7, '#f59e0b'); // Golden horizon
      skyGrad.addColorStop(1, '#78350f'); // Dark ground reflection
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Sun disc
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH * 0.72, CANVAS_HEIGHT * 0.45, 45, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Distant mountains
      ctx.fillStyle = '#311432';
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_HEIGHT * 0.75);
      ctx.lineTo(CANVAS_WIDTH * 0.25, CANVAS_HEIGHT * 0.55);
      ctx.lineTo(CANVAS_WIDTH * 0.55, CANVAS_HEIGHT * 0.72);
      ctx.lineTo(CANVAS_WIDTH * 0.8, CANVAS_HEIGHT * 0.58);
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT * 0.78);
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.lineTo(0, CANVAS_HEIGHT);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // --- B. Render Subject Layer with Offscreen Mask ---
    if (subjectLayer && subjectLayer.visible) {
      const subjectCanvas = document.createElement('canvas');
      subjectCanvas.width = CANVAS_WIDTH;
      subjectCanvas.height = CANVAS_HEIGHT;
      const sCtx = subjectCanvas.getContext('2d');

      if (sCtx) {
        // Draw Subject graphic
        drawSubjectFigure(sCtx, Boolean(adjLayer && adjLayer.visible && adjLayer.isClipped));

        // Apply offscreen mask (destination-in retains pixels where mask is white)
        if (maskCanvasRef.current) {
          sCtx.globalCompositeOperation = 'destination-in';
          sCtx.drawImage(maskCanvasRef.current, 0, 0);
        }

        // Composite Subject onto main canvas with opacity & blend mode
        ctx.save();
        ctx.globalAlpha = subjectLayer.opacity / 100;
        ctx.globalCompositeOperation = getCanvasCompositeOp(subjectLayer.blendMode);
        ctx.drawImage(subjectCanvas, 0, 0);
        ctx.restore();
      }
    }

    // --- C. Render Global Adjustment Layer (if not clipped) ---
    if (adjLayer && adjLayer.visible && !adjLayer.isClipped) {
      ctx.save();
      ctx.globalAlpha = adjLayer.opacity / 100;
      ctx.globalCompositeOperation = 'color';
      // Desaturate whole canvas to B&W
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.restore();
    }

    // --- D. Render Live Vignette Filter ---
    if (filterLayer && filterLayer.visible) {
      ctx.save();
      ctx.globalAlpha = filterLayer.opacity / 100;
      ctx.globalCompositeOperation = getCanvasCompositeOp(filterLayer.blendMode);

      const vigRadius = (CANVAS_WIDTH * 0.7 * vignetteRadius) / 100;
      const vigGrad = ctx.createRadialGradient(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        vigRadius * 0.4,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        vigRadius
      );
      vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');

      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.restore();
    }
  }, [layers, vignetteRadius]);

  // Invert mask (Ctrl+I / Cmd+I)
  const invertMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = 255 - d[i]; // Invert R
      d[i + 1] = 255 - d[i + 1]; // Invert G
      d[i + 2] = 255 - d[i + 2]; // Invert B
    }
    ctx.putImageData(imgData, 0, 0);
    renderCanvas();
  }, [renderCanvas]);

  // Reset mask to pure white
  const resetMask = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    renderCanvas();
  }, [renderCanvas]);

  // Draw on mask
  const paintOnMask = (x: number, y: number) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    const color = brushMode === 'black' ? '0, 0, 0' : '255, 255, 255';
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize / 2);

    const innerStop = brushHardness / 100;
    gradient.addColorStop(0, `rgba(${color}, 1)`);
    gradient.addColorStop(innerStop, `rgba(${color}, 1)`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    renderCanvas();
  };

  // Re-render when layer parameters change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Canvas Mouse / Pointer Interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    paintOnMask(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    paintOnMask(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  // Keyboard shortcuts (B, X, [, ], Ctrl+I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        setBrushMode((prev) => (prev === 'black' ? 'white' : 'black'));
      } else if (e.key === '[') {
        e.preventDefault();
        setBrushSize((prev) => Math.max(10, prev - 5));
      } else if (e.key === ']') {
        e.preventDefault();
        setBrushSize((prev) => Math.min(100, prev + 5));
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        invertMask();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invertMask]);

  // Update a single layer property
  const updateLayer = (id: string, updates: Partial<SimLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  // Load Preset Scenarios
  const loadScenario = (num: number) => {
    setActiveScenario(num);
    if (num === 1) {
      // Scenario 1: Masking Hair & Edge
      resetMask();
      setLayers([
        { id: 'filter-vignette', name: 'Live Vignette & Blur Filter', type: 'filter', visible: false, opacity: 80, blendMode: 'normal' },
        { id: 'adj-curves', name: 'Black & White Adjustment', type: 'adjustment', visible: false, opacity: 100, blendMode: 'normal', isClipped: true },
        { id: 'layer-subject', name: 'Main Subject (Fashion Model)', type: 'subject', visible: true, opacity: 100, blendMode: 'normal', hasMask: true },
        { id: 'layer-bg', name: 'Background Plate (Sunset Sky)', type: 'background', visible: true, opacity: 100, blendMode: 'normal' },
      ]);
      setActiveLayerId('layer-subject');
      setBrushMode('black');
    } else if (num === 2) {
      // Scenario 2: Multiply & Screen Blend Modes
      resetMask();
      setLayers([
        { id: 'filter-vignette', name: 'Live Vignette & Blur Filter', type: 'filter', visible: true, opacity: 70, blendMode: 'normal' },
        { id: 'adj-curves', name: 'Black & White Adjustment', type: 'adjustment', visible: false, opacity: 100, blendMode: 'normal', isClipped: true },
        { id: 'layer-subject', name: 'Main Subject (Fashion Model)', type: 'subject', visible: true, opacity: 90, blendMode: 'multiply', hasMask: true },
        { id: 'layer-bg', name: 'Background Plate (Sunset Sky)', type: 'background', visible: true, opacity: 100, blendMode: 'normal' },
      ]);
      setActiveLayerId('layer-subject');
    } else if (num === 3) {
      // Scenario 3: Clipped Adjustment Layer
      resetMask();
      setLayers([
        { id: 'filter-vignette', name: 'Live Vignette & Blur Filter', type: 'filter', visible: true, opacity: 60, blendMode: 'normal' },
        { id: 'adj-curves', name: 'Black & White Adjustment', type: 'adjustment', visible: true, opacity: 100, blendMode: 'normal', isClipped: true },
        { id: 'layer-subject', name: 'Main Subject (Fashion Model)', type: 'subject', visible: true, opacity: 100, blendMode: 'normal', hasMask: true },
        { id: 'layer-bg', name: 'Background Plate (Sunset Sky)', type: 'background', visible: true, opacity: 100, blendMode: 'normal' },
      ]);
      setActiveLayerId('adj-curves');
    }
  };

  return (
    <div className="bg-surface-elevated border border-hairline rounded-lg overflow-hidden shadow-card">
      {/* 1. Educational Simulation Disclaimer Banner */}
      <div className="bg-sky-950/40 border-b border-sky-800/40 px-4 py-2.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
        <div className="text-xs text-sky-200 leading-relaxed">
          <strong className="text-sky-300 font-semibold mr-1.5">MÔ HÌNH MÔ PHỎNG GIÁO DỤC:</strong>
          Đây là công cụ mô phỏng trực quan cơ chế Layer Stack, Blend Modes toán học và Non-destructive Masking
          chạy trực tiếp trên trình duyệt HTML5 Canvas, không yêu cầu cài đặt phần mềm desktop Serif Affinity Photo.
          Các phím tắt <code className="bg-sky-900/60 px-1 py-0.5 rounded text-sky-200">X</code>, <code className="bg-sky-900/60 px-1 py-0.5 rounded text-sky-200">[ / ]</code>, <code className="bg-sky-900/60 px-1 py-0.5 rounded text-sky-200">Ctrl+I</code> mô phỏng chuẩn xác logic của Affinity Photo 3.0.
        </div>
      </div>

      {/* 2. Scenario Presets & Workspace Controls */}
      <div className="bg-surface px-4 py-3 border-b border-hairline flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Kịch bản thực hành:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => loadScenario(1)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                activeScenario === 1
                  ? 'bg-sky-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              1. Masking Viền tóc
            </button>
            <button
              onClick={() => loadScenario(2)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                activeScenario === 2
                  ? 'bg-sky-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              2. Blend Modes (Multiply / Screen)
            </button>
            <button
              onClick={() => loadScenario(3)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                activeScenario === 3
                  ? 'bg-sky-600 text-white font-medium'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              3. Adjustment Layer Clipping
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Phím tắt:</span>
          <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[11px] text-zinc-300">X (Đổi màu)</kbd>
          <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[11px] text-zinc-300">[ / ] (Cỡ cọ)</kbd>
          <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-[11px] text-zinc-300">Ctrl+I (Đảo Mask)</kbd>
        </div>
      </div>

      {/* 3. Main Workspace: Canvas + Layers Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
        {/* Left: Viewport & Canvas (8 cols) */}
        <div className="lg:col-span-8 p-4 flex flex-col items-center bg-zinc-950/70">
          {/* Canvas Toolbar */}
          <div className="w-full max-w-[640px] mb-3 flex items-center justify-between bg-zinc-900 border border-zinc-800 px-3 py-2 rounded">
            {/* Brush Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 font-medium">Cọ Mask:</span>
                <button
                  onClick={() => setBrushMode('black')}
                  className={`text-xs px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors ${
                    brushMode === 'black'
                      ? 'bg-zinc-950 text-white border border-zinc-700 font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Black conceals: Tô đen để che / xóa đối tượng"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-black border border-zinc-500 inline-block" />
                  Đen (Che bớt)
                </button>
                <button
                  onClick={() => setBrushMode('white')}
                  className={`text-xs px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors ${
                    brushMode === 'white'
                      ? 'bg-zinc-100 text-zinc-900 font-medium shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="White reveals: Tô trắng để lấy lại chi tiết"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-400 inline-block" />
                  Trắng (Hiện lại)
                </button>
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400">Cỡ:</span>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-16 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-sky-500"
                />
                <span className="text-[11px] font-mono text-zinc-300 w-5">{brushSize}</span>
              </div>

              {/* Brush Hardness */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400">Độ cứng:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brushHardness}
                  onChange={(e) => setBrushHardness(Number(e.target.value))}
                  className="w-16 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-sky-500"
                />
                <span className="text-[11px] font-mono text-zinc-300 w-7">{brushHardness}%</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={invertMask}
                className="text-xs py-1 px-2 h-auto"
                title="Đảo ngược mặt nạ (Ctrl+I / Cmd+I)"
              >
                Invert Mask
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetMask}
                className="text-xs py-1 px-2 h-auto text-zinc-300"
                title="Đặt lại mặt nạ trắng nguyên bản"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div className="relative border border-zinc-700 rounded shadow-2xl overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="block max-w-full h-auto bg-zinc-900"
            />
          </div>

          <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Rê chuột vẽ trực tiếp trên khung ảnh để tạo mặt nạ non-destructive bằng thuật toán Canvas.</span>
          </div>
        </div>

        {/* Right: Layers Studio Panel (4 cols) */}
        <div className="lg:col-span-4 p-4 bg-zinc-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-zinc-200">Layers Studio</h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                {layers.filter((l) => l.visible).length}/{layers.length} Active
              </span>
            </div>

            {/* Layer Stack (Top to Bottom) */}
            <div className="space-y-2">
              {layers.map((layer) => {
                const isActive = activeLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`p-2.5 rounded border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800/90 border-sky-500/70 shadow-sm'
                        : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                    } ${layer.isClipped ? 'ml-4 border-l-2 border-l-sky-500' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLayer(layer.id, { visible: !layer.visible });
                          }}
                          className={`p-1 rounded transition-colors ${
                            layer.visible ? 'text-zinc-200 hover:text-white' : 'text-zinc-600 hover:text-zinc-400'
                          }`}
                          title={layer.visible ? 'Ẩn layer' : 'Hiện layer'}
                        >
                          {layer.visible ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <span
                          className={`text-xs font-medium truncate ${
                            layer.visible ? 'text-zinc-200' : 'text-zinc-500 line-through'
                          }`}
                        >
                          {layer.name}
                        </span>
                      </div>

                      {layer.hasMask && (
                        <span className="text-[10px] bg-zinc-800 text-sky-300 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
                          Mask
                        </span>
                      )}
                      {layer.isClipped && (
                        <span className="text-[10px] bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
                          Child
                        </span>
                      )}
                    </div>

                    {/* Blend Mode & Opacity Controls for Active Layer */}
                    {isActive && (
                      <div className="mt-2 pt-2 border-t border-zinc-800/80 space-y-2 text-xs">
                        {/* Blend Mode Select */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[11px] text-zinc-400">Blend Mode:</label>
                          <select
                            value={layer.blendMode}
                            onChange={(e) =>
                              updateLayer(layer.id, { blendMode: e.target.value as BlendMode })
                            }
                            className="bg-zinc-950 border border-zinc-700 text-zinc-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-sky-500"
                          >
                            <option value="normal">Normal</option>
                            <option value="multiply">Multiply (Tối hóa)</option>
                            <option value="screen">Screen (Sáng hóa)</option>
                            <option value="overlay">Overlay (Tương phản)</option>
                            <option value="color-dodge">Color Dodge</option>
                            <option value="soft-light">Soft Light</option>
                          </select>
                        </div>

                        {/* Opacity Slider */}
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[11px] text-zinc-400">Opacity:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={layer.opacity}
                              onChange={(e) =>
                                updateLayer(layer.id, { opacity: Number(e.target.value) })
                              }
                              className="w-20 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-sky-500"
                            />
                            <span className="text-[11px] font-mono text-zinc-300 w-8 text-right">
                              {layer.opacity}%
                            </span>
                          </div>
                        </div>

                        {/* Special controls for Vignette Filter */}
                        {layer.id === 'filter-vignette' && (
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <label className="text-[11px] text-zinc-400">Bán kính tối:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="20"
                                max="90"
                                value={vignetteRadius}
                                onChange={(e) => setVignetteRadius(Number(e.target.value))}
                                className="w-20 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-sky-500"
                              />
                              <span className="text-[11px] font-mono text-zinc-300 w-8 text-right">
                                {vignetteRadius}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Toggle Clipping for Adjustment layer */}
                        {layer.id === 'adj-curves' && (
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <label className="text-[11px] text-zinc-400">Clip to Subject:</label>
                            <button
                              onClick={() => updateLayer(layer.id, { isClipped: !layer.isClipped })}
                              className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                                layer.isClipped
                                  ? 'bg-sky-700 text-white'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {layer.isClipped ? 'Clipped (Chỉ áp dụng chủ thể)' : 'Global (Toàn bộ)'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Educational Insight Card */}
          <div className="mt-4 p-3 bg-zinc-950/80 border border-zinc-800 rounded text-xs space-y-1.5">
            <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nguyên lý cốt lõi:</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              <strong>Black Conceals, White Reveals:</strong> Mặt nạ layer sử dụng sắc độ đen để ẩn pixel và trắng để lộ pixel.
              Dữ liệu pixel gốc của chủ thể không bao giờ bị phá hủy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
