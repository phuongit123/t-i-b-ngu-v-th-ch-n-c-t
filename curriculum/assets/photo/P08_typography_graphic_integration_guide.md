# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P08
## CHỦ ĐỀ: TÍCH HỢP CHỮ NGHỆ THUẬT & ĐỒ HỌA VECTOR (TYPOGRAPHY & GRAPHIC INTEGRATION)

**Tệp tài nguyên:** `P08_typography_graphic_integration_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Phân biệt và ứng dụng chính xác giữa **Artistic Text Tool (T)** (dành cho tiêu đề lớn, kéo dãn kích thước trực quan) và **Frame Text Tool (T)** (dành cho khối văn bản đoạn văn bản, tự động xuống dòng).
2. Tinh chỉnh các tham số Typography chuyên nghiệp trong **Character Studio** và **Paragraph Studio**: Kerning, Tracking, Leading, Baseline Shift, OpenType Stylistic Sets.
3. Ứng dụng hệ thống hiệu ứng lớp thời gian thực **Layer Effects (Quick FX / Studio FX)**: Gaussian Blur, Outer Shadow, Inner Glow, Bevel/Emboss, Color Overlay, 3D Outline để thiết kế poster quảng cáo và bìa tạp chí ấn tượng.

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Mở một tác phẩm chân dung hoặc ảnh phong cảnh đã chỉnh sửa màu ở các module trước.
2. Mở Studio **Character** và **Paragraph** (vào `Window > Text > Character` và `Window > Text > Paragraph`).
3. Mở Studio **Quick FX** (biểu tượng `fx` ở thanh dock hoặc chân Layers panel).

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

#### Bước 1: Soạn thảo tiêu đề với Artistic Text Tool
- Chọn công cụ **Artistic Text Tool (T)** (hoặc nhấn phím `T`).
- Nhấp và kéo rê chuột trên canvas để xác định trực tiếp chiều cao mong muốn của chữ cái đầu tiên, sau đó gõ tiêu đề (ví dụ: `SUMMER EDITORIAL`).
- Trong bảng **Character Studio**:
  - Chọn font chữ mang phong cách mạnh mẽ (Display Font hoặc Serif hiện đại).
  - Tăng **Tracking** (khoảng cách giữa tất cả các chữ cái) lên `+150` đến `+300 ‰` để tạo cảm giác sang trọng, thoáng đãng cho poster thời trang.
  - Sử dụng **Optical Kerning** hoặc điều chỉnh phím tắt `Alt+Mũi tên trái/phải` khi con trỏ đặt giữa 2 ký tự đặc thù (như `AV`, `To`, `WA`).

#### Bước 2: Bố cục đoạn nội dung với Frame Text Tool
- Chuyển sang **Frame Text Tool (T)**.
- Quét một khung hình chữ nhật ở góc phần ba dưới của ảnh.
- Nhập thông điệp mô tả phụ đề hoặc thông tin sự kiện.
- Trong bảng **Paragraph Studio**:
  - Căn lề trái hoặc căn đều (Justified Left).
  - Điều chỉnh **Leading** (khoảng cách dòng) ở mức `120% - 140%` để chữ không bị dính sát vào nhau, tăng cường khả năng đọc trên màn hình và bản in.

#### Bước 3: Đánh bóng hiệu ứng với Layer FX (Quick FX)
- Chọn lớp Text, mở bảng **Quick FX (fx)**:
  - **Outer Shadow:** Tạo bóng đổ tách chữ khỏi nền phức tạp. Đặt Radius `15 px`, Opacity `40%`, Blend Mode `Multiply`.
  - **Bevel / Emboss:** Giả lập hiệu ứng chạm nổi 3D kim loại. Đặt Type là `Inner Bevel`, điều chỉnh góc chiếu sáng phù hợp với nguồn sáng chính của bức ảnh.
  - **Color Overlay:** Nhuộm màu đồng nhất cho chữ hoặc gán Gradient trực tiếp bằng **Fill Tool (G)**.

#### Bước 4: Kỹ thuật lồng chữ sau chủ thể (Text Behind Subject)
- Đặt layer Text nằm ngay bên trên Background, nhưng nằm dưới Layer Subject đã được tách nền bằng Mask (ở module P02).
- Kết quả: Tiêu đề poster sẽ chìm tự nhiên ra phía sau lưng người mẫu, tạo cảm giác không gian ba chiều cực kỳ ấn tượng và chuyên nghiệp.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ
- [ ] Chữ vẫn ở dạng vector văn bản sống (Live editable text), không bị rasterize thành pixel, cho phép chỉnh sửa chính tả bất cứ lúc nào.
- [ ] Tỷ lệ phân cấp thị giác (Visual Hierarchy) rõ ràng giữa Tiêu đề lớn, Tiêu đề phụ và Đoạn nội dung.
- [ ] Hiệu ứng FX hòa hợp với ánh sáng tự nhiên của bức ảnh nền.
