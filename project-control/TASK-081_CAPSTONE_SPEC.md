# ĐẶC TẢ HỆ THỐNG ĐÁNH GIÁ NĂNG LỰC ĐỘC LẬP A5 CAPSTONE (TASK-081 SPECIFICATION)

## Kiểm soát Tài liệu
- **Mã tài liệu:** `TASK-081-SPEC-001`
- **Phiên bản:** `1.0.0` (A5 Independent Design Competence & Capstone Framework)
- **Ngày ban hành:** `2026-11-16`
- **Nhiệm vụ quản trị:** `TASK-081` / `REQ-LEARN-003`
- **Điều kiện tiên quyết:** `TASK-079` (Đã COMPLETED trên `main`) & `TASK-080` (Ma trận 68 công cụ đã đối soát)
- **Trọng tâm sư phạm:** Bù đắp và đo lường độc lập 2 chuẩn đầu ra then chốt: **`PLO-07` (Brief Interpretation)** và **`PLO-08` (Iteration & Critique)**.
- **Phase Gate:** `BLK-007 ACTIVE — LOCKED` (Không biên soạn bài học mới của Track 3/4).

---

## 1. Báo cáo Hiện trạng Bao phủ PLO-07 và PLO-08 trong Curriculum Hiện tại

Trước khi thiết kế Capstone, hệ thống đã thực hiện đối soát độc lập trên toàn bộ 66 bài học hiện hữu đối với 2 chuẩn đầu ra:

### 1.1. Chuẩn đầu ra `PLO-07` — Diễn giải và Phân rã Brief (Brief Interpretation)
*   **Định nghĩa chuẩn (`LEARNING_OUTCOMES.md`):** Học viên có năng lực phân tích, làm rõ đối tượng khán giả (Audience), mục đích truyền thông (Purpose), thông điệp cốt lõi (Message), các ràng buộc kỹ thuật (Constraints), sản phẩm bàn giao (Deliverables) và tiêu chí thành công đo lường được (Measurable Success Criteria) trước khi mở phần mềm thiết kế.
*   **Mức độ bao phủ hiện tại:** **4 / 66 bài học** (chiếm 6.1% toàn giáo trình):
    1.  `P07-01` (Visual Planning, Light Direction & Perspective Matching): Lập kế hoạch hướng sáng, góc nhìn phối cảnh, đường chân trời và cấu trúc layer trước khi ghép ảnh composite.
    2.  `P08-03` (Designing Promotional Commercial Compositions & Text Behind Subject): Phân tích phân cấp thị giác thương mại, đối tượng nhận diện, độ sâu và bố cục nút kêu gọi hành động (CTA).
    3.  `P10-03` (Capstone Lesson Photo Track): Đọc và thực thi brief poster chân dung/phong cảnh thương mại (ở cấp độ bài học có hướng dẫn, chưa phải đánh giá độc lập toàn diện).
    4.  `B01-01` (Publication Architecture, Facing Pages, Slug & Bleed Standards): Đọc và diễn giải thông số in ấn thực tế, cấu trúc tài liệu nhiều trang, đóng gáy, khoảng bù xén (bleed) và color profile CMYK.
*   **Khoảng trống phát hiện:** Toàn bộ 30 bài học của Track 1 (Designer D01–D10) **chưa có bài học nào** yêu cầu học viên lập văn bản phân rã Brief trước khi vẽ. Học viên thường bắt tay vẽ ngay theo hướng dẫn kỹ thuật mà không trải qua khâu phân tích bài toán truyền thông.

### 1.2. Chuẩn đầu ra `PLO-08` — Chẩn đoán, Phản biện và Lặp lại Thiết kế (Iteration and Critique)
*   **Định nghĩa chuẩn (`LEARNING_OUTCOMES.md`):** Học viên có năng lực tự phát hiện điểm yếu trong bản thảo đầu tiên (Draft 1), tiếp nhận phản biện/chỉ trích có căn cứ, và thực hiện các điều chỉnh kỹ thuật có chủ đích (Purposeful Iteration) kèm lập luận rõ ràng về lý do thay đổi.
*   **Mức độ bao phủ hiện tại:** **15 / 66 bài học** (chiếm 22.7% toàn giáo trình):
    -   Photo Track: 12 bài (`P02-02`, `P02-03`, `P03-02`, `P04-01`, `P04-02`, `P04-03`, `P05-01`, `P06-02`, `P07-03`, `P08-03`, `P09-02`, `P10-03`).
    -   Scripting Track: 3 bài (`S01-01`, `S01-02`, `S01-03`) liên quan đến xử lý ngoại lệ và bắt lỗi code.
