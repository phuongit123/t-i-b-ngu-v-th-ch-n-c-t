# AFFINITY ACADEMY — TOÀN BỘ PHÂN TÍCH CHI TIẾT DỰ ÁN
## (MASTER PROJECT AUDIT, GAP ANALYSIS & STRATEGIC ROADMAP)

> **Mã tài liệu:** `DOC-ANALYSIS-MASTER-v4.2.0`  
> **Phiên bản hệ thống:** `v4.2.0` (Post-Audit Remediation Certified)  
> **Workspace:** `C:\affinity học`  
> **Ngày lập:** 2026-11-10  
> **Cơ quan kiểm toán & Thiết kế:** Senior Software Architect & Lead Multi-Agent Orchestrator  
> **Mục đích:** Báo cáo độc lập, toàn diện, chi tiết từng hạng mục: **Những gì đã hoàn thành**, **Những gì còn thiếu**, và **Những gì cần cải thiện**. Cung cấp cẩm nang hoàn chỉnh cho các AI Agent khác và nhà phát triển kế thừa.

---

## 1. TỔNG QUAN DỰ ÁN & TRIẾT LÝ THIẾT KẾ (EXECUTIVE OVERVIEW)

### 1.1. Mục tiêu Cốt lõi
**AFFINITY ACADEMY** là nền tảng học tập tương tác hiện đại và chương trình đào tạo chuyên sâu về bộ ứng dụng **Serif Affinity 3.0 suite** (Affinity Designer, Affinity Photo, Affinity Publisher), kết hợp độc nhất với tự động hóa đồ họa lập trình thông qua **Affinity JavaScript DOM Scripting API** và giao thức **Affinity Model Context Protocol (MCP)**.

### 1.2. Triết lý Thiết kế & Vận hành (Guiding Principles)
1. **Mastero & Minimalism:** Giao diện tối giản, sang trọng, tập trung vào nội dung học thuật, tối ưu hóa không gian hiển thị, lấy cảm hứng từ chuẩn mực tương tác cao cấp (tham chiếu *traced.life*).
2. **Truth in Documentation & Zero Hallucination:** Không tuyên bố một tính năng hoạt động nếu chưa có bằng chứng kiểm thử thực tế. Mọi API, phím tắt, menu phải được đối chiếu từ ứng dụng thật hoặc tài liệu chính thức của Serif.
3. **Phân tách Trách nhiệm (Multi-Agent Separation of Concerns):** Dự án được vận hành bởi hệ thống đa tác tử chuyên biệt hóa: `Orchestrator`, `CurriculumAgent`, `DesignAgent`, `FrontendAgent`, `BackendAgent`, `AffinityMCPAgent`, và độc lập thẩm định bởi `QAAgent`.
4. **Kỷ luật Cổng Kiểm soát (Strict Phase Gate Discipline):** Không tiến hành xây dựng các giai đoạn tiếp theo nếu chưa có lệnh nghiệm thu bằng văn bản từ Product Owner.

### 1.3. Bảng Thông số Kỹ thuật Hệ thống (Tech Stack Matrix)

| Phân hệ / Công nghệ | Phiên bản / Cấu hình | Mục đích sử dụng trong Dự án | Trạng thái Thực tế |
|:---|:---|:---|:---:|
| **Core UI Framework** | React 19 (`^19.0.0`), React DOM | Nền tảng xây dựng component giao diện, rendering SVG canvas | **ĐÃ HOÀN THÀNH** |
| **Language & Typing** | TypeScript Strict (`^5.8.2`) | Ràng buộc kiểu dữ liệu tĩnh 100%, 0 lỗi typecheck | **ĐÃ HOÀN THÀNH** |
| **Bundler & Build Tool** | Vite 5/6 (`^6.2.0`), Rollup WASM | Bundling siêu tốc, HMR, code-splitting `manualChunks` | **ĐÃ HOÀN THÀNH** |
| **Styling & Tokens** | Tailwind CSS (`^3.4.17`), PostCSS | Hệ thống Design System tokens: Deep Slate, Electric Indigo, Warm Amber | **ĐÃ HOÀN THÀNH** |
| **Icons Library** | Lucide React (`^1.16.0`) | Icon vector sắc nét, đồng bộ cho toàn bộ công cụ và Persona | **ĐÃ HOÀN THÀNH** |
| **End-to-End Testing** | Playwright Test (`^1.51.0`) | Kiểm thử tự động E2E, chạy headless trên kênh Microsoft Edge | **ĐÃ HOÀN THÀNH** |
| **Runtime Environment** | Node.js v26.12.0 (ESM) | Môi trường chạy script kiểm định, harness cú pháp, build | **ĐÃ HOÀN THÀNH** |
| **Cloud Backend & DB** | Supabase JS Client (`^2.49.1`) | Cơ sở dữ liệu PostgreSQL, Auth, Row Level Security, Storage | **ĐANG QUY HOẠCH** |
| **Deployment Target** | Netlify Edge Hosting | Nền tảng hosting SPA, Edge Functions, CI/CD tự động | **ĐANG QUY HOẠCH** |
| **Affinity MCP Bridge** | Port `6767` (HTTP/SSE Listener) | Cầu nối điều khiển trực tiếp Affinity 3.0 DOM, render ảnh canvas | **ĐÃ KIỂM CHỨNG** |

---

## 2. NHỮNG THỨ ĐÃ HOÀN THÀNH (COMPLETED INVENTORY)

