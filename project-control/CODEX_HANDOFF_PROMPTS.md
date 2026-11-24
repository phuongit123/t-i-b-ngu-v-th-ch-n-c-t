# AFFINITY ACADEMY — HỒ SƠ CHUYỂN GIAO & ĐỊNH HƯỚNG PHÁT TRIỂN DÀNH CHO CODEX
## TỔNG HỢP TOÀN DIỆN SKILL, KIẾN TRÚC, NGUYÊN TẮC QUẢN TRỊ VÀ 3 PROMPT THỰC THI CHUYÊN SÂU

- **Mã tài liệu:** `CODEX-HANDOFF-SPEC-001`
- **Phiên bản:** `1.0.0`
- **Thời gian lập:** `2026-11-22`
- **Nhánh Git đích:** `feat/full-platform-overhaul`
- **Kho lưu trữ (Remote):** `https://github.com/phuongit123/t-i-b-ngu-v-th-ch-n-c-t`
- **Cổng pha kiểm soát:** `BLK-007` đang ở trạng thái **ACTIVE — LOCKED** (Nghiêm cấm tự ý tạo file bài học `B02–B10` và `S02–S10` vào thư mục `curriculum/` khi chưa có lệnh mở cổng của Project Owner).

---

## PHẦN 1: BẢN ĐỒ KỸ NĂNG NỘI TẠI & HỆ THỐNG QUẢN TRỊ DỰ ÁN

Toàn bộ hệ thống kỹ năng chuyên trách của dự án được lưu trữ tại thư mục `.agents/skills/`. Codex khi tiếp quản dự án bắt buộc phải tuân thủ nghiêm ngặt quy trình của từng kỹ năng:

