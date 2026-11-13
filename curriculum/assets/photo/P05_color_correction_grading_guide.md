# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P05
## CHỦ ĐỀ: HIỆU CHỈNH & PHỐI MÀU ĐIỆN ẢNH (COLOR CORRECTION & COLOR GRADING)

**Tệp tài nguyên:** `P05_color_correction_grading_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Phân biệt rõ ranh giới giữa **Hiệu chỉnh màu (Color Correction - Sửa lỗi kỹ thuật, cân bằng trắng, độ sáng chuẩn)** và **Phối màu phong cách (Color Grading - Tạo cảm xúc điện ảnh, tone màu nghệ thuật)**.
2. Làm chủ công cụ **Curves** và **Levels**, phân tích biểu đồ **Histogram** để kiểm soát điểm tối nhất (Black Point), điểm sáng nhất (White Point) và gamma trung tính (Midtones).
3. Ứng dụng các công cụ phối màu nâng cao: **HSL Color Wheel**, **Split Toning / Color Balance**, **Gradient Map**, và nạp bảng tra cứu màu 3D (**3D LUT .cube**).

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Mở ảnh chụp phong cảnh ngoài trời hoặc ảnh đường phố chụp lúc ánh sáng chưa chuẩn (bị ám vàng, ám xanh, hoặc thiếu tương phản).
2. Mở Studio **Histogram** và đặt cạnh **Adjustments Studio**.
3. Quan sát các cảnh báo cháy sáng (Clipping Warnings) trên thanh công cụ xem trước nếu cần.

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

#### Bước 1: Đọc Histogram và sửa lỗi cân bằng trắng (White Balance)
- Nhìn vào biểu đồ **Histogram**:
  - Nếu đồ thị dồn hết về mép trái: Ảnh đang bị thiếu sáng nặng (Underexposed), vùng tối bị bết đen (crushed shadows).
  - Nếu đồ thị tràn lệch sang mép phải: Ảnh bị cháy sáng (Overexposed / blown highlights).
  - Mục tiêu cân bằng: Đồ thị trải đều từ trục 0 đến trục 255.
- Thêm lớp **White Balance Adjustment**:
  - Dùng công cụ ống hút (Eyedropper) trên bảng điều khiển nhấp vào một điểm màu xám trung tính (18% Gray) hoặc màu trắng tự nhiên trong ảnh (mảng mây, áo trắng).
  - Tinh chỉnh thanh trượt **Temperature** (Độ ấm: Vàng - Xanh dương) và **Tint** (Sắc độ: Xanh lá - Đỏ tím) cho đến khi sắc tố da hoặc môi trường trung thực.

#### Bước 2: Tối ưu dải sắc với Curves (Đường cong tương phản S-Curve)
- Thêm lớp **Curves Adjustment**:
  - Nhấp chuột tạo điểm neo ở vùng 3/4 đồ thị (Highlights), nhích nhẹ lên trên.
  - Nhấp chuột tạo điểm neo ở vùng 1/4 đồ thị (Shadows), nhích nhẹ xuống dưới.
  - Tạo thành đường cong chữ `S` kinh điển, gia tăng độ tương phản động và làm nổi khối cho toàn bộ khung hình.
  - Chuyển kênh từ **Master** sang **Red**, **Green**, hoặc **Blue** để can thiệp màu sắc theo từng dải sắc tố: Ví dụ ở kênh Blue, nâng nhẹ góc trái dưới để ám xanh vùng tối (cool shadows - phong cách phim nhựa).

#### Bước 3: Phối màu điện ảnh (Color Grading with HSL, LUT & Gradient Map)
- **HSL Adjustment:**
  - Nhấp chọn từng vòng màu sắc riêng lẻ (Ví dụ chọn vòng Màu Cam để chỉnh sáng da; chọn vòng Màu Lục để dìm cỏ úa sang tone vintage).
- **Gradient Map (Bản đồ dải chuyển sắc):**
  - Gán dải màu từ Xanh đen (vùng tối) sang Vàng cam (vùng sáng) - tone Teal & Orange nổi tiếng của Hollywood.
  - Đổi chế độ hòa trộn của lớp Gradient Map sang **Soft Light** hoặc **Overlay**, và giảm **Opacity** xuống `20% - 35%` để hiệu ứng hòa quyện tinh tế.
- **LUT Adjustment (Lookup Table):**
  - Nhấn nút **Load LUT...** và chọn tệp `.cube` chuyên nghiệp được cung cấp. Affinity Photo sẽ ánh xạ toàn bộ bảng màu theo chuẩn profile điện ảnh ngay lập tức.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ
- [ ] Không có kênh màu nào bị bết đen tuyệt đối (0) hoặc cháy trắng tuyệt đối (255) ngoài ý muốn (kiểm tra trên Histogram).
- [ ] Tách biệt rõ ràng 2 nhóm lớp: Group `[Color Correction]` nằm dưới và Group `[Color Grading]` nằm trên.
