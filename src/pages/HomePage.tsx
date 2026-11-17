import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Compass,
  Download,
  Layers,
  PenTool,
  Play,
  Sliders,
  Sparkles,
  Terminal,
  Trophy,
} from 'lucide-react';
import type { AffinityTrackId } from '@/types/design-system';
import { useLearningProgress } from '@/lib/learning-store';
import { BeforeAfterSlider } from '@/components/common/BeforeAfterSlider';

export interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectTrack?: (trackId: AffinityTrackId) => void;
  onLaunchLesson?: (lessonId: string) => void;
}

interface StudioCardMeta {
  id: AffinityTrackId;
  name: string;
  studioTag: string;
  accentClass: string;
  borderHoverClass: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  tools: string[];
}

const STUDIO_CARDS: StudioCardMeta[] = [
  {
    id: 'designer',
    name: 'Vector Studio',
    studioTag: 'Đồ họa Vector & Minh họa',
    accentClass: 'text-cyan-400',
    borderHoverClass: 'hover:border-cyan-400/50',
    imageSrc: '/assets/academy/studio-vector-art.png',
    imageAlt: 'Tác phẩm minh họa hình học chuẩn xác trong Vector Studio',
    description:
      'Làm chủ đường cong Bézier với Pen Tool, Node Tool, hệ lưới Artboard và phép toán Boolean để dựng logo và biểu tượng chuẩn xuất bản.',
    tools: ['Pen Tool (P)', 'Node Tool (A)', 'Shape Builder', 'Artboards'],
  },
  {
    id: 'photo',
    name: 'Pixel Studio',
    studioTag: 'Hậu kỳ ảnh & Chỉnh sửa RAW',
    accentClass: 'text-blue-400',
    borderHoverClass: 'hover:border-blue-400/50',
    imageSrc: '/assets/academy/studio-pixel-retouch.png',
    imageAlt: 'Ảnh ghép thương mại ánh sáng studio trong Pixel Studio',
    description:
      'Thực hành chỉnh sửa ảnh phi phá hủy bằng Layer Mask, Adjustment Layers, Curves và tách nền Refine Selection giữ trọn từng sợi tóc.',
    tools: ['Layer Mask', 'Curves & Levels', 'Refine Selection', 'Live Filters'],
  },
  {
    id: 'publisher',
    name: 'Layout Studio',
    studioTag: 'Dàn trang & Chế bản In ấn',
    accentClass: 'text-rose-400',
    borderHoverClass: 'hover:border-rose-400/50',
    imageSrc: '/assets/academy/studio-layout-editorial.png',
    imageAlt: 'Tạp chí dàn trang mở đôi với hệ lưới chuẩn trong Layout Studio',
    description:
      'Thiết kế sách, tạp chí và catalogue chuyên nghiệp với Master Pages, Paragraph Styles, luồng chữ Picture Frame và chuẩn tràn lề Bleed 3mm.',
    tools: ['Master Pages', 'Picture Frame', 'Baseline Grid', 'Preflight Bleed'],
  },
  {
    id: 'scripting',
    name: 'Tự động hóa DOM & MCP',
    studioTag: 'Lập trình JavaScript DOM',
    accentClass: 'text-emerald-400',
    borderHoverClass: 'hover:border-emerald-400/50',
    imageSrc: '/assets/academy/studio-automation-dom.png',
    imageAlt: 'Sơ đồ mạng lưới tạo trang hàng loạt bằng JavaScript DOM',
    description:
      'Viết script điều khiển cấu trúc tài liệu qua JavaScript DOM, chuẩn hóa đặt tên Layer hàng loạt và kết nối quy trình MCP an toàn.',
    tools: ['JavaScript DOM', 'Batch Export', 'Layer Tree', 'MCP Bridge'],
  },
];

