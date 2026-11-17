import { Point, BezierNode, PathCurve } from './types';

export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function snapPoint(p: Point, gridSize: number, enabled: boolean): Point {
  if (!enabled || gridSize <= 0) return p;
  return {
    x: Math.round(p.x / gridSize) * gridSize,
    y: Math.round(p.y / gridSize) * gridSize,
  };
}

/**
 * Computes corner tangents for a sharp node with cornerRadius > 0.
 */
function getRoundedCornerTrim(
  prevPt: Point,
  currPt: Point,
  nextPt: Point,
  radius: number
): { entry: Point; exit: Point; cp1: Point; cp2: Point } | null {
  const dPrev = distance(prevPt, currPt);
  const dNext = distance(currPt, nextPt);
  if (dPrev < 4 || dNext < 4) return null;

  const r = Math.min(radius, dPrev * 0.45, dNext * 0.45);
  if (r < 1) return null;

  const entry: Point = {
    x: currPt.x + ((prevPt.x - currPt.x) / dPrev) * r,
    y: currPt.y + ((prevPt.y - currPt.y) / dPrev) * r,
  };
  const exit: Point = {
    x: currPt.x + ((nextPt.x - currPt.x) / dNext) * r,
    y: currPt.y + ((nextPt.y - currPt.y) / dNext) * r,
  };

  // Quadratic-to-cubic control approximation (~0.55228 toward corner apex)
  const k = 0.55228475;
  const cp1: Point = {
    x: entry.x + (currPt.x - entry.x) * k,
    y: entry.y + (currPt.y - entry.y) * k,
  };
  const cp2: Point = {
    x: exit.x + (currPt.x - exit.x) * k,
    y: exit.y + (currPt.y - exit.y) * k,
  };

  return { entry, exit, cp1, cp2 };
}

/**
 * Generates an SVG path 'd' attribute from an array of Bezier nodes (or compound Boolean path),
 * including non-destructive Corner Tool rounding on sharp corners.
 */
export function buildSvgPath(
  nodes: BezierNode[],
  isClosed: boolean,
  compoundPathD?: string
): string {
  if (compoundPathD && compoundPathD.trim().length > 0) {
    return compoundPathD;
  }
  if (!nodes || nodes.length === 0) return '';
  if (nodes.length === 1) {
    return `M ${nodes[0].point.x} ${nodes[0].point.y}`;
  }

  const hasCornerRadii = nodes.some(
    (n) => (n.cornerRadius ?? 0) > 0 && !n.handleIn && !n.handleOut
  );

  if (!hasCornerRadii) {
    let d = `M ${nodes[0].point.x} ${nodes[0].point.y}`;

    for (let i = 0; i < nodes.length - 1; i++) {
      const curr = nodes[i];
      const next = nodes[i + 1];

      const cp1 = curr.handleOut || curr.point;
      const cp2 = next.handleIn || next.point;

      if (!curr.handleOut && !next.handleIn) {
        d += ` L ${next.point.x} ${next.point.y}`;
      } else {
        d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${next.point.x} ${next.point.y}`;
      }
    }

    if (isClosed && nodes.length > 2) {
      const last = nodes[nodes.length - 1];
      const first = nodes[0];
      const cp1 = last.handleOut || last.point;
      const cp2 = first.handleIn || first.point;

      if (!last.handleOut && !first.handleIn) {
        d += ` Z`;
      } else {
        d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${first.point.x} ${first.point.y} Z`;
      }
    }

    return d;
  }

  // Corner-aware path builder
  const count = nodes.length;
  const trims = nodes.map((node, idx) => {
    const r = node.cornerRadius ?? 0;
    if (r <= 0 || node.handleIn || node.handleOut) return null;
    if (!isClosed && (idx === 0 || idx === count - 1)) return null;
    const prev = nodes[(idx - 1 + count) % count];
    const next = nodes[(idx + 1) % count];
    return getRoundedCornerTrim(prev.point, node.point, next.point, r);
  });

  const firstStart = trims[0]?.entry ?? nodes[0].point;
  let d = `M ${firstStart.x.toFixed(2)} ${firstStart.y.toFixed(2)}`;
  if (trims[0]) {
    const t0 = trims[0];
    d += ` C ${t0.cp1.x.toFixed(2)} ${t0.cp1.y.toFixed(2)}, ${t0.cp2.x.toFixed(2)} ${t0.cp2.y.toFixed(2)}, ${t0.exit.x.toFixed(2)} ${t0.exit.y.toFixed(2)}`;
  }

  const limit = isClosed ? count : count - 1;
  for (let i = 0; i < limit; i++) {
    const currIdx = i;
    const nextIdx = (i + 1) % count;
    const curr = nodes[currIdx];
    const next = nodes[nextIdx];
    const nextTrim = trims[nextIdx];

    if (nextTrim) {
      if (curr.handleOut || next.handleIn) {
        const cp1 = curr.handleOut || (trims[currIdx]?.exit ?? curr.point);
        const cp2 = next.handleIn || nextTrim.entry;
        d += ` C ${cp1.x.toFixed(2)} ${cp1.y.toFixed(2)}, ${cp2.x.toFixed(2)} ${cp2.y.toFixed(2)}, ${nextTrim.entry.x.toFixed(2)} ${nextTrim.entry.y.toFixed(2)}`;
      } else {
        d += ` L ${nextTrim.entry.x.toFixed(2)} ${nextTrim.entry.y.toFixed(2)}`;
      }
      if (!(isClosed && nextIdx === 0)) {
        d += ` C ${nextTrim.cp1.x.toFixed(2)} ${nextTrim.cp1.y.toFixed(2)}, ${nextTrim.cp2.x.toFixed(2)} ${nextTrim.cp2.y.toFixed(2)}, ${nextTrim.exit.x.toFixed(2)} ${nextTrim.exit.y.toFixed(2)}`;
      }
    } else {
      const targetPt = next.point;
      if (!curr.handleOut && !next.handleIn) {
        if (isClosed && nextIdx === 0) {
          d += ' Z';
        } else {
          d += ` L ${targetPt.x.toFixed(2)} ${targetPt.y.toFixed(2)}`;
        }
      } else {
        const cp1 = curr.handleOut || (trims[currIdx]?.exit ?? curr.point);
        const cp2 = next.handleIn || targetPt;
        d += ` C ${cp1.x.toFixed(2)} ${cp1.y.toFixed(2)}, ${cp2.x.toFixed(2)} ${cp2.y.toFixed(2)}, ${targetPt.x.toFixed(2)} ${targetPt.y.toFixed(2)}`;
        if (isClosed && nextIdx === 0) d += ' Z';
      }
    }
  }

  if (isClosed && trims[0]) {
    d += ' Z';
  }

  return d;
}

