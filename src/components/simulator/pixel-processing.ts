export const PHOTO_CANVAS_WIDTH = 640;
export const PHOTO_CANVAS_HEIGHT = 420;

export interface AdjustmentParams {
  curveShadow: number;    // -60..+60
  curveMidtone: number;   // -60..+60
  curveHighlight: number; // -60..+60
  brightness: number;     // -80..+80
  contrast: number;       // -80..+80
  hueShift: number;       // -180..+180
  saturation: number;     // -100..+100
  lightness: number;      // -40..+40
}

export const DEFAULT_ADJUSTMENT_PARAMS: AdjustmentParams = {
  curveShadow: 0,
  curveMidtone: 0,
  curveHighlight: 0,
  brightness: 0,
  contrast: 0,
  hueShift: 0,
  saturation: 0,
  lightness: 0,
};

export interface MaskEvalMetrics {
  backdropConcealedPct: number;
  subjectPreservedPct: number;
  modifiedPixelsRatio: number;
  accuracy: number;
  feedback: string;
}

/**
 * Draws an HTMLImageElement onto a 2D canvas context with CSS object-fit: cover behavior.
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  focusX: number = 0.5,
  focusY: number = 0.5
): void {
  const iw = img.naturalWidth || targetWidth;
  const ih = img.naturalHeight || targetHeight;
  const scale = Math.max(targetWidth / iw, targetHeight / ih);
  const drawW = iw * scale;
  const drawH = ih * scale;
  const offsetX = (targetWidth - drawW) * focusX;
  const offsetY = (targetHeight - drawH) * focusY;
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

/**
 * Computes an automatic edge-flood studio backdrop matte for portrait-subject-studio.png.
 * Returns alpha values (0 = background concealed, 255 = subject revealed) with feathered hair transition.
 */
export function extractPortraitStudioMatte(subjectImgData: ImageData): Uint8ClampedArray {
  const { width, height, data } = subjectImgData;
  const total = width * height;
  const visited = new Uint8Array(total);
  const isBg = new Uint8Array(total);

  // Sample clean studio grey background in upper-left patch
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let samples = 0;
  for (let y = 8; y < Math.min(48, height); y += 2) {
    for (let x = 8; x < Math.min(64, width); x += 2) {
      const idx = (y * width + x) * 4;
      sumR += data[idx];
      sumG += data[idx + 1];
      sumB += data[idx + 2];
      samples++;
    }
  }
  const refR = samples > 0 ? sumR / samples : 45;
  const refG = samples > 0 ? sumG / samples : 45;
  const refB = samples > 0 ? sumB / samples : 45;

  const isBackdropPixel = (
    pxIndex: number,
    parentR: number,
    parentG: number,
    parentB: number
  ): boolean => {
    const i = pxIndex * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const chroma = maxC - minC;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    // Exclude skin, warm hair highlights, and bright edge features
    if (chroma > 14 || Math.abs(r - b) > 12 || luma > 120) return false;

    // Coat follows neck -> sloped right shoulder silhouette: protect lower wool coat without cutting horizontal box
    const px = pxIndex % width;
    const py = Math.floor(pxIndex / width);
    const nx = px / width;
    const shoulderThreshold = 0.58 + Math.max(0, (nx - 0.64) * 1.45);
    const inCoatZone = nx > 0.43 && nx < 0.87 && py > height * shoulderThreshold;
    if (inCoatZone && luma < 56) return false;

    // Studio backdrop has a soft vignette spotlight behind hair/forehead (up to ~95 luma delta)
    const stepDelta =
      Math.abs(r - parentR) + Math.abs(g - parentG) + Math.abs(b - parentB);
    const refDist = Math.hypot(r - refR, g - refG, b - refB);
    return stepDelta <= 24 && refDist <= 96;
  };

  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const trySeed = (x: number, y: number) => {
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (isBackdropPixel(p, refR, refG, refB)) {
      isBg[p] = 1;
      queue[tail++] = p;
    }
  };

  // Seed outer edges touching neutral studio grey backdrop
  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    if (x < Math.floor(width * 0.36)) {
      trySeed(x, height - 1);
    }
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    if (y < Math.floor(height * 0.6)) {
      trySeed(width - 1, y);
    }
  }

  // Also seed neutral studio-grey pockets trapped between loose hair strands
  // Restricted strictly to front-of-face hair gap and upper-back rim, never inside head/collar
  for (let y = Math.floor(height * 0.14); y < Math.floor(height * 0.66); y += 6) {
    for (let x = Math.floor(width * 0.30); x < Math.floor(width * 0.84); x += 6) {
      if (
        x >= Math.floor(width * 0.41) &&
        !(x > Math.floor(width * 0.72) && y < Math.floor(height * 0.50))
      ) {
        continue;
      }
      const idx = y * width + x;
      if (visited[idx]) continue;
      const i = idx * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      // Avoid dark hair strands & eyes (luma < 42) and skin tones (chroma > 9)
      if (chroma <= 9 && Math.abs(r - b) <= 8 && luma >= 42 && luma <= 104) {
        visited[idx] = 1;
        isBg[idx] = 1;
        queue[tail++] = idx;
      }
    }
  }

  while (head < tail) {
    const p = queue[head++];
    const px = p % width;
    const py = Math.floor(p / width);
    const pi = p * 4;
    const pr = data[pi];
    const pg = data[pi + 1];
    const pb = data[pi + 2];

    if (px > 0) {
      const np = p - 1;
      if (!visited[np]) {
        visited[np] = 1;
        if (isBackdropPixel(np, pr, pg, pb)) {
          isBg[np] = 1;
          queue[tail++] = np;
        }
      }
    }
    if (px < width - 1) {
      const np = p + 1;
      if (!visited[np]) {
        visited[np] = 1;
        if (isBackdropPixel(np, pr, pg, pb)) {
          isBg[np] = 1;
          queue[tail++] = np;
        }
      }
    }
    if (py > 0) {
      const np = p - width;
      if (!visited[np]) {
        visited[np] = 1;
        if (isBackdropPixel(np, pr, pg, pb)) {
          isBg[np] = 1;
          queue[tail++] = np;
        }
      }
    }
    if (py < height - 1) {
      const np = p + width;
      if (!visited[np]) {
        visited[np] = 1;
        if (isBackdropPixel(np, pr, pg, pb)) {
          isBg[np] = 1;
          queue[tail++] = np;
        }
      }
    }
  }

  // Raw binary matte: 0 = backdrop concealed, 255 = subject revealed
  let alpha = new Uint8ClampedArray(total);
  for (let i = 0; i < total; i++) {
    alpha[i] = isBg[i] ? 0 : 255;
  }

  // 2 passes of edge-preserving box feather (1px) for smooth portrait hair transition
  for (let pass = 0; pass < 2; pass++) {
    const next = new Uint8ClampedArray(alpha);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const sum =
          alpha[idx - width - 1] +
          alpha[idx - width] +
          alpha[idx - width + 1] +
          alpha[idx - 1] +
          alpha[idx] +
          alpha[idx + 1] +
          alpha[idx + width - 1] +
          alpha[idx + width] +
          alpha[idx + width + 1];
        if (sum > 0 && sum < 255 * 9) {
          next[idx] = Math.round(sum / 9);
        }
      }
    }
    alpha = next;
  }

  return alpha;
}