*   **Khoảng trống phát hiện:** Hầu hết các bài học chỉ liệt kê lỗi thường gặp (Common Pitfalls) ở dạng thụ động. Học viên chưa từng phải nộp **Nhật ký Sửa đổi (Iteration Log / Change Record)** để chứng minh mình đã trải qua vòng lặp phản biện: *Phát hiện lỗi gì $\to$ Bằng chứng nào chỉ ra $\to$ Quyết định sửa đổi kỹ thuật gì $\to$ Kết quả trước và sau (Before & After)*.

$\implies$ **Sứ mệnh của Đồ án Capstone A5:** Đặt học viên vào một bối cảnh thực tế mới hoàn toàn, bắt buộc phải hoàn thành trọn vẹn khâu **Phân rã Brief (PLO-07)** và khâu **Nhật ký Lặp lại Phản biện (PLO-08)** như điều kiện tiên quyết để được xét duyệt tốt nghiệp.

---

## 2. Đặc tả Đề tài Capstone A5: "Lumina Artisanal Roastery Launch Campaign"

### 2.1. Project Brief (Bối cảnh Dự án Thực tế)
*   **Khách hàng:** Lumina Artisanal Roastery — xưởng rang cà phê hữu cơ đặc sản (Specialty Coffee) phục vụ phân khúc cao cấp và các quán cà phê boutique.
*   **Thách thức Thương hiệu:** Thương hiệu trước đây sử dụng logo generic mua trên mạng, bao bì thiếu tính nhận diện hệ thống, và hình ảnh quảng cáo chụp bằng điện thoại bị phẳng, sai màu, không làm nổi bật được vẻ sang trọng của sản phẩm.
*   **Mục tiêu Chiến dịch:** Thiết kế lại toàn bộ hệ thống nhận diện cốt lõi (Vector) và hình ảnh key visual quảng cáo ra mắt dòng sản phẩm Cold Brew cao cấp (Pixel).
*   **Đối tượng Khán giả (Audience):** Người tiêu dùng thành thị độ tuổi 22–40, có gu thẩm mỹ cao, yêu chuộng lối sống bền vững, sẵn sàng chi trả mức giá premium cho sản phẩm cà phê chất lượng cao.

### 2.2. Learning Objectives (Mục tiêu Đánh giá Đo lường được)
Sau khi hoàn thành Capstone, học viên phải chứng minh được độc lập:
1.  **Giải mã Brief (`PLO-07`):** Hoàn thành văn bản phân rã đề tài gồm 6 yếu tố: Audience, Purpose, Message, Constraints, Deliverables, Measurable Success Criteria.
2.  **Ứng dụng Công cụ Vector Chuyên sâu (`PLO-01`, `PLO-03`):** Xây dựng Logo và Nhãn bao bì bằng Affinity Vector Studio, sử dụng Corner Tool (`VEC-006`) cho chi tiết viền huy hiệu, Symbols panel (`VEC-021`) để quản lý các biến thể nhãn, và Constraints panel (`VEC-023`) để nhãn tự động co giãn thích ứng giữa các kích thước bao bì (250g vs 500g).
3.  **Kỹ thuật Xử lý Ảnh & Chiếu sáng 3D (`PLO-02`, `PLO-04`):** Sử dụng Affinity Pixel Studio để xử lý ảnh chai Cold Brew thô: tách nền bằng Selection Brush Tool (`PIX-003`) kết hợp Refine Selection (`PIX-004`), tái thiết kế ánh sáng studio bằng Live Lighting Filter (`PIX-016`) với Spotlight và Bump Map texture 3D, cân chỉnh màu sắc bằng Curves & HSL (`PIX-007`, `PIX-013`).
4.  **Tự Chẩn đoán & Lặp lại Thiết kế (`PLO-08`):** Lập Nhật ký Sửa đổi (Iteration Log) so sánh ít nhất 2 phiên bản (Draft 1 vs Final Work), ghi nhận tối thiểu 3 lỗi thiết kế được phát hiện qua phản biện và chứng minh giải pháp khắc phục.
5.  **Chuẩn hóa Xuất bản In ấn & Kỹ thuật số (`PLO-09`):** Cung cấp file in ấn chuẩn xưởng in (PDF/X-4 CMYK FOGRA39 300 DPI, bù xén 3mm, marks) và file digital hiển thị màn hình (WebP/PNG sRGB 2x).
6.  **Tư duy & Suy ngẫm Thiết kế (`PLO-10`):** Viết báo cáo giải trình (Design Rationale) chứng minh tại sao giải pháp của mình phục vụ đúng đối tượng khách hàng và mục tiêu đề bài.

