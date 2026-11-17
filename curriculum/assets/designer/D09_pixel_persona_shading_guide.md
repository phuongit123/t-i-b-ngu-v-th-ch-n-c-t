# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D09
## CHỦ ĐỀ: TÍCH HỢP PIXEL PERSONA & ĐỔ BÓNG CHẤT LIỆU HẠT CHO VECTOR

- **Mã học phần:** `D09`
- **Cấp độ:** Nâng cao (`Advanced`)
- **Lộ trình:** Affinity Designer (Vector Studio & Pixel Persona)
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
**Ứng dụng mục tiêu:** Affinity (Desktop — Windows & macOS, kiểm chứng trên bản 3.3.3)

---

### 1. TỔNG QUAN DỰ ÁN & MỤC TIÊU QUY TRÌNH LAI

Trong bài thực hành này, bạn sẽ hoàn thiện một **Tranh Minh Họa Thực Vật phong cách Retro-Futuristic** bằng kiến trúc lõi kép của Affinity: kết hợp đường nét **vector toán học sắc bén** với lớp **đổ bóng chất liệu hạt điểm ảnh (raster)** có lực nhấn tự nhiên trong **Pixel Persona**.

Bạn sẽ nắm vững kỹ thuật lồng **Pixel Layer** làm lớp con trong đối tượng vector (**Child Pixel Clipping**), phân biệt **Flow** và **Opacity** trên cọ vẽ, khóa vùng trong suốt bằng **Protect Alpha**, và quản lý **DPI** chuẩn cho in ấn thương mại.

---

### 2. THIẾT LẬP DPI TÀI LIỆU & CHUYỂN ĐỔI PIXEL PERSONA

1. **Khởi tạo tài liệu chuẩn độ phân giải**:
   - Vào menu `File > New...`.
   - Kích thước: `2400 × 3000 px` (khổ poster dọc).
   - Hệ màu: `RGB/8` hoặc `CMYK/8` (tùy đầu ra màn hình hay in offset).
   - **DPI: `300 DPI`** (điểm then chốt: hình vector phóng to vô hạn nhưng nét cọ raster vẽ trong Pixel Persona phụ thuộc cố định vào DPI của tài liệu).
2. **Chuyển sang Pixel Persona**:
   - Nhấp vào biểu tượng thứ hai trên thanh **Persona** ở góc trên bên trái cửa sổ ứng dụng (hoặc dùng phím tắt tự gán trong `Edit > Preferences > Keyboard Shortcuts` trên Windows / `Settings > Keyboard Shortcuts` trên macOS; mặc định phần mềm không gán sẵn phím tắt chuyển Persona).
   - Quan sát thanh công cụ bên trái thay đổi: các công cụ Pen và Shape được thay bằng **Paint Brush Tool (`B`)**, **Pixel Tool**, **Eraser Tool (`E`)**, nhóm vùng chọn và các cọ hòa trộn ánh sáng.
   - Bảng **Brushes Studio** tự động chuyển sang bộ cọ điểm ảnh (`Acrylics`, `Dry Media`, `Gouache`, `Inks`, `Spray and Spatters`, `Texture`).

---

### 3. KIẾN TRÚC LỒNG LỚP PIXEL CLIPPING PHI PHÁ HỦY

1. **Dựng lớp vỏ Vector cha**:
   - Ở không gian **Designer / Vector Persona** (biểu tượng đầu tiên bên trái thanh công cụ trên), dùng **Pen Tool (`P`)** vẽ hình chiếc lá cách điệu, tô màu xanh ngọc trầm (`#0F766E`), không viền.
2. **Chèn lớp Pixel con vào bên trong Vector**:
   - Chọn hình chiếc lá trên bản vẽ, sau đó bật nút **Insert inside the selection** (biểu tượng hình vuông mục tiêu có mũi tên hướng vào trong) trên thanh công cụ phía trên.
   - Chuyển sang **Pixel Persona**.
   - Trong **Layers Studio**, nhấn nút **Add Pixel Layer**. Lớp Pixel mới tự động thụt lề vào trong làm lớp con của đường cong chiếc lá.