/**
 * Generates a 256-entry tonal Look-Up Table (LUT) from Curves + Brightness/Contrast parameters.
 */
export function buildCurvesLut(params: AdjustmentParams): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256);

  const p0 = { x: 0, y: 0 };
  const p1 = { x: 64, y: Math.max(0, Math.min(255, 64 + params.curveShadow)) };
  const p2 = { x: 128, y: Math.max(0, Math.min(255, 128 + params.curveMidtone)) };
  const p3 = { x: 192, y: Math.max(0, Math.min(255, 192 + params.curveHighlight)) };
  const p4 = { x: 255, y: 255 };
  const pts = [p0, p1, p2, p3, p4];

  const evalCatmull = (a: number, b: number, c: number, d: number, t: number): number => {
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      0.5 *
      (2 * b +
        (-a + c) * t +
        (2 * a - 5 * b + 4 * c - d) * t2 +
        (-a + 3 * b - 3 * c + d) * t3)
    );
  };

  const contrastFactor =
    (259 * (params.contrast + 255)) / (255 * Math.max(1, 259 - params.contrast));

  for (let i = 0; i < 256; i++) {
    let curved = i;
    for (let seg = 0; seg < 4; seg++) {
      const start = pts[seg];
      const end = pts[seg + 1];
      if (i >= start.x && i <= end.x) {
        const t = (i - start.x) / Math.max(1, end.x - start.x);
        const y0 = pts[Math.max(0, seg - 1)].y;
        const y1 = start.y;
        const y2 = end.y;
        const y3 = pts[Math.min(4, seg + 2)].y;
        curved = evalCatmull(y0, y1, y2, y3, t);
        break;
      }
    }

    // Apply brightness and contrast
    let val = curved + params.brightness;
    val = contrastFactor * (val - 128) + 128;
    lut[i] = Math.max(0, Math.min(255, Math.round(val)));
  }

  return lut;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h /= 6;
  }

  return [h, s, l];
}

function hueToRgb(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, h) * 255),
    Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  ];
}

/**
 * Applies real pixel-level LUT Curves + Brightness/Contrast + HSL transforms onto an ImageData buffer.
 */
