import { BezierNode, BooleanOp, PathCurve, Point } from './types';
import { buildSvgPath } from './bezier-math';

function perpendicularDistance(pt: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    return Math.hypot(pt.x - lineStart.x, pt.y - lineStart.y);
  }
  const num = Math.abs(dy * pt.x - dx * pt.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x);
  return num / Math.sqrt(lenSq);
}

function rdpOpen(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points;
  let maxDist = 0;
  let splitIdx = 0;
  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], first, last);
    if (d > maxDist) {
      maxDist = d;
      splitIdx = i;
    }
  }

  if (maxDist > epsilon) {
    const left = rdpOpen(points.slice(0, splitIdx + 1), epsilon);
    const right = rdpOpen(points.slice(splitIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [first, last];
}

function simplifyClosedLoop(points: Point[], epsilon: number): Point[] {
  if (points.length < 6) return points;
  const half = Math.floor(points.length / 2);
  const segA = rdpOpen(points.slice(0, half + 1), epsilon);
  const segB = rdpOpen([...points.slice(half), points[0]], epsilon);
  return [...segA.slice(0, -1), ...segB.slice(0, -1)];
}

function polygonArea(loop: Point[]): number {
  let area = 0;
  for (let i = 0; i < loop.length; i++) {
    const p1 = loop[i];
    const p2 = loop[(i + 1) % loop.length];
    area += p1.x * p2.y - p2.x * p1.y;
  }
  return Math.abs(area) / 2;
}

/**
 * Extracts all closed contours from a binary grid mask using Marching Squares edge chaining.
 */
function traceMaskContours(
  mask: Uint8Array,
  width: number,
  height: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): Point[][] {
  // Doubled-integer coordinates eliminate floating-point key mismatch at cell midpoints
  const adjacency = new Map<string, string[]>();
  const coordMap = new Map<string, Point>();

  const registerEdge = (ax2: number, ay2: number, bx2: number, by2: number) => {
    const keyA = `${ax2},${ay2}`;
    const keyB = `${bx2},${by2}`;
    if (!coordMap.has(keyA)) coordMap.set(keyA, { x: ax2 / 2, y: ay2 / 2 });
    if (!coordMap.has(keyB)) coordMap.set(keyB, { x: bx2 / 2, y: by2 / 2 });

    const listA = adjacency.get(keyA);
    if (listA) listA.push(keyB);
    else adjacency.set(keyA, [keyB]);

    const listB = adjacency.get(keyB);
    if (listB) listB.push(keyA);
    else adjacency.set(keyB, [keyA]);
  };

  const sample = (x: number, y: number): number => {
    if (x < 0 || y < 0 || x >= width || y >= height) return 0;
    return mask[y * width + x];
  };

  const x0 = Math.max(0, minX - 1);
  const y0 = Math.max(0, minY - 1);
  const x1 = Math.min(width - 1, maxX + 1);
  const y1 = Math.min(height - 1, maxY + 1);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const tl = sample(x, y);
      const tr = sample(x + 1, y);
      const br = sample(x + 1, y + 1);
      const bl = sample(x, y + 1);
      const code = (tl << 3) | (tr << 2) | (br << 1) | bl;
      if (code === 0 || code === 15) continue;

      const x2 = x * 2;
      const y2 = y * 2;
      // Midpoints in doubled coords: Top=(x2+1,y2), Right=(x2+2,y2+1), Bottom=(x2+1,y2+2), Left=(x2,y2+1)
      switch (code) {
        case 1:
        case 14:
          registerEdge(x2, y2 + 1, x2 + 1, y2 + 2);
          break;
        case 2:
        case 13:
          registerEdge(x2 + 1, y2 + 2, x2 + 2, y2 + 1);
          break;
        case 3:
        case 12:
          registerEdge(x2, y2 + 1, x2 + 2, y2 + 1);
          break;
        case 4:
        case 11:
          registerEdge(x2 + 1, y2, x2 + 2, y2 + 1);
          break;
        case 5:
          registerEdge(x2, y2 + 1, x2 + 1, y2);
          registerEdge(x2 + 1, y2 + 2, x2 + 2, y2 + 1);
          break;
        case 6:
        case 9:
          registerEdge(x2 + 1, y2, x2 + 1, y2 + 2);
          break;
        case 7:
        case 8:
          registerEdge(x2, y2 + 1, x2 + 1, y2);
          break;
        case 10:
          registerEdge(x2 + 1, y2, x2 + 2, y2 + 1);
          registerEdge(x2, y2 + 1, x2 + 1, y2 + 2);
          break;
      }
    }
  }

  const visited = new Set<string>();
  const loops: Point[][] = [];

  for (const startKey of adjacency.keys()) {
    if (visited.has(startKey)) continue;
    const neighbors = adjacency.get(startKey);
    if (!neighbors || neighbors.length === 0) continue;

    const loop: Point[] = [];
    let prevKey: string | null = null;
    let currKey: string | null = startKey;
    let guard = 0;

    while (currKey && guard < 20000) {
      guard++;
      visited.add(currKey);
      const pt = coordMap.get(currKey);
      if (pt) loop.push(pt);

      const nextList: string[] = adjacency.get(currKey) ?? [];
      const candidate: string | undefined =
        nextList.find((k: string) => k !== prevKey && !visited.has(k)) ??
        nextList.find((k: string) => k === startKey && guard > 2);

      if (!candidate || candidate === startKey) {
        break;
      }
      prevKey = currKey;
      currKey = candidate;
    }

    if (loop.length >= 8) {
      const simplified = simplifyClosedLoop(loop, 1.5);
      if (simplified.length >= 3 && polygonArea(simplified) >= 24) {
        loops.push(simplified);
      }
    }
  }

  loops.sort((a, b) => polygonArea(b) - polygonArea(a));
  return loops;
}