const CANVA_SLIDES = [
  {
    id: 'slide-1',
    src: '/assets/academy/canva-slide-1.png',
    title: 'Tổng quan Vector Studio',
    caption: 'Đường cong Bézier, Node Tool & Boolean',
  },
  {
    id: 'slide-2',
    src: '/assets/academy/canva-slide-2.png',
    title: 'Tổng quan Pixel Studio',
    caption: 'Layer Mask, Curves & hậu kỳ phi phá hủy',
  },
  {
    id: 'slide-3',
    src: '/assets/academy/canva-slide-3.png',
    title: 'Tổng quan Layout Studio',
    caption: 'Hệ lưới trang đôi, Typography & Bleed 3mm',
  },
  {
    id: 'slide-4',
    src: '/assets/academy/canva-slide-4.png',
    title: 'Tổng quan Tự động hóa',
    caption: 'Lập trình JavaScript DOM & cầu nối MCP',
  },
];

const TECHNICAL_DIAGRAMS = [
  {
    id: 'diag-ws',
    src: '/assets/lessons/diagram-vector-workspace-vi.svg',
    label: 'Không gian Vector Studio',
  },
  {
    id: 'diag-bezier',
    src: '/assets/lessons/diagram-bezier-nodes-vi.svg',
    label: 'Điểm neo & Tiếp tuyến Bézier',
  },
  {
    id: 'diag-boolean',
    src: '/assets/lessons/diagram-boolean-ops-vi.svg',
    label: '4 phép toán hình học Boolean',
  },
  {
    id: 'diag-mask',
    src: '/assets/lessons/diagram-pixel-masking-vi.svg',
    label: 'Cơ chế Layer Mask & Adjustment',
  },
  {
    id: 'diag-bleed',
    src: '/assets/lessons/diagram-layout-bleed-vi.svg',
    label: 'Hệ lưới Margin, Trim & Bleed 3mm',
  },
  {
    id: 'diag-mcp',
    src: '/assets/lessons/diagram-mcp-bridge-vi.svg',
    label: 'Kiến trúc JavaScript DOM & MCP',
  },
];