Dự án hiện đã hoàn tất xuất sắc **Phase 1, Phase 2, một phần Phase 3 (Track 1 Designer + 3 Pilot tracks), Phase 4 MVP (Bézier Simulator + Code-splitting), và toàn bộ Đợt Khắc phục Kiểm toán v4.2.0**. Dưới đây là chi tiết từng sản phẩm bàn giao thực tế:

### 2.1. Phân hệ Quản trị & Điều phối Tác tử (Project Control & Governance)
- **14 tệp quản trị dự án** tại [`project-control/`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/):
  - [`MASTER_SPEC.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/MASTER_SPEC.md): Đặc tả kiến trúc tổng thể toàn dự án (40 modules, 120 bài học, 8 trang lớn).
  - [`REQUIREMENTS.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/REQUIREMENTS.md): 49 yêu cầu kỹ thuật phân rã chi tiết từ `REQ-SYS-001` đến `REQ-OPS-003`.
  - [`TASK_REGISTRY.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/TASK_REGISTRY.md): Sổ đăng ký 50 hàng tác vụ (49 tác vụ gốc + `TASK-010-REAUDIT`).
  - [`ROADMAP.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/ROADMAP.md): Lộ trình 6 giai đoạn phát triển từ hạ tầng đến phát hành công khai.
  - [`ACCEPTANCE_CRITERIA.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/ACCEPTANCE_CRITERIA.md): Tiêu chí nghiệm thu định lượng cho từng tác vụ.
  - [`DECISIONS.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/DECISIONS.md): 20 quyết định kiến trúc (`ADR-001` đến `ADR-020`) được ghi nhận chi tiết.
  - [`BLOCKERS.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/BLOCKERS.md): Nhật ký điểm nghẽn; duy trì cổng kiểm soát `BLK-005` ở trạng thái ACTIVE.
  - [`PROGRESS.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/PROGRESS.md): Tiến độ thực tế 24.5% (12/49 tác vụ hoàn tất có kiểm định QA).
  - [`HANDOFF.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/HANDOFF.md): Cẩm nang bàn giao phiên làm việc, hướng dẫn lệnh và stop condition.
  - Các báo cáo nghiệm thu QA độc lập: `QA_PHASE1_SIGNOFF.md`, `QA_PHASE2_SIGNOFF.md`, `QA_PHASE3_PILOT_SIGNOFF.md`, `QA_TRACK1_DESIGNER_SIGNOFF.md`, `PHASE_4_MVP_SIGNOFF.md`.
  - [`REMEDIATION_REPORT_v4.2.0.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/REMEDIATION_REPORT_v4.2.0.md): Báo cáo nghiệm thu hoàn tất khắc phục 5 khuyết tật kiểm toán.