---

### 2.3. Yêu cầu Sản phẩm Đầu ra (Deliverables)

Học viên bắt buộc phải nộp đầy đủ 4 nhóm sản phẩm:

```
LUMINA_CAPSTONE_SUBMISSION/
├── 01_DESIGN_THINKING_DOCS/
│   ├── brief-deconstruction.md      # Văn bản phân rã Brief (PLO-07)
│   ├── iteration-critique-log.md    # Nhật ký phản biện & sửa đổi Draft 1 -> Draft 2 (PLO-08)
│   └── design-rationale.md          # Thuyết minh ý tưởng và giải trình lựa chọn công cụ (PLO-10)
├── 02_VECTOR_ASSETS/
│   ├── lumina-brand-system.afdesign # File nguồn Vector Studio đầy đủ layers, symbols, constraints
│   ├── logo-master.svg              # File vector logo xuất chuẩn sạch
│   └── label-packaging-print.pdf    # Nhãn bao bì PDF/X-4 CMYK 300 DPI (3mm bleed)
├── 03_PIXEL_KEYVISUAL/
│   ├── lumina-coldbrew-kv.afphoto   # File nguồn Pixel Studio phi phá hủy (Mask, Live Lighting, Bump)
│   └── lumina-ad-banner-2x.webp     # Poster quảng cáo digital WebP sRGB chất lượng cao
└── 04_EVALUATION/
    └── student-self-assessment.json # Bảng tự đánh giá của học viên theo 7 tiêu chí Rubric
```

---

### 2.4. Tài nguyên Đầu vào (Starter Assets Provided)
Học viên được cung cấp gói tài nguyên tiêu chuẩn trong thư mục `curriculum/assets/capstone/`:
1.  `lumina_project_brief.md`: Bảng tóm tắt yêu cầu thương hiệu, các thông số kỹ thuật bắt buộc và kích thước đóng gói.
2.  `lumina_coldbrew_raw_plate.jpg`: Ảnh chụp thô chai Cold Brew trên nền xám trung tính (yêu cầu tách nền và tái tạo ánh sáng).
3.  `coffee_texture_bump_map.png`: Bản đồ độ gồ ghề hạt giấy/bao bố dùng cho Bump Map trong Live Lighting.
4.  `brand_fonts_license.md`: Danh mục font chữ mở được chỉ định (`Cinzel` cho tiêu đề sang trọng, `Inter` cho nội dung kỹ thuật).

---

### 2.5. Hướng dẫn Thực hiện theo Chu trình Design Thinking (8 Bước)

