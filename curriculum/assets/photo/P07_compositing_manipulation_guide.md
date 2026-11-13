# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE P07
## CHỦ ĐỀ: KỸ THUẬT GHÉP ẢNH & THAO TÁC KHÔNG GIAN (COMPOSITING & MANIPULATION)

**Tệp tài nguyên:** `P07_compositing_manipulation_guide.md`  
**Phân loại tài nguyên:** `GUIDE_DOCUMENT`  
**Phiên bản mục tiêu:** Serif Affinity Photo 3.0+ (Tested in Affinity 3.3.3)  
**Persona áp dụng:** Photo Persona  

---

### 1. MỤC TIÊU THỰC HÀNH
1. Nắm vững 4 yếu tố cốt lõi quyết định sự chân thực của một tác phẩm cắt ghép (Compositing):
   - **Góc phối cảnh (Perspective & Horizon Line)**
   - **Góc và chất lượng nguồn sáng (Direction & Softness of Light)**
   - **Cân bằng sắc thái & độ bão hòa (Color Temperature & Saturation)**
   - **Độ sâu trường ảnh & sương mù không khí (Depth of Field & Atmospheric Perspective)**
2. Sử dụng công cụ **Live Perspective Tool** và **Live Mesh Warp** để uốn nắn bề mặt theo góc nhìn không gian 3 chiều.
3. Kỹ thuật tạo bóng đổ chân thực (**Contact Shadows** và **Cast Shadows**) cùng hiệu ứng ánh sáng tràn biên (**Light Wrap**).

---

### 2. THIẾT LẬP DỰ ÁN & MÔI TRƯỜNG THỰC HÀNH
1. Chuẩn bị ít nhất 2 ảnh nguồn:
   - 1 ảnh phong cảnh nền (Background plate: đường phố, rừng núi hoặc bãi biển).
   - 1 ảnh chủ thể chính (Subject: người mẫu, xe hơi hoặc đồ vật đã được tách nền bằng kỹ thuật Masking ở module P02).
2. Tạo tài liệu composite kích thước lớn: `3840 x 2160 px`, DPI 300.
3. Bật thước đo (**Rulers: Ctrl+R / Cmd+R**) để kéo các đường gióng đường chân trời (Horizon Guide).

---

### 3. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

#### Bước 1: Đồng bộ phối cảnh với Live Perspective
- Kéo thả đối tượng chủ thể vào ảnh nền. Nhấn `V` để dùng **Move Tool**, căn chỉnh tỷ lệ kích thước tương quan sao cho hợp lý với mắt người.
- Vào **Layer > New Live Filter Layer > Distort > Perspective**:
  - Trên màn hình xuất hiện lưới phối cảnh 4 góc.
  - Kéo 4 điểm góc để khớp góc nghiêng của chủ thể theo đúng các đường gióng phối cảnh của mặt đất/mặt đường trong ảnh nền.

#### Bước 2: Kỹ thuật đổ bóng đa lớp (Realistic 2-Tier Shadow System)
- Tạo một Pixel Layer mới nằm ngay dưới chủ thể, đặt tên là `Contact Shadow`:
  - Dùng cọ Paint Brush mềm, độ mờ đục (Opacity) `80% - 100%`, màu đen đậm hoặc màu tối trích xuất từ bóng đổ có sẵn của ảnh nền.
  - Vẽ một đường bóng mỏng, sắc ngay sát điểm tiếp xúc giữa bàn chân/bánh xe với mặt đất (nơi ánh sáng môi trường không thể lọt vào).
- Tạo tiếp một Pixel Layer thứ hai, đặt tên là `Cast Shadow`:
  - Dùng cọ lớn hơn, Opacity `30% - 50%`, tô kéo dài theo đúng hướng chiếu sáng của ảnh nền.
  - Áp dụng **Live Gaussian Blur** với bán kính tăng dần khi bóng càng vươn xa khỏi chủ thể (quy luật vật lý: bóng càng xa nguồn tiếp xúc càng nhòe).

#### Bước 3: Đồng bộ ánh sáng & Hiệu ứng tràn sáng (Light Wrap)
- **Đồng bộ màu sắc (Color Match):**
  - Thêm một lớp **Curves Adjustment** lồng riêng (Clipping) vào chủ thể.
  - Trích mẫu màu vùng sáng nhất và tối nhất của ảnh nền để kéo Curves của chủ thể hòa nhịp cùng môi trường.
- **Kỹ thuật Light Wrap:**
  - Khi chủ thể đứng trước một hậu cảnh sáng (bầu trời rực rỡ hoặc hoàng hôn), ánh sáng hậu cảnh sẽ khúc xạ và tràn lẹm vào các cạnh rìa của chủ thể.
  - Nhân bản lớp ảnh nền, đưa lên vị trí trên cùng của layer stack, gán chế độ hòa trộn **Screen**, áp dụng Gaussian Blur nhẹ và lồng một mặt nạ cạnh biên vào rìa mép chủ thể.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ
- [ ] Chủ thể hòa quyện tự nhiên vào môi trường nền, không có cảm giác "dán sticker" sắc lẹm giả tạo.
- [ ] Hướng đổ bóng của chủ thể trùng khớp 100% với hướng bóng của các vật thể tự nhiên trong ảnh nền.
- [ ] Màu sắc và độ tương phản giữa chủ thể và nền ăn khớp trên biểu đồ Histogram.
