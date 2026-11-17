# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D05
## CHỦ ĐỀ: QUẢN LÝ LAYER, MẶT NẠ VECTOR & ĐƯỜNG CẮT BỐ CỤC (CLIPPING)

- **Tệp tài nguyên:** `D05_layers_masks_clipping_guide.md`
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
- **Phiên bản mục tiêu:** Affinity (kiểm chứng trên Affinity 3.3.3)
- **Persona áp dụng:** Vector Persona (không gian thiết kế vector)

---

### 1. MỤC TIÊU THỰC HÀNH
1. Tổ chức tệp thiết kế khoa học bằng **Layers Studio (F7)** (bảng quản lý phân cấp lớp), gộp nhóm (`Ctrl+G` / `Cmd+G`), đặt tên rõ nghĩa, gắn **Color Tag** (thẻ màu) và khóa lớp nền.
2. Phân biệt và thao tác chính xác hai vùng thả trong Layers Studio: **Vector Clipping** (thả vào thân tên lớp) và **Vector Masking** (thả vào ảnh thu nhỏ Thumbnail).
3. Kiểm soát hòa trộn ánh sáng, độ sâu bằng **Blend Modes**, **Blend Options** (biểu tượng bánh răng) và chỉnh sửa độc lập qua **Isolation Mode** (`Alt+Click` / `Option+Click`).

---

### 2. THIẾT LẬP TÀI LIỆU & MÔI TRƯỜNG THỰC HÀNH
1. Mở Affinity và nhấn `Ctrl+N` (Windows) / `Cmd+N` (macOS).
2. Chọn khổ **Web > FHD (1920 × 1080 px)** hoặc **Print > A4**.
3. Tích chọn **Create Artboard** rồi nhấn **Create**.

---

### 3. QUY TRÌNH THỰC HÀNH TỪNG BƯỚC

#### Bài 1: Tổ chức phân cấp, gom nhóm & gắn thẻ màu (Bài D05-01)
- Vẽ nhiều hình khối tượng trưng cho các bộ phận của một bức minh họa (ví dụ: nền trời, đầu nhân vật, mắt, miệng).
- Trong **Layers Studio** (`View > Studio > Layers` hoặc nhấn `F7` trên Windows):
  - Chọn các hình cùng nhóm và nhấn **`Ctrl+G`** (Win) / **`Cmd+G`** (Mac) để gộp vào một thư mục `Group`. Nhấp đúp lên tên nhóm để đổi tên rõ nghĩa (ví dụ `Character_Head`).
  - Nhấp chuột phải vào nhóm trong Layers Studio và gán **Color Tag** (ví dụ: Xanh dương cho nét viền, Cam cho bóng đổ, Xanh lá cho nền).
  - Nhấn biểu tượng ổ khóa (hoặc `Ctrl+L` / `Cmd+L`) trên lớp nền để tránh chọn nhầm khi thao tác trên bản vẽ.

#### Bài 2: Vector Clipping vs Vector Masking (Bài D05-02)
- Vẽ một hình tròn vector tô màu rực rỡ, sau đó vẽ một tia sét zích-zắc vươn ra ngoài biên hình tròn.
- **Thử Vector Clipping (lồng lớp con):**
  - Trong Layers Studio, kéo lớp tia sét thả trực tiếp lên **phần chữ/thân hàng** của lớp hình tròn (thấy vạch ngang màu xanh thụt lề bên dưới).
  - Tia sét bị cắt gọn bên trong hình tròn trong khi hình tròn vẫn giữ nguyên màu nền và nét viền; bạn vẫn kéo di chuyển tia sét thoải mái bằng **Move Tool (`V`)**.
- **Thử Vector Masking (mặt nạ gắn thumbnail):**
  - Tạo một hình chữ nhật mới và vẽ một đường uốn lượn đè lên trên.
  - Kéo lớp đường uốn lượn thả đúng vào **ô ảnh thu nhỏ (Thumbnail)** của hình chữ nhật (thấy vạch đứng xuất hiện bên cạnh thumbnail).
  - Đường uốn lượn đóng vai trò mặt nạ cắt cho hình chữ nhật và tự ẩn phần màu tô riêng của nó.

#### Bài 3: Blend Modes, Blend Ranges & Isolation Mode (Bài D05-03)
- Đặt một hình vector có màu lên trên một nền tối có họa tiết.
- Đổi chế độ hòa trộn của hình đó từ **Normal** lần lượt sang **Screen**, **Multiply**, **Overlay** và **Color Dodge**.
- Nhấn biểu tượng **bánh răng (Cog/Gear)** ở góc trên bên phải bảng Layers Studio để mở hộp thoại **Blend Options**:
  - Kéo chỉnh hai đồ thị `Source Layer Ranges` và `Underlying Composition Ranges` để kiểm soát dải sáng tối nào được phép hòa trộn.
- **Thử Isolation Mode:**
  - Giữ **`Alt` (Win) hoặc `Option` (Mac)** rồi nhấp chuột lên thumbnail của một lớp bất kỳ trong Layers Studio.
  - Toàn bộ khung vẽ tạm thời chỉ hiển thị duy nhất lớp đó để bạn chỉnh sửa tập trung không vướng mắt; `Alt+Click` / `Option+Click` thêm lần nữa để thoát về bình thường.

---

### 4. BÀI TẬP TỰ ĐÁNH GIÁ (CHALLENGE CHECKPOINTS)
- [ ] Tất cả các lớp đều được đặt tên có ý nghĩa, chia nhóm gọn gàng và gắn thẻ màu phân loại.
- [ ] Thực hiện phân biệt đúng giữa thao tác thả tạo **Vector Clipping** và thao tác thả lên thumbnail tạo **Vector Masking**.
- [ ] Đã kiểm tra hiệu ứng **Blend Options** và thử bật/thoát **Isolation Mode** thành công.
