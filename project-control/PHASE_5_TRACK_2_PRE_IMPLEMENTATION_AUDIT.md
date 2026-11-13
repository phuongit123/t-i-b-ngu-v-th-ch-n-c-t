# PHASE 5 — TRACK 2 (AFFINITY PHOTO) PRE-IMPLEMENTATION AUDIT
**Document ID:** `AUDIT-TRACK2-PHOTO-001`  
**Date:** 2026-11-11  
**Project Workspace:** `C:\affinity học`  
**Current Git Commit:** `a2f73a4` (branch `master`, working tree clean)  
**Lead Auditor & Architect:** Lead Orchestrator & Senior QA Engineer  

---

## 1. MỤC ĐÍCH KIỂM TOÁN (AUDIT OBJECTIVE)

Kiểm toán độc lập toàn bộ hiện trạng kỹ thuật của dự án **AFFINITY ACADEMY v4.2.1** trước khi bước vào giai đoạn mở rộng và triển khai toàn diện **Track 2: Affinity Photo** (từ 1 module pilot lên 10 modules, 30 bài học thực tế, tài nguyên thực hành, công cụ tương tác mô phỏng và kiểm thử E2E).

---

## 2. KẾT QUẢ ĐO LƯỜNG ĐƯỜNG CƠ SỞ (BASELINE VERIFICATION)

Mọi kiểm thử đã được thực thi trực tiếp trên workspace `C:\affinity học` trước khi thực hiện bất kỳ thay đổi nào:

| Hạng mục kiểm tra | Lệnh thực thi | Kết quả | Chi tiết & Ghi chú |
| :--- | :--- | :---: | :--- |
| **Git Working Tree** | `git status` | **CLEAN** | On branch `master`, commit `a2f73a4`, không có tệp thừa |
| **TypeScript Static Check** | `npm run typecheck` (`tsc --noEmit`) | **PASS** | **0 lỗi biên dịch** kiểu dữ liệu |
| **Production Build** | `npm run build` (`tsc && vite build`) | **PASS** | Đóng gói thành công trong 5.73s, `index.js` = 120.28 kB |
| **Curriculum Schema Validation** | `npm run validate:curriculum` | **PASS** | **39/39 bài học hiện tại đạt 100% chuẩn schema** |
| **Script Automation Harness** | `npm run test:scripts` | **PASS** | **3/3 scripts JavaScript** kiểm tra cú pháp thành công |
| **Playwright E2E Test Suite** | `npm run test:e2e` | **PASS** | **6/6 test cases đỗ trong 14.1s** trên Microsoft Edge |

---

## 3. THẨM ĐỊNH 8 TRỌNG TÂM KIẾN TRÚC (8-POINT ARCHITECTURAL AUDIT)

### 3.1. Phiên bản dự án thực tế (Actual Project Version)
- **Phiên bản ghi nhận:** `v4.2.1`.
- **Ứng dụng:** Nền tảng web React 19 + TypeScript 5.8 + Vite 6.2 + Tailwind CSS 3.4.
- **Trạng thái cổng kiểm soát (Phase Gate):** `BLK-006` đang kích hoạt để giám sát việc mở rộng các Track tiếp theo (Track 2, Track 3, Track 4) và các công cụ mô phỏng.

### 3.2. Số lượng bài học giáo trình hiện tại (Curriculum Inventory)
- **Tổng số module hiện có:** **13 modules**.
  - **Track 1 (Affinity Designer):** 10 modules (`D01` đến `D10`), 30 bài học (`D01-01` đến `D10-03`).
  - **Track 2 (Affinity Photo):** 1 module pilot (`P01`), 3 bài học (`P01-01`, `P01-02`, `P01-03`).
  - **Track 3 (Affinity Publisher):** 1 module pilot (`B01`), 3 bài học (`B01-01`, `B01-02`, `B01-03`).
  - **Track 4 (Scripting & Automation):** 1 module pilot (`S01`), 3 bài học (`S01-01`, `S01-02`, `S01-03`).
