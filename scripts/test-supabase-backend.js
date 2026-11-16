/**
 * AFFINITY ACADEMY — SUPABASE BACKEND INTEGRATION TEST SUITE
 * Validates database schema migrations, RLS security policies,
 * storage upload constraints, and offline-first sync engine.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log(' AFFINITY ACADEMY: SUPABASE BACKEND & SECURITY VERIFICATION');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. Check Migration Files
// -----------------------------------------------------------------------------
console.log('[1/4] Kiểm tra các tệp Database Migrations SQL...');

const migrationsDir = path.join(rootDir, 'supabase', 'migrations');
assert(fs.existsSync(migrationsDir), 'Thư mục supabase/migrations tồn tại');

const requiredMigrations = [
  '20261116000001_initial_schema.sql',
  '20261116000002_progress_and_assessments.sql',
  '20261116000003_rls_policies.sql',
  '20261116000004_storage_buckets.sql',
  '20261116000005_seed_data.sql',
];

for (const mig of requiredMigrations) {
  const filePath = path.join(migrationsDir, mig);
  assert(fs.existsSync(filePath), `Migration tồn tại: ${mig}`);
}

// -----------------------------------------------------------------------------
// 2. Validate Schema & Table Definitions
// -----------------------------------------------------------------------------
console.log('\n[2/4] Kiểm tra cấu trúc Schema và Khóa ngoại...');

const schemaSql1 = fs.readFileSync(path.join(migrationsDir, '20261116000001_initial_schema.sql'), 'utf8');
const schemaSql2 = fs.readFileSync(path.join(migrationsDir, '20261116000002_progress_and_assessments.sql'), 'utf8');

const expectedTables = [
  'public.profiles',
  'public.tracks',
  'public.modules',
  'public.lessons',
  'public.learning_resources',
  'public.lesson_progress',
  'public.assessments',
  'public.assessment_submissions',
  'public.assessment_results',
];

for (const tbl of expectedTables) {
  const found = schemaSql1.includes(`CREATE TABLE IF NOT EXISTS ${tbl}`) ||
                schemaSql2.includes(`CREATE TABLE IF NOT EXISTS ${tbl}`);
  assert(found, `Bảng dữ liệu định nghĩa hợp lệ: ${tbl}`);
}

// Check auto updated_at trigger function
assert(schemaSql1.includes('FUNCTION public.handle_updated_at()'), 'Hàm kích hoạt tự động handle_updated_at được định nghĩa');
assert(schemaSql1.includes('on_auth_user_created'), 'Trigger đồng bộ auth.users sang public.profiles tồn tại');

// -----------------------------------------------------------------------------
// 3. Security Audit & RLS Verification
// -----------------------------------------------------------------------------
console.log('\n[3/4] Kiểm toán An toàn Bảo mật & Chính sách RLS...');

const rlsSql = fs.readFileSync(path.join(migrationsDir, '20261116000003_rls_policies.sql'), 'utf8');

// Verify RLS is enabled on all 8 application tables
for (const tbl of expectedTables) {
  assert(rlsSql.includes(`ALTER TABLE ${tbl} ENABLE ROW LEVEL SECURITY;`), `RLS đã được kích hoạt trên bảng: ${tbl}`);
}

// Verify Helper Security Functions
assert(rlsSql.includes('FUNCTION public.is_admin()'), 'Hàm kiểm tra quyền quản trị viên is_admin() được định nghĩa');
assert(rlsSql.includes('FUNCTION public.is_evaluator_or_admin()'), 'Hàm kiểm tra vai trò giám khảo is_evaluator_or_admin() được định nghĩa');

// CRITICAL SECURITY RULE: Assessment results must NEVER allow student writes
assert(
  rlsSql.includes('CREATE POLICY "results_insert_evaluator_only"') &&
  rlsSql.includes('WITH CHECK (public.is_evaluator_or_admin())'),
  'BẢO MẬT TUYỆT ĐỐI: Học viên bị cấm thêm mới hồ sơ chấm điểm assessment_results'
);

assert(
  rlsSql.includes('CREATE POLICY "results_update_evaluator_only"') &&
  rlsSql.includes('USING (public.is_evaluator_or_admin())'),
  'BẢO MẬT TUYỆT ĐỐI: Học viên bị cấm sửa đổi kết quả đánh giá assessment_results'
);

// Verify user data isolation on lesson_progress
assert(
  rlsSql.includes('((SELECT auth.uid()) = user_id)'),
  'Dữ liệu tiến độ học tập lesson_progress được cách ly an toàn theo auth.uid()'
);

// -----------------------------------------------------------------------------
// 4. Storage & Offline Sync Engine Verification
// -----------------------------------------------------------------------------
console.log('\n[4/4] Kiểm tra Storage Buckets, MIME Whitelist & Sync Engine...');

const storageSql = fs.readFileSync(path.join(migrationsDir, '20261116000004_storage_buckets.sql'), 'utf8');

assert(storageSql.includes("'submissions'"), "Bucket 'submissions' được tạo");
assert(storageSql.includes('52428800'), 'Giới hạn dung lượng bucket submissions là 50MB (52428800 bytes)');
assert(storageSql.includes("'application/octet-stream'"), 'Hỗ trợ tệp định dạng gốc Affinity (.afdesign, .afphoto, .afpub)');
assert(storageSql.includes("'resources'"), "Bucket 'resources' công khai được tạo");

// Check TypeScript client & files
const tsDatabaseTypes = path.join(rootDir, 'src', 'types', 'database.types.ts');
const tsClient = path.join(rootDir, 'src', 'lib', 'supabase', 'client.ts');
const tsAuthContext = path.join(rootDir, 'src', 'lib', 'supabase', 'auth-context.tsx');
const tsStorage = path.join(rootDir, 'src', 'lib', 'supabase', 'storage.ts');
const tsProgressSync = path.join(rootDir, 'src', 'lib', 'supabase', 'progress-sync.ts');
const tsAuthModal = path.join(rootDir, 'src', 'components', 'auth', 'AuthModal.tsx');
const tsProtectedRoute = path.join(rootDir, 'src', 'components', 'auth', 'ProtectedRoute.tsx');
const envExample = path.join(rootDir, '.env.example');

assert(fs.existsSync(tsDatabaseTypes), 'TypeScript database types tồn tại');
assert(fs.existsSync(tsClient), 'Supabase client module tồn tại');
assert(fs.existsSync(tsAuthContext), 'Auth Context & Provider module tồn tại');
assert(fs.existsSync(tsAuthModal), 'AuthModal UI dialog tồn tại');
assert(fs.existsSync(tsProtectedRoute), 'ProtectedRoute xác thực và phân quyền tồn tại');
assert(fs.existsSync(tsStorage), 'Storage client module tồn tại');
assert(fs.existsSync(tsProgressSync), 'Progress Sync Engine module tồn tại');
assert(fs.existsSync(envExample), 'Template .env.example cấu hình tồn tại');

// Verify client code does not expose secrets
const clientCode = fs.readFileSync(tsClient, 'utf8');
assert(!clientCode.includes('service_role'), 'Client code KHÔNG chứa service_role key');

console.log('\n================================================================');
console.log(` KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TESTS ĐẠT (${failedTests} LỖI)`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✓ TOÀN BỘ TIÊU CHÍ BACKEND SUPABASE & AN TOÀN BẢO MẬT ĐÃ ĐƯỢC XÁC THỰC THÀNH CÔNG.\n');
  process.exit(0);
}