/**
 * Generates parametric Rectangle PathCurve.
 */
export function createRectangleCurve(
  x: number,
  y: number,
  width: number,
  height: number,
  options?: Partial<PathCurve>
): PathCurve {
  const id = options?.id ?? `shape-rect-${Date.now()}`;
  const rx = Math.round(x);
  const ry = Math.round(y);
  const rw = Math.max(16, Math.round(width));
  const rh = Math.max(16, Math.round(height));

  return {
    id,
    name: options?.name ?? 'Hình chữ nhật',
    visible: true,
    isClosed: true,
    fillColor: options?.fillColor ?? '#06b6d4',
    fillOpacity: options?.fillOpacity ?? 0.25,
    strokeColor: options?.strokeColor ?? '#06b6d4',
    strokeWidth: options?.strokeWidth ?? 2.5,
    nodes: [
      { id: `${id}-n1`, point: { x: rx, y: ry }, type: 'sharp' },
      { id: `${id}-n2`, point: { x: rx + rw, y: ry }, type: 'sharp' },
      { id: `${id}-n3`, point: { x: rx + rw, y: ry + rh }, type: 'sharp' },
      { id: `${id}-n4`, point: { x: rx, y: ry + rh }, type: 'sharp' },
    ],
  };
}

/**
 * Generates parametric 4-node cubic Bezier Ellipse PathCurve (kappa = 0.55228475).
 */
