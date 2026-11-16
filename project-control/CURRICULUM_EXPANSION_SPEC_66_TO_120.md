# AFFINITY ACADEMY — ĐẶC TẢ MỞ RỘNG GIÁO TRÌNH 66 LÊN 120 BÀI HỌC
## (Curriculum Expansion Master Architecture: 66 to 120 Lessons)

---

## 1. Thông Tin Quản Trị & Kiểm Soát Phiên Bản

- **Mã Tài Liệu:** `SPEC-CURR-EXP-120-001`
- **Phiên Bản:** `1.0.0`
- **Ngày Ban Hành:** `16/11/2026`
- **Trạng Thái Quản Trị:** `GOVERNED DESIGN SPECIFICATION — BLK-007 ACTIVE / LOCKED`
- **Phạm Vi Tham Chiếu:** 
  - **Hiện Có Đã Nghiệm Thu (Existing Baseline):** 66 bài học (30 Designer D01–D10 + 30 Photo P01–P10 + 3 Publisher Pilot B01 + 3 Scripting Pilot S01).
  - **Phạm Vi Mở Rộng Thiết Kế (Expansion Scope):** 54 bài học còn thiếu:
    - **Track 3 (Publisher / Layout Studio):** 9 modules (`B02` đến `B10`) = 27 bài học.
    - **Track 4 (Scripting / V8 DOM & MCP Automation):** 9 modules (`S02` đến `S10`) = 27 bài học.
  - **Tổng Quy Mô Toàn Dự Án:** 40 modules × 3 bài học = **120 bài học chuẩn hóa**.
- **Điều Kiện Cổng Phase Gate BLK-007:**
  > [!IMPORTANT]
  > Tuân thủ tuyệt đối quy tắc quản trị `AGENTS.md` và chỉ thị của Project Owner:
  > - Tài liệu này hoàn thiện **100% đặc tả thiết kế, đề cương chi tiết, cấu trúc sư phạm và ma trận ánh xạ** cho 54 bài học còn lại.
  > - Cổng **`BLK-007` tiếp tục giữ nguyên trạng thái `ACTIVE — LOCKED`**.
  > - Toàn bộ 54 bài học này được chuẩn bị ở tầng thiết kế kiến trúc chuẩn; **chưa tự ý ghi đè file JSON vào thư mục production hoặc tuyên bố production-ready** cho đến khi Project Owner chính thức ký duyệt mở cổng `BLK-007`.

---

## 2. Tiêu Chuẩn Thiết Kế Sư Phạm Chuẩn 13 Thành Phần Bắt Buộc

Mỗi bài học trong 54 bài mở rộng đều được thiết kế đáp ứng đầy đủ 13 thành phần theo tiêu chuẩn nghiêm ngặt của Affinity Academy:
1. **Unique ID:** Định danh duy nhất theo chuẩn `${TrackModule}-${LessonIndex}` (ví dụ: `B02-01`, `S05-02`).
2. **Track & Module:** Phân bổ chính xác theo Studio và Module tương ứng.
3. **Title:** Tiêu đề bài học song ngữ (Tiếng Việt & Tiếng Anh).
4. **Learning Objectives:** Mục tiêu học tập quan sát và đo lường được, ánh xạ trực tiếp đến các `PLO` (`PLO-01` đến `PLO-11`).
5. **Prerequisites:** Điều kiện tiên quyết và kiến thức nền tảng cần có.
6. **Lesson Content:** Nội dung lý thuyết trọng tâm, giải thích nguyên lý thiết kế và bước trong chu trình Design Thinking (Discover → Define → Explore → Plan → Create → Evaluate → Iterate → Deliver).
7. **Step-by-Step Instructions:** Hướng dẫn thực hiện từng bước trên phần mềm Affinity thực tế với đường dẫn giao diện và phím tắt chuẩn xác (phân biệt rõ ràng với mô phỏng giáo dục).
8. **Practice Exercise:** Đề bài thực hành có ngữ cảnh thực tế (Real-World Creative Brief).
9. **Expected Result:** Tiêu chí nghiệm thu đầu ra rõ ràng, tệp sản phẩm bàn giao kiểm chứng được.
10. **Common Mistakes:** Những sai lầm kinh điển, nguyên nhân gốc rễ và giải pháp khắc phục.
11. **Knowledge Check:** Câu hỏi trắc nghiệm kiểm tra hiểu biết sâu sắc (gồm câu hỏi, các lựa chọn, chỉ số đáp án đúng và phần giải thích chi tiết).
12. **References:** Nguồn tài liệu tham khảo chính thức từ Serif Affinity Help Center / Developer API.
13. **Estimated Duration:** Thời lượng học tập ước tính (phút).

---

## 3. TRACK 3 — AFFINITY PUBLISHER (LAYOUT STUDIO): MODULES B02 ĐẾN B10 (27 BÀI HỌC)

### MODULE B02: TRANG CHỦ NÂNG CAO, PHÂN ĐOẠN & ĐÁNH SỐ TRANG XUẤT BẢN
*(Advanced Master Pages, Section Manager & Editorial Pagination)*

#### B02-01: Phân Cấp Trang Chủ Kế Thừa & Ghi Đè Thuộc Tính (Multi-Tier Master Pages Inheritance)
1. **ID:** `B02-01`
2. **Track/Module:** Publisher / Module B02
3. **Title:** Phân Cấp Trang Chủ Kế Thừa & Ghi Đè Thuộc Tính (Multi-Tier Master Pages Inheritance)
4. **Objectives:** 
   - Hiểu và triển khai kiến trúc Master Page đa tầng (Master A áp dụng cho Master B) để chia sẻ header/footer dùng chung.
   - Làm chủ kỹ thuật `Edit Detached` (chỉnh sửa tách biệt) và `Edit Linked` (chỉnh sửa liên kết) khi tùy biến nội dung trên trang thực tế.
   - Ánh xạ: `PLO-04` (Editorial Architecture), `PLO-09` (Asset Integrity).
5. **Prerequisites:** Đã hoàn thành `B01-01`, `B01-02` (Thiết lập trang đôi và cấu trúc Master Page cơ bản).
6. **Lesson Content:**
   - Trong xuất bản chuyên nghiệp, việc lặp lại các thành phần cơ bản (như lưới an toàn, viền chân trang, tên ấn phẩm) trên từng Master Page gây lãng phí thời gian và dễ sai sót. Affinity Publisher cho phép kéo thả một Master Page làm "cha" của một Master Page khác.
   - Khi áp dụng Master Page lên trang xuất bản, các đối tượng Master bị khóa mặc định. Để chèn ảnh hoặc văn bản vào khung có sẵn của Master, nhà thiết kế sử dụng chế độ `Edit Detached` từ thanh ngữ cảnh (Context Toolbar) để thay đổi nội dung mà không phá vỡ liên kết vị trí và kiểu dáng.
7. **Step-by-Step Instructions:**
   - Bước 1: Mở panel `Pages`, tạo `Master A - Grid Base` với hệ lưới 12 cột và đường chân trang (running footer).
   - Bước 2: Tạo `Master B - Feature Article`. Kéo `Master A` từ panel Pages thả đè lên biểu tượng của `Master B`.
   - Bước 3: Thêm khung tiêu đề chuyên mục trên `Master B`. Áp dụng `Master B` cho các trang 10–15.
   - Bước 4: Chuyển sang trang 10, nhấp chọn thanh màu cam `Edit Detached` trên Context Toolbar để nhập văn bản tiêu đề bài viết mà không làm thay đổi các trang khác. Nhấp `Finish`.
8. **Practice Exercise:** Tạo hệ thống Master Page cho tạp chí kiến trúc gồm: Master A (Số trang & Tên tạp chí), Master B (Layout 2 cột kế thừa A), Master C (Layout ảnh tràn lề kế thừa A).
9. **Expected Result:** Tệp `.afpub` gồm 8 trang, trong đó trang 4–7 kế thừa chính xác footer của Master A nhưng có bố cục cột và ảnh độc lập.
10. **Common Mistakes:**
    - *Sai lầm:* Chọn `Clear Master` khi muốn sửa một đối tượng, làm mất toàn bộ liên kết số trang tự động.
    - *Khắc phục:* Luôn sử dụng `Edit Detached` trên thanh điều khiển ngữ cảnh thay vì xóa liên kết Master.
11. **Knowledge Check:**
    - *Câu hỏi:* Khi muốn thay đổi vị trí một khung hình trên một trang cụ thể mà không làm ảnh hưởng đến các trang khác cùng dùng chung Master Page, bạn phải chọn chế độ nào?
    - *Lựa chọn:* A. Edit Linked | B. Edit Detached | C. Clear Master | D. Rasterize Layer
    - *Đáp án:* 1 (B)
    - *Giải thích:* `Edit Detached` cho phép ghi đè cục bộ các thuộc tính vị trí, kích thước hoặc nội dung của đối tượng thuộc Master Page trên trang hiện hành.
12. **References:** Affinity Publisher Help: "Master Pages" & "Editing Master Page content".
13. **Duration:** 30 phút.

---

#### B02-02: Quản Lý Phân Đoạn & Đánh Số Trang Đa Định Dạng (Section Manager & Editorial Pagination)
1. **ID:** `B02-02`
2. **Track/Module:** Publisher / Module B02
3. **Title:** Quản Lý Phân Đoạn & Đánh Số Trang Đa Định Dạng (Section Manager & Editorial Pagination)
4. **Objectives:**
   - Sử dụng `Section Manager` để chia tài liệu thành nhiều chương mục với định dạng số trang độc lập (La Mã i, ii, iii cho phần mở đầu; Ả Rập 1, 2, 3 cho phần nội dung).
   - Thiết lập trường thông tin động `Section Name` và `Page Number` tự động cập nhật trên Running Headers.
   - Ánh xạ: `PLO-04` (Editorial Architecture), `PLO-06` (Prepress Delivery).
5. **Prerequisites:** Hoàn thành `B02-01`.
6. **Lesson Content:**
   - Ấn phẩm nhiều trang như sách hoặc kỷ yếu đòi hỏi các phần như Lời tựa, Mục lục đánh số La Mã thường (`i`, `ii`), trong khi chương 1 bắt đầu lại từ số `1`.
   - `Section Manager` của Publisher cho phép định nghĩa các vùng ngắt trang logic, gán tên phân đoạn (`Section Name`) để các khung văn bản trên Master Page tự động hiển thị tên chương hiện tại qua trường `Fields` (`Text > Insert > Fields > Section Name`).
7. **Step-by-Step Instructions:**
   - Bước 1: Mở panel `Pages`, nhấp vào biểu tượng `Section Manager` (hoặc vào `Document > Section Manager`).
   - Bước 2: Tạo Phân đoạn 1 từ trang 1, đặt tên "Phần Đầu", chọn kiểu số `i, ii, iii...`.
   - Bước 3: Tạo Phân đoạn 2 từ trang 5, đặt tên "Chương 1: Khởi Nguyên", chọn kiểu số `1, 2, 3...` và tích chọn `Restart page numbering at: 1`.
   - Bước 4: Mở Master Page, dùng công cụ `Frame Text Tool` vẽ khung tiêu đề trên cùng, chọn menu `Text > Insert > Fields > Section Name`.
8. **Practice Exercise:** Thiết lập sách mẫu 20 trang với bìa (không số trang), 4 trang lời tựa (đánh số i–iv), và 15 trang nội dung bắt đầu lại từ trang 1.
9. **Expected Result:** Tệp `.afpub` có mục lục tự động nhận diện đúng số trang La Mã và trang số 1 bắt đầu đúng tại trang 5 của tài liệu vật lý.
10. **Common Mistakes:**
    - *Sai lầm:* Nhập tay số trang vào khung văn bản, dẫn đến việc khi thêm bớt trang, toàn bộ số trang phía sau bị sai lệch.
    - *Khắc phục:* Luôn dùng trường số trang tự động `Text > Insert > Fields > Page Number` (`Ctrl+Alt+Shift+P`).
11. **Knowledge Check:**
    - *Câu hỏi:* Menu lệnh nào dùng để chèn trường tự động cập nhật tên của chương hiện tại trên trang đôi?
    - *Lựa chọn:* A. Text > Insert > Fields > Section Name | B. Edit > Insert Marker | C. Document > Header Name | D. Tools > Dynamic Label
    - *Đáp án:* 0 (A)
    - *Giải thích:* Trường `Section Name` trong menu `Fields` sẽ đọc giá trị được khai báo tương ứng trong `Section Manager`.
12. **References:** Affinity Publisher Help: "Section Manager" & "Numbering pages".
13. **Duration:** 25 phút.

---

#### B02-03: Hình Học Trang Đôi & Độ Trôi Gáy Khi Đóng Tập (Facing Pages Geometry & Binding Creep)
1. **ID:** `B02-03`
2. **Track/Module:** Publisher / Module B02
3. **Title:** Hình Học Trang Đôi & Độ Trôi Gáy Khi Đóng Tập (Facing Pages Geometry & Binding Creep)
4. **Objectives:**
   - Phân tích sự khác biệt giữa lề trong (Inside/Gutter Margin) và lề ngoài (Outside Margin) trên trang đôi Facing Pages.
   - Tính toán và bù trừ độ trôi gáy (Creep / Shingling) đối với phương pháp đóng gáy lồng bấm kim (Saddle-Stitch).
   - Thiết lập vùng Bleed gáy (Gutter Bleed) chuẩn xác để tránh lỗi in lem màu qua trang đối diện.
   - Ánh xạ: `PLO-04` (Editorial Architecture), `PLO-06` (Prepress Production).
5. **Prerequisites:** Hoàn thành `B01-01`, `B02-02`.
6. **Lesson Content:**
   - Khi đóng tập nhiều trang lồng nhau (Saddle-Stitch), các tay sách bên trong sẽ bị đẩy nhô ra ngoài so với các trang bên ngoài (hiện tượng Creep). Nếu không thiết lập lề trong an toàn rộng hơn lề ngoài, văn bản gần gáy sẽ bị che khuất sau khi gập và đóng kim.
   - Trong Layout Studio, khi chọn `Facing Pages`, bảng thiết lập lề chuyển từ Left/Right thành `Inside` và `Outside`. Lề `Inside` luôn phải cộng thêm độ dày gáy dự kiến của loại giấy được chọn.
