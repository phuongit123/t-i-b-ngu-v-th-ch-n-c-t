# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE D08
## CHỦ ĐỀ: HỆ THỐNG SYMBOLS, TÀI NGUYÊN LIÊN KẾT & THƯ VIỆN COMPONENT

- **Mã học phần:** `D08`
- **Cấp độ:** Nâng cao (`Advanced`)
- **Lộ trình:** Affinity Designer (Vector Studio)
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
**Ứng dụng mục tiêu:** Affinity (Desktop — Windows & macOS, kiểm chứng trên bản 3.3.3)

---

### 1. TỔNG QUAN DỰ ÁN & MỤC TIÊU HỆ THỐNG THIẾT KẾ

Trong bài thực hành này, bạn sẽ xây dựng một **Hệ thống UI Component Vector** có khả năng mở rộng và bảo trì tập trung cho giao diện bảng điều khiển phân tích dữ liệu. Bạn sẽ làm chủ bảng **Symbols Studio** (bảng biểu tượng đồng bộ), cơ chế công tắc **Sync (Synchronize ON/OFF)** để ghi đè cục bộ mà không phá vỡ liên kết gốc, và **Assets Studio** (thư viện tài nguyên dùng chung) để đóng gói, chia sẻ các tệp `.afassets`.

---

### 2. KIẾN TRÚC SYMBOLS STUDIO & NGUYÊN LÝ ĐỒNG BỘ

1. **Mở bảng Symbols Studio**:
   - Menu: `Window > Vector > Symbols` (hoặc `Window > Symbols`; ở phiên bản cũ là `View > Studio > Symbols`), hoặc nhấp biểu tượng hai hình thoi lồng màu cam ở thanh dock bên phải.
2. **Khởi tạo Master Symbol (Biểu tượng gốc)**:
   - Chọn một đối tượng hoặc nhóm layer vector trên bản vẽ.
   - Trong **Symbols Studio**, nhấn nút **Create**.
   - Trong bảng **Layers Studio**, layer vừa chuyển đổi sẽ có thanh đánh dấu dọc màu cam ở cạnh trái và nhãn `Symbol`.
   - Biểu tượng đồng thời xuất hiện trong danh sách của Symbols Studio để bạn kéo thả tạo thêm bản sao bất kỳ lúc nào.
3. **Cơ chế công tắc đồng bộ (Nút Sync)**:
   - **Sync ON (Nền cam đang bật):** Chế độ cập nhật toàn cục. Mọi chỉnh sửa hình học, màu sắc, đường viền, bo góc hay chữ trên một bản sao đều lan truyền ngay lập tức sang toàn bộ các bản sao khác trong cùng tài liệu.
   - **Sync OFF (Nền xám đã tắt):** Chế độ ghi đè cục bộ (Local Override). Bạn có thể sửa nội dung chữ (chẳng hạn đổi nhãn nút từ `"Save Draft"` sang `"Export PDF"`) hoặc đổi sắc thái màu riêng cho một bản sao mà không ảnh hưởng đến các bản sao còn lại.
   - **Bật lại Sync:** Khi bật lại Sync ON, mối liên kết cấu trúc được khôi phục; các thay đổi khung chung sau đó (như bo tròn góc hoặc thêm biểu tượng phụ) vẫn đồng bộ trên tất cả bản sao, trong khi phần chữ đã ghi đè riêng vẫn được giữ nguyên.

---

### 3. QUẢN LÝ ASSETS STUDIO & GÓI THƯ VIỆN `.afassets`

1. **Mở bảng Assets Studio**:
   - Menu: `View > Studio > Assets` (hoặc qua menu `Window` tùy bố cục phiên bản hiện hành).
2. **Tổ chức danh mục Category và Subcategory**:
   - Nhấp biểu tượng menu ba gạch (`≡`) ở góc trên bên phải bảng -> chọn `Create New Category` (ví dụ: `"Affinity Enterprise UI"`).
   - Nhấp `≡` -> chọn `Create New Subcategory` (ví dụ: `"Buttons"`, `"Badges"`, `"Form Inputs"`).
   - Đổi tên danh mục rõ ràng theo cấu trúc hệ thống thiết kế để cả nhóm dễ tra cứu.
3. **Lưu thành phần vào thư viện**:
   - Chọn nhóm thành phần đã hoàn thiện trên bản vẽ -> nhấp menu `≡` ngay tại dòng Subcategory -> chọn `Add from Selection`.