function rasterizeCurveToMask(
  curve: PathCurve,
  width: number,
  height: number
): Uint8Array | null {
  const pathD = buildSvgPath(curve.nodes, curve.isClosed || curve.nodes.length >= 3, curve.compoundPathD);
  if (!pathD) return null;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  try {
    const p2d = new Path2D(pathD);
    ctx.fill(p2d, curve.fillRule ?? 'evenodd');
  } catch {
    return null;
  }

  const data = ctx.getImageData(0, 0, width, height).data;
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < mask.length; i++) {
    mask[i] = data[i * 4 + 3] >= 128 ? 1 : 0;
  }
  return mask;
}

const OP_LABELS_VI: Record<BooleanOp, string> = {
  add: 'Hợp nhất (Add)',
  subtract: 'Cắt trừ (Subtract)',
  intersect: 'Phần giao (Intersect)',
  xor: 'Loại trừ phần giao (Xor)',
};

/**
 * Performs a real planar Boolean operation (Add, Subtract, Intersect, Xor)
 * between two PathCurves and returns a crisp multi-contour SVG PathCurve.
 */
export function computeBooleanOperation(
  baseCurve: PathCurve,
  cutCurve: PathCurve,
  op: BooleanOp,
  width: number = 820,
  height: number = 520
): { curve: PathCurve | null; message: string; contourCount: number } {
  const maskA = rasterizeCurveToMask(baseCurve, width, height);
  const maskB = rasterizeCurveToMask(cutCurve, width, height);

  if (!maskA || !maskB) {
    return {
      curve: null,
      message: 'Không thể đọc hình học từ hai lớp được chọn.',
      contourCount: 0,
    };
  }

  const outMask = new Uint8Array(width * height);
  let activePixels = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const a = maskA[idx] === 1;
      const b = maskB[idx] === 1;
      let keep = false;

      if (op === 'add') keep = a || b;
      else if (op === 'subtract') keep = a && !b;
      else if (op === 'intersect') keep = a && b;
      else keep = a !== b;

      if (keep) {
        outMask[idx] = 1;
        activePixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (activePixels < 16) {
    return {
      curve: null,
      message: `Kết quả phép toán ${OP_LABELS_VI[op]} rỗng (hai hình không đủ vùng giao phủ).`,
      contourCount: 0,
    };
  }

  const loops = traceMaskContours(outMask, width, height, minX, minY, maxX, maxY);
  if (loops.length === 0) {
    return {
      curve: null,
      message: `Không trích xuất được đường viền sau phép toán ${OP_LABELS_VI[op]}.`,
      contourCount: 0,
    };
  }

  const id = `bool-${op}-${Date.now()}`;
  const compoundPathD = loops
    .map(
      (loop) =>
        `M ${loop[0].x.toFixed(1)} ${loop[0].y.toFixed(1)} ` +
        loop
          .slice(1)
          .map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
          .join(' ') +
        ' Z'
    )
    .join(' ');

  const primaryNodes: BezierNode[] = loops[0].map((pt, i) => ({
    id: `${id}-n-${i}`,
    point: { x: Math.round(pt.x * 10) / 10, y: Math.round(pt.y * 10) / 10 },
    type: 'sharp',
  }));

  return {
    curve: {
      id,
      name: `Kết quả ${OP_LABELS_VI[op]}`,
      visible: true,
      nodes: primaryNodes,
      isClosed: true,
      fillColor: baseCurve.fillColor ?? '#06b6d4',
      fillOpacity: baseCurve.fillOpacity ?? 0.28,
      strokeColor: baseCurve.strokeColor ?? '#22d3ee',
      strokeWidth: baseCurve.strokeWidth ?? 2.5,
      compoundPathD,
      fillRule: 'evenodd',
    },
    message: `Đã thực hiện phép ${OP_LABELS_VI[op]} — tạo thành công ${loops.length} chu tuyến vector (${primaryNodes.length} đỉnh chính).`,
    contourCount: loops.length,
  };
}
