# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P09
## CHỦ ĐỀ: XỬ LÝ ẢNH RAW & QUY TRÌNH NHIẾP ẢNH NÂNG CAO (RAW DEVELOP & BATCH WORKFLOW)

**Tệp tài nguyên:** `P09_raw_develop_workflow_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Develop Persona & Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Nắm vững cơ chế vận hành của **Develop Persona** trong môi trường xử lý màu **32-bit Floating Point (HDR)** không giới hạn dải sáng.
2. Hiểu bản chất tệp RAW (CR2/CR3, NEF, ARW, DNG): cảm biến máy ảnh thu nhận dữ liệu tuyến tính (linear sensor data), chưa bị nén JPEG hay áp đặt profile màu cố định.
3. Làm chủ các bảng điều khiển chuyên sâu: **Basic (Exposure, Black Point, White Balance, Shadows, Highlights)**, **Lens (Khử quang sai Chromatic Aberration & méo hình ống kính)**, **Details (Khử nhiễu cảm biến)** và **Tones**.
4. Thiết lập quy trình xử lý ảnh hàng loạt tự động (**Batch Processing & Macros**) để xử lý hàng trăm bức ảnh cùng lúc.

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Khi mở bất kỳ tệp RAW nào trong Affinity Photo, ứng dụng sẽ tự động chuyển thẳng vào **Develop Persona** (biểu tượng chiếc máy ảnh chuyên nghiệp màu hổ phách).
2. Lưu ý quan trọng trên thanh Context Bar:
   - Mục **Output:** Cho phép xuất dữ liệu sang Photo Persona dưới dạng `Pixel Layer (16-bit / 32-bit)` hoặc `RAW Layer (Embedded / Linked)` — tính năng cho phép nhấp đúp quay lại Develop Persona bất kỳ lúc nào để chỉnh lại thông số sensor gốc!

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

#### Bước 1: Khôi phục dải động (Dynamic Range Recovery) trong Basic Panel
- Mở bảng **Basic**:
  - Bật biểu tượng **Show Clipped Highlights** (phím `W`) và **Show Clipped Shadows** (phím `B`) trên toolbar để hiển thị các vùng bị cháy sáng (màu đỏ) hoặc mất chi tiết tối (màu xanh).
  - Kéo thanh trượt **Highlights** sang trái (giá trị âm) để kéo lại chi tiết các đám mây bị cháy trên bầu trời.
  - Kéo thanh trượt **Shadows** sang phải (giá trị dương) để mở sáng chi tiết các góc khuất tán cây hay vách đá.
  - Tinh chỉnh **Black Point** để giữ cho màu đen có độ sâu thăm thẳm mà không bị đục mờ.
  - Cân bằng trắng với **White Balance** (nhiệt độ K và sắc thái Tint).

#### Bước 2: Hiệu chỉnh quang học ống kính (Lens Correction)
- Mở bảng **Lens**:
  - Tích chọn **Automatic Lens Correction**: Affinity Photo tự động đọc siêu dữ liệu EXIF của tệp ảnh để nhận diện model máy ảnh và ống kính, tự động bù méo hình (barrel/pincushion distortion).
  - Tích chọn **Remove Chromatic Aberration**: Thuật toán tự động khử các viền tím (purple fringing) và viền xanh lục quang học thường xuất hiện ở rìa các chi tiết tương phản mạnh (cành cây ngược sáng).
  - Dùng công cụ **Defringe** thủ công nếu viền tím quá nặng.

#### Bước 3: Phát triển ảnh sang Photo Persona (Develop)
- Nhấn nút **Develop** (màu xanh ở góc trên bên trái).
- Toàn bộ dữ liệu 32-bit float được chuyển tiếp nguyên vẹn sang **Photo Persona** để tiếp tục các công đoạn chỉnh sửa lớp, cắt ghép và hiệu ứng.

#### Bước 4: Tự động hóa hàng loạt với Batch Processing & Macros
- Khi cần áp dụng một công thức màu hoặc chuẩn kích thước cho 100 bức ảnh:
  - Mở bảng **Macro Studio** (`Window > Macro`), nhấn nút ghi **Record (vòng đỏ)**, thực hiện các bước chỉnh màu chuẩn, nhấn **Stop** và lưu macro vào thư viện.
  - Vào menu **File > New Batch Job...**:
    - Chọn thư mục chứa toàn bộ ảnh RAW hoặc ảnh gốc.
    - Chọn thư mục đích xuất ra.
    - Chọn định dạng đầu ra (JPEG 90%, WebP hoặc TIFF 16-bit).
    - Thêm Macro vừa tạo vào danh sách xử lý tự động.
    - Nhấn **OK**: Affinity Photo sẽ tận dụng đa nhân CPU/GPU để xuất ảnh hàng loạt tốc độ cao.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ
- [ ] Khôi phục thành công các chi tiết mây trời bị cháy sáng bằng thanh trượt Highlights trong Develop Persona.
- [ ] Không còn vết viền tím quang học (Chromatic Aberration) xuất hiện ở các rìa chi tiết cành cây hoặc mép áo.
- [ ] Tạo và chạy thử nghiệm một tác vụ Batch Job xuất 3 ảnh thử nghiệm với kích thước chuẩn xác.
