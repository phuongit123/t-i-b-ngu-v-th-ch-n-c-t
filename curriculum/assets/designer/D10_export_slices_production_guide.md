# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D10
## CHỦ ĐỀ: XUẤT BẢN DỰ ÁN, CẮT LÁT SLICES & ĐÓNG GÓI CHUẨN SẢN XUẤT

- **Mã học phần:** `D10`
- **Cấp độ:** Nâng cao (`Advanced`)
- **Lộ trình:** Affinity Designer (Vector Studio & Export Persona)
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
**Ứng dụng mục tiêu:** Affinity (Desktop — Windows & macOS, kiểm chứng trên bản 3.3.3)

---

### 1. TỔNG QUAN DỰ ÁN & QUY TRÌNH ĐẦU RA THƯƠNG MẠI

Ở học phần tổng kết này, bạn sẽ thiết lập hoàn chỉnh dây chuyền xuất bản thương mại trong **Export Persona** (không gian cắt lát và đóng gói đầu ra, truy cập qua nhóm biểu tượng Persona góc trên bên trái). Trọng tâm gồm: dựng vùng cắt lát tự bám đối tượng (**Layer-Based Slices**), xuất đa mật độ (**1x, 2x, 3x** với **PNG, WebP, SVG**), vận hành **Continuous Export** tự động cập nhật file nền, tinh gọn mã nguồn **SVG**, và xuất bản in **PDF/X-4** đầy đủ dấu cắt và lề tràn xén.

---

### 2. KHÔNG GIAN EXPORT PERSONA & BẢNG SLICES STUDIO

1. **Chuyển vào Export Persona**:
   - Nhấp biểu tượng thứ ba trên thanh Persona góc trên bên trái (hoặc dùng phím tắt riêng nếu bạn đã gán trong `Edit > Preferences > Keyboard Shortcuts`; mặc định phần mềm không gán sẵn phím tắt chuyển Persona).
   - Thanh công cụ bên trái chuyển sang **Slice Tool (`S`)** (công cụ kẻ lát cắt thủ công) và **Slice Selection Tool**.
   - Thanh dock bên phải hiển thị hai bảng cốt lõi: **Slices Studio** (quản lý danh sách lát cắt) và **Export Options Studio** (thiết lập định dạng mặc định).
2. **Bốn loại lát cắt (Slices) trong Affinity**:
   - **Document Slice:** Tự động bao phủ toàn bộ trang hoặc vùng lề tràn của tài liệu.
   - **Artboard Slices:** Tự động sinh ra tương ứng cho từng bảng vẽ (**Artboard**) hiện có.
   - **Layer-Based Slices:** Trong bảng **Layers** của Export Persona, chọn nhóm vector hoặc icon rồi nhấn **Create Slice**. Khung lát cắt sẽ bám chặt khung bao của đối tượng và tự cập nhật kích thước nếu bạn sửa hoặc di chuyển đối tượng bên Vector Persona.
   - **User Custom Slices:** Kẻ tay tự do bằng **Slice Tool (`S`)** để cắt một vùng cố định bất kỳ trên màn hình.

---

### 3. THIẾT LẬP ĐA MẬT ĐỘ & CONTINUOUS EXPORT

1. **Cấu hình nhiều cấp đầu ra trong Slices Studio**:
   - Chọn một lát cắt trong **Slices Studio**, nhấp mũi tên mở rộng để xem các tầng định dạng (mặc định là `1x PNG`).
   - Nhấn nút `+` để bổ sung thêm các cấp độ cần xuất đồng thời:
     * Tầng 1: Tỷ lệ `1x`, Định dạng `PNG`, Hậu tố `@1x`.
     * Tầng 2: Tỷ lệ `2x`, Định dạng `PNG`, Hậu tố `@2x` (màn hình Retina / HiDPI).
     * Tầng 3: Tỷ lệ `3x`, Định dạng `WebP`, Hậu tố `@3x`.
     * Tầng 4: Tỷ lệ `1x`, Định dạng `SVG (for web)`.