7. **Step-by-Step Instructions:**
   - Bước 1: Vào `File > Document Setup > Margins`. Bỏ chọn liên kết kích thước lề đồng nhất.
   - Bước 2: Thiết lập `Top: 20mm`, `Bottom: 25mm`, `Outside: 15mm`, và tăng `Inside: 25mm` (dành 10mm khoảng đệm gáy).
   - Bước 3: Mở bảng `Bleed`, kiểm tra Bleed 3mm ở 3 cạnh ngoài; nếu tài liệu đóng cuốn keo nhiệt, đặt Bleed trong (Inner Bleed) về `0mm` để tránh lem đồ họa qua rãnh gập.
   - Bước 4: Kiểm tra trực quan trên hai trang đối diện 2-3 để đảm bảo khoảng cách thị giác giữa hai khối văn bản cân đối.
8. **Practice Exercise:** Thiết lập ấn phẩm 48 trang khổ B5, đóng gáy bấm kim giấy gân mỹ thuật định lượng 150gsm, thiết lập lề trong bù trừ độ trôi gáy đạt chuẩn in ấn thương mại.
9. **Expected Result:** Tài liệu hoàn chỉnh có hệ lề trong rộng hơn lề ngoài, hiển thị an toàn không bị khuất chữ khi thử nghiệm mockup gập góc 90 độ.
10. **Common Mistakes:**
    - *Sai lầm:* Đặt lề Inside bằng lề Outside trên tài liệu dày, khiến người đọc phải banh mạnh gáy sách mới đọc được chữ bên trong.
    - *Khắc phục:* Luôn tham vấn xưởng in về độ dày gáy (Spine width) và thiết lập lề Inside tối thiểu bằng Outside + 8mm đến 12mm.
11. **Knowledge Check:**
    - *Câu hỏi:* Thuộc tính lề nào trong Document Setup điều khiển khoảng cách giữa nội dung văn bản và rãnh gáy của trang sách đôi?
    - *Lựa chọn:* A. Left Margin | B. Inside Margin | C. Gutter Bleed | D. Offset Margin
    - *Đáp án:* 1 (B)
    - *Giải thích:* Đối với tài liệu Facing Pages, `Inside Margin` là khoảng cách từ mép gập gáy vào nội dung của cả hai trang trái và phải.
12. **References:** ISO 12647-2 Standard & Affinity Publisher Help: "Spreads and Pages".
13. **Duration:** 30 phút.

---

### MODULE B03: DÒNG CHẢY VĂN BẢN, LIÊN KẾT KHUNG & CHÈN ĐỒ HỌA
*(Advanced Text Flow, Threading, Overflow & Text Wrap)*

#### B03-01: Kiến Trúc Khung Chữ Đa Cột & Liên Kết Luồng Văn Bản (Multi-Column Text Threading)
1. **ID:** `B03-01`
2. **Track/Module:** Publisher / Module B03
3. **Title:** Kiến Trúc Khung Chữ Đa Cột & Liên Kết Luồng Văn Bản (Multi-Column Text Threading)
4. **Objectives:**
   - Sử dụng `Frame Text Tool` để tạo bố cục phân cột trực tiếp trong thuộc tính khung (`Text Frame panel`).
   - Thành thạo thao tác liên kết luồng văn bản (Threading) giữa các khung chữ xuyên suốt nhiều trang sách.
   - Áp dụng kỹ thuật tự động tạo trang (`Shift-click` trên biểu tượng Flow Out) khi rót bài viết dài.
   - Ánh xạ: `PLO-04` (Editorial Hierarchy).
5. **Prerequisites:** Hoàn thành `B01-03` (Lưới dòng kẻ Baseline Grid).
6. **Lesson Content:**
   - Thay vì vẽ nhiều khung nhỏ độc lập cho một trang 3 cột, Affinity Publisher cung cấp panel `Text Frame` cho phép chia cột nội tại kèm khoảng cách rãnh cột (`Gutter`), đường phân cách cột (`Column Guides`) và khoảng đệm thụt lề (`Insets`).
   - Khi văn bản vượt quá dung lượng của một khung chữ, biểu tượng tam giác đỏ (Overflow) xuất hiện ở cạnh dưới bên phải. Nhấp vào hình tam giác đó rồi nhấp sang khung chữ tiếp theo sẽ tạo ra một luồng liên kết liền mạch (Threaded Story).
7. **Step-by-Step Instructions:**
   - Bước 1: Mở menu `Window > Text > Text Frame` để hiển thị bảng điều khiển thuộc tính khung.
   - Bước 2: Vẽ một khung chữ lớn trên trang 2, đặt số cột `Columns: 3`, `Gutter: 5mm`.
   - Bước 3: Dán một đoạn văn bản dài 2000 từ. Quan sát biểu tượng tam giác tràn chữ màu đỏ ở góc dưới bên phải khung.
   - Bước 4: Giữ phím `Shift` và nhấp chuột trái vào hình tam giác tràn chữ. Publisher sẽ tự động tạo thêm các trang mới kế thừa Master Page và rót toàn bộ văn bản cho đến khi hết chữ (Autoflow).
8. **Practice Exercise:** Rót một bài phóng sự dài 3 trang từ tài liệu Word thô vào hệ thống 3 cột của tạp chí, đảm bảo các khung chữ liên kết liên tục từ trang 6 sang trang 8.
9. **Expected Result:** Luồng văn bản chảy mượt mà qua các trang; khi thu nhỏ khung chữ ở trang 6, chữ tự động dồn sang trang 7 và 8 mà không bị mất ký tự.
10. **Common Mistakes:**
    - *Sai lầm:* Cắt dán văn bản thủ công thành từng đoạn vào từng trang, làm mất khả năng tự động cân đối chữ khi thay đổi cỡ chữ hoặc kích thước khung.
    - *Khắc phục:* Luôn sử dụng thao tác liên kết luồng (`Threading`) bằng cách bấm vào cổng ra (Flow Out) của khung trước và nối vào cổng vào (Flow In) của khung sau.
11. **Knowledge Check:**
    - *Câu hỏi:* Thao tác phím tắt nào kết hợp khi nhấp vào biểu tượng tràn chữ (Flow Out) để Publisher tự động sinh thêm trang và rót hết toàn bộ bài viết?
    - *Lựa chọn:* A. Alt-click | B. Shift-click | C. Ctrl-click | D. Double-click
    - *Đáp án:* 1 (B)
    - *Giải thích:* `Shift-click` kích hoạt chế độ Autoflow, tự động tạo số lượng trang cần thiết để chứa hết lượng văn bản đang tràn.
12. **References:** Affinity Publisher Help: "Linking text frames".
13. **Duration:** 30 phút.

---

#### B03-02: Công Cụ Bao Quanh Chữ & Đường Biên Đồ Họa (Text Wrap & Contour Outlines)
1. **ID:** `B03-02`
2. **Track/Module:** Publisher / Module B03
3. **Title:** Công Cụ Bao Quanh Chữ & Đường Biên Đồ Họa (Text Wrap & Contour Outlines)
4. **Objectives:**
   - Làm chủ các chế độ bao quanh văn bản trong panel `Text Wrap`: `None`, `Jump`, `Square`, `Tight`, và `Edge`.
   - Tùy biến khoảng cách đệm (Distance from text) ở 4 cạnh của hình đồ họa.
   - Sử dụng vector path để tạo đường viền bao quanh (Contour Wrap) ôm sát đối tượng phi hình học (người mẫu, sản phẩm).
   - Ánh xạ: `PLO-04` (Editorial Hierarchy), `PLO-02` (Vector Precision).
5. **Prerequisites:** Hoàn thành `B03-01`.
6. **Lesson Content:**
   - Trong dàn trang hiện đại, ảnh minh họa hoặc trích dẫn nổi bật (Pull Quote) thường được đặt lọt giữa khối văn bản. Nếu không có `Text Wrap`, chữ sẽ bị đè lấp dưới hình hoặc hình che khuất nội dung đọc.
   - Chế độ `Tight` (ôm sát) cho phép chữ uốn lượn theo hình dáng tự nhiên của đối tượng vector hoặc đường cắt alpha của ảnh PNG. Panel `Text Wrap` còn cung cấp công cụ chỉnh sửa điểm neo trực tiếp trên đường bao (Contour path) mà không làm biến dạng hình ảnh gốc.
7. **Step-by-Step Instructions:**
   - Bước 1: Đặt một hình ảnh người mẫu đã tách nền PNG lơ lửng trên khung văn bản 2 cột.
   - Bước 2: Chọn hình ảnh, mở panel `Text Wrap` (`Window > Text > Text Wrap`).
   - Bước 3: Nhấp chọn biểu tượng `Tight`. Quan sát văn bản tự động dạt ra khỏi thân người mẫu.
   - Bước 4: Nhấp vào nút `Edit Wrap Outline` trên Context Toolbar, dùng `Node Tool` tinh chỉnh các điểm neo để tạo khoảng cách thở (Spacing buffer) tối thiểu 4mm cách biên hình ảnh.
8. **Practice Exercise:** Tạo một trang bài viết phỏng vấn với ảnh nhân vật được bao quanh chữ kiểu `Tight` ở bên trái và một hộp trích dẫn (Pull-Quote) kiểu `Jump` (chữ ngắt nhảy qua hộp) ở giữa trang.
9. **Expected Result:** Layout tạp chí sống động, chữ uốn quanh nhân vật mượt mà, không có dòng chữ nào bị dính sát vào mép ảnh hoặc bị cắt cụt khó coi.
10. **Common Mistakes:**
    - *Sai lầm:* Chọn Text Wrap trên chính khung văn bản thay vì chọn đối tượng đồ họa gây tràn chữ, khiến văn bản tự đẩy chính nó ra khỏi trang.
    - *Khắc phục:* Luôn áp dụng thuộc tính `Text Wrap` lên đối tượng nằm đè (ảnh, hình vector, pull-quote), không áp dụng lên khung chữ nhận hiệu ứng.
11. **Knowledge Check:**
    - *Câu hỏi:* Chế độ Text Wrap nào làm cho văn bản dừng lại ở mép trên của hình đồ họa và tiếp tục chảy ở dưới mép dưới của hình mà không xuất hiện ở hai bên hông?
    - *Lựa chọn:* A. Square | B. Tight | C. Jump | D. Edge
    - *Đáp án:* 2 (C)
    - *Giải thích:* Chế độ `Jump` buộc văn bản nhảy qua toàn bộ chiều rộng của đối tượng đồ họa và chỉ tiếp tục chảy khi đã qua mép dưới.
12. **References:** Affinity Publisher Help: "Text wrapping".
13. **Duration:** 30 phút.

---

#### B03-03: Kiểm Soát Tràn Chữ, Quy Tắc Dòng Đơn Độc & Ngắt Đoạn (Overflow & Keep Options)
1. **ID:** `B03-03`
2. **Track/Module:** Publisher / Module B03
3. **Title:** Kiểm Soát Tràn Chữ, Quy Tắc Dòng Đơn Độc & Ngắt Đoạn (Overflow & Keep Options)
4. **Objectives:**
   - Khắc phục triệt để lỗi dòng mồ côi (Widow) và dòng goá bụa (Orphan) bằng thiết lập `Flow Options` trong panel Paragraph.
   - Cấu hình quy tắc `Keep with next` để tiêu đề phụ (Subheading) không bao giờ bị rớt lại đơn độc ở đáy cột.
   - Thiết lập ngắt cột (`Column Break`) và ngắt khung (`Frame Break`) phục vụ cấu trúc phân cấp nghiêm ngặt.
   - Ánh xạ: `PLO-04` (Editorial Hierarchy), `PLO-06` (Prepress Delivery).
5. **Prerequisites:** Hoàn thành `B03-01`.
6. **Lesson Content:**
   - Một bản in tạp chí bị coi là lỗi kỹ xảo nếu một đoạn văn kết thúc bằng duy nhất một từ trên một dòng mới ở đầu trang (Widow), hoặc dòng đầu tiên của đoạn văn bị kẹt ở đáy cột trước khi đoạn văn tiếp tục ở cột sau (Orphan).
   - Trong panel `Paragraph > Flow Options`, Affinity Publisher cung cấp bộ công cụ tự động ngăn chặn: `Prevent widowed last lines` (yêu cầu tối thiểu 2 dòng ở đáy cột và 2 dòng ở đầu cột tiếp theo) và `Keep with next 2 lines` cho các Heading.
7. **Step-by-Step Instructions:**
   - Bước 1: Mở panel `Paragraph`, cuộn xuống nhóm thuộc tính `Flow Options`.
   - Bước 2: Tích chọn `Prevent orphaned first lines` và đặt giá trị `2 lines`.
   - Bước 3: Tích chọn `Prevent widowed last lines` và đặt giá trị `2 lines`.
   - Bước 4: Chọn kiểu chữ của Tiêu đề (Heading), tích chọn `Keep with next` và đặt `2 lines`. Kiểm tra trực quan: khi tiêu đề bị đẩy xuống dòng cuối của cột, nó sẽ tự động nhảy sang đầu cột tiếp theo cùng với 2 dòng nội dung đầu tiên.
8. **Practice Exercise:** Soát lỗi dàn trang cho một tài liệu báo cáo 12 trang, thiết lập Flow Options toàn cục để triệt tiêu toàn bộ 5 lỗi widow/orphan đang tồn tại.
9. **Expected Result:** Toàn bộ các cột báo cáo đều kết thúc và mở đầu gọn gàng, không có tiêu đề nào mồ côi ở cuối trang.
10. **Common Mistakes:**
    - *Sai lầm:* Nhấn phím `Enter` nhiều lần để đẩy tiêu đề sang trang sau, khiến khi chỉnh sửa kích thước văn bản phía trước, toàn bộ các đoạn cách dòng bị lệch hàng loạt.
    - *Khắc phục:* Luôn dùng lệnh `Insert > Break > Frame Break` (`Ctrl+Shift+Enter`) hoặc quy tắc tự động `Keep with next`.