export function createEllipseCurve(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  options?: Partial<PathCurve>
): PathCurve {
  const id = options?.id ?? `shape-ellipse-${Date.now()}`;
  const k = 0.55228475;
  const ox = Math.round(rx * k);
  const oy = Math.round(ry * k);
  const x = Math.round(cx);
  const y = Math.round(cy);
  const radX = Math.max(12, Math.round(rx));
  const radY = Math.max(12, Math.round(ry));

  return {
    id,
    name: options?.name ?? 'Hình Elip / Tròn',
    visible: true,
    isClosed: true,
    fillColor: options?.fillColor ?? '#06b6d4',
    fillOpacity: options?.fillOpacity ?? 0.25,
    strokeColor: options?.strokeColor ?? '#22d3ee',
    strokeWidth: options?.strokeWidth ?? 2.5,
    nodes: [
      {
        id: `${id}-top`,
        point: { x, y: y - radY },
        handleIn: { x: x - ox, y: y - radY },
        handleOut: { x: x + ox, y: y - radY },
        type: 'smooth',
      },
      {
        id: `${id}-right`,
        point: { x: x + radX, y },
        handleIn: { x: x + radX, y: y - oy },
        handleOut: { x: x + radX, y: y + oy },
        type: 'smooth',
      },
      {
        id: `${id}-bottom`,
        point: { x, y: y + radY },
        handleIn: { x: x + ox, y: y + radY },
        handleOut: { x: x - ox, y: y + radY },
        type: 'smooth',
      },
      {
        id: `${id}-left`,
        point: { x: x - radX, y },
        handleIn: { x: x - radX, y: y + oy },
        handleOut: { x: x - radX, y: y - oy },
        type: 'smooth',
      },
    ],
  };
}

/**
 * Generates parametric 5-point Star PathCurve.
 */
export function createStarCurve(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius?: number,
  pointsCount: number = 5,
  options?: Partial<PathCurve>
): PathCurve {
  const id = options?.id ?? `shape-star-${Date.now()}`;
  const rOut = Math.max(20, outerRadius);
  const rIn = innerRadius ?? rOut * 0.44;
  const nodes: BezierNode[] = [];
  const total = pointsCount * 2;

  for (let i = 0; i < total; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / pointsCount;
    const r = i % 2 === 0 ? rOut : rIn;
    nodes.push({
      id: `${id}-p-${i}`,
      point: {
        x: Math.round(cx + Math.cos(angle) * r),
        y: Math.round(cy + Math.sin(angle) * r),
      },
      type: 'sharp',
    });
  }

  return {
    id,
    name: options?.name ?? `Ngôi sao ${pointsCount} cánh`,
    visible: true,
    isClosed: true,
    fillColor: options?.fillColor ?? '#f59e0b',
    fillOpacity: options?.fillOpacity ?? 0.25,
    strokeColor: options?.strokeColor ?? '#fbbf24',
    strokeWidth: options?.strokeWidth ?? 2.5,
    nodes,
  };
}

/**
 * Computes mirrored handle for a smooth node.
 * If handleOut is dragged, handleIn stays 180 degrees collinear.
 */
export function getCollinearOppositeHandle(
  nodePoint: Point,
  activeHandle: Point,
  currentOppositeHandle?: Point | null
): Point {
  const dx = activeHandle.x - nodePoint.x;
  const dy = activeHandle.y - nodePoint.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: nodePoint.x, y: nodePoint.y };

  // Maintain opposite length if it exists, otherwise mirror exact length
  const oppLen = currentOppositeHandle
    ? distance(nodePoint, currentOppositeHandle)
    : len;

  return {
    x: nodePoint.x - (dx / len) * oppLen,
    y: nodePoint.y - (dy / len) * oppLen,
  };
}

/**
 * Computes smart handles for a node based on adjacent nodes (Catmull-Rom tangent).
 */
export function computeSmartHandles(
  prevPoint: Point | null,
  currentPoint: Point,
  nextPoint: Point | null
): { handleIn: Point; handleOut: Point } {
  if (!prevPoint && !nextPoint) {
    return { handleIn: { ...currentPoint }, handleOut: { ...currentPoint } };
  }

  if (!prevPoint && nextPoint) {
    const dx = (nextPoint.x - currentPoint.x) * 0.25;
    const dy = (nextPoint.y - currentPoint.y) * 0.25;
    return {
      handleIn: { x: currentPoint.x - dx, y: currentPoint.y - dy },
      handleOut: { x: currentPoint.x + dx, y: currentPoint.y + dy },
    };
  }

  if (prevPoint && !nextPoint) {
    const dx = (currentPoint.x - prevPoint.x) * 0.25;
    const dy = (currentPoint.y - prevPoint.y) * 0.25;
    return {
      handleIn: { x: currentPoint.x - dx, y: currentPoint.y - dy },
      handleOut: { x: currentPoint.x + dx, y: currentPoint.y + dy },
    };
  }

  // Both prev and next exist
  const dx = (nextPoint!.x - prevPoint!.x) * 0.25;
  const dy = (nextPoint!.y - prevPoint!.y) * 0.25;

  return {
    handleIn: { x: currentPoint.x - dx, y: currentPoint.y - dy },
    handleOut: { x: currentPoint.x + dx, y: currentPoint.y + dy },
  };
}

