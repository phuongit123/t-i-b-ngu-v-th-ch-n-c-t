# DANH MỤC KIỂM TRA AN TOÀN BẢO MẬT BACKEND — AFFINITY ACADEMY
## (Security Verification Matrix & Compliance Audit)

Tài liệu này xác nhận việc tuân thủ các tiêu chuẩn an toàn bảo mật nghiêm ngặt của dự án **Affinity Academy** đối với hạ tầng dữ liệu Supabase, xác thực người dùng và lưu trữ tệp.

---

## 1. Bảng Kiểm Tra Tuân Thủ Bảo Mật (Compliance Matrix)

| Tiêu Chí An Toàn | Quy Định Dự Án | Trạng Thái | Cơ Chế Xác Thực & Thực Thi |
|---|---|:---:|---|
| **RLS Toàn Diện** | Bật RLS trên 100% các bảng thuộc schema `public` | **ĐẠT (PASS)** | Migration `20261116000003_rls_policies.sql` chạy `ENABLE ROW LEVEL SECURITY` trên cả 8 bảng. |
| **Cách Ly Dữ Liệu Học Viên** | Học viên chỉ xem và sửa đổi dữ liệu tiến độ của chính mình | **ĐẠT (PASS)** | RLS Policy `lesson_progress_select_own` & `lesson_progress_update_own` kiểm tra `(select auth.uid()) = user_id`. |
| **Tính Bất Biến Của Điểm Số** | Học viên TUYỆT ĐỐI KHÔNG THỂ tự sửa kết quả đánh giá đồ án (`assessment_results`) | **ĐẠT (PASS)** | RLS Policy `results_insert_evaluator_only` và `results_update_evaluator_only` chỉ cấp quyền cho vai trò `evaluator` hoặc `admin` qua hàm bảo mật `public.is_evaluator_or_admin()`. |
| **Bảo Mật Khóa API Frontend** | Không bao giờ đưa `service_role` key vào mã nguồn giao diện | **ĐẠT (PASS)** | Frontend chỉ sử dụng `VITE_SUPABASE_ANON_KEY` qua `createClient`. File `.env.local` đã nằm trong `.gitignore`. |
| **Bảo Vệ Tải Lên Tệp (Storage)** | Giới hạn dung lượng tối đa 50MB cho tệp nộp bài | **ĐẠT (PASS)** | Cấu hình `file_size_limit = 52428800` tại `storage.buckets` và bộ lọc client `validateSubmissionFile` trong `storage.ts`. |
| **Kiểm Định Định Dạng MIME** | Whitelist các định dạng tệp đồ họa hợp lệ (`.afdesign`, `.afphoto`, `.afpub`, `.pdf`, `.zip`, ảnh) | **ĐẠT (PASS)** | Whitelist `allowed_mime_types` trong cơ sở dữ liệu và hàm tiền kiểm tra `validateSubmissionFile`. |
| **Phân Vùng Thư Mục Storage** | Học viên chỉ được ghi vào thư mục có tiền tố `user_id` của chính mình | **ĐẠT (PASS)** | RLS Storage Policy kiểm tra `(storage.foldername(name))[1] = (select auth.uid())::text`. |
| **Xử Lý Lỗi Ngoại Tuyến** | Hệ thống không được crash khi mất mạng hoặc chưa cấu hình Supabase | **ĐẠT (PASS)** | `client.ts` kiểm tra `isSupabaseConfigured()`; `progress-sync.ts` sử dụng hàng đợi ngoại tuyến `localStorage` và cơ chế giải quyết xung đột Last-Write-Wins. |

---

## 2. Chi Tiết Chính Sách RLS Độc Lập

### 2.1. Phân quyền bảng `assessment_results`
```sql
-- Học viên chỉ được ĐỌC điểm của chính mình hoặc tra cứu chứng chỉ công khai:
CREATE POLICY "results_select_policy"
  ON public.assessment_results
  FOR SELECT
  TO public
  USING (
    (certificate_id IS NOT NULL)
    OR ((SELECT auth.uid()) = user_id)
    OR public.is_evaluator_or_admin()
  );

-- Nghiêm cấm học viên INSERT hoặc UPDATE điểm số:
CREATE POLICY "results_insert_evaluator_only"
  ON public.assessment_results
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_evaluator_or_admin());

CREATE POLICY "results_update_evaluator_only"
  ON public.assessment_results
  FOR UPDATE
  TO authenticated
  USING (public.is_evaluator_or_admin())
  WITH CHECK (public.is_evaluator_or_admin());
```

### 2.2. Kiểm định vai trò bằng hàm bảo mật Security Definer
Hàm `public.is_evaluator_or_admin()` đọc trực tiếp cột `role` trong bảng `profiles` của người dùng được xác thực bởi `auth.uid()`, ngăn chặn mọi hành vi giả mạo JWT hoặc client metadata từ trình duyệt.

---

## 3. Khuyến Nghị Vận Hành Sản Xuất (Production Recommendations)

1. **Email Confirmations**: Bật tính năng xác thực email khi đăng ký tài khoản trong mục `Authentication > Providers > Email` trên Supabase Dashboard.
2. **Rate Limiting**: Thiết lập giới hạn tần suất gọi API (Rate Limit) cho các route `/auth/v1/signup` và `/storage/v1/object/submissions`.
3. **Sao Lưu Dữ Liệu Tự Động**: Bật tính năng Point-in-time Recovery (PITR) cho cơ sở dữ liệu PostgreSQL đối với dữ liệu học tập quan trọng của học viên.