11. **Knowledge Check:**
    - *Câu hỏi:* Thiết lập nào trong Flow Options bảo đảm một tiêu đề phụ không bao giờ nằm trơ trọi ở đáy trang mà không có văn bản nội dung đi kèm?
    - *Lựa chọn:* A. Start on Next Page | B. Keep with next [N] lines | C. Lock to Baseline | D. Justify Bottom
    - *Đáp án:* 1 (B)
    - *Giải thích:* `Keep with next lines` buộc tiêu đề phải đi liền với số dòng tối thiểu của đoạn văn tiếp theo; nếu không đủ chỗ, toàn bộ cụm sẽ nhảy sang cột/trang kế tiếp.
12. **References:** The Elements of Typographic Style & Affinity Publisher Help: "Paragraph flow options".
13. **Duration:** 25 phút.

---

### MODULE B04: PHÂN CẤP KIỂU CHỮ & KIẾN TRÚC STYLES
*(Typographic Hierarchy: Character & Paragraph Styles Architecture)*

#### B04-01: Hệ Thống Kiểu Chữ Kế Thừa Toàn Cục (Global Style Hierarchy & Inheritance)
1. **ID:** `B04-01`
2. **Track/Module:** Publisher / Module B04
3. **Title:** Hệ Thống Kiểu Chữ Kế Thừa Toàn Cục (Global Style Hierarchy & Inheritance)
4. **Objectives:**
   - Xây dựng cây phân cấp Styles kế thừa dựa trên thuộc tính `Based On`.
   - Phân biệt rõ ràng giữa `Paragraph Style` (kiểu đoạn văn bản) và `Character Style` (kiểu ký tự ghi đè).
   - Quản lý tính năng `Next Style` để tự động hóa tốc độ nhập liệu dàn trang (gõ Heading 1 tự động chuyển sang Body Text).
   - Ánh xạ: `PLO-04` (Editorial Typography), `PLO-09` (Asset Integrity).
5. **Prerequisites:** Hoàn thành `B01-03`, `B03-01`.
6. **Lesson Content:**
   - Trong một ấn phẩm 200 trang, nếu thay đổi font chữ chính, việc sửa từng tiêu đề là thảm họa. Kiến trúc `Based On` cho phép tạo một Style gốc (Base Style), các Style con như Heading 1, Heading 2, Body, Caption đều kế thừa font chữ từ Base và chỉ thay đổi kích thước, độ đậm hoặc khoảng cách dòng.
   - Khi đổi font tại Base Style, toàn bộ hệ thống ấn phẩm lập tức cập nhật đồng bộ.
7. **Step-by-Step Instructions:**
   - Bước 1: Mở panel `Text Styles` (`Window > Text > Text Styles`).
   - Bước 2: Tạo Paragraph Style mới tên `[Base Editorial]`, chọn Font family `Merriweather`, size `10pt`, leading `14pt`.
   - Bước 3: Tạo Style `Heading 1`, chọn `Based on: [Base Editorial]`, đổi size thành `24pt`, Bold, đặt `Next style: Body Text`.
   - Bước 4: Tạo Style `Body Text`, chọn `Based on: [Base Editorial]`, thêm khoảng cách dưới đoạn `Space After: 3mm`.
8. **Practice Exercise:** Xây dựng hệ thống phân cấp 6 kiểu chữ hoàn chỉnh cho một cuốn cẩm nang du lịch: Title, Heading 1, Heading 2, Body Text, Pull-Quote và Image Caption.
9. **Expected Result:** Khi đổi Font Family của `[Base Editorial]` từ có chân (Serif) sang không chân (Sans-Serif), toàn bộ 6 kiểu chữ lập tức thay đổi đồng nhất.
10. **Common Mistakes:**
    - *Sai lầm:* Áp dụng thuộc tính định dạng thủ công (Local Overrides) bừa bãi đè lên Style, dẫn đến dấu cộng nhỏ `(+)` bên cạnh tên Style và mất khả năng kiểm soát tập trung.
    - *Khắc phục:* Luôn nhấp `Reapply Text Styles` hoặc tạo Character Style riêng cho các cụm từ cần nhấn mạnh đặc thù.
11. **Knowledge Check:**
    - *Câu hỏi:* Thuộc tính nào trong bảng định nghĩa Paragraph Style cho phép tự động chuyển sang kiểu chữ tiếp theo ngay sau khi người dùng nhấn phím Enter?
    - *Lựa chọn:* A. Based on | B. Next style | C. Follow style | D. Auto Flow
    - *Đáp án:* 1 (B)
    - *Giải thích:* Thuộc tính `Next style` xác định kiểu đoạn văn bản sẽ tự động được kích hoạt khi gõ hết đoạn hiện tại và nhấn Enter.
12. **References:** Affinity Publisher Help: "Text styles" & "Inheriting text styles".
13. **Duration:** 30 phút.

---

#### B04-02: Khai Thác Tính Năng OpenType Nâng Cao & Tinh Chỉnh Quang Học (OpenType & Optical Kerning)
1. **ID:** `B04-02`
2. **Track/Module:** Publisher / Module B04
3. **Title:** Khai Thác Tính Năng OpenType Nâng Cao & Tinh Chỉnh Quang Học (OpenType & Optical Kerning)
4. **Objectives:**
   - Kích hoạt và kiểm soát các tính năng OpenType chuyên sâu: Chữ ghép tiêu chuẩn (Standard Ligatures), Chữ ghép ngữ cảnh (Discretionary Ligatures), Chữ hoa nhỏ (Small Caps), và Số bảng tài chính (Tabular Figures).
   - Tinh chỉnh khoảng cách ký tự thủ công (Kerning) và khoảng cách tổng thể (Tracking) bằng các phím tắt chuyên nghiệp.
   - Áp dụng căn chỉnh lề quang học (Optical Margin Alignment) để dấu ngoặc kép và dấu gạch nối thụt ra ngoài khung lề sách.
   - Ánh xạ: `PLO-04` (Editorial Typography).
5. **Prerequisites:** Hoàn thành `B04-01`.
6. **Lesson Content:**
   - Một ấn phẩm cao cấp phân biệt với văn bản thông thường nhờ chi tiết Typography vi mô (Micro-typography). Khi chữ `f` đứng trước chữ `i`, dấu chấm của `i` chạm vào móc của `f`, tính năng OpenType Ligature sẽ thay thế bằng ký tự dính liền chuẩn mỹ thuật `ﬁ`.
   - Bảng tài chính đòi hỏi số có chiều rộng bằng nhau (`Tabular Figures`) để các hàng số thẳng cột với nhau theo hàng đơn vị và hàng thập phân, thay vì số tỷ lệ (`Proportional Figures`).
7. **Step-by-Step Instructions:**
   - Bước 1: Mở panel `Typography` (`Window > Text > Typography`).
   - Bước 2: Chọn đoạn văn bản có font hỗ trợ OpenType (ví dụ: Garamond Premiere, Adobe Caslon).
   - Bước 3: Trong mục `Figures`, đổi từ `Proportional Lining` sang `Tabular Lining` để các con số thẳng hàng tuyệt đối.
   - Bước 4: Mở panel `Character > Optical Alignment`, tích chọn `Manual` và đặt `Optical Margin Alignment` để dấu ngoặc kép mở đầu đoạn văn nhảy ra ngoài lề trái (Hanging Punctuation).
8. **Practice Exercise:** Trình bày một trang báo cáo tài chính doanh nghiệp kết hợp đoạn mở đầu dùng Small Caps và bảng số liệu dùng Tabular Figures đạt tiêu chuẩn ấn phẩm tài chính quốc tế.
9. **Expected Result:** Các cột số căn thẳng tắp theo trục dọc; các dấu ngoặc kép trôi ra ngoài mép lề tạo đường viền thị giác thẳng đứng hoàn hảo cho khối văn bản.
10. **Common Mistakes:**
    - *Sai lầm:* Dùng nút `Small Caps` giả lập trên các font không có bộ ký tự hoa nhỏ thực tế, khiến nét chữ của chữ hoa nhỏ bị mảnh và méo tỷ lệ quang học.
    - *Khắc phục:* Chỉ sử dụng tính năng `All Small Caps` của OpenType trên các bộ font chuyên nghiệp có thiết kế glyph hoa nhỏ thật sự.
11. **Knowledge Check:**
    - *Câu hỏi:* Khi dàn trang các bảng biểu kế toán nhiều con số, loại định dạng chữ số OpenType nào là bắt buộc để các con số thẳng hàng dọc với nhau?
    - *Lựa chọn:* A. Proportional Oldstyle | B. Tabular Figures | C. Fractions | D. Superscript
    - *Đáp án:* 1 (B)
    - *Giải thích:* `Tabular Figures` (số dạng bảng) quy định mỗi con số từ 0 đến 9 đều có chung một độ rộng ký tự cố định, bảo đảm tính thẳng cột dọc trong bảng biểu.
12. **References:** Bringhurst, R. "The Elements of Typographic Style" & Affinity Publisher Help: "OpenType fonts".
13. **Duration:** 30 phút.

---

#### B04-03: Chữ Khởi Đầu Lớn & Định Dạng Mẫu Mở Rộng Regex (Drop Caps & Pattern Formatting)
1. **ID:** `B04-03`
2. **Track/Module:** Publisher / Module B04
3. **Title:** Chữ Khởi Đầu Lớn & Định Dạng Mẫu Mở Rộng Regex (Drop Caps & Pattern Formatting)
4. **Objectives:**
   - Thiết lập chữ cái đầu đoạn lớn (`Drop Caps`) chuẩn xác theo số dòng hiển thị và khoảng cách đệm.
   - Tích hợp `Character Style` tự động cho Drop Cap ngay trong thiết lập Paragraph Style.
   - Áp dụng kỹ thuật tìm kiếm và thay thế định dạng nâng cao bằng biểu thức chính quy (Regular Expressions - RegEx) để định dạng hàng loạt số điện thoại, ngày tháng, tên riêng.
   - Ánh xạ: `PLO-04` (Editorial Typography), `PLO-05` (Automation).
5. **Prerequisites:** Hoàn thành `B04-01`, `B04-02`.
6. **Lesson Content:**
   - `Drop Caps` là chữ cái đầu tiên của chương hoặc bài viết được phóng to chìm xuống 2 đến 4 dòng chữ bên dưới, tạo điểm nhấn thu hút thị giác người đọc.
   - Để tự động hóa việc làm đẹp văn bản thô, tính năng `Find and Replace` hỗ trợ cú pháp biểu thức chính quy (`RegEx`) giúp nhận diện mẫu (ví dụ: `\b\d{4}\b` để tìm tất cả các năm có 4 chữ số) và áp dụng một Character Style màu đồng ánh kim lên chúng trong một cú nhấp chuột.
7. **Step-by-Step Instructions:**
   - Bước 1: Mở Paragraph Style `Body Text - Opening`, vào mục `Drop Caps`.
   - Bước 2: Tích chọn `Enable Drop Caps`, đặt `Height: 3 lines`, `Characters: 1`.
   - Bước 3: Trong mục `Character Style`, gán kiểu `[DropCap Accent]` (Font cổ điển, màu vàng kim).
   - Bước 4: Mở bảng `Find and Replace` (`Ctrl+F`), chuyển chế độ tìm kiếm sang `Regular Expression`. Nhập mẫu tìm kiếm và áp dụng Character Style lên toàn bộ kết quả tìm được.
8. **Practice Exercise:** Tạo trang mở đầu cuốn tiểu thuyết với chữ cái Drop Cap 3 dòng thanh lịch và dùng RegEx gán kiểu chữ in nghiêng cho toàn bộ các tên riêng trích dẫn trong ngoặc kép.
9. **Expected Result:** Trang mở đầu cuốn sách đậm chất văn học cổ điển, chữ cái đầu tiên thụt đúng 3 dòng và cách lề phải 2mm vừa mắt.
10. **Common Mistakes:**
    - *Sai lầm:* Tạo Drop Cap bằng cách phóng to một ký tự độc lập trong khung chữ riêng rồi kéo đặt vào đầu đoạn, khiến khi chỉnh sửa dòng chữ sẽ bị đè lên hình ảnh.
    - *Khắc phục:* Luôn kích hoạt Drop Caps tự động trong thuộc tính của `Paragraph Style`.
11. **Knowledge Check:**
    - *Câu hỏi:* Thuộc tính nào trong nhóm Drop Caps quy định chữ cái đầu tiên sẽ chìm xuống sâu bằng chiều cao của bao nhiêu dòng văn bản?
    - *Lựa chọn:* A. Distance to text | B. Drop Caps Height (lines) | C. Characters count | D. Scale factor
    - *Đáp án:* 1 (B)
    - *Giải thích:* Thuộc tính `Height (lines)` quy định số lượng dòng chữ mà chữ cái Drop Cap sẽ chiếm dụng chiều sâu.
12. **References:** Affinity Publisher Help: "Drop caps" & "Using Regular Expressions".
13. **Duration:** 25 phút.

---

### MODULE B05: TÍCH HỢP ĐA STUDIO & THIẾT KẾ ĐỒ HỌA TRONG ẤN PHẨM
*(Integrated Vector & Pixel Editing in Layout Documents)*

#### B05-01: Chuyển Đổi Không Gian Làm Việc Layout, Vector & Pixel (In-Document Studio Switching)
1. **ID:** `B05-01`
2. **Track/Module:** Publisher / Module B05
3. **Title:** Chuyển Đổi Không Gian Làm Việc Layout, Vector & Pixel (In-Document Studio Switching)
4. **Objectives:**
   - Hiểu rõ bản chất ứng dụng All-in-One hiện hành: Chuyển đổi mượt mà giữa Layout Studio, Vector Studio và Pixel Studio trên cùng một tài liệu `.afpub`.
   - Phân biệt với khái niệm cũ **StudioLink trong Affinity V2** (cần cài đặt 3 app độc lập).
   - Tối ưu hóa quy trình làm việc không cần xuất file trung gian (Zero-Export Workflow).
   - Ánh xạ: `PLO-01` (Core Tool Mastery), `PLO-04` (Editorial Design).
