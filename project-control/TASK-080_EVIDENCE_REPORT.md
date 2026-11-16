# BÁO CÁO BẰNG CHỨNG KIỂM TOÁN CÔNG CỤ AFFINITY (TASK-080 EVIDENCE REPORT)

## Kiểm soát Tài liệu
- **Mã tài liệu:** `TASK-080-EVD-001`
- **Phiên bản:** `1.0.0` (Round 13 — Semantic Normalization & Evidence Verification for 5 Core P4 Tools)
- **Ngày lập:** `2026-11-16`
- **Nhiệm vụ quản trị:** `TASK-080` / `REQ-LEARN-002`
- **Nhánh thực hiện:** `qa/task-080-independent-evidence-audit`
- **Trạng thái nhiệm vụ:** `IN_PROGRESS` (Tuân thủ nguyên tắc: *Chỉ báo cáo TASK-080 hoàn thành khi tất cả tiêu chí nghiệm thu được xác minh. Các mục chưa đủ bằng chứng tiếp tục ở trạng thái chưa xác minh*).
- **Phase Gate:** `BLK-007 ACTIVE — LOCKED`

---

## 1. Mục tiêu và Phiên bản Đối chiếu Mục tiêu

### 1.1. Mục tiêu Kiểm toán
Báo cáo này thực hiện kiểm toán bằng chứng độc lập cho Ma trận Độ phủ Công cụ Affinity ([AFFINITY_TOOL_COVERAGE_MATRIX.md](file:///c:/affinity%20h%E1%BB%8Dc/project-control/AFFINITY_TOOL_COVERAGE_MATRIX.md)), tập trung đối soát chuyên sâu 5 công cụ cốt lõi trước đây còn phụ thuộc vào tài liệu mô tả tổng quan, đồng thời thiết lập ranh giới kỹ thuật rạch ròi giữa tính năng phần mềm Affinity Desktop thực tế và các bộ mô phỏng giáo dục (Web Simulators).

### 1.2. Xác định Phiên bản Đối chiếu
*   **Phạm vi sản phẩm:** Ứng dụng máy tính **Affinity Desktop** phiên bản ổn định mới nhất (Latest Stable Release tính đến ngày 16/11/2026), bao gồm các Studio cốt lõi: **Vector Studio** (Designer domain), **Pixel Studio** (Photo domain), và **Layout Studio** (Publisher domain).
*   **Mã định danh phiên bản đối chiếu:** **Affinity 3.3.3 / Build 5004** (được xác nhận theo thông cáo phát hành ổn định và siêu dữ liệu phân phối công khai tháng 11/2026; người dùng chấp thuận đây là baseline mục tiêu).
*   **Hệ thống tự động hóa:** Bộ API JavaScript V8 nội tại của Affinity và tích hợp `Affinity MCP Server` (chạy trên cổng `localhost:6767`).
*   **Giới hạn nền tảng:** Phạm vi kiểm toán giới hạn nghiêm ngặt trên bản Desktop (Windows/macOS). Không đưa các tính năng hoặc cử chỉ cảm ứng độc quyền của bản iPad (công bố 02/11/2026) vào mẫu số kiểm toán Desktop.

---

## 2. Đối chiếu Toàn diện 5 Công cụ Trọng điểm

### 2.1. `VEC-006` — Corner Tool

| Tiêu chí kiểm tra | Kết quả xác minh thực tế |
| :--- | :--- |
| **Tên chính thức** | **Corner Tool** (Công cụ bo vát góc vector) |
| **Phân loại bản ghi** | `interactive_tool` (Đã chuẩn hóa từ nhãn `contextual_control`; công cụ nằm trực tiếp trên Tools panel bên trái) |
| **Studio / Workspace** | **Vector Studio** (Affinity Designer domain) |
| **Đường dẫn giao diện** | Thanh công cụ bên trái (Tools panel, biểu tượng Corner Tool nằm cùng nhóm hoặc dưới Node Tool) |
| **Phím tắt xác minh** | **`C`** (Cả Windows và macOS đều xác minh phím tắt `C`) |
| **Chức năng cốt lõi** | Bo tròn hoặc vát góc trên các đỉnh nhọn (sharp corner nodes) của đối tượng vector (hình học đã chuyển sang curve, đường path kín hoặc hở). Kéo trực tiếp trên canvas xuất hiện vòng tròn định hình màu đỏ (red shaping ring) để điều chỉnh bán kính trực quan. |
| **Tùy chọn Context Toolbar** | - **Corner Type:** Rounded (fillet - bo cong lồi), Concave (scallop - uốn cong lõm vào), Straight (chamfer - vát phẳng 45 độ), Cutout (khía vuông góc 90 độ), None.<br>- **Radius:** Bán kính bo góc (px hoặc %).<br>- **Bake Appearance / Bake Corners:** Chuyển đổi vĩnh viễn các góc bo tham số thành các điểm neo node Bézier cố định. |
| **Giới hạn & Ràng buộc** | Chỉ tác động trên các node nhọn (Sharp nodes) của vector; không áp dụng trực tiếp lên ảnh bitmap nếu không lồng vào Picture Frame. Các node trên đường path hở có thể bo trực tiếp bằng Node Tool mà không bắt buộc phải đổi sang Corner Tool. |
| **Kiểm tra Bài học (`D03-01`)** | `curriculum/designer/D03/D03-01.json`<br>- **Guided Practice:** Hướng dẫn tạo hình ngôi sao 16 cánh $\to$ Convert to Curves $\to$ dùng Corner Tool (C) bo kiểu Straight (4px) cho 16 đỉnh ngoài và Rounded (3px) cho 16 đỉnh trong.<br>- **Independent Challenge:** Tạo Sci-Fi Hexagonal Cell, áp dụng Cutout cho 2 đỉnh bên và Straight cho 2 đỉnh trên/dưới $\to$ bấm `Bake Corners`.<br>- **Bằng chứng P4:** Hướng dẫn từng bước, checkpoint đánh giá và starter asset đầy đủ. |
| **Nguồn tài liệu chính thức** | [Affinity Help Center — Corner Tool](https://affinity.help/designer/en-US.lproj/pages/Tools/tools_corner.html) |
| **Trạng thái kiểm toán** | **P4 (Đã chuẩn hóa ngữ nghĩa và xác minh nguồn trực tiếp)** |

---

### 2.2. `VEC-021` — Symbols panel

| Tiêu chí kiểm tra | Kết quả xác minh thực tế |
| :--- | :--- |
| **Tên chính thức** | **Symbols panel** (Đã chuẩn hóa từ thuật ngữ legacy "Symbols Studio") |
| **Phân loại bản ghi** | `studio_panel` |
| **Studio / Workspace** | **Vector Studio** (Affinity Designer domain) |
| **Đường dẫn giao diện** | **`Window > Vector > Symbols`** hoặc **`Window > Symbols`** *(Đường dẫn legacy trong V1 là `View > Studio > Symbols` được ghi nhận đối chiếu)* |
| **Phím tắt xác minh** | Không có phím tắt mặc định; truy cập qua menu Window hoặc thanh dock panel bên phải |
| **Chức năng cốt lõi** | Quản lý việc tạo lập, lưu trữ và đồng bộ hóa đa chiều các khối biểu tượng (Symbols) vector liên kết trong toàn bộ tài liệu. |
| **Điều khiển trên Panel** | - **Create:** Biến layer hoặc nhóm đang chọn thành Symbol chủ (Master Symbol). Layer trong Layers panel hiển thị vạch màu cam đánh dấu.<br>- **Sync (Nút gạt Đồng bộ):** Khi **BẬT (Sync ON - màu cam)**, mọi chỉnh sửa hình học/màu sắc trên 1 bản sao sẽ lan truyền tự động sang tất cả bản sao trong tài liệu; khi **TẮT (Sync OFF - xám)**, cho phép thực hiện ghi đè cục bộ (Local Overrides: đổi nội dung chữ, đổi màu riêng) mà không làm mất liên kết khung hình học cốt lõi.<br>- **Detach:** Cắt đứt vĩnh viễn mối liên kết giữa bản sao được chọn với Symbol gốc, chuyển nó thành Group thông thường.<br>- **Symbol Palette:** Thư viện trực quan lưu giữ các Symbols của tài liệu. |
| **Giới hạn & Ràng buộc** | Chỉnh sửa khi đang bật Sync sẽ thay đổi mọi phiên bản trên mọi Artboard. Bắt buộc kiểm tra trạng thái nút Sync trước khi nhập text để tránh ghi đè hàng loạt. |
| **Kiểm tra Bài học (`D08-01`)** | `curriculum/designer/D08/D08-01.json`<br>- Đã cập nhật toàn bộ bài học từ "Symbols Studio" sang "Symbols panel" và menu `Window > Vector > Symbols`.<br>- **Guided Practice:** Tạo Master Button Symbol $\to$ nhân bản 3 instances $\to$ Tắt Sync (Sync OFF) để override text cục bộ $\to$ Bật Sync (Sync ON) để đổi màu toàn bộ instances mà vẫn giữ nguyên text riêng biệt.<br>- **Bằng chứng P4:** Đầy đủ checkpoint, tiêu chí đánh giá và bảng hướng dẫn xử lý sự cố. |
| **Nguồn tài liệu chính thức** | [Affinity Help Center — Symbols panel](https://affinity.help/designer/en-US.lproj/pages/Symbols/symbols.html) |
| **Trạng thái kiểm toán** | **P4 (Đã chuẩn hóa ngữ nghĩa và xác minh nguồn trực tiếp)** |

---

### 2.3. `VEC-023` — Constraints panel

| Tiêu chí kiểm tra | Kết quả xác minh thực tế |
| :--- | :--- |
| **Tên chính thức** | **Constraints panel** (Đã chuẩn hóa từ thuật ngữ legacy "Constraints Studio") |
| **Phân loại bản ghi** | `studio_panel` |
| **Studio / Workspace** | **Vector Studio** (Affinity Designer domain) |
| **Đường dẫn giao diện** | **`Window > Vector > Constraints`** hoặc **`Window > Constraints`** *(Đường dẫn legacy trong V1 là `View > Studio > Constraints`)* |
| **Phím tắt xác minh** | Không có phím tắt mặc định; truy cập qua menu Window hoặc dock panel |
| **Chức năng cốt lõi** | Thiết lập các quy tắc ghim vị trí (pinning) và co giãn (resizing) thích ứng cho các phần tử con (child objects) khi khung chứa cha (container/artboard) thay đổi kích thước trong thiết kế responsive UI. |
| **Điều khiển trên Panel** | - Sơ đồ trực quan gồm hộp ngoài (parent container) và hộp trong (child element).<br>- **Anchor Lines (Đường ghim):** Top, Bottom, Left, Right (nét liền = ghim cố định khoảng cách tới mép cha; nét đứt = không ghim).<br>- **Scaling Arrows (Mũi tên co giãn):** Co giãn theo trục ngang/dọc; nét đứt = cố định kích thước (Fixed Width / Fixed Height).<br>- **Lock Aspect Ratio:** Khóa tỷ lệ khung hình.<br>- **Min Fit & Max Fit:** Tự động thu nhỏ để luôn nằm trọn trong container hoặc phóng to tối đa. |
| **Giới hạn & Ràng buộc** | Ràng buộc Constraints chỉ có hiệu lực khi có quan hệ cha-con (phần tử lồng trong Group hoặc Artboard). Bài học `D08-03` tập trung thực hành Pin Left, Pin Right và Fixed Width. |
| **Kiểm tra Bài học (`D08-03`)** | `curriculum/designer/D08/D08-03.json`<br>- Đã cập nhật thuật ngữ từ "Constraints Studio" sang "Constraints panel" và menu `Window > Vector > Constraints`.<br>- **Guided Practice:** Lồng icon chevron vào nút bấm $\to$ thiết lập Pin Right & Fixed Width cho icon, Pin Left cho text $\to$ kéo giãn chiều rộng nút bấm và kiểm tra khoảng cách biên không bị méo.<br>- **Bằng chứng P4:** Checkpoint kiểm tra hành vi co giãn responsive rõ ràng. |
| **Nguồn tài liệu chính thức** | [Affinity Help Center — Constraints panel](https://affinity.help/designer/en-US.lproj/pages/Panels/constraintsPanel.html) |
| **Trạng thái kiểm toán** | **P4 (Đã chuẩn hóa ngữ nghĩa và xác minh nguồn trực tiếp)** |

---

### 2.4. `PIX-003` — Selection Brush Tool

| Tiêu chí kiểm tra | Kết quả xác minh thực tế |
| :--- | :--- |
| **Tên chính thức** | **Selection Brush Tool** (Cọ chọn vùng thông minh) |
| **Phân loại bản ghi** | `interactive_tool` |
| **Studio / Workspace** | **Pixel Studio** (Affinity Photo domain) |
| **Đường dẫn giao diện** | Thanh công cụ bên trái (Tools panel trong Pixel Studio / Photo Persona) |
| **Phím tắt xác minh** | **`W`** (Win/Mac); phím `[` và `]` thay đổi kích thước cọ; giữ `Alt` (Win) / `Option` (Mac) để tạm chuyển sang chế độ Subtract |
| **Chức năng cốt lõi** | Tạo và hiệu chỉnh vùng chọn pixel bằng cách quét cọ trực tiếp lên ảnh. Thuật toán tự động nhận diện biên độ tương phản màu sắc để bám dính vào viền chủ thể. |
| **Tùy chọn Context Toolbar** | - **Mode:** New (Vùng chọn mới), Add (Vẽ thêm), Subtract (Bớt đi).<br>- **Width / Size:** Kích thước đầu cọ.<br>- **Snap to edges:** Tùy chọn then chốt. Khi bật (mặc định), cọ tự động phát hiện biên tương phản và ôm sát mép; khi tắt, cọ chọn pixel thuần túy theo nét vẽ.<br>- **Soft edges:** Làm mềm chuyển tiếp viền vùng chọn.<br>- **All Layers:** Lấy mẫu tương phản từ tất cả layer hiển thị hay chỉ layer hiện hành.<br>- **Refine...:** Mở hộp thoại tinh chỉnh vùng chọn nâng cao (xử lý tóc tơ, viền mờ). |
| **Giới hạn & Ràng buộc** | Hiệu quả phụ thuộc vào độ tương phản giữa chủ thể và phông nền; đối với vùng tóc tơ bay lòa xòa hoặc phông nền rối, bắt buộc phải kết hợp nút Refine trên Context Bar. |
| **Kiểm tra Bài học (`P02-01`)** | `curriculum/photo/P02/P02-01.json`<br>- **Guided Practice:** Kích hoạt Selection Brush (W), bật Snap to Edges, quét chọn chủ thể, giữ Alt/Option để trừ phần nền lem, tạo đường kiến bò Marching Ants ôm sát vật thể sai lệch dưới 2px.<br>- **Bằng chứng P4:** Hướng dẫn chi tiết, tiêu chí checkpoint rõ ràng, liên kết tài liệu hướng dẫn kỹ thuật `P02_selections_masking_guide.md`. |
| **Nguồn tài liệu chính thức** | [Affinity Help Center — Selection Brush Tool](https://affinity.help/photo/en-US.lproj/pages/Tools/tools_selectionBrush.html) |
| **Trạng thái kiểm toán** | **P4 (Đã chuẩn hóa ngữ nghĩa và xác minh nguồn trực tiếp)** |

---

### 2.5. `PIX-016` — Live Lighting Filter & Optical Effects

| Tiêu chí kiểm tra | Kết quả xác minh thực tế |
| :--- | :--- |
| **Tên chính thức** | **Lighting (Live Filter Layer)** / **Live Lighting Filter** |
| **Phân loại bản ghi** | `contextual_control` / `studio_panel` |
| **Studio / Workspace** | **Pixel Studio** (Affinity Photo domain) |
| **Đường dẫn giao diện** | **`Layer > New Live Filter Layer > Lighting`** *(Đường dẫn destructive thay thế: `Filters > Lighting`; hoặc bấm biểu tượng Live Filters ở chân Layers panel $\to$ Lighting)* |
| **Giải mã nhầm lẫn lịch sử** | Trước đây tài liệu cũ ghi đường dẫn `Hourglass > Light > Lighting`. Ký hiệu chiếc phễu/đồng hồ cát là hình ảnh của biểu tượng Live Filters ở chân Layers panel. Đã chuẩn hóa toàn bộ về đường dẫn menu chuẩn quốc tế của Serif: `Layer > New Live Filter Layer > Lighting`. |
| **Phím tắt xác minh** | Truy cập qua menu Layer hoặc icon Live Filters ở Layers panel; không có phím tắt ký tự đơn mặc định |
| **Chức năng cốt lõi** | Bộ lọc thời gian thực phi phá hủy mô phỏng hệ thống chiếu sáng 3D ảo và hiệu ứng phản xạ quang học lên bề mặt ảnh dựa trên vector pháp tuyến. |
| **Tùy chọn & Nguồn sáng** | - **Loại nguồn sáng (Light Types):** Spot Light (đèn rọi chùm nón có góc mở và điểm tụ), Point Light (nguồn sáng điểm tỏa đều 360 độ), Directional (ánh sáng song song từ vô cực giả lập ánh nắng mặt trời).<br>- **Thông số điều chỉnh:** Diffuse (tán xạ), Specular (điểm chói phản xạ), Shininess (độ bóng bẩy), Ambient (ánh sáng nền môi trường), màu sắc đèn.<br>- **Bump Map Texture:** Nạp hình ảnh làm bản đồ lồi lõm để ánh sáng bắt dính vào từng thớ vải, hạt da, vân gỗ tạo chiều sâu 3D.<br>- **Interactive On-Screen Handles:** Vòng tròn và tay đòn tương tác trực tiếp trên canvas để chỉnh vị trí và góc chiếu. |
| **Giới hạn & Ràng buộc** | Tác động trực tiếp lên cảm nhận chiều sâu bức ảnh; tiêu hao tài nguyên tính toán GPU khi xếp chồng nhiều nguồn sáng Live Filter. |
| **Kiểm tra Bài học (`P06-03`)** | `curriculum/photo/P06/P06-03.json`<br>- Đã chuẩn hóa đường dẫn menu thành `Layer > New Live Filter Layer > Lighting` và `Layer > New Live Filter Layer > Vignette`.<br>- **Guided Practice:** Thiết lập Spot Light góc 45 độ mô phỏng ánh sáng Rembrandt, chỉnh màu vàng ấm, tăng Bump map 15-20%, phối hợp Live Vignette dìm tối 4 góc.<br>- **Bằng chứng P4:** Đầy đủ cấu trúc hướng dẫn thực hành, checkpoint và tài liệu kỹ thuật `P06_live_filters_effects_guide.md`. |
| **Nguồn tài liệu chính thức** | [Affinity Help Center — Lighting filter](https://affinity.help/photo/en-US.lproj/pages/Filters/filter_lighting.html) |
| **Trạng thái kiểm toán** | **P4 (Đã chuẩn hóa ngữ nghĩa và xác minh nguồn trực tiếp)** |

---

## 3. Phân biệt Tính năng Desktop Thực tế và Mô phỏng Giáo dục (Simulators)

Để đảm bảo tính trung thực tuyệt đối trong đo lường năng lực và kiểm thử, dự án xác lập ranh giới kỹ thuật rõ ràng giữa tính năng phần mềm Affinity Desktop thực tế và các bộ mô phỏng tương tác trên nền tảng Web:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AFFINITY ACADEMY PLATFORM                       │
├───────────────────────────────────┬────────────────────────────────────┤
│  MÔ PHỎNG GIÁO DỤC TRÊN WEB       │  TÍNH NĂNG THỰC TẾ TRÊN DESKTOP    │
│  (Interactive Web Simulators)     │  (Real Desktop Application)        │
├───────────────────────────────────┼────────────────────────────────────┤
│ 1. PenNodeSimulator.tsx:          │ 1. Vector Studio Full Suite:       │
│    - Vẽ đường cong Bézier cơ bản  │    - Corner Tool (VEC-006)         │
│    - Pen & Node Tool (P/A)        │    - Symbols panel (VEC-021)       │
│    - Node types (Sharp/Smooth)    │    - Constraints panel (VEC-023)   │
│    - Đối chiếu đường cong mục tiêu│    - Boolean Compounds mặc định    │
│    * KHÔNG mô phỏng bo vát góc    │    * Học qua hướng dẫn chi tiết &  │
│    * KHÔNG mô phỏng Symbols/Pin   │      thực hành file mẫu .afdesign  │
├───────────────────────────────────┼────────────────────────────────────┤
│ 2. PhotoLayerSimulator.tsx:       │ 2. Pixel Studio Full Suite:        │
│    - Quản lý Layer Stack          │    - Selection Brush (PIX-003)     │
│    - Blend Modes cơ bản           │      với thuật toán Snap to Edges  │
│    - Cọ vẽ mặt nạ (Layer Masking) │    - Live Lighting 3D (PIX-016)    │
│      bằng màu Đen / Trắng         │      với Bump Map & GPU Shaders    │
│    * KHÔNG có Snap to edges       │    - RAW Develop Studio            │
│    * KHÔNG có Marching Ants       │    * Học qua hướng dẫn chi tiết &  │
│    * KHÔNG có 3D GPU Lighting     │      thực hành file mẫu .afphoto   │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Nguyên tắc quản trị bất di bất dịch:
1. **Không ngộ nhận kiểm thử:** Việc Playwright E2E chạy thành công 20/20 trên trình duyệt chỉ chứng minh ứng dụng web (UI, router, simulator, quiz) vận hành đúng mã nguồn. Nó **không chứng minh** học viên đã thành thạo công cụ Affinity trên desktop.
2. **Không ngộ nhận phạm vi simulator:** Hai bộ simulator trên web đóng vai trò là "bước đệm trực quan" giúp học viên nắm bắt bản chất toán học của vector Bézier và nguyên lý mặt nạ thang độ xám (Alpha Channel). Mọi năng lực sản xuất thực chiến đối với Corner Tool, Symbols, Constraints, Selection Brush và Live Lighting đều được rèn luyện trực tiếp trên phần mềm desktop.

---

## 4. Đối chiếu Mẫu số và Trạng thái Inventory Hiện tại

### 4.1. Bảng Đối soát Số liệu Tham chiếu
Dữ liệu kiểm toán đối chiếu với các con số tham chiếu được giữ ổn định nghiêm ngặt:

| Chỉ số kiểm toán | Con số tham chiếu | Số liệu ghi nhận thực tế | Trạng thái đối soát |
| :--- | :---: | :---: | :--- |
| **Tổng số bản ghi trong phạm vi (In-scope)** | **68** | **68** | **Trùng khớp 100% (Không thêm/bớt)** |
| - Năng lực gốc Affinity (Native Capabilities) | 63 | 63 | Trùng khớp |
| - Tích hợp MCP nội bộ dự án (Project MCP) | 5 | 5 | Trùng khớp (tách bạch rõ ràng) |
| **Cấp độ P4 (Đã thực hành trong bài học)** | **50** | **50** | **Trùng khớp (49 native + 1 MCP)** |
| **Cấp độ V1 (Khoảng trống đã kiểm chứng nguồn)**| **17** | **17** | **Trùng khớp (13 native + 4 MCP)** |
| **Cấp độ U0 (Ứng viên chưa xác minh)** | **1** | **1** | **Trùng khớp (`LAY-GAP-2` Table Tool)** |
| **Số lượng loại trừ tường minh (Exclusions)** | **3** | **3** | **Trùng khớp (V2 Persona, StudioLink, Macro legacy)** |
| **Hàng đợi khám phá (Discovery Queue)** | 16 mục | 16 mục | Giữ nguyên bên ngoài mẫu số |

### 4.2. Danh mục 5 Tích hợp MCP của Dự án (Tách biệt khỏi Desktop Native)
1. `AUT-002` (P4): Affinity JavaScript DOM API Core Foundation (có thực hành trong `S01-01`).
2. `MCP-001` (V1): Automated Spread/Page Image Rendering (`render_spread`).
3. `MCP-002` (V1): Automated Selection/Layer Image Rendering (`render_selection`).
4. `MCP-003` (V1): Real-time Headless Script Execution Engine (`execute_script`).
5. `MCP-004` (V1): In-App JavaScript SDK Documentation Bridge (`read_sdk_documentation_topic`).

---

## 5. Kết luận và Khuyến nghị Quản trị TASK-080

### 5.1. Kết quả Đạt được trong Đợt Kiểm toán Này
1. **Chuẩn hóa thành công 5 công cụ P4 dùng nguồn rộng:** `VEC-006` (Corner Tool), `VEC-021` (Symbols panel), `VEC-023` (Constraints panel), `PIX-003` (Selection Brush Tool), và `PIX-016` (Live Lighting Filter). Cả 5 công cụ đều đã có liên kết Help Center chính thức, đường dẫn menu chuẩn hóa, phân loại chuẩn xác và bài học thực hành tương ứng.
2. **Loại bỏ hoàn toàn các thuật ngữ cũ/sai lệch:** Đổi "Symbols Studio" $\to$ "Symbols panel", "Constraints Studio" $\to$ "Constraints panel", giải mã và chuẩn hóa đường dẫn Live Lighting từ "Hourglass" thành `Layer > New Live Filter Layer > Lighting`.
3. **Phân định minh bạch:** Xác lập ranh giới rõ ràng giữa chức năng mô phỏng của simulator trên web và tính năng sản xuất trên phần mềm desktop.

### 5.2. Trạng thái Nghiệm thu TASK-080
*   **Trạng thái ghi nhận:** **`IN_PROGRESS`**
*   **Lý do chưa đóng COMPLETED:**
    - Mặc dù 5 công cụ trọng điểm đã được giải quyết dứt điểm, nhưng trong toàn bộ ma trận 68 bản ghi vẫn còn **2 bản ghi P4** (`VEC-002` Artboard Tool và `PIX-012` Histogram panel) đang ở trạng thái *"Đã tìm thấy tiêu đề/URL trang chính thức nhưng nội dung chi tiết bài viết chưa được trích xuất đầy đủ qua luồng tự động"*.
    - Đồng thời, 17 bản ghi V1 và 1 bản ghi U0 (`LAY-GAP-2`) cần tiếp tục duy trì trạng thái kiểm toán mở cho đến khi có thể đối chiếu trực tiếp trên giao diện desktop thực tế.
    - **Tuân thủ đúng tôn chỉ của Project Owner:** *"Chỉ báo cáo TASK-080 hoàn thành khi tất cả tiêu chí nghiệm thu được xác minh. Các mục chưa đủ bằng chứng phải tiếp tục ở trạng thái chưa xác minh."*

### 5.3. Các bước Tiếp theo
1. Duy trì `TASK-081` ở trạng thái `PENDING` (chờ hoàn tất nghiệm thu đầy đủ TASK-080).
2. Duy trì khóa nghiêm ngặt cổng `BLK-007` (không tự ý soạn các bài học Publisher B02–B10 hay Scripting S02–S10).
3. Chạy toàn bộ 8 bộ kiểm thử Quality Gate để xác nhận tính toàn vẹn kỹ thuật của hệ thống mã nguồn sau khi cập nhật.