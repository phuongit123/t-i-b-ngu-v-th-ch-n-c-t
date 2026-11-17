# TÀI LIỆU HƯỚNG DẪN THỰC HÀNH — MODULE B01
## CHỦ ĐỀ: KIẾN TRÚC ẤN PHẨM, TRANG ĐÔI TẠP CHÍ & TIÊU CHUẨN BLEED 3MM

- **Tệp tài nguyên:** `B01_magazine_spec_guide.md`
- **Phân loại tài nguyên:** `GUIDE_DOCUMENT`
- **Phiên bản mục tiêu:** Serif Affinity 3.0+ (Đã kiểm chứng trên Affinity 3.3.3)
- **Không gian làm việc:** Layout Studio (không gian dàn trang Publisher)

---

### 1. MỤC TIÊU THỰC HÀNH
1. Thiết lập chính xác tài liệu in ấn thương mại với **Facing Pages** (chế độ trang đôi đối diện), số trang chia hết cho 4 và lề trong **Inner Margin / Gutter** (lề gáy đóng sách) bất đối xứng.
2. Cấu hình **Bleed** (lề tràn xén in ấn) chuẩn `3.0 mm` và kiểm tra trực quan bằng chế độ **Clip to Canvas** (phím `\`, tuyệt đối không nhấn `Ctrl+W` / `Cmd+W` vì sẽ đóng tài liệu).
3. Xây dựng cây kế thừa **Master Pages** (trang mẫu dùng chung) nhiều cấp, chèn **Dynamic Fields** (trường dữ liệu động) đánh số trang tự động và phân chia chương mục qua **Section Manager**.
4. Thiết lập **Baseline Grid** (lưới đường cơ sở căn dòng) và nối luồng văn bản qua nhiều cột bằng **Frame Text Tool (T)**.

---

### 2. THÔNG SỐ THIẾT LẬP DỰ ÁN MẪU (TẠP CHÍ A4 FACING PAGES)
Mở Affinity (vào **Layout Studio**), nhấn `Ctrl+N` (Windows) hoặc `Cmd+N` (macOS) để tạo tài liệu mới:
1. **Nhóm mẫu (Category):** `Print` hoặc `Press Ready`
2. **Khổ trang (Page Preset):** `A4` (`210 mm` x `297 mm`, khổ dọc Portrait)
3. **Trang đối diện (Facing Pages):** Tích chọn `[x] Facing Pages` (hiển thị trang đôi)
4. **Sắp xếp trang (Arrange):** `Horizontal` (ngang), **Start on:** `Right` (trang 1 là bìa trước nằm bên phải theo chuẩn tạp chí/sách)
5. **Số trang (Page Count):** `8 pages` (hoặc bội số của 4 cho tay sách in ấn thương mại)
6. **Hệ màu (Color Format):** `CMYK/8`, **Color Profile:** `Coated FOGRA39` (chuẩn châu Âu/châu Á) hoặc `U.S. Web Coated (SWOP) v2`

#### Cấu hình lề an toàn (Margins) & Lề tràn xén (Bleed)
- **Margins (tắt biểu tượng móc xích để nhập lề bất đối xứng):**
  - **Top (Lề trên):** `20 mm`
  - **Inner / Gutter (Lề trong sát gáy):** `25 mm` (khoảng trống bắt buộc để chữ không bị hút vào rãnh gáy khi đóng quyển)
  - **Outer (Lề ngoài):** `18 mm`
  - **Bottom (Lề dưới):** `22 mm`
- **Bleed (bật móc xích để đồng bộ 4 cạnh):**
  - Cả 4 cạnh (Top, Bottom, Inner, Outer): `3.0 mm` (tiêu chuẩn in offset thương mại ISO)
  - Tích chọn `[x] Include Bleed` khi xem trước và khi xuất PDF in ấn (có thể bật thêm dấu xén `Printer Marks` / thông tin vùng **Slug** ngoài mép cắt nếu nhà in yêu cầu).

---

### 3. QUY CÁCH THỬ THÁCH MỞ RỘNG (BÀI TẬP B01-01 -> B01-03)

#### A. Sách ảnh bìa cứng khổ vuông (Bài B01-01 — Coffee Table Art Book)
- **Kích thước:** `250 mm` x `250 mm` (khổ vuông), **Facing Pages** bật, **Start on:** `Right`.
- **Tổng số trang:** `16 pages` (chia hết cho 4).
- **Lề trong (Inner Gutter):** `28 mm` để bù độ cong keo gáy vuông (Perfect Bound).
- **Bleed:** `3.0 mm` ở mọi cạnh ngoài; hệ màu `CMYK/8` với profile `Coated FOGRA39`.
- **Kiểm tra tràn lề:** Kéo ảnh hoặc mảng màu nền vượt qua mép giấy cắt thành phẩm (Trim Edge) chạm khít đường dẫn **Bleed** bên ngoài. Dùng phím `\` (Backslash) bật/tắt `View > View Mode > Clip to Canvas` để kiểm tra bản cắt thành phẩm.

#### B. Cấu trúc Master Pages & Section Manager (Bài B01-02)
- **Master A (Trang mẫu gốc):** Đặt tiêu đề chạy đầu trang (Running Header) và chèn số trang động qua `Text > Insert > Fields > Page Number` (hiển thị ký hiệu `#` trên trang mẫu).
- **Master B (Trang mẫu con):** Tạo mới bằng `Add Master` và chọn `Based on: Master A` để kế thừa tiêu đề, bổ sung đường kẻ phân cách hoặc lưới cột riêng.
- **Section Manager (`Document > Section Manager`):**
  - **Section 1 (Trang 1–2):** Chọn định dạng số La Mã thường (`i, ii`) cho phần mở đầu (Front Matter).
  - **Section 2 (Trang 3–8):** Bật lại kiểu số Ả Rập (`1, 2, 3...`), chọn `Restart page numbering at 1` cho nội dung chính, đồng thời đặt tên mục để trường `Section Name` tự động hiển thị trên Header.
- **Tùy biến cục bộ không phá liên kết:** Trên trang bìa hoặc trang ảnh tràn lề, nhấp chuột phải vào layer Master trong **Layers Studio**, chọn **Edit Detached** để ẩn hoặc đổi màu số trang, sau đó bấm **Finish** trên thanh màu cam phía trên. (Hoặc chọn `Clear Masters` trên trang bìa 1).

#### C. Lưới Baseline Grid & Luồng văn bản (Bài B01-03)
- **View > Baseline Grid Manager:**
  - Tích `[x] Use baseline grid`
  - **Grid Spacing (Bước lưới):** `14 pt` (hoặc `13 pt` tùy cỡ dẫn dòng của bài viết), khớp đúng với giá trị **Leading** của chữ nội dung (Body Copy).
  - **Start Position:** `Top margin` (căn từ mép lề an toàn phía trên).
  - **Display Threshold:** `50%` để dễ quan sát lưới khi thu phóng vừa màn hình.
- **Khung văn bản nhiều cột bằng Frame Text Tool (T):**
  - Thiết lập `Columns: 3`, `Gutter (khoảng cách giữa các cột): 5 mm`.
  - Bật `Align to baseline grid` trong **Paragraph Studio** để mọi dòng chữ trên hai trang đối diện thẳng hàng tuyệt đối.
  - Bấm vào hình tam giác xanh ở góc dưới bên phải khung chữ để nối luồng chữ (Text Threading) sang trang kế tiếp. Theo dõi cảnh báo chữ tràn (biểu tượng con mắt đỏ hoặc **Preflight Studio**).

---

### 4. DANH SÁCH TỰ ĐÁNH GIÁ (CHALLENGE CHECKPOINTS)
- [ ] Số trang ấn phẩm là bội số của 4 (`8`, `16`, `24`...) và có lề trong **Inner Gutter** đủ rộng (`25–28 mm` với sách keo gáy).
- [ ] Mọi nền màu hoặc hình ảnh tràn lề đều kéo khít ra đường **Bleed** `3.0 mm`, không dừng ngay mép cắt thành phẩm.
- [ ] Phím `\` (Backslash) chuyển đổi mượt mà giữa chế độ xem có Bleed và xem thành phẩm **Clip to Canvas** (không bấm nhầm `Ctrl+W`).
- [ ] Số trang và tên mục trên **Master Pages** tự động cập nhật bằng trường `#` và **Section Name**, không gõ số thủ công.
- [ ] Dẫn dòng (Leading) của tiêu đề là bội số nguyên của bước lưới **Baseline Grid** (`2x`, `3x`), và toàn bộ khung chữ không báo lỗi tràn chữ (Overset Text).