| Tên Skill | Vị trí file | Mục đích & Trách nhiệm cốt lõi |
|---|---|---|
| **`academy-session-orientation`** | [SKILL.md](file:///c:/affinity%20h%E1%BB%8Dc/.agents/skills/academy-session-orientation/SKILL.md) | **Định hướng phiên làm việc:** Đối soát trạng thái nhánh Git, working tree, kiểm tra cổng khóa pha `BLK-007`, rà soát bảng tác vụ (`TASK_REGISTRY.md`) và tiến độ (`PROGRESS.md`, `HANDOFF.md`) trước khi thực hiện bất kỳ thay đổi nào. Tuyệt đối không xóa tree làm việc dở dang. |
| **`curriculum-lesson-design`** | [SKILL.md](file:///c:/affinity%20h%E1%BB%8Dc/.agents/skills/curriculum-lesson-design/SKILL.md) | **Thiết kế & chuẩn hóa bài giảng:** Bắt buộc tuân thủ hợp đồng 10 phần (`learningObjectives`, `foundationalKnowledge`, `toolAndFeatureExplanation`, `stepByStepInstructions`, `visualExamples`, `guidedPractice`, `independentChallenge`, `commonPitfalls`, `knowledgeCheck`, `summaryAndResources`). Dạy tư duy thiết kế 8 bước, gắn chuẩn đầu ra `PLO-01`–`PLO-11`, tuyệt đối không dạy bấm nút vẹt. |
| **`affinity-tool-audit`** | [SKILL.md](file:///c:/affinity%20h%E1%BB%8Dc/.agents/skills/affinity-tool-audit/SKILL.md) | **Kiểm định công cụ thực tế Affinity v3.3.3:** Rà soát và xác thực công cụ trên 3 Studio: Layout, Vector, Pixel. Phân định rõ Studio với nhãn khóa học (Designer, Photo, Publisher). Mọi phím tắt, menu, thao tác phải có bằng chứng từ Serif Help Center hoặc test trực tiếp trên app máy tính; nghiêm cấm bịa đặt phím tắt Adobe hoặc tính năng ảo. |
| **`independent-capstone-assessment`** | [SKILL.md](file:///c:/affinity%20h%E1%BB%8Dc/.agents/skills/independent-capstone-assessment/SKILL.md) | **Đánh giá đồ án tốt nghiệp độc lập:** Thiết kế đề bài thực tế, rubric chấm điểm 7 chiều (Brief, Reasoning, Tool Choice, Craft, Iteration, Delivery, Reflection). Ràng buộc bảo vệ tốt nghiệp: Bắt buộc đạt Level 3 trở lên ở 5 tiêu chí cốt lõi, không cho phép lấy điểm cao bù điểm liệt. |
| **`academy-product-implementation`** | [SKILL.md](file:///c:/affinity%20h%E1%BB%8Dc/.agents/skills/academy-product-implementation/SKILL.md) | **Thực thi sản phẩm & kỹ thuật Frontend:** Xây dựng UI/UX theo phong cách "Bầu trời đêm huyền ảo" (Night Sky `#060913`, `#0d1326`, `#141c38`) kết hợp hệ thống nút bấm vật lý 3D nổi khối (`btn-tactile-cyan`, `btn-tactile-amber`, `btn-tactile-dark`). Giữ vững tính trung thực: Không giả lập số liệu ảo, không giả lập thành công, phân biệt rõ app simulator trong trình duyệt và phần mềm Affinity thật trên desktop. |
| **`quality-gate-handoff`** | [SKILL.md](file:///c:/affinity%20h%E1%BB%8Dc/.agents/skills/quality-gate-handoff/SKILL.md) | **Kiểm định chất lượng đa tầng & bàn giao trung thực:** Chạy chuỗi kiểm định 13 bước trước khi commit: `typecheck`, `lint`, `validate:curriculum`, `audit-vi-localization`, `build`, E2E tests. Báo cáo trung thực mã SHA commit, không đánh đồng bài test chạy pass trên commit cũ cho commit mới. |

---

## PHẦN 2: BẢNG RÀ SOÁT LỖI TỒN ĐỌNG & NHỮNG ĐIỂM CẦN HOÀN THIỆN

Dưới đây là kết quả rà soát chi tiết hiện trạng hệ thống để Codex nắm rõ các điểm nghẽn và khắc phục triệt để:

### 1. Về Sư phạm & Tính Thực tế trên Phần mềm Affinity (Curriculum & Reality)
- **Tồn đọng:** Dù 66/66 bài học đã vượt qua kiểm tra định dạng JSON và hợp đồng 10 phần, các bài tập mở rộng ở Mục 7 (`independentChallenge`) tại một số bài học foundations vẫn còn mang tính lặp lại quy trình ở Mục 4, chưa thực sự buộc học viên phải đưa ra quyết định thiết kế độc lập.
- **Thiếu hụt chuẩn đầu ra:** `PLO-07` (Diễn giải đề bài & bối cảnh truyền thông) và `PLO-08` (Phê bình & cải tiến lặp lại) mới chỉ được tích hợp sâu ở các bài nâng cao và Capstone (`TASK-081`), cần được lồng ghép tự nhiên vào phần phản biện của các bài học D01–D10 và P01–P10.
- **Thực tế thao tác Affinity v3.3.3:** Cần đảm bảo 100% đường dẫn menu (ví dụ: `Layer > New Live Filter Layer > Lighting...`, `Document > Convert Format / ICC Profile...`) và phím tắt (V, P, A, M, Ctrl/Cmd+J, Ctrl/Cmd+G, X để hoán đổi màu) khớp chính xác với bản cài đặt desktop Affinity thực tế, không bị nhầm lẫn với Photoshop/Illustrator.
- **Khóa pha `BLK-007`:** 54 bài mở rộng (`B02–B10`: 27 bài; `S02–S10`: 27 bài) đã có khung đặc tả trong `CURRICULUM_EXPANSION_SPEC_66_TO_120.md`, nhưng **tuyệt đối không được gen file JSON** vào `curriculum/` khi chưa có lệnh bằng văn bản từ Project Owner để bảo toàn trạng thái CI/CD 66/66 PASS.

### 2. Về Giao diện Người dùng & Trải nghiệm (Frontend UI/UX)
- **Đồng bộ hóa Visual Night Sky:** `HomePage.tsx` và `ResourcesPage.tsx` đã được nâng cấp lên giao diện Bầu trời đêm (`#060913`, `#0d1326`, `#141c38`) với nút bấm vật lý 3D nổi khối và thanh chạy công cụ Magic UI. Tuy nhiên, các trang con gồm `CatalogPage.tsx`, `LessonPage.tsx`, `SimulatorPage.tsx`, `ChallengesPage.tsx`, `EncyclopediaPage.tsx`, `CapstoneAssessmentPage.tsx` cần được phủ đồng bộ theme này, triệt tiêu hoàn toàn các khối nền đen thô cứng (`#000000`) hay viền xám mờ nhạt.
- **Nút bấm xúc giác (Tactile 3D Buttons):** Cần áp dụng đồng bộ các class nút bấm vật lý (`btn-tactile-cyan`, `btn-tactile-amber`, `btn-tactile-dark`) có hiệu ứng đổ bóng chân thực (`box-shadow: 0 4px 0 #...`), khi click có hiệu ứng lún xuống (`transform: translateY(2px)`), mang lại cảm giác phản hồi cơ học rõ rệt.
- **Tối ưu hóa học tập (Readability & Layout):** Bố cục chữ bài đọc 10 phần (`LessonSectionsReader.tsx`) cần giãn dòng chuẩn (`leading-relaxed`), kích thước font dễ đọc, màu chữ xám sáng (`text-slate-200`), các khối ghi chú Alert (Mẹo, Lưu ý, Cảnh báo) phải có màu viền và nền phát sáng tinh tế, giúp học viên không bị mỏi mắt khi học lâu.
- **Bộ mô phỏng (Simulators):** `PenNodeSimulator.tsx` (Mô phỏng đường cong Bézier & nốt thông minh) và `PhotoLayerSimulator.tsx` (Mô phỏng 4 lớp không phá hủy & tô mặt nạ Canvas) cần hiển thị rõ ràng huy hiệu bản quyền sư phạm ("MÔ HÌNH MÔ PHỎNG GIÁO DỤC — TRẢI NGHIỆM TRÊN TRÌNH DUYỆT").

### 3. Về Hạ tầng Backend & Đám mây Google Drive (Backend & Cloud)
- **Giải quyết nghẽn LocalStorage 5MB:** Đã tích hợp Google Drive Cloud Storage Hub (`src/lib/gdrive-storage.ts` & `src/components/storage/GoogleDriveStorageHub.tsx`) với thư mục công khai ID `1cS5McFPt8MpdFQOXSgOAmH_9Gt3CLGDR`. Cho phép học viên xuất/nhập toàn bộ tiến độ, chứng chỉ, bài nộp capstone sang file JSON lưu trên Drive, xóa bỏ nguy cơ tràn bộ nhớ LocalStorage của trình duyệt.
- **Phân phối tài nguyên nặng:** Các file starter nặng (`P01_starter.afphoto` 1.6MB, file ảnh RAW mẫu, bảng màu) đã được lưu trên Drive và ánh xạ link CDN trực tiếp, ngăn chặn tình trạng phình to bundle của web hoặc quá tải băng thông Supabase. Cần nối link Google Drive này vào Mục 9 (`summaryAndResources`) của SlidePlayer trong từng bài học.
- **Cơ sở dữ liệu Supabase:** 3 bản migration mới (`20261122000006_curriculum_catalog.sql`, `20261122000007_data_integrity.sql`, `20261122000008_capstone_transactions.sql`) đảm bảo tính toàn vẹn dữ liệu, chống gian lận kết quả chấm Capstone (RLS chặn học viên tự sửa điểm). Cần duy trì tính năng chạy Offline-First (khi mất mạng hoặc chưa đăng nhập, web vẫn chạy mượt mà bằng LocalStorage).

---

## PHẦN 3: BỘ 3 PROMPT THỰC THI CHUYÊN SÂU DÀNH CHO CODEX

Sau đây là 3 Prompt độc lập, hoàn chỉnh, có thể sao chép trực tiếp để giao việc cho Codex thực thi theo từng mảng chuyên biệt:

---

### PROMPT 1: QUẢN TRỊ DỰ ÁN, CHUẨN HÓA SƯ PHẠM & KIẾN TRÚC BÀI HỌC THỰC TẾ AFFINITY v3.3.3

```markdown
Bạn là CurriculumAgent & Orchestrator tiếp quản dự án Affinity Academy tại workspace `c:\affinity học` (nhánh `feat/full-platform-overhaul`). Nhiệm vụ của bạn là rà soát, tối ưu hóa và nâng cấp toàn bộ hệ thống bài giảng, đảm bảo học viên phát triển tư duy thiết kế thực thụ, dễ hiểu, trực quan và 100% thao tác thực tế tồn tại trên phần mềm Affinity desktop.

### 1. NGUYÊN TẮC QUẢN TRỊ & BẢO TOÀN DỰ ÁN (BẮT BUỘC TUÂN THỦ)
1. **Kiểm tra trạng thái & cổng pha:**
   - Đọc kỹ `.agents/skills/academy-session-orientation/SKILL.md` và `.agents/rules/affinity-academy-governance.md`.
   - Cổng pha `BLK-007` đang ở trạng thái **ACTIVE — LOCKED**. Hiện tại hệ thống có đúng **66 bài học hiện hữu** (30 bài Designer D01–D10, 30 bài Photo P01–P10, 3 bài Publisher B01 pilot, 3 bài Scripting S01 pilot). TUYỆT ĐỐI KHÔNG tự ý tạo file JSON bài học cho `B02–B10` hoặc `S02–S10` vào thư mục `curriculum/` khi chưa có lệnh mở cổng bằng văn bản từ Project Owner.
   - Nhánh làm việc là `feat/full-platform-overhaul`. KHÔNG merge vào `main`, không force-push, không xóa cây thư mục dở dang.

2. **Quy chuẩn ngôn ngữ & thuật ngữ công cụ Affinity v3.3.3:**
   - Tên không gian làm việc chính thức: **Layout Studio**, **Vector Studio**, **Pixel Studio**.
   - Designer, Photo, Publisher chỉ là nhãn phân loại miền học tập (Learning-domain labels).
   - Tuyệt đối coi thuật ngữ "Affinity V2" và "StudioLink" là công nghệ cũ (legacy).
   - 100% tiếng Việt tự nhiên, chuyên nghiệp; thuật ngữ công cụ giữ tên tiếng Anh chuẩn quốc tế đặt trong ngoặc đơn hoặc viết hoa tên riêng (ví dụ: Công cụ Bút vẽ (Pen Tool [P]), Nốt thông minh (Smart Node [A]), Bảng chỉnh màu (Curves Adjustment [Ctrl+M])).
   - Nghiêm cấm bịa đặt phím tắt không tồn tại trên Affinity desktop hoặc nhầm lẫn với Adobe.

### 2. TỐI ƯU HÓA SƯ PHẠM & TƯ DUY THIẾT KẾ 8 BƯỚC
1. **Chuyển dịch từ "Học vẹt bấm nút" sang "Tư duy thiết kế":**
   - Mọi bài học phải giải thích rõ ràng chu trình 8 giai đoạn:
     `Khám phá (Discover) → Định nghĩa (Define) → Khảo sát (Explore) → Lập kế hoạch (Plan) → Sáng tạo (Create) → Đánh giá (Evaluate) → Lặp lại (Iterate) → Chuyển giao (Deliver)`.
   - Trong Mục 4 (`stepByStepInstructions`) và Mục 6 (`guidedPractice`), học viên phải hiểu lý do "TẠI SAO chọn công cụ này thay vì công cụ khác", ưu điểm của giải pháp không phá hủy (Non-destructive) và cách đánh giá chất lượng sản phẩm trực quan.

2. **Nâng cấp bài tập độc lập (Mục 7 - `independentChallenge`) và đóng chuẩn `PLO-07`, `PLO-08`:**
   - Rà soát các bài tập mở rộng ở Mục 7 trên toàn bộ 66 bài học: Bài tập mở rộng KHÔNG ĐƯỢC là bản sao chép lại bài mẫu với hình ảnh khác. Nó phải thay đổi ít nhất 1 yếu tố thực tế: đối tượng truyền thông, định dạng xuất bản, hạn chế kỹ thuật hoặc bảng màu thương hiệu.
   - Bổ sung yêu cầu phản biện thiết kế (`PLO-08`): Học viên tự đánh giá lỗi bố cục/màu sắc/độ sắc nét, đưa ra phương án khắc phục lặp lại trước khi xuất file.

3. **Gắn kết file mẫu thực hành thực tế:**
   - Đảm bảo trong Mục 9 (`summaryAndResources`) và Mục 6 (`guidedPractice`), các bài học trỏ chính xác về tài nguyên mẫu thực tế (link tải file `.afphoto`, `.afdesign` hoặc tài liệu hướng dẫn markdown tương ứng trong `curriculum/assets/` hoặc qua Google Drive Storage Hub).

### 3. KIỂM ĐỊNH & BÀN GIAO CHẤT LƯỢNG
Sau khi hoàn thiện chỉnh sửa nội dung bài giảng, bạn phải chạy và đảm bảo vượt qua 100% các lệnh kiểm tra:
- `npm run validate:curriculum`: 66/66 bài học đạt chuẩn cấu trúc JSON 10 phần, 0 lỗi.
- `node scripts/audit-vi-localization.js`: 0 lỗi rò rỉ ngôn ngữ tiếng Anh trên UI và bài học.
- Cập nhật tiến độ vào `project-control/PROGRESS.md` và `project-control/HANDOFF.md`.
- Tạo commit rõ ràng: `feat(curriculum): elevate pedagogical design thinking and tool reality across 66 lessons`.
- Đẩy thay đổi lên `origin feat/full-platform-overhaul`.
```

---

### PROMPT 2: HOÀN THIỆN FRONTEND WEB, TRẢI NGHIỆM NGƯỜI DÙNG ĐÊM TỐI (NIGHT SKY) & NÚT BẤM VẬT LÝ 3D

```markdown
Bạn là FrontendAgent & DesignAgent tiếp quản dự án Affinity Academy tại workspace `c:\affinity học` (nhánh `feat/full-platform-overhaul`). Nhiệm vụ của bạn là hoàn thiện toàn bộ giao diện người dùng (UI/UX) của nền tảng web, đảm bảo phong cách mỹ thuật đẳng cấp "Bầu trời đêm huyền ảo" (Night Sky), tích hợp nút bấm vật lý 3D nổi khối xúc giác, bố cục chữ dễ nhìn, dễ học và tối ưu tương tác học tập.

### 1. ĐỊNH HƯỚNG MỸ THUẬT & HỆ THỐNG DESIGN TOKENS
1. **Bảng màu Cosmic Night Sky (src/styles/tokens.css & index.css):**
   - Màu nền sâu thẳm: Nền chính canvas `--bg-canvas: #060913`, bề mặt thẻ `--bg-surface: #0d1326`, bề mặt nâng cao `--bg-elevated: #141c38`, viền tinh tế `--border-subtle: #1e293b`.
   - Điểm sáng phát quang (Glow Accents): Xanh ngọc phát quang (`#00f5d4` / Cyan), vàng hổ phách sáng (`#f59e0b` / Amber), xanh chàm tinh vân (`#6366f1` / Indigo).
   - Màu chữ đạt chuẩn tương phản cao: Tiêu đề trắng sáng (`text-slate-100`), nội dung bài đọc xám dịu mắt (`text-slate-200` / `text-slate-300`), không để chữ tối chìm vào nền.

2. **Hệ thống Nút bấm Vật lý 3D Nổi khối (Tactile 3D Buttons):**
   - Sử dụng các utility classes đã định nghĩa trong `src/styles/index.css`:
     - `.btn-tactile-cyan`: Nút chính nổi bật (Nền ngọc biển sáng, đổ bóng cứng 4px `#00b4d8`, hover nâng nhẹ, active lún xuống 2px).
     - `.btn-tactile-amber`: Nút hành động phụ / Đồ án / Đám mây (Đổ bóng cứng 4px `#b45309`).
     - `.btn-tactile-dark`: Nút bề mặt tối sang trọng (Nền `#141c38`, đổ bóng cứng 4px `#070b18`, viền `#2a3860`).
   - Mọi nút bấm CTA chính trên toàn bộ các trang con bắt buộc phải chuyển sang hệ thống nút xúc giác này, loại bỏ các nút bấm phẳng đơn điệu.

### 2. ĐỒNG BỘ HÓA GIAO DIỆN TRÊN TOÀN BỘ CÁC TRANG CON
Đảm bảo tất cả các trang con đều được bao bọc trong phong cách Night Sky huyền bí, có các hạt phát quang mờ ảo hoặc dải gradient vũ trụ:
1. **`src/pages/CatalogPage.tsx` (Danh mục khóa học):**
   - Khung lọc Studio (Vector, Pixel, Layout, Automation) dùng pill tabs nổi khối.
   - Thẻ Module bo tròn tinh xảo, hiệu ứng viền sáng hover (`hover:border-cyan-500/40`), thanh tiến độ phát sáng neon.
   - Thanh tìm kiếm tiếng Việt tức thì có phím tắt hiển thị đẹp mắt (`Ctrl+K`).
2. **`src/pages/LessonPage.tsx` (Khung học tập tương tác đa phân vùng):**
   - Thanh điều hướng bài học (Outline Sidebar) thu gọn mượt mà, đánh dấu bài đang học rõ ràng.
   - Khung trình chiếu Slide (`SlidePlayer.tsx`) tích hợp nút chuyển slide 3D tactile, font chữ to rõ, chế độ toàn màn hình không lỗi vỡ khung.
   - Khung bài đọc 10 phần (`LessonSectionsReader.tsx`): Định dạng Typography tối ưu cho đọc lâu (độ dài dòng tối đa `max-w-4xl`, khoảng cách đoạn thoáng đãng, các khối Mẹo/Lưu ý/Cảnh báo có hiệu ứng phát quang đặc trưng).
3. **`src/pages/SimulatorPage.tsx` (Bộ mô phỏng Vector & Photo Studio):**
   - Tích hợp 2 tab rõ ràng: Mô phỏng Pen/Node Bézier Vector và Mô phỏng Lớp/Mặt nạ Photo.
   - Gắn huy hiệu sư phạm minh bạch: "MÔ HÌNH MÔ PHỎNG GIÁO DỤC — TRẢI NGHIỆM TRÊN TRÌNH DUYỆT".
   - Bảng điều khiển nốt, lực nhấn, cọ vẽ phản hồi trực quan ngay trên canvas.
4. **`src/pages/ResourcesPage.tsx` (Trung tâm Tài nguyên & Google Drive Hub):**
   - Đảm bảo 2 tab hoạt động hoàn hảo: `Google Drive Cloud Hub` (nhúng iframe xem thư mục trực tiếp, đồng hồ đo dung lượng LocalStorage, nút xuất/nhập file JSON dự phòng) và `Tài Liệu Cục Bộ & Sơ Đồ Kỹ Thuật SVG`.
5. **`src/pages/CapstoneAssessmentPage.tsx` & `ChallengesPage.tsx`:**
   - Giao diện thẩm định đồ án tốt nghiệp với bảng điểm rubric 7 chiều sang trọng, đồng hồ đếm thời gian, khung tải lên bài làm hỗ trợ cả upload file lẫn liên kết Google Drive.

### 3. KIỂM ĐỊNH CHẤT LƯỢNG KỸ THUẬT & TRẢI NGHIỆM
Sau khi thực hiện các thay đổi Frontend, bạn phải chạy và đảm bảo 0 lỗi:
- `npm run typecheck`: 0 lỗi TypeScript.
- `npm run lint`: 0 cảnh báo ESLint (`--max-warnings 0`).
- `npm run build`: Tạo bundle thành công, kiểm tra code-splitting không có chunk nào vượt quá 400kB bất thường.
- Cập nhật tiến độ vào `project-control/PROGRESS.md` và `project-control/HANDOFF.md`.
- Tạo commit: `feat(ui): elevate night sky cosmic theme and tactile 3d buttons across all pages`.
- Đẩy mã nguồn lên `origin feat/full-platform-overhaul`.
```

---

### PROMPT 3: HẠ TẦNG BACKEND, TÍCH HỢP GOOGLE DRIVE CLOUD STORAGE & CỔNG KIỂM ĐỊNH CHẤT LƯỢNG NGHIÊM NGẶT

```markdown
Bạn là BackendAgent & QAAgent tiếp quản dự án Affinity Academy tại workspace `c:\affinity học` (nhánh `feat/full-platform-overhaul`). Nhiệm vụ của bạn là hoàn thiện hạ tầng dữ liệu Supabase, tối ưu hóa lưu trữ đám mây Google Drive Cloud Hub, loại bỏ hoàn toàn giới hạn 5MB LocalStorage của trình duyệt và thiết lập cổng kiểm định chất lượng (CI/CD Quality Gate) tuyệt đối trước khi phát hành.

### 1. HẠ TẦNG GOOGLE DRIVE CLOUD STORAGE & LƯU TRỮ HYBRID
1. **Kiến trúc Google Drive Cloud Hub (`src/lib/gdrive-storage.ts` & `src/components/storage/GoogleDriveStorageHub.tsx`):**
   - Thư mục Google Drive công khai của dự án: ID `1cS5McFPt8MpdFQOXSgOAmH_9Gt3CLGDR` (tài khoản `tuanphuongreal@gmail.com`).
   - Triển khai cơ chế sao lưu 2 chiều:
     - Xuất dữ liệu học tập (tiến độ bài học, kết quả trắc nghiệm, đồ án capstone) từ LocalStorage ra file chuẩn `affinity_academy_backup_[timestamp].json`.
     - Nhập dữ liệu sao lưu từ Google Drive hoặc file máy tính, kiểm tra checksum toàn vẹn và đồng bộ tức thì vào State của ứng dụng.
     - Đồng hồ đo bộ nhớ thời gian thực cảnh báo học viên khi LocalStorage vượt quá 3.5MB / 5MB, khuyến nghị lưu trữ lên Google Drive.
2. **Phân phối tài nguyên học tập dung lượng cao (Heavy Asset Delivery):**
   - Các file bài tập Affinity thực tế (`.afphoto`, `.afdesign`, ảnh RAW dung lượng > 1MB) phải được lưu trữ trên Google Drive công khai, phục vụ download qua CDN direct-link:
     - `P01_starter.afphoto` (ID: `10nOJZNGNQwKsC0NYGS1Ilxd4s6dQWEYu`).
     - `portrait-subject-studio.png` (ID: `1v5glZJfx3QeUkJiY4JXmbcPb07e8beLN`).
     - `before-color-raw.png` (ID: `1sII2li30L-jHBTy3TnZh6ICb8tLRrvLX`).
   - Tích hợp các link CDN tải nhanh này vào Mục 9 (`summaryAndResources`) của SlidePlayer trong các bài học tương ứng, loại bỏ việc bundle file nhị phân nặng vào mã nguồn web.

### 2. CƠ SỞ DỮ LIỆU SUPABASE & BẢO MẬT GIAO DỊCH
1. **Kiểm tra và chuẩn hóa các file SQL Migration (`supabase/migrations/`):**
   - `20261122000006_curriculum_catalog.sql`: Đồng bộ cấu trúc 66 bài học và 4 Studio vào bảng `modules`, `lessons`.
   - `20261122000007_data_integrity.sql`: Khóa ngoại, ràng buộc kiểm tra tiến độ học tập (`progress_percent` từ 0 đến 100), trigger cập nhật thời gian `updated_at`.
   - `20261122000008_capstone_transactions.sql`: Ràng buộc giao dịch chấm điểm đồ án tốt nghiệp — RLS chính sách Zero-Trust nghiêm cấm học viên tự ý ghi đè kết quả đánh giá chính thức (`assessment_results`), chỉ cho phép quyền Admin/Evaluator lưu điểm.
2. **Cơ chế hoạt động Ngoại tuyến (Offline-First Resilience):**
   - Khi không có kết nối internet hoặc chưa cấu hình Supabase, hệ thống tự động fallback 100% về LocalStorage và bộ lưu trữ Google Drive, hiển thị huy hiệu trạng thái rõ ràng ở Header (`MainNavigation.tsx`) thay vì bắn lỗi màn hình đỏ.

### 3. BỘ KIỂM ĐỊNH CHẤT LƯỢNG 13 BƯỚC (QUALITY GATES) & QUY TẮC PHÁT HÀNH
Trước khi hoàn tất phiên làm việc, bắt buộc phải chạy lần lượt các cổng kiểm định sau trong PowerShell:
1. `npm run typecheck` (tsc --noEmit): Phải đạt 0 lỗi.
2. `npm run lint` (eslint): Phải đạt 0 cảnh báo, 0 lỗi.
3. `npm run validate:curriculum`: 66/66 bài học đạt chuẩn cấu trúc.
4. `node scripts/audit-vi-localization.js`: 0 lỗi rò rỉ ngôn ngữ.
5. `npm run build`: Bản dựng Vite production thành công trong < 25 giây, 0 cảnh báo chunk.
6. Chạy các test Playwright E2E khả dụng (`npx playwright test tests/e2e/photo-curriculum.spec.ts tests/e2e/capstone-assessment.spec.ts`).

### 4. KỶ LUẬT GIT & BÀN GIAO
- Cập nhật tài liệu quản trị: `project-control/PROGRESS.md`, `project-control/HANDOFF.md`, và `project-control/TASK_REGISTRY.md`.
- Ghi rõ mã commit SHA đã được kiểm định.
- Commit với thông điệp: `feat(backend): harden supabase transactions, integrate gdrive cloud hub, and verify 13-gate quality suite`.
- Đẩy nhánh: `git push origin feat/full-platform-overhaul`.
- TUYỆT ĐỐI KHÔNG mở lệnh merge PR #1 vào nhánh `main` khi chưa có yêu cầu trực tiếp từ Project Owner.
```

---

## PHẦN 4: HƯỚNG DẪN THỰC THI CHO DỰ ÁN

Tài liệu này đóng vai trò là kim chỉ nam duy nhất để điều phối Codex hoặc bất kỳ kỹ sư/agent nào tiếp tục phát triển dự án Affinity Academy. Bằng cách thực thi tuần tự 3 Prompt trên, dự án sẽ đạt được sự hài hòa hoàn hảo giữa:
1. **Chất lượng sư phạm:** Đào tạo tư duy thiết kế thực tế thay vì sao chép giao diện.
2. **Đẳng cấp thẩm mỹ:** Bầu trời đêm huyền ảo, nút bấm vật lý 3D nổi khối chân thực, bố cục chữ đạt chuẩn chống mỏi mắt.
3. **Tính ổn định hạ tầng:** Tích hợp đám mây Google Drive xóa bỏ rào cản bộ nhớ, giao dịch Supabase an toàn và quy trình kiểm thử 13 cổng bất khả xâm phạm.
