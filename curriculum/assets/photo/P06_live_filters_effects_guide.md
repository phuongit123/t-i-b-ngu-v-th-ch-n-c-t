# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P06
## CHỦ ĐỀ: BỘ LỌC THỜI GIAN THỰC & HIỆU ỨNG ÁNH SÁNG (LIVE FILTERS & EFFECTS)

**Tệp tài nguyên:** `P06_live_filters_effects_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Khai thác sức mạnh đồ họa GPU của kiến trúc **Live Filter Layer** trong Affinity Photo: thay đổi bán kính, góc chiếu, cường độ lọc bất kỳ lúc nào mà không suy hao pixel.
2. Nắm vững phương pháp làm nét ảnh chuyên nghiệp: So sánh giữa **Live Unsharp Mask**, **Live Clarity**, và **Live High Pass Filter** (chế độ hòa trộn Soft Light / Overlay).
3. Ứng dụng bộ lọc **Live Lighting Filter** để giả lập nguồn sáng nhân tạo (Spotlight, Point Light, Directional Light) kèm bản đồ lồi lõi (bump maps) tạo chiều sâu 3D.

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Mở một ảnh chân dung cận cảnh, ảnh chụp sản phẩm hoặc nội thất kiến trúc.
2. Tìm biểu tượng chiếc đồng hồ cát ở đáy bảng **Layers Studio (F7)** — đây là lối tắt nhanh nhất để tạo Live Filters.
3. Chú ý: Mọi Live Filter đều sở hữu sẵn một kênh **Mặt nạ tích hợp (Built-in Mask)**. Khi cọ Paint Brush tô màu Đen lên biểu tượng Live Filter, hiệu ứng sẽ bị che giấu cục bộ.

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

#### Bước 1: Kỹ thuật làm nét phi phá hủy (Sharpening Masterclass)
- **Cách 1: Live Clarity Filter:**
  - Vào **Layer > New Live Filter Layer > Sharpen > Clarity** (hoặc chọn từ biểu tượng đồng hồ cát).
  - Tăng Clarity lên `15% - 30%`. Clarity tác động vào độ tương phản dải trung âm (mid-tone local contrast), giúp bức ảnh trong trẻo, nổi khối mà không sinh ra viền sáng gắt (halos).
- **Cách 2: Live High Pass Sharpening:**
  - Thêm **Live High Pass Filter**.
  - Thiết lập **Radius** trong khoảng `1.2 px` đến `2.5 px` (chỉ vừa đủ nhìn thấy đường viền mảnh của chi tiết).
  - Đổi chế độ hòa trộn của lớp này sang **Soft Light** (cho nét mềm tự nhiên) hoặc **Overlay** (cho nét sắc sảo).
  - Vì là Live Filter, bạn có thể nhấp đúp vào thumbnail bất cứ lúc nào để chỉnh lại thông số mà không cần undo lịch sử.

#### Bước 2: Khử nhiễu thông minh (Live Denoise Filter)
- Với những ảnh chụp thiếu sáng ở ISO cao (ISO 3200, 6400):
  - Thêm **Live Denoise Filter**.
  - Tách bạch điều chỉnh giữa 2 thanh trượt:
    - **Luminance:** Khử hạt nhiễu độ sáng (hạt muối tiêu).
    - **Chrominance:** Khử nhiễu màu sắc (đốm xanh đỏ loang lổ).
  - Tinh chỉnh thông số vừa phải để khử sạch sạn màu nhưng vẫn giữ được độ sắc cạnh của mắt và tóc.

#### Bước 3: Tạo hiệu ứng ánh sáng kịch tính với Live Lighting
- Vào **Layer > New Live Filter Layer > Light > Lighting**.
- Trên màn hình xuất hiện một widget điều hướng nguồn sáng trực quan:
  - Chọn loại đèn: **Spot Light** (đèn rọi), **Point Light** (bóng đèn tỏa đều) hoặc **Directional** (ánh sáng mặt trời chiếu song song).
  - Kéo các tay đòn để xoay hướng chiếu, nới rộng góc mở nón sáng (cone angle).
  - Chỉnh màu ánh sáng (ví dụ ánh sáng vàng ấm tương phản với nền xanh lạnh).
  - Tăng nhẹ thanh trượt **Bump** để bề mặt da hoặc vải áo bắt sáng nổi khối 3D sinh động.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ
- [ ] Không có bộ lọc nào được áp dụng dạng Destructive từ menu `Filters > ...` (toàn bộ phải nằm ở dạng Live Filter có biểu tượng đồng hồ cát trong Layers Studio).
- [ ] Dùng cọ mềm màu đen để che bớt hiệu ứng Sharpening ở những vùng da phẳng, chỉ tập trung làm nét mắt, lông mi, môi và trang sức.
