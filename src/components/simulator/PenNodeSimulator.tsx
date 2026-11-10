import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PenTool as PenIcon,
  MousePointer2,
  Undo2,
  Redo2,
  RotateCcw,
  Grid,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  CircleDot,
  Square,
  CornerUpRight,
  Trash2,
} from 'lucide-react';
import { Point, BezierNode, NodeType, PathCurve, SimulatorTool, SimulatorExercise } from './types';
import {
  distance,
  snapPoint,
  buildSvgPath,
  getCollinearOppositeHandle,
  computeSmartHandles,
  evaluateCurveAccuracy,
} from './bezier-math';
import { SIMULATOR_EXERCISES } from './exercises';

export const PenNodeSimulator: React.FC = () => {
  // Core Tool & Curve State
  const [activeTool, setActiveTool] = useState<SimulatorTool>('pen');
  const [curve, setCurve] = useState<PathCurve>({
    id: 'user-curve-1',
    nodes: [],
    isClosed: false,
  });
  const curveRef = useRef<PathCurve>(curve);
  curveRef.current = curve;

  // History Stack for Undo/Redo
  const [history, setHistory] = useState<PathCurve[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Selection State
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);

  // Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragTarget, setDragTarget] = useState<
    | { type: 'node'; index: number }
    | { type: 'handleIn'; index: number }
    | { type: 'handleOut'; index: number }
    | { type: 'pen-drag-handle'; index: number }
    | null
  >(null);

  // Display & Snapping
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
  const gridSize = 20;

  // Exercise & Evaluation State
  const [activeExercise, setActiveExercise] = useState<SimulatorExercise | null>(SIMULATOR_EXERCISES[0]);
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

  // Push to history
  const pushHistory = useCallback(
    (newCurve: PathCurve) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, JSON.parse(JSON.stringify(newCurve))];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevCurve = history[historyIndex - 1];
      setCurve(JSON.parse(JSON.stringify(prevCurve)));
      setHistoryIndex((prev) => prev - 1);
      setSelectedNodeIndex(null);
      setEvaluationResult(null);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextCurve = history[historyIndex + 1];
      setCurve(JSON.parse(JSON.stringify(nextCurve)));
      setHistoryIndex((prev) => prev + 1);
      setSelectedNodeIndex(null);
      setEvaluationResult(null);
    }
  }, [historyIndex, history]);

  const handleReset = useCallback(() => {
    const freshCurve: PathCurve = {
      id: `user-curve-${Date.now()}`,
      nodes: [],
      isClosed: false,
    };
    setCurve(freshCurve);
    pushHistory(freshCurve);
    setSelectedNodeIndex(null);
    setEvaluationResult(null);
  }, [pushHistory]);

  // Convert SVG coordinate
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

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Alt') {
        setIsAltPressed(true);
      }

      if (e.key === 'p' || e.key === 'P') {
        setActiveTool('pen');
      } else if (e.key === 'a' || e.key === 'A') {
        setActiveTool('node');
      } else if (e.key === 'Escape' || e.key === 'Enter') {
        // Finish active path or deselect
        setSelectedNodeIndex(null);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIndex !== null && curve.nodes[selectedNodeIndex]) {
          const updatedNodes = curve.nodes.filter((_, idx) => idx !== selectedNodeIndex);
          const updatedCurve = { ...curve, nodes: updatedNodes };
          setCurve(updatedCurve);
          pushHistory(updatedCurve);
          setSelectedNodeIndex(null);
        }
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' || e.key === 'Z') {
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          e.preventDefault();
        } else if (e.key === 'y' || e.key === 'Y') {
          handleRedo();
          e.preventDefault();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedNodeIndex, curve, pushHistory, handleUndo, handleRedo]);

  // Initial history push
  useEffect(() => {
    if (history.length === 0) {
      setHistory([JSON.parse(JSON.stringify(curve))]);
      setHistoryIndex(0);
    }
  }, [curve, history.length]);

  // MOUSE DOWN HANDLER
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgCoordinates(e);
    if (!pt) return;

    const currentCurve = curveRef.current;

    if (activeTool === 'pen') {
      if (currentCurve.isClosed) {
        // If already closed, start new curve or ignore
        return;
      }

      // Check if clicking start node to close path
      if (currentCurve.nodes.length >= 3) {
        const startPoint = currentCurve.nodes[0].point;
        if (distance(pt, startPoint) <= 14) {
          const closedCurve: PathCurve = { ...currentCurve, isClosed: true };
          curveRef.current = closedCurve;
          setCurve(closedCurve);
          pushHistory(closedCurve);
          setSelectedNodeIndex(null);
          return;
        }
      }

      // Add a new node
      const newNode: BezierNode = {
        id: `node-${Date.now()}-${currentCurve.nodes.length}`,
        point: pt,
        type: 'sharp',
      };

      const updatedNodes = [...currentCurve.nodes, newNode];
      const updatedCurve: PathCurve = { ...currentCurve, nodes: updatedNodes };
      curveRef.current = updatedCurve;
      setCurve(updatedCurve);
      setSelectedNodeIndex(updatedNodes.length - 1);

      // Start drag to pull smooth handles
      setIsDragging(true);
      setDragTarget({ type: 'pen-drag-handle', index: updatedNodes.length - 1 });
    } else if (activeTool === 'node') {
      // Node tool: Clicking empty area clears selection
      setSelectedNodeIndex(null);
    }
  };

  // MOUSE MOVE HANDLER
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const pt = getSvgCoordinates(e);
    if (!pt) return;
    setMousePos(pt);

    if (!isDragging || !dragTarget) return;

    const currentCurve = curveRef.current;
    const nodes = [...currentCurve.nodes];
    const targetIdx = dragTarget.index;
    const targetNode = nodes[targetIdx];
    if (!targetNode) return;

    if (dragTarget.type === 'pen-drag-handle') {
      // While mouse is dragged immediately after placing a pen node:
      // Dragging creates an outgoing handle along mouse drag vector,
      // and an opposite incoming handle (smooth node)
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
      const updated = { ...currentCurve, nodes };
      curveRef.current = updated;
      setCurve(updated);
    } else if (dragTarget.type === 'node') {
      // Moving the entire node
      const dx = pt.x - targetNode.point.x;
      const dy = pt.y - targetNode.point.y;

      const newPoint = pt;
      const newHandleIn = targetNode.handleIn
        ? { x: targetNode.handleIn.x + dx, y: targetNode.handleIn.y + dy }
        : null;
      const newHandleOut = targetNode.handleOut
        ? { x: targetNode.handleOut.x + dx, y: targetNode.handleOut.y + dy }
        : null;

      nodes[targetIdx] = {
        ...targetNode,
        point: newPoint,
        handleIn: newHandleIn,
        handleOut: newHandleOut,
      };
      const updated = { ...currentCurve, nodes };
      curveRef.current = updated;
      setCurve(updated);
    } else if (dragTarget.type === 'handleOut') {
      // Dragging handleOut
      if (targetNode.type === 'smooth' && !isAltPressed) {
        const handleIn = getCollinearOppositeHandle(targetNode.point, pt, targetNode.handleIn);
        nodes[targetIdx] = {
          ...targetNode,
          handleOut: pt,
          handleIn,
        };
      } else {
        nodes[targetIdx] = {
          ...targetNode,
          type: 'sharp', // Cusp mode
          handleOut: pt,
        };
      }
      const updated = { ...currentCurve, nodes };
      curveRef.current = updated;
      setCurve(updated);
    } else if (dragTarget.type === 'handleIn') {
      // Dragging handleIn
      if (targetNode.type === 'smooth' && !isAltPressed) {
        const handleOut = getCollinearOppositeHandle(targetNode.point, pt, targetNode.handleOut);
        nodes[targetIdx] = {
          ...targetNode,
          handleIn: pt,
          handleOut,
        };
      } else {
        nodes[targetIdx] = {
          ...targetNode,
          type: 'sharp', // Cusp mode
          handleIn: pt,
        };
      }
      const updated = { ...currentCurve, nodes };
      curveRef.current = updated;
      setCurve(updated);
    }
  };

  // MOUSE UP HANDLER
  const handleSvgMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragTarget(null);
      pushHistory(curveRef.current);
    }
  };

  // CONVERT NODE TYPE
  const handleSetNodeType = (type: NodeType) => {
    if (selectedNodeIndex === null || !curve.nodes[selectedNodeIndex]) return;

    const nodes = [...curve.nodes];
    const node = nodes[selectedNodeIndex];

    if (type === 'sharp') {
      // Remove handles or leave them as independent cusps
      nodes[selectedNodeIndex] = {
        ...node,
        type: 'sharp',
        handleIn: null,
        handleOut: null,
      };
    } else if (type === 'smooth') {
      // Align handles collinear
      const prevPoint = selectedNodeIndex > 0 ? nodes[selectedNodeIndex - 1].point : null;
      const nextPoint =
        selectedNodeIndex < nodes.length - 1 ? nodes[selectedNodeIndex + 1].point : null;
      const { handleIn, handleOut } = computeSmartHandles(prevPoint, node.point, nextPoint);

      nodes[selectedNodeIndex] = {
        ...node,
        type: 'smooth',
        handleIn: node.handleIn || handleIn,
        handleOut: node.handleOut || handleOut,
      };
    } else if (type === 'smart') {
      // Recalculate optimal tangent handles
      const prevPoint = selectedNodeIndex > 0 ? nodes[selectedNodeIndex - 1].point : null;
      const nextPoint =
        selectedNodeIndex < nodes.length - 1 ? nodes[selectedNodeIndex + 1].point : null;
      const { handleIn, handleOut } = computeSmartHandles(prevPoint, node.point, nextPoint);

      nodes[selectedNodeIndex] = {
        ...node,
        type: 'smart',
        handleIn,
        handleOut,
      };
    }

    const updatedCurve = { ...curve, nodes };
    setCurve(updatedCurve);
    pushHistory(updatedCurve);
  };

  // TOGGLE CLOSE / OPEN PATH
  const handleToggleClose = () => {
    if (curve.nodes.length < 3) return;
    const updatedCurve = { ...curve, isClosed: !curve.isClosed };
    setCurve(updatedCurve);
    pushHistory(updatedCurve);
  };

  // EVALUATE CURRENT DRAWING AGAINST TARGET EXERCISE
  const handleEvaluate = () => {
    if (!activeExercise) return;
    const result = evaluateCurveAccuracy(curve, activeExercise.targetCurve, activeExercise.tolerance);
    setEvaluationResult(result);
  };

  // SVG Path Strings
  const userPathString = buildSvgPath(curve.nodes, curve.isClosed);
  const targetPathString = activeExercise
    ? buildSvgPath(activeExercise.targetCurve.nodes, activeExercise.targetCurve.isClosed)
    : '';

  // Check if hovering near start node to close path
  const isHoveringStartNode =
    activeTool === 'pen' &&
    !curve.isClosed &&
    curve.nodes.length >= 3 &&
    mousePos &&
    distance(mousePos, curve.nodes[0].point) <= 14;

  const selectedNode = selectedNodeIndex !== null ? curve.nodes[selectedNodeIndex] : null;

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      {/* 1. Disclaimer Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Bản mô phỏng cơ chế Bézier trong trình duyệt</strong> — Thiết kế mô phỏng thao tác Pen/Node Tool và đường cong Bézier chuẩn mực của Affinity Designer, không thay thế hoàn toàn phần mềm native.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          <span>Phím tắt: [P] Pen &bull; [A] Node &bull; [Esc/Enter] Kết thúc &bull; [Ctrl+Z] Hoàn tác</span>
        </div>
      </div>

      {/* 2. Main Work Area: Toolbar + Canvas + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Left 3 Columns: Canvas & Floating Controls */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-surface border border-hairline shadow-subtle">
            {/* Primary Tool Switches */}
            <div className="flex items-center gap-1 bg-canvas p-1 rounded-lg border border-hairline">
              <button
                onClick={() => {
                  setActiveTool('pen');
                  setSelectedNodeIndex(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTool === 'pen'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
                }`}
                title="Pen Tool (P): Click để vẽ node Sharp, kéo để tạo smooth handle"
              >
                <PenIcon className="w-3.5 h-3.5" />
                <span>Pen Tool [P]</span>
              </button>

              <button
                onClick={() => setActiveTool('node')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTool === 'node'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface'
                }`}
                title="Node Tool (A): Chọn, kéo dời điểm neo và chỉnh tay đòn Bézier"
              >
                <MousePointer2 className="w-3.5 h-3.5" />
                <span>Node Tool [A]</span>
              </button>
            </div>

            {/* Node Conversion Actions (Active in Node Mode) */}
            <div className="flex items-center gap-1">
              <button
                disabled={activeTool !== 'node' || selectedNodeIndex === null}
                onClick={() => handleSetNodeType('sharp')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  selectedNode?.type === 'sharp'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400'
                }`}
                title="Chuyển sang Sharp Node (Góc nhọn / Cusp không đối xứng)"
              >
                <Square className="w-3 h-3" />
                <span className="hidden sm:inline">Sharp</span>
              </button>

              <button
                disabled={activeTool !== 'node' || selectedNodeIndex === null}
                onClick={() => handleSetNodeType('smooth')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  selectedNode?.type === 'smooth'
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    : 'border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400'
                }`}
                title="Chuyển sang Smooth Node (Tay đòn đối xứng liên tục)"
              >
                <CircleDot className="w-3 h-3" />
                <span className="hidden sm:inline">Smooth</span>
              </button>

              <button
                disabled={activeTool !== 'node' || selectedNodeIndex === null}
                onClick={() => handleSetNodeType('smart')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  selectedNode?.type === 'smart'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-400'
                }`}
                title="Chuyển sang Smart Node (Tự động tính toán độ uốn tối ưu)"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Smart</span>
              </button>

              <button
                disabled={curve.nodes.length < 3}
                onClick={handleToggleClose}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                title={curve.isClosed ? 'Mở đường path hở' : 'Khép kín đường path'}
              >
                <CornerUpRight className="w-3 h-3" />
                <span>{curve.isClosed ? 'Mở Path' : 'Đóng Path'}</span>
              </button>

              <button
                disabled={selectedNodeIndex === null}
                onClick={() => {
                  if (selectedNodeIndex !== null) {
                    const updatedNodes = curve.nodes.filter((_, idx) => idx !== selectedNodeIndex);
                    const updatedCurve = { ...curve, nodes: updatedNodes };
                    setCurve(updatedCurve);
                    pushHistory(updatedCurve);
                    setSelectedNodeIndex(null);
                  }
                }}
                className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-hairline disabled:opacity-30 transition-colors"
                title="Xóa node đang chọn (Delete)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Grid & History Controls */}
            <div className="flex items-center gap-1">
              <button
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
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`px-2 py-1 rounded-md text-xs font-mono border transition-colors ${
                  snapToGrid
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'border-hairline text-zinc-500 hover:text-zinc-300'
                }`}
                title="Bắt dính vào lưới 20px (Snap to Grid)"
              >
                Snap: {snapToGrid ? 'ON' : 'OFF'}
              </button>

              <div className="w-px h-4 bg-zinc-800 mx-1" />

              <button
                disabled={historyIndex <= 0}
                onClick={handleUndo}
                className="p-1.5 rounded-md border border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>

              <button
                disabled={historyIndex >= history.length - 1}
                onClick={handleRedo}
                className="p-1.5 rounded-md border border-hairline text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                title="Làm lại (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-md border border-hairline text-zinc-400 hover:text-zinc-200"
                title="Vẽ lại từ đầu (Reset)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Interactive Canvas */}
          <div
            className="relative w-full rounded-xl bg-canvas border border-hairline overflow-hidden select-none shadow-inner"
            style={{ height: '520px', minHeight: '520px' }}
          >
            <svg
              ref={svgRef}
              className="w-full h-full cursor-crosshair block"
              style={{ width: '100%', height: '100%' }}
              onMouseDown={handleSvgMouseDown}
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleSvgMouseUp}
              onMouseLeave={handleSvgMouseUp}
            >
              {/* Grid Definition */}
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

              {/* Grid Background */}
              {showGrid && <rect width="100%" height="100%" fill="url(#simulator-grid)" />}

              {/* Ghost Target Curve (For Guided Exercises) */}
              {activeExercise && targetPathString && (
                <g className="transition-opacity duration-300 pointer-events-none" style={{ pointerEvents: 'none' }}>
                  <path
                    d={targetPathString}
                    fill={activeExercise.targetCurve.isClosed ? 'rgba(16, 185, 129, 0.05)' : 'none'}
                    stroke="rgba(16, 185, 129, 0.4)"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Target Node Ghost Markers */}
                  {activeExercise.targetCurve.nodes.map((tNode, idx) => (
                    <g key={`ghost-${idx}`} transform={`translate(${tNode.point.x}, ${tNode.point.y})`}>
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

              {/* User Live Path Curve */}
              {userPathString && (
                <path
                  d={userPathString}
                  fill={curve.isClosed ? 'rgba(6, 182, 212, 0.12)' : 'none'}
                  stroke="rgba(6, 182, 212, 0.95)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.3)] pointer-events-none"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* Live Preview Segment to Mouse when Pen is active */}
              {activeTool === 'pen' &&
                !curve.isClosed &&
                curve.nodes.length > 0 &&
                mousePos && (
                  <line
                    x1={curve.nodes[curve.nodes.length - 1].point.x}
                    y1={curve.nodes[curve.nodes.length - 1].point.y}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    stroke="rgba(6, 182, 212, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="pointer-events-none"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

              {/* Start Node Close Indicator */}
              {isHoveringStartNode && (
                <circle
                  cx={curve.nodes[0].point.x}
                  cy={curve.nodes[0].point.y}
                  r="12"
                  fill="rgba(245, 158, 11, 0.2)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  className="animate-pulse pointer-events-none"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* Render Handles for Selected Node or Active Drag */}
              {curve.nodes.map((node, idx) => {
                const isSelected = selectedNodeIndex === idx || (dragTarget && dragTarget.index === idx);
                if (!isSelected) return null;

                return (
                  <g key={`handles-${idx}`}>
                    {/* Handle In Line & Control Point */}
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
                          className="cursor-pointer hover:scale-125 transition-transform"
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

                    {/* Handle Out Line & Control Point */}
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
                          className="cursor-pointer hover:scale-125 transition-transform"
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

              {/* Render Nodes */}
              {curve.nodes.map((node, idx) => {
                const isSelected = selectedNodeIndex === idx;

                return (
                  <g
                    key={`node-${node.id}`}
                    transform={`translate(${node.point.x}, ${node.point.y})`}
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                      if (activeTool === 'node') {
                        e.stopPropagation();
                        setSelectedNodeIndex(idx);
                        setIsDragging(true);
                        setDragTarget({ type: 'node', index: idx });
                      }
                    }}
                  >
                    {/* Outer selection ring */}
                    {isSelected && (
                      <circle
                        r="9"
                        fill="none"
                        stroke="rgba(6, 182, 212, 0.6)"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Node Shape based on NodeType */}
                    {node.type === 'sharp' ? (
                      <rect
                        x="-4.5"
                        y="-4.5"
                        width="9"
                        height="9"
                        fill={isSelected ? '#06b6d4' : '#ffffff'}
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
                      // Smart node diamond
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

            {/* Bottom Status Overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[11px] font-mono text-zinc-400">
              <div className="bg-canvas/80 backdrop-blur-sm px-2.5 py-1 rounded border border-hairline">
                Nodes: <span className="text-zinc-200">{curve.nodes.length}</span> &bull; Trạng thái:{' '}
                <span className={curve.isClosed ? 'text-emerald-400' : 'text-amber-400'}>
                  {curve.isClosed ? 'Đóng (Closed)' : 'Hở (Open)'}
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

        {/* Right 1 Column: Exercise Guide & Evaluation Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Exercise Selector */}
          <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Bài tập thực hành
              </span>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHints ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {SIMULATOR_EXERCISES.map((ex) => {
                const isSelected = activeExercise?.id === ex.id;
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setActiveExercise(ex);
                      setEvaluationResult(null);
                      handleReset();
                    }}
                    className={`text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-elevated border-cyan-500/40 text-zinc-100 shadow-xs'
                        : 'border-hairline text-zinc-400 hover:text-zinc-200 hover:bg-canvas'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{ex.title}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          ex.difficulty === 'Beginner'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : ex.difficulty === 'Intermediate'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {ex.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                      {ex.subtitle}
                    </p>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setActiveExercise(null);
                  setEvaluationResult(null);
                  handleReset();
                }}
                className={`text-left p-2.5 rounded-lg border transition-all ${
                  activeExercise === null
                    ? 'bg-elevated border-cyan-500/40 text-zinc-100 shadow-xs'
                    : 'border-hairline text-zinc-400 hover:text-zinc-200 hover:bg-canvas'
                }`}
              >
                <span className="text-xs font-semibold">Tự do sáng tạo (Free Sandbox)</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Vẽ tự do không giới hạn outline mẫu</p>
              </button>
            </div>

            {/* Exercise Instructions & Hints */}
            {activeExercise && showHints && (
              <div className="pt-3 border-t border-hairline space-y-2">
                <p className="text-xs text-zinc-300 leading-relaxed">{activeExercise.description}</p>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Các bước thực hiện:
                  </span>
                  <ul className="text-[11px] text-zinc-400 space-y-1 pl-3.5 list-disc">
                    {activeExercise.hints.map((hint, idx) => (
                      <li key={idx} className="leading-snug">
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Evaluation Button */}
            {activeExercise && (
              <div className="pt-2">
                <button
                  onClick={handleEvaluate}
                  disabled={curve.nodes.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shadow-subtle disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chấm điểm đường cong</span>
                </button>
              </div>
            )}

            {/* Live Evaluation Result Card */}
            {evaluationResult && (
              <div
                className={`p-3 rounded-lg border ${
                  evaluationResult.accuracy >= 80
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : evaluationResult.accuracy >= 60
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                } space-y-1.5`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                    {evaluationResult.accuracy >= 80 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    )}
                    Độ chính xác: {evaluationResult.accuracy}%
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Độ lệch: {evaluationResult.averageDistance}px
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {evaluationResult.feedback}
                </p>
              </div>
            )}
          </div>

          {/* Quick Cheatsheet Card */}
          <div className="p-3.5 rounded-xl bg-surface border border-hairline space-y-2 text-xs text-zinc-400">
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
              Bézier Quick Cheatsheet
            </span>
            <div className="space-y-1.5 text-[11px] leading-relaxed">
              <div>
                <strong className="text-zinc-200">Sharp Node:</strong> Đỉnh gập góc không có tay đòn uốn cong.
              </div>
              <div>
                <strong className="text-zinc-200">Smooth Node:</strong> 2 tay đòn thẳng hàng 180&deg;, đảm bảo đường lượn sóng mượt mà.
              </div>
              <div>
                <strong className="text-zinc-200">Smart Node:</strong> Tự động tính tiếp tuyến cong dựa vào các điểm lân cận.
              </div>
              <div>
                <strong className="text-zinc-200">Alt + Kéo chuột:</strong> Bẻ gãy liên kết thẳng hàng giữa 2 tay đòn (Cusp Handle).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
