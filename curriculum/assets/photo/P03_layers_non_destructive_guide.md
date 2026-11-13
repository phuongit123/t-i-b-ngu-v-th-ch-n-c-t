# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P03
## CHỦ ĐỀ: HỆ THỐNG LỚP & CHẾ ĐỘ HÒA TRỘN PHI PHÁ HỦY (LAYERS & BLEND MODES)

**Tệp tài nguyên:** `P03_layers_non_destructive_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Phân biệt chính xác giữa **Pixel Layer** (lớp điểm ảnh thuần túy), **Image Layer** (lớp ảnh nhúng thông minh giữ nguyên độ phân giải gốc), **Adjustment Layer** (lớp điều chỉnh màu toán học) và **Live Filter Layer** (lớp bộ lọc thời gian thực).
2. Hiểu bản chất toán học của các nhóm chế độ hòa trộn (**Blend Modes**): Nhóm làm tối (Multiply), Nhóm làm sáng (Screen), Nhóm tăng tương phản (Overlay / Soft Light) và Nhóm rực màu (Color Dodge).
3. Thực hành kỹ thuật **Clipping (Lồng lớp con)** để giới hạn hiệu ứng điều chỉnh cục bộ cho một đối tượng riêng biệt thay vì ảnh hưởng lên toàn bộ tài liệu.

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Tạo một tài liệu mới hoặc mở ảnh phong cảnh/sản phẩm bất kỳ.
2. Thiết lập độ sâu màu: `RGB / 16-bit` để ngăn ngừa hiện tượng đứt gãy dải sắc (color banding) khi xếp chồng nhiều lớp hòa trộn phức tạp.
3. Mở sẵn các Studio: **Layers (F7)**, **Adjustments**, và **Histogram**.

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

#### Bước 1: Khám phá các loại Layer trong Affinity Photo
- **Image Layer:** Khi kéo thả trực tiếp một tệp ảnh từ Explorer/Finder vào canvas, Affinity Photo coi đây là một `(Image)`. Lớp này giữ nguyên dữ liệu gốc bất kể bạn phóng to thu nhỏ bao nhiêu lần. Nếu muốn vẽ pixel hoặc dùng công cụ xóa/clone lên trên, bạn phải nhấp chuột phải chọn **Rasterise...** để chuyển thành `(Pixel)`.
- **Adjustment Layer:** Nhấn vào biểu tượng vòng tròn bán nguyệt ở đáy Layers panel, chọn **Curves** hoặc **HSL**. Một lớp điều chỉnh xuất hiện với dung lượng bộ nhớ xấp xỉ 0 byte nhưng có khả năng thay đổi toàn diện ánh sáng/màu sắc bên dưới.
- **Live Filter Layer:** Nhấn vào biểu tượng đồng hồ cát ở đáy Layers panel, chọn **Live Gaussian Blur** hoặc **Live High Pass**. Tham số bán kính mờ có thể tinh chỉnh lại bất cứ lúc nào.

#### Bước 2: Ứng dụng các Blend Mode kinh điển
- **Nhóm Darken (Làm tối) — Tiêu biểu là Multiply:**
  - Công thức: `Kết quả = (A × B) / 255`.
  - Đặc tính: Màu trắng (255) trở nên trong suốt 100%, màu đen giữ nguyên. Rất thích hợp để lồng chi tiết bóng đổ, tạo chất liệu giấy báo, hoặc ghép các vết dơ bẩn lên bề mặt.
- **Nhóm Lighten (Làm sáng) — Tiêu biểu là Screen:**
  - Công thức: `Kết quả = 255 - ((255 - A) × (255 - B)) / 255`.
  - Đặc tính: Màu đen (0) trở nên trong suốt 100%, màu trắng giữ nguyên. Cực kỳ lý tưởng để ghép tia sáng (light rays), ngọn lửa, khói trắng hoặc pháo hoa từ ảnh nền đen.
- **Nhóm Contrast (Tương phản) — Tiêu biểu là Overlay & Soft Light:**
  - Kết hợp Multiply cho vùng tối và Screen cho vùng sáng. Màu xám trung tính (50% Gray / RGB 128, 128, 128) trở nên hoàn toàn vô hình. Ứng dụng trong kỹ thuật Dodge & Burn và tạo khối High Pass sharpening.

#### Bước 3: Kỹ thuật lồng ghép lớp điều chỉnh (Clipping / Child Layer)
- Kéo thả lớp **Curves Adjustment** vào ngay bên dưới và chếch sang phải tên của một Layer hình ảnh cụ thể trong Layers Studio.
- Nhận thấy biểu tượng mũi tên hoặc sự thụt lề biểu thị lớp Curves đã trở thành lớp con (**Child Layer**).
- Kết quả: Giờ đây Curves chỉ tác động lên riêng biệt hình ảnh đó; các layer khác bên dưới hoàn toàn không bị ảnh hưởng.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ
- [ ] Tạo được ít nhất 1 lớp điều chỉnh Curves lồng vào một đối tượng cụ thể (Clipping).
- [ ] Áp dụng một lớp kết cấu texture với chế độ hòa trộn Multiply hoặc Screen và loại bỏ phần thừa mà không dùng tẩy cục bộ (Eraser).
- [ ] Layer stack được đặt tên rõ ràng, nhóm thành Group (`Ctrl+G` / `Cmd+G`).