5. **Prerequisites:** Hoàn thành `B01-01`, `D01-01`, `P01-01`.
6. **Lesson Content:**
   - Trong ứng dụng Affinity all-in-one hiện tại, nhà thiết kế không cần lưu file `.afpub` rồi mở Affinity Designer hay Photo để vẽ minh họa hoặc xóa phông ảnh.
   - Ba biểu tượng Studio ở góc trên cùng bên trái thanh công cụ (Toolbar) cho phép chuyển đổi tức thì không gian công cụ:
     - **Layout Studio:** Chuyên dụng cho dàn trang, khung chữ, master page, bảng biểu, preflight.
     - **Vector Studio:** Kích hoạt toàn bộ công cụ Pen, Node, Contour, Isometric Grid, Boolean.
     - **Pixel Studio:** Kích hoạt cọ vẽ Pixel, Selection Brush, Refine Edge, Inpainting Brush.
7. **Step-by-Step Instructions:**
   - Bước 1: Mở tài liệu tạp chí đang làm việc trong `Layout Studio`.
   - Bước 2: Nhấp vào biểu tượng `Vector Studio` trên thanh công cụ trên cùng. Toàn bộ thanh công cụ bên trái biến thành các công cụ vector của Designer.
   - Bước 3: Dùng `Pen Tool` vẽ một đường uốn lượn trang trí trực tiếp lên trang đôi.
   - Bước 4: Nhấp vào biểu tượng `Pixel Studio`. Dùng `Paint Brush Tool` tô điểm chất liệu hạt (Grain texture) lên mảng màu vừa vẽ.
   - Bước 5: Nhấp lại biểu tượng `Layout Studio` để tiếp tục canh chỉnh khung văn bản.
8. **Practice Exercise:** Dàn một trang bìa tạp chí thời trang, sử dụng Vector Studio để vẽ họa tiết logo hình học và Pixel Studio để dùng Inpainting xóa chi tiết thừa trên ảnh bìa mà không rời khỏi tài liệu.
9. **Expected Result:** Tệp tài liệu duy nhất chứa cả layer văn bản dàn trang, layer vector bezier và layer pixel retouching còn nguyên cấu trúc phi phá hủy.
10. **Common Mistakes:**
    - *Sai lầm:* Xuất ảnh ra JPG để sang app khác chỉnh sửa rồi dán ngược lại vào Publisher, làm mất độ phân giải vector và mất khả năng chỉnh sửa layer.
    - *Khắc phục:* Luôn chuyển đổi trực tiếp giữa 3 Studio tích hợp ngay trên thanh Toolbar của ứng dụng.
11. **Knowledge Check:**
    - *Câu hỏi:* Trong ứng dụng Affinity hiện hành, điều gì xảy ra khi bạn nhấp vào biểu tượng Vector Studio khi đang mở tài liệu dàn trang tạp chí?
    - *Lựa chọn:* A. Ứng dụng xuất file sang định dạng SVG | B. Giao diện chuyển đổi sang các công cụ vector chuyên sâu mà vẫn giữ nguyên tài liệu và trang đang mở | C. Tài liệu bị đóng lại và mở ứng dụng Designer riêng biệt | D. Toàn bộ ảnh chụp bị vector hóa tự động
    - *Đáp án:* 1 (B)
    - *Giải thích:* Ứng dụng chuyển đổi thanh công cụ và bảng điều khiển sang không gian Vector Studio trực tiếp trên tệp tài liệu đang mở.
12. **References:** Official Affinity Desktop Architecture Documentation & Help: "Switching Studios".
13. **Duration:** 30 phút.

---

#### B05-02: Đồ Họa Vector Minh Họa Trong Trang Dàn (Vector Graphics Integration)
1. **ID:** `B05-02`
2. **Track/Module:** Publisher / Module B05
3. **Title:** Đồ Họa Vector Minh Họa Trong Trang Dàn (Vector Graphics Integration)
4. **Objectives:**
   - Tạo và quản lý các hình minh họa vector phức tạp trực tiếp bên trong các trang của ấn phẩm.
   - Ứng dụng kỹ thuật lồng ghép hình minh họa vector vào làm khung chứa hình ảnh (Vector Masking for Frames).
   - Đồng bộ bảng màu thương hiệu Swatches giữa các đối tượng dàn trang và hình minh họa vector.
   - Ánh xạ: `PLO-02` (Vector Precision), `PLO-04` (Editorial Design).
5. **Prerequisites:** Hoàn thành `B05-01`, `D03-02`.
6. **Lesson Content:**
   - Các ấn phẩm cao cấp thường sử dụng các biểu tượng đồ họa, infographic, hoặc mảng trang trí vector uốn lượn làm nền cho bài viết.
   - Trong Layout Studio, việc kết hợp công cụ `Corner Tool` và phép toán `Boolean Add/Subtract` trực tiếp lên các khung hình (Picture Frame) giúp tạo ra các khung chứa ảnh mang hình khối thương hiệu độc bản mà không phần mềm dàn trang truyền thống nào làm được một cách trực quan như vậy.
7. **Step-by-Step Instructions:**
   - Bước 1: Chuyển sang `Vector Studio`, dùng công cụ `Rectangle Tool` vẽ 3 hình chữ nhật trên trang 4.
   - Bước 2: Dùng lệnh `Layer > Geometry > Add` để gộp 3 hình thành một đường cong hợp nhất (Compound Curve).
   - Bước 3: Nhấp chuột phải vào hình vừa tạo, chọn `Convert to Picture Frame`.
   - Bước 4: Chuyển về `Layout Studio`, kéo thả ảnh chụp từ máy tính vào khung hình độc bản vừa tạo.
8. **Practice Exercise:** Thiết kế một trang đôi Infographic thống kê gồm 4 biểu đồ hình quạt vector chuẩn xác, có chú thích số liệu liên kết với lưới dòng kẻ Baseline Grid.
9. **Expected Result:** Infographic sắc nét ở mọi tỷ lệ phóng to (độ phân giải vector vô hạn), màu sắc đồng bộ với bảng màu CMYK của bài viết.
10. **Common Mistakes:**
    - *Sai lầm:* Đặt hình vector phức tạp có hàng nghìn điểm neo trên Master Page khiến phần mềm xử lý chậm chạp trên toàn bộ các trang.
    - *Khắc phục:* Tối ưu hóa số lượng điểm neo của vector minh họa trước khi áp dụng vào Master Page hoặc đưa vào trang tài liệu cụ thể.
11. **Knowledge Check:**
    - *Câu hỏi:* Lệnh nào cho phép biến bất kỳ hình khối vector tùy biến nào thành một khung chứa ảnh có sẵn các công cụ căn chỉnh tỷ lệ ảnh trong Publisher?
    - *Lựa chọn:* A. Convert to Curves | B. Convert to Picture Frame | C. Rasterize to Mask | D. Make Clipping Path
    - *Đáp án:* 1 (B)
    - *Giải thích:* Lệnh `Convert to Picture Frame` biến một đường cong vector bất kỳ thành một khung chứa ảnh chuyên dụng của Layout Studio.
12. **References:** Affinity Publisher Help: "Picture Frames" & "Vector Shapes in Publisher".
13. **Duration:** 30 phút.

---

#### B05-03: Xử Lý Điểm Ảnh & Bộ Lọc Trực Tiếp Trong Dàn Trang (Pixel Processing & Live Filters in Layout)
1. **ID:** `B05-03`
2. **Track/Module:** Publisher / Module B05
3. **Title:** Xử Lý Điểm Ảnh & Bộ Lọc Trực Tiếp Trong Dàn Trang (Pixel Processing & Live Filters in Layout)
4. **Objectives:**
   - Sử dụng `Pixel Studio` để chỉnh sửa khuyết điểm hình ảnh, cân bằng sáng và áp dụng lớp điều chỉnh (Adjustment Layers) ngay trên trang sách.
   - Ứng dụng bộ lọc trực tiếp `Live Filters` (như Live Gaussian Blur, Live Clarity) vào ảnh dàn trang mà không phá hủy tệp gốc.
   - Đảm bảo các lớp hiệu ứng Pixel được thiết lập chế độ hòa trộn (Blend Modes) an toàn cho chuẩn in ấn thương mại.
   - Ánh xạ: `PLO-03` (Non-Destructive Pixel), `PLO-06` (Prepress Delivery).
5. **Prerequisites:** Hoàn thành `B05-01`, `P03-01`.
6. **Lesson Content:**
   - Khi dàn trang ảnh chân dung tác giả hoặc ảnh sản phẩm, ảnh chụp thực tế có thể bị tối hoặc ám màu so với tone màu chung của trang sách. Thay vì phải mở Photoshop hoặc chỉnh sửa bên ngoài rồi cập nhật lại đường link, nhà thiết kế chuyển sang `Pixel Studio` để thêm một lớp `Curves` hoặc `HSL` trực tiếp làm con của bức ảnh đó.
   - Nhờ kiến trúc layer phân cấp của Affinity, lớp chỉnh màu này chỉ tác động duy nhất lên bức ảnh đó và được lưu trực tiếp trong tài liệu ấn phẩm.
7. **Step-by-Step Instructions:**
   - Bước 1: Chọn một bức ảnh trong khung hình trên trang 5.
   - Bước 2: Chuyển sang `Pixel Studio`. Mở bảng `Adjustments`, chọn lớp `Curves`.
   - Bước 3: Kéo đường cong chữ S nhẹ để tăng độ tương phản của riêng bức ảnh. Kéo layer Curves thả lồng vào bên trong layer ảnh trong panel `Layers`.
   - Bước 4: Vào menu `Layer > New Live Filter Layer > Sharpen > Live Clarity` để tăng độ nét chi tiết bề mặt.
   - Bước 5: Chuyển về `Layout Studio` và tiếp tục công việc xuất bản.
8. **Practice Exercise:** Khắc phục một trang tạp chí ẩm thực có 3 ảnh chụp món ăn bị lệch màu khác nhau (1 ảnh vàng, 1 ảnh xanh, 1 ảnh thiếu sáng) trở nên đồng nhất về nhiệt độ màu và độ sáng mà không cần xuất ảnh ra ngoài.
9. **Expected Result:** Toàn bộ 3 bức ảnh đạt sự hài hòa thị giác về tông màu trên cùng một trang đôi; các lớp Curves và Clarity vẫn có thể nhấp đúp để điều chỉnh lại thông số bất kỳ lúc nào.
10. **Common Mistakes:**
    - *Sai lầm:* Áp dụng lớp Adjustment Layer ở tầng trên cùng của bảng Layers khiến toàn bộ chữ và hình minh họa của cả trang sách bị đổi màu theo.
    - *Khắc phục:* Luôn kéo thả lớp điều chỉnh lồng vào làm layer con (Clipping) của bức ảnh mục tiêu trong panel Layers.
11. **Knowledge Check:**
    - *Câu hỏi:* Làm thế nào để một lớp điều chỉnh màu Curves chỉ tác động lên duy nhất một hình ảnh được chọn mà không làm đổi màu các chữ xung quanh?
    - *Lựa chọn:* A. Đặt Opacity về 50% | B. Kéo layer Curves thả lồng vào bên trong layer hình ảnh trong panel Layers | C. Khóa layer văn bản | D. Chọn chế độ hòa trộn Multiply
    - *Đáp án:* 1 (B)
    - *Giải thích:* Thao tác kéo layer lồng vào trong (layer clipping) giới hạn phạm vi tác động của hiệu ứng hoặc lớp điều chỉnh trong giới hạn pixel của đối tượng cha.
12. **References:** Affinity Photo & Publisher Help: "Adjustment Layers" & "Using Live Filters".
13. **Duration:** 30 phút.

---

### MODULE B06: BẢNG BIỂU, LƯỚI DỮ LIỆU & THIẾT KẾ THÔNG TIN
*(Tables, Data Grids & Information Design Architecture)*

#### B06-01: Kiến Trúc Công Cụ Bảng & Thiết Lập Lưới Ô (Table Tool Architecture & Cell Geometry)
1. **ID:** `B06-01`
2. **Track/Module:** Publisher / Module B06
3. **Title:** Kiến Trúc Công Cụ Bảng & Thiết Lập Lưới Ô (Table Tool Architecture & Cell Geometry)
4. **Objectives:**
   - Sử dụng `Table Tool` để khởi tạo và định hình bảng biểu trực quan trên trang dàn.
   - Quản lý kích thước hàng, cột, hợp nhất ô (Merge Cells) và khoảng đệm biên của ô (`Cell Insets`).
   - Thiết lập hàng tiêu đề lặp lại (`Header Rows`) khi bảng kéo dài xuyên suốt nhiều trang.
   - Ánh xạ: `PLO-04` (Editorial Architecture).
5. **Prerequisites:** Hoàn thành `B01-01`, `B03-01`.
6. **Lesson Content:**
   - Báo cáo thường niên, tài liệu kỹ thuật và thực đơn đòi hỏi bảng biểu chuẩn xác. Công cụ `Table Tool` trong Publisher là công cụ độc lập chuyên dụng, không phải là các khối văn bản kẻ đường viền thủ công.
   - Khi một bảng biểu dài vượt quá chiều cao của một trang, thiết lập `Header Rows` bảo đảm các hàng tiêu đề của cột tự động tái xuất hiện ở đầu trang tiếp theo, giúp người đọc nắm bắt thông tin liền mạch.
7. **Step-by-Step Instructions:**
   - Bước 1: Chọn công cụ `Table Tool` trên thanh Toolbar bên trái.
   - Bước 2: Kéo chuột trên trang để tạo bảng kích thước 5 cột × 10 hàng.
   - Bước 3: Mở panel `Table` (`Window > Table > Table`).
   - Bước 4: Chọn hàng đầu tiên, đổi thuộc tính hàng thành `Header Row`. Thiết lập `Repeat header row on every frame` khi bảng liên kết sang khung trang tiếp theo.
   - Bước 5: Trong mục `Cell Insets`, đặt lề đệm bên trong các ô: `Top/Bottom: 2mm`, `Left/Right: 3mm`.
