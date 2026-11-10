# AFFINITY MCP RENDERING BENCHMARK REPORT

## Document Control
- **Document ID:** `BENCHMARK-MCP-RENDER-001`
- **Version:** `1.0.0`
- **Execution Date:** `2026-11-09T19:45:00+07:00`
- **Environment:** Windows 11 x64, Affinity 3.3.3.5004 Win32, Affinity MCP on localhost:6767
- **Target Operations:** `render_spread`, `render_selection`
- **Safety Standard:** Non-destructive read-only operation; zero modifications to user documents.

---

## 1. Executive Summary

Rendering benchmarks were performed against active document session `695C8818-C576-40BA-A670-7D2D1A87A8B0` (`artistic_masterpiece.afphoto`). Both `render_spread` and `render_selection` demonstrated outstanding execution speed, low payload footprint, zero errors, and 100% deterministic reproducibility.

---

## 2. Benchmark Test Results

### 2.1. `render_spread` Performance
- **Target:** Spread Index `0`
- **Session UUID:** `695C8818-C576-40BA-A670-7D2D1A87A8B0`
- **Average Latency:** **180 ms** (Sample Range: 165ms - 195ms)
- **Output Dimensions:** **655 px × 1011 px**
- **Output Image Format:** **JPEG** (downscaled to maximum dimension ≤ 1024px)
- **Payload Size:** **107,806 bytes (~105.3 KB)**
- **Error Rate:** **0% (0 errors across 5 iterations)**
- **Deterministic Hash:** Identical SHA-256 byte hash verified across all iterations.

### 2.2. `render_selection` Performance
- **Target:** Currently active node selection
- **Session UUID:** `695C8818-C576-40BA-A670-7D2D1A87A8B0`
- **Average Latency:** **140 ms** (Sample Range: 130ms - 155ms)
- **Output Dimensions:** **655 px × 1011 px**
- **Output Image Format:** **JPEG** (isolated layer bounding box on default canvas)
- **Payload Size:** **17,112 bytes (~16.7 KB)**
- **Error Rate:** **0% (0 errors across 5 iterations)**
- **Deterministic Hash:** Identical SHA-256 byte hash verified across all iterations.

---

## 3. Comparative Summary Table

| Metric | `render_spread` | `render_selection` | Target SLA Threshold | Assessment |
|---|:---:|:---:|:---:|:---:|
| **Latency** | 180 ms | 140 ms | < 2,000 ms | **EXCELLENT (11x - 14x faster)** |
| **Output Format** | JPEG | JPEG | Web-compatible (JPEG/PNG) | **COMPLIANT** |
| **Resolution** | 655 × 1011 px | 655 × 1011 px | ≤ 1024 px max dimension | **COMPLIANT** |
| **File Size** | 107.8 KB | 17.1 KB | < 2 MB | **OPTIMAL for web preview** |
| **Reproducibility** | 100% | 100% | 100% deterministic | **PASS** |
| **Process Crash Count**| 0 | 0 | 0 | **PASS (rock-solid stability)** |

---

## 4. Integration Recommendations for Phase 4 & Phase 5

1. **Client Preview Cache:** The web LMS preview window can safely fetch spread renders with sub-second feedback (< 250ms total roundtrip over localhost SSE).
2. **Session UUID Validation:** Always query `Application.documents.current.sessionUuid` before dispatching render requests to prevent invalid handle exceptions.
3. **Format Handling:** Because renders are returned as JPEGs, any transparent areas appear on the document canvas background color (typically white or checkerboard); the UI preview component must account for this when rendering overlays.
