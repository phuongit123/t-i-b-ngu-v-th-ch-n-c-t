export { default as FOUNDATION_STEPS } from '../../curriculum/first-project.json';

export const LEARNING_STAGES = [
  {
    id: 'nen-tang',
    title: 'Nền tảng thị giác',
    tool: 'Chọn đối tượng, artboard, căn gióng và khung chữ',
    judgement: 'Thử hai bố cục rồi chọn theo thứ tự đọc, độ tương phản, khoảng cách và đối tượng xem.',
    task: 'Làm lại poster cho một buổi chiếu phim ngoài trời. Tạo hai kích thước dùng trên màn hình và chỉ ra thông tin được ưu tiên ở mỗi bản.',
    evidence: 'Hai bố cục, bản đã sửa và lý do chọn cỡ chữ, màu, vị trí thông tin.',
    pass: 'Cho một người xem poster trong 5 giây. Họ đọc được tên sự kiện và chỉ đúng nơi tìm giờ, địa điểm. Nếu họ nhầm, sửa bản rồi thử lại.',
    lessons: ['D01-01', 'D01-02', 'D01-03', 'D06-01'],
    track: 'designer',
  },
  {
    id: 'vector',
    title: 'Vẽ và kiểm soát hình vector',
    tool: 'Hình cơ bản, Boolean, Pen, Node và Layers',
    judgement: 'Chọn ghép hình khi hình có cấu trúc đơn giản, dùng Pen khi cần đường cong riêng. Kiểm hình ở kích thước thật trước khi thêm chi tiết.',
    task: 'Vẽ ba biểu tượng chỉ dẫn cho một khu chợ. Dùng cùng một cách xử lý nét và góc để cả bộ nhìn thống nhất.',
    evidence: 'Tệp nguồn còn chỉnh được, ba biểu tượng và bản kiểm ở kích thước 24 px.',
    pass: 'Nhờ một người gọi tên ba biểu tượng ở kích thước nhỏ. Mở tệp nguồn, đổi độ đậm của một biểu tượng và xuất lại mà không phải vẽ lại.',
    lessons: ['D03-02', 'D02-01', 'D02-02', 'D05-01', 'D05-02', 'D10-01', 'D10-03'],
    track: 'designer',
  },
  {
    id: 'pixel',
    title: 'Chỉnh ảnh có kiểm soát',
    tool: 'Cắt ảnh, vùng chọn, mặt nạ và lớp điều chỉnh',
    judgement: 'Chỉnh bố cục để hướng mắt vào chủ thể. Giữ ảnh gốc và so sánh kết quả ở cả kích thước nhỏ lẫn vùng biên cần giữ chi tiết.',
    task: 'Làm ảnh bìa cho một bài viết về quán cà phê từ ảnh gốc khác ảnh trong bài mẫu. Chọn lại khung cắt và chỉ chỉnh những vùng cần thiết.',
    evidence: 'Ảnh trước và sau, tệp còn lớp và ghi chú một chỉnh sửa đã bỏ vì làm ảnh kém tự nhiên.',
    pass: 'Thu nhỏ ảnh để kiểm chủ thể, phóng 100% để kiểm mép vùng chỉnh. Tắt một lớp điều chỉnh và kiểm tra ảnh gốc vẫn còn nguyên.',
    lessons: ['P01-01', 'P01-03', 'P02-01', 'P02-03', 'P03-02', 'P05-02', 'P04-02', 'P07-01', 'P10-02'],
    track: 'photo',
  },
  {
    id: 'layout',
    title: 'Dàn trang và chuẩn bị đầu ra',
    tool: 'Trang mẫu, lề, lưới và luồng văn bản nối khung',
    judgement: 'Đặt lưới theo lượng nội dung và cách đọc. Kiểm tra khoảng cách chữ, lề an toàn và tràn lề theo yêu cầu đầu ra.',
    task: 'Dàn trang bốn trang cho một chương trình triển lãm. Sửa nội dung ở một trang để thử hệ thống lưới và trang mẫu.',
    evidence: 'Tệp nguồn nhiều trang và PDF xem lại được, có chú thích về lưới và quy cách xuất.',
    pass: 'Thêm hai dòng nội dung và kiểm không có chữ tràn khung. Mở PDF, lật đủ bốn trang, đối chiếu thứ tự đọc, lề và số trang.',
    lessons: ['B01-01', 'B01-02', 'B01-03'],
    track: 'publisher',
  },
] as const;

export const LEARNING_PATH_QUERY = '?tu=lo-trinh';
