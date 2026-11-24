/**
 * AFFINITY ACADEMY — TÀI NGUYÊN THỰC HÀNH S01-03
 * Bài học: S01-03 Script tự động hóa đầu tiên: trích xuất thuộc tính tài liệu và Session UUID
 * Mô tả: Kiểm tra và trích xuất thông số của tài liệu đang mở trong Affinity bằng mã lệnh.
 */

const { Application } = require('/application.js');
const { Document } = require('/document.js');

const doc = Document.current;

console.log("=========================================");
console.log("   AFFINITY ACADEMY: KIỂM TRA TÀI LIỆU   ");
console.log("=========================================");

if (!doc) {
  console.log("CẢNH BÁO: Hiện chưa có tài liệu nào đang mở trong Affinity.");
  console.log("Hành động: Hãy mở sẵn hoặc tạo mới một tài liệu để kiểm tra.");
} else {
  console.log("Tên tài liệu       :", doc.title);
  console.log("Session UUID       :", doc.sessionUuid);
  console.log("Persistent UUID    :", doc.persistentUuid);
  console.log("Kích thước         :", doc.widthPixels + " x " + doc.heightPixels + " px");
  console.log("Độ phân giải       :", doc.dpi + " DPI (Hiển thị: " + doc.viewDpi + " DPI)");
  console.log("Đơn vị đo          :", doc.units);
  console.log("Hệ màu             :", doc.colourProfile ? doc.colourProfile.name : "Mặc định");
  console.log("Chưa lưu thay đổi  :", doc.isDirty);
  console.log("Chỉ đọc (Read Only):", doc.isReadOnly);
  console.log("Số trang đôi/Spread:", doc.spreadCount);
  console.log("Tổng số trang      :", doc.pageCount);
  console.log("=========================================");
  console.log("Kết quả: ĐẠT — Đã trích xuất thành công thuộc tính tài liệu.");
}