const DESIGN_THINKING_STEPS = [
  { num: '01', name: 'Khám phá', desc: 'Đọc đúng yêu cầu, đối tượng người xem và bối cảnh sử dụng tác phẩm.' },
  { num: '02', name: 'Định nghĩa', desc: 'Xác lập thông số trang, hệ màu RGB/CMYK và mục tiêu thị giác cốt lõi.' },
  { num: '03', name: 'Thử nghiệm', desc: 'Phác thảo nhanh nhiều phương án bố cục, phông chữ và hướng xử lý ánh sáng.' },
  { num: '04', name: 'Lập kế hoạch', desc: 'Chọn đúng Studio, cấu trúc Layer sạch và quy trình không phá hủy dữ liệu gốc.' },
  { num: '05', name: 'Tạo tác phẩm', desc: 'Thực thi chính xác trên Artboard bằng công cụ Affinity phù hợp bài toán.' },
  { num: '06', name: 'Đánh giá', desc: 'Soi độ tương phản, căn lề, tỷ lệ chữ và rà soát lỗi qua công cụ kiểm tra.' },
  { num: '07', name: 'Tinh chỉnh', desc: 'Cải tiến chi tiết dựa trên tiêu chí kỹ thuật thay vì chỉnh cảm tính.' },
  { num: '08', name: 'Bàn giao', desc: 'Xuất file nguồn chỉnh sửa được cùng ấn phẩm Web/In ấn chuẩn thông số.' },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectTrack,
  onLaunchLesson,
}) => {
  const { completedCount, totalLessonsCount, activeStreakDays, getTrackProgress } =
    useLearningProgress();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleTrackClick = (trackId: AffinityTrackId) => {
    if (onSelectTrack) {
      onSelectTrack(trackId);
    } else {
      onNavigate('catalog');
    }
  };

  const handleStartFirstLesson = () => {
    if (onLaunchLesson) {
      onLaunchLesson('D01-01');
    } else {
      onNavigate('catalog');
    }
  };

  const activeSlide = CANVA_SLIDES[activeSlideIndex];

  return (
    <div className="w-full space-y-20 pb-8 font-nunito">
      {/* 1. GRAPHIC STUDIO HERO SECTION (Single AppShell Header above) */}
      <section className="relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-surface via-canvas to-obsidian p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Học viện Đồ họa Affinity · Tư duy thiết kế &amp; Thực hành</span>
            </div>

            <h1 className="font-kanit text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              Làm chủ bộ công cụ{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-amber-300 bg-clip-text text-transparent">
                Affinity Studio
              </span>{' '}
              từ tư duy gốc tới sản phẩm thật
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
              Nền tảng đào tạo thực chiến bằng tiếng Việt cho Vector Studio, Pixel Studio, Layout
              Studio và Tự động hóa JavaScript DOM. Học cách phân tích bài toán thiết kế trước khi
              bấm công cụ, thực hành trực tiếp trên bộ mô phỏng và đồ án độc lập.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleStartFirstLesson}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-4 h-4 fill-zinc-950" />
                <span>Học thử bài D01 ngay</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-5 py-3 text-sm font-semibold text-zinc-100 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Xem {totalLessonsCount} bài giảng</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('simulator')}
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-canvas/80 px-4 py-3 text-sm font-medium text-zinc-300 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Bộ mô phỏng</span>
              </button>
            </div>

            {/* Live Progress & Platform Telemetry Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-hairline">
              <div className="rounded-lg bg-canvas/70 border border-hairline p-3">
                <div className="text-[11px] font-mono text-zinc-400">Tiến độ của bạn</div>
                <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
                  {completedCount}/{totalLessonsCount} bài
                </div>
              </div>
              <div className="rounded-lg bg-canvas/70 border border-hairline p-3">
                <div className="text-[11px] font-mono text-zinc-400">Hệ đào tạo</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">4 Studio</div>
              </div>
              <div className="rounded-lg bg-canvas/70 border border-hairline p-3">
                <div className="text-[11px] font-mono text-zinc-400">Chuỗi ngày học</div>
                <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">
                  {activeStreakDays > 0 ? `${activeStreakDays} ngày` : 'Sẵn sàng'}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Graphic Showcase Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden rounded-xl border border-hairline bg-obsidian shadow-2xl">
              <img
                src="/assets/academy/hero-studio-showcase.png"
                alt="Không gian thiết kế đồ họa Affinity Academy với đường cong Bézier và bảng màu chuẩn CMYK"
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                <div className="rounded-lg bg-obsidian/90 backdrop-blur-md border border-hairline px-3 py-1.5 text-xs font-mono text-zinc-200 flex items-center gap-2">
                  <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pen Tool · Bézier &amp; Boolean chuẩn Vector</span>
                </div>
                <div className="rounded-lg bg-obsidian/90 backdrop-blur-md border border-amber-400/30 px-3 py-1.5 text-xs font-mono text-amber-200 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>RAW Curves &amp; Bleed 3mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE BEFORE / AFTER PIXEL STUDIO COMPARISON */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              Thực nghiệm trực quan · Pixel Studio
            </span>
            <h2 className="font-kanit text-2xl sm:text-3xl font-bold text-white">
              Đối chiếu ảnh gốc RAW và hậu kỳ phi phá hủy bằng thanh kéo
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Thay vì chỉnh sửa đè trực tiếp lên điểm ảnh gốc, quy trình Affinity dùng Adjustment
              Layers và Layer Mask giúp bạn thử nghiệm hàng chục phương án màu sắc mà luôn an toàn
              dữ liệu.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleTrackClick('photo')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 shrink-0"
          >
            <span>Khám phá lộ trình Pixel Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <BeforeAfterSlider
              beforeSrc="/assets/lessons/before-color-raw.png"
              afterSrc="/assets/lessons/after-color-graded.png"
              beforeLabel="Trước: Ảnh gốc RAW phẳng"
              afterLabel="Sau: Curves & Tách tông ấm lạnh"
            />
          </div>

          <div className="lg:col-span-4 space-y-3">
            <div className="rounded-xl border border-hairline bg-surface p-5 space-y-2">
              <div className="text-xs font-mono text-cyan-400">01 · Curves &amp; White Balance</div>
              <h3 className="text-sm font-bold text-zinc-100">Cân bằng dải tương phản</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Kéo điểm tối về sâu và nâng vùng nắng đỉnh núi bằng đường cong chữ S nhẹ mà không làm
                cháy chi tiết mây trời.
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-surface p-5 space-y-2">
              <div className="text-xs font-mono text-blue-400">02 · HSL &amp; Color Balance</div>
              <h3 className="text-sm font-bold text-zinc-100">Tách tương phản màu ấm – lạnh</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Giữ sắc xanh ngọc trầm dưới mặt hồ để làm nổi bật ánh nắng vàng hổ phách trên vách
                đá.
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-surface p-5 space-y-2">
              <div className="text-xs font-mono text-amber-400">03 · Layer Mask chọn vùng</div>
              <h3 className="text-sm font-bold text-zinc-100">Tác động đúng vùng cần thiết</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dùng cọ đen – trắng trên mặt nạ của Adjustment Layer để tăng độ nổi khối riêng ở tiền
                cảnh và rặng thông.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE AFFINITY STUDIO CARDS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Hệ thống lộ trình thực chiến
            </span>
            <h2 className="font-kanit text-2xl sm:text-3xl font-bold text-white mt-1">
              4 Không gian sáng tạo cốt lõi trong Affinity Academy
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-cyan-400"
          >
            <span>Mở toàn bộ danh mục khóa học</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {STUDIO_CARDS.map((studio) => {
            const progress = getTrackProgress(studio.id);
            return (
              <article
                key={studio.id}
                onClick={() => handleTrackClick(studio.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleTrackClick(studio.id);
                  }
                }}
                className={`group flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface transition-all duration-200 cursor-pointer ${studio.borderHoverClass}`}
              >
                <div className="h-44 w-full overflow-hidden bg-obsidian border-b border-hairline">
                  <img
                    src={studio.imageSrc}
                    alt={studio.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <span className={`text-[11px] font-mono uppercase tracking-wider ${studio.accentClass}`}>
                    {studio.studioTag}
                  </span>
                  <h3 className="font-kanit text-xl font-bold text-white">{studio.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed flex-1">{studio.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {studio.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded border border-hairline bg-canvas px-2 py-0.5 text-[10px] font-mono text-zinc-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-hairline space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-400">
                        {progress.completed}/{progress.total} bài hoàn thành
                      </span>
                      <span className={studio.accentClass}>{progress.percentage}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. CANVA OVERVIEW DECK & VIETNAMESE TECHNICAL SVG DIAGRAMS */}
      <section className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Bộ slide Canva Studio &amp; Sơ đồ kỹ thuật SVG
            </span>
            <h2 className="font-kanit text-2xl sm:text-3xl font-bold text-white">
              Trực quan hóa cấu trúc công cụ bằng hình vẽ và sơ đồ tiếng Việt
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('resources')}
            className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-canvas px-4 py-2.5 text-xs font-semibold text-zinc-100 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors shrink-0"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Mở kho ảnh mẫu &amp; sơ đồ tải về</span>
          </button>
        </div>

        {/* Interactive Canva 4-Slide Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 overflow-hidden rounded-xl border border-hairline bg-obsidian">
            <img
              src={activeSlide.src}
              alt={`${activeSlide.title} — ${activeSlide.caption}`}
              className="w-full aspect-[16/9] object-cover"
            />
          </div>

          <div className="lg:col-span-4 space-y-2.5">
            {CANVA_SLIDES.map((slide, index) => {
              const isSelected = index === activeSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(index)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-cyan-400/60 bg-canvas shadow-md'
                      : 'border-hairline bg-canvas/40 hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-cyan-400">
                      Slide 0{index + 1} · Canva Studio Kit
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{slide.title}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{slide.caption}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 SVG Technical Diagrams Strip */}
        <div className="space-y-3 pt-4 border-t border-hairline">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            6 sơ đồ giải phẫu kỹ thuật kèm trong bài giảng
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECHNICAL_DIAGRAMS.map((diag) => (
              <div
                key={diag.id}
                className="overflow-hidden rounded-lg border border-hairline bg-[#090b10] flex flex-col"
              >
                <div className="aspect-[16/10] w-full p-2">
                  <img
                    src={diag.src}
                    alt={diag.label}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="px-3.5 py-2.5 border-t border-hairline text-xs font-medium text-zinc-200 bg-canvas/70">
                  {diag.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 8-STEP DESIGN THINKING CYCLE */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            Phương pháp đào tạo cốt lõi
          </span>
          <h2 className="font-kanit text-2xl sm:text-3xl font-bold text-white">
            Chu trình tư duy thiết kế 8 bước trước khi bấm công cụ
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Mỗi bài học tại Affinity Academy đều đi qua đủ chu trình từ phân tích bài toán tới đánh
            giá kết quả, giúp bạn tự giải quyết yêu cầu thực tế thay vì chỉ làm theo video mẫu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESIGN_THINKING_STEPS.map((step) => (
            <div
              key={step.num}
              className="rounded-xl border border-hairline bg-surface p-5 space-y-2 hover:border-emerald-400/40 transition-colors"
            >
              <span className="inline-block font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-0.5">
                Bước {step.num}
              </span>
              <h3 className="text-base font-bold text-white">{step.name}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INTERACTIVE TOOLS QUICK ACCESS & CLEAN FOOTER */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('simulator')}
          className="text-left rounded-xl border border-hairline bg-surface p-5 hover:border-cyan-400/50 transition-colors space-y-2"
        >
          <Layers className="w-5 h-5 text-cyan-400" />
          <div className="text-sm font-bold text-white">Bộ Mô Phỏng Studio</div>
          <p className="text-xs text-zinc-400">
            Thực hành Pen &amp; Node, ghép ảnh Layer Mask và dựng hệ lưới tràn lề trên Canvas.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('challenges')}
          className="text-left rounded-xl border border-hairline bg-surface p-5 hover:border-amber-400/50 transition-colors space-y-2"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
          <div className="text-sm font-bold text-white">Thử Thách Độc Lập</div>
          <p className="text-xs text-zinc-400">
            Bài tập tình huống không cầm tay chỉ việc để rèn phản xạ tự chọn công cụ đúng.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('encyclopedia')}
          className="text-left rounded-xl border border-hairline bg-surface p-5 hover:border-rose-400/50 transition-colors space-y-2"
        >
          <BookOpen className="w-5 h-5 text-rose-400" />
          <div className="text-sm font-bold text-white">Bách Khoa Thư &amp; Phím Tắt</div>
          <p className="text-xs text-zinc-400">
            Tra cứu nhanh tên công cụ tiếng Anh, chức năng thực tế và phím tắt Windows / macOS.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('capstone')}
          className="text-left rounded-xl border border-hairline bg-surface p-5 hover:border-emerald-400/50 transition-colors space-y-2"
        >
          <Award className="w-5 h-5 text-emerald-400" />
          <div className="text-sm font-bold text-white">Đồ Án Tốt Nghiệp</div>
          <p className="text-xs text-zinc-400">
            Tổng hợp hồ sơ thiết kế theo 4 tiêu chí kiểm định chuẩn mực và phản biện thiết kế.
          </p>
        </button>
      </section>

      {/* Clean Capitalized Footer */}
      <footer className="border-t border-hairline pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs text-zinc-400">
        <div className="space-y-1">
          <div className="font-mono font-bold tracking-wider uppercase text-zinc-200">
            AFFINITY <span className="text-amber-400">ACADEMY</span>
          </div>
          <p className="text-zinc-400">
            Học Viện Đào Tạo Đồ Họa Vector Studio, Pixel Studio, Layout Studio &amp; Tự Động Hóa DOM
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-medium text-zinc-300">
          <button type="button" onClick={() => onNavigate('catalog')} className="hover:text-cyan-400">
            Danh Mục Khóa Học
          </button>
          <button type="button" onClick={() => onNavigate('simulator')} className="hover:text-cyan-400">
            Bộ Mô Phỏng
          </button>
          <button type="button" onClick={() => onNavigate('playground')} className="hover:text-cyan-400">
            <span className="inline-flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Thực Hành Tự Động Hóa
            </span>
          </button>
          <button type="button" onClick={() => onNavigate('resources')} className="hover:text-cyan-400">
            Kho Học Liệu
          </button>
          <button type="button" onClick={() => onNavigate('dashboard')} className="hover:text-cyan-400">
            Hồ Sơ Học Tập
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
