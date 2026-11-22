import React, { useMemo, useState } from 'react';
import { Download, FileCode2, FileImage, FileText, Search, Cloud, HardDrive } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { ALL_CURRICULUM_ASSET_URLS } from '../lib/curriculum-asset-urls';
import { GoogleDriveStorageHub } from '@/components/storage/GoogleDriveStorageHub';

type ResourceCategory = 'all' | 'designer' | 'photo' | 'publisher' | 'scripting';
const categoryLabels: Record<Exclude<ResourceCategory, 'all'>, string> = {
  designer: 'Vector Studio', photo: 'Pixel Studio', publisher: 'Layout Studio', scripting: 'Automation',
};
const getCategory = (path: string): Exclude<ResourceCategory, 'all'> => {
  const segment = path.split('/').at(-2) ?? 'designer';
  return segment in categoryLabels ? segment as Exclude<ResourceCategory, 'all'> : 'designer';
};

interface VisualAssetItem {
  id: string;
  src: string;
  filename: string;
  title: string;
  studioLabel: string;
  description: string;
  kind: 'photo' | 'diagram' | 'slide';
}

const VISUAL_PRACTICE_ASSETS: VisualAssetItem[] = [
  {
    id: 'sim-portrait',
    src: '/assets/simulator/portrait-subject-studio.png',
    filename: 'portrait-subject-studio.png',
    title: 'Chân dung tách nền tóc & viền sáng (Pixel Studio)',
    studioLabel: 'Pixel Studio · Tách nền & Masking',
    description: 'Ảnh chủ thể độ tương phản cao dùng thực hành Refine Selection, Layer Mask và tách nền mềm.',
    kind: 'photo',
  },
  {
    id: 'sim-sunset',
    src: '/assets/simulator/background-sunset-city.png',
    filename: 'background-sunset-city.png',
    title: 'Phông nền đô thị hoàng hôn (Ghép ảnh & Blend Modes)',
    studioLabel: 'Pixel Studio · Compositing',
    description: 'Tấm nền môi trường chuẩn ánh sáng ấm dùng làm nền ghép chân dung và hòa trộn màu sắc.',
    kind: 'photo',
  },
  {
    id: 'sim-coldbrew',
    src: '/assets/simulator/coldbrew-product-plate.png',
    filename: 'coldbrew-product-plate.png',
    title: 'Chai sản phẩm thủy tinh trên nền tối (Product Retouch)',
    studioLabel: 'Pixel Studio · Retouch Thương mại',
    description: 'Ảnh chụp sản phẩm lạnh với giọt ngưng tụ dùng thực hành xử lý phản quang và cân bằng vùng sáng.',
    kind: 'photo',
  },
  {
    id: 'grade-before',
    src: '/assets/lessons/before-color-raw.png',
    filename: 'before-color-raw.png',
    title: 'Ảnh phong cảnh RAW phẳng trước khi hậu kỳ',
    studioLabel: 'Pixel Studio · Phát triển RAW',
    description: 'Tệp mẫu giữ chi tiết vùng tối/sáng chưa kéo Curves dùng để đối chiếu quy trình chỉnh màu.',
    kind: 'photo',
  },
  {
    id: 'grade-after',
    src: '/assets/lessons/after-color-graded.png',
    filename: 'after-color-graded.png',
    title: 'Ảnh phong cảnh sau hậu kỳ Curves & Golden Hour',
    studioLabel: 'Pixel Studio · Chỉnh màu Curves',
    description: 'Kết quả hoàn thiện sau khi tăng tương phản cục bộ, tách tông ấm lạnh bằng Adjustment Layer.',
    kind: 'photo',
  },
  {
    id: 'diag-vector-ws',
    src: '/assets/lessons/diagram-vector-workspace-vi.svg',
    filename: 'diagram-vector-workspace-vi.svg',
    title: 'Sơ đồ không gian làm việc Vector Studio (SVG)',
    studioLabel: 'Vector Studio · Sơ đồ kỹ thuật',
    description: 'Minh họa vị trí Toolbar trái, Artboard trung tâm, Context Toolbar và hệ Panels bên phải.',
    kind: 'diagram',
  },
  {
    id: 'diag-bezier',
    src: '/assets/lessons/diagram-bezier-nodes-vi.svg',
    filename: 'diagram-bezier-nodes-vi.svg',
    title: 'Sơ đồ điểm neo Sharp, Smooth, Smart & tiếp tuyến Bézier (SVG)',
    studioLabel: 'Vector Studio · Kỹ thuật Pen & Node',
    description: 'Phân biệt trực quan nút nhọn (Sharp), nút mượt (Smooth), nút thông minh (Smart) và tay nắm.',
    kind: 'diagram',
  },
  {
    id: 'diag-boolean',
    src: '/assets/lessons/diagram-boolean-ops-vi.svg',
    filename: 'diagram-boolean-ops-vi.svg',
    title: 'Sơ đồ 4 phép toán hình học Boolean chuẩn Vector (SVG)',
    studioLabel: 'Vector Studio · Dựng hình học',
    description: 'So sánh kết quả Cộng (Add), Trừ (Subtract), Giao (Intersect) và Loại trừ phần giao (Xor).',
    kind: 'diagram',
  },
  {
    id: 'diag-pixel-mask',
    src: '/assets/lessons/diagram-pixel-masking-vi.svg',
    filename: 'diagram-pixel-masking-vi.svg',
    title: 'Sơ đồ kiến trúc Layer Mask & Adjustment Layer phi phá hủy (SVG)',
    studioLabel: 'Pixel Studio · Quy trình phi phá hủy',
    description: 'Giải thích cơ chế Đen ẩn / Trắng hiện của mặt nạ lớp tách biệt khỏi dữ liệu điểm ảnh gốc.',
    kind: 'diagram',
  },
  {
    id: 'diag-layout-bleed',
    src: '/assets/lessons/diagram-layout-bleed-vi.svg',
    filename: 'diagram-layout-bleed-vi.svg',
    title: 'Sơ đồ hệ lưới trang đôi Margin, Trim & Bleed 3mm (SVG)',
    studioLabel: 'Layout Studio · Chuẩn chế bản in ấn',
    description: 'Phân định rõ đường an toàn chữ (Margin), kích thước thành phẩm (Trim) và vùng tràn lề Bleed 3mm.',
    kind: 'diagram',
  },
  {
    id: 'diag-mcp',
    src: '/assets/lessons/diagram-mcp-bridge-vi.svg',
    filename: 'diagram-mcp-bridge-vi.svg',
    title: 'Sơ đồ kiến trúc cầu nối JavaScript DOM & Affinity MCP (SVG)',
    studioLabel: 'Tự động hóa · Kiến trúc hệ thống',
    description: 'Luồng lệnh từ trợ lý lập trình qua giao thức MCP và JavaScript DOM tới document Affinity.',
    kind: 'diagram',
  },
  {
    id: 'canva-1',
    src: '/assets/academy/canva-slide-1.png',
    filename: 'canva-slide-1.png',
    title: 'Slide tổng quan Vector Studio (Thiết kế trên Canva)',
    studioLabel: 'Canva Kit · Vector Studio',
    description: 'Tóm tắt trực quan đường cong Bézier, Node Tool và phép toán Boolean dùng ôn tập nhanh.',
    kind: 'slide',
  },
  {
    id: 'canva-2',
    src: '/assets/academy/canva-slide-2.png',
    filename: 'canva-slide-2.png',
    title: 'Slide tổng quan Pixel Studio (Thiết kế trên Canva)',
    studioLabel: 'Canva Kit · Pixel Studio',
    description: 'Tóm tắt tư duy Layer Mask, Curves và quy trình hậu kỳ phi phá hủy chuẩn xuất bản.',
    kind: 'slide',
  },
  {
    id: 'canva-3',
    src: '/assets/academy/canva-slide-3.png',
    filename: 'canva-slide-3.png',
    title: 'Slide tổng quan Layout Studio (Thiết kế trên Canva)',
    studioLabel: 'Canva Kit · Layout Studio',
    description: 'Tóm tắt hệ lưới trang đôi Facing Pages, Typography và chuẩn tràn lề Bleed 3mm.',
    kind: 'slide',
  },
  {
    id: 'canva-4',
    src: '/assets/academy/canva-slide-4.png',
    filename: 'canva-slide-4.png',
    title: 'Slide tổng quan Tự động hóa DOM & MCP (Thiết kế trên Canva)',
    studioLabel: 'Canva Kit · Tự động hóa',
    description: 'Tóm tắt lập trình JavaScript DOM và cầu nối tích hợp hệ thống bên ngoài qua MCP.',
    kind: 'slide',
  },
];