export function applyPixelAdjustments(
  source: ImageData,
  params: AdjustmentParams,
  layerOpacity: number = 100
): ImageData {
  const lut = buildCurvesLut(params);
  const out = new ImageData(source.width, source.height);
  const src = source.data;
  const dst = out.data;

  const alphaMix = Math.max(0, Math.min(1, layerOpacity / 100));
  const useHsl =
    params.hueShift !== 0 || params.saturation !== 0 || params.lightness !== 0;

  const hueDelta = params.hueShift / 360;
  const satScale =
    params.saturation >= 0
      ? 1 + (params.saturation / 100) * 1.5
      : 1 + params.saturation / 100;
  const lightDelta = params.lightness / 100;

  for (let i = 0; i < src.length; i += 4) {
    const r0 = src[i];
    const g0 = src[i + 1];
    const b0 = src[i + 2];

    let r = lut[r0];
    let g = lut[g0];
    let b = lut[b0];

    if (useHsl) {
      const [h, s, l] = rgbToHsl(r, g, b);
      const nh = (((h + hueDelta) % 1) + 1) % 1;
      const ns = Math.max(0, Math.min(1, s * satScale));
      const nl = Math.max(0, Math.min(1, l + lightDelta));
      [r, g, b] = hslToRgb(nh, ns, nl);
    }

    if (alphaMix < 0.999) {
      dst[i] = Math.round(r0 + (r - r0) * alphaMix);
      dst[i + 1] = Math.round(g0 + (g - g0) * alphaMix);
      dst[i + 2] = Math.round(b0 + (b - b0) * alphaMix);
    } else {
      dst[i] = r;
      dst[i + 1] = g;
      dst[i + 2] = b;
    }
    dst[i + 3] = src[i + 3];
  }

  return out;
}

/**
 * Computes a 32-bin normalized luminance histogram for SVG display.
 */
export function computeLuminanceHistogram(imgData: ImageData, bins: number = 32): number[] {
  const counts = new Float64Array(bins);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 16) {
    // sample every 4th pixel for crisp < 1ms real-time updates
    const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const bin = Math.min(bins - 1, Math.floor((luma / 256) * bins));
    counts[bin]++;
  }

  let maxVal = 1;
  for (let b = 0; b < bins; b++) {
    if (counts[b] > maxVal) maxVal = counts[b];
  }

  const normalized: number[] = [];
  for (let b = 0; b < bins; b++) {
    normalized.push(Math.round((counts[b] / maxVal) * 100));
  }
  return normalized;
}

/**
 * Evaluates user mask accuracy against the true studio portrait reference matte.
 */
export function evaluateMaskAccuracy(
  currentMask: ImageData,
  referenceMatte: Uint8ClampedArray
): MaskEvalMetrics {
  const d = currentMask.data;
  let bgTotal = 0;
  let bgHidden = 0;
  let subjTotal = 0;
  let subjKept = 0;
  let modifiedCount = 0;
  const totalPixels = referenceMatte.length;

  for (let i = 0; i < totalPixels; i += 4) {
    const pxOffset = i * 4;
    const maskVal = Math.min(d[pxOffset], d[pxOffset + 3]); // dark or transparent alpha = concealed
    if (maskVal < 245) {
      modifiedCount++;
    }

    const ref = referenceMatte[i];
    if (ref < 60) {
      bgTotal++;
      if (maskVal < 110) bgHidden++;
    } else if (ref > 200) {
      subjTotal++;
      if (maskVal > 145) subjKept++;
    }
  }

  const backdropConcealedPct = bgTotal > 0 ? Math.round((bgHidden / bgTotal) * 100) : 0;
  const subjectPreservedPct = subjTotal > 0 ? Math.round((subjKept / subjTotal) * 100) : 100;
  const modifiedPixelsRatio = modifiedCount / (totalPixels / 4);

  if (modifiedPixelsRatio < 0.015) {
    return {
      backdropConcealedPct,
      subjectPreservedPct,
      modifiedPixelsRatio,
      accuracy: 0,
      feedback: 'Bạn chưa tách nền hoặc tô mặt nạ lên vùng phông xám. Hãy dùng cọ Mask Đen hoặc Tách nền thông minh.',
    };
  }

  const weighted = Math.round(backdropConcealedPct * 0.65 + subjectPreservedPct * 0.35);
  const accuracy = Math.max(0, Math.min(100, weighted));

  const feedback =
    accuracy >= 85
      ? `Tách nền chuẩn xác! Đã ẩn ${backdropConcealedPct}% phông xám studio và giữ nguyên ${subjectPreservedPct}% chủ thể.`
      : `Hiện đã ẩn ${backdropConcealedPct}% phông nền và giữ ${subjectPreservedPct}% chủ thể. Hãy tô kỹ thêm các vùng nền còn sót để đạt >= 85%.`;

  return {
    backdropConcealedPct,
    subjectPreservedPct,
    modifiedPixelsRatio,
    accuracy,
    feedback,
  };
}
