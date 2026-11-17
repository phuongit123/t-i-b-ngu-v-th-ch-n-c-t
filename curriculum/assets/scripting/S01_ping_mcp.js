/**
 * AFFINITY ACADEMY — TÀI NGUYÊN THỰC HÀNH S01-02
 * Bài học: S01-02 Kết nối máy chủ Affinity MCP cục bộ (localhost:6767) và cầu nối SSE
 * Mô tả: Tiện ích kiểm tra kết nối từ phía client tới điểm cuối SSE của cầu nối Affinity MCP.
 */

import http from 'node:http';

console.log("=========================================");
console.log("   AFFINITY ACADEMY: KIỂM TRA CẦU NỐI MCP ");
console.log("=========================================");

const options = {
  hostname: 'localhost',
  port: 6767,
  path: '/sse',
  method: 'GET',
  headers: {
    'Accept': 'text/event-stream'
  },
  timeout: 3000
};

const req = http.request(options, (res) => {
  console.log(`Mã trạng thái HTTP : ${res.statusCode}`);
  console.log(`Loại nội dung      : ${res.headers['content-type']}`);
  if (res.statusCode === 200) {
    console.log("Kết quả            : ĐẠT — Máy chủ Affinity MCP đang lắng nghe và hoạt động ổn định.");
  } else {
    console.log("Kết quả            : CẢNH BÁO — Máy chủ MCP trả về mã trạng thái bất thường.");
  }
  res.destroy();
});

req.on('timeout', () => {
  console.error("Kết quả            : LỖI — Hết thời gian chờ kết nối tới localhost:6767.");
  req.destroy();
});

req.on('error', (err) => {
  console.error(`Kết quả            : LỖI — Không thể kết nối tới localhost:6767: ${err.message}`);
});

req.end();