export const ResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gdrive' | 'local'>(() => new URLSearchParams(window.location.search).get('nguon') === 'drive' ? 'gdrive' : 'local');
  const [category, setCategory] = useState<ResourceCategory>('all');
  const [query, setQuery] = useState('');

  const resources = useMemo(() => Object.entries(ALL_CURRICULUM_ASSET_URLS).map(([path, url]) => {
    const filename = path.split('/').pop() ?? path;
    const extension = filename.split('.').pop()?.toLowerCase() ?? 'file';
    const title = filename.replace(/\.[^.]+$/, '').replace(/^[A-Z]\d+_/, '').replaceAll('_', ' ');
    return { path, url, filename, extension, title, category: getCategory(path) };
  }).sort((a, b) => a.filename.localeCompare(b.filename)), []);

  const filtered = resources.filter((item) =>
    (category === 'all' || item.category === category) &&
    `${item.filename} ${item.title} ${item.category} ${item.extension}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thư Viện Tài Nguyên & Học Liệu"
        description="Quản lý và tải về các tệp bài tập, sơ đồ kỹ thuật và tệp đồ họa Affinity. Có thể mở thêm thư mục tệp trên Google Drive."
        badge={activeTab === 'gdrive' ? 'Thư mục Google Drive' : `${resources.length} tài nguyên`}
      />

      {/* Main Tab Switcher: Google Drive Cloud vs Local Assets */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border-hairline)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('gdrive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'gdrive'
              ? 'btn-tactile-cyan text-white shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-white bg-[var(--color-surface)] border border-[var(--color-border-hairline)]'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Google Drive Cloud Hub (Nhúng Đám Mây)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('local')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'local'
              ? 'btn-tactile-cyan text-white shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-white bg-[var(--color-surface)] border border-[var(--color-border-hairline)]'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Tài Liệu Cục Bộ &amp; Sơ Đồ SVG ({resources.length})</span>
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'gdrive' ? (
        <GoogleDriveStorageHub />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm kiếm tài liệu hướng dẫn, tệp mẫu, kịch bản…"
                className="w-full rounded-md border border-[var(--color-border-hairline)] bg-[var(--color-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-cyan-500"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as ResourceCategory)}
              className="rounded-md border border-[var(--color-border-hairline)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)]"
            >
              <option value="all">Tất cả lộ trình</option>
              {Object.entries(categoryLabels).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((item) => {
              const Icon =
                item.extension === 'afphoto'
                  ? FileImage
                  : item.extension === 'js'
                  ? FileCode2
                  : FileText;
              return (
                <article
                  key={item.path}
                  className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 flex flex-col min-h-44"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-md bg-[var(--color-canvas)] p-2 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="rounded border border-[var(--color-border-hairline)] px-2 py-1 text-[10px] uppercase font-mono text-[var(--color-text-secondary)]">
                      .{item.extension}
                    </span>
                  </div>
                  <h2 className="mt-3 text-sm font-semibold capitalize text-[var(--color-text-primary)]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {categoryLabels[item.category]} · {item.filename}
                  </p>
                  <div className="mt-auto pt-4">
                    <a
                      href={item.url}
                      download={item.filename}
                      className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-hairline)] px-3 py-2 text-xs font-medium text-[var(--color-text-primary)] hover:border-cyan-500 hover:text-cyan-400"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải tệp về
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed border-[var(--color-border-hairline)] p-10 text-center text-sm text-[var(--color-text-secondary)]">
              Không tìm thấy tài nguyên nào phù hợp với bộ lọc.
            </div>
          )}

          {/* Visual Studio Plates, Technical SVG Diagrams & Canva Reference Slides */}
          <section className="pt-6 border-t border-[var(--color-border-hairline)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
                  Học liệu trực quan · Ảnh mẫu &amp; Sơ đồ kỹ thuật
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                  Bộ Ảnh Mẫu &amp; Sơ Đồ Kỹ Thuật Thực Hành
                </h2>
              </div>
              <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                {VISUAL_PRACTICE_ASSETS.length} học liệu đồ họa sẵn sàng tải về
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {VISUAL_PRACTICE_ASSETS.map((asset) => (
                <article
                  key={asset.id}
                  className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] overflow-hidden flex flex-col"
                >
                  <div className="h-44 w-full bg-[#090b10] border-b border-[var(--color-border-hairline)] overflow-hidden">
                    <img
                      src={asset.src}
                      alt={asset.title}
                      className={
                        asset.kind === 'diagram'
                          ? 'h-full w-full object-contain p-2'
                          : 'h-full w-full object-cover'
                      }
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      {asset.studioLabel}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold text-[var(--color-text-primary)] leading-snug">
                      {asset.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {asset.description}
                    </p>
                    <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-[var(--color-text-secondary)] truncate">
                        {asset.filename}
                      </span>
                      <a
                        href={asset.src}
                        download={asset.filename}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] hover:border-cyan-500 hover:text-cyan-400 transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Tải ảnh về
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
