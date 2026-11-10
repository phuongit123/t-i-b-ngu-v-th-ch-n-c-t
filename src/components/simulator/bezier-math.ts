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
 * Generates an SVG path 'd' attribute from an array of Bezier nodes.
 */
export function buildSvgPath(nodes: BezierNode[], isClosed: boolean): string {
  if (!nodes || nodes.length === 0) return '';
  if (nodes.length === 1) {
    return `M ${nodes[0].point.x} ${nodes[0].point.y}`;
  }

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