/**
 * Samples points along a cubic Bezier segment.
 */
function sampleCubicBezier(p0: Point, cp1: Point, cp2: Point, p3: Point, count: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const mt = 1 - t;
    const x =
      mt * mt * mt * p0.x +
      3 * mt * mt * t * cp1.x +
      3 * mt * t * t * cp2.x +
      t * t * t * p3.x;
    const y =
      mt * mt * mt * p0.y +
      3 * mt * mt * t * cp1.y +
      3 * mt * t * t * cp2.y +
      t * t * t * p3.y;
    points.push({ x, y });
  }
  return points;
}

/**
 * Samples points along an entire PathCurve.
 */
export function sampleCurvePoints(curve: PathCurve, samplesPerSegment: number = 20): Point[] {
  const { nodes, isClosed } = curve;
  if (!nodes || nodes.length < 2) {
    return nodes ? nodes.map((n) => n.point) : [];
  }

  const sampled: Point[] = [];
  const segCount = isClosed ? nodes.length : nodes.length - 1;

  for (let i = 0; i < segCount; i++) {
    const curr = nodes[i];
    const next = nodes[(i + 1) % nodes.length];

    const cp1 = curr.handleOut || curr.point;
    const cp2 = next.handleIn || next.point;

    const segment = sampleCubicBezier(curr.point, cp1, cp2, next.point, samplesPerSegment);
    // avoid duplicating connection points
    if (i > 0) segment.shift();
    sampled.push(...segment);
  }

  return sampled;
}

/**
 * Evaluates similarity between user curve and target curve.
 * Returns an accuracy percentage from 0 to 100, and average pixel deviation.
 */
export function evaluateCurveAccuracy(
  userCurve: PathCurve,
  targetCurve: PathCurve,
  tolerance: number = 15
): { accuracy: number; averageDistance: number; feedback: string } {
  if (!userCurve || userCurve.nodes.length === 0) {
    return { accuracy: 0, averageDistance: 999, feedback: 'Hãy vẽ đường path để bắt đầu chấm điểm.' };
  }

  if (targetCurve.isClosed && !userCurve.isClosed) {
    return { accuracy: 25, averageDistance: 100, feedback: 'Bài tập này yêu cầu path khép kín (nhấp vào điểm bắt đầu để đóng path).' };
  }

  const userSamples = sampleCurvePoints(userCurve, 15);
  const targetSamples = sampleCurvePoints(targetCurve, 15);

  if (userSamples.length === 0 || targetSamples.length === 0) {
    return { accuracy: 0, averageDistance: 999, feedback: 'Không đủ điểm mẫu để đánh giá.' };
  }

  // Compute average distance from target points to closest user point
  let totalDistance = 0;
  for (const tPt of targetSamples) {
    let minDist = Infinity;
    for (const uPt of userSamples) {
      const d = distance(tPt, uPt);
      if (d < minDist) minDist = d;
    }
    totalDistance += minDist;
  }

  const averageDistance = Math.round((totalDistance / targetSamples.length) * 10) / 10;

  // Score function: if avg dist <= 2px => 98-100%, if avg dist <= tolerance => 75-95%, drops down to 0
  let accuracy = 0;
  if (averageDistance <= 2) {
    accuracy = 100;
  } else if (averageDistance <= tolerance) {
    // 75% to 99%
    accuracy = Math.round(99 - ((averageDistance - 2) / (tolerance - 2)) * 24);
  } else {
    // 0% to 74%
    const excess = averageDistance - tolerance;
    accuracy = Math.max(0, Math.round(74 - (excess / tolerance) * 50));
  }

  let feedback = '';
  if (accuracy >= 95) {
    feedback = 'Xuất sắc! Đường cong Bézier của bạn cực kỳ chính xác và mượt mà.';
  } else if (accuracy >= 80) {
    feedback = 'Rất tốt! Hình dạng cơ bản đã đạt, hãy dùng Node Tool căn chỉnh thêm tay cầm Bézier.';
  } else if (accuracy >= 60) {
    feedback = 'Khá ổn. Chuyển sang Node Tool (phím A) để kéo các điểm neo và tay đòn khớp với viền mờ.';
  } else {
    feedback = 'Độ lệch còn lớn. Hãy bám sát đường viền màu xanh (ghost outline) và căn góc các node.';
  }

  return { accuracy, averageDistance, feedback };
}
