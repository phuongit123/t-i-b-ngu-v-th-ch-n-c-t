# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P10
## CHỦ ĐỀ: XUẤT BẢN, ĐÓNG GÓI & QUY TRÌNH CHUYÊN NGHIỆP (EXPORT PERSONA & PRODUCTION)

**Tệp tài nguyên:** `P10_export_delivery_production_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Export Persona & Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Làm chủ **Export Persona**: Phân chia tài liệu thành nhiều lát cắt (**Slices**) độc lập, xuất đa định dạng (Multi-format) và đa tỷ lệ (1x, 2x, 3x) chỉ bằng một cú nhấp chuột.
2. Hiểu và áp dụng tính năng **Continuous Export (Xuất nền tự động)**: Tự động kết xuất lại ảnh ra thư mục đích ngay khi nhấn Lưu tài liệu (`Ctrl+S` / `Cmd+S`).
3. Nắm vững sự khác biệt giữa các chuẩn không gian màu (**sRGB, Adobe RGB 1998, Display P3, ProPhoto RGB**) và các định dạng hiện đại (**WebP, JPEG XL, OpenEXR 32-bit, TIFF 16-bit, PSD tương thích**).
4. Thực hiện đồ án tốt nghiệp Track 2: Hoàn thiện một tác phẩm nhiếp ảnh thương mại chuẩn từ tệp RAW đến thành phẩm bàn giao đa kênh.

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Mở tác phẩm ảnh chân dung, sản phẩm hoặc phong cảnh hoàn chỉnh nhất bạn đã xây dựng qua các module P01 đến P09.
2. Chuyển sang **Export Persona** (biểu tượng lát cắt hình vuông chia 4 ở góc trên bên trái thanh công cụ Toolbar).
3. Đảm bảo bảng **Slices Studio** và **Export Options Studio** đang mở.

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

#### Bước 1: Quản lý không gian màu & Hồ sơ màu ICC (Color Profiles)
- Trước khi xuất ảnh, phải xác định đúng kênh truyền thông:
  - **Môi trường Web, Mạng xã hội, Điện thoại phổ thông:** Luôn xuất về không gian màu chuẩn **sRGB IEC61966-2.1**. Nếu xuất Adobe RGB hoặc ProPhoto RGB lên web, trình duyệt sẽ hiển thị sai lệch, khiến ảnh bị nhạt nhòa, bạc màu!
  - **Thiết bị Apple & Màn hình cao cấp (iPhone, iPad, MacBook):** Xuất định dạng **Display P3** để tận dụng dải màu rộng (Wide Color Gamut).
  - **In ấn mỹ thuật & Tạp chí chất lượng cao (Fine Art Printing):** Giữ profile **Adobe RGB (1998)** ở độ sâu **16-bit**.
- Kiểm tra hoặc chuyển đổi profile tại: `Document > Convert Format / ICC Profile...`

#### Bước 2: Tạo lát cắt (Slices) trong Export Persona
- Trong **Export Persona**:
  - Theo mặc định, Affinity Photo tự động tạo sẵn một lát cắt bao quanh toàn bộ khung hình, gọi là `[Page 1]` hoặc `[Document]`.
  - Bạn có thể dùng công cụ **Slice Tool (S)** để quét thêm các lát cắt phụ: Ví dụ cắt riêng khung ảnh vuông 1:1 cho Instagram Post, cắt khung 9:16 cho TikTok/Story, hoặc cắt riêng chi tiết logo/chân dung.
- Trong bảng **Slices Studio**:
  - Nhấp vào mũi tên mở rộng của Slice.
  - Thêm các cấu hình xuất đồng thời:
    - `1x` (Kích thước thực tế): Định dạng **WebP** chất lượng 85%.
    - `2x` (Độ phân giải siêu nét Retina): Định dạng **JPEG** chất lượng 90%.
    - `Original`: Định dạng **TIFF 16-bit** không nén để lưu trữ kho tư liệu gốc (Archival Master).

#### Bước 3: Kích hoạt Continuous Export (Xuất nền tự động)
- Nhấn nút **Export Slices** lần đầu tiên, chọn thư mục đích trên máy tính (ví dụ `C:\output_production\`).
- Đánh dấu tích vào ô tròn **Continuous** cạnh lát cắt trong Slices Studio.
- Kể từ thời điểm này, bất cứ khi nào bạn quay lại Photo Persona, chỉnh sửa một layer bất kỳ và nhấn `Ctrl+S` (Win) / `Cmd+S` (Mac) để lưu tệp `.afphoto`, engine nền tảng của Affinity Photo sẽ **tự động kết xuất lại toàn bộ các tệp WebP, JPEG, TIFF** ra thư mục đích mà không cần bất kỳ thao tác thủ công nào!

---

### 4. ĐỒ ÁN TỐNG KẾT TRACK 2 (CAPSTONE PROJECT)
Thực hiện toàn bộ quy trình chuyên nghiệp 6 giai đoạn:
1. `Develop RAW:` Khôi phục chi tiết cháy sáng và cân bằng trắng chuẩn xác.
2. `Non-Destructive Cleanup:` Xóa rác, đốm mụn trên Empty Pixel Layer.
3. `Frequency Separation:` Làm mịn da tự nhiên, giữ trọn vẹn kết cấu lỗ chân lông.
4. `Color Grading:` Phối màu điện ảnh với Curves, HSL và LUT.
5. `High Pass Sharpening:` Tăng cường độ sắc sảo cho mắt và chi tiết sản phẩm.
6. `Export Persona:` Xuất tự động bộ ảnh 3 kích thước (Web 1x, Retina 2x, Master TIFF 16-bit sRGB).
