# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D03
## CHỦ ĐỀ: TẠO HÌNH NÂNG CAO & THAO TÁC HÌNH HỌC BOOLEAN

- **Tệp tài nguyên:** `D03_boolean_geometry_guide.md`
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
- **Phiên bản mục tiêu:** Affinity (kiểm chứng trên Affinity 3.3.3)
- **Persona áp dụng:** Vector Persona (không gian thiết kế vector)

---

### 1. MỤC TIÊU THỰC HÀNH
1. Sử dụng bộ hình khối tham số thông minh (Parametric Shapes) và kéo chỉnh trực tiếp các điểm nắm màu cam trên bản vẽ.
2. Áp dụng 4 kiểu góc của **Corner Tool (C)** (công cụ bo và vát góc): `Rounded`, `Concave`, `Straight` và `Cutout`.
3. Nắm vững 5 phép toán **Boolean** (`Add`, `Subtract`, `Intersect`, `Xor`, `Divide`) cùng quy trình **Compound Shapes** (tạo hình tổng hợp phi phá hủy mặc định) và phân biệt với lệnh **Join** phá hủy.

---

### 2. THIẾT LẬP TÀI LIỆU & MÔI TRƯỜNG THỰC HÀNH
1. Mở Affinity và nhấn `Ctrl+N` (Windows) / `Cmd+N` (macOS).
2. Chọn khổ **Web > FHD (1920 × 1080 px)** hoặc **Print > A4**.
3. Tích chọn **Create Artboard** rồi nhấn **Create**.

---

### 3. QUY TRÌNH THỰC HÀNH TỪNG BƯỚC

#### Bài 1: Hình khối tham số & Corner Tool (Bài D03-01)
- Trên thanh công cụ bên trái, nhấn giữ biểu tượng nhóm hình khối để mở danh sách và chọn **Cog Tool** (bánh răng).
- Kéo tạo bánh răng trên bản vẽ, sau đó kéo các **điểm điều khiển màu cam** để chỉnh số răng (ví dụ 12 răng), bán kính lỗ trục, độ khuyết và độ nghiêng răng.
- Chuyển khối tham số sang đường cong Bézier bằng `Ctrl+Enter` (Win) / `Cmd+Enter` (Mac) hoặc nút **Convert to Curves**.
- Chọn **Corner Tool (`C`)**, nhấp chọn một đỉnh góc nhọn và thử lần lượt 4 kiểu góc trên thanh Context Toolbar:
  1. **Rounded:** Bo tròn cung tròn tiêu chuẩn.
  2. **Concave:** Lõm tròn vào bên trong.
  3. **Straight:** Vát phẳng 45 độ kiểu kỹ thuật.
  4. **Cutout:** Khoét bậc vuông góc vào trong.

#### Bài 2: Năm phép toán hình học Boolean (Bài D03-02)
- Vẽ một hình tròn và một hình chữ nhật giao nhau trên bản vẽ, sau đó chọn cả hai bằng **Move Tool (`V`)** (công cụ chọn và di chuyển).
- Trong nhóm **Geometry** (thanh công cụ trên cùng hoặc `Layer > Geometry`), thử từng phép toán:
  - **Add:** Hợp nhất các hình thành một đường bao chung.
  - **Subtract:** Dùng hình nằm trên cắt khoét phần giao khỏi hình nằm dưới.
  - **Intersect:** Chỉ giữ lại phần giao nhau chung.
  - **Xor:** Giữ các phần ngoài và khoét rỗng phần giao nhau.
  - **Divide:** Chia toàn bộ các vùng chồng lấn thành từng mảnh rời độc lập.

#### Bài 3: Compound Shapes phi phá hủy (Bài D03-03)
- Chọn hai hình vector xếp chồng lên nhau.
- Nhấn chọn một phép toán Boolean (ví dụ **Subtract**) mà không cần giữ phím bổ trợ; ở bản Affinity hiện hành, phép toán Boolean mặc định tạo ra lớp **`(Compound)`** phi phá hủy (còn lệnh **Join** dùng khi bạn muốn gộp cứng phá hủy).
- Mở rộng lớp **`(Compound)`** trong **Layers Studio** (bảng quản lý lớp): cả hai hình gốc bên trong vẫn còn nguyên vẹn; hãy kiểm tra trực tiếp nhãn nút đổi phép toán từng lớp con trên bản cài đặt của bạn.
- Dùng Move Tool (`V`) kéo dịch một hình con bên trong để quan sát kết quả cắt khoét cập nhật theo thời gian thực.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ (CHALLENGE CHECKPOINTS)
- [ ] Thành thạo việc chỉnh trực tiếp hình tham số trước khi nhấn `Convert to Curves`.
- [ ] Thực hành tách mảng bằng **Divide** và sắp xếp thứ tự lớp để tạo hiệu ứng đan xen trên/dưới sạch sẽ.
- [ ] Phân biệt rõ khi nào giữ lớp **Compound** động để dễ sửa và khi nào dùng **Join** hoặc **Convert to Curves** để chốt hình cuối xuất file.