2. **Quy trình Continuous Export và điều kiện kích hoạt**:
   - Tích chọn ô **Continuous** ở đầu bảng **Slices Studio**.
   - **Bước bắt buộc:** Nhấn nút **Export Slices** một lần và chọn thư mục lưu đầu ra (ví dụ `dist/assets/icons/`). Affinity cần thao tác xuất đầu tiên này để ghi nhớ đường dẫn đích trước khi kích hoạt cơ chế tự cập nhật nền.
   - **Các sự kiện kích hoạt tự xuất lại:**
     * Lưu tài liệu gốc (`Ctrl+S` / `Cmd+S`).
     * Chỉnh sửa layer, nội dung chữ hoặc hình khối nằm trong phạm vi lát cắt.
     * Thay đổi kích thước lát cắt hoặc chỉnh sửa cấu hình xuất trong **Slices Studio**.
   - *Lưu ý hiệu năng:* Chỉ nên bật **Continuous** cho các lát cắt thành phần UI đang chỉnh sửa liên tục; bật đồng loạt trên hàng chục Artboard nặng có thể gây trễ khi lưu tệp.

---

### 4. TỐI ƯU MÃ SVG CHO WEB & XUẤT PDF/X CHO NHÀ IN

#### 4.1: Chuẩn hóa mã SVG gọn nhẹ cho Web và Mobile
1. Chọn lát cắt icon -> chọn định dạng `SVG` -> mở bảng tùy chọn nâng cao (nút `...` / `More`).
2. **Preset:** chọn **SVG (for web)**.
3. Các thiết lập cần rà soát:
   - **Use viewBox:** Bật (giúp CSS co giãn linh hoạt thay vì khóa cứng chiều rộng/cao theo pixel).
   - **Decimal Places:** Đặt `2` (giảm đáng kể dung lượng tệp SVG mà không sai lệch hình học).
   - **Flatten Transforms:** Bật (nướng trực tiếp ma trận xoay/tỷ lệ vào tọa độ path cho DOM sạch sẽ).
   - **Embed Fonts / Text:** Tắt nhúng font hoặc chọn chuyển chữ thành đường cong (`Text as Curves`) nếu dùng phông chữ hiển thị đặc thù.
   - **Rasterize:** Chọn `Nothing` (đảm bảo không vô tình nhúng khối ảnh bitmap base64 vào trong mã SVG).

#### 4.2: Xuất tệp PDF/X đạt chuẩn in thương mại
1. Quay lại **Designer / Vector Persona** (nhấp biểu tượng đầu tiên ở góc trên bên trái).
2. Vào `File > Export...` (phím tắt `Ctrl+Alt+Shift+S` trên Windows / `Cmd+Option+Shift+S` trên macOS).
3. Chọn định dạng **PDF**, mục **Preset** chọn **PDF/X-4:2010** (chuẩn ISO hiện đại giữ nguyên độ trong suốt trực tiếp và hỗ trợ quản lý màu CMYK).
4. Kiểm tra các tùy chọn bắt buộc:
   - **Raster DPI:** `300 DPI`.
   - **Include Bleed:** Phải tích chọn (rất quan trọng: dù đã cài lề tràn `3 mm` trong Document Setup, nếu quên tích mục này khi xuất, phần mềm vẫn cắt đúng mép thành phẩm).
   - **Printer Marks:** Tích chọn `Include printer marks`, `Crop marks` (dấu cắt) và `Registration marks` (dấu căn chồng màu).
   - **Color Space:** `CMYK` (chọn profile đúng yêu cầu nhà in như `U.S. Web Coated SWOP v2` hoặc `ISO Coated v2`).
   - **Embed Fonts:** `All Fonts` (hoặc chuyển toàn bộ chữ sang curves nếu nhà in yêu cầu).

---

### 5. BẢNG KIỂM TRA & NGHIỆM THU BẢN VẼ
- [ ] Đã chuyển vào `Export Persona` qua thanh công cụ góc trên bên trái.
- [ ] Tạo được **Layer-Based Slices** bám sát khung bao từng nhóm UI component.
- [ ] Thiết lập đủ cấp độ đa mật độ (`1x`, `2x`, `3x`) với nhiều định dạng (`PNG`, `WebP`, `SVG`).
- [ ] Kiểm chứng `Continuous Export`: đã xuất lần đầu gắn thư mục đích và tự cập nhật tệp sau khi bấm lưu `Ctrl+S` / `Cmd+S`.
- [ ] Mở thử tệp `.svg` trong trình soạn thảo mã: có `viewBox`, độ chính xác 2 chữ số thập phân và không chứa chuỗi `data:image/...;base64`.
- [ ] Tệp `PDF/X-4` xuất ra có đủ dấu cắt, dấu căn chồng màu và vùng hình nền tràn hết lề `3 mm`.
