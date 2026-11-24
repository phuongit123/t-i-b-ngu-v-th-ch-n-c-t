import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  PenTool as PenIcon,
  MousePointer2,
  Undo2,
  Redo2,
  RotateCcw,
  Grid,
  AlertCircle,
  Sparkles,
  CircleDot,
  Square,
  CornerUpRight,
  Trash2,
  Circle,
  Star,
  Spline,
  Layers,
  Combine,
} from 'lucide-react';
import {
  Point,
  BezierNode,
  NodeType,
  PathCurve,
  SimulatorTool,
  SimulatorExercise,
  BooleanOp,
} from './types';
import {
  distance,
  snapPoint,
  buildSvgPath,
  getCollinearOppositeHandle,
  computeSmartHandles,
  evaluateCurveAccuracy,
  createRectangleCurve,
  createEllipseCurve,
  createStarCurve,
} from './bezier-math';
import { computeBooleanOperation } from './boolean-geometry';
import { SIMULATOR_EXERCISES } from './exercises';
import { VectorLayersSidebar } from './VectorLayersSidebar';

interface VectorDocSnapshot {
  layers: PathCurve[];
  activeLayerId: string;
}

export interface PenNodeSimulatorProps {
  embeddedExerciseId?: string;
  onCurveChange?: (
    curve: PathCurve,
    evaluation: { accuracy: number; averageDistance: number; feedback: string }
  ) => void;
}

