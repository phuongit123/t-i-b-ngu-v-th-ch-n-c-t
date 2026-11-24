# Đối chiếu giáo trình Affinity trên Windows

Đợt rà ngày 22/11/2026. Mốc so sánh `9bef09f702a8e1e9f0983c3669f4bef54b10d1ea`, nhánh `feat/full-platform-overhaul`. Phạm vi 66 bài hiện hữu, 22 học phần. Ánh xạ `TASK-079–080 / REQ-LEARN-001–002` và bản duyệt `TASK-020, TASK-071–073 / REQ-FE-001, REQ-PAGE-001–003`.

## Phát hiện trên bản gốc

| Dấu hiệu trong 66 bài | Số bài |
| --- | ---: |
| Có ít nhất một tên Vector, Pixel, Photo, Designer, Publisher, Export, Develop, Liquify hoặc Tone Mapping Persona | 60 |
| Trỏ ít nhất một URL từ hệ tài liệu Affinity V1/V2 | 36 |
| Có lệnh theo đường dẫn `View > Studio > …` | 11 |
| Có đường dẫn đến ảnh hoặc sơ đồ trong `standardSections.visualExamples` | 3 |
| Bài tự làm trỏ tới tài liệu hướng dẫn | 60 |
| Bài tự làm trỏ tới tệp Affinity gốc | 3 |

Một bài có thể xuất hiện ở nhiều hàng. Kiểm nguồn theo URL giúp nhận diện tài liệu cần rà lại. Hình do giao diện chọn theo học phần và sơ đồ viết bằng văn bản nằm ngoài số đếm đường dẫn. Ba bài Pixel đầu có thể dùng chung một tệp Affinity.

## Những phần đã sửa và bằng chứng

| Bài | Thay đổi | Căn cứ |
| --- | --- | --- |
| D01-01 | Viết lại hướng dẫn mở poster, chuyển Studio, tìm và ẩn/hiện lớp. Có poster SVG chỉnh được và ảnh thật. | Mở poster trong Affinity 3.3.3.5004 Windows. Tận mắt thấy cùng tab tài liệu khi đổi Vector, Pixel, Layout. [Affinity Essentials, bài 1](https://www.affinity.studio/blog/affinity-essentials-lesson-1-welcome-to-affinity) |
| D02-01 | Minh họa thanh tùy chọn Pen Tool, sửa đường cong bằng Node Tool và thử biểu tượng lá ở cỡ nhãn in. | Chọn Pen Tool trên cùng bản Affinity. [Vẽ và sửa đường cong](https://www.affinity.studio/features/vector-drawing) |
| D05-01 | Đổi tên Layers panel và đường dẫn `Window > General > Layers`. | [Layers panel](https://www.affinity.studio/help/panels-layers-panel/) |
| P01-01 | Dùng tab Pixel, ảnh thật của Histogram và Layers, kèm nguồn học chính thức. | Quan sát trực tiếp Pixel Studio trên Windows. [Affinity Essentials, bài 3](https://www.affinity.studio/blog/affinity-essentials-lesson-3-pixel-studio) |
| P04-02 | Đổi Clone Stamp thành Clone Brush Tool và sửa một số mô tả độ cứng cọ, mép sao chép. | [Affinity, sửa kết cấu bằng Clone Brush](https://www.affinity.studio/blog/frequency-separation-explained) |
| B01-01 | Giải thích 3 mm là thông số cho bài, cách chọn tràn lề khi in thật và cách tìm Document Setup. | [Chuẩn bị tài liệu để in](https://www.affinity.studio/blog/print-design-everything-you-need-to-know) · [Move Tool](https://www.affinity.studio/help/tools-tools-move/) |
| B01-02 | Chỉ bảng Pages, nhóm Master Pages trong Layout và thêm nguồn hiện hành. | Quan sát trực tiếp bảng Pages trong Layout. [Smart Master Pages](https://www.affinity.studio/features/smart-master-pages) |

Ảnh dùng trong bài nằm tại `public/assets/lessons/affinity-333-{vector,pen,pixel,layout}.webp`. Poster gốc là `public/assets/lessons/tra-mat.svg`. Bài D01-01, D02-01, D05-01, P01-01, P04-02, B01-01 và B01-02 có thay đổi nội dung. Các bài liên quan còn lại được chuẩn hóa tên Studio nơi có thể đối chiếu. Các URL bài trước khi đổi tiêu đề được giữ ở quy tắc định tuyến.

MCP báo 11 công cụ sau khi mở Affinity. Tiện ích S01-02 nhận HTTP 200 với `text/event-stream`. Kiểm tra này xác nhận điểm kết nối đã phản hồi.

## Phần còn cần kiểm thực hành

1. Chạy lại thao tác và bài tự làm từ tệp đầu vào đến tệp xuất. Mỗi bài cần bằng chứng đủ để người mới nhận ra kết quả đúng.
2. Ưu tiên P01-02 vì bài yêu cầu RAW trong khi tệp thực hành được liên kết có đuôi `.afphoto`. Ưu tiên D10-01 và P10-01 để xác nhận đường vào Slice Studio và kiểm Continuous Export.
3. Kiểm các đường dẫn `View > Studio` còn lại và các phím riêng theo nền tảng. Ghi rõ những nguồn lịch sử.
4. Kiểm các bước giảng và bài tự làm trên cả ba Studio trước khi nâng trạng thái `TASK-079/080`. `BLK-007` đang khóa phần mở rộng.

[Mở bản duyệt](http://127.0.0.1:4174/hoc-affinity/) · [Đối chiếu từng bài](http://127.0.0.1:4174/hoc-affinity/doi-chieu.html) · [Figma](https://www.figma.com/design/cSRe5Wv0orAS63LYPxQc8w?node-id=16-2)

Bản duyệt dùng cách tổ chức mục tiêu, học phần và bài tập của các nền tảng đào tạo. Bảng màu giấy sáng, xanh lá, kiểu chữ Lora và ảnh Affinity phục vụ nội dung môn học. Giao diện được duyệt trên bản riêng trước khi đưa vào ứng dụng React. [Coursera, Fundamentals of Graphic Design](https://www.coursera.org/learn/fundamentals-of-graphic-design) · [Udemy, Affinity 3: The Complete Design Course](https://www.udemy.com/course/affinity-vector-pixel-layout-complete/)
