-- ============================================================================
-- MIGRATION: 20261116000005_seed_data.sql
-- DESCRIPTION: Initial seed data for Tracks, Key Modules, Assessments (including
--              A5 Capstone Spec), and default Practice Resources.
-- AUTHOR: BackendAgent / Orchestrator
-- ============================================================================

-- 1. Insert Curriculum Tracks
INSERT INTO public.tracks (id, name, label_vi, tagline_vi, description_vi, order_index, is_active)
VALUES
  (
    'designer',
    'Affinity Designer Mastery',
    'Vector & Nhận diện Thương hiệu',
    'Hình học vector chuẩn xác, artboard tương thích & kiểu chữ nâng cao',
    'Làm chủ hệ tọa độ Bezier, phép toán Boolean, lưới phối cảnh Isometric và quy trình xuất asset đa tỷ lệ cho thiết kế vector chuyên nghiệp.',
    1,
    true
  ),
  (
    'photo',
    'Affinity Photo Mastery',
    'Pixel, Retouching & Ghép ảnh Kỹ thuật số',
    'Chỉnh sửa phi phá hủy, xử lý RAW & dải màu 32-bit HDR',
    'Khai thác các lớp điều chỉnh phi phá hủy, tách tần số Frequency Separation, bộ lọc trực tiếp Live Filters và dải màu 32-bit không giới hạn.',
    2,
    true
  ),
  (
    'publisher',
    'Affinity Publisher Mastery',
    'Dàn trang Xuất bản & Chế bản In ấn',
    'Kiến trúc ấn phẩm đa trang, Master Pages & chuẩn in ấn thương mại',
    'Thành thạo dàn trang sách báo, tạp chí, quản lý trang đôi Facing Pages, lưới dòng kẻ Baseline Grid và tích hợp StudioLink đa nền tảng.',
    3,
    true
  ),
  (
    'scripting',
    'Scripting & MCP Automation',
    'Tự động hóa Thiết kế & V8 DOM Scripting',
    'Lập trình tạo hình đồ họa qua JavaScript DOM & cầu nối MCP cục bộ',
    'Tự động hóa vector, kết xuất hàng loạt và tạo đồ họa tương sinh qua nhân JavaScript V8 tích hợp cùng giao thức MCP cổng 6767.',
    4,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  label_vi = EXCLUDED.label_vi,
  tagline_vi = EXCLUDED.tagline_vi,
  description_vi = EXCLUDED.description_vi,
  order_index = EXCLUDED.order_index,
  is_active = EXCLUDED.is_active;

-- 2. Insert Core Pilot Modules (D01, P01, B01, S01 representative samples)
INSERT INTO public.modules (id, track_id, module_number, title_vi, title_en, description_vi, difficulty, estimated_minutes, order_index)
VALUES
  ('D01', 'designer', '01', 'Không gian làm việc & Thiết lập Tài liệu', 'Workspace & Document Setup', 'Khám phá Vector Studio, Persona, Artboard và Color Management.', 'Beginner', 60, 1),
  ('D02', 'designer', '02', 'Hình học Vector & Công cụ Pen', 'Vector Geometry & Pen Tool', 'Làm chủ điểm neo, đường cong Bezier và công cụ Node Tool.', 'Beginner', 60, 2),
  ('D03', 'designer', '03', 'Phép toán Boolean & Đường dẫn Hợp thành', 'Boolean Operations & Compound Shapes', 'Khám phá Add, Subtract, Intersect và tạo các tổ hợp hình khối phức tạp.', 'Beginner', 60, 3),
  ('P01', 'photo', '01', 'Không gian làm việc Photo & Lớp Phi Phá Hủy', 'Photo Studio & Non-Destructive Layers', 'Khám phá Pixel Studio, kiến trúc Layer, Lock và Opacity.', 'Beginner', 60, 1),
  ('P02', 'photo', '02', 'Vùng chọn Chuẩn xác & Masking', 'Precision Selections & Masking', 'Làm chủ Selection Brush, Refine Edge và mặt nạ che chắn ảnh.', 'Beginner', 60, 2),
  ('B01', 'publisher', '01', 'Kiến trúc Tài liệu Đa trang & Trang Chủ', 'Multi-Page Architecture & Master Pages', 'Thiết lập kích thước trang, lề in, Bleed đồ họa và Master Pages đối xứng.', 'Beginner', 60, 1),
  ('S01', 'scripting', '01', 'Affinity Scripting DOM & Giao tiếp MCP', 'Affinity Scripting DOM & MCP Communication', 'Tổng quan API JavaScript V8 nhúng và điều khiển ứng dụng qua cổng 6767.', 'Intermediate', 60, 1)
ON CONFLICT (id) DO UPDATE SET
  title_vi = EXCLUDED.title_vi,
  title_en = EXCLUDED.title_en,
  description_vi = EXCLUDED.description_vi,
  difficulty = EXCLUDED.difficulty,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index;

-- 3. Insert Formal Capstone Assessment: A5 Lumina Tea Brand Identity
INSERT INTO public.assessments (id, type, title_vi, scenario_overview, rubric_spec, starter_assets, pass_threshold_score, is_active)
VALUES
  (
    'capstone-a5-lumina',
    'capstone',
    'A5 Capstone: Hệ Thống Nhận Diện & Bao Bì Thương Hiệu Trà Thủ Công Lumina',
    'Thực hiện trọn vẹn dự án nhận diện thương hiệu cao cấp từ nghiên cứu brief, xây dựng biểu trưng vector, xử lý chất liệu hình ảnh pixel, dàn trang cẩm nang thương hiệu và tự động hóa xuất bản đa định dạng.',
    '{
      "total_weight": 100,
      "categories": [
        {
          "id": "brief_research",
          "name": "Nghiên cứu & Thấu hiểu Brief",
          "weight": 15,
          "description": "Khả năng phân tích mục tiêu kinh doanh, đối tượng mục tiêu và thiết lập bảng Moodboard định hướng thị giác."
        },
        {
          "id": "vector_mastery",
          "name": "Kỹ năng Vector & Biểu trưng (Layout/Vector)",
          "weight": 25,
          "description": "Chất lượng đường cong Bezier, tỉ lệ hình học, lưới chuẩn xác và tính linh hoạt của logo."
        },
        {
          "id": "pixel_craft",
          "name": "Kỹ thuật Xử lý Ảnh & Giả lập Bao bì (Pixel)",
          "weight": 20,
          "description": "Ghép ảnh mockup chân thực, mặt nạ pixel chuẩn xác, ánh sáng và đổ bóng phi phá hủy."
        },
        {
          "id": "editorial_delivery",
          "name": "Dàn trang Brand Guidelines & Tiêu chuẩn In ấn",
          "weight": 20,
          "description": "Sử dụng Master Pages, lưới Baseline Grid, kiểu chữ thứ bậc, Bleed in ấn 3mm và xuất PDF/X-4."
        },
        {
          "id": "design_thinking_reflection",
          "name": "Tư duy Thiết kế & Luận giải Quyết định",
          "weight": 20,
          "description": "Bài luận giải thích nguyên nhân lựa chọn công cụ, quy trình lặp và bài học kinh nghiệm chuyển giao."
        }
      ]
    }'::jsonb,
    '[
      {"name": "lumina_brand_brief.pdf", "path": "resources/briefs/lumina_brief.pdf", "size_kb": 320},
      {"name": "lumina_starter_palette.afpalette", "path": "resources/palettes/lumina.afpalette", "size_kb": 12},
      {"name": "tea_canister_mockup.afphoto", "path": "resources/mockups/tea_canister.afphoto", "size_kb": 8500}
    ]'::jsonb,
    75.0,
    true
  ),
  (
    'ch-vec-diamond',
    'challenge',
    'Thử Thách: Thiết Kế Biểu Tượng Diamond Gemstone Chuẩn Lưới Phối Cảnh',
    'Sử dụng công cụ Pen Tool, phép toán Boolean Add/Intersect và hệ lưới Isometric để dựng khối kim cương đa giác đối xứng.',
    '{
      "total_weight": 100,
      "categories": [
        {"id": "geometry", "name": "Độ chính xác hình học", "weight": 50},
        {"id": "color_harmony", "name": "Chuyển sắc & Bóng đổ", "weight": 50}
      ]
    }'::jsonb,
    '[]'::jsonb,
    80.0,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title_vi = EXCLUDED.title_vi,
  scenario_overview = EXCLUDED.scenario_overview,
  rubric_spec = EXCLUDED.rubric_spec,
  starter_assets = EXCLUDED.starter_assets,
  pass_threshold_score = EXCLUDED.pass_threshold_score,
  is_active = EXCLUDED.is_active;

-- 4. Insert Default Public Learning Resources
INSERT INTO public.learning_resources (title, filename, category, extension, file_size_bytes, storage_path, is_public)
VALUES
  ('Bảng Phím Tắt Affinity V2 Toàn Diện (Windows & Mac)', 'Affinity_V2_Shortcut_Cheatsheet.pdf', 'common', 'pdf', 1245000, 'resources/cheatsheets/shortcuts_v2.pdf', true),
  ('Bảng Mẫu Lưới Dàn Trang Sách Báo Khổ A4/Letter', 'Editorial_Baseline_Grid_Template.afpub', 'publisher', 'afpub', 3420000, 'resources/templates/grid_a4.afpub', true),
  ('Bộ Bảng Màu Sang Trọng Dark Luxury Hướng Vector', 'Dark_Luxury_Brand_Palette.afpalette', 'designer', 'afpalette', 14500, 'resources/palettes/dark_luxury.afpalette', true)
ON CONFLICT DO NOTHING;