### 2.2. Trích xuất Năng lực Affinity 3.0 & MCP (Phase 1)
- **11 Công cụ Affinity MCP** được kết nối và benchmark trực tiếp qua endpoint `http://localhost:6767/sse`.
- **401 chủ đề tài liệu SDK** được trích xuất hoàn chỉnh vào:
  - [`AFFINITY_DOM_API_REFERENCE.json`](file:///c:/affinity%20h%E1%BB%8Dc/AFFINITY_DOM_API_REFERENCE.json) & [`AFFINITY_DOM_API_REFERENCE.md`](file:///c:/affinity%20h%E1%BB%8Dc/AFFINITY_DOM_API_REFERENCE.md).
  - Phân loại rõ ràng: APIs đã kiểm chứng (Document, Layers, Selection, Export), APIs có tài liệu nhưng cần test thêm, và APIs chưa hỗ trợ trong sandbox.
- **Báo cáo Năng lực Toàn diện:** [`AFFINITY_MCP_CAPABILITY_REPORT.md`](file:///c:/affinity%20h%E1%BB%8Dc/AFFINITY_MCP_CAPABILITY_REPORT.md).
- **Benchmark Rendering:** [`docs/MCP_RENDERING_BENCHMARK.md`](file:///c:/affinity%20h%E1%BB%8Dc/docs/MCP_RENDERING_BENCHMARK.md) ghi nhận độ trễ xuất sắc: `render_spread` đạt 180ms, `render_selection` đạt 140ms.
- **Harness Kiểm tra Cú pháp Scripts:** [`scripts/test-curriculum-scripts.js`](file:///c:/affinity%20h%E1%BB%8Dc/scripts/test-curriculum-scripts.js) kiểm tra tự động cú pháp Node V8 cho 3 script thực hành (`S01_hello_affinity.js`, `S01_ping_mcp.js`, `S01_inspect_doc.js`) — 3/3 PASS.

### 2.3. Design System & Nền tảng Giao diện "Mastero" (Phase 2)
- **Hệ thống Token Màu sắc & Phông chữ:**
  - Token CSS: Nền tối Deep Slate (`slate-900`/`950`), điểm nhấn Electric Indigo (`indigo-500`/`600`), cảnh báo Warm Amber (`amber-500`).
  - Phông chữ chuẩn: `Inter` (Typography hiển thị giao diện) và `JetBrains Mono` (Code editor, phím tắt, thông số DPI/bleed).
- **Bộ 21 Component Tái sử dụng** tại [`src/components/common/`](file:///c:/affinity%20h%E1%BB%8Dc/src/components/common/):
  - `Button`, `Card`, `Badge`, `Modal`, `Navbar`, `Breadcrumbs`, `StatCard`, `Tabs`, `Tooltip`, `Callout`, `Progress`, `Skeleton`, v.v.
- **Tài liệu Hướng dẫn Thiết kế:** [`docs/DESIGN_SYSTEM.md`](file:///c:/affinity%20h%E1%BB%8Dc/docs/DESIGN_SYSTEM.md).
- **Trang Xem trước Token Tương tác:** [`src/pages/DesignSystemPreview.tsx`](file:///c:/affinity%20h%E1%BB%8Dc/src/pages/DesignSystemPreview.tsx).

### 2.4. Chương trình Học & Trình Chiếu Bài Học Tương tác (Phase 3)
- **JSON Schema Giáo trình Chuẩn hóa:** [`curriculum/schema/lesson-schema.json`](file:///c:/affinity%20h%E1%BB%8Dc/curriculum/schema/lesson-schema.json) ràng buộc chặt chẽ mô hình bài học 10 phần (`learningObjectives`, `foundationalKnowledge`, `stepByStepInstructions`, `guidedPractice`, `quiz`, `slides`, v.v.).
- **Script Kiểm định Tự động:** [`scripts/validate-curriculum.js`](file:///c:/affinity%20h%E1%BB%8Dc/scripts/validate-curriculum.js) xác thực tính hợp lệ của toàn bộ 39 bài học trên đĩa — **100% PASS (0 lỗi)**.
- **Số lượng Nội dung Đã Xây Dựng trên Đĩa:**
  - **39 Bài học hoàn chỉnh** (30 bài Track 1 + 9 bài Pilot).
  - **299 Slides bài học tương tác** (236 slides Track 1 Designer + 63 slides Pilot).
  - **117 Câu hỏi trắc nghiệm** có giải thích sư phạm chi tiết và 4 phương án lựa chọn.
  - **10 Hướng dẫn Dự án Sản xuất Capstone** (`GUIDE_DOCUMENT`) trong `curriculum/assets/designer/`.
- **Trình Diễn Bài Học Dạng Slide (SlidePlayer):** [`src/components/lesson/SlidePlayer.tsx`](file:///c:/affinity%20h%E1%BB%8Dc/src/components/lesson/SlidePlayer.tsx) hỗ trợ chuyển slide mượt mà, phím mũi tên điều hướng, thanh tiến trình, hiển thị quiz tương tác và phản hồi tức thì.
- **Trình Xem Chi tiết Bài học:** [`src/pages/LessonViewerPage.tsx`](file:///c:/affinity%20h%E1%BB%8Dc/src/pages/LessonViewerPage.tsx).
- **Trang Danh mục Khóa học:** [`src/pages/CatalogPage.tsx`](file:///c:/affinity%20h%E1%BB%8Dc/src/pages/CatalogPage.tsx) tích hợp bộ lọc theo Track, Persona, cấp độ khó.
- **Trang Chủ (Landing Page):** [`src/pages/HomePage.tsx`](file:///c:/affinity%20h%E1%BB%8Dc/src/pages/HomePage.tsx) thiết kế theo phong cách tối giản Mastero.

### 2.5. Trình Mô Phỏng Bézier Pen & Node Tool Sandbox MVP (Phase 4 MVP)
- **Engine Mô phỏng Bézier SVG thuần túy:** [`src/components/simulator/PenNodeSimulator.tsx`](file:///c:/affinity%20h%E1%BB%8Dc/src/components/simulator/PenNodeSimulator.tsx).
  - Hỗ trợ công cụ Pen Tool (`P`) để cắm điểm neo và kéo tay đòn Bézier.
  - Hỗ trợ công cụ Node Tool (`A`) để chọn và di chuyển điểm neo, tinh chỉnh tay đòn.
  - Hỗ trợ 3 chế độ node chuẩn Affinity: **Sharp** (Góc nhọn), **Smooth** (Uốn mềm thẳng hàng 180°), **Smart** (Tự tính tiếp tuyến Catmull-Rom).
  - Phím tắt `Alt` để bẻ góc tay đòn độc lập (Cusp handle).
  - Đầy đủ tính năng Hoàn tác (`Ctrl+Z`), Làm lại (`Ctrl+Y`), Vẽ lại từ đầu (Reset), Lưới snap tọa độ.
- **Mô hình Toán học Hình học Bézier:** [`src/components/simulator/bezier-math.ts`](file:///c:/affinity%20h%E1%BB%8Dc/src/components/simulator/bezier-math.ts).
  - Thuật toán nội suy đường cong bậc ba `sampleCubicBezier`.
  - Thuật toán chấm điểm độ chính xác `evaluateCurveAccuracy`: lấy mẫu 15 điểm/segment, tính khoảng cách Euclidean tối thiểu trung bình tới đường cong mẫu (ghost path), sinh điểm số 0–100% kèm phản hồi tiếng Việt trực quan.
- **Hệ thống Bài tập Mẫu Thực hành:** [`src/components/simulator/exercises.ts`](file:///c:/affinity%20h%E1%BB%8Dc/src/components/simulator/exercises.ts) gồm D02 Khung kim cương (Sharp), D03 Sóng lượn S-Wave (Smooth), và D03 Trái tim Silhouette (Cusp + Smooth).
- **Banner Cảnh báo Bắt buộc:** Cảnh báo rõ ràng đây là bản mô phỏng cơ chế Bézier trong trình duyệt phục vụ học tập, không thay thế ứng dụng Affinity thật.
- **Trang Mô phỏng Độc lập:** [`src/pages/SimulatorPage.tsx`](file:///c:/affinity%20h%E1%BB%8Dc/src/pages/SimulatorPage.tsx).

### 2.6. Tối Ưu Hóa Bundling & Hiệu Năng Build
- Cấu hình phân mảnh `manualChunks` trong [`vite.config.ts`](file:///c:/affinity%20h%E1%BB%8Dc/vite.config.ts):
  - Phân tách riêng `curriculum-designer-foundations`, `curriculum-designer-advanced`, `curriculum-photo`, `curriculum-publisher`, `curriculum-scripting`, `vendor-react`, `vendor-lucide`.
- **Kết quả Tối ưu hóa Thực tế:**
  - File chính `dist/assets/index.js` giảm từ **994.96 kB xuống còn 119.19 kB** (mức giảm đạt **88.03%**).
  - Chunk lớn nhất chỉ đạt **257.20 kB** (hoàn toàn triệt tiêu cảnh báo `> 500 kB` của Vite).
  - Thời gian build production: ~**6.37 giây**.

### 2.7. Bộ Kiểm Thử E2E & Bằng Chứng Hình Ảnh Thực Tế
- **Test Suite Playwright:** [`tests/e2e/pen-node-simulator.spec.ts`](file:///c:/affinity%20h%E1%BB%8Dc/tests/e2e/pen-node-simulator.spec.ts) gồm **6 bài test tự động** vượt qua 100% trong 13.9 giây trên Microsoft Edge.
- **7 Tệp ảnh Visual Screenshot Thực tế** lưu trữ tại [`tests/screenshots/`](file:///c:/affinity%20h%E1%BB%8Dc/tests/screenshots/):
  1. `simulator-initial-state.png` (84.7 kB, 1440×900)
  2. `simulator-canvas-active.png` (83.8 kB, 1440×900)
  3. `simulator-diamond-evaluated.png` (81.8 kB, 1440×900)
  4. `simulator-node-tool-smooth.png` (88.8 kB, 1440×900)
  5. `simulator-heart-exercise.png` (117.7 kB, 1440×900)
  6. `simulator-tablet-768.png` (85.7 kB, 768×1024)
  7. `simulator-mobile-375.png` (65.3 kB, 375×667)

---

## 3. NHỮNG THỨ CÒN THIẾU (MISSING & INCOMPLETE INVENTORY)

Dưới đây là danh mục chi tiết toàn bộ các hạng mục **chưa được xây dựng** trong dự án tính đến phiên bản v4.2.0, hiện đang nằm sau cổng kiểm soát `BLK-005` chờ phê duyệt:

### 3.1. Giáo trình 3 Tracks Còn lại (Thiếu 27 Modules = 81 Bài Học)
Hiện tại dự án mới chỉ hoàn tất Track 1 (Designer D01–D10) và bài Pilot đầu tiên của 3 Track còn lại (P01, B01, S01). Cần phải sản xuất:

1. **Track 2 — Affinity Photo Mastery (Thiếu 9 Modules: P02 đến P10 = 27 bài học):**
   - `P02`: Selections, Quick Mask, Refine Edge & Hair Extraction.
   - `P03`: Adjustment Layers, Curves, 32-bit HDR & Non-Destructive Filters.
   - `P04`: Frequency Separation, Dodge & Burn, High-End Portrait Retouching.
   - `P05`: Inpainting, Clone Stamp, Healing Brush & Content-Aware Cleanup.
   - `P06`: Focus Stacking, Panorama Stitching & Astrophotography Stacking.
   - `P07`: Live Filter Layers, Lighting Effects & Depth of Field Simulations.
   - `P08`: Liquify Persona, Mesh Warping & Organic Distortion.
   - `P09`: Tone Mapping Persona, Local Contrast & Creative Grading.
   - `P10`: Batch Processing, Macro Recording & Commercial Output (WebP/TIFF).
2. **Track 3 — Affinity Publisher Mastery (Thiếu 9 Modules: B02 đến B10 = 27 bài học):**
   - `B02`: Multi-Page Architecture, Facing Pages & Master Page Hierarchies.
   - `B03`: Frame Text, Artistic Text, Path Text & Advanced Typography.
   - `B04`: Baseline Grids, Flow Controls, Orphan/Widow Prevention & Text Wrap.
   - `B05`: Paragraph & Character Style Catalogs, Nested Styles & GREP.
   - `B06`: Picture Frames, Smart Scaling, Image Placement & Resource Manager.
   - `B07`: Tables Studio, Tab Stops, Formulas & Structured Data Display.
   - `B08`: StudioLink Technology (Truy cập trực tiếp Designer & Photo Personas trong Publisher).
   - `B09`: Data Merge, CSV Dynamic Generation, Book Panels, Index & Table of Contents (TOC).
   - `B10`: Preflight Studio, PDF/X-1a/3/4 Standards, Color Trapping & Commercial Print Packages.
3. **Track 4 — Affinity Scripting & MCP Automation (Thiếu 9 Modules: S02 đến S10 = 27 bài học):**
   - `S02`: DOM Document Object Model, Pages, Spreads & Artboards API.
   - `S03`: Vector Procedural Generation: Curves, Shapes, Boolean scripts via V8.
   - `S04`: Layer Traversals, Hierarchy Manipulation, Renaming & Tagging Scripts.
   - `S05`: Color, Swatches, Palette Generator & Dynamic Styling API.
   - `S06`: Typography & Automated Text Formatting Scripts.
   - `S07`: Raster Pixel Manipulation & Buffer Processing via JavaScript.
   - `S08`: Batch Asset Exporter & Dynamic Multi-Density Asset Pipelines.
   - `S09`: MCP Protocol Server Architecture (SSE/HTTP Listener, Port 6767, Tool Calling).
   - `S10`: Capstone: Building a Production-Ready Affinity MCP Agent Plugin.

### 3.2. Trình Lập Trình Mã Nguồn Tương Tác (Interactive IDE & Script Runner)
- **Monaco Code Editor (`TASK-023` / `REQ-FE-006`):**
  - Chưa cài đặt package `monaco-editor` hoặc `@monaco-editor/react`. Đã chủ động hoãn theo quyết định kiến trúc `ADR-020` để bảo toàn dung lượng bundle.
  - Cần: Cài đặt với cấu hình dynamic lazy loading, Monaco Web Worker riêng để không làm đơ giao diện chính.
- **Trình Chạy Mã JavaScript Live trong Trình Duyệt (`TASK-024`):**
  - Chưa xây dựng sandboxed runner (Web Worker / iframe) để thực thi thử các script Affinity JS DOM độc lập.
- **Cầu nối MCP Server Trực Tiếp trên Giao diện Web (`TASK-025` / `REQ-FE-007`):**
  - Chưa xây dựng WebSocket/SSE client trên giao diện để kết nối trực tiếp với MCP bridge localhost:6767.
  - Chưa có bộ xem trước ảnh render (`Visual Spread Viewer`) trực tiếp trên web app.
- **Trang Playground Lập trình Hoàn chỉnh (`TASK-076` / `REQ-PAGE-006`):**
  - Mới chỉ là trang khung sơ khởi (`src/pages/PlaygroundPage.tsx`), chưa có component editor thật.

### 3.3. Bách Khoa Toàn Thư Công Cụ & Thư Viện Tài Nguyên (Encyclopedia & Resources)
- **Ma trận Công cụ Tương tác (`TASK-028` / `REQ-FE-008`):**
  - Chưa xây dựng bảng so sánh đa chiều giữa các công cụ tương đương của Designer vs Photo vs Publisher (ví dụ: Pen Tool vs Selection Brush; Vector Crop vs Raster Crop).
- **Hệ thống Tìm kiếm Phím tắt Toàn cục & Modal Tra cứu (`TASK-029` / `REQ-FE-009`):**
  - Chưa có thanh tìm kiếm nhanh dạng `Ctrl+K` để tra cứu phím tắt, thao tác và API method.
- **Kho Tệp Tài Nguyên Mẫu Thật (`TASK-030` / `REQ-CURR-008`):**
  - Hiện tại hầu hết các bài học dùng tệp tài liệu hướng dẫn `.md`. Mới chỉ có 1 tệp nhị phân thật là `P01_starter.afphoto` (1.6 MB).
  - Cần bổ sung các gói tệp `.afdesign`, `.afphoto`, `.afpub` capstone chất lượng cao để học viên tải về thực hành.
- **Trang Tra cứu Công cụ Hoàn chỉnh (`TASK-075` / `REQ-PAGE-005`):**
  - Mới chỉ là giao diện khung, chưa gắn kho dữ liệu đầy đủ.

### 3.4. Hệ Thống Backend, Dữ Liệu Học Viên & Xác Thực (Supabase Cloud Backend)
- **Supabase Database Schema & Migrations (`TASK-040` / `REQ-BE-001`):**
  - Chưa chạy migration tạo bảng trên PostgreSQL: `users`, `profiles`, `courses`, `modules`, `lessons`, `progress`, `submissions`, `bookmarks`.
- **Hệ thống Đăng nhập & Phân quyền RBAC (`TASK-041` / `REQ-BE-002`):**
  - Chưa cấu hình Supabase Auth (Email OTP / Magic Link, Google OAuth, GitHub OAuth).
  - Chưa viết Row Level Security (RLS) policies để bảo vệ quyền riêng tư dữ liệu học viên.
- **API Theo dõi Tiến độ & Nộp bài tập (`TASK-042` / `REQ-BE-003`):**
  - Hiện tại tiến độ slide đang lưu tạm ở client `localStorage`. Chưa có đồng bộ hai chiều lên Cloud.
- **Storage Buckets & Chính sách Tải tệp (`TASK-043` / `REQ-BE-004`):**
  - Chưa tạo storage buckets cho các tệp bài tập nộp và assets tải về.
- **Trang Dashboard Học viên (`TASK-077` / `REQ-PAGE-007`):**
  - Giao diện thống kê tiến độ học, chuỗi ngày học tập (streak), chứng chỉ hoàn thành khóa học chưa được kết nối backend.

### 3.5. Triển Khai Hosting & Tự Động Hóa Vận Hành (DevOps & CI/CD)
- **Cấu hình Triển khai Netlify (`TASK-061` / `REQ-OPS-002`):**
  - Chưa tạo tệp `netlify.toml` chứa cấu hình build, rewrite URL cho SPA (`/* /index.html 200`), cache headers cho static assets.
- **Quy trình Kiểm thử Tự động CI/CD (GitHub Actions):**
  - Chưa có workflow YAML tự động chạy `lint`, `typecheck`, `validate-curriculum`, `test:scripts` và `test:e2e` mỗi khi có Pull Request.

---

## 4. NHỮNG THỨ CẦN CẢI THIỆN (AREAS FOR IMPROVEMENT & ENHANCEMENT)

Dưới đây là các khuyến nghị chuyên môn sâu nhằm nâng tầm nền tảng từ bản MVP chất lượng cao lên một sản phẩm thương mại hoàn hảo:

### 4.1. Cải Thiện Bộ Mô Phỏng Bézier Simulator
1. **Hỗ trợ Thao tác Cảm ứng Mobile/Tablet (Touch Gestures):**
   - *Hiện trạng:* Bộ simulator hiện bắt các sự kiện chuột `onMouseDown`, `onMouseMove`, `onMouseUp` trên phần tử SVG. Trên mobile/tablet, người dùng chạm màn hình có thể bị cuộn trang ngoài ý muốn.
   - *Cải thiện:* Bổ sung CSS `touch-action: none` trên canvas SVG; cài đặt các touch event listener (`onTouchStart`, `onTouchMove`, `onTouchEnd`) với xử lý tính toán tọa độ tương thích; phóng to hit-box của điểm neo từ 6px lên 12px trên màn hình cảm ứng để dễ ngón tay chạm vào.
2. **Bổ sung các Công cụ Vector Mô phỏng Mở rộng:**
   - *Corner Tool (`C`):* Cho phép chọn node góc nhọn và bo tròn góc với bán kính tương tác trực tiếp.
   - *Contour Tool:* Mở rộng hoặc thu hẹp đường viền viền ngoài của vector polygon.
   - *Boolean Operators Sandbox:* Thao tác tương tác trực quan 2 hình khối: Add, Subtract, Intersect, Xor, Divide.
3. **Cải tiến Thuật toán Tính Sai Lệch Đường Cong:**
   - Hiện tại thuật toán dùng phương pháp lấy mẫu 15 điểm đều và tìm khoảng cách tối thiểu tới các điểm mục tiêu. Có thể nâng cấp lên giải thuật **Directed Hausdorff Distance** hoặc **Fréchet Distance** để đo lường độ trùng khớp chính xác hơn đối với các đường cong tự do có độ xoắn phức tạp.

### 4.2. Cải Thiện Kiến Trúc & Hiệu Năng Frontend
1. **Dynamic Lazy-Loading & Web Worker cho Monaco Editor:**
   - Khi triển khai Phase 4 mở rộng, tuyệt đối không bundle trực tiếp Monaco vào chunk chính. Phải sử dụng `React.lazy(() => import('./MonacoWrapper'))` và cấu hình Monaco Environment để tải worker từ CDN hoặc vendor chunk riêng biệt.
2. **Tích hợp Thư viện Quản lý Trạng thái Nhẹ (Zustand):**
   - Hiện tại state của ứng dụng đang phân tán ở từng page và custom hook cục bộ. Khi có Auth và Student Dashboard, việc dùng `Zustand` sẽ giúp đồng bộ trạng thái đăng nhập, tiến độ bài học, và cấu hình MCP bridge xuyên suốt các component mà không bị prop-drilling.
3. **Chuyển đổi Song ngữ Quốc tế (i18n):**
   - Cung cấp toggle chuyển đổi ngôn ngữ linh hoạt giữa **Tiếng Việt** (ngôn ngữ giảng dạy mặc định) và **English** (thuật ngữ chuẩn công nghiệp quốc tế).

### 4.3. Cải Thiện Kiểm Thử Tự Động & Đảm Bảo Chất Lượng (QA Pipeline)
1. **Bổ sung Vitest / React Testing Library cho Unit Test:**
   - Hiện dự án phụ thuộc vào Playwright cho toàn bộ kiểm thử frontend. Mặc dù Playwright rất mạnh về E2E, việc chạy trình duyệt tốn nhiều tài nguyên hơn. Cần cài đặt `vitest` và `@testing-library/react` để kiểm thử nhanh các hàm toán học trong `bezier-math.ts` và logic render component đơn lẻ chỉ trong vài mili-giây.
2. **Tự Động Hóa So Sánh Ảnh Visual Regression (Pixel-by-Pixel Diffing):**
   - Tận dụng 7 ảnh chụp baseline trong `tests/screenshots/` để tích hợp `expect(page).toHaveScreenshot()` trong Playwright, tự động báo lỗi nếu có bất kỳ thay đổi nào làm lệch layout giao diện hoặc màu sắc token.

### 4.4. Cải Thiện Trải Nghiệm Offline & Tiện Ích PWA
1. **Service Worker & Caching Bài học Offline:**
   - Các file bài học JSON hoàn toàn tĩnh và có dung lượng nhẹ (~10–15 kB mỗi bài). Có thể tích hợp `vite-plugin-pwa` để biến Affinity Academy thành một ứng dụng PWA có thể cài đặt lên màn hình chính, cho phép học viên xem slide và làm quiz ngay cả khi không có kết nối internet.

---

## 5. BẢNG MA TRẬN 49 YÊU CẦU KỸ THUẬT (TRACEABILITY MATRIX)

| Mã Yêu Cầu | Tên Yêu Cầu Kỹ Thuật | Nhóm Phân Hệ | Mức Ưu Tiên | Trạng Thái Thực Tế | Tác Vụ Triển Khai |
|:---|:---|:---:|:---:|:---:|:---|
| `REQ-SYS-001` | Project Control System & Pre-Phase Audit | Hệ thống | P0 | **PASS** | `TASK-001` |
| `REQ-SYS-002` | Toolchain & Scaffolding Configuration | Hệ thống | P0 | **PASS** | `TASK-002` |
| `REQ-SYS-003` | Architectural Directory Layout | Hệ thống | P0 | **PASS** | `TASK-003` |
| `REQ-SYS-004` | Local Affinity Environment Diagnostic | Hệ thống | P0 | **PASS** | `TASK-004` |
| `REQ-MCP-001` | Live MCP Diagnostic & Connectivity Test | Nghiên cứu MCP | P0 | **PASS** | `TASK-004` |
| `REQ-MCP-002` | 11 MCP Tools Direct Execution Benchmark | Nghiên cứu MCP | P0 | **PASS** | `TASK-005` |
| `REQ-MCP-003` | DOM API Documentation Extraction | Nghiên cứu MCP | P0 | **PASS** | `TASK-005` |
| `REQ-MCP-004` | Sandbox & Capability Classification | Nghiên cứu MCP | P0 | **PASS** | `TASK-005` |
| `REQ-MCP-005` | Visual Rendering Benchmark | Nghiên cứu MCP | P0 | **PASS** | `TASK-006` |
| `REQ-MCP-006` | Standalone Script Verification Harness | Nghiên cứu MCP | P1 | **PASS** | `TASK-005` |
| `REQ-MCP-007` | Affinity MCP Capability Report | Nghiên cứu MCP | P0 | **PASS** | `TASK-005` |
| `REQ-CURR-001` | Curriculum Architecture & Schema Definition | Giáo trình | P0 | **PASS** | `TASK-010` |
| `REQ-CURR-002` | Track 1: Affinity Designer (10 Modules) | Giáo trình | P0 | **PASS** | `TASK-010`, `TASK-010-REAUDIT` |
| `REQ-CURR-003` | Track 2: Affinity Photo (10 Modules) | Giáo trình | P1 | **PENDING** | `TASK-011` (Chặn Phase Gate) |
| `REQ-CURR-004` | Track 3: Affinity Publisher (10 Modules) | Giáo trình | P1 | **PENDING** | `TASK-012` (Chặn Phase Gate) |
| `REQ-CURR-005` | Track 4: Scripting & MCP Automation | Giáo trình | P1 | **PENDING** | `TASK-013` (Chặn Phase Gate) |
| `REQ-CURR-006` | Interactive Slide-Based Lesson Engine | Giáo trình | P0 | **PASS** | `TASK-026` |
| `REQ-CURR-007` | Interactive Affinity Tool Simulations | Giáo trình | P1 | **PARTIAL** | `TASK-027` (Đã có Bézier MVP) |
| `REQ-CURR-008` | Tool Encyclopedia & Resource Library Content | Giáo trình | P2 | **PENDING** | `TASK-030` |
| `REQ-FE-001` | Design System: Typography & Color Tokens | Giao diện | P0 | **PASS** | `TASK-020` |
| `REQ-FE-002` | Core Layout & Global Navigation Shell | Giao diện | P0 | **PASS** | `TASK-021` |
| `REQ-FE-003` | Course Catalog & Track Filtering Component | Giao diện | P1 | **PASS** | `TASK-022` |
| `REQ-FE-004` | Interactive Lesson Viewer & Slide Deck Player | Giao diện | P0 | **PASS** | `TASK-026` |
| `REQ-FE-005` | In-Browser Bézier Curve & Pen Tool Simulator | Giao diện | P1 | **PASS** | `TASK-027` |
| `REQ-FE-006` | Live JavaScript Code Editor & Runner | Giao diện | P1 | **PENDING** | `TASK-023` (Chặn Phase Gate) |
| `REQ-FE-007` | MCP Server Bridge & Visual Spread Viewer | Giao diện | P1 | **PENDING** | `TASK-025` (Chặn Phase Gate) |
| `REQ-FE-008` | Tool Encyclopedia Interactive Matrix View | Giao diện | P2 | **PENDING** | `TASK-028` |
| `REQ-FE-009` | Search, Keyboard Shortcut Guide & Modal | Giao diện | P2 | **PENDING** | `TASK-029` |
| `REQ-FE-010` | Student Progress Dashboard & Exercise Submission | Giao diện | P2 | **PENDING** | `TASK-031` |
| `REQ-PAGE-001` | Home / Landing Page | Trang Web | P0 | **PASS** | `TASK-071` |
| `REQ-PAGE-002` | Courses / Catalog Page | Trang Web | P1 | **PASS** | `TASK-072` |
| `REQ-PAGE-003` | Lesson Detail / Viewer Page | Trang Web | P0 | **PASS** | `TASK-073` |
| `REQ-PAGE-004` | Tool Simulator Page | Trang Web | P1 | **PASS** | `TASK-074` |
| `REQ-PAGE-005` | Tool Encyclopedia Page | Trang Web | P2 | **PENDING** | `TASK-075` |
| `REQ-PAGE-006` | Script Playground Page | Trang Web | P1 | **PENDING** | `TASK-076` |
| `REQ-PAGE-007` | Student Dashboard Page | Trang Web | P2 | **PENDING** | `TASK-077` |
| `REQ-PAGE-008` | Settings / MCP Connection Page | Trang Web | P2 | **PENDING** | `TASK-078` |
| `REQ-BE-001` | Supabase Schema & Data Models Migration | Backend | P1 | **PENDING** | `TASK-040` |
| `REQ-BE-002` | Student Auth & Role-Based Access Control | Backend | P1 | **PENDING** | `TASK-041` |
| `REQ-BE-003` | User Progress, Bookmarks & Submissions API | Backend | P1 | **PENDING** | `TASK-042` |
| `REQ-BE-004` | Affinity Asset Storage Buckets & Policies | Backend | P2 | **PENDING** | `TASK-043` |
| `REQ-QA-001` | Unit & Component Test Suite | QA & Test | P1 | **PARTIAL** | `TASK-050` |
| `REQ-QA-002` | Visual Regression Testing | QA & Test | P1 | **PASS** | `TASK-051` (7 screenshots verified) |
| `REQ-QA-003` | Cross-Browser E2E Automated Test Suite | QA & Test | P1 | **PASS** | `TASK-052` (Playwright passed) |
| `REQ-QA-004` | Curriculum Content & Technical Accuracy Audit | QA & Test | P0 | **PASS** | `TASK-053` (Audit & Remediation) |
| `REQ-QA-005` | Performance Benchmarking & Bundle Size Audit | QA & Test | P1 | **PASS** | `TASK-054` (88.03% bundle reduction) |
| `REQ-OPS-001` | Production Build Pipeline & Bundle Optimization | Vận hành | P0 | **PASS** | `TASK-060` |
| `REQ-OPS-002` | Netlify Deployment & Hosting Configuration | Vận hành | P1 | **PENDING** | `TASK-061` |
| `REQ-OPS-003` | Project Documentation & Operator Handover | Vận hành | P0 | **PASS** | `TASK-062` |

---

## 6. SỔ ĐĂNG KÝ TÁC VỤ (TASK REGISTRY STATUS SUMMARY)

- **Tổng số Hàng Tác vụ:** **50 hàng** (trong [`project-control/TASK_REGISTRY.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/TASK_REGISTRY.md)).
- **Tác vụ Đã Hoàn Thành (COMPLETED & QA Certified):** **13 tác vụ** (chiếm 26% tổng số task):
  - `TASK-001`: Project Control System & Pre-Phase Audit
  - `TASK-002`: Toolchain & Scaffolding Configuration
  - `TASK-003`: Architectural Directory Layout
  - `TASK-004`: Local Affinity Environment Diagnostic
  - `TASK-005`: Affinity 3.0 DOM API Deep Extraction
  - `TASK-006`: Live Rendering Latency Benchmark
  - `TASK-010`: Affinity Designer 10-Module Track Authoring
  - `TASK-010-REAUDIT`: Track 1 Technical Accuracy Re-Audit & Remediation
  - `TASK-020`: Design System & Visual Tokens ("Mastero")
  - `TASK-026`: Interactive Slide-Based Lesson Engine
  - `TASK-027`: In-Browser Affinity Tool Simulator Sandbox MVP
  - `TASK-074`: Major Page: Tool Simulator Sandbox
  - `TASK-060`: Production Build Pipeline & Bundle Optimization
- **Tác vụ Đang Chờ Phê Duyệt Cổng Kiểm Soát (PENDING AT PHASE GATE):** **37 tác vụ**.

---

## 7. CẨM NANG DÀNH CHO CÁC AI AGENT KẾ THỪA (AI ONBOARDING GUIDE)

Nếu bạn là một AI Agent (Cursor, Claude, Copilot, DeepMind Antigravity, v.v.) vừa mới mở workspace này, hãy **ĐỌC KỸ VÀ TUÂN THỦ TUYỆT ĐỐI** các quy tắc sau:

### 7.1. Thứ tự Đọc Bắt buộc Trước khi Thực thi
1. Đọc [`AGENTS.md`](file:///c:/affinity%20h%E1%BB%8Dc/AGENTS.md): Nắm rõ vai trò của từng tác tử và thẩm quyền của Orchestrator.
2. Đọc [`project-control/BLOCKERS.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/BLOCKERS.md): Kiểm tra trạng thái của `BLK-005`. Nếu là **ACTIVE**, **BẠN ĐANG BỊ KHÓA Ở CỔNG PHASE GATE**. Không được tự ý mở rộng mã nguồn.
3. Đọc [`project-control/DECISIONS.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/DECISIONS.md): Nắm rõ 20 quyết định kiến trúc (`ADR-001` đến `ADR-020`), đặc biệt là `ADR-019` (Bézier Engine) và `ADR-020` (Hoãn Monaco Editor).
4. Đọc [`project-control/HANDOFF.md`](file:///c:/affinity%20h%E1%BB%8Dc/project-control/HANDOFF.md): Nắm rõ lệnh kiểm thử, đường dẫn sản phẩm, và trạng thái bàn giao gần nhất.

### 7.2. Các Lệnh Kiểm Tra Hồi Quy Bắt Buộc
Trước và sau khi can thiệp vào mã nguồn, luôn chạy 5 lệnh kiểm thử độc lập:
```powershell
# 1. Kiểm tra tính toàn vẹn của toàn bộ 39 bài học giáo trình
node scripts/validate-curriculum.js

# 2. Kiểm tra cú pháp các script JavaScript
npm run test:scripts

# 3. Kiểm tra kiểu tĩnh TypeScript (Bắt buộc 0 lỗi)
npm run typecheck

# 4. Kiểm thử giao diện và tương tác E2E Playwright
npx playwright test tests/e2e/pen-node-simulator.spec.ts

# 5. Build production và kiểm tra bundle size
npm run build
```

### 7.3. Các Điều Cấm Kỵ Tuyệt Đối (Strict Guardrails)
- **CẤM** tự ý cài đặt `monaco-editor` trực tiếp mà không có phương án lazy-load worker.
- **CẤM** tự ý triển khai Track 2 (Photo), Track 3 (Publisher), Track 4 (Scripting) khi chưa có lệnh phê duyệt Phase Gate từ Product Owner.
- **CẤM** tự chế các phím tắt Persona (Affinity không có phím tắt mặc định chuyển Persona).
- **CẤM** tự ý đóng điểm chặn `BLK-005` trong `project-control/BLOCKERS.md`.
- **CẤM** đưa các tệp ảo không tồn tại vào các báo cáo nghiệm thu QA. Mọi tệp báo cáo phải kiểm tra được bằng `Get-ChildItem` trên ổ đĩa.