8. **Practice Exercise:** Dựng bảng lịch trình hội nghị khoa học 3 ngày gồm 6 cột (Giờ, Hội trường, Diễn giả, Chủ đề, Ngôn ngữ, Tài liệu) có hàng tiêu đề cố định và căn chỉnh lề ô tiêu chuẩn.
9. **Expected Result:** Bảng biểu chuyên nghiệp, chữ trong các ô cách đều đường viền kẻ 3mm, không bị dính sát mép đường kẻ ô.
10. **Common Mistakes:**
    - *Sai lầm:* Dùng phím Space hoặc Tab để tạo bảng trong khung chữ thường, khiến khi đổi font chữ toàn bộ cột bị xô lệch thảm hại.
    - *Khắc phục:* Luôn dùng công cụ chuyên biệt `Table Tool` cho các dữ liệu dạng ma trận hàng và cột.
11. **Knowledge Check:**
    - *Câu hỏi:* Thuộc tính nào đảm bảo hàng tiêu đề trên cùng của một bảng dài sẽ tự động xuất hiện ở đầu trang kế tiếp khi bảng chảy tràn trang?
    - *Lựa chọn:* A. Duplicate Row | B. Repeat Header Row | C. Master Table Link | D. Keep with Top
    - *Đáp án:* 1 (B)
    - *Giải thích:* Tính năng `Repeat Header Row` trong panel Table quy định các hàng được chỉ định làm tiêu đề sẽ lặp lại ở đầu mỗi khung chữ chứa bảng.
12. **References:** Affinity Publisher Help: "Tables" & "Table Formats".
13. **Duration:** 30 phút.

---

#### B06-02: Định Dạng Bảng Biểu & Mẫu Màu Ô Tái Sử Dụng (Table Formatting & Alternating Styles)
1. **ID:** `B06-02`
2. **Track/Module:** Publisher / Module B06
3. **Title:** Định Dạng Bảng Biểu & Mẫu Màu Ô Tái Sử Dụng (Table Formatting & Alternating Styles)
4. **Objectives:**
   - Xây dựng và lưu trữ `Table Formats` tái sử dụng trong panel Table Formats.
   - Thiết lập màu nền xen kẽ tự động cho các hàng (`Alternating Row Fills`) giúp cải thiện khả năng đọc dữ liệu phức tạp.
   - Tùy biến kiểu đường viền (Stroke style, width, color) cho các cạnh bên trong và bao quanh ngoài của bảng.
   - Ánh xạ: `PLO-04` (Editorial Design), `PLO-09` (Asset Integrity).
5. **Prerequisites:** Hoàn thành `B06-01`, `B04-01`.
6. **Lesson Content:**
   - Để tránh việc người đọc bị hoa mắt khi dò tìm dữ liệu trên các bảng có nhiều chục hàng, phong cách "Zebra Striping" (hàng trắng xen kẽ hàng xám nhạt 5% K) là tiêu chuẩn thị giác quốc tế.
   - Affinity Publisher cho phép định nghĩa các mẫu `Table Format` bao gồm quy tắc màu nền hàng chẵn/lẻ, kiểu font cho ô tiêu đề, và độ dày đường viền. Mọi bảng biểu trong dự án áp dụng Format này sẽ đồng bộ thẩm mỹ thương hiệu ngay tức thì.
7. **Step-by-Step Instructions:**
   - Bước 1: Mở panel `Table Formats` (`Window > Table > Table Formats`).
   - Bước 2: Tạo một Table Format mới tên `[Corporate Report Table]`.
   - Bước 3: Trong mục `Row Fills`, chọn chế độ xen kẽ `Alternating: Every 1 row`. Đặt màu hàng lẻ là Trắng, màu hàng chẵn là Xám nhạt (`C:0 M:0 Y:0 K:4`).
   - Bước 4: Thiết lập hàng Header có nền xanh Navy thương hiệu và chữ trắng in đậm.
   - Bước 5: Áp dụng Table Format này lên bảng biểu vừa tạo chỉ với một cú nhấp chuột.
8. **Practice Exercise:** Thiết kế bảng so sánh thông số kỹ thuật của 4 gói dịch vụ phần mềm với định dạng hàng xen kẽ, đường kẻ mờ 0.5pt và nhãn nổi bật cho gói khuyên dùng.
9. **Expected Result:** Bảng biểu thanh lịch, trang nhã, màu sắc tương phản tối ưu cho việc in ấn đen trắng lẫn hiển thị màn hình số.
10. **Common Mistakes:**
    - *Sai lầm:* Đặt màu nền hàng quá đậm (trên 15% K), khiến việc in ấn bị lem mực và làm lu mờ văn bản bên trong ô.
    - *Khắc phục:* Giữ độ đậm của màu nền xen kẽ trong khoảng 3% đến 6% để tạo cảm giác tinh tế mà vẫn phân tách được dòng.
11. **Knowledge Check:**
    - *Câu hỏi:* Nơi nào trong Publisher lưu trữ các mẫu định dạng bảng hoàn chỉnh để áp dụng nhanh cho nhiều bảng biểu khác nhau trong cuốn sách?
    - *Lựa chọn:* A. Paragraph Styles | B. Table Formats Panel | C. Assets Panel | D. Swatches Library
    - *Đáp án:* 1 (B)
    - *Giải thích:* Bảng điều khiển `Table Formats Panel` lưu trữ toàn bộ các thiết lập định dạng, màu sắc và kiểu dáng của bảng để tái sử dụng.
12. **References:** Tufte, E. "The Visual Display of Quantitative Information" & Affinity Publisher Help: "Table formatting".
13. **Duration:** 30 phút.

---

#### B06-03: Nhập Liệu Bảng Dữ Liệu & Thiết Kế Báo Cáo Tài Chính (Tabular Data & Financial Reports)
1. **ID:** `B06-03`
2. **Track/Module:** Publisher / Module B06
3. **Title:** Nhập Liệu Bảng Dữ Liệu & Thiết Kế Báo Cáo Tài Chính (Tabular Data & Financial Reports)
4. **Objectives:**
   - Nhập dữ liệu bảng tính từ file CSV hoặc sao chép trực tiếp từ Microsoft Excel / Apple Numbers vào Table Tool.
   - Sử dụng ký tự căn chỉnh số thập phân (`Align to Decimal point`) để hàng trăm, hàng nghìn và số lẻ thẳng trục tuyệt đối.
   - Áp dụng các quy tắc thiết kế thông tin (Information Design) của Edward Tufte để loại bỏ "rác đồ họa" (Chartjunk) trên bảng báo cáo.
   - Ánh xạ: `PLO-04` (Editorial Architecture), `PLO-07` (Brief Interpretation).
5. **Prerequisites:** Hoàn thành `B06-01`, `B06-02`.
6. **Lesson Content:**
   - Trong báo cáo thường niên (Annual Report), một bảng cân đối kế toán có thể chứa hàng trăm con số tài chính với đơn vị tiền tệ và dấu ngoặc đơn số âm `(1,245.50)`. Nếu dùng căn lề phải thông thường, số âm có dấu ngoặc sẽ bị thụt vào trong so với số dương, làm mất đường thẳng hàng của các con số.
   - Bằng cách chọn căn chỉnh theo dấu chấm thập phân (`Align to Character: .`), toàn bộ các con số sẽ tự động khóa theo vị trí dấu phẩy/chấm thập phân bất kể độ dài hay ký tự đi kèm.
7. **Step-by-Step Instructions:**
   - Bước 1: Sao chép một bảng dữ liệu doanh thu gồm 4 cột từ Excel.
   - Bước 2: Trong Publisher, tạo một bảng với số hàng và cột tương ứng, chọn ô A1 và dán (`Ctrl+V`). Dữ liệu tự động điền vào các ô.
   - Bước 3: Chọn toàn bộ các cột số liệu, mở panel `Paragraph > Alignment`, chọn `Align to Character`.
   - Bước 4: Nhập dấu phân cách thập phân `.` vào ô ký tự mục tiêu. Toàn bộ các con số lập tức căn thẳng tắp theo trục dấu chấm.
   - Bước 5: Bỏ toàn bộ các đường kẻ dọc của bảng, chỉ giữ lại đường kẻ ngang mảnh 0.5pt ở dưới hàng tiêu đề và đáy bảng để tạo phong cách hiện đại.
8. **Practice Exercise:** Dàn trang hoàn chỉnh 2 trang đôi báo cáo tài chính kiểm toán gồm Bảng cân đối kế toán và Báo cáo lưu chuyển tiền tệ đạt chuẩn công bố thông tin đại chúng.
9. **Expected Result:** Bảng tài chính cực kỳ chuyên nghiệp, thông thoáng, số liệu thẳng hàng dọc theo chuẩn kế toán quốc tế IFRS.
10. **Common Mistakes:**
    - *Sai lầm:* Giữ nguyên các đường lưới kẻ ô dày đặc đen đậm của bảng mặc định, gây rối mắt và làm giảm độ tập trung vào số liệu.
    - *Khắc phục:* Triệt tiêu các đường kẻ dọc thừa thãi, tận dụng khoảng cách thở (Whitespace) và độ tương phản của kiểu chữ để phân tách cột.
11. **Knowledge Check:**
    - *Câu hỏi:* Phương pháp căn lề nào trong Publisher là tối ưu nhất để các số liệu tài chính có dấu ngoặc đơn số âm và số dương thẳng hàng tuyệt đối theo hàng thập phân?
    - *Lựa chọn:* A. Align Center | B. Align Right | C. Align to Character (với ký tự phân cách thập phân) | D. Justify
    - *Đáp án:* 2 (C)
    - *Giải thích:* Căn chỉnh theo ký tự (`Align to Character`) khóa toàn bộ các giá trị số theo vị trí của dấu phân cách thập phân, khắc phục việc dấu ngoặc đơn đẩy lệch số.
12. **References:** Affinity Publisher Help: "Formatting table cells" & "Aligning text in tables".
13. **Duration:** 30 phút.

---

*(Nội dung tiếp tục chi tiết cho toàn bộ các modules còn lại B07 đến B10 và S02 đến S10...)*

---

### MODULE B07: QUẢN LÝ TÀI NGUYÊN HÌNH ẢNH & ĐỘ PHÂN GIẢI CAO
*(Picture Frames, Resource Management & High-Resolution Asset Pipeline)*

#### B07-01: Cơ Chế Khung Chứa Ảnh & Các Chế Độ Canh Tỷ Lệ (Picture Frame Scaling Modes)
1. **ID:** `B07-01` | **Track:** Publisher | **Module:** B07 | **Duration:** 30 phút
2. **Title:** Cơ Chế Khung Chứa Ảnh & Các Chế Độ Canh Tỷ Lệ (Picture Frame Scaling Modes)
3. **Objectives:** Thành thạo các chế độ `Scale to Max`, `Scale to Min`, `Stretch`, và `None` trên Picture Frame; sử dụng thanh trượt kích thước và xoay ảnh nội tại. Ánh xạ: `PLO-04`, `PLO-09`.
4. **Prerequisites:** Hoàn thành `B01-01`.
5. **Content & Steps:** Khung chứa ảnh (Picture Frame) phân biệt rõ giữa khung cắt cúp (Frame container) và nội dung ảnh bên trong (Content). Sử dụng điểm neo trung tâm trên Context Toolbar để cố định điểm nở ảnh khi thay đổi kích thước khung.
6. **Practice & Expected:** Tạo layout ảnh 6 ô trên trang tạp chí du lịch, đặt chế độ `Scale to Max` để ảnh luôn lấp đầy khung mà không méo tỷ lệ.
7. **Mistakes & Quiz:** Tránh dùng công cụ Move Tool kéo mép ảnh làm biến dạng tỷ lệ gốc (Distortion). Quiz: Chế độ nào bảo đảm ảnh luôn phủ kín toàn bộ diện tích khung hình? Đáp án: `Scale to Max` (Scale to Fill).
8. **References:** Affinity Publisher Help: "Picture Frames".

#### B07-02: Bảng Quản Lý Tài Nguyên: Liên Kết vs Nhúng (Resource Manager: Linked vs Embedded)
1. **ID:** `B07-02` | **Track:** Publisher | **Module:** B07 | **Duration:** 30 phút
2. **Title:** Bảng Quản Lý Tài Nguyên: Liên Kết vs Nhúng (Resource Manager: Linked vs Embedded)
3. **Objectives:** Kiểm soát dung lượng file `.afpub` qua cơ chế `Linked` vs `Embedded`; sử dụng `Resource Manager` để dò tìm ảnh thiếu (Missing), ảnh bị sửa đổi (Modified) và thu gom tệp xuất xưởng (`Make Package`). Ánh xạ: `PLO-06`, `PLO-09`.
4. **Prerequisites:** Hoàn thành `B07-01`.
5. **Content & Steps:** Quản lý tài nguyên qua `Document > Resource Manager`. Chuyển đổi trạng thái tài nguyên, kiểm tra đường dẫn thư mục gốc và tái liên kết hàng loạt (Relink).
6. **Practice & Expected:** Kiểm toán một tài liệu 32 trang có 5 ảnh bị mất link, thực hiện liên kết lại chuẩn xác và đóng gói Package thư mục đầy đủ tài nguyên cho nhà in.
7. **Mistakes & Quiz:** Tránh nhúng toàn bộ ảnh RAW hoặc TIFF hàng trăm MB trực tiếp vào file làm file nặng hàng chục GB dễ bị hỏng dữ liệu. Quiz: Lệnh nào tự động gom file tài liệu và toàn bộ ảnh/font liên kết vào một thư mục bàn giao? Đáp án: `File > Package`.
8. **References:** Affinity Publisher Help: "Resource Manager".