- **Tổng số bài học hiện có:** **39 bài học** (299 slides tương tác, 117 câu trắc nghiệm).
- **Mục tiêu Track 2:** Mở rộng từ 1 module (`P01`) lên **10 modules (`P01` đến `P10`)**, tương đương thêm 9 modules (27 bài học mới), đưa Track 2 đạt chuẩn 30 bài học và tổng toàn dự án lên **22 modules, 66 bài học**.

### 3.3. Kiến trúc module Photo hiện tại (Existing Photo Module Architecture)
- Thư mục lưu trữ: `curriculum/photo/P01/`.
- Tệp định nghĩa module: `module.json` chứa metadata (title, tagline, description, difficulty, estimatedMinutes, primaryPersona, starterAsset, lessonIds).
- Tệp bài học: `P01-01.json`, `P01-02.json`, `P01-03.json`.
- Mỗi tệp bài học tuân thủ nghiêm ngặt **10 phần chuẩn (10 Standard Sections)**:
  1. `learningObjectives` (Mục tiêu bài học, mảng chuỗi)
  2. `foundationalKnowledge` (Kiến thức nền tảng & lý thuyết bản chất)
  3. `technicalEvidence` (Phân loại VERIFIED, nguồn Serif Affinity 3.3.3)
  4. `toolAndFeatureExplanation` (Tên công cụ, persona, phím tắt Win/Mac rõ ràng, context bar)
  5. `stepByStepInstructions` (Các bước thực hành cụ thể kèm mẹo)
  6. `visualExamples` (Bảng biểu, sơ đồ luồng phi phá hủy)
  7. `guidedPractice` (Bài tập có hướng dẫn, checkpoints, kết quả kỳ vọng)
  8. `independentChallenge` (Thử thách độc lập, starterAsset, tiêu chí chấm)
  9. `commonPitfalls` (Sai lầm phổ biến, nguyên nhân, cách khắc phục)
  10. `knowledgeCheck` (Câu hỏi trắc nghiệm kiến thức, đáp án đúng, giải thích)
- Cùng với mảng `slides` (intro, theory, tool-anatomy, step-by-step, pitfalls, quiz, challenge) phục vụ cho `SlidePlayer`.

### 3.4. Các thành phần giao diện tái sử dụng (Reusable UI Components)
- `src/components/lesson/SlidePlayer.tsx`: Trình diễn slide tương tác hỗ trợ phím mũi tên, câu hỏi kiểm tra, checklist và điều hướng bài học mượt mà.
- `src/components/cards/TrackCard.tsx`, `ModuleCard.tsx`, `LessonCard.tsx`: Các thẻ bài học, tiến độ và module theo hệ thống Design System "Mastero".
- `src/components/layout/AppShell.tsx`, `MainNavigation.tsx`, `SidebarNavigation.tsx`, `PageHeader.tsx`: Khung điều hướng chuẩn mực, responsive trên mọi kích thước màn hình.
- `src/pages/SimulatorPage.tsx`: Trang chứa môi trường mô phỏng tương tác.

### 3.5. Xử lý tài nguyên thực hành (Asset Management & Transparency)
- Quy tắc phân loại tài nguyên bài học (`assetStatus`):
  - `REAL_AFFINITY_FILE`: Tệp gốc nhị phân (chỉ dùng cho `P01_starter.afphoto` 1.65 MB đã được xác thực thực tế).
  - `GUIDE_DOCUMENT`: Tài liệu hướng dẫn thiết lập kỹ thuật chi tiết (`.md`), không tạo tệp nhị phân giả mạo.
  - `JAVASCRIPT_SCRIPT`: Tệp mã kịch bản JavaScript tự động hóa.
- Thư mục lưu trữ: `curriculum/assets/photo/`. Hiện có `P01_starter.afphoto`. Đối với P02 đến P10, sẽ thiết lập các bản tài liệu thực hành kỹ thuật (`P02_selections_masking_guide.md`, v.v.) theo đúng chuẩn `GUIDE_DOCUMENT`.

