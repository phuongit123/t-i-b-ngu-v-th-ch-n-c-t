# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D07
## CHỦ ĐỀ: HỆ LƯỚI ISOMETRIC, PHỐI CẢNH TRỤC ĐO & BẮT DÍNH CHUẨN XÁC

- **Mã học phần:** `D07`
- **Cấp độ:** Trung cấp (`Intermediate`)
- **Lộ trình:** Affinity Designer (Vector Studio)
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
**Ứng dụng mục tiêu:** Affinity (Desktop — Windows & macOS, kiểm chứng trên bản 3.3.3)

---

### 1. TỔNG QUAN DỰ ÁN & MỤC TIÊU BẢN VẼ

Trong bài thực hành này, bạn sẽ dựng một **Quầy Máy Chủ & Màn Hình Điều Khiển Isometric** bằng bộ công cụ gốc gồm **Grid and Axis Manager** (trình quản lý lưới và trục tọa độ), bảng **Isometric Studio** (bảng điều khiển mặt phẳng trục đo) và hệ thống **Snapping Candidates** (ứng viên bắt dính giao điểm).

Mục tiêu cốt lõi là nắm vững nguyên lý chiếu song song trong không gian trục đo: loại bỏ hoàn toàn điểm tụ phối cảnh xa gần nhưng vẫn giữ tỷ lệ góc chuẩn xác `30°` trên cả hai trục mặt đất và `90°` theo phương thẳng đứng.

---

### 2. THIẾT LẬP TÀI LIỆU & HỆ LƯỚI ISOMETRIC

1. **Tạo tài liệu mới (`File > New...`)**:
   - Khổ mẫu: **Web / FHD** (`1920 × 1080 px`).
   - Hệ màu: **RGB/8**, hồ sơ màu: **sRGB IEC61966-2.1**.
   - Tích chọn **Transparent Background** (nền trong suốt) nếu cần tách nền.
2. **Mở trình quản lý lưới Grid and Axis Manager**:
   - Menu: `View > Grid and Axis Manager...` (phím tắt: `Ctrl+Alt+G` trên Windows / `Cmd+Option+G` trên macOS).
   - Bỏ tích **Use automatic grid** để khóa kích thước mô-đun cố định (tránh lưới tự co giãn khi phóng to/thu nhỏ).
   - **Grid Mode:** chọn **Advanced**.
   - **Grid Type:** chọn **Isometric** (hoặc **Axonometric** nếu cần nhập góc tùy biến cho dimetric/trimetric).
   - **Góc chuẩn:** Isometric chuẩn dùng góc nâng **30°** (`X = 30°`, `Y = 150°`, `Z = 90°`).
   - **Spacing (Bước lưới):** đặt bước chính `64 px` và `4 subdivisions` (chia nhỏ thành từng nấc `16 px`).
   - Tích chọn **Show grid** (`Ctrl+'` / `Cmd+'`) và **Snap to grid** (`Ctrl+Alt+'` / `Cmd+Option+'`).

---

### 3. BẢNG ISOMETRIC STUDIO & QUY TRÌNH FIT TO PLANE

1. **Mở Isometric Studio**:
   - Vào `View > Studio > Isometric` (hoặc nhấp biểu tượng Isometric Studio ở thanh dock bên phải).
2. **Ba mặt phẳng chiếu tiêu chuẩn**:
   - **Front Plane (Mặt trước):** mặt phẳng đứng quay sang trái, bám theo trục `150°`.
   - **Side Plane (Mặt bên):** mặt phẳng đứng quay sang phải, bám theo trục `30°`.
   - **Top Plane (Mặt trên):** mặt phẳng nằm ngang (sàn hoặc mái), giới hạn bởi hai trục `30°` và `150°`.
3. **Hai cơ chế thao tác chính**:
   - **Fit to Plane:** Chọn bất kỳ nhóm đồ họa 2D phẳng nào (hình chữ nhật, biểu tượng, chữ) rồi chọn mặt phẳng `Top`, `Side` hoặc `Front` và nhấn **Fit to Plane**. Phần mềm tự tính ma trận biến đổi affine (nghiêng và xoay) phi phá hủy để ép hình phẳng lên đúng mặt phẳng đã chọn.
   - **Edit in Plane:** Khi bật tùy chọn này, mọi hình khối hay điểm neo vẽ bằng **Pen Tool (`P`)** hoặc **Rectangle Tool (`M`)** đều được chiếu trực tiếp lên mặt phẳng đang kích hoạt theo thời gian thực.

