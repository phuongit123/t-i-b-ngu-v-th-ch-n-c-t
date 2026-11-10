# 🎨 AFFINITY ACADEMY (v4.2.0)
### Interactive Learning Platform & Programmatic Automation for Serif Affinity 3.0 Suite

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](vite.config.ts)
[![TypeScript](https://img.shields.io/badge/typescript-strict%200%20errors-blue.svg)](tsconfig.json)
[![Curriculum Schema](https://img.shields.io/badge/curriculum-39%2F39%20PASSED-success.svg)](scripts/validate-curriculum.js)
[![Playwright E2E](https://img.shields.io/badge/playwright-6%2F6%20PASSED-orange.svg)](tests/e2e/pen-node-simulator.spec.ts)
[![Bundle Reduction](https://img.shields.io/badge/bundle%20size-119.19%20kB%20(-88.03%25)-purple.svg)](dist/assets/)
[![Phase Gate](https://img.shields.io/badge/phase%20gate-HALTED%20(BLK--005)-yellow.svg)](project-control/BLOCKERS.md)

---

## 📖 1. Giới thiệu Dự án (About the Project)

**Affinity Academy** là nền tảng học tập đồ họa tương tác hiện đại kết hợp giảng dạy chuyên sâu bộ công cụ đồ họa chuyên nghiệp **Serif Affinity 3.0 suite** (Affinity Designer, Affinity Photo, Affinity Publisher) với khả năng tự động hóa đồ họa theo hướng lập trình hiện đại thông qua **Affinity JavaScript DOM Scripting API** và giao thức **Affinity Model Context Protocol (MCP)**.

Dự án áp dụng tiêu chuẩn thẩm mỹ thị giác và trải nghiệm tương tác **Mastero & Minimalism** (tham chiếu *traced.life*), với bảng màu trầm Slate/Indigo/Amber và phông chữ kỹ thuật Inter & JetBrains Mono.

---

## 🌟 2. Các Tính Năng Đã Hoàn Thành (Key Features Implemented)

### 2.1. Bộ Mô Phỏng Bézier Pen & Node Tool Sandbox (In-Browser Vector Simulator)
- **Engine SVG thuần túy:** Cài đặt trực tiếp bằng React 19 và TypeScript, không phụ thuộc thư viện đồ họa ngoài cồng kềnh.
- **Công cụ Pen Tool (`P`):** Cắm điểm neo, kéo tay đòn tiếp tuyến, đóng kín path.
- **Công cụ Node Tool (`A`):** Tinh chỉnh điểm neo, chuyển đổi 3 trạng thái node: **Sharp** (Góc nhọn), **Smooth** (180° thẳng hàng), **Smart** (Tự tính tiếp tuyến Catmull-Rom).
- **Phím Alt Bẻ Góc (Cusp Handle):** Bẻ góc tay đòn độc lập để tạo các góc lượn tự do.
- **Chấm Điểm Tự Động (Evaluation Scorer):** Lấy mẫu 15 điểm/segment trên đường cong Bézier bậc ba, tính khoảng cách Euclidean tối thiểu tới đường cong mẫu (ghost outline) để cho điểm chính xác 0–100% kèm phản hồi tiếng Việt trực quan.
- **Bài tập Mẫu Thực hành:** D02 Sharp Diamond, D03 S-Wave Curve, D03 Heart Silhouette.

### 2.2. Trình Diễn Bài Học Tương Tác Dạng Slide (SlidePlayer Engine)
- **39 Bài học hoàn chỉnh** (30 bài Track 1 Affinity Designer + 9 bài Pilot Photo, Publisher, Scripting).
- **299 Slides bài học tương tác** với hoạt họa chuyển slide, phím mũi tên điều hướng, thanh tiến trình thời gian thực.
- **117 Câu hỏi trắc nghiệm** có giải thích cặn kẽ và phương án nhiễu sư phạm.
- **10 Bản thiết kế capstone sản xuất** (`GUIDE_DOCUMENT`) hướng dẫn quy trình in ấn PDF/X-4 và xuất đa mật độ 1x/2x/3x WebP/SVG.

### 2.3. Trích Xuất & Benchmark Năng Lực Affinity 3.0 DOM & MCP
- **11 Upstream MCP Tools** được kiểm chứng và đo lường trực tiếp qua endpoint port 6767.
- **401 Chủ đề tài liệu SDK** được phân tích tại [`AFFINITY_DOM_API_REFERENCE.md`](AFFINITY_DOM_API_REFERENCE.md).
- **Độ trễ Rendering Ấn tượng:** `render_spread` (180ms) và `render_selection` (140ms) benchmarked tại [`docs/MCP_RENDERING_BENCHMARK.md`](docs/MCP_RENDERING_BENCHMARK.md).

### 2.4. Tối Ưu Hóa Bundling Tuyệt Đối (Zero Vite Chunk Warnings)
- Phân chia `manualChunks` tách rời vendor và các module giáo trình, giúp file chính `index.js` giảm **88.03%** (từ 994.96 kB xuống **119.19 kB**).

---

## 📸 3. Kho Ảnh Minh Chứng Kiểm Thử (Visual Verification Evidence)

Tất cả 7 tệp ảnh visual snapshot được lưu trữ vật lý thực tế tại thư mục `tests/screenshots/`:

| Tên Ảnh Visual Proof | Viewport / Độ phân giải | Nội dung Xác thực | Tệp Tin Vật Lý |
|:---|:---:|:---|:---:|
| **Initial Simulator State** | Desktop (1440 × 900) | Giao diện khởi tạo, banner cảnh báo, dot grid, ghost outline kim cương | [`tests/screenshots/simulator-initial-state.png`](tests/screenshots/simulator-initial-state.png) |
| **Canvas Drawing Active** | Desktop (1440 × 900) | Đặt 4 điểm neo Pen Tool theo tọa độ mẫu | [`tests/screenshots/simulator-canvas-active.png`](tests/screenshots/simulator-canvas-active.png) |
| **Evaluated Bézier Path** | Desktop (1440 × 900) | Đóng path kín và hiện thẻ chấm điểm độ chính xác (88%) | [`tests/screenshots/simulator-diamond-evaluated.png`](tests/screenshots/simulator-diamond-evaluated.png) |
| **Node Tool Smooth Handle** | Desktop (1440 × 900) | Node Tool kích hoạt với tay đòn uốn mượt 180° | [`tests/screenshots/simulator-node-tool-smooth.png`](tests/screenshots/simulator-node-tool-smooth.png) |
| **Heart Exercise Guides** | Desktop (1440 × 900) | Bài tập nâng cao D03 Heart Silhouette với các đường gióng | [`tests/screenshots/simulator-heart-exercise.png`](tests/screenshots/simulator-heart-exercise.png) |
| **Tablet Viewport (768px)** | Tablet (768 × 1024) | Giao diện co giãn chuẩn responsive trên iPad | [`tests/screenshots/simulator-tablet-768.png`](tests/screenshots/simulator-tablet-768.png) |
| **Mobile Viewport (375px)** | Mobile (375 × 667) | Bố cục dạng cột thân thiện trên iPhone | [`tests/screenshots/simulator-mobile-375.png`](tests/screenshots/simulator-mobile-375.png) |

---

## 📂 4. Bản Đồ Cấu Trúc Dự Án (Repository Map)

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
├── PROJECT_MASTER_ANALYSIS.md          # Báo cáo phân tích chuyên sâu toàn bộ dự án v4.2.0
├── AFFINITY_DOM_API_REFERENCE.md       # Trích xuất 401 SDK topics của Affinity 3.0 DOM
├── AFFINITY_DOM_API_REFERENCE.json     # Dữ liệu có cấu trúc JSON của DOM API
├── AFFINITY_MCP_CAPABILITY_REPORT.md   # Báo cáo năng lực 11 công cụ Affinity MCP
├── project-control/                    # Hệ thống 20 file quản trị dự án nghiêm ngặt
│   ├── MASTER_SPEC.md                  # Đặc tả kỹ thuật tổng thể
│   ├── REQUIREMENTS.md                 # 49 yêu cầu kỹ thuật (REQ-SYS, REQ-MCP, REQ-CURR, v.v.)
│   ├── TASK_REGISTRY.md                # 50 hàng tác vụ (TASK-001 đến TASK-078)
│   ├── ROADMAP.md                      # Lộ trình phát triển 6 giai đoạn
│   ├── ACCEPTANCE_CRITERIA.md          # Tiêu chí nghiệm thu chi tiết
│   ├── DECISIONS.md                    # 20 quyết định kiến trúc (ADR-001 đến ADR-020)
│   ├── BLOCKERS.md                     # Quản lý điểm chặn (BLK-005 Phase Gate ACTIVE)
│   ├── PROGRESS.md                     # Theo dõi tiến độ hoàn thành thực tế (24.5%)
│   ├── HANDOFF.md                      # Cẩm nang bàn giao phiên làm việc
│   └── REMEDIATION_REPORT_v4.2.0.md    # Báo cáo nghiệm thu khắc phục kiểm toán v4.2.0
├── curriculum/                         # Kho dữ liệu giáo trình 39 bài học
│   ├── schema/lesson-schema.json       # JSON Schema chuẩn hóa cho bài học
│   ├── assets/designer/                # 10 tài liệu hướng dẫn sản xuất capstone D01–D10
│   ├── designer/                       # Track 1: Affinity Designer (Modules D01–D10, 30 bài)
│   ├── photo/                          # Track 2 Pilot: Module P01 (3 bài học)
│   ├── publisher/                      # Track 3 Pilot: Module B01 (3 bài học)
│   └── scripting/                      # Track 4 Pilot: Module S01 (3 bài học)
├── src/                                # Mã nguồn ứng dụng frontend
│   ├── components/                     # Components phân tầng
│   │   ├── common/                     # 21 components giao diện dùng chung (Mastero Design)
│   │   ├── lesson/                     # Trình chiếu bài học tương tác (SlidePlayer)
│   │   └── simulator/                  # Bézier Simulator Engine (Pen, Node, Math, Exercises)
│   ├── pages/                          # Các trang ứng dụng lớn (Home, Catalog, Viewer, Simulator)
│   ├── types/                          # Ràng buộc kiểu dữ liệu TypeScript
│   └── styles/                         # Tokens CSS toàn cục
├── scripts/                            # Các công cụ tự động hóa kiểm định độc lập
│   ├── validate-curriculum.js          # Harness kiểm tra schema toàn bộ 39 bài học
│   ├── test-curriculum-scripts.js      # Harness kiểm tra cú pháp mã JavaScript bài tập
│   └── check-affinity-env.js           # Chẩn đoán kết nối cổng 6767 MCP
└── tests/                              # Thư mục kiểm thử tự động
    ├── e2e/pen-node-simulator.spec.ts  # Bộ 6 kiểm thử E2E Playwright
    └── screenshots/                    # 7 ảnh chụp visual proof thực tế đã kiểm chứng
```

---

## 🚀 5. Hướng Dẫn Cài Đặt & Chạy Thử (Quick Start)

### 5.1. Yêu cầu Môi trường
- **Node.js:** `>= v20.0.0` (Khuyến nghị `v26.12.0`).
- **NPM:** `>= 10.0.0`.
- **Trình duyệt:** Microsoft Edge hoặc Google Chrome (dành cho Playwright E2E).

### 5.2. Khởi chạy Ứng dụng
```powershell
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển cục bộ
npm run dev
# Mở trình duyệt tại: http://localhost:5173
```

### 5.3. Chạy Toàn Bộ Kiểm Thử & Kiểm Định Tự Động
```powershell
# 1. Kiểm tra tính toàn vẹn của 39 bài học giáo trình (Schema Validation)
npm run validate:curriculum

# 2. Kiểm tra cú pháp các script mẫu V8 JavaScript
npm run test:scripts

# 3. Kiểm tra kiểu tĩnh TypeScript (Strict Typecheck)
npm run typecheck

# 4. Chạy bộ kiểm thử E2E Playwright & tạo ảnh screenshot
npm run test:e2e

# 5. Build bundle tối ưu cho Production
npm run build
```

---

## 📊 6. Tóm Tắt Tình Trạng Hiện Tại (Status at a Glance)

- **Trạng thái Cổng Kiểm Soát:** **`HALTED AT PHASE GATE` (Gatekeeper BLK-005 ACTIVE)**
- **Tiến độ Hệ thống:** **26.0%** (13/50 hàng tác vụ hoàn thành có kiểm định QA đầy đủ; tương ứng 12/49 tác vụ gốc = 24.5%).
- **Hạng mục Đã Sẵn Sàng (Ready):** Track 1 (Affinity Designer D01–D10) + Bézier Simulator Sandbox MVP.
- **Hạng mục Đang Chờ Phê Duyệt:** Track 2 (Photo P02–P10), Track 3 (Publisher B02–B10), Track 4 (Scripting S02–S10), Monaco Code Editor, Live MCP Runner, và Supabase Cloud Backend.

Xem phân tích đầy đủ và chi tiết tại: 📄 **[`PROJECT_MASTER_ANALYSIS.md`](PROJECT_MASTER_ANALYSIS.md)**.