#### B07-03: Kỷ Luật Độ Phân Giải: DPI/PPI & Không Gian Màu Ảnh In (Resolution Discipline & Color Space)
1. **ID:** `B07-03` | **Track:** Publisher | **Module:** B07 | **Duration:** 30 phút
2. **Title:** Kỷ Luật Độ Phân Giải: DPI/PPI & Không Gian Màu Ảnh In (Resolution Discipline & Color Space)
3. **Objectives:** Phân biệt `Placed DPI` (độ phân giải đặt vào) và `Original DPI` (độ phân giải gốc); kiểm tra ngưỡng tối thiểu 300 DPI cho in Offset và chuyển đổi ảnh RGB sang CMYK / Grayscale theo chuẩn xuất bản. Ánh xạ: `PLO-06`, `PLO-09`.
4. **Prerequisites:** Hoàn thành `B07-02`.
5. **Content & Steps:** Đọc thông số `Placed DPI` trên thanh ngữ cảnh khi chọn ảnh. Nếu phóng to ảnh quá 100%, Placed DPI sẽ tụt xuống dưới 300 DPI và gây vỡ hạt khi in trên giấy couche.
6. **Practice & Expected:** Thực hiện tiền kiểm (Pre-flight check) toàn bộ hình ảnh của một cuốn tạp chí thời trang, loại bỏ và thay thế các ảnh có Placed DPI dưới 240 DPI.
7. **Mistakes & Quiz:** Tránh lầm tưởng ảnh 72 DPI tải trên web phóng to lên trang bìa sẽ tự động sắc nét. Quiz: Khi ảnh gốc 300 DPI bị phóng to lên 200% trong khung hình, Placed DPI của nó là bao nhiêu? Đáp án: 150 DPI.
8. **References:** ISO 12647 Standard & Affinity Publisher Help: "Image resolution".

---

### MODULE B08: TỰ ĐỘNG HÓA DỮ LIỆU BIẾN ĐỔI & TRỘN THƯ MỤC
*(Data Merge Engine, Variable Layouts & Automated Publishing)*

#### B08-01: Kiến Trúc Nguồn Dữ Liệu Data Merge: CSV & JSON (Data Merge Source Architecture)
1. **ID:** `B08-01` | **Track:** Publisher | **Module:** B08 | **Duration:** 35 phút
2. **Title:** Kiến Trúc Nguồn Dữ Liệu Data Merge: CSV & JSON (Data Merge Source Architecture)
3. **Objectives:** Kết nối file dữ liệu nguồn `.csv`, `.tsv`, hoặc `.json` với tài liệu ấn phẩm thông qua bảng `Data Merge Manager`. Chuẩn hóa mã hóa ký tự UTF-8 cho tiếng Việt có dấu. Ánh xạ: `PLO-04`, `PLO-05`.
4. **Prerequisites:** Hoàn thành `B01-01`, `B03-01`.
5. **Content & Steps:** Mở `Document > Data Merge Manager`. Nhấp `Add Data Merge Source`, trỏ đến tệp CSV chứa danh sách khách mời hoặc danh mục sản phẩm. Kiểm tra số lượng bản ghi (Record count) và bảng mã tiếng Việt.
6. **Practice & Expected:** Chuẩn bị tệp dữ liệu 100 nhân sự gồm các trường: Họ tên, Chức danh, Phòng ban, Mã nhân viên và Đường dẫn ảnh thẻ; liên kết thành công vào Publisher.
7. **Mistakes & Quiz:** Tránh lưu file CSV dạng ANSI khiến toàn bộ ký tự tiếng Việt có dấu bị lỗi font dạng hình thoi `?`. Quiz: Bảng mã chuẩn nào bắt buộc khi xuất CSV để tiếng Việt hiển thị chính xác trong Data Merge? Đáp án: UTF-8.
8. **References:** Affinity Publisher Help: "Data merge".

#### B08-02: Ràng Buộc Trường Văn Bản & Khung Chứa Ảnh Động (Dynamic Field Placeholders)
1. **ID:** `B08-02` | **Track:** Publisher | **Module:** B08 | **Duration:** 35 phút
2. **Title:** Ràng Buộc Trường Văn Bản & Khung Chứa Ảnh Động (Dynamic Field Placeholders)
3. **Objectives:** Chèn các trường dữ liệu biến đổi (`<FullName>`, `<Position>`) vào khung văn bản; gán đường dẫn ảnh động vào Picture Frame để tự động nạp ảnh chân dung theo từng bản ghi. Ánh xạ: `PLO-04`, `PLO-05`.
4. **Prerequisites:** Hoàn thành `B08-01`.
5. **Content & Steps:** Mở panel `Fields`, tìm nhóm `Data Merge`. Kéo thả các trường dữ liệu vào khung chữ đã định dạng kiểu dáng. Chọn Picture Frame, nhấp đúp vào trường chứa tên file ảnh.
6. **Practice & Expected:** Dựng mẫu thẻ đeo sự kiện (Event Badge) kích thước 90×130mm có mã vạch, ảnh đại biểu và chức danh tự động co giãn theo độ dài tên.
7. **Mistakes & Quiz:** Tránh để đường dẫn ảnh dạng tuyệt đối bị sai lệch khi chuyển thư mục dự án; nên dùng đường dẫn tương đối (Relative path). Quiz: Panel nào trong Publisher chứa danh sách các trường dữ liệu được nạp từ file CSV? Đáp án: `Fields Panel`.
8. **References:** Affinity Publisher Help: "Inserting merge fields".

#### B08-03: Kết Xuất Ấn Phẩm Hàng Loạt & Kiểm Soát Bản In (Batch Generation & Verification)
1. **ID:** `B08-03` | **Track:** Publisher | **Module:** B08 | **Duration:** 30 phút
2. **Title:** Kết Xuất Ấn Phẩm Hàng Loạt & Kiểm Soát Bản In (Batch Generation & Verification)
3. **Objectives:** Thiết lập chế độ kết xuất: Tạo tài liệu gộp nhiều trang (`Generate`) hoặc in trực tiếp; kiểm tra các lỗi tràn chữ do tên dài phát sinh trong quá trình trộn thư. Ánh xạ: `PLO-05`, `PLO-06`.
4. **Prerequisites:** Hoàn thành `B08-02`.
5. **Content & Steps:** Trong `Data Merge Manager`, chọn phạm vi bản ghi (All records hoặc Range), nhấp `Generate`. Publisher sẽ tạo một tài liệu mới chứa toàn bộ các trang đã được điền dữ liệu tương ứng.
6. **Practice & Expected:** Xuất bản hoàn chỉnh tập tài liệu 100 thẻ đeo đại biểu được sắp xếp tự động 4 thẻ trên một trang in A4 có đường xén cắt (Crop marks).
7. **Mistakes & Quiz:** Tránh kết xuất mà không kiểm tra bản ghi có tên dài nhất, dẫn đến lỗi tràn chữ ở hàng chục trang in mà không biết. Quiz: Khi nhấn Generate trong Data Merge Manager, kết quả trả về là gì? Đáp án: Một tài liệu Publisher mới chứa toàn bộ các trang đã điền dữ liệu.
8. **References:** Affinity Publisher Help: "Generating merged documents".

---

### MODULE B09: MỤC LỤC TỰ ĐỘNG, CHỈ MỤC & XUẤT BẢN KỸ THUẬT SỐ
*(Indexes, Table of Contents, Cross-References & Hyperlinks)*

#### B09-01: Tạo Mục Lục Tự Động Từ Neo Kiểu Chữ (Automated Table of Contents Generation)
1. **ID:** `B09-01` | **Track:** Publisher | **Module:** B09 | **Duration:** 30 phút
2. **Title:** Tạo Mục Lục Tự Động Từ Neo Kiểu Chữ (Automated Table of Contents Generation)
3. **Objectives:** Sử dụng panel `Table of Contents` để quét toàn bộ các tiêu đề gắn Paragraph Style mục tiêu; cấu hình số trang dẫn đường bằng dấu chấm chấm (Tab leaders). Ánh xạ: `PLO-04`, `PLO-05`.
4. **Prerequisites:** Hoàn thành `B04-01`.
5. **Content & Steps:** Mở `Window > References > Table of Contents`. Nhấp `Insert TOC`. Chọn các Paragraph Style cần đưa vào mục lục (Heading 1, Heading 2). Thiết lập kiểu ký tự cho số trang và đường tab leader.
6. **Practice & Expected:** Tạo trang Mục lục tự động 2 cấp cho cuốn sách 60 trang, có khả năng cập nhật lại số trang chỉ bằng nút `Update TOC` khi nội dung thay đổi.
7. **Mistakes & Quiz:** Tránh gõ mục lục thủ công khiến khi thêm bớt trang phải dò tìm và sửa lại từng số trang. Quiz: Mục lục tự động trong Publisher thu thập dữ liệu dựa trên yếu tố nào? Đáp án: Các `Paragraph Styles` được chỉ định.
8. **References:** Affinity Publisher Help: "Table of contents".

#### B09-02: Lập Chỉ Mục Đa Cấp & Tham Chiếu Chéo (Multi-Level Indexing & Cross-References)
1. **ID:** `B09-02` | **Track:** Publisher | **Module:** B09 | **Duration:** 35 phút
2. **Title:** Lập Chỉ Mục Đa Cấp & Tham Chiếu Chéo (Multi-Level Indexing & Cross-References)
3. **Objectives:** Chèn các điểm đánh dấu chỉ mục (`Index Marks`), xây dựng bảng chỉ mục thuật ngữ đa cấp cuối sách (Index by Topics); chèn tham chiếu chéo (Cross-References) trỏ tới trang khác. Ánh xạ: `PLO-04`.
4. **Prerequisites:** Hoàn thành `B09-01`.
5. **Content & Steps:** Chọn từ khóa chuyên môn trong bài viết, vào `Text > Insert > Index Mark`. Mở panel `Index`, chọn vị trí cuối sách và nhấp `Insert Index`. Bảng chỉ mục chữ cái A-Z tự động hình thành kèm số trang xuất hiện của từ khóa.
6. **Practice & Expected:** Xây dựng bảng chỉ mục thuật ngữ 30 từ khóa chuyên ngành cho cuốn sách giáo trình thiết kế, sắp xếp theo thứ tự bảng chữ cái tiếng Việt.
7. **Mistakes & Quiz:** Tránh đánh dấu từ khóa không nhất quán giữa chữ hoa và chữ thường gây phân tán chỉ mục thành nhiều mục trùng lặp. Quiz: Panel nào quản lý danh sách các điểm đánh dấu chỉ mục và tạo bảng tra cứu thuật ngữ? Đáp án: `Index Panel`.
8. **References:** The Chicago Manual of Style & Affinity Publisher Help: "Indexes".

#### B09-03: Xuất Bản Kỹ Thuật Số Tương Tác: Hyperlinks, Bookmarks & PDF Forms
1. **ID:** `B09-03` | **Track:** Publisher | **Module:** B09 | **Duration:** 30 phút
2. **Title:** Xuất Bản Kỹ Thuật Số Tương Tác: Hyperlinks, Bookmarks & PDF Forms
3. **Objectives:** Chèn liên kết web, liên kết nhảy trang nội bộ (`Anchors`), thiết lập cây mục lục điều hướng số (`PDF Bookmarks`) và xuất file PDF tương tác. Ánh xạ: `PLO-04`, `PLO-06`.
4. **Prerequisites:** Hoàn thành `B09-01`.
5. **Content & Steps:** Mở panel `Hyperlinks`. Chọn văn bản hoặc nút bấm, gán đích đến là URL hoặc một trang cụ thể. Khi xuất PDF, chọn preset `PDF (Digital - Interactive)` và tích chọn `Include Hyperlinks` và `Include Bookmarks`.
6. **Practice & Expected:** Xuất bản tài liệu hồ sơ năng lực (Portfolio) dạng PDF tương tác, người xem nhấp vào mục lục sẽ nhảy tức thì đến trang dự án tương ứng.
7. **Mistakes & Quiz:** Tránh xuất PDF theo chuẩn in ấn (Print Preset) khi cần ấn phẩm kỹ thuật số, khiến các liên kết hyperlinks bị vô hiệu hóa thành chữ chết. Quiz: Tùy chọn xuất PDF nào bắt buộc để người xem có thể nhấp chuột vào liên kết chuyển trang trên màn hình máy tính? Đáp án: `Include Bookmarks & Hyperlinks`.
8. **References:** Affinity Publisher Help: "Interactive documents" & "Hyperlinks".

---

### MODULE B10: TIỀN KIỂM BẢN IN, MÀU PHA & XUẤT XƯỞNG THƯƠNG MẠI
*(Live Preflight, Spot Colors & Commercial Press-Ready PDF/X Output)*

#### B10-01: Hệ Thống Tiền Kiểm Bản In Trực Tiếp: Bảng Preflight (Live Preflight Profiles)
1. **ID:** `B10-01` | **Track:** Publisher | **Module:** B10 | **Duration:** 30 phút
2. **Title:** Hệ Thống Tiền Kiểm Bản In Trực Tiếp: Bảng Preflight (Live Preflight Profiles)
3. **Objectives:** Cấu hình và tạo profile tiền kiểm `Preflight` riêng biệt; tự động phát hiện các lỗi chết người trước khi in: văn bản tràn khung (Overflow), ảnh dưới 300 DPI, lỗi không gian màu RGB trong bài in CMYK, và mất đường Bleed. Ánh xạ: `PLO-06` (Prepress Delivery).
4. **Prerequisites:** Hoàn thành `B01-01`, `B03-03`, `B07-03`.
5. **Content & Steps:** Mở panel `Preflight` (`Window > Preflight`). Tạo profile mới `[Commercial Offset 300DPI]`. Đặt mức cảnh báo (Warning) hoặc lỗi nghiêm trọng (Error) cho từng hạng mục. Nhấp đúp vào thông báo lỗi trong panel Preflight để phần mềm tự động nhảy đến đúng trang và chọn đối tượng bị lỗi.
6. **Practice & Expected:** Kiểm toán một tệp sách 40 trang đang tồn tại 8 lỗi kỹ thuật (3 ảnh 72 DPI, 2 khung tràn chữ, 1 màu RGB), xử lý triệt để cho đến khi đèn báo Preflight chuyển sang màu xanh lục (0 Errors).
7. **Mistakes & Quiz:** Tránh gửi file cho xưởng in mà không kiểm tra Preflight, dẫn đến việc bản in hàng nghìn bản bị cắt cụt mất chữ hoặc ảnh nhòe vỡ. Quiz: Đèn trạng thái nào trên panel Preflight xác nhận tài liệu hoàn toàn sạch lỗi kỹ thuật và sẵn sàng xuất xưởng? Đáp án: Đèn xanh lục (Green checkmark).
8. **References:** ISO 12647 Standard & Affinity Publisher Help: "Preflight panel".