### 3.6. Quy tắc kiểm tra tính hợp lệ giáo trình (Validation Rules in `validate-curriculum.js`)
- Quét động toàn bộ thư mục `curriculum/<track>/<module>/`.
- Bắt buộc kiểm tra:
  - Khớp định danh: `lesson.id === lessonId`, `lesson.moduleId === item.module`, `lesson.trackId === item.track`.
  - Đủ 10/10 mục chuẩn trong `standardSections`.
  - Phím tắt phải phân định rõ ràng giữa `.win` và `.mac`.
  - Mảng `slides` phải có ít nhất 5 slide.
  - Mảng `knowledgeCheck` phải có ít nhất 1 câu hỏi trắc nghiệm kèm giải thích.
  - Tệp khai báo trong `starterAsset` phải tồn tại thực tế trên ổ đĩa nếu là `REAL_AFFINITY_FILE` hoặc `GUIDE_DOCUMENT`.

### 3.7. Độ bao phủ kiểm thử hiện tại (Test Coverage)
- Kiểm tra kiểu dữ liệu: TypeScript 5.8 `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`.
- E2E Playwright: 6 kịch bản kiểm thử giao diện mô phỏng (`tests/e2e/pen-node-simulator.spec.ts`).
- Đối với Track 2: Cần bổ sung kiểm thử E2E xác thực khả năng duyệt Track Photo, lọc danh sách 10 modules, khởi chạy bài học trên `SlidePlayer` và tương tác với công cụ mô phỏng Photo.

### 3.8. Các điểm nghẽn kỹ thuật hiện tại (Current Blockers & Risks)
- `BLK-006`: Phase Gate giám sát triển khai Track 2–4 và Monaco Editor.
- Cần đảm bảo dung lượng bundle: Khi thêm 9 modules (27 bài học) vào `src/data/curriculum/index.ts`, cần cập nhật cấu hình Rollup `manualChunks` trong `vite.config.ts` để phân tách `curriculum-photo` thành 2 chunk nhỏ (`curriculum-photo-foundations` cho P01-P05 và `curriculum-photo-advanced` cho P06-P10) nhằm giữ kích thước chunk luôn dưới 300 kB, triệt tiêu mọi cảnh báo kích thước gói.

---

## 4. KẾ HOẠCH TRIỂN KHAI TRACK 2 THEO CÁC GIAI ĐOẠN

1. **Giai đoạn 1 (Tài nguyên thực hành):**  
   Tạo 9 tài liệu đặc tả kỹ thuật `GUIDE_DOCUMENT` trong `curriculum/assets/photo/` cho P02 đến P10.
2. **Giai đoạn 2 (Xây dựng nội dung 9 modules P02–P10):**  
   Tạo `module.json` và 27 tệp bài học `.json` (`P02-01` đến `P10-03`) chuẩn mực 10 phần, giàu nội dung tiếng Việt chuyên sâu, phím tắt chính xác.
3. **Giai đoạn 3 (Tích hợp Frontend & Curriculum Index):**  
   Đấu nối 9 modules và 27 bài học vào `src/data/curriculum/index.ts`, cập nhật metadata Track Photo.
4. **Giai đoạn 4 (Phân tách gói Rollup & Tối ưu hiệu năng):**  
   Cập nhật `vite.config.ts` tách `curriculum-photo-foundations` (P01-P05) và `curriculum-photo-advanced` (P06-P10).
5. **Giai đoạn 5 (Công cụ học tập tương tác Photo Simulator):**  
   Xây dựng `PhotoLayerSimulator` mô phỏng trực quan Layer Stack, Non-destructive Masking ("Black Conceals, White Reveals"), Blend Modes (Multiply, Screen, Overlay), và Curves/B&W adjustments.
6. **Giai đoạn 6 (QA Verification & E2E Testing):**  
   Bổ sung test E2E Playwright cho Photo Track và Photo Simulator; chạy toàn bộ test suite.
7. **Giai đoạn 7 (Quản trị dự án & Báo cáo):**  
   Cập nhật `TASK_REGISTRY.md`, `PROGRESS.md`, `ROADMAP.md`, `BLOCKERS.md`, `HANDOFF.md`, lập báo cáo triển khai và QA sign-off.