1.  **Bước 1 — Discover:** Nghiên cứu thị trường cà phê specialty, phân tích đối thủ cạnh tranh, xác lập cảm xúc thương hiệu (Moodboard: Sang trọng, Thủ công, Đậm chất mộc).
2.  **Bước 2 — Define (`PLO-07`):** Điền vào `brief-deconstruction.md` các thông số kỹ thuật, kích thước nhãn bao bì, phân cấp thông tin (Hierarchy).
3.  **Bước 3 — Explore:** Phác thảo nhanh tối thiểu 2 phương án bố cục logo và nhãn (Ví dụ: Hướng 1 - Cổ điển với đường nét hình học; Hướng 2 - Tối giản hiện đại). Chọn 1 hướng đi và giải thích lý do.
4.  **Bước 4 — Plan:** Thiết lập hệ lưới (Grid System), bảng màu Global Color Swatches, quy tắc Pinning trong Constraints panel trước khi vẽ chi tiết.
5.  **Bước 5 — Create:**
    -   *Vector Studio:* Thiết kế logo và nhãn, ứng dụng Corner Tool tạo góc vát cao cấp, cấu hình Symbols cho nhãn để nhân bản, ghim Constraints cho các thành phần.
    -   *Pixel Studio:* Tách chai Cold Brew bằng Selection Brush, đưa vào không gian nền gỗ, thêm Live Lighting Filter với nguồn sáng Spot Light chiếu góc 45°, nạp Bump map tạo texture nổi, hiệu chỉnh tương phản bằng Curves.
6.  **Bước 6 — Evaluate:** Tự kiểm tra đối soát với brief: Màu in có chuẩn CMYK không? Nút bấm hoặc nhãn khi đổi kích thước có bị méo không? Ánh sáng chai nước có hòa nhập với môi trường không?
7.  **Bước 7 — Iterate (`PLO-08`):** Chụp ảnh màn hình bản thảo 1 (Draft 1), ghi lại các điểm chưa ưng ý (Ví dụ: viền chai còn lem viền trắng, chữ trên nhãn bị giãn méo khi đổi chiều rộng, ánh sáng quá gắt). Thực hiện điều chỉnh kỹ thuật và ghi lại toàn bộ vào `iteration-critique-log.md`.
8.  **Bước 8 — Deliver:** Xuất file in ấn và file digital đúng định dạng quy định, đóng gói toàn bộ và nộp bài lên hệ thống.

---

## 3. Rubric Chấm điểm Độc lập (Comprehensive Scoring Rubric)

Rubric đánh giá được xây dựng dựa trên 7 chiều kích của Chuẩn Đầu Ra `LEARNING_OUTCOMES.md`. Thang điểm chuẩn hóa 100 điểm với 4 cấp độ thành thạo:

### 3.1. Bảng Tiêu chí, Trọng số và Mức đạt