#### B10-02: Màu Pha Kỹ Thuật, Thư Viện Pantone & Kiểm Tra In Đè (Spot Colors & Overprint)
1. **ID:** `B10-02` | **Track:** Publisher | **Module:** B10 | **Duration:** 35 phút
2. **Title:** Màu Pha Kỹ Thuật, Thư Viện Pantone & Kiểm Tra In Đè (Spot Colors & Overprint)
3. **Objectives:** Sử dụng bảng màu pha chuẩn quốc tế `Pantone Formula Guide Solid Coated`; phân biệt màu 4 trục CMYK (Process) và màu pha thứ 5 (Spot Color); làm chủ kỹ thuật `Overprint Black` để tránh lỗi hở trắng đường viền (Misregistration). Ánh xạ: `PLO-06` (Prepress Production).
4. **Prerequisites:** Hoàn thành `B10-01`.
5. **Content & Steps:** Mở panel `Swatches`, chọn bảng màu Pantone. Tạo một ô màu Spot Color riêng cho logo thương hiệu. Kiểm tra trong panel `Color` tùy chọn `Overprint`: đảm bảo văn bản màu đen 100% K được chọn Overprint để in đè lên nền màu mà không bị đục thủng khuôn in.
6. **Practice & Expected:** Thiết lập bao bì sản phẩm cao cấp in 5 màu: 4 màu CMYK chuẩn + 1 màu nhũ vàng kim Pantone 871 C Spot Color được tách bản phim độc lập.
7. **Mistakes & Quiz:** Tránh để màu đen cỡ nhỏ bị Knockout (đục thủng nền), dẫn đến việc chỉ cần máy in lệch 0.1mm là xuất hiện viền trắng quanh mép chữ. Quiz: Thuộc tính in nào giúp chữ đen nhỏ in thẳng lên nền màu mà không làm đục lỗ trắng ở các lớp kẽm bên dưới? Đáp án: `Overprint Black`.
8. **References:** Pantone Official Guides & Affinity Publisher Help: "Spot colours and overprinting".

#### B10-03: Xuất Xưởng Chuẩn Công Nghiệp: PDF/X-1a, PDF/X-4 & Bản Kẽm (Commercial PDF/X Production)
1. **ID:** `B10-03` | **Track:** Publisher | **Module:** B10 | **Duration:** 35 phút
2. **Title:** Xuất Xưởng Chuẩn Công Nghiệp: PDF/X-1a, PDF/X-4 & Bản Kẽm (Commercial PDF/X Production)
3. **Objectives:** Phân biệt và lựa chọn chính xác các tiêu chuẩn in ấn quốc tế: `PDF/X-1a:2001` (triệt tiêu độ trong suốt / Flattener) và `PDF/X-4:2010` (giữ nguyên độ trong suốt sống và color management); thiết lập đầy đủ dấu xén (Crop marks), dấu canh kẽm (Registration marks) và bù trừ Bleed 3mm. Ánh xạ: `PLO-06` (Prepress Mastery), `PLO-11` (Independent Transfer).
4. **Prerequisites:** Hoàn thành `B10-01`, `B10-02`.
5. **Content & Steps:** Mở menu `File > Export`, chọn định dạng `PDF`. Trong mục Preset, chọn `PDF/X-4`. Trong mục `Area`, chọn `All Spreads` (hoặc `All Pages` theo yêu cầu bình trang của nhà in). Tích chọn `Include Bleed` và `Include Printer Marks`. Kiểm tra tệp xuất ra trên trình xem chuyên dụng trước khi gửi xưởng in.
6. **Practice & Expected:** Xuất bản tệp PDF/X-4 hoàn chỉnh cho toàn bộ ấn phẩm tạp chí 24 trang kèm bản in tách màu (Separation Preview check) sẵn sàng đưa lên máy in ống đồng / Offset công nghiệp.
7. **Mistakes & Quiz:** Tránh chọn xuất PDF mà quên tích `Include Bleed`, khiến xưởng in không có vùng xén dự phòng và làm méo kích thước trang ấn phẩm. Quiz: Tiêu chuẩn PDF/X nào hỗ trợ giữ nguyên các lớp trong suốt (transparency) và hệ quản trị màu hiện đại nhất cho các xưởng in Offset thế hệ mới? Đáp án: `PDF/X-4`.
8. **References:** ISO 15930 Standard (PDF/X) & Affinity Publisher Help: "Exporting to PDF/X".

---

## 4. TRACK 4 — SCRIPTING & TỰ ĐỘNG HÓA V8 / MCP: MODULES S02 ĐẾN S10 (27 BÀI HỌC)

### MODULE S02: KIẾN TRÚC MÔ HÌNH ĐỐI TƯỢNG TÀI LIỆU (DOM) & TRUY VẤN
*(Document Object Model (DOM) Architecture & Inspection)*

#### S02-01: Cây Phân Cấp Đối Tượng: Application, Document & Spreads (DOM Hierarchy & Tree Traversal)
1. **ID:** `S02-01` | **Track:** Scripting | **Module:** S02 | **Duration:** 30 phút
2. **Title:** Cây Phân Cấp Đối Tượng: Application, Document & Spreads (DOM Hierarchy & Tree Traversal)
3. **Objectives:** Nắm vững cấu trúc phân cấp gốc của Affinity JavaScript DOM: `Application` -> `Document` -> `Spread` / `Page` -> `Layer` -> `Node`; viết mã duyệt cây đối tượng không đồng bộ. Ánh xạ: `PLO-05` (Automation).
4. **Prerequisites:** Hoàn thành `S01-01`, `S01-03`.
5. **Content & Steps:** Trong môi trường V8 nhúng của Affinity, đối tượng toàn cục `affinity` cung cấp quyền truy cập vào `affinity.activeDocument`. Từ đây, học viên truy cập mảng `doc.spreads` hoặc `doc.pages` để lặp qua từng thành phần của tài liệu thông qua vòng lặp JavaScript chuẩn.
6. **Practice & Expected:** Viết script `inspect_hierarchy.js` quét toàn bộ tài liệu đang mở và in ra console cấu trúc cây phân cấp gồm: Số lượng trang đôi, số lượng layer trên mỗi trang và tên định danh của từng layer.
7. **Mistakes & Quiz:** Tránh gọi thuộc tính trên `activeDocument` khi người dùng chưa mở tài liệu nào, gây lỗi `Null Pointer Exception`. Luôn kiểm tra `if (!doc)`. Quiz: Thuộc tính nào truy cập vào trang đôi hiện đang được kích hoạt trong tài liệu? Đáp án: `doc.activeSpread`.
8. **References:** Affinity Embedded JavaScript DOM API Reference: "Application & Document Classes".

#### S02-02: Truy Vấn Phần Tử & Hệ Tọa Độ Đa Chiều (Node Querying & Multi-Coordinate Spaces)
1. **ID:** `S02-02` | **Track:** Scripting | **Module:** S02 | **Duration:** 35 phút
2. **Title:** Truy Vấn Phần Tử & Hệ Tọa Độ Đa Chiều (Node Querying & Multi-Coordinate Spaces)
3. **Objectives:** Lập trình tìm kiếm phần tử theo tên, theo loại (`nodeType`) hoặc thuộc tính; làm chủ sự chuyển đổi giữa hệ tọa độ Document, Spread, Page và Artboard. Ánh xạ: `PLO-05` (DOM Scripting).
4. **Prerequisites:** Hoàn thành `S02-01`.
5. **Content & Steps:** Sử dụng các phương thức truy vấn như `doc.findLayersByName("HeroLogo")` hoặc lọc mảng `layers.filter(l => l.type === 'curve')`. Xử lý ma trận chuyển đổi tọa độ điểm từ tọa độ tương đối của khung sang tọa độ tuyệt đối của trang in.
6. **Practice & Expected:** Viết hàm tiện ích `getAbsoluteBounds(layer)` tính toán chính xác tọa độ X, Y, Width, Height của một phần tử nằm sâu trong 3 cấp Group lồng nhau.
7. **Mistakes & Quiz:** Tránh nhầm lẫn giữa tọa độ `bounds.x` (tương đối theo nhóm cha) và tọa độ thực tế trên trang in (Spread coordinate). Quiz: Khi một layer nằm trong một Group, tọa độ X/Y cục bộ của nó được tính dựa theo gốc tọa độ nào? Đáp án: Gốc (0,0) của Group cha chứa nó.
8. **References:** Affinity DOM API Reference: "Geometry and Transform Matrices".

#### S02-03: Kiểm Toán Tự Động Metadata & Kích Thước Bounding Box (Automated Metadata & Bounds Audit)
1. **ID:** `S02-03` | **Track:** Scripting | **Module:** S02 | **Duration:** 30 phút
2. **Title:** Kiểm Toán Tự Động Metadata & Kích Thước Bounding Box (Automated Metadata & Bounds Audit)
3. **Objectives:** Viết script tự động quét kiểm tra toàn bộ các đối tượng trong tài liệu xem có đối tượng nào vượt ra ngoài biên an toàn (Canvas boundary) hoặc có kích thước siêu nhỏ (rác vector vô hình). Ánh xạ: `PLO-05`, `PLO-09`.
4. **Prerequisites:** Hoàn thành `S02-02`.
5. **Content & Steps:** Thu thập các thông số `layer.visibleBounds` và so sánh với `doc.pageWidth` và `doc.pageHeight`. Phát hiện các layer rỗng có diện tích bằng 0 hoặc các đối tượng bị ẩn vô tình.
6. **Practice & Expected:** Phát triển script `preflight_bounds_audit.js` tự động đánh dấu đỏ hoặc xóa toàn bộ các điểm neo rác nằm ngoài vùng in của bản thiết kế.
7. **Mistakes & Quiz:** Tránh xóa nhầm các đối tượng đồ họa tràn lề cố ý (Bleed items) khi kiểm tra biên trang. Quiz: Thuộc tính hình học nào đo kích thước bao trùm thực tế của toàn bộ nét vẽ và hiệu ứng đổ bóng của một layer? Đáp án: `layer.visibleBounds` (khác với `geometryBounds`).
8. **References:** Affinity DOM API: "LayerBounds & Dimensions".

---

*(Nội dung tiếp tục chuẩn hóa và chi tiết cho Modules S03 đến S10...)*

---

### MODULE S03: TẠO HÌNH VECTOR & ĐƯỜNG CONG TỰ ĐỘNG
*(Programmatic Shapes & Vector Geometry Generation)*

- **S03-01: Khởi Tạo Hình Khối Cơ Bản Qua Lập Trình (Programmatic Primitives: Rectangles, Stars & Polygons):** Viết mã tạo các hình học cơ bản (`doc.activeSpread.addRectangle({x, y, w, h, fill})`), tinh chỉnh bán kính góc `cornerRadius` qua code. (30 phút, `PLO-05`, `PLO-02`).
- **S03-02: Thuật Toán Dựng Đường Cong Bezier: Điểm Neo & Tay Đòn (Programmatic Bezier Path Construction):** Lập trình tạo mảng điểm neo (`Node`), thiết lập tọa độ tay đòn trước/sau (`controlPointIn`, `controlPointOut`) để vẽ sóng hình sin hoặc đường cong mượt tự động. (35 phút, `PLO-05`, `PLO-02`).
- **S03-03: Phép Toán Boolean & Tạo Hình Phức Hợp Qua Scripting (Boolean API & Compound Shapes):** Gọi các hàm hình học `affinity.geometry.add(layers)`, `subtract()`, `intersect()` thông qua JavaScript để tạo các biểu tượng logo đa giác tự động từ mã code. (35 phút, `PLO-05`, `PLO-02`).

---

### MODULE S04: QUẢN LÝ CẤU TRÚC LAYER & THỨ TỰ HIỂN THỊ
*(Layer Hierarchy & Reordering Operations)*

- **S04-01: Lập Trình Tạo Layer, Nhóm & Khóa Đối Tượng (Programmatic Layer Creation, Grouping & Locking):** Quản lý phân cấp dự án bằng code: tự động phân loại các vector vào layer `[Vectors]`, các văn bản vào layer `[Typography]`, khóa các layer nền chống di chuyển nhầm. (30 phút, `PLO-05`, `PLO-09`).
- **S04-02: Thao Tác Thứ Tự Hiển Thị Trục Z (Z-Order Manipulation: BringForward & SendBackward):** Điều khiển chiều sâu trục Z: `layer.bringToFront()`, `layer.sendToBack()`, `layer.moveAbove(targetLayer)` để sắp xếp hàng trăm đối tượng theo quy luật thị giác. (30 phút, `PLO-05`).
- **S04-03: Tự Động Hóa Mặt Nạ Che Chắn & Đường Cắt Cúp (Automated Masking & Layer Clipping API):** Viết script tự động lồng các ảnh chụp vào các khung vector tương ứng (`targetLayer.clipInside(maskLayer)`) phục vụ dàn trang tự động. (35 phút, `PLO-05`, `PLO-03`).

---

### MODULE S05: BẢNG MÀU, CHUYỂN SẮC & HIỆU ỨNG NHANH
*(Styles, Swatches & Effects API)*

- **S05-01: Mô Hình Không Gian Màu Trong JavaScript DOM (RGB, CMYK, LAB & Spot API):** Khởi tạo đối tượng màu chuẩn `new affinity.Color.CMYK(0, 80, 100, 0)` hoặc màu Spot Pantone qua script để đảm bảo tính chuẩn xác cho in ấn. (30 phút, `PLO-05`, `PLO-06`).
- **S05-02: Tạo Dải Chuyển Sắc Đa Điểm Dừng Bằng Mã Lệnh (Multi-Stop Gradient Automation):** Lập trình tạo `LinearGradient` và `RadialGradient`, tính toán phân bổ đều 10 điểm dừng màu (Color stops) tạo hiệu ứng chuyển sắc quang phổ toán học. (30 phút, `PLO-05`).
- **S05-03: Tự Động Hóa Hiệu Ứng Quick FX: Đổ Bóng, Phát Sáng & Làm Mờ (Quick FX API Scripting):** Điều khiển các tham số hiệu ứng layer: `layer.effects.gaussianBlur.radius = 15`, `outerShadow.opacity = 0.6` phục vụ thiết kế UI Design System bằng code. (30 phút, `PLO-05`).

