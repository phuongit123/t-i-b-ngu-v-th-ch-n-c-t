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
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Pencil,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePreferences } from '@/lib/preferences-context';
import {
  PHOTO_CANVAS_WIDTH,
  PHOTO_CANVAS_HEIGHT,
  AdjustmentParams,
  DEFAULT_ADJUSTMENT_PARAMS,
  MaskEvalMetrics,
  drawImageCover,
  extractPortraitStudioMatte,
  applyPixelAdjustments,
  computeLuminanceHistogram,
  evaluateMaskAccuracy,
} from './pixel-processing';
import { PhotoAdjustmentsPanel } from './PhotoAdjustmentsPanel';

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
  type: 'background' | 'subject' | 'adjustment' | 'filter' | 'pixel';
  visible: boolean;
  opacity: number; // 0 - 100
  blendMode: BlendMode;
  isClipped?: boolean;
  hasMask?: boolean;
  adjustments?: AdjustmentParams;
  lockedCore?: boolean;
}

export interface PhotoLayerSimulatorProps {
  embeddedChallengeMode?: boolean;
  onMaskEvaluate?: (metrics: MaskEvalMetrics) => void;
}

const CANVAS_WIDTH = PHOTO_CANVAS_WIDTH;
const CANVAS_HEIGHT = PHOTO_CANVAS_HEIGHT;

const BACKDROP_PLATES = [
  { id: 'sunset', label: 'Hoàng hôn thành phố', src: '/assets/simulator/background-sunset-city.png' },
  { id: 'alpine', label: 'Núi tuyết bình minh', src: '/assets/lessons/after-color-graded.png' },
  { id: 'studio-bottle', label: 'Studio ánh sáng trầm', src: '/assets/simulator/coldbrew-product-plate.png' },
];

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

function createInitialLayers(embeddedChallengeMode: boolean): SimLayer[] {
  return [
    {
      id: 'filter-vignette',
      name: 'Bộ lọc Live Vignette & Ánh viền',
      type: 'filter',
      visible: !embeddedChallengeMode,
      opacity: 35,
      blendMode: 'normal',
      lockedCore: true,
    },
    {
      id: 'adj-curves',
      name: 'Lớp chỉnh màu Curves & HSL',
      type: 'adjustment',
      visible: false,
      opacity: 100,
      blendMode: 'normal',
      isClipped: true,
      lockedCore: true,
      adjustments: {
        ...DEFAULT_ADJUSTMENT_PARAMS,
        saturation: -100,
      },
    },
    {
      id: 'layer-subject',
      name: 'Chủ thể chính (Chân dung Studio)',
      type: 'subject',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      hasMask: true,
      lockedCore: true,
    },
    {
      id: 'layer-bg',
      name: 'Nền ảnh (Hoàng hôn thành phố)',
      type: 'background',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      lockedCore: true,
    },
  ];
}

