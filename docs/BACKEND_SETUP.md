# HƯỚNG DẪN THIẾT LẬP BACKEND SUPABASE — AFFINITY ACADEMY

Tài liệu này cung cấp hướng dẫn đầy đủ để thiết lập, di chuyển dữ liệu (migration), cấu hình bảo mật và kiểm thử tầng dữ liệu Supabase cho nền tảng học tập trực tuyến **Affinity Academy**.

---

## 1. Tổng Quan Kiến Trúc Backend

Affinity Academy sử dụng kiến trúc **Local-First & Cloud-Synced** với nền tảng Supabase:

- **PostgreSQL Database**: Quản lý 8 bảng dữ liệu quan hệ (`profiles`, `tracks`, `modules`, `lessons`, `learning_resources`, `lesson_progress`, `assessments`, `assessment_submissions`, `assessment_results`).
- **Row Level Security (RLS)**: Cách ly dữ liệu học viên tuyệt đối qua `(select auth.uid()) = user_id`, bảo vệ hồ sơ chấm điểm chính thức bất biến (`assessment_results`).
- **Supabase Storage**: Quản lý 2 bucket (`submissions` bảo mật dung lượng 50MB và `resources` công khai dung lượng 100MB).
- **Progress Sync Engine**: Động cơ đồng bộ đa thiết bị, hàng đợi ngoại tuyến (offline queue), tự động thử lại khi mất mạng và giải quyết xung đột theo dấu thời gian (Last-Write-Wins).
- **Offline Mode Fallback**: Khi chưa cấu hình Supabase URL hoặc khi học viên không có kết nối Internet, ứng dụng tự động hoạt động ổn định trên `localStorage` mà không làm gián đoạn trải nghiệm người dùng.

---

## 2. Danh Sách Migrations SQL

Các file migration nằm trong thư mục `supabase/migrations/`:

| Thứ Tự | Tên File Migration | Nội Dung & Trách Nhiệm |
|---|---|---|
| 01 | `20261116000001_initial_schema.sql` | Hàm `handle_updated_at`, bảng `profiles`, trigger `on_auth_user_created`, bảng `tracks`, `modules`, `lessons`, `learning_resources`. |
| 02 | `20261116000002_progress_and_assessments.sql` | Bảng `lesson_progress`, `assessments`, `assessment_submissions`, `assessment_results`. Ràng buộc khóa ngoại và chỉ mục. |
| 03 | `20261116000003_rls_policies.sql` | Hàm phân quyền `is_admin()`, `is_evaluator_or_admin()`, kích hoạt RLS và thiết lập chính sách truy cập cho toàn bộ 8 bảng. |
| 04 | `20261116000004_storage_buckets.sql` | Khởi tạo bucket `submissions` (50MB, whitelist MIME) và `resources` (100MB). Cấu hình RLS trên `storage.objects`. |
| 05 | `20261116000005_seed_data.sql` | Nạp dữ liệu danh mục 4 lộ trình (Designer, Photo, Publisher, Scripting), các module cốt lõi, đặc tả Đồ án A5 Lumina Tea và tài nguyên mẫu. |

---

Các migration 20261122 bổ sung danh mục 22 học phần và 66 bài hiện có, bảo vệ hồ sơ theo tài khoản và lưu từng phiên bản đồ án qua hai hàm RPC. Chạy đủ migration theo thứ tự. Kiểm hồ sơ đang có số liệu cũ trước khi xác nhận ràng buộc fk_result_submission_owner trên một cơ sở dữ liệu đã dùng.

Khi cấu hình Auth, thêm đường dẫn /reset-password của đúng origin vào danh sách Redirect URLs. Trang này chỉ đổi mật khẩu sau khi Supabase phát sự kiện PASSWORD_RECOVERY. Chạy npm run test:backend để kiểm tra SQL trên PostgreSQL nhúng và ca hàng đợi đồng bộ trả lỗi. Dùng Supabase local với SMTP thử nghiệm để xác nhận riêng Auth, PostgREST và Storage.

## 3. Hướng Dẫn Thiết Lập Cục Bộ (Local Development với Supabase CLI)

### Bước 1: Cài đặt Supabase CLI
```bash
npm install -g supabase
```

### Bước 2: Khởi tạo và khởi động Supabase cục bộ (Yêu cầu Docker Desktop)
```bash
supabase init
supabase start
```

Sau khi khởi động thành công, CLI sẽ in ra thông tin:
- API URL: `http://127.0.0.1:54321`
- Studio URL: `http://127.0.0.1:54323`
- anon key: `eyJhbGciOi...`
- service_role key: `eyJhbGciOi...`

### Bước 3: Chạy toàn bộ migrations
```bash
supabase db reset
# Hoặc chạy từng file migration:
supabase migration up
```

---

## 4. Hướng Dẫn Liên Kết Với Dự Án Supabase Cloud Trên Mạng

### Bước 1: Tạo dự án mới trên Supabase Dashboard
1. Truy cập [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Tạo tổ chức hoặc chọn tổ chức sẵn có, tạo dự án với tên `affinity-academy`.
3. Đặt mật khẩu an toàn cho PostgreSQL.

### Bước 2: Liên kết CLI với dự án
```bash
supabase login
supabase link --project-ref <your-project-id>
```

### Bước 3: Đẩy toàn bộ migrations lên Cloud
```bash
supabase db push
```

### Bước 4: Cấu hình biến môi trường Frontend
Tạo file `.env.local` ở thư mục gốc của dự án (`c:\affinity học\.env.local`):
```ini
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 5. Quy Trình Kiểm Thử Backend Tự Động

Để kiểm tra tính hợp lệ của cú pháp SQL, logic phân quyền RLS, kích thước tệp và cơ chế đồng bộ xung đột:
```bash
npm run test:backend
```

Bộ kiểm thử sẽ tự động xác minh:
1. Tính toàn vẹn của cấu trúc schema và các ràng buộc khóa ngoại.
2. Các chính sách RLS ngăn chặn học viên tự ý sửa đổi hồ sơ chấm điểm (`assessment_results`).
3. Bộ lọc kiểm tra định dạng MIME và giới hạn tệp tải lên tối đa 50MB.
4. Cơ chế đồng bộ cục bộ và giải quyết xung đột Last-Write-Wins.