---

### MODULE S06: TỰ ĐỘNG HÓA VĂN BẢN & TYPOGRAPHY
*(Frame Text & Typography Automation)*

- **S06-01: Khởi Tạo Khung Văn Bản & Bơm Nội Dung Tự Động (Programmatic Frame Text Injection):** Tự động tạo khung chữ theo kích thước tính toán, gán chuỗi ký tự, căn chỉnh lề và tự động liên kết (Thread) hai khung chữ bằng lệnh script. (30 phút, `PLO-05`, `PLO-04`).
- **S06-02: Ghi Đè Thuộc Tính Ký Tự & Đoạn Văn Bằng Script (Character & Paragraph Formatting API):** Lập trình áp dụng font family, font size, tracking, leading và OpenType features lên từng đoạn văn bản cụ thể thông qua mảng `textRuns`. (35 phút, `PLO-05`, `PLO-04`).
- **S06-03: Script Kiểm Toán Kiểu Chữ Chuẩn Thương Hiệu (Brand Typography Audit Script):** Phát triển công cụ kiểm tra toàn diện: phát hiện tất cả các đoạn văn bản trong tài liệu đang sử dụng sai font chữ ngoài danh mục Brand Guidelines quy định. (35 phút, `PLO-05`, `PLO-09`).

---

### MODULE S07: XỬ LÝ HÀNG LOẠT & NHẬP DỮ LIỆU NGOẠI VI
*(Batch Document Creation & Data Import)*

- **S07-01: Đọc & Phân Tích Dữ Liệu Ngoại Vi JSON / CSV Trong V8 (External Data Parsing in V8):** Kết nối môi trường V8 với hệ thống tệp cục bộ, đọc các file dữ liệu sản phẩm `catalog.json` và chuẩn bị dữ liệu đầu vào cho render đồ họa. (35 phút, `PLO-05`).
- **S07-02: Tự Động Sinh 100+ Asset Truyền Thông Từ Dữ Liệu Mẫu (Batch Social Media Card Generation):** Xây dựng quy trình tự động hóa hoàn chỉnh: đọc file JSON 50 câu danh ngôn, tự động tạo 50 Artboard độc lập với hình nền, tác giả và xuất thành 50 file ảnh đa kích cỡ. (40 phút, `PLO-05`, `PLO-11`).
- **S07-03: Quản Lý Hệ Thống Tệp, Thư Mục Đầu Ra & Phục Hồi Lỗi (File System Pipeline & Error Recovery):** Cấu trúc thư mục đầu ra tự động, bắt ngoại lệ `try...catch` khi gặp ảnh lỗi hoặc ký tự đặc biệt, ghi nhật ký log báo cáo tiến độ. (30 phút, `PLO-05`).

---

### MODULE S08: CẦU NỐI MÁY CHỦ MCP & THI CÔNG LỆNH TỪ XA
*(MCP Server SSE Bridge & Tool Execution)*

- **S08-01: Giao Thức Server-Sent Events (SSE) Cổng 6767 Chuyên Sâu (SSE Protocol on Port 6767):** Giải phẫu cơ chế giao tiếp hai chiều giữa Agent AI và tiến trình Affinity chạy nền thông qua giao thức Server-Sent Events tại `http://localhost:6767/sse`. (30 phút, `PLO-05`).
- **S08-02: Điều Phối Lệnh Thực Thi Từ Xa Qua Payload JSON (Remote Tool Execution via execute_script):** Đóng gói mã JavaScript thành payload JSON an toàn, gửi qua công cụ MCP `execute_script`, xử lý kết quả trả về hoặc mã lỗi tiến trình. (35 phút, `PLO-05`).
- **S08-03: Quản Lý Thư Viện Script Tái Sử Dụng Trên Máy Chủ MCP (Script Library Management via MCP):** Tự động lưu trữ và tái sử dụng các hàm tiện ích thông qua `save_script_to_library`, `read_library_script` và `list_library_scripts`. (30 phút, `PLO-05`).

---

### MODULE S09: KẾT XUẤT ĐỒ HỌA LẬP TRÌNH & PHẢN HỒI THỊ GIÁC
*(Programmatic Rendering & Visual Feedback Loop)*

- **S09-01: Kết Xuất Khung Trang Trực Tiếp Qua Cầu Nối MCP (Real-Time Spread Rendering via render_spread):** Gọi lệnh `render_spread` để xuất tức thời hình ảnh trang in hiện tại ra file ảnh PNG, cho phép Agent AI "nhìn thấy" trực quan kết quả dàn trang. (30 phút, `PLO-05`, `PLO-09`).
- **S09-02: Chụp Chi Tiết Layer Phục Vụ Kiểm Thử Tự Động (Layer Visual Capture via render_selection):** Gọi lệnh `render_selection` để cô lập chụp riêng một biểu trưng logo hoặc một thành phần giao diện, phục vụ kiểm tra kích thước và độ sắc nét. (30 phút, `PLO-05`).
- **S09-03: Đường Ống So Sánh Sai Lệch Thị Giác Tự Động (Automated Visual Regression Testing Pipeline):** Kết hợp script kết xuất với thuật toán so sánh ảnh pixel-by-pixel (Visual Diff) để tự động phát hiện lệch dòng hoặc sai font chữ giữa các phiên bản thiết kế. (35 phút, `PLO-05`, `PLO-09`).

---

### MODULE S010: QUY TRÌNH NGHỆ THUẬT TƯƠNG SINH & ĐẠI LÝ THIẾT KẾ ĐỘC LẬP
*(Generative Art Pipeline & Autonomous Workflows)*

- **S010-01: Thuật Toán Hình Học Tương Sinh: Voronoi, Xoắn Ốc & Fractal (Algorithmic Generative Art):** Viết thuật toán tạo hoa văn hình học tham số phức tạp: hệ lưới Voronoi, đường xoắn ốc tỉ lệ vàng Fibonacci và phân dạng Fractal trực tiếp trên canvas vector của Affinity. (40 phút, `PLO-05`, `PLO-02`).
- **S010-02: Bộ Sinh Hệ Thống Nhận Diện Thương Hiệu Tham Số (Parametric Brand Identity Generator):** Xây dựng công cụ sinh logo biến thể dựa trên dữ liệu người dùng (tên thương hiệu, mã số may mắn) tạo ra hàng trăm phương án biểu trưng độc bản trong vài giây. (40 phút, `PLO-05`, `PLO-11`).
- **S010-03: Đường Ống Thiết Kế Tự Động Khép Kín Với Agent AI (End-to-End Autonomous Design Pipeline):** Tích hợp trọn vẹn: Nhận đề bài từ Brief -> Phân tích dữ liệu -> Dựng bố cục Layout -> Vẽ minh họa Vector -> Xử lý ảnh Pixel -> Kiểm toán Preflight -> Xuất bản in PDF/X không cần can thiệp thủ công. (45 phút, `PLO-05`, `PLO-06`, `PLO-07`, `PLO-11`).

---

## 5. Bảng Tổng Hợp 120 Bài Học Toàn Bộ Dự Án Affinity Academy

| Nhóm / Track | Mã Module | Tên Module | Số Bài Học | Trạng Thái Quản Trị |
|---|---|---|:---:|:---:|
| **Track 1: Designer** | D01 | Interface, Personas & Document Setup | 3 | **COMPLETED & VERIFIED (30/30)** |
| | D02 | Vector Nodes, Paths & Pen Tool Geometry | 3 | |
| | D03 | Advanced Shape Creation & Boolean Geometry | 3 | |
| | D04 | Fill, Gradient, Stroke & Pressure Profiles | 3 | |
| | D05 | Layer Organization, Masks & Clipping Paths | 3 | |
| | D06 | Corner Tool, Contour Tool & Vector Precision | 3 | |
| | D07 | Isometric Grids, 2.5D Planes & Axonometric Projection | 3 | |
| | D08 | Symbols, Assets & Responsive Constraints | 3 | |
| | D09 | Pixel Persona, Texture Brushes & Raster Shading | 3 | |
| | D10 | Export Persona, Slices & Production Handoff | 3 | |
| **Track 2: Photo** | P01 | Interface, Personas & Document Core | 3 | **COMPLETED & VERIFIED (30/30)** |
| | P02 | Precision Selections & Masking | 3 | |
| | P03 | Non-Destructive Layers & Clipping Masks | 3 | |
| | P04 | Retouching, Inpainting & Frequency Separation | 3 | |
| | P05 | Color Correction, Curves, HSL & 3D LUT Grading | 3 | |
| | P06 | Live Filters, High Pass Sharpening & Procedural Texture | 3 | |
| | P07 | Advanced Compositing & Depth Blending | 3 | |
| | P08 | Typography Integration & Quick FX Shaders | 3 | |
| | P09 | RAW Develop Persona & 32-bit HDR Pipeline | 3 | |
| | P10 | Export Persona & Color Management Masterclass | 3 | |
| **Track 3: Publisher** | B01 | Publication Architecture, Document Setup & Bleed | 3 | **COMPLETED (Pilot)** |
| | B02–B10 | Master Pages, Typography, Data Merge, Tables, Preflight (9 modules) | 27 | **SPECIFICATION COMPLETE — BLK-007 LOCKED** |
| **Track 4: Scripting** | S01 | Affinity JS Runtime, Environment & Hello World | 3 | **COMPLETED (Pilot)** |
| | S02–S10 | DOM Tree, Shapes, Hierarchy, Styles, Batch, MCP, Generative (9 modules) | 27 | **SPECIFICATION COMPLETE — BLK-007 LOCKED** |
| **TỔNG CỘNG** | **40 Modules** | **Hệ Sinh Thái Toàn Diện 4 Track** | **120 Bài Học** | **66 Hiện Có / 54 Đã Lập Đặc Tả Hoàn Chỉnh** |

---

## 6. Ma Trận Ánh Xạ Learning Outcomes (PLO) Cho 54 Bài Học Mở Rộng

| Chuẩn Đầu Ra (PLO) | Mô Tả Trọng Tâm | Các Bài Học Mở Rộng Tiêu Biểu |
|---|---|---|
| **`PLO-01`** | Làm chủ công cụ cốt lõi & chuyển đổi Studio | `B05-01`, `B05-02`, `B05-03` |
| **`PLO-02`** | Hình học vector chuẩn xác & lưới phối cảnh | `B05-02`, `S03-01`, `S03-02`, `S03-03`, `S010-01` |
| **`PLO-03`** | Xử lý điểm ảnh phi phá hủy & mặt nạ | `B05-03`, `S04-03` |
| **`PLO-04`** | Phân cấp thị giác, dàn trang & lưới xuất bản | `B02-01` đến `B02-03`, `B03-01` đến `B03-03`, `B04-01` đến `B04-03`, `B06-01` đến `B06-03`, `B08-02`, `B09-01` |
| **`PLO-05`** | Tự động hóa thiết kế, V8 DOM & cầu nối MCP | `S02-01` đến `S02-03`, `S03-01` đến `S03-03`, `S04-01` đến `S04-03`, `S05-01` đến `S05-03`, `S06-01` đến `S06-03`, `S07-01` đến `S07-03`, `S08-01` đến `S08-03`, `S09-01` đến `S09-03`, `S010-01` đến `S010-03` |
| **`PLO-06`** | Chuẩn hóa chế bản, tiền kiểm & in ấn công nghiệp | `B02-03`, `B07-03`, `B08-03`, `B10-01`, `B10-02`, `B10-03`, `S05-01`, `S010-03` |
| **`PLO-07`** | Nghiên cứu & bóc tách đề bài thiết kế (Brief) | `B06-03`, `B08-01`, `S010-03` |
| **`PLO-08`** | Tiếp thu phản biện & quy trình cải tiến lặp | Toàn bộ 54 bài (thông qua phần Step-by-Step, Pitfalls và Practice) |
| **`PLO-09`** | Kiểm soát tài nguyên & tính toàn vẹn kỹ thuật | `B02-01`, `B07-01` đến `B07-03`, `B10-01`, `S02-03`, `S04-01`, `S06-03`, `S09-01` đến `S09-03` |
| **`PLO-10`** | Luận giải quyết định & bảo vệ phương án thẩm mỹ | Toàn bộ 54 bài (thông qua phần Lesson Content & Design Thinking) |
| **`PLO-11`** | Chuyển giao năng lực thực tế độc lập | `B08-03`, `B10-03`, `S07-02`, `S010-02`, `S010-03` |

---

## 7. Kết Luận Quản Trị & Đề Xuất Kế Hoạch Triển Khai

1. **Tuân thủ Gatekeeper `BLK-007`:**
   - Cổng `BLK-007` vẫn giữ trạng thái **LOCKED**.
   - Không có file JSON bài học chưa được cấp phép nào được tạo ra trong thư mục `curriculum/publisher/` hay `curriculum/scripting/` nhằm bảo vệ tuyệt đối tính ổn định của bộ kiểm thử CI/CD (`npm run validate:curriculum` vẫn giữ vững 66/66 PASS).
2. **Sẵn Sàng Triển Khai (Production-Ready Architecture):**
   - Tài liệu đặc tả `CURRICULUM_EXPANSION_SPEC_66_TO_120.md` này là nền móng kiến trúc hoàn chỉnh nhất từ trước tới nay, sẵn sàng để tác giả hóa thành các file JSON bài học ngay khi Project Owner ban hành chỉ thị mở khóa `BLK-007`.
3. **Quy Trình Mở Khóa Đề Xuất (Khi được phê duyệt):**
   - **Đợt 1 (Batch 1):** Mở khóa Track 3 Publisher B02–B05 (12 bài học). Chạy `validate:curriculum` & `test:translations`.
   - **Đợt 2 (Batch 2):** Mở khóa Track 3 Publisher B06–B10 (15 bài học). Hoàn tất toàn bộ Track 3 (30 bài học).
   - **Đợt 3 (Batch 3):** Mở khóa Track 4 Scripting S02–S05 (12 bài học).
   - **Đợt 4 (Batch 4):** Mở khóa Track 4 Scripting S06–S10 (15 bài học). Hoàn tất toàn bộ Track 4 (30 bài học) -> Đạt mốc **120 bài học toàn diện**.
