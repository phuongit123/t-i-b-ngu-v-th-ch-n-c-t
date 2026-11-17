# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D01
## CHỦ ĐỀ: THIẾT LẬP BẢN VẼ ARTBOARD ĐA THIẾT BỊ (RESPONSIVE CANVAS)

- **Tệp tài nguyên:** `D01_artboard_starter_guide.md`
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
- **Phiên bản mục tiêu:** Affinity (kiểm chứng trên Affinity 3.3.3)
- **Persona áp dụng:** Vector Persona (không gian làm việc đồ họa vector)

---

### 1. MỤC TIÊU THỰC HÀNH
1. Thiết lập tài liệu mới có bật **Artboard** (khung bản vẽ độc lập) với kích thước và hệ màu chuẩn cho thiết kế web/UI.
2. Tạo và đặt tên nhiều **Artboard** song song bằng **Artboard Tool** (công cụ tạo và quản lý khung bản vẽ) để mô phỏng màn hình Desktop, Tablet và Mobile.
3. Cấu hình hệ thống bắt dính (**Snapping**) và lưới căn gióng **8px** giúp căn chỉnh bố cục sắc nét đến từng điểm ảnh.

---

### 2. THIẾT LẬP TÀI LIỆU MỚI (DESKTOP APP)
Mở Affinity và nhấn `Ctrl+N` (Windows) / `Cmd+N` (macOS), sau đó cấu hình các thông số sau:
1. **Nhóm tài liệu (Document Type):** `Web` / `Device`
2. **Kích thước trang:** Chiều rộng (`Width`) `1920 px`, chiều cao (`Height`) `1080 px`
3. **Hệ màu (Color Format):** `RGB/8`, **Hồ sơ màu (Profile):** `sRGB IEC61966-2.1`
4. **Độ phân giải:** `72 DPI` (chuẩn Web) hoặc `144 DPI` (màn hình Retina)
5. **Artboard:** Tích chọn `[x] Create Artboard`, sau đó đặt tên artboard đầu tiên là `Desktop-1920` trong **Layers Studio** (bảng quản lý lớp).

---

### 3. QUY TRÌNH THỰC HÀNH TỪNG BƯỚC

#### Bước 1: Thêm các Artboard cho Tablet và Mobile
Dùng **Artboard Tool** (truy cập từ thanh công cụ bên trái; nhập kích thước tùy chỉnh theo giao diện bản Affinity đang dùng):
- Artboard 2 — **Tablet Viewport:** rộng `768 px` × cao `1024 px`, đặt tên `Web-Tablet`.
- Artboard 3 — **Mobile Viewport:** rộng `375 px` × cao `812 px`, đặt tên `Web-Mobile`.
- Dùng **Move Tool (V)** (công cụ chọn và di chuyển đối tượng) sắp xếp các artboard nằm ngang cạnh nhau với khoảng cách đều nhau (ví dụ `100 px`).

#### Bước 2: Cấu hình Snapping & Lưới 8px
- Bật **Snapping** (phím `;` hoặc nhấn biểu tượng nam châm trên thanh công cụ trên cùng). Lưu ý: `Ctrl+;` / `Cmd+;` là phím bật/tắt đường dẫn hướng (**Guides**).
- Trong bảng tùy chọn Snapping, bật **Snap to Artboards**, **Snap to Object Bounding Boxes** và **Include Bounding Box Midpoints**.
- Mở lưới qua menu **View > Show Grid** (`Ctrl+'` / `Cmd+'`), sau đó vào **View > Grid and Axis Manager** để đặt bước lưới cơ bản `8 px`.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ (CHALLENGE CHECKPOINTS)
- [ ] Ba artboard `Desktop-1920`, `Web-Tablet` và `Web-Mobile` có kích thước pixel chính xác và được đặt tên rõ ràng trong **Layers Studio**.
- [ ] Bật chế độ xem điểm ảnh **View > View Mode > Pixels** để kiểm tra đường nét hiển thị sắc nét, không bị nhòe bán điểm ảnh.
- [ ] Chuyển qua **Export Persona** (nhấn biểu tượng ở thanh công cụ góc trên bên trái) để xác nhận cả 3 artboard tự động xuất hiện trong bảng **Slices**.
