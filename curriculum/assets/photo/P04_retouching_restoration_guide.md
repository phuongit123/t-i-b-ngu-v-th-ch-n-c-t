# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P04
## CHỦ ĐỀ: CHỈNH SỬA CHÂN DUNG & PHỤC HỒI ẢNH (RETOUCHING & RESTORATION)

**Tệp tài nguyên:** `P04_retouching_restoration_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Sử dụng thành thạo nhóm công cụ làm sạch điểm khuyết: **Inpainting Brush Tool**, **Healing Brush Tool (J)**, **Clone Stamp Tool (S)** và **Patch Tool**.
2. Hiểu và áp dụng quy tắc làm sạch phi phá hủy bằng cách tạo một **Empty Pixel Layer** đặt nguồn lấy mẫu là **Current Layer & Below**.
3. Nắm vững kỹ thuật cao cấp **Frequency Separation (Tách tần số)** để xử lý mịn da tự nhiên mà không làm mất vân bề mặt lỗ chân lông hay kết cấu da thật.

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Mở một ảnh chân dung độ phân giải cao hoặc ảnh tài liệu cũ cần phục chế.
2. Kiểm tra thanh công cụ Tools: Tìm nhóm biểu tượng cọ cứu thương (Healing/Inpainting). Nhấn giữ hoặc nhấn `J` để chuyển đổi giữa các biến thể công cụ.
3. Tạo thói quen: **Tuyệt đối không thao tác trực tiếp lên lớp ảnh gốc Background!**

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

#### Bước 1: Thiết lập lớp làm sạch phi phá hủy (Non-Destructive Touchup)
- Nhấn tổ hợp phím `Ctrl+Shift+N` (Win) / `Cmd+Shift+N` (Mac) hoặc nhấn biểu tượng New Pixel Layer ở đáy Layers Studio.
- Đặt tên lớp mới là `Blemish Cleanup`.
- Chọn công cụ **Inpainting Brush Tool** (cọ vẽ thông minh với thuật toán nội suy lấp đầy điểm khuyết dựa trên ngữ cảnh xung quanh).
- **Điểm then chốt trên Context Bar:** Chuyển mục **Source** từ `Current Layer` sang `Current Layer & Below` (hoặc `All Layers`).
- Nhấp nhẹ hoặc quét cọ qua từng đốm mụn, sợi tóc bay lòa xòa hoặc vết trầy xước. Pixel mới được sinh ra và ghi đè trên lớp `Blemish Cleanup`, trong khi ảnh gốc bên dưới vẫn nguyên vẹn 100%.

#### Bước 2: Tinh chỉnh bằng Clone Stamp Tool & Healing Brush Tool
- Khi cần sao chép có chủ đích từ một vùng vân da tương đồng:
  - Chọn **Clone Stamp Tool (S)** hoặc **Healing Brush Tool (J)**.
  - Đảm bảo Source đặt là `Current Layer & Below`.
  - Giữ phím `Alt` (Win) / `Option` (Mac) và nhấp chuột vào vùng da mẫu sạch để định vị tọa độ lấy mẫu (Sample Source).
  - Thả phím Alt và chấm cọ lên vùng da cần vá. Healing Brush sẽ tự động tính toán ánh sáng và sắc thái vùng biên để hòa nhập mượt mà.

#### Bước 3: Đỉnh cao kỹ thuật — Tách tần số (Frequency Separation)
- Trong Affinity Photo, quy trình Frequency Separation được tự động hóa chuẩn xác qua menu:
  - Chọn lớp ảnh chính, vào **Filters > Frequency Separation...**
- Một hộp thoại trực quan xuất hiện, chia hình ảnh thành 2 lớp riêng biệt:
  - **Low Frequency (Tần số thấp):** Chứa thông tin màu sắc, sắc thái ánh sáng, độ chuyển bóng mịn (Tone & Color).
  - **High Frequency (Tần số cao):** Chứa thông tin cấu trúc vi mô, kết cấu da, lỗ chân lông, sợi lông mày, nếp nhăn chi tiết (Texture & Details).
- Điều chỉnh thanh trượt **Radius**: Tăng bán kính (thường từ `2.0 px` đến `6.0 px`) cho đến khi trên khung xem trước, các vết mẩn đỏ và đốm màu biến mất vào lớp Low Frequency, nhưng các hạt da chi tiết vẫn giữ nguyên vẹn trên lớp High Frequency. Nhấn **Apply**.
- **Thao tác xử lý chuyên nghiệp:**
  - Để làm mịn mảng màu da: Chọn lớp `Low Frequency`, dùng cọ vẽ mềm hoặc công cụ Gaussian Blur khoanh vùng để làm mịn các vùng loang lổ.
  - Để xóa mụn hoặc sẹo sâu: Chọn lớp `High Frequency`, dùng **Clone Stamp Tool** (với Source đặt là `Current Layer`) để dập vết mụn mà không hề làm đổi màu mảng da xung quanh!

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ
- [ ] Mọi thao tác xóa mụn và nốt ruồi được lưu trên một layer riêng, ảnh gốc không hề bị vẽ đè.
- [ ] Da mặt sau khi chỉnh sửa giữ được kết cấu chân thực (pore texture), không bị bết dính như tượng sáp hoặc hiệu ứng làm mịn quá đà của app di động.
- [ ] Lớp Frequency Separation được tổ chức trong Group gọn gàng.
