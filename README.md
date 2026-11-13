# 🎨 AFFINITY ACADEMY (v4.2.2)
### Interactive Learning Platform & Programmatic Automation for Serif Affinity 3.0 Suite

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](vite.config.ts)
[![TypeScript](https://img.shields.io/badge/typescript-strict%200%20errors-blue.svg)](tsconfig.json)
[![Curriculum Schema](https://img.shields.io/badge/curriculum-66%2F66%20PASSED-success.svg)](scripts/validate-curriculum.js)
[![Playwright E2E](https://img.shields.io/badge/playwright-9%2F9%20PASSED-orange.svg)](tests/e2e/)
[![Bundle Reduction](https://img.shields.io/badge/entry%20bundle-139.20%20kB%20(Code--Split)-purple.svg)](dist/assets/)
[![Phase Gate](https://img.shields.io/badge/phase%20gate-HALTED%20(BLK--007)-yellow.svg)](project-control/BLOCKERS.md)

---

## 📖 1. Giới thiệu Dự án (About the Project)

**Affinity Academy** là nền tảng học tập đồ họa tương tác hiện đại kết hợp giảng dạy chuyên sâu bộ công cụ đồ họa chuyên nghiệp **Serif Affinity 3.0 suite** (Affinity Designer, Affinity Photo, Affinity Publisher) với khả năng tự động hóa đồ họa theo hướng lập trình hiện đại thông qua **Affinity JavaScript DOM Scripting API** và giao thức **Affinity Model Context Protocol (MCP)**.

Dự án áp dụng tiêu chuẩn thẩm mỹ thị giác và trải nghiệm tương tác **Mastero & Minimalism** (tham chiếu *traced.life*), với bảng màu trầm Slate/Indigo/Amber và phông chữ kỹ thuật Inter & JetBrains Mono.

---

## 🌟 2. Các Phân Hệ Đã Hoàn Thành (Key Implemented Subsystems)

### 2.1. Phân Hệ Giáo Trình (Curriculum Subsystem — 66/120 Lessons)
Dự án duy trì sự phân định minh bạch giữa **bài học cốt lõi đã hoàn thành**, **bài học pilot**, và **kế hoạch tổng thể**:
- **60 Bài học cốt lõi đã hoàn thành (Completed Core Lessons):**
  - **Track 1 — Affinity Designer (10 Modules, 30 Bài học, D01–D10):** Đã hoàn thiện và kiểm định kỹ thuật 100%. Bao gồm Vector nodes, Pen/Node geometry, Boolean geometry, Gradients, Clipping paths, Swatches, True Isometric axonometry (30°/150°/90°), Symbols Studio synchronization, Pixel Persona shading, và Continuous Export Persona slices.
  - **Track 2 — Affinity Photo (10 Modules, 30 Bài học, P01–P10):** Đã hoàn thiện và kiểm định chất lượng độc lập. Bao gồm Selections, Quick Mask, Refine Edge, Non-destructive layer stacks, Inpainting, Frequency Separation, Curves/HSL/LUT grading, Live Filters, Advanced Compositing, Typography integration, RAW Develop Persona 32-bit HDR, và Batch export pre-flight.
- **6 Bài học Pilot kiểm nghiệm nền móng (Pilot Lessons):**
  - **Track 3 Pilot — Affinity Publisher (Module B01, 3 Bài học):** Publication architecture, facing pages, 3mm bleed, Master Pages, Baseline Grid.
  - **Track 4 Pilot — Affinity Scripting (Module S01, 3 Bài học):** V8 JavaScript runtime, DOM API, ping MCP server trên cổng 6767.
- **66 Bài học hiện hữu trên repository (Total Existing Lessons):** 60 bài cốt lõi + 6 bài pilot, đạt **100% tỷ lệ xác thực schema** qua `scripts/validate-curriculum.js` (66/66 PASS).
- **120 Bài học theo quy hoạch tổng thể (Planned Curriculum):** 40 modules × 3 bài học = 120 bài học. 54 bài học còn lại (Track 3 B02–B10: 27 bài; Track 4 S02–S10: 27 bài) đang chờ phê duyệt cổng Phase Gate.
- **19 Bản thiết kế thực hành trung thực (`curriculum/assets/`):** 10 tài liệu Designer (`D01`–`D10`), 9 tài liệu Photo (`P02`–`P10`), và 1 tệp nhị phân gốc `P01_starter.afphoto` (1.65 MB).

### 2.2. Bộ Đôi Công Cụ Mô Phỏng Tương Tác Trên Trình Duyệt (In-Browser Simulators)
1. **Vector Bézier Pen & Node Simulator (`PenNodeSimulator.tsx`):**
   - Engine SVG tương tác toán học thuần túy (Cubic Bézier & Catmull-Rom tangents).
   - Công cụ Pen Tool (`P`), Node Tool (`A`), phím Alt bẻ góc tay đòn (Cusp Handle), chuyển đổi Sharp/Smooth/Smart.
   - Thuật toán chấm điểm tự động (Evaluation Scorer) lấy mẫu 15 điểm/segment tính độ lệch Euclidean so với mẫu.
2. **Photo Layer Stack & Dynamic Masking Simulator (`PhotoLayerSimulator.tsx`):**
   - Engine Canvas 2D mô phỏng cây layer 4 lớp phi phá hủy (Background, Subject, Adjustment, Live Filter).
   - Cơ chế cọ vẽ mặt nạ thời gian thực: White (hiện hình) và Black (ẩn hình); điều chỉnh Brush Radius (4px đến 60px) và Hardness (0% đến 100%).
   - Phím tắt chuyên nghiệp: `X` (đổi cọ), `[` / `]` (cỡ cọ), `Ctrl+I` / `Cmd+I` (Invert Mask).
   - Tích hợp banner miễn trừ trách nhiệm giáo dục minh bạch.

### 2.3. Bách Khoa Toàn Thư API & Thư Viện Tài Nguyên (Encyclopedia & Resources Pages)
- **API Encyclopedia (`EncyclopediaPage.tsx`):** Tra cứu thời gian thực **401 chủ đề SDK** trích xuất từ Affinity 3.0 DOM với bộ lọc module (Application, Document, Shapes, Layer Effects, Commands) và mã code factory mẫu.
- **Resource Library (`ResourcesPage.tsx`):** Thư viện tải tài nguyên bài học được đóng gói cục bộ qua Vite asset bundling, tải trực tiếp không cần cloud bucket.

### 2.4. Tối Ưu Hóa Bundling & Phân Tách Mã Nguồn (Code-Splitting Architecture)
- Phân chia `manualChunks` trong `vite.config.ts`: `curriculum-designer-foundations`, `curriculum-designer-advanced`, `curriculum-photo-foundations`, `curriculum-photo-advanced`, `curriculum-publisher`, `curriculum-scripting`.
- Entry bundle `index.js` duy trì kích thước tối ưu **139.20 kB**. Toàn bộ các chunk giáo trình đều dưới 270 kB, **hoàn toàn không có cảnh báo vượt ngưỡng 500 kB từ Vite**.

---

## 📸 3. Kho Ảnh Minh Chứng Kiểm Thử Thực Tế (Visual Verification Evidence)

10 tệp ảnh chụp màn hình kiểm định tự động được lưu trữ vật lý tại `tests/screenshots/`:

| Tên File Screenshot | Viewport | Nội dung Xác thực |
|:---|:---:|:---|
| [`tests/screenshots/simulator-initial-state.png`](tests/screenshots/simulator-initial-state.png) | 1440 × 900 | Giao diện khởi tạo Pen & Node Simulator, banner cảnh báo, dot grid |
| [`tests/screenshots/simulator-canvas-active.png`](tests/screenshots/simulator-canvas-active.png) | 1440 × 900 | Thao tác cắm điểm neo và kéo tay đòn tiếp tuyến |
| [`tests/screenshots/simulator-diamond-evaluated.png`](tests/screenshots/simulator-diamond-evaluated.png) | 1440 × 900 | Đóng kín đường cong và chấm điểm độ chính xác (88%) |
| [`tests/screenshots/simulator-node-tool-smooth.png`](tests/screenshots/simulator-node-tool-smooth.png) | 1440 × 900 | Node Tool chuyển đổi góc mượt mà 180° |
| [`tests/screenshots/simulator-heart-exercise.png`](tests/screenshots/simulator-heart-exercise.png) | 1440 × 900 | Bài tập thử thách tạo hình quả tim D03 |
| [`tests/screenshots/simulator-tablet-768.png`](tests/screenshots/simulator-tablet-768.png) | 768 × 1024 | Hiển thị responsive trên tablet iPad |
| [`tests/screenshots/simulator-mobile-375.png`](tests/screenshots/simulator-mobile-375.png) | 375 × 667 | Hiển thị responsive trên điện thoại iPhone |
| [`tests/screenshots/photo-catalog-10-modules.png`](tests/screenshots/photo-catalog-10-modules.png) | 1440 × 900 | Bộ lọc Course Catalog hiển thị đủ 10 modules Track Photo |
| [`tests/screenshots/photo-slide-player-active.png`](tests/screenshots/photo-slide-player-active.png) | 1440 × 900 | Trình phát SlidePlayer điều hướng bài học Photo `P02-01` |
| [`tests/screenshots/photo-layer-simulator-active.png`](tests/screenshots/photo-layer-simulator-active.png) | 1440 × 900 | Tab mô phỏng Photo Layer Stack & Masking cọ vẽ |

---

## 📂 4. Bản Đồ Cấu Trúc Dự Án (Repository Map for AI Agents)

```
c:\affinity học/
├── .gitignore                          # Cấu hình bỏ qua git (node_modules, dist, test-results)
├── index.html                          # Entry HTML ứng dụng web
├── package.json                        # Khai báo dependencies (React 19, Vite, Playwright)
├── playwright.config.ts                # Cấu hình Playwright E2E (Microsoft Edge channel)
├── tailwind.config.ts                  # Cấu hình Design Tokens Tailwind CSS
├── tsconfig.json                       # Cấu hình TypeScript Strict Mode
├── vite.config.ts                      # Cấu hình Vite & Rollup code-splitting chunks
├── AGENTS.md                           # Quy định vận hành hệ thống đa tác tử (Multi-Agent System)
├── README.md                           # Cẩm nang tổng quan dự án (Tài liệu này)
├── PROJECT_MASTER_ANALYSIS.md          # Báo cáo phân tích chuyên sâu toàn bộ dự án
├── AFFINITY_DOM_API_REFERENCE.md       # Trích xuất 401 SDK topics của Affinity 3.0 DOM
├── AFFINITY_DOM_API_REFERENCE.json     # Dữ liệu có cấu trúc JSON của DOM API
├── AFFINITY_MCP_CAPABILITY_REPORT.md   # Báo cáo năng lực 11 công cụ Affinity MCP
├── project-control/                    # Hệ sinh thái tài liệu quản trị dự án nghiêm ngặt
│   ├── MASTER_SPEC.md                  # Đặc tả kỹ thuật tổng thể (4 Tracks, 40 Modules)
│   ├── REQUIREMENTS.md                 # 49 yêu cầu kỹ thuật chi tiết
│   ├── TASK_REGISTRY.md                # Bảng đăng ký tác vụ (16/50 hàng hoàn thành)
│   ├── ROADMAP.md                      # Lộ trình phụ thuộc 8 giai đoạn
│   ├── ACCEPTANCE_CRITERIA.md          # Tiêu chí nghiệm thu chi tiết
│   ├── DECISIONS.md                    # 21 quyết định kiến trúc (ADR-001 đến ADR-021)
│   ├── BLOCKERS.md                     # Quản lý điểm chặn (BLK-007 Phase Gate ACTIVE)
│   ├── PROGRESS.md                     # Theo dõi tiến độ hoàn thành thực tế (32.0%)
│   ├── HANDOFF.md                      # Cẩm nang bàn giao phiên làm việc
│   ├── PHASE_5_TRACK_2_IMPLEMENTATION_REPORT.md # Báo cáo chi tiết nghiệm thu Photo Track
│   ├── QA_PHASE5_TRACK2_SIGNOFF.md     # Chứng chỉ QA nghiệm thu độc lập Track 2
│   ├── PHASE_5_TRACK_3_PRE_IMPLEMENTATION_AUDIT.md # Kiểm toán trước triển khai Publisher
│   └── PHASE_5_TRACK_3_PROPOSAL.md     # Đề xuất thiết kế 10 module Publisher
├── curriculum/                         # Kho dữ liệu giáo trình 66 bài học
│   ├── schema/lesson-schema.json       # JSON Schema chuẩn hóa cho bài học
│   ├── assets/                         # Tài liệu hướng dẫn thực hành chuyên sâu (.md, .afphoto)
│   │   ├── designer/                   # 10 tài liệu hướng dẫn thực hành Designer D01–D10
│   │   ├── photo/                      # 9 tài liệu thực hành P02–P10 + 1 tệp P01_starter.afphoto
│   │   └── publisher/                  # 1 tài liệu thực hành B01
│   ├── designer/                       # Track 1: Affinity Designer (Modules D01–D10, 30 bài)
│   ├── photo/                          # Track 2: Affinity Photo (Modules P01–P10, 30 bài)
│   ├── publisher/                      # Track 3: Affinity Publisher (Module B01 pilot, 3 bài)
│   └── scripting/                      # Track 4: Affinity Scripting (Module S01 pilot, 3 bài)
├── src/                                # Mã nguồn ứng dụng frontend
│   ├── components/                     # Components phân tầng
│   │   ├── common/                     # 21 components giao diện dùng chung (Mastero Design)
│   │   ├── lesson/                     # Trình chiếu bài học tương tác (SlidePlayer)
│   │   └── simulator/                  # PenNodeSimulator & PhotoLayerSimulator
│   ├── pages/                          # Các trang ứng dụng lớn (Home, Catalog, Viewer, Simulator, Encyclopedia, Resources)
│   ├── data/curriculum/                # Khai báo và kết nối dữ liệu giáo trình
│   ├── types/                          # Ràng buộc kiểu dữ liệu TypeScript
│   └── styles/                         # Tokens CSS toàn cục
├── scripts/                            # Các công cụ tự động hóa kiểm định độc lập
│   ├── validate-curriculum.js          # Harness kiểm tra schema toàn bộ 66 bài học
│   ├── test-curriculum-scripts.js      # Harness kiểm tra cú pháp mã JavaScript bài tập
│   └── check-affinity-env.js           # Chẩn đoán kết nối cổng 6767 MCP
└── tests/                              # Thư mục kiểm thử tự động
    ├── e2e/pen-node-simulator.spec.ts  # Bộ 6 kiểm thử E2E Vector Bézier Simulator
    ├── e2e/photo-curriculum.spec.ts    # Bộ 3 kiểm thử E2E Photo Curriculum & Simulator
    └── screenshots/                    # 10 ảnh chụp visual proof thực tế đã kiểm chứng
```

---

## 🚀 5. Hướng Dẫn Cài Đặt & Kiểm Tra Cho AI Agents (Quick Start)

### 5.1. Khởi chạy Ứng dụng Web
```powershell
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy server phát triển
npm run dev
# Mở trình duyệt tại: http://localhost:5173
```

### 5.2. Chạy Toàn Bộ 5 Bộ Kiểm Định Chất Lượng
```powershell
# 1. Kiểm tra toàn bộ 66 bài học giáo trình (Schema Validation)
npm run validate:curriculum

# 2. Kiểm tra cú pháp script JavaScript DOM
npm run test:scripts

# 3. Kiểm tra kiểu tĩnh TypeScript Strict Mode
npm run typecheck

# 4. Chạy toàn bộ 9 ca kiểm thử tự động Playwright E2E
npm run test:e2e

# 5. Build bundle tối ưu cho Production
npm run build
```

---

## 📊 6. Tình Trạng Quản Trị Hệ Thống (Governance Status)

- **Trạng thái Cổng Kiểm Soát:** **`HALTED AT PHASE GATE` (Gatekeeper BLK-007 ACTIVE)**.
- **Tiến độ Hệ thống:** **32.0%** (16/50 hàng tác vụ hoàn thành có kiểm định QA đầy đủ; tương ứng 15/49 tác vụ gốc = 30.6%).
- **Thống kê Giáo trình (Curriculum Metrics):**
  - **60/120 Bài học Cốt lõi Hoàn thành (50.0%):** Track 1 Designer (30 bài) + Track 2 Photo (30 bài).
  - **6/120 Bài học Pilot Kiểm nghiệm (5.0%):** Track 3 Publisher (3 bài B01) + Track 4 Scripting (3 bài S01).
  - **66/120 Tổng số bài học Hiện hữu (55.0%):** 66 bài học hoàn chỉnh vượt qua xác thực schema 100%.
  - **54/120 Bài học Đang chờ Phê duyệt (45.0%):** B02–B10 (27 bài) và S02–S10 (27 bài).
- **Hạng mục Đã Sẵn Sàng (Production-Ready):** 
  - Track 1: Affinity Designer (`D01`–`D10`, 30 bài học cốt lõi).
  - Track 2: Affinity Photo (`P01`–`P10`, 30 bài học cốt lõi).
  - Track 3 Pilot: Affinity Publisher (`B01`, 3 bài học pilot).
  - Track 4 Pilot: Affinity Scripting (`S01`, 3 bài học pilot).
  - In-Browser Vector Bézier Simulator & Photo Layer Masking Simulator.
  - Encyclopedia (401 SDK topics) & Resource Library (bundled downloads).
- **Hạng mục Tiếp Theo Chờ Duyệt:** Track 3 (Publisher `B02`–`B10`: 27 bài), Track 4 (Scripting `S02`–`S10`: 27 bài), Monaco Code Editor, Live MCP Runner, và Supabase Cloud Backend.
