# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P02
## CHỦ ĐỀ: KỸ THUẬT VÙNG CHỌN & MẶT NẠ PIXEL (SELECTIONS & MASKING)

**Tệp tài nguyên:** `P02_selections_masking_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Sử dụng thành thạo nhóm công cụ chọn vùng pixel: **Selection Brush Tool (W)**, **Freehand Selection Tool (L)**, và **Flood Select Tool (W)**.
2. Nắm vững cơ chế tinh chỉnh vùng chọn nâng cao thông qua bảng điều khiển **Refine Selection Studio** (Border, Smooth, Feather, Ramp).
3. Chuyển đổi vùng chọn linh hoạt thành **Layer Mask (Mặt nạ phi phá hủy)** để tách nền chủ thể mượt mà, giữ trọn chi tiết sợi tóc và cạnh mềm.

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Khởi động Affinity Photo 3.0, mở tệp hình ảnh chân dung hoặc mẫu vật thể có nền tương phản vừa phải.
2. Nếu sử dụng tệp thực hành kèm sẵn từ khóa học, mở tệp `curriculum/assets/photo/P01_starter.afphoto` hoặc tạo tài liệu mới:
   - Kích thước: `3840 x 2160 px` (4K UHD) hoặc ảnh chân dung tối thiểu `2000 px`.
   - Hệ màu: `RGB / 16-bit` (sRGB IEC61966-2.1) để tối ưu dải chuyển sắc (smooth gradation).
3. Đảm bảo bảng **Layers Studio (F7)** đang mở ở thanh dock bên phải.

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC (STEP-BY-STEP WORKFLOW)

#### Bước 1: Quét vùng chọn thô bằng Selection Brush Tool
- Chọn công cụ **Selection Brush Tool (W)** trên thanh công cụ Tools (bên trái).
- Trên thanh Context Bar phía trên:
  - Chọn chế độ **Add** (thêm vùng chọn).
  - Bật tính năng **Snap to Edges** (tự động bắt dính biên theo độ tương phản thuật toán).
  - Điều chỉnh đường kính nét cọ bằng phím tắt `[` (nhỏ lại) và `]` (lớn hơn).
- Quét nhanh bên trong chủ thể. Nhờ tính năng Snap to Edges, đường kiến bò (marching ants) sẽ tự động bám sát đường viền chủ thể.
- Nếu lỡ quét lan ra nền: Giữ phím `Alt` (Windows) / `Option` (macOS) để chuyển cọ sang chế độ **Subtract** và quét loại bỏ vùng thừa.

#### Bước 2: Tinh chỉnh vùng biên với Refine Selection Studio
- Trong khi vùng chọn vẫn đang nhấp nháy, nhấn nút **Refine...** trên thanh Context Bar.
- Hộp thoại **Refine Selection** xuất hiện:
  - **Preview:** Chọn `Overlay` (vùng ngoài chuyển sang màu đỏ trong suốt) hoặc `Black / White` để nhìn rõ viền.
  - **Adjustment Brush:** Dùng cọ quét qua các sợi tóc li ti, lông thú hoặc mép áo mờ. Affinity Photo sẽ tính toán lại độ trong suốt từng pixel (sub-pixel edge calculation).
  - **Smooth:** Tăng lên `1 - 2 px` nếu viền bị răng cưa.
  - **Feather:** Đặt `0.5 - 1.0 px` để mép cắt không bị sắc lẹm giả tạo.
  - **Ramp:** Điều chỉnh co hoặc giãn viền vùng chọn (-100% đến +100%).
  - **Output:** Chọn `Mask` (Mặt nạ lớp) hoặc `New Layer with Mask`.
- Nhấn **Apply**.

#### Bước 3: Quản lý và chỉnh sửa mặt nạ phi phá hủy (Layer Mask)
- Quan sát bảng **Layers (F7)**: Một lớp con **Mask** đã được gắn trực tiếp vào layer ảnh gốc.
- **Quy tắc vàng của Mặt nạ:**
  - `Trắng hiển thị (White Reveals)`: Giữ lại pixel.
  - `Đen che giấu (Black Conceals)`: Làm trong suốt pixel.
  - `Xám bán trong suốt (Gray Transparency)`: Làm mờ nhẹ chuyển tiếp.
- Dùng công cụ **Paint Brush Tool (B)** với màu Đen để xóa thêm chi tiết thừa, hoặc màu Trắng để lấy lại chi tiết vô tình bị ẩn.
- Nhấn `Ctrl+I` (Win) / `Cmd+I` (Mac) khi đang chọn thumbnail Mask để đảo ngược mặt nạ ngay lập tức.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ (CHALLENGE CHECKPOINTS)
- [ ] Vùng tóc hoặc biên mềm được giữ lại tự nhiên, không xuất hiện viền trắng sáng (halo/fringe).
- [ ] Lớp ảnh gốc vẫn ở trạng thái nguyên vẹn 100%, không bị xóa vĩnh viễn (destructively erased).
- [ ] Thử tắt biểu tượng checkmark trên Mask trong Layers Studio: Ảnh gốc lập tức trở lại đầy đủ.