---

### 4. QUY TRÌNH LẮP RÁP QUẦY MÁY CHỦ TỪNG BƯỚC

#### Bước 4.1: Dựng khối bệ đế Isometric
1. Trong **Isometric Studio**, đặt mặt phẳng hoạt động là **Top** và bật **Edit in Plane**.
2. Vẽ mặt đáy hình vuông (`256 × 256 px`), tô màu xám thép tối (`#1A1D24`), không viền.
3. Chuyển mặt phẳng sang **Front**, vẽ mặt đứng bên trái (`256 × 400 px`), tô màu `#252A34`.
4. Chuyển mặt phẳng sang **Side**, vẽ mặt đứng bên phải (`256 × 400 px`), tô màu `#2E3440`.
5. Kiểm tra tương phản 3 bậc sáng tự nhiên: mặt trên **Top** sáng nhất (`#3B4252`), mặt bên **Side** sáng trung bình (`#2E3440`), mặt trước **Front** tối nhất (`#252A34`).

#### Bước 4.2: Chiếu màn hình giao diện 2D lên mặt phẳng 3D
1. Di chuyển sang một khoảng trống trên bản vẽ và **tắt** `Edit in Plane`.
2. Dựng một thẻ giao diện 2D phẳng:
   - Hình chữ nhật (`180 × 240 px`), nền `#0F172A`, viền xanh neon `#00D2FF` dày `1.5 pt` (nhớ bật **Scale with object** trong bảng **Stroke Studio**).
   - Dùng **Artistic Text Tool (`T`)** nhập dòng trạng thái (`"SYSTEM ONLINE"`, `"CORE TEMP: 34°C"`).
   - Nhóm toàn bộ thành phần giao diện lại thành một Group (`Ctrl+G` / `Cmd+G`).
3. Chọn nhóm giao diện 2D vừa tạo, mở **Isometric Studio**:
   - Chọn mặt phẳng **Side**.
   - Nhấn **Fit to Plane**.
4. Nhóm giao diện tự động nằm phẳng theo đúng góc `30°`. Bật lại `Edit in Plane` rồi kéo đặt gọn vào mặt bên của quầy máy chủ.

#### Bước 4.3: Thiết lập Snapping Candidates để ghép đỉnh chuẩn xác
1. Mở **Snapping Manager** bằng cách nhấp mũi tên nhỏ cạnh biểu tượng nam châm trên thanh công cụ chính hoặc vào `View > Snapping Manager...`.
2. Tích chọn **Show snapping candidates** (hiển thị viền hồng tím quanh đối tượng tham chiếu).
3. Đặt mục **Candidates** thành `Candidate list (maximum 6)`. Di chuột lướt qua các khối chính của quầy máy chủ để kích hoạt viền hồng tím.
4. Bật **Snap to grid** và **Snap to object geometry**.
5. Dùng **Pen Tool (`P`)** nối các đường dây dẫn giữa các cổng thiết bị: con trỏ sẽ hiện dấu chữ thập màu vàng khi khóa trúng đỉnh điểm neo, bảo đảm không có khe hở điểm ảnh.

---

### 5. BẢNG KIỂM TRA & NGHIỆM THU BẢN VẼ
- [ ] `Grid and Axis Manager` đã tắt lưới tự động và bật chế độ **Isometric** (`30°`).
- [ ] Khối bệ đế phân tách rõ 3 sắc độ sáng tối theo từng mặt phẳng (`Top` sáng, `Side` trung tính, `Front` tối).
- [ ] Thành phần giao diện 2D được chiếu chuẩn bằng `Fit to Plane`, không tự kéo nghiêng thủ công gây sai góc.
- [ ] Toàn bộ đỉnh giao nhau giữa các khối khớp khít khi kiểm tra bằng chế độ khung dây **Outline View** (`Ctrl+Y` / `Cmd+Y`).
