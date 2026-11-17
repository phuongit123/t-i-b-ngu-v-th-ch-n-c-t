# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D04
## CHỦ ĐỀ: TÔ MÀU, DẢI CHUYỂN MÀU, ĐƯỜNG VIỀN & BIỂU ĐỒ LỰC NHẤN

- **Tệp tài nguyên:** `D04_gradients_stroke_contour_guide.md`
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
- **Phiên bản mục tiêu:** Affinity (kiểm chứng trên Affinity 3.3.3)
- **Persona áp dụng:** Vector Persona (không gian thiết kế vector)

---

### 1. MỤC TIÊU THỰC HÀNH
1. Kéo chỉnh trực tiếp dải chuyển sắc nhiều điểm trên bản vẽ với **Fill Tool (G)** (công cụ tô màu và gradient) qua các chế độ `Linear`, `Radial`, `Elliptical` và `Conical`.
2. Tùy biến độ dày thanh đậm của nét vector bằng biểu đồ **Pressure** trong **Stroke Studio** (bảng thuộc tính đường viền) và lưu lại thành mẫu dùng lại.
3. Tạo đường viền giãn đều bằng **Contour Tool (O)** (công cụ tạo viền lệch đồng đều) và chuyển nét thành mảng bằng **Expand Stroke**.

---

### 2. THIẾT LẬP TÀI LIỆU & MÔI TRƯỜNG THỰC HÀNH
1. Mở Affinity và tạo tài liệu mới (`Ctrl+N` / `Cmd+N`).
2. Chọn **Web > FHD (1920 × 1080 px)**, không gian màu `RGB/8`.
3. Tích chọn **Create Artboard** rồi nhấn **Create**.

---

### 3. QUY TRÌNH THỰC HÀNH TỪNG BƯỚC

#### Bài 1: Dải chuyển màu đa điểm bằng Fill Tool (Bài D04-01)
- Dùng công cụ hình chữ nhật vẽ một khối bất kỳ, sau đó nhấn **`G`** để bật **Fill Tool**.
- Nhấp và kéo ngang qua hình để tạo thanh điều khiển gradient trực tiếp trên bản vẽ.
- Trên thanh **Context Toolbar**, lần lượt thử các kiểu:
  - **Linear:** Chuyển màu tuyến tính theo một hướng thẳng từ điểm A sang điểm B.
  - **Radial:** Tỏa tròn đồng tâm từ điểm gốc.
  - **Elliptical:** Hình elip với hai trục bán kính X và Y điều chỉnh độc lập.
  - **Conical:** Quét xoay tròn 360 độ quanh tâm (rất phù hợp để tả mặt kim loại phay xước, đĩa CD, mặt đồng hồ).
- Nhấp lên đoạn thẳng gradient để chèn thêm điểm dừng màu (color stop) mới, và kéo vạch nhỏ nằm giữa hai điểm dừng để điều chỉnh điểm trung chuyển (midpoint bias).

#### Bài 2: Biểu đồ lực nhấn Pressure & Nét đứt tùy chỉnh (Bài D04-02)
- Chọn **Pen Tool (`P`)** và vẽ một đường cong chữ S mềm mại.
- Mở **Stroke Studio** (`View > Studio > Stroke`), đặt độ dày nét `24 pt`.
- Nhấn nút **Pressure** ở phần dưới bảng Stroke Studio:
  - Kéo điểm đầu bên trái xuống `0%` (đầu nét vót nhọn).
  - Kéo điểm giữa đồ thị lên `100%` (phần bụng nét phình to).
  - Kéo điểm cuối bên phải xuống `0%` (đuôi nét thuôn nhọn).
- Nhấn **Save Profile** để lưu lại dáng nét thư pháp này cho các nét vẽ sau.

#### Bài 3: Contour Tool & Expand Stroke (Bài D04-03)
- Chọn một hình vector khép kín hoặc dòng chữ đã chuyển sang đường cong.
- Nhấn **`O`** để chọn **Contour Tool**.
- Kéo từ viền hình hướng ra ngoài để tạo đường viền lệch đồng đều (hoặc kéo vào trong để thu hẹp đều vào tâm).
- Thử các kiểu đầu góc trên Context Toolbar: `Round`, `Bevel`, `Miter`.
- Chọn tiếp một đường nét có độ dày viền và vào **`Layer > Expand Stroke`**: đường tâm có nét viền sẽ lập tức biến thành một khối mảng vector khép kín có đường bao trong/ngoài riêng biệt.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ (CHALLENGE CHECKPOINTS)
- [ ] Tạo được dải màu **Conical** xoay 360 độ liền mạch không lộ đường ranh giới ghép tại góc 0° và 360°.
- [ ] Lưu được ít nhất 1 mẫu **Pressure** preset và bật tùy chọn **Scale with object** trong Stroke Studio.
- [ ] Chuyển đổi thành công nét vẽ sang mảng đặc bằng **Expand Stroke** và tinh chỉnh viền bằng **Contour Tool (O)**.