function createInitialLayer(index: number = 1): PathCurve {
  return {
    id: `user-curve-${Date.now()}-${index}`,
    name: `Đường nét ${index}`,
    visible: true,
    nodes: [],
    isClosed: false,
    fillColor: '#06b6d4',
    fillOpacity: 0.14,
    strokeColor: '#06b6d4',
    strokeWidth: 2.5,
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return `rgba(6, 182, 212, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(6, 182, 212, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const PenNodeSimulator: React.FC<PenNodeSimulatorProps> = ({
  embeddedExerciseId,
  onCurveChange,
}) => {
  const initialLayer = useMemo(() => createInitialLayer(1), []);

  // Multi-Layer Vector State
  const [activeTool, setActiveTool] = useState<SimulatorTool>('pen');
  const [layers, setLayers] = useState<PathCurve[]>([initialLayer]);
  const [activeLayerId, setActiveLayerId] = useState<string>(initialLayer.id);

  const layersRef = useRef<PathCurve[]>(layers);
  layersRef.current = layers;
  const activeLayerIdRef = useRef<string>(activeLayerId);
  activeLayerIdRef.current = activeLayerId;

  const activeLayer = useMemo(
    () => layers.find((l) => l.id === activeLayerId) ?? layers[0],
    [layers, activeLayerId]
  );

  // History Stack for Undo/Redo across multi-layer snapshots
  const [history, setHistory] = useState<VectorDocSnapshot[]>(() => [
    { layers: JSON.parse(JSON.stringify([initialLayer])), activeLayerId: initialLayer.id },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Selection State
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [booleanStatus, setBooleanStatus] = useState<string | null>(null);

  // Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragTarget, setDragTarget] = useState<
    | { type: 'node'; index: number }
    | { type: 'handleIn'; index: number }
    | { type: 'handleOut'; index: number }
    | { type: 'pen-drag-handle'; index: number }
    | { type: 'shape-draw'; start: Point; current: Point }
    | null
  >(null);

  // Display & Snapping
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
  const gridSize = 20;

  // Exercise & Evaluation State
  const resolveExercise = (id?: string): SimulatorExercise | null => {
    if (!id) return SIMULATOR_EXERCISES[0];
    return SIMULATOR_EXERCISES.find((e) => e.id === id) ?? SIMULATOR_EXERCISES[0];
  };

  const [activeExercise, setActiveExercise] = useState<SimulatorExercise | null>(() =>
    resolveExercise(embeddedExerciseId)
  );
  const [evaluationResult, setEvaluationResult] = useState<{
    accuracy: number;
    averageDistance: number;
    feedback: string;
  } | null>(null);
  const [showHints, setShowHints] = useState<boolean>(true);

  // Mouse Tracking
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);
  const [isAltPressed, setIsAltPressed] = useState<boolean>(false);

  const pushHistory = useCallback(
    (nextLayers: PathCurve[], nextActiveId: string) => {
      const snapshot: VectorDocSnapshot = {
        layers: JSON.parse(JSON.stringify(nextLayers)),
        activeLayerId: nextActiveId,
      };
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), snapshot]);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Sync embedded challenge changes cleanly
  const prevEmbeddedIdRef = useRef<string | undefined>(embeddedExerciseId);
  useEffect(() => {
    if (embeddedExerciseId !== prevEmbeddedIdRef.current) {
      prevEmbeddedIdRef.current = embeddedExerciseId;
      setActiveExercise(resolveExercise(embeddedExerciseId));
      const fresh = createInitialLayer(1);
      setLayers([fresh]);
      setActiveLayerId(fresh.id);
      setHistory([{ layers: JSON.parse(JSON.stringify([fresh])), activeLayerId: fresh.id }]);
      setHistoryIndex(0);
      setSelectedNodeIndex(null);
      setEvaluationResult(null);
      setBooleanStatus(null);
      setActiveTool('pen');
    }
  }, [embeddedExerciseId]);

  // Notify parent when embedded in ChallengesPage
  const notifyCurveUpdate = useCallback(
    (updatedCurve: PathCurve) => {
      if (!onCurveChange || !activeExercise) return;
      const evalRes = evaluateCurveAccuracy(
        updatedCurve,
        activeExercise.targetCurve,
        activeExercise.tolerance
      );
      onCurveChange(updatedCurve, evalRes);
    },
    [onCurveChange, activeExercise]
  );

  const updateActiveLayerInState = useCallback(
    (updater: (layer: PathCurve) => PathCurve, recordHistory: boolean = false) => {
      const currId = activeLayerIdRef.current;
      let updatedActive: PathCurve | null = null;
      const nextLayers = layersRef.current.map((layer) => {
        if (layer.id !== currId) return layer;
        updatedActive = updater(layer);
        return updatedActive;
      });
      layersRef.current = nextLayers;
      setLayers(nextLayers);
      if (recordHistory) {
        pushHistory(nextLayers, currId);
        if (updatedActive) notifyCurveUpdate(updatedActive);
      }
    },
    [pushHistory, notifyCurveUpdate]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevSnap = history[historyIndex - 1];
      const restoredLayers: PathCurve[] = JSON.parse(JSON.stringify(prevSnap.layers));
      layersRef.current = restoredLayers;
      setLayers(restoredLayers);
      setActiveLayerId(prevSnap.activeLayerId);
      setHistoryIndex((prev) => prev - 1);
      setSelectedNodeIndex(null);
      setEvaluationResult(null);
      setBooleanStatus(null);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextSnap = history[historyIndex + 1];
      const restoredLayers: PathCurve[] = JSON.parse(JSON.stringify(nextSnap.layers));
      layersRef.current = restoredLayers;
      setLayers(restoredLayers);
      setActiveLayerId(nextSnap.activeLayerId);
      setHistoryIndex((prev) => prev + 1);
      setSelectedNodeIndex(null);
      setEvaluationResult(null);
      setBooleanStatus(null);
    }
  }, [historyIndex, history]);

  const handleReset = useCallback(() => {
    const fresh = createInitialLayer(1);
    const nextLayers = [fresh];
    layersRef.current = nextLayers;
    activeLayerIdRef.current = fresh.id;
    setLayers(nextLayers);
    setActiveLayerId(fresh.id);
    pushHistory(nextLayers, fresh.id);
    setSelectedNodeIndex(null);
    setEvaluationResult(null);
    setBooleanStatus(null);
  }, [pushHistory]);

  const getSvgCoordinates = useCallback(
    (e: React.MouseEvent<SVGSVGElement> | MouseEvent): Point | null => {
      if (!svgRef.current) return null;
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      return snapPoint({ x: rawX, y: rawY }, gridSize, snapToGrid);
    },
    [snapToGrid, gridSize]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'Alt') {
        setIsAltPressed(true);
      }

      if (e.key === 'p' || e.key === 'P') {
        setActiveTool('pen');
      } else if (e.key === 'a' || e.key === 'A') {
        setActiveTool('node');
      } else if (e.key === 'c' || e.key === 'C') {
        setActiveTool('corner');
      } else if (e.key === 'Escape' || e.key === 'Enter') {
        setSelectedNodeIndex(null);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIndex !== null && activeLayer.nodes[selectedNodeIndex]) {
          updateActiveLayerInState(
            (layer) => ({
              ...layer,
              compoundPathD: undefined,
              nodes: layer.nodes.filter((_, idx) => idx !== selectedNodeIndex),
            }),
            true
          );
          setSelectedNodeIndex(null);
        }
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' || e.key === 'Z') {
          if (e.shiftKey) handleRedo();
          else handleUndo();
          e.preventDefault();
        } else if (e.key === 'y' || e.key === 'Y') {
          handleRedo();
          e.preventDefault();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setIsAltPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedNodeIndex, activeLayer, updateActiveLayerInState, handleUndo, handleRedo]);

  // Add parametric or preset layers
  const commitNewLayer = useCallback(
    (newShape: PathCurve) => {
      const curr = layersRef.current;
      // Replace single untouched empty layer so layer list stays tidy
      const nextLayers =
        curr.length === 1 && curr[0].nodes.length === 0 ? [newShape] : [...curr, newShape];
      layersRef.current = nextLayers;
      activeLayerIdRef.current = newShape.id;
      setLayers(nextLayers);
      setActiveLayerId(newShape.id);
      pushHistory(nextLayers, newShape.id);
      setSelectedNodeIndex(null);
      setBooleanStatus(null);
      notifyCurveUpdate(newShape);
    },
    [pushHistory, notifyCurveUpdate]
  );

  const handleAddEmptyLayer = () => {
    const newLayer = createInitialLayer(layers.length + 1);
    const nextLayers = [...layers, newLayer];
    layersRef.current = nextLayers;
    activeLayerIdRef.current = newLayer.id;
    setLayers(nextLayers);
    setActiveLayerId(newLayer.id);
    pushHistory(nextLayers, newLayer.id);
    setSelectedNodeIndex(null);
    setActiveTool('pen');
  };

  const handleSeedBooleanPair = () => {
    if (!embeddedExerciseId) {
      setActiveExercise(null);
    }
    const baseEllipse = createEllipseCurve(340, 250, 108, 108, {
      id: `bool-seed-ellipse-${Date.now()}`,
      name: 'Hình Elip nền (Cyan)',
      fillColor: '#06b6d4',
      fillOpacity: 0.28,
      strokeColor: '#22d3ee',
      strokeWidth: 2.5,
    });
    const overlayStar = createStarCurve(445, 250, 105, 46, 5, {
      id: `bool-seed-star-${Date.now() + 1}`,
      name: 'Ngôi sao 5 cánh (Vàng)',
      fillColor: '#f59e0b',
      fillOpacity: 0.26,
      strokeColor: '#fbbf24',
      strokeWidth: 2.5,
    });
    const nextLayers = [baseEllipse, overlayStar];
    layersRef.current = nextLayers;
    activeLayerIdRef.current = overlayStar.id;
    setLayers(nextLayers);
    setActiveLayerId(overlayStar.id);
    pushHistory(nextLayers, overlayStar.id);
    setSelectedNodeIndex(null);
    setActiveTool('node');
    setBooleanStatus('Đã tạo cặp hình mẫu chồng lấn — hãy chọn phép Add / Subtract / Intersect / Xor.');
  };

  // Mouse handlers on SVG canvas
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgCoordinates(e);
    if (!pt) return;

    if (activeTool === 'rect' || activeTool === 'ellipse' || activeTool === 'star') {
      setIsDragging(true);
      setDragTarget({ type: 'shape-draw', start: pt, current: pt });
      return;
    }

    const currentCurve = layersRef.current.find((l) => l.id === activeLayerIdRef.current) ?? layersRef.current[0];

    if (activeTool === 'pen') {
      if (currentCurve.isClosed) {
        return;
      }

      if (currentCurve.nodes.length >= 3) {
        const startPoint = currentCurve.nodes[0].point;
        if (distance(pt, startPoint) <= 14) {
          updateActiveLayerInState((layer) => ({ ...layer, isClosed: true }), true);
          setSelectedNodeIndex(null);
          return;
        }
      }

      const newNode: BezierNode = {
        id: `node-${Date.now()}-${currentCurve.nodes.length}`,
        point: pt,
        type: 'sharp',
      };

      const updatedNodes = [...currentCurve.nodes, newNode];
      updateActiveLayerInState(
        (layer) => ({ ...layer, compoundPathD: undefined, nodes: updatedNodes }),
        false
      );
      setSelectedNodeIndex(updatedNodes.length - 1);

      setIsDragging(true);
      setDragTarget({ type: 'pen-drag-handle', index: updatedNodes.length - 1 });
    } else if (activeTool === 'node' || activeTool === 'corner') {
      setSelectedNodeIndex(null);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgCoordinates(e);
    if (!pt) return;
    setMousePos(pt);

    if (!isDragging || !dragTarget) return;

    if (dragTarget.type === 'shape-draw') {
      setDragTarget({ type: 'shape-draw', start: dragTarget.start, current: pt });
      return;
    }

    const currentCurve =
      layersRef.current.find((l) => l.id === activeLayerIdRef.current) ?? layersRef.current[0];
    const nodes = [...currentCurve.nodes];
    const targetIdx = dragTarget.index;
    const targetNode = nodes[targetIdx];
    if (!targetNode) return;

    if (dragTarget.type === 'pen-drag-handle') {
      const dx = pt.x - targetNode.point.x;
      const dy = pt.y - targetNode.point.y;
      const handleOut: Point = { x: pt.x, y: pt.y };
      const handleIn: Point = {
        x: targetNode.point.x - dx,
        y: targetNode.point.y - dy,
      };
      nodes[targetIdx] = {
        ...targetNode,
        type: isAltPressed ? 'sharp' : 'smooth',
        handleOut,
        handleIn: isAltPressed ? targetNode.handleIn : handleIn,
      };
      updateActiveLayerInState((layer) => ({ ...layer, nodes }), false);
    } else if (dragTarget.type === 'node') {
      const dx = pt.x - targetNode.point.x;
      const dy = pt.y - targetNode.point.y;
      nodes[targetIdx] = {
        ...targetNode,
        point: pt,
        handleIn: targetNode.handleIn
          ? { x: targetNode.handleIn.x + dx, y: targetNode.handleIn.y + dy }
          : null,
        handleOut: targetNode.handleOut
          ? { x: targetNode.handleOut.x + dx, y: targetNode.handleOut.y + dy }
          : null,
      };
      updateActiveLayerInState(
        (layer) => ({ ...layer, compoundPathD: undefined, nodes }),
        false
      );
    } else if (dragTarget.type === 'handleOut') {
      if (targetNode.type === 'smooth' && !isAltPressed) {
        const handleIn = getCollinearOppositeHandle(targetNode.point, pt, targetNode.handleIn);
        nodes[targetIdx] = { ...targetNode, handleOut: pt, handleIn };
      } else {
        nodes[targetIdx] = { ...targetNode, type: 'sharp', handleOut: pt };
      }
      updateActiveLayerInState((layer) => ({ ...layer, compoundPathD: undefined, nodes }), false);
    } else if (dragTarget.type === 'handleIn') {
      if (targetNode.type === 'smooth' && !isAltPressed) {
        const handleOut = getCollinearOppositeHandle(targetNode.point, pt, targetNode.handleOut);
        nodes[targetIdx] = { ...targetNode, handleIn: pt, handleOut };
      } else {
        nodes[targetIdx] = { ...targetNode, type: 'sharp', handleIn: pt };
      }
      updateActiveLayerInState((layer) => ({ ...layer, compoundPathD: undefined, nodes }), false);
    }
  };

  const handleSvgMouseUp = () => {
    if (!isDragging || !dragTarget) return;

    if (dragTarget.type === 'shape-draw') {
      const { start, current } = dragTarget;
      const dx = Math.abs(current.x - start.x);
      const dy = Math.abs(current.y - start.y);
      const isClickOnly = dx < 12 && dy < 12;

      let created: PathCurve;
      if (activeTool === 'rect') {
        const rx = isClickOnly ? start.x - 75 : Math.min(start.x, current.x);
        const ry = isClickOnly ? start.y - 55 : Math.min(start.y, current.y);
        created = createRectangleCurve(rx, ry, isClickOnly ? 150 : dx, isClickOnly ? 110 : dy, {
          name: `Hình chữ nhật ${layersRef.current.length + 1}`,
        });
      } else if (activeTool === 'ellipse') {
        const cx = isClickOnly ? start.x : (start.x + current.x) / 2;
        const cy = isClickOnly ? start.y : (start.y + current.y) / 2;
        const rx = isClickOnly ? 72 : Math.max(18, dx / 2);
        const ry = isClickOnly ? 72 : Math.max(18, dy / 2);
        created = createEllipseCurve(cx, cy, rx, ry, {
          name: `Hình Elip ${layersRef.current.length + 1}`,
        });
      } else {
        const cx = isClickOnly ? start.x : (start.x + current.x) / 2;
        const cy = isClickOnly ? start.y : (start.y + current.y) / 2;
        const r = isClickOnly ? 80 : Math.max(28, Math.max(dx, dy) / 2);
        created = createStarCurve(cx, cy, r, r * 0.44, 5, {
          name: `Ngôi sao ${layersRef.current.length + 1}`,
        });
      }

      setIsDragging(false);
      setDragTarget(null);
      commitNewLayer(created);
      setActiveTool('node');
      return;
    }

    setIsDragging(false);
    setDragTarget(null);
    pushHistory(layersRef.current, activeLayerIdRef.current);
    const currentCurve =
      layersRef.current.find((l) => l.id === activeLayerIdRef.current) ?? layersRef.current[0];
    if (currentCurve) notifyCurveUpdate(currentCurve);
  };

  // Convert Node Type
  const handleSetNodeType = (type: NodeType) => {
    if (selectedNodeIndex === null || !activeLayer.nodes[selectedNodeIndex]) return;
    const nodes = [...activeLayer.nodes];
    const node = nodes[selectedNodeIndex];

    if (type === 'sharp') {
      nodes[selectedNodeIndex] = { ...node, type: 'sharp', handleIn: null, handleOut: null };
    } else if (type === 'smooth') {
      const prevPoint = selectedNodeIndex > 0 ? nodes[selectedNodeIndex - 1].point : null;
      const nextPoint =
        selectedNodeIndex < nodes.length - 1 ? nodes[selectedNodeIndex + 1].point : null;
      const { handleIn, handleOut } = computeSmartHandles(prevPoint, node.point, nextPoint);
      nodes[selectedNodeIndex] = {
        ...node,
        type: 'smooth',
        cornerRadius: 0,
        handleIn: node.handleIn || handleIn,
        handleOut: node.handleOut || handleOut,
      };
    } else {
      const prevPoint = selectedNodeIndex > 0 ? nodes[selectedNodeIndex - 1].point : null;
      const nextPoint =
        selectedNodeIndex < nodes.length - 1 ? nodes[selectedNodeIndex + 1].point : null;
      const { handleIn, handleOut } = computeSmartHandles(prevPoint, node.point, nextPoint);
      nodes[selectedNodeIndex] = { ...node, type: 'smart', cornerRadius: 0, handleIn, handleOut };
    }

    updateActiveLayerInState((layer) => ({ ...layer, compoundPathD: undefined, nodes }), true);
  };

  // Non-destructive Corner Tool radius adjustment
  const handleCornerRadiusChange = (radius: number) => {
    updateActiveLayerInState((layer) => {
      const nextNodes = layer.nodes.map((node, idx) => {
        if (selectedNodeIndex !== null) {
          return idx === selectedNodeIndex ? { ...node, cornerRadius: radius } : node;
        }
        if (!node.handleIn && !node.handleOut) {
          return { ...node, cornerRadius: radius };
        }
        return node;
      });
      return { ...layer, compoundPathD: undefined, nodes: nextNodes };
    }, true);
  };

  // Real Boolean Geometry Operation between 2 closed shape layers
  const closedLayers = layers.filter(
    (l) => l.visible !== false && (l.isClosed || l.nodes.length >= 3)
  );
  const canRunBoolean = closedLayers.length >= 2;

  const handleRunBoolean = (op: BooleanOp) => {
    if (!canRunBoolean) {
      setBooleanStatus('Cần ít nhất 2 lớp hình khép kín trên Canvas để thực hiện phép toán Boolean.');
      return;
    }

    // Topmost shape cuts the shape beneath it (or active layer against its neighbor)
    const idxActive = closedLayers.findIndex((l) => l.id === activeLayer.id);
    const cutLayer = idxActive >= 1 ? closedLayers[idxActive] : closedLayers[closedLayers.length - 1];
    const baseLayer =
      idxActive >= 1 ? closedLayers[idxActive - 1] : closedLayers[closedLayers.length - 2];

    const svgW = Math.max(640, Math.round(svgRef.current?.clientWidth || 820));
    const svgH = Math.max(420, Math.round(svgRef.current?.clientHeight || 520));
    const result = computeBooleanOperation(baseLayer, cutLayer, op, svgW, svgH);

    if (!result.curve) {
      setBooleanStatus(result.message);
      return;
    }

    const remaining = layers.filter((l) => l.id !== baseLayer.id && l.id !== cutLayer.id);
    const nextLayers = [...remaining, result.curve];
    layersRef.current = nextLayers;
    activeLayerIdRef.current = result.curve.id;
    setLayers(nextLayers);
    setActiveLayerId(result.curve.id);
    pushHistory(nextLayers, result.curve.id);
    setSelectedNodeIndex(null);
    setBooleanStatus(result.message);
  };

  const handleToggleClose = () => {
    if (activeLayer.nodes.length < 3) return;
    updateActiveLayerInState((layer) => ({ ...layer, isClosed: !layer.isClosed }), true);
  };

  const handleEvaluate = () => {
    if (!activeExercise) return;
    const result = evaluateCurveAccuracy(
      activeLayer,
      activeExercise.targetCurve,
      activeExercise.tolerance
    );
    setEvaluationResult(result);
  };

  const targetPathString = activeExercise
    ? buildSvgPath(activeExercise.targetCurve.nodes, activeExercise.targetCurve.isClosed)
    : '';

  const isHoveringStartNode =
    activeTool === 'pen' &&
    !activeLayer.isClosed &&
    activeLayer.nodes.length >= 3 &&
    mousePos &&
    distance(mousePos, activeLayer.nodes[0].point) <= 14;

  const selectedNode =
    selectedNodeIndex !== null ? activeLayer.nodes[selectedNodeIndex] : null;
  const activeCornerRadius =
    selectedNode?.cornerRadius ??
    activeLayer.nodes.find((n) => (n.cornerRadius ?? 0) > 0)?.cornerRadius ??
    0;

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      {/* 1. Educational Banner (Preserved for TC-SIM-01) */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Bản mô phỏng cơ chế Bézier trong trình duyệt</strong> — Hỗ trợ đa lớp Vector, hình học tham số, bo góc Corner Tool và 4 phép toán Boolean thực tế tương tự Affinity Vector Studio.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          <span>[P] Pen &bull; [A] Node &bull; [C] Bo góc &bull; [Ctrl+Z] Hoàn tác</span>
        </div>
      </div>

      {/* 2. Main Work Area */}
      <div className={`grid grid-cols-1 ${embeddedExerciseId ? 'xl:grid-cols-4' : 'lg:grid-cols-4'} gap-4 items-start`}>
        {/* Canvas & Toolbars (3 cols) */}
        <div className={`${embeddedExerciseId ? 'xl:col-span-3' : 'lg:col-span-3'} flex flex-col gap-2`}>
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-surface border border-hairline shadow-subtle">
            {/* Primary Tools */}
            <div className="flex flex-wrap items-center gap-1 bg-canvas p-1 rounded-lg border border-hairline">
              <button
                type="button"
                onClick={() => {
                  setActiveTool('pen');
                  setSelectedNodeIndex(null);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTool === 'pen'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
                }`}
                title="Pen Tool (P): Click để vẽ đỉnh nhọn, kéo để tạo đường cong mượt"
              >
                <PenIcon className="w-3.5 h-3.5" />
                <span>Pen Tool [P]</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('node')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTool === 'node'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
                }`}
                title="Node Tool (A): Chọn, kéo điểm neo và chỉnh tay đòn Bézier"
              >
                <MousePointer2 className="w-3.5 h-3.5" />
                <span>Node Tool [A]</span>
              </button>

              <button
                type="button"
                data-testid="vec-tool-corner"
                onClick={() => setActiveTool('corner')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTool === 'corner'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
                }`}
                title="Corner Tool (C): Bo góc tròn phi phá hủy tại các đỉnh nhọn"
              >
                <Spline className="w-3.5 h-3.5" />
                <span>Bo góc [C]</span>
              </button>

              <div className="w-px h-4 bg-zinc-800 mx-0.5" />

              <button
                type="button"
                data-testid="vec-tool-rect"
                onClick={() => setActiveTool('rect')}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs transition-all ${
                  activeTool === 'rect'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
                }`}
                title="Vẽ Hình chữ nhật (kéo hoặc click trên Canvas)"
              >
                <Square className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Chữ nhật</span>
              </button>

              <button
                type="button"
                data-testid="vec-tool-ellipse"
                onClick={() => setActiveTool('ellipse')}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs transition-all ${
                  activeTool === 'ellipse'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
                }`}
                title="Vẽ Hình tròn / Elip (kéo hoặc click trên Canvas)"
              >
                <Circle className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Elip</span>
              </button>

              <button
                type="button"
                data-testid="vec-tool-star"
                onClick={() => setActiveTool('star')}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs transition-all ${
                  activeTool === 'star'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
                }`}
                title="Vẽ Ngôi sao 5 cánh (kéo hoặc click trên Canvas)"
              >
                <Star className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Ngôi sao</span>
              </button>
            </div>

            {/* Node Conversion Actions */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                disabled={activeTool !== 'node' || selectedNodeIndex === null}
                onClick={() => handleSetNodeType('sharp')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  selectedNode?.type === 'sharp'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30'
                }`}
                title="Chuyển sang Sharp Node (Góc nhọn không đối xứng)"
              >
                <Square className="w-3 h-3" />
                <span className="hidden sm:inline">Sharp</span>
              </button>

              <button
                type="button"
                disabled={activeTool !== 'node' || selectedNodeIndex === null}
                onClick={() => handleSetNodeType('smooth')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  selectedNode?.type === 'smooth'
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30'
                }`}
                title="Chuyển sang Smooth Node (Tay đòn đối xứng)"
              >
                <CircleDot className="w-3 h-3" />
                <span className="hidden sm:inline">Smooth</span>
              </button>

              <button
                type="button"
                disabled={activeTool !== 'node' || selectedNodeIndex === null}
                onClick={() => handleSetNodeType('smart')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  selectedNode?.type === 'smart'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30'
                }`}
                title="Chuyển sang Smart Node (Tự động tính tiếp tuyến)"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Smart</span>
              </button>

              <button
                type="button"
                disabled={activeLayer.nodes.length < 3}
                onClick={handleToggleClose}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                title={activeLayer.isClosed ? 'Mở đường path hở' : 'Khép kín đường path'}
              >
                <CornerUpRight className="w-3 h-3" />
                <span>{activeLayer.isClosed ? 'Mở Path' : 'Đóng Path'}</span>
              </button>

              <button
                type="button"
                disabled={selectedNodeIndex === null}
                onClick={() => {
                  if (selectedNodeIndex !== null) {
                    updateActiveLayerInState(
                      (layer) => ({
                        ...layer,
                        compoundPathD: undefined,
                        nodes: layer.nodes.filter((_, idx) => idx !== selectedNodeIndex),
                      }),
                      true
                    );
                    setSelectedNodeIndex(null);
                  }
                }}
                className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-hairline disabled:opacity-30 transition-colors"
                title="Xóa node đang chọn (Delete)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid & History */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded-md border transition-colors ${
                  showGrid
                    ? 'bg-surface text-cyan-400 border-cyan-500/30'
                    : 'border-hairline text-zinc-500 hover:text-zinc-300'
                }`}
                title="Bật/Tắt Lưới Grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`px-2 py-1 rounded-md text-xs font-mono border transition-colors ${
                  snapToGrid
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'border-hairline text-zinc-500 hover:text-zinc-300'
                }`}
                title="Bắt dính vào lưới 20px"
              >
                Snap: {snapToGrid ? 'ON' : 'OFF'}
              </button>

              <div className="w-px h-4 bg-zinc-800 mx-1" />

              <button
                type="button"
                disabled={historyIndex <= 0}
                onClick={handleUndo}
                className="p-1.5 rounded-md border border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={historyIndex >= history.length - 1}
                onClick={handleRedo}
                className="p-1.5 rounded-md border border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                title="Làm lại (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-md border border-hairline text-zinc-400 hover:text-zinc-200"
                title="Vẽ lại từ đầu (Reset)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Vector Style, Corner Radius & Real Boolean Operations Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface/90 border border-hairline text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-zinc-400">
                <span>Fill:</span>
                <input
                  type="color"
                  data-testid="vec-fill-color"
                  value={activeLayer.fillColor ?? '#06b6d4'}
                  onChange={(e) =>
                    updateActiveLayerInState(
                      (layer) => ({ ...layer, fillColor: e.target.value }),
                      true
                    )
                  }
                  className="w-6 h-5 rounded bg-transparent border border-zinc-700 cursor-pointer"
                />
              </label>

              <label className="flex items-center gap-1.5 text-zinc-400">
                <span>Viền:</span>
                <input
                  type="color"
                  data-testid="vec-stroke-color"
                  value={activeLayer.strokeColor ?? '#06b6d4'}
                  onChange={(e) =>
                    updateActiveLayerInState(
                      (layer) => ({ ...layer, strokeColor: e.target.value }),
                      true
                    )
                  }
                  className="w-6 h-5 rounded bg-transparent border border-zinc-700 cursor-pointer"
                />
              </label>

              <label className="flex items-center gap-1.5 text-zinc-400">
                <span>Nét:</span>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  data-testid="vec-stroke-width"
                  value={activeLayer.strokeWidth ?? 2.5}
                  onChange={(e) =>
                    updateActiveLayerInState(
                      (layer) => ({ ...layer, strokeWidth: Number(e.target.value) }),
                      false
                    )
                  }
                  className="w-16 accent-cyan-400"
                />
                <span className="font-mono text-zinc-300 w-7">
                  {activeLayer.strokeWidth ?? 2.5}px
                </span>
              </label>

              <label className="flex items-center gap-1.5 text-zinc-400">
                <span>Bo góc:</span>
                <input
                  type="range"
                  min={0}
                  max={48}
                  step={2}
                  data-testid="vec-corner-radius"
                  value={activeCornerRadius}
                  onChange={(e) => handleCornerRadiusChange(Number(e.target.value))}
                  className="w-16 accent-amber-400"
                />
                <span className="font-mono text-amber-300 w-7">{activeCornerRadius}px</span>
              </label>
            </div>

            {/* Boolean Geometry Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                data-testid="vec-seed-boolean-pair"
                onClick={handleSeedBooleanPair}
                className="px-2 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 flex items-center gap-1 text-[11px]"
                title="Chèn nhanh 2 hình Elip + Ngôi sao để thử nghiệm 4 phép toán Boolean"
              >
                <Layers className="w-3 h-3" /> Tạo cặp hình Boolean
              </button>

              <div className="flex items-center gap-1 bg-canvas px-1.5 py-0.5 rounded-lg border border-hairline">
                <Combine className="w-3 h-3 text-zinc-500 mr-0.5" />
                {(
                  [
                    { op: 'add', label: 'Add', testId: 'vec-bool-add' },
                    { op: 'subtract', label: 'Subtract', testId: 'vec-bool-subtract' },
                    { op: 'intersect', label: 'Intersect', testId: 'vec-bool-intersect' },
                    { op: 'xor', label: 'Xor', testId: 'vec-bool-xor' },
                  ] as const
                ).map((item) => (
                  <button
                    type="button"
                    key={item.op}
                    data-testid={item.testId}
                    disabled={!canRunBoolean}
                    onClick={() => handleRunBoolean(item.op)}
                    className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-300 hover:text-cyan-300 hover:bg-surface disabled:opacity-35 transition-colors"
                    title={`Phép toán Boolean ${item.label}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {booleanStatus && (
            <div
              data-testid="vec-boolean-status"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300"
            >
              {booleanStatus}
            </div>
          )}

          {/* SVG Interactive Canvas */}
          <div className="relative w-full rounded-xl bg-canvas border border-hairline overflow-x-auto select-none shadow-inner">
            <div style={{ height: '520px', minHeight: '520px', minWidth: '640px' }} className="relative w-full">
              <svg
                ref={svgRef}
                className="w-full h-full cursor-crosshair block"
                style={{ width: '100%', height: '100%' }}
                onMouseDown={handleSvgMouseDown}
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUp}
                onMouseLeave={handleSvgMouseUp}
              >
                <defs>
                  <pattern
                    id="simulator-grid"
                    width={gridSize}
                    height={gridSize}
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.08)" />
                  </pattern>
                </defs>

                {showGrid && <rect width="100%" height="100%" fill="url(#simulator-grid)" />}

                {/* Target Ghost Curve */}
                {activeExercise && targetPathString && (
                  <g className="pointer-events-none" style={{ pointerEvents: 'none' }}>
                    <path
                      d={targetPathString}
                      fill={activeExercise.targetCurve.isClosed ? 'rgba(16, 185, 129, 0.05)' : 'none'}
                      stroke="rgba(16, 185, 129, 0.4)"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {activeExercise.targetCurve.nodes.map((tNode, idx) => (
                      <g
                        key={`ghost-${idx}`}
                        transform={`translate(${tNode.point.x}, ${tNode.point.y})`}
                      >
                        <circle
                          r="6"
                          fill="rgba(16, 185, 129, 0.2)"
                          stroke="rgba(16, 185, 129, 0.6)"
                          strokeWidth="1.5"
                        />
                        <text
                          x="9"
                          y="3"
                          fontSize="9"
                          fill="rgba(16, 185, 129, 0.7)"
                          fontFamily="monospace"
                        >
                          #{idx + 1}
                        </text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Render All Visible Vector Layers */}
                {layers.map((layer) => {
                  if (layer.visible === false) return null;
                  const layerPath = buildSvgPath(layer.nodes, layer.isClosed, layer.compoundPathD);
                  if (!layerPath) return null;
                  const isActive = layer.id === activeLayer.id;
                  const fillHex = layer.fillColor ?? '#06b6d4';
                  const fillAlpha = layer.fillOpacity ?? 0.14;
                  const strokeHex = layer.strokeColor ?? '#06b6d4';
                  const sWidth = layer.strokeWidth ?? 2.5;

                  return (
                    <path
                      key={layer.id}
                      d={layerPath}
                      fillRule={layer.fillRule ?? 'evenodd'}
                      fill={layer.isClosed || layer.compoundPathD ? hexToRgba(fillHex, fillAlpha) : 'none'}
                      stroke={strokeHex}
                      strokeWidth={isActive ? sWidth : Math.max(1.5, sWidth - 0.5)}
                      strokeOpacity={isActive ? 0.96 : 0.7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="pointer-events-none"
                      style={{ pointerEvents: 'none' }}
                    />
                  );
                })}

                {/* Shape Tool Live Draw Preview */}
                {dragTarget?.type === 'shape-draw' && (
                  <rect
                    x={Math.min(dragTarget.start.x, dragTarget.current.x)}
                    y={Math.min(dragTarget.start.y, dragTarget.current.y)}
                    width={Math.max(4, Math.abs(dragTarget.current.x - dragTarget.start.x))}
                    height={Math.max(4, Math.abs(dragTarget.current.y - dragTarget.start.y))}
                    fill="rgba(6, 182, 212, 0.08)"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="pointer-events-none"
                  />
                )}

                {/* Pen Live Segment Preview */}
                {activeTool === 'pen' &&
                  !activeLayer.isClosed &&
                  activeLayer.nodes.length > 0 &&
                  mousePos && (
                    <line
                      x1={activeLayer.nodes[activeLayer.nodes.length - 1].point.x}
                      y1={activeLayer.nodes[activeLayer.nodes.length - 1].point.y}
                      x2={mousePos.x}
                      y2={mousePos.y}
                      stroke="rgba(6, 182, 212, 0.4)"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      className="pointer-events-none"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                {isHoveringStartNode && (
                  <circle
                    cx={activeLayer.nodes[0].point.x}
                    cy={activeLayer.nodes[0].point.y}
                    r="12"
                    fill="rgba(245, 158, 11, 0.2)"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    className="animate-pulse pointer-events-none"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Handles for Active Layer Selected Node (Hidden on dense Boolean contours unless <= 40 nodes) */}
                {activeLayer.nodes.map((node, idx) => {
                  const isSelected =
                    selectedNodeIndex === idx ||
                    (dragTarget && 'index' in dragTarget && dragTarget.index === idx);
                  if (!isSelected) return null;

                  return (
                    <g key={`handles-${idx}`}>
                      {node.handleIn && (
                        <g>
                          <line
                            x1={node.point.x}
                            y1={node.point.y}
                            x2={node.handleIn.x}
                            y2={node.handleIn.y}
                            stroke="rgba(244, 63, 94, 0.7)"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx={node.handleIn.x}
                            cy={node.handleIn.y}
                            r="5"
                            fill="#f43f5e"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="cursor-pointer"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              if (activeTool === 'node') {
                                setSelectedNodeIndex(idx);
                                setIsDragging(true);
                                setDragTarget({ type: 'handleIn', index: idx });
                              }
                            }}
                          />
                        </g>
                      )}
                      {node.handleOut && (
                        <g>
                          <line
                            x1={node.point.x}
                            y1={node.point.y}
                            x2={node.handleOut.x}
                            y2={node.handleOut.y}
                            stroke="rgba(59, 130, 246, 0.7)"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx={node.handleOut.x}
                            cy={node.handleOut.y}
                            r="5"
                            fill="#3b82f6"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="cursor-pointer"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              if (activeTool === 'node') {
                                setSelectedNodeIndex(idx);
                                setIsDragging(true);
                                setDragTarget({ type: 'handleOut', index: idx });
                              }
                            }}
                          />
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Active Layer Anchor Nodes */}
                {(!activeLayer.compoundPathD || activeLayer.nodes.length <= 45) &&
                  activeLayer.nodes.map((node, idx) => {
                    const isSelected = selectedNodeIndex === idx;
                    return (
                      <g
                        key={`node-${node.id}`}
                        transform={`translate(${node.point.x}, ${node.point.y})`}
                        className="cursor-pointer"
                        onMouseDown={(e) => {
                          if (activeTool === 'node' || activeTool === 'corner') {
                            e.stopPropagation();
                            setSelectedNodeIndex(idx);
                            if (activeTool === 'node') {
                              setIsDragging(true);
                              setDragTarget({ type: 'node', index: idx });
                            }
                          }
                        }}
                      >
                        {isSelected && (
                          <circle
                            r="9"
                            fill="none"
                            stroke="rgba(6, 182, 212, 0.6)"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        )}
                        {node.type === 'sharp' ? (
                          <rect
                            x="-4.5"
                            y="-4.5"
                            width="9"
                            height="9"
                            fill={isSelected ? '#06b6d4' : (node.cornerRadius ?? 0) > 0 ? '#f59e0b' : '#ffffff'}
                            stroke="#09090b"
                            strokeWidth="1.5"
                          />
                        ) : node.type === 'smooth' ? (
                          <circle
                            r="5"
                            fill={isSelected ? '#06b6d4' : '#ffffff'}
                            stroke="#09090b"
                            strokeWidth="1.5"
                          />
                        ) : (
                          <polygon
                            points="0,-5.5 5.5,0 0,5.5 -5.5,0"
                            fill={isSelected ? '#10b981' : '#ffffff'}
                            stroke="#09090b"
                            strokeWidth="1.5"
                          />
                        )}
                      </g>
                    );
                  })}
              </svg>

              {/* Single Bottom Status Overlay (Required by TC-SIM-02/03/04) */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[11px] font-mono text-zinc-400">
                <div className="bg-canvas/80 backdrop-blur-sm px-2.5 py-1 rounded border border-hairline">
                  Nodes: <span className="text-zinc-200">{activeLayer.nodes.length}</span> &bull; Trạng thái:{' '}
                  <span className={activeLayer.isClosed ? 'text-emerald-400' : 'text-amber-400'}>
                    {activeLayer.isClosed ? 'Đóng (Closed)' : 'Hở (Open)'}
                  </span>
                  {selectedNode && (
                    <span className="ml-2 text-cyan-300">
                      &bull; Node #{selectedNodeIndex! + 1} ({selectedNode.type})
                    </span>
                  )}
                </div>

                {mousePos && (
                  <div className="bg-canvas/80 backdrop-blur-sm px-2 py-1 rounded border border-hairline">
                    X: {Math.round(mousePos.x)} Y: {Math.round(mousePos.y)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Layers & Exercises */}
        <VectorLayersSidebar
          layers={layers}
          activeLayerId={activeLayer.id}
          onSelectLayer={(id) => {
            setActiveLayerId(id);
            setSelectedNodeIndex(null);
          }}
          onAddEmptyLayer={handleAddEmptyLayer}
          onToggleLayerVisibility={(id) => {
            const next = layers.map((l) =>
              l.id === id ? { ...l, visible: l.visible === false } : l
            );
            layersRef.current = next;
            setLayers(next);
            pushHistory(next, activeLayerId);
          }}
          onMoveLayer={(id, dir) => {
            const idx = layers.findIndex((l) => l.id === id);
            if (idx === -1) return;
            const targetIdx = dir === 'up' ? idx + 1 : idx - 1;
            if (targetIdx < 0 || targetIdx >= layers.length) return;
            const next = [...layers];
            [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
            layersRef.current = next;
            setLayers(next);
            pushHistory(next, activeLayerId);
          }}
          onDeleteLayer={(id) => {
            if (layers.length <= 1) return;
            const next = layers.filter((l) => l.id !== id);
            const nextActive = id === activeLayerId ? next[next.length - 1].id : activeLayerId;
            layersRef.current = next;
            activeLayerIdRef.current = nextActive;
            setLayers(next);
            setActiveLayerId(nextActive);
            pushHistory(next, nextActive);
          }}
          activeExercise={activeExercise}
          onSelectExercise={(ex) => {
            setActiveExercise(ex);
            setEvaluationResult(null);
            handleReset();
          }}
          showHints={showHints}
          onToggleHints={() => setShowHints(!showHints)}
          onEvaluate={handleEvaluate}
          canEvaluate={activeLayer.nodes.length > 0}
          evaluationResult={evaluationResult}
          embeddedMode={Boolean(embeddedExerciseId)}
        />
      </div>
    </div>
  );
};