export const PhotoLayerSimulator: React.FC<PhotoLayerSimulatorProps> = ({
  embeddedChallengeMode = false,
  onMaskEvaluate,
}) => {
  const { preferences } = usePreferences();
  const invertShortcut = preferences.shortcutModifier === 'mac' ? 'Cmd+I' : 'Ctrl+I';

  const [layers, setLayers] = useState<SimLayer[]>(() =>
    createInitialLayers(embeddedChallengeMode)
  );
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-subject');
  const [brushMode, setBrushMode] = useState<'black' | 'white'>('black');
  const [pixelPaintColor, setPixelPaintColor] = useState<string>('#f59e0b');
  const [brushSize, setBrushSize] = useState<number>(38);
  const [brushHardness, setBrushHardness] = useState<number>(25);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<number>(1);
  const [vignetteRadius, setVignetteRadius] = useState<number>(72);
  const [backdropId, setBackdropId] = useState<string>('sunset');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState<string>('');
  const [dragLayerId, setDragLayerId] = useState<string | null>(null);
  const [histogram, setHistogram] = useState<number[]>(() => new Array(32).fill(20));
  const [photosReadyTick, setPhotosReadyTick] = useState<number>(0);

  // ONLY ONE <canvas> lives in the DOM; all image/mask/pixel caches stay off-DOM
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const subjectBufferRef = useRef<HTMLCanvasElement | null>(null);
  const bgBufferRef = useRef<HTMLCanvasElement | null>(null);
  const pixelLayerCanvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
  const referenceMatteRef = useRef<Uint8ClampedArray | null>(null);

  // Initialize offscreen mask canvas cleanly
  const ensureMaskCanvas = useCallback(() => {
    if (!maskCanvasRef.current) {
      const off = document.createElement('canvas');
      off.width = CANVAS_WIDTH;
      off.height = CANVAS_HEIGHT;
      const mCtx = off.getContext('2d');
      if (mCtx) {
        mCtx.fillStyle = '#ffffff';
        mCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      maskCanvasRef.current = off;
    }
    return maskCanvasRef.current;
  }, []);

  // Helper to paint reference studio matte onto offscreen mask
  const applySmartPortraitMatteToMask = useCallback(() => {
    const maskCanvas = ensureMaskCanvas();
    const mCtx = maskCanvas.getContext('2d');
    const matte = referenceMatteRef.current;
    if (!mCtx || !matte) return;

    const img = mCtx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
    const d = img.data;
    for (let i = 0; i < matte.length; i++) {
      const v = matte[i];
      const p = i * 4;
      d[p] = v;
      d[p + 1] = v;
      d[p + 2] = v;
      d[p + 3] = v; // Alpha channel drives Canvas destination-in masking directly
    }
    mCtx.putImageData(img, 0, 0);
  }, [ensureMaskCanvas]);

  // Load real photographic studio subject
  useEffect(() => {
    let active = true;
    const img = new Image();
    img.src = '/assets/simulator/portrait-subject-studio.png';
    img.onload = () => {
      if (!active) return;
      const buf = document.createElement('canvas');
      buf.width = CANVAS_WIDTH;
      buf.height = CANVAS_HEIGHT;
      const bCtx = buf.getContext('2d');
      if (bCtx) {
        drawImageCover(bCtx, img, CANVAS_WIDTH, CANVAS_HEIGHT, 0.5, 0.35);
        subjectBufferRef.current = buf;
        const subjectImgData = bCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        referenceMatteRef.current = extractPortraitStudioMatte(subjectImgData);

        if (!embeddedChallengeMode) {
          applySmartPortraitMatteToMask();
        } else {
          const maskCanvas = ensureMaskCanvas();
          const mCtx = maskCanvas.getContext('2d');
          if (mCtx) {
            mCtx.fillStyle = '#ffffff';
            mCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          }
        }
        setPhotosReadyTick((t) => t + 1);
      }
    };
    return () => {
      active = false;
    };
  }, [embeddedChallengeMode, applySmartPortraitMatteToMask, ensureMaskCanvas]);

  // Load real background backdrop plate when changed
  useEffect(() => {
    let active = true;
    const plate = BACKDROP_PLATES.find((p) => p.id === backdropId) ?? BACKDROP_PLATES[0];
    const img = new Image();
    img.src = plate.src;
    img.onload = () => {
      if (!active) return;
      const buf = document.createElement('canvas');
      buf.width = CANVAS_WIDTH;
      buf.height = CANVAS_HEIGHT;
      const bCtx = buf.getContext('2d');
      if (bCtx) {
        drawImageCover(bCtx, img, CANVAS_WIDTH, CANVAS_HEIGHT, 0.5, 0.5);
        bgBufferRef.current = buf;
        setPhotosReadyTick((t) => t + 1);
      }
    };
    return () => {
      active = false;
    };
  }, [backdropId]);

  const emitMaskMetrics = useCallback(() => {
    if (!onMaskEvaluate || !maskCanvasRef.current || !referenceMatteRef.current) return;
    const mCtx = maskCanvasRef.current.getContext('2d');
    if (!mCtx) return;
    const imgData = mCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    onMaskEvaluate(evaluateMaskAccuracy(imgData, referenceMatteRef.current));
  }, [onMaskEvaluate]);

  // Composite real layers from bottom to top dynamically
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Transparency Checkerboard
    const checkSize = 16;
    for (let py = 0; py < CANVAS_HEIGHT; py += checkSize) {
      for (let px = 0; px < CANVAS_WIDTH; px += checkSize) {
        ctx.fillStyle = (px / checkSize + py / checkSize) % 2 === 0 ? '#1f242e' : '#171a22';
        ctx.fillRect(px, py, checkSize, checkSize);
      }
    }

    const maskCanvas = ensureMaskCanvas();
    const subjectIndex = layers.findIndex((l) => l.id === 'layer-subject');

    // Find clipped adjustment layers directly attached above layer-subject
    const clippedAdjustments = layers.filter(
      (l, idx) =>
        l.type === 'adjustment' &&
        l.visible &&
        l.isClipped &&
        subjectIndex !== -1 &&
        idx < subjectIndex
    );

    // Render layer stack from bottom (index length-1) up to top (index 0)
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      if (!layer.visible) continue;

      if (layer.type === 'background') {
        ctx.save();
        ctx.globalAlpha = layer.opacity / 100;
        ctx.globalCompositeOperation = getCanvasCompositeOp(layer.blendMode);
        if (bgBufferRef.current) {
          ctx.drawImage(bgBufferRef.current, 0, 0);
        } else {
          const fallbackGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
          fallbackGrad.addColorStop(0, '#1e1b4b');
          fallbackGrad.addColorStop(0.5, '#9a3412');
          fallbackGrad.addColorStop(1, '#18181b');
          ctx.fillStyle = fallbackGrad;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        ctx.restore();
      } else if (layer.type === 'subject') {
        const subjectCanvas = document.createElement('canvas');
        subjectCanvas.width = CANVAS_WIDTH;
        subjectCanvas.height = CANVAS_HEIGHT;
        const sCtx = subjectCanvas.getContext('2d', { willReadFrequently: true });
        if (!sCtx) continue;

        if (subjectBufferRef.current) {
          sCtx.drawImage(subjectBufferRef.current, 0, 0);
        } else {
          // Neutral waiting tone while image finishes decoding
          sCtx.fillStyle = '#27272a';
          sCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Apply clipped adjustment layers strictly onto subject pixels
        for (const adj of [...clippedAdjustments].reverse()) {
          if (!adj.adjustments) continue;
          const imgData = sCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          const adjusted = applyPixelAdjustments(imgData, adj.adjustments, adj.opacity);
          sCtx.putImageData(adjusted, 0, 0);
        }

        // Apply non-destructive alpha matte from maskCanvas
        sCtx.globalCompositeOperation = 'destination-in';
        sCtx.drawImage(maskCanvas, 0, 0);

        ctx.save();
        ctx.globalAlpha = layer.opacity / 100;
        ctx.globalCompositeOperation = getCanvasCompositeOp(layer.blendMode);
        ctx.drawImage(subjectCanvas, 0, 0);
        ctx.restore();
      } else if (layer.type === 'adjustment') {
        // Skip already applied clipped adjustments
        if (layer.isClipped || !layer.adjustments) continue;
        // Global Adjustment: apply real pixel Curves + HSL across composite below
        const currentImg = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const adjusted = applyPixelAdjustments(currentImg, layer.adjustments, layer.opacity);
        ctx.putImageData(adjusted, 0, 0);
      } else if (layer.type === 'pixel') {
        const pixCanvas = pixelLayerCanvasesRef.current[layer.id];
        if (!pixCanvas) continue;
        ctx.save();
        ctx.globalAlpha = layer.opacity / 100;
        ctx.globalCompositeOperation = getCanvasCompositeOp(layer.blendMode);
        ctx.drawImage(pixCanvas, 0, 0);
        ctx.restore();
      } else if (layer.type === 'filter') {
        ctx.save();
        ctx.globalAlpha = layer.opacity / 100;
        ctx.globalCompositeOperation = getCanvasCompositeOp(layer.blendMode);
        const vigRadius = (CANVAS_WIDTH * 0.72 * vignetteRadius) / 100;
        const vigGrad = ctx.createRadialGradient(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2,
          vigRadius * 0.42,
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
    }

    const finalData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHistogram(computeLuminanceHistogram(finalData));
  }, [layers, vignetteRadius, ensureMaskCanvas]);

  useEffect(() => {
    void photosReadyTick;
    renderCanvas();
  }, [renderCanvas, photosReadyTick]);

  const invertMask = useCallback(() => {
    const maskCanvas = ensureMaskCanvas();
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const nextVal = 255 - d[i + 3];
      d[i] = nextVal;
      d[i + 1] = nextVal;
      d[i + 2] = nextVal;
      d[i + 3] = nextVal;
    }
    ctx.putImageData(imgData, 0, 0);
    renderCanvas();
    emitMaskMetrics();
  }, [ensureMaskCanvas, renderCanvas, emitMaskMetrics]);

  const resetMask = useCallback(() => {
    const maskCanvas = ensureMaskCanvas();
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    renderCanvas();
    emitMaskMetrics();
  }, [ensureMaskCanvas, renderCanvas, emitMaskMetrics]);

  const handleSmartMatte = () => {
    applySmartPortraitMatteToMask();
    renderCanvas();
    emitMaskMetrics();
  };

  // Paint on mask OR active custom pixel layer
  const paintAt = (x: number, y: number) => {
    const activeLayer = layers.find((l) => l.id === activeLayerId);

    if (activeLayer?.type === 'pixel') {
      let pixCanvas = pixelLayerCanvasesRef.current[activeLayer.id];
      if (!pixCanvas) {
        pixCanvas = document.createElement('canvas');
        pixCanvas.width = CANVAS_WIDTH;
        pixCanvas.height = CANVAS_HEIGHT;
        pixelLayerCanvasesRef.current[activeLayer.id] = pixCanvas;
      }
      const pCtx = pixCanvas.getContext('2d');
      if (!pCtx) return;

      const hex = pixelPaintColor.replace('#', '');
      const r = parseInt(hex.slice(0, 2), 16) || 245;
      const g = parseInt(hex.slice(2, 4), 16) || 158;
      const b = parseInt(hex.slice(4, 6), 16) || 11;

      const grad = pCtx.createRadialGradient(x, y, 0, x, y, brushSize / 2);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.72)`);
      grad.addColorStop(Math.max(0.1, brushHardness / 100), `rgba(${r}, ${g}, ${b}, 0.45)`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      pCtx.fill();
      renderCanvas();
      return;
    }

    const maskCanvas = ensureMaskCanvas();
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    // Black brush erases alpha (destination-out) so destination-in conceals subject pixels;
    // White brush restores alpha (source-over) to reveal subject pixels.
    const innerStop = brushHardness / 100;
    if (brushMode === 'black') {
      ctx.globalCompositeOperation = 'destination-out';
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize / 2);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(innerStop, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize / 2);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(innerStop, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
    }

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    renderCanvas();
    emitMaskMetrics();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
    paintAt(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
    const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
    paintAt(x, y);
  };

  const handlePointerUp = () => setIsDrawing(false);

  // Shortcuts: X, [, ], Ctrl+I
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
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

  const updateLayer = (id: string, updates: Partial<SimLayer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  };

  const reorderLayerByDrag = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setLayers((prev) => {
      const fromIdx = prev.findIndex((l) => l.id === fromId);
      const toIdx = prev.findIndex((l) => l.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return copy;
    });
  };

  const handleAddAdjustmentLayer = () => {
    const id = `adj-custom-${Date.now()}`;
    const newAdj: SimLayer = {
      id,
      name: `Curves / HSL (${layers.filter((l) => l.type === 'adjustment').length + 1})`,
      type: 'adjustment',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      isClipped: false,
      adjustments: {
        ...DEFAULT_ADJUSTMENT_PARAMS,
        curveMidtone: 18,
        contrast: 16,
        saturation: 15,
      },
    };
    setLayers((prev) => [newAdj, ...prev]);
    setActiveLayerId(id);
  };

  const handleAddPixelLayer = () => {
    const id = `pixel-custom-${Date.now()}`;
    const off = document.createElement('canvas');
    off.width = CANVAS_WIDTH;
    off.height = CANVAS_HEIGHT;
    pixelLayerCanvasesRef.current[id] = off;

    const newPix: SimLayer = {
      id,
      name: `Lớp vẽ Ánh sáng (${layers.filter((l) => l.type === 'pixel').length + 1})`,
      type: 'pixel',
      visible: true,
      opacity: 90,
      blendMode: 'screen',
    };
    setLayers((prev) => [newPix, ...prev]);
    setActiveLayerId(id);
  };

  const handleDeleteLayer = (id: string) => {
    delete pixelLayerCanvasesRef.current[id];
    setLayers((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      if (activeLayerId === id && filtered.length > 0) {
        setActiveLayerId(filtered[0].id);
      }
      return filtered;
    });
  };

  const loadScenario = (num: number) => {
    setActiveScenario(num);
    if (!embeddedChallengeMode) {
      applySmartPortraitMatteToMask();
    } else {
      resetMask();
    }

    if (num === 1) {
      setLayers(createInitialLayers(embeddedChallengeMode));
      setActiveLayerId('layer-subject');
      setBrushMode('black');
    } else if (num === 2) {
      setLayers([
        { id: 'filter-vignette', name: 'Bộ lọc Live Vignette & Ánh viền', type: 'filter', visible: true, opacity: 60, blendMode: 'normal', lockedCore: true },
        { id: 'adj-curves', name: 'Lớp chỉnh màu Curves & HSL', type: 'adjustment', visible: false, opacity: 100, blendMode: 'normal', isClipped: true, lockedCore: true, adjustments: { ...DEFAULT_ADJUSTMENT_PARAMS, saturation: -100 } },
        { id: 'layer-subject', name: 'Chủ thể chính (Chân dung Studio)', type: 'subject', visible: true, opacity: 92, blendMode: 'soft-light', hasMask: true, lockedCore: true },
        { id: 'layer-bg', name: 'Nền ảnh (Hoàng hôn thành phố)', type: 'background', visible: true, opacity: 100, blendMode: 'normal', lockedCore: true },
      ]);
      setActiveLayerId('layer-subject');
    } else if (num === 3) {
      setLayers([
        { id: 'filter-vignette', name: 'Bộ lọc Live Vignette & Ánh viền', type: 'filter', visible: true, opacity: 55, blendMode: 'normal', lockedCore: true },
        { id: 'adj-curves', name: 'Lớp chỉnh màu Curves & HSL', type: 'adjustment', visible: true, opacity: 100, blendMode: 'normal', isClipped: true, lockedCore: true, adjustments: { ...DEFAULT_ADJUSTMENT_PARAMS, saturation: -100, contrast: 25 } },
        { id: 'layer-subject', name: 'Chủ thể chính (Chân dung Studio)', type: 'subject', visible: true, opacity: 100, blendMode: 'normal', hasMask: true, lockedCore: true },
        { id: 'layer-bg', name: 'Nền ảnh (Hoàng hôn thành phố)', type: 'background', visible: true, opacity: 100, blendMode: 'normal', lockedCore: true },
      ]);
      setActiveLayerId('adj-curves');
    }
  };

  const activeLayerObj = layers.find((l) => l.id === activeLayerId);

  return (
    <div className="bg-surface-elevated border border-hairline rounded-lg overflow-hidden shadow-card">
      {/* 1. Disclaimer Banner (Preserved for TC-PHOTO-03 & TC-EXIST-03) */}
      <div className="bg-sky-950/40 border-b border-sky-800/40 px-4 py-2.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
        <div className="text-xs text-sky-200 leading-relaxed">
          <strong className="text-sky-300 font-semibold mr-1.5">MÔ HÌNH MÔ PHỎNG GIÁO DỤC:</strong>
          Xử lý ảnh chân dung thực tế qua Layer Stack, Blend Modes, Non-destructive Masking và thuật toán Curves LUT / HSL trên từng pixel ImageData.
          Phím tắt: <code className="bg-sky-900/60 px-1 py-0.5 rounded text-sky-200">X</code>, <code className="bg-sky-900/60 px-1 py-0.5 rounded text-sky-200">[ / ]</code>, <code className="bg-sky-900/60 px-1 py-0.5 rounded text-sky-200">{invertShortcut}</code>.
        </div>
      </div>

      {/* 2. Scenarios & Backdrop Switcher */}
      <div className="bg-surface px-4 py-3 border-b border-hairline flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Kịch bản thực hành:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => loadScenario(1)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                activeScenario === 1 ? 'bg-sky-600 text-white font-medium' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              1. Masking Viền tóc
            </button>
            <button
              type="button"
              onClick={() => loadScenario(2)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                activeScenario === 2 ? 'bg-sky-600 text-white font-medium' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              2. Blend Modes (Multiply / Screen)
            </button>
            <button
              type="button"
              onClick={() => loadScenario(3)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${
                activeScenario === 3 ? 'bg-sky-600 text-white font-medium' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              3. Adjustment Layer Clipping
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Ảnh nền:</span>
          <select
            data-testid="photo-backdrop-select"
            value={backdropId}
            onChange={(e) => setBackdropId(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1 text-xs"
          >
            {BACKDROP_PLATES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
        {/* Left: Canvas Viewport (8 cols) */}
        <div className="lg:col-span-8 p-4 flex flex-col items-center bg-zinc-950/70">
          {/* Brush & Mask Toolbar */}
          <div className="w-full max-w-[640px] mb-3 flex flex-wrap items-center justify-between gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded">
            <div className="flex flex-wrap items-center gap-3">
              {activeLayerObj?.type === 'pixel' ? (
                <label className="flex items-center gap-1.5 text-xs text-amber-300">
                  <span>Màu cọ Pixel:</span>
                  <input
                    type="color"
                    value={pixelPaintColor}
                    onChange={(e) => setPixelPaintColor(e.target.value)}
                    className="w-6 h-5 rounded border border-zinc-700 bg-transparent cursor-pointer"
                  />
                </label>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-400 font-medium">Cọ Mask:</span>
                  <button
                    type="button"
                    onClick={() => setBrushMode('black')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors ${
                      brushMode === 'black'
                        ? 'bg-zinc-950 text-white border border-zinc-700 font-medium shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Tô đen để che bớt đối tượng"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-black border border-zinc-500 inline-block" />
                    Đen (Che)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrushMode('white')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors ${
                      brushMode === 'white'
                        ? 'bg-zinc-100 text-zinc-900 font-medium shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    title="Tô trắng để lấy lại chi tiết"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-400 inline-block" />
                    Trắng (Hiện)
                  </button>
                </div>
              )}

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

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400">Cứng:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brushHardness}
                  onChange={(e) => setBrushHardness(Number(e.target.value))}
                  className="w-14 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-sky-500"
                />
                <span className="text-[11px] font-mono text-zinc-300 w-7">{brushHardness}%</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                data-testid="photo-smart-matte-btn"
                onClick={handleSmartMatte}
                className="text-xs py-1 px-2 h-auto text-emerald-300 border-emerald-500/40"
                title="Tự động tách phông xám studio khỏi chủ thể chân dung"
              >
                <Wand2 className="w-3 h-3 mr-1" /> Tách nền thông minh
              </Button>
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
                title="Khôi phục mặt nạ trắng nguyên bản"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            </div>
          </div>

          {/* ONLY ONE <canvas> element in DOM */}
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
            <span>Rê chuột trực tiếp lên ảnh để tô Mask phi phá hủy hoặc vẽ ánh sáng lên lớp Pixel tùy chọn.</span>
          </div>
        </div>

        {/* Right: Layers Studio + Curves/HSL Panel (4 cols) */}
        <div className="lg:col-span-4 p-4 bg-zinc-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-zinc-200">Layers Studio</h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                {layers.filter((l) => l.visible).length}/{layers.length} lớp
              </span>
            </div>

            {/* Layer Creation Buttons */}
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              <button
                type="button"
                data-testid="photo-add-adjustment-layer"
                onClick={handleAddAdjustmentLayer}
                className="px-2 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-medium flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Lớp chỉnh màu
              </button>
              <button
                type="button"
                data-testid="photo-add-pixel-layer"
                onClick={handleAddPixelLayer}
                className="px-2 py-1.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-[11px] font-medium flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" /> Lớp vẽ Pixel
              </button>
            </div>

            {/* Layer Stack (Top to Bottom, draggable & reorderable) */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-0.5">
              {layers.map((layer, index) => {
                const isActive = activeLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    data-testid={`layer-item-${layer.id}`}
                    draggable
                    onDragStart={() => setDragLayerId(layer.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragLayerId) {
                        reorderLayerByDrag(dragLayerId, layer.id);
                        setDragLayerId(null);
                      }
                    }}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`p-2.5 rounded border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-800/90 border-sky-500/70 shadow-sm'
                        : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                    } ${layer.isClipped ? 'ml-4 border-l-2 border-l-sky-500' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <div className="flex items-center gap-1.5 overflow-hidden flex-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateLayer(layer.id, { visible: !layer.visible });
                          }}
                          className={`p-1 rounded transition-colors shrink-0 ${
                            layer.visible ? 'text-zinc-200 hover:text-white' : 'text-zinc-600 hover:text-zinc-400'
                          }`}
                          title={layer.visible ? 'Ẩn layer' : 'Hiện layer'}
                        >
                          {layer.visible ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {renamingId === layer.id ? (
                          <input
                            type="text"
                            data-testid={`layer-rename-input-${layer.id}`}
                            value={renameDraft}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setRenameDraft(e.target.value)}
                            onBlur={() => {
                              if (renameDraft.trim()) updateLayer(layer.id, { name: renameDraft.trim() });
                              setRenamingId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (renameDraft.trim()) updateLayer(layer.id, { name: renameDraft.trim() });
                                setRenamingId(null);
                              }
                            }}
                            className="bg-zinc-950 border border-sky-500 rounded px-1.5 py-0.5 text-xs text-zinc-100 w-full"
                          />
                        ) : (
                          <span
                            className={`text-xs font-medium truncate ${
                              layer.visible ? 'text-zinc-200' : 'text-zinc-500 line-through'
                            }`}
                          >
                            {layer.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          data-testid={`layer-rename-btn-${layer.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingId(layer.id);
                            setRenameDraft(layer.name);
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-zinc-200"
                          title="Đổi tên layer"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          data-testid={`layer-up-${layer.id}`}
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayer(layer.id, 'up');
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-25"
                          title="Đưa lớp lên trên"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          data-testid={`layer-down-${layer.id}`}
                          disabled={index === layers.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveLayer(layer.id, 'down');
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-25"
                          title="Đưa lớp xuống dưới"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        {!layer.lockedCore && (
                          <button
                            type="button"
                            data-testid={`layer-delete-${layer.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLayer(layer.id);
                            }}
                            className="p-1 rounded text-zinc-500 hover:text-rose-400"
                            title="Xóa layer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-6">
                      {layer.hasMask && (
                        <span className="text-[10px] bg-zinc-800 text-sky-300 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
                          Mask
                        </span>
                      )}
                      {layer.isClipped && (
                        <span className="text-[10px] bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
                          Lồng lớp con
                        </span>
                      )}
                      {layer.type === 'adjustment' && (
                        <span className="text-[10px] bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/40 font-mono">
                          Curves/HSL
                        </span>
                      )}
                      {layer.type === 'pixel' && (
                        <span className="text-[10px] bg-sky-950/60 text-sky-300 px-1.5 py-0.5 rounded border border-sky-700/40 font-mono">
                          Pixel
                        </span>
                      )}
                    </div>

                    {isActive && (
                      <div className="mt-2 pt-2 border-t border-zinc-800/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-[11px] text-zinc-400">Hòa trộn:</label>
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

                        {layer.type === 'adjustment' && (
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <label className="text-[11px] text-zinc-400">Phạm vi:</label>
                            <button
                              type="button"
                              onClick={() => updateLayer(layer.id, { isClipped: !layer.isClipped })}
                              className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                                layer.isClipped ? 'bg-sky-700 text-white' : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {layer.isClipped ? 'Clipped (Chỉ chủ thể)' : 'Global (Toàn khung)'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Real Curves/HSL Editor when an Adjustment layer is selected */}
            {activeLayerObj?.type === 'adjustment' && activeLayerObj.adjustments && (
              <PhotoAdjustmentsPanel
                params={activeLayerObj.adjustments}
                histogram={histogram}
                onChange={(nextAdj) =>
                  updateLayer(activeLayerObj.id, { visible: true, adjustments: nextAdj })
                }
                onReset={() =>
                  updateLayer(activeLayerObj.id, {
                    adjustments: { ...DEFAULT_ADJUSTMENT_PARAMS },
                  })
                }
              />
            )}
          </div>

          <div className="mt-4 p-3 bg-zinc-950/80 border border-zinc-800 rounded text-xs space-y-1.5">
            <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nguyên lý cốt lõi:</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              <strong>Black Conceals, White Reveals:</strong> Mặt nạ đen ẩn chi tiết và trắng khôi phục chi tiết trên ảnh chân dung thật, không bao giờ xóa hỏng pixel gốc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