4. **Xuất và chia sẻ gói tài nguyên**:
   - Nhấp menu `≡` trên cùng của bảng Assets Studio -> chọn `Export Assets...` để tạo tệp nhị phân `.afassets` gọn nhẹ gửi cho đồng nghiệp hoặc lưu vào kho dự án.

---

### 4. THỰC HÀNH TỪNG BƯỚC: XÂY DỰNG HỆ THỐNG NÚT BẤM

#### Bước 4.1: Dựng nút bấm gốc (Master Button)
1. Tạo hình chữ nhật kích thước `160 × 44 px`.
2. Đặt bán kính bo góc `8 px` bằng **Corner Tool (`C`)** hoặc trên thanh Context Toolbar.
3. Tô màu nền xanh chàm `#4F46E5`, tắt đường viền (Stroke: None).
4. Thêm một biểu tượng dấu tích vector `16 × 16 px` (`#FFFFFF`) và dòng chữ bằng **Artistic Text Tool (`T`)** cỡ `14 pt`, nét Medium, màu `#FFFFFF` với nội dung `"Primary Action"`.
5. Nhóm tất cả layer (`Ctrl+G` / `Cmd+G`) và đặt tên là `Component_Button_Primary`.

#### Bước 4.2: Chuyển thành Symbol và nhân bản
1. Chọn nhóm `Component_Button_Primary`.
2. Trong **Symbols Studio**, nhấn **Create**.
3. Kéo từ bảng Symbols Studio ra bản vẽ thêm 3 bản sao nữa (hoặc nhấn `Ctrl+J` / `Cmd+J`) để có tổng cộng 4 nút.
4. Sắp xếp 4 nút thẳng hàng thành một thanh thao tác ngang.

#### Bước 4.3: Ghi đè nội dung an toàn với Sync OFF
1. Trong **Symbols Studio**, nhấp nút **Sync** để chuyển sang trạng thái **OFF** (màu xám).
2. Nhấp đúp vào chữ của nút thứ 2 và đổi thành `"Save Draft"`.
3. Đổi chữ của nút thứ 3 thành `"Export PDF"`.
4. Đổi chữ của nút thứ 4 thành `"Delete Record"`.
5. Kiểm tra: mỗi nút mang một nhãn riêng, nhưng tất cả vẫn giữ thanh dọc màu cam chứng tỏ liên kết Symbol gốc còn nguyên vẹn.

#### Bước 4.4: Kiểm chứng đồng bộ toàn cục với Sync ON
1. Nhấp nút **Sync** trở lại trạng thái **ON** (sáng màu cam).
2. Chọn nút đầu tiên, chỉnh bán kính bo góc từ `8 px` thành `22 px` (dạng viên thuốc).
3. Quan sát kết quả: cả 4 nút đều đồng loạt chuyển sang dáng viên thuốc `22 px`, nhưng nhãn chữ riêng (`"Primary Action"`, `"Save Draft"`, `"Export PDF"`, `"Delete Record"`) vẫn được bảo toàn nguyên vẹn.
4. Thêm một đường viền trong `1 pt` (`#818CF8`) cho nút đầu tiên: cả 4 nút lập tức nhận viền mới đồng bộ.

#### Bước 4.5: Lưu trữ vào Assets Studio
1. Chọn nhóm nút hoàn chỉnh trên bản vẽ.
2. Trong **Assets Studio**, tại mục con `"Buttons"`, chọn `Add from Selection`.
3. Tạo một tài liệu trống mới và thử kéo nút từ **Assets Studio** thả vào để kiểm tra khả năng tái sử dụng giữa các dự án.

---

### 5. BẢNG KIỂM TRA & NGHIỆM THU BẢN VẼ
- [ ] Bảng `Symbols Studio` và `Assets Studio` hoạt động ổn định trong không gian làm việc.
- [ ] Tạo được Symbol gốc có thanh đánh dấu dọc màu cam trong `Layers Studio`.
- [ ] Ghi đè chữ cục bộ bằng `Sync OFF` thành công mà không nhấn nhầm `Detach`.
- [ ] Cập nhật bo góc và viền khi bật `Sync ON` lan truyền đồng bộ sang mọi bản sao nhưng giữ nguyên chữ đã ghi đè.
- [ ] Phân loại danh mục `Assets Studio` gọn gàng, không để rác layer hoặc đường nét thừa.