| STT | Chiều kích Đánh giá | PLO Ánh xạ | Trọng số | Phân loại | Mức 1 (Khởi điểm: 1-2 đ) | Mức 2 (Đang phát triển: 3 đ) | Mức 3 (Độc lập - ĐẠT: 4 đ) | Mức 4 (Xuất sắc: 5 đ) | Bằng chứng bắt buộc |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Giải mã Brief & Khán giả** | `PLO-07` | **15%** | **CRITICAL** | Bắt đầu vẽ ngay không có tài liệu brief; không xác định được khán giả hoặc mục đích. | Có văn bản brief nhưng sơ sài, thiếu ràng buộc kỹ thuật hoặc tiêu chí đo lường. | Phân rã trọn vẹn 6 yếu tố: Audience, Purpose, Message, Constraints, Deliverables, Metrics. | Phân tích sâu sắc tâm lý khách hàng, dự đoán rủi ro in ấn và đề xuất giải pháp tối ưu. | File `brief-deconstruction.md` |
| **2** | **Tư duy Thị giác & Truyền thông** | `PLO-05`, `PLO-06` | **15%** | Standard | Bố cục lộn xộn, thiếu tương phản, màu sắc hỗn loạn, kiểu chữ khó đọc hoặc generic. | Bố cục cơ bản ổn nhưng phân cấp thị giác chưa rõ; chọn màu chưa toát lên chất specialty cao cấp. | Phân cấp thị giác mạch lạc, tỷ lệ vàng/lưới chuẩn, màu sắc và typography sang trọng, đúng tông. | Bố cục đột phá, nhịp điệu thị giác ấn tượng, nghệ thuật chữ điêu luyện, cảm xúc mạnh mẽ. | File thiết kế hoàn thiện & Poster visual |
| **3** | **Lựa chọn Công cụ & Quy trình** | `PLO-01`, `PLO-02`, `PLO-03` | **20%** | **CRITICAL** | Dùng sai Studio (vẽ vector trong Pixel hoặc ngược lại); công cụ chọn tùy tiện, không giải thích được. | Dùng đúng studio nhưng thao tác thủ công, chưa tận dụng các công cụ nâng cao (Symbols, Constraints). | Chọn công cụ chuẩn xác: Corner Tool bo vát, Symbols đồng bộ nhãn, Constraints ghim co giãn, Selection Brush & Live Lighting. | Tối ưu hóa quy trình mẫu mực, kết hợp nhuần nhuyễn các tính năng cao cấp của Affinity. | Cấu trúc cây layer trong file `.afdesign` & `.afphoto` |
| **4** | **Kỹ nghệ & Kiến trúc Phi phá hủy** | `PLO-04` | **15%** | **CRITICAL** | Phá hủy dữ liệu pixel (dùng tẩy xóa cứng, merge layer); vector bị biến dạng, đứt node. | Có dùng Mask và Adjustment nhưng còn lẫn lộn thao tác phá hủy cục bộ; layer chưa đặt tên. | 100% Phi phá hủy: Layer Masks, Live Filters, Adjustment Layers; layer tổ chức ngăn nắp, đặt tên chuẩn. | Cấu trúc component tái sử dụng hoàn hảo, nested symbols khoa học, quản trị alpha và clipping bậc thầy. | Kiểm tra trực tiếp file nguồn `.afdesign` và `.afphoto` |
| **5** | **Tự Chẩn đoán & Lặp lại Thiết kế** | `PLO-08` | **15%** | **CRITICAL** | Không có nhật ký sửa đổi; chỉ nộp 1 bản duy nhất; từ chối hoặc bỏ qua các lỗi hiển nhiên. | Có sửa đổi nhưng không ghi chép; chỉ chỉnh sửa nhỏ mang tính trang trí cảm tính. | Lập nhật ký so sánh Draft 1 vs Draft 2: chỉ rõ ít nhất 3 lỗi kỹ thuật, giải thích nguyên nhân và chứng minh kết quả. | Nhật ký phản biện sâu sắc, có bằng chứng đo lường thực tế (kiểm tra tương phản, test in thử, gamut màu). | File `iteration-critique-log.md` kèm ảnh Before/After |
| **6** | **Chuẩn bị Sản xuất & Bàn giao** | `PLO-09` | **10%** | **CRITICAL** | File xuất sai định dạng, thiếu bleed, nhầm hệ màu RGB/CMYK, text bị vỡ hạt khi zoom. | File xuất mở được nhưng thiếu marks, profile màu in chưa chuẩn hoặc đặt tên file tùy tiện. | Đầy đủ bản in PDF/X-4 CMYK 300DPI có 3mm bleed + bản digital WebP sRGB 2x; đặt tên chuẩn cấu trúc. | Chuẩn bị đóng gói hoàn hảo, tài liệu bàn giao rõ ràng, tối ưu dung lượng file xuất sắc. | Thư mục `02_VECTOR_ASSETS` và `03_PIXEL_KEYVISUAL` |
| **7** | **Chuyển giao Độc lập & Suy ngẫm** | `PLO-10` | **10%** | Standard | Bài làm sao chép từ tutorial có sẵn; không giải thích được các quyết định thiết kế. | Tự làm được nhưng phần giải trình còn mang tính mô tả thao tác bấm nút ("tôi đã bấm nút X"). | Giải trình thuyết phục tại sao thiết kế đáp ứng được brief; nêu rõ giới hạn hiện tại và hướng cải tiến. | Tư duy thiết kế độc lập xuất sắc, thể hiện năng lực tự học và khả năng thích ứng với đề tài mới. | File `design-rationale.md` |

---

### 3.2. Điều kiện Đạt (Pass) và Không Đạt (Fail)

Để được cấp **Chứng Chỉ Năng Lực Thiết Kế Độc Lập A5 (A5 Independent Design Competence Certificate)**, bài nộp của học viên phải thỏa mãn đồng thời 2 điều kiện bắt buộc:

1.  **Điểm Tổng kết có trọng số:** $\ge \mathbf{75 / 100}$ điểm.
2.  **Nguyên tắc Không Bù trừ Lỗi Chí mạng (Critical Dimensions Safeguard):**
    *   **TẤT CẢ 5 Chiều kích Trọng yếu (`CRITICAL`: Tiêu chí 1, 3, 4, 5, 6) PHẢI ĐẠT TỐI THIỂU MỨC 3 (Level 3 - Independent Execution).**
    *   *Quy tắc loại trừ:* Nếu bất kỳ tiêu chí trọng yếu nào bị đánh giá ở Mức 1 hoặc Mức 2 (ví dụ: Không nộp file phân rã Brief `PLO-07`, không nộp Nhật ký Lặp lại `PLO-08`, file bị phá hủy pixel, hoặc file in thiếu bleed), bài nộp **LẬP TỨC BỊ ĐÁNH HỎNG (FAIL)**, bất kể điểm các phần khác có đạt tối đa.

---

## 4. Đặc tả Kỹ thuật Hệ thống Đánh giá trên Web Platform

### 4.1. Phân biệt Rạch ròi giữa Tự đánh giá và Đánh giá Độc lập
*   **Học viên (Student Persona):**
    -   Có quyền nhập link bài nộp, điền văn bản giải trình, và tự chấm điểm thử nghiệm (Self-Assessment) trên thang điểm Rubric để tự lượng giá trước khi nộp chính thức.
    -   Có quyền xem lại lịch sử các lần nộp (Submission History) và xem kết quả sau khi được chấm.
    -   **TUYỆT ĐỐI KHÔNG CÓ QUYỀN** chỉnh sửa hoặc can thiệp vào điểm số và nhận xét chính thức của Giám khảo.
*   **Giám khảo Độc lập / Giảng viên (Independent Evaluator Persona):**
    -   Có quyền truy cập giao diện chấm điểm chính thức (Evaluator Grading Console).
    -   Nhập điểm từng tiêu chí (1-4), nhập nhận xét định tính (Feedback), ghi nhận vi phạm chí mạng (Critical Violations nếu có).
    -   Ký duyệt kết quả chính thức (Official Sign-off), sinh mã chứng chỉ băm (Certificate Verification Hash) và khóa bảng điểm ở chế độ chỉ đọc vĩnh viễn (Read-Only Immutable Record).

### 4.2. Cơ chế Lưu trữ & Quản lý Trạng thái (Data Persistence & Validation)
*   **Giai đoạn hiện tại (Local Storage Engine):** Lưu trữ toàn bộ bài nộp, lịch sử phiên bản và kết quả đánh giá trong `localStorage` với cấu trúc JSON định hình chuẩn theo TypeScript interfaces, sẵn sàng ánh xạ 1:1 sang Supabase Database tables ở Phase 6.
*   **Cơ chế Validation chặt chẽ:**
    -   Kiểm tra định dạng file và đường dẫn (không cho nộp form trống).
    -   Kiểm tra sự hiện diện bắt buộc của Brief Sheet và Iteration Log.
    -   Kiểm tra tính toàn vẹn của điểm số (1..4) và công thức tính trọng số.

---

## 5. Kế hoạch Triển khai Mã nguồn và Kiểm thử

1.  **Tạo Schema TypeScript:** `src/types/capstone.ts`.
2.  **Tạo Service Quản lý Đánh giá & Lưu trữ:** `src/lib/capstone-service.ts`.
3.  **Tạo Trang Giao diện Capstone Độc lập:** `src/pages/CapstoneAssessmentPage.tsx`.
4.  **Tích hợp Định tuyến trong `src/App.tsx`:** Cho phép điều hướng trực tiếp vào trang Capstone qua menu navigation và thẻ tổng quan.
5.  **Viết Test Suite Kiểm thử Logic Đánh giá:** `tests/unit/capstone-evaluator.test.ts` kiểm thử trọng số, điều kiện trượt tiêu chí chí mạng và tính bất biến của kết quả.
6.  **Chạy Quality Gate Toàn diện.**