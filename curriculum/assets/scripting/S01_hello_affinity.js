/**
 * AFFINITY ACADEMY — TÀI NGUYÊN THỰC HÀNH S01-01
 * Bài học: S01-01 Kiến trúc Runtime JavaScript Affinity, V8 Engine và giới hạn Sandbox
 * Mô tả: Kịch bản Hello World kiểm tra môi trường thực thi V8 và thông tin phiên bản ứng dụng.
 */

const { Application } = require('/application.js');

console.log("=========================================");
console.log("   AFFINITY ACADEMY: KỊCH BẢN HELLO WORLD ");
console.log("=========================================");
console.log("Tên sản phẩm      :", Application.productFullName);
console.log("Phiên bản build   :", Application.buildVersion);
console.log("Phiên bản đầy đủ  :", Application.version);
console.log("Nền tảng          :", Application.platformName || "Máy tính để bàn (Desktop)");
console.log("Đường dẫn Desktop :", Application.userDesktopPath);
console.log("Thời gian chạy    :", new Date().toISOString());
console.log("=========================================");
console.log("Kết quả: ĐẠT — Affinity JavaScript DOM đang hoạt động bình thường.");
