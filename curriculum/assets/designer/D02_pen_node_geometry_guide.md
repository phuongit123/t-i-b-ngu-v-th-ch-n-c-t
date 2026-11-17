# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D02
## CHỦ ĐỀ: ĐIỂM NODE VECTOR, ĐƯỜNG VẼ & HÌNH HỌC CÔNG CỤ PEN

- **Tệp tài nguyên:** `D02_pen_node_geometry_guide.md`
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
- **Phiên bản mục tiêu:** Affinity (kiểm chứng trên Affinity 3.3.3)
- **Persona áp dụng:** Vector Persona (không gian thiết kế vector)

---

### 1. MỤC TIÊU THỰC HÀNH
1. Phân biệt và thực hành 4 chế độ của **Pen Tool (P)** (công cụ vẽ đường cong Bézier): Pen, Smart, Polygon và Line.
2. Nắm chắc cách chuyển đổi và tinh chỉnh 3 loại điểm neo (**Sharp**, **Smooth**, **Smart**) bằng **Node Tool (A)** (công cụ chỉnh điểm neo).
3. Thành thạo các lệnh xử lý đường dẫn (**Join Curves**, **Break Curve**, **Close Curve**, **Reverse Curve**) cùng cấu hình đầu nét và góc nối trong **Stroke Studio** (bảng thuộc tính nét viền).

---

### 2. THIẾT LẬP TÀI LIỆU & MÔI TRƯỜNG THỰC HÀNH
1. Mở Affinity và nhấn `Ctrl+N` (Windows) / `Cmd+N` (macOS).
2. Chọn khổ **Print > A4** hoặc **Web > FHD (1920 × 1080 px)**.
3. Đặt đơn vị đo là **Pixels** hoặc **Millimeters**.
4. Tích chọn **Create Artboard** rồi nhấn **Create**.

---

### 3. QUY TRÌNH THỰC HÀNH TỪNG BƯỚC

#### Bài 1: Thử nghiệm 4 chế độ của Pen Tool (Bài D02-01)
- Nhấn `P` để chọn **Pen Tool**.
- Trên thanh **Context Toolbar** phía trên, lần lượt thử 4 chế độ:
  1. **Pen Mode (mặc định):** Nhấp chuột để tạo góc nhọn, nhấp và kéo để kéo hai tay cầm Bézier đối xứng.
  2. **Smart Mode:** Chỉ cần nhấp lần lượt các điểm, phần mềm tự nội suy đường cong trơn đi qua từng điểm mà không cần kéo tay cầm.
  3. **Polygon Mode:** Nhấp để vẽ các đoạn thẳng nối thành đa giác, tránh kéo nhầm ra đường cong.
  4. **Line Mode:** Nhấp và kéo từng đoạn thẳng 2 điểm tách rời nhau.
- Giữ phím `Alt` (Windows) / `Option` (macOS) khi đang kéo tay cầm để bẻ gãy đối xứng, tạo góc chuyển hướng đột ngột ngay lúc vẽ.

#### Bài 2: Chuyển đổi 3 loại điểm neo bằng Node Tool (Bài D02-02)
- Vẽ một đường lượn sóng tự do.
- Nhấn `A` để chuyển sang **Node Tool**.
- Chọn các điểm neo dọc đường cong và thử 3 nút chuyển đổi trên thanh Context Toolbar:
  - **Sharp:** Tách rời hai tay cầm để chỉnh góc và độ dài độc lập, tạo đỉnh nhọn.
  - **Smooth:** Khóa hai tay cầm thẳng hàng 180 độ để đường cong chuyển tiếp mượt mà.
  - **Smart:** Tự động tính toán độ cong tự nhiên dựa trên các điểm neo liền kề.
- Giữ phím `Shift` trong lúc kéo điểm neo hoặc tay cầm để khóa chuyển động theo góc 45 độ / 90 độ.

#### Bài 3: Nối, ngắt và đóng kín đường cong (Bài D02-03)
- Dùng **Pen Tool (P)** vẽ hai đoạn cong hở tách biệt nhau.
- Chọn cả hai đường bằng **Move Tool (V)** hoặc **Node Tool (A)** (giữ `Shift` để chọn nhiều đường).
- Dùng **Node Tool (A)** quét chọn hai điểm đầu mút gần nhau rồi nhấn **Join Curves** trên Context Toolbar để hàn thành một đường liên tục.
- Chọn một điểm neo ở giữa đường và nhấn **Break Curve** để tách thành hai đoạn độc lập.
- Nhấn **Close Curve** để nối kín điểm đầu và điểm cuối thành hình khép kín.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ & CẤU HÌNH ĐẦU NÉT (CHALLENGE CHECKPOINTS)
- Mở **Stroke Studio** (`View > Studio > Stroke`), đặt độ dày nét `6 pt`.
- Kiểm tra cả 3 kiểu đầu nét (**Cap**): `Butt Cap` (cắt bằng tại điểm neo), `Round Cap` (bo tròn), `Square Cap` (vuông mở rộng).
- Kiểm tra cả 3 kiểu nối góc (**Join**): `Miter Join` (góc nhọn có kiểm soát Miter Limit), `Round Join` (góc bo tròn), `Bevel Join` (góc vát phẳng).
- [ ] Đường vẽ mẫu sử dụng ít nhất là số điểm neo cần thiết, đặt tại các điểm cực trị thay vì chấm dày đặc dọc theo cung cong.
- [ ] Không còn đỉnh nhọn bị phóng gai dài bất thường nhờ điều chỉnh thông số **Miter Limit** hợp lý (`1.4 - 2.0`).