3. **Đổ bóng an toàn không lo lem viền**:
   - Dùng cọ hạt vẽ trực tiếp lên chiếc lá: ngay cả khi nét cọ vung ra ngoài biên `200 px`, hệ thống vẫn cắt gọn toàn bộ điểm ảnh theo đúng đường bao Bézier của chiếc lá cha.
   - Nếu sau đó dùng **Node Tool (`A`)** kéo chỉnh lại dáng chiếc lá, đường cắt tự động cập nhật theo thời gian thực mà không làm méo hay nhòe hạt chất liệu bên trong.

---

### 4. HƯỚNG DẪN TÔ BÓNG CHẤT LIỆU TỪNG BƯỚC

#### Bước 4.1: Chọn cọ hạt và cài đặt động lực nét vẽ
1. Mở **Brushes Studio** (trong **Pixel Persona**) -> chọn nhóm **Dry Media** hoặc **Texture**.
2. Chọn một đầu cọ phấn hoặc hạt xốp (ví dụ `"Chalk Rough"` hoặc `"Noise Grain"`).
3. Thiết lập trên thanh **Context Bar**:
   - **Width (Cỡ cọ):** `80 px`.
   - **Opacity:** `100%`.
   - **Flow:** `15% - 25%` (mức Flow thấp cho phép hạt màu đắp dày dần mượt mà qua nhiều lượt quét chồng lên nhau mà không tạo ngấn cọ).
   - **Hardness:** `0%` (viền cọ mềm mịn).
4. Nhấp nút **More** trên Context Bar để mở bảng chỉnh sâu:
   - **Size Jitter:** `20%` (Controller: `Pressure`).
   - **Flow Jitter:** `15%` (Controller: `Pressure`).

#### Bước 4.2: Phủ lớp bóng tối (Core Shadow)
1. Chọn lớp **Pixel Layer** con bên trong chiếc lá.
2. Dùng ống hút màu lấy màu xanh nền `#0F766E`, rồi kéo tối hơn và ngả sang xanh đen sâu (`#042F2E`).
3. Đổi **Blend Mode** của lớp Pixel con trong **Layers Studio** sang **Multiply**.
4. Quét nhẹ nhiều lượt dọc theo mép cong dưới và phần cuống lá để tạo độ chuyển khối giàu chất liệu hạt.

#### Bước 4.3: Phủ viền sáng (Highlight) & Khóa Protect Alpha
1. Tạo thêm một **Pixel Layer** con thứ hai đặt phía trên lớp bóng tối.
2. Đặt chế độ hòa trộn là **Screen** hoặc **Linear Light**.
3. Chọn màu vàng ấm nhạt (`#FDE68A`) hoặc xanh bạc hà sáng (`#5EEAD4`), quét dọc theo mép lá đón sáng.
4. Khi muốn đổi sắc độ cho chính những hạt màu đã vẽ mà không làm vương thêm hạt ra vùng trống, tích chọn **Protect Alpha** trên thanh **Context Bar** trước khi quét màu mới.

#### Bước 4.4: Quay lại Vector Persona để nhấn nét sắc bén
1. Nhấp biểu tượng **Designer / Vector Persona** trên thanh công cụ góc trên bên trái.
2. Dùng **Pen Tool (`P`)** vẽ các đường gân lá sắc mảnh (`2 pt`) chồng lên phần đổ bóng hạt.
3. Kiểm tra độ tương phản thị giác giữa nét vector sắc gọn và nền hạt raster mềm mịn bên dưới.

---

### 5. BẢNG KIỂM TRA & NGHIỆM THU BẢN VẼ
- [ ] Tài liệu khởi tạo đúng chuẩn `300 DPI` ngay từ đầu để bảo đảm độ nét cho lớp hạt raster.
- [ ] Chuyển đổi linh hoạt giữa `Designer / Vector Persona` và `Pixel Persona` không làm phẳng layer.
- [ ] Toàn bộ nét đổ bóng nằm trong **Pixel Layer con** lồng gọn bên dưới hình vector cha.
- [ ] Giữ `Opacity 100%` và điều tiết sắc độ chuyển tiếp bằng `Flow 15%–25%`.
- [ ] Khi kéo sửa điểm neo trên đường cong vector cha bằng `Node Tool (A)`, biên cắt lớp hạt cập nhật tức thì mà không bị nhòe.
