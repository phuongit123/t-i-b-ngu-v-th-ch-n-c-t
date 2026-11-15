import React from 'react';
import { Play, ChevronRight, ArrowUpRight } from 'lucide-react';
import type { AffinityTrackId } from '@/types/design-system';

export interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectTrack?: (trackId: AffinityTrackId) => void;
  onLaunchLesson?: (lessonId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectTrack,
  onLaunchLesson,
}) => {
  const handleTrackClick = (trackId: AffinityTrackId) => {
    if (onSelectTrack) {
      onSelectTrack(trackId);
    } else {
      onNavigate('catalog');
    }
  };

  return (
    <div className="bg-[#191d1d] text-white w-full overflow-x-hidden font-nunito selection:bg-white selection:text-black">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Figma node 101:189)
      ───────────────────────────────────────────────────────────── */}
      <header className="relative z-30 max-w-[1440px] mx-auto px-6 sm:px-12 pt-8 pb-6 flex items-center justify-between">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group focus-visible:outline-none"
        >
          <span className="font-kanit font-medium text-white text-[18px] sm:text-[20px] tracking-[6.88px] uppercase group-hover:text-zinc-300 transition-colors">
            AFFINITY ACADEMY
          </span>
        </button>

        {/* Center Menu Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          <button
            onClick={() => onNavigate('home')}
            className="font-nunito text-[16px] text-white transition-colors hover:text-zinc-300 capitalize"
          >
            Trang chủ
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="font-nunito text-[16px] text-zinc-400 transition-colors hover:text-white capitalize"
          >
            Lộ trình học
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="font-nunito text-[16px] text-zinc-400 transition-colors hover:text-white capitalize"
          >
            Phòng thực hành
          </button>
          <button
            onClick={() => onNavigate('encyclopedia')}
            className="font-nunito text-[16px] text-zinc-400 transition-colors hover:text-white capitalize"
          >
            Bách khoa thư
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className="font-nunito text-[16px] text-zinc-400 transition-colors hover:text-white capitalize"
          >
            Tài nguyên
          </button>
        </nav>

        {/* Header Right Action Button */}
        <button
          onClick={() => onNavigate('catalog')}
          className="px-7 py-2.5 rounded-[100px] border border-[#6d7d7d] text-white font-kanit text-[14px] sm:text-[15px] tracking-[4px] uppercase hover:bg-white hover:text-[#191d1d] hover:border-white transition-all duration-300"
        >
          BẮT ĐẦU NGAY
        </button>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (Figma node 101:180)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Mood Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/interia/bg-hero.jpg"
            alt="Affinity Academy Studio"
            className="w-full h-full object-cover object-center opacity-85 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#191d1d]/90 via-[#191d1d]/60 to-[#191d1d]/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#191d1d]/70" />
        </div>

        {/* Rotated Swipe Down Indicator (Figma 101:188) */}
        <div className="hidden lg:flex absolute left-8 xl:left-16 bottom-20 z-10 items-center gap-4 -rotate-90 origin-left">
          <span className="font-kanit text-white/70 text-[14px] tracking-[6.88px] uppercase whitespace-nowrap">
            CUỘN XUỐNG
          </span>
          <div className="w-12 h-px bg-white/40" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-12 py-20 flex flex-col items-end">
          <div className="max-w-[620px] w-full text-left space-y-6">
            <h1 className="font-kanit font-normal text-[36px] sm:text-[44px] lg:text-[48px] text-white leading-[1.15] tracking-tight">
              Làm chủ công cụ. Tư duy như nhà thiết kế.
            </h1>
            <p className="font-nunito font-normal text-[16px] sm:text-[18px] text-zinc-300 leading-relaxed">
              Khám phá hệ sinh thái Affinity qua ba studio chuyên biệt: Layout Studio, Vector Studio và Pixel Studio. Rèn luyện sự chuẩn xác kỹ thuật, năng lực thẩm mỹ và quy trình thiết kế độc lập chuẩn quốc tế.
            </p>

            {/* Play Button & Interactive Lab CTA (Figma 101:185) */}
            <div className="pt-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate('simulator')}
                  className="group relative size-[68px] rounded-full border border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center hover:border-white hover:scale-105 transition-all duration-300"
                  aria-label="Khởi chạy phòng thí nghiệm mô phỏng"
                >
                  <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors animate-pulse" />
                  <Play className="w-6 h-6 text-white fill-white ml-0.5 group-hover:scale-110 transition-transform" />
                </button>

                <div className="flex flex-col">
                  <span className="font-kanit text-[15px] text-white tracking-[4px] uppercase">
                    PHÒNG MÔ PHỎNG
                  </span>
                  <span className="text-[13px] text-zinc-400 font-nunito">
                    Thực hành Bézier Pen &amp; Node Tool
                  </span>
                </div>
              </div>

              {onLaunchLesson && (
                <button
                  onClick={() => onLaunchLesson('D01-01')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[100px] border border-white/20 bg-white/5 hover:bg-white/15 text-white font-kanit text-[13px] tracking-[3px] uppercase transition-all"
                >
                  <span>BÀI HỌC MẪU</span>
                  <ArrowUpRight className="size-3.5 text-white/70" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SECTION 1: ABOUT (Figma node 101:176)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pt-28 pb-16">
        <div className="space-y-4">
          <p className="font-kanit text-[#6d7d7d] text-[16px] tracking-[6.88px] uppercase">
            GIỚI THIỆU
          </p>
          <h2 className="font-kanit font-normal text-[32px] sm:text-[40px] text-white leading-tight max-w-[950px]">
            Từ làm chủ công cụ đến tư duy của một nhà thiết kế thực thụ
          </h2>
          <p className="font-nunito text-[16px] text-[#6d7d7d] leading-relaxed max-w-[620px] pt-2">
            Lộ trình học tập bài bản giúp bạn hiểu rõ nguyên lý hoạt động của từng công cụ, lựa chọn quy trình làm việc tối ưu, kiểm chứng các quyết định thị giác và hoàn thiện tác phẩm qua phản biện và lặp lại.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECTION 2: STATS & IMAGES (Figma node 101:160)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3 Image Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Image 1: Pen & Vector Geometry */}
            <div className="h-[360px] sm:h-[442px] overflow-hidden bg-zinc-900 group">
              <img
                src="/assets/interia/about-img1.png"
                alt="Thực hành thiết kế vector"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Image 2: Photo Retouch & HDR */}
            <div className="h-[360px] sm:h-[442px] overflow-hidden bg-zinc-900 group">
              <img
                src="/assets/interia/about-img2.png"
                alt="Thực hành chỉnh sửa ảnh điểm ảnh"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Image 3: Publisher Spreads with asymmetrical radius */}
            <div className="h-[240px] sm:h-[260px] rounded-tr-[50px] overflow-hidden bg-zinc-900 group">
              <img
                src="/assets/interia/about-img3.png"
                alt="Dàn trang tạp chí Affinity Publisher"
                className="w-full h-full object-cover rounded-tr-[50px] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right: Metrics & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-4 space-y-12">
            <div className="space-y-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="w-full sm:w-auto px-8 py-3 rounded-[100px] border border-[#6d7d7d] text-white font-kanit text-[15px] tracking-[6.88px] uppercase hover:bg-white hover:text-[#191d1d] hover:border-white transition-all duration-300"
              >
                KHÁM PHÁ NGAY
              </button>
            </div>

            {/* 3 Metric counters */}
            <div className="grid grid-cols-3 gap-4 border-t border-[#6d7d7d]/30 pt-8">
              <div>
                <p className="font-kanit text-[#6d7d7d] text-[36px] sm:text-[40px] leading-none">
                  66
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  BÀI HỌC HIỆN CÓ
                </p>
              </div>

              <div>
                <p className="font-kanit text-[#6d7d7d] text-[36px] sm:text-[40px] leading-none">
                  120
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  BÀI KẾ HOẠCH
                </p>
              </div>

              <div>
                <p className="font-kanit text-[#6d7d7d] text-[36px] sm:text-[40px] leading-none">
                  3
                </p>
                <p className="font-kanit text-white text-[13px] sm:text-[14px] tracking-[4px] uppercase mt-2">
                  STUDIO CỐT LÕI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION 3: CALLOUT BANNER (Figma node 101:150)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-28">
        <div className="relative bg-[#212828] rounded-bl-[50px] rounded-tl-[50px] rounded-tr-[50px] overflow-hidden p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 border border-white/5 shadow-2xl">
          {/* Subtle Decorative Circle */}
          <div className="absolute -left-20 -top-20 size-[320px] rounded-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-[560px]">
            <h3 className="font-kanit font-normal text-[32px] sm:text-[40px] text-white leading-tight">
              Hòa quyện kỹ thuật vector chính xác với tư duy thiết kế và tự động hóa thông minh
            </h3>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => onNavigate('catalog')}
              className="px-9 py-3.5 rounded-[100px] border border-[#6d7d7d] text-white font-kanit text-[15px] tracking-[6.88px] uppercase hover:bg-white hover:text-[#191d1d] hover:border-white transition-all duration-300"
            >
              BẮT ĐẦU THỰC HÀNH NGAY
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECTION 4: THE DESIGN-THINKING PROCESS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-24">
        <div className="max-w-[760px] space-y-4 mb-12">
          <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[6px] uppercase">Quy trình làm việc chuẩn mực</p>
          <h2 className="font-kanit text-[32px] sm:text-[40px] text-white leading-tight">Tư duy thiết kế, không đơn thuần ghi nhớ phím bấm</h2>
          <p className="font-nunito text-[16px] text-zinc-400 leading-relaxed">
            Mỗi bài tập đều dẫn dắt từ thấu hiểu yêu cầu (brief) đến tạo tác kết quả hoàn thiện. Người học rèn luyện cách giải thích lựa chọn của mình, kiểm chứng chất lượng và điều chỉnh khi thiết kế chưa đáp ứng bài toán.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['01', 'Khám phá (Discover)', 'Thấu hiểu đối tượng, bối cảnh và các ràng buộc cốt lõi.'],
            ['02', 'Định nghĩa (Define)', 'Chuyển hóa đề bài thành bài toán thiết kế cụ thể, đo lường được.'],
            ['03', 'Khảo sát (Explore)', 'So sánh các hướng giải pháp thị giác trước khi cam kết triển khai.'],
            ['04', 'Lập kế hoạch (Plan)', 'Lựa chọn công cụ, chuẩn bị tài nguyên và sắp xếp trình tự thực thi.'],
            ['05', 'Sáng tạo (Create)', 'Xây dựng tác phẩm với sự kiểm soát lớp, đối tượng và bố cục.'],
            ['06', 'Đánh giá (Evaluate)', 'Kiểm tra phân cấp thị giác, tính rõ ràng, nhất quán và tiêu chuẩn xuất bản.'],
            ['07', 'Lặp lại (Iterate)', 'Vận dụng phản biện thị giác và bằng chứng để cải tiến tác phẩm.'],
            ['08', 'Bàn giao (Deliver)', 'Đóng gói file gốc chỉnh sửa được và xuất bản đúng định dạng kỹ thuật.'],
          ].map(([step, title, description]) => (
            <article key={step} className="min-h-[170px] border border-white/10 bg-[#202626] p-5 sm:p-6">
              <span className="font-mono text-xs text-[#9aa9a7]">{step}</span>
              <h3 className="font-kanit text-lg text-white mt-4">{title}</h3>
              <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-2">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. SECTION 5: CURRENT AFFINITY STUDIOS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div className="space-y-3">
            <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[6px] uppercase">Không gian làm việc phần mềm</p>
            <h2 className="font-kanit text-[30px] sm:text-[36px] text-white">Ba Studio, ba vai trò chuyên biệt</h2>
          </div>
          <p className="font-nunito text-sm text-zinc-400 max-w-[440px] leading-relaxed">
            Layout, Vector và Pixel là ba studio cốt lõi trong phạm vi đào tạo. Nhánh Scripting và MCP được thiết kế như một hợp phần tự động hóa độc lập.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { number: '01', title: 'Layout Studio', subtitle: 'Dàn trang & Xuất bản', detail: 'Cấu trúc trang đôi, hệ lưới, phân cấp kiểu chữ và tài liệu nhiều trang.' },
            { number: '02', title: 'Vector Studio', subtitle: 'Đường cong & Hình học', detail: 'Khởi tạo và tinh chỉnh đường vẽ, node, đường cong Bézier và hình học.' },
            { number: '03', title: 'Pixel Studio', subtitle: 'Hình ảnh & Mặt nạ (Masking)', detail: 'Làm việc với pixel layer, vùng chọn chuẩn xác, mặt nạ và cân chỉnh dải màu.' },
            { number: '04', title: 'Automation & MCP', subtitle: 'Tự động hóa & Scripting', detail: 'Nắm vững quy trình lập trình DOM V8 và giới hạn tích hợp MCP.' },
          ].map((studio) => (
            <article key={studio.number} className="border border-white/10 bg-[#202626] p-6 min-h-[210px]">
              <span className="font-mono text-xs text-[#9aa9a7]">{studio.number}</span>
              <h3 className="font-kanit text-2xl text-white mt-4">{studio.title}</h3>
              <p className="font-kanit text-[11px] tracking-[2px] text-[#9aa9a7] uppercase mt-1">{studio.subtitle}</p>
              <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-4">{studio.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. SECTION 6: LEARNING PATHS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-24">
        <div className="mb-8 space-y-3">
          <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[6px] uppercase">Lộ trình học tập</p>
          <h2 className="font-kanit text-[30px] sm:text-[36px] text-white">Chọn chuyên ngành, rèn luyện tư duy độc lập</h2>
        </div>
        <div className="divide-y divide-[#6d7d7d]/30">
          <div className="py-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-5">
              <h3 className="font-kanit text-[28px] sm:text-[34px] text-white group-hover:text-amber-100 transition-colors">01. Thiết kế Vector (Vector Design)</h3>
              <p className="font-kanit text-[#9aa9a7] text-[12px] tracking-[3px] uppercase mt-2">Vector Studio · Lộ trình Designer</p>
            </div>
            <div className="md:col-span-7 space-y-4">
              <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Thực hành vẽ đường cong Bézier, tinh chỉnh node, hình học Boolean và artboards. Hiểu rõ nguyên lý lựa chọn công cụ thay vì làm theo máy móc.</p>
              <button onClick={() => handleTrackClick('designer')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Khám phá lộ trình Vector <ChevronRight className="size-4" /></button>
            </div>
          </div>
          <div className="py-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-5">
              <h3 className="font-kanit text-[28px] sm:text-[34px] text-white group-hover:text-blue-100 transition-colors">02. Xử lý Điểm ảnh (Pixel Editing)</h3>
              <p className="font-kanit text-[#9aa9a7] text-[12px] tracking-[3px] uppercase mt-2">Pixel Studio · Lộ trình Photo</p>
            </div>
            <div className="md:col-span-7 space-y-4">
              <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Làm việc với layer, vùng chọn, mặt nạ phi phá hủy (masking), cân chỉnh dải sắc độ và màu sắc. Diễn giải và kiểm tra kết quả qua từng bước xử lý.</p>
              <button onClick={() => handleTrackClick('photo')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Khám phá lộ trình Pixel <ChevronRight className="size-4" /></button>
            </div>
          </div>
          <div className="py-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-5">
              <h3 className="font-kanit text-[28px] sm:text-[34px] text-white group-hover:text-purple-100 transition-colors">03. Dàn trang &amp; Xuất bản (Layout &amp; Publishing)</h3>
              <p className="font-kanit text-[#9aa9a7] text-[12px] tracking-[3px] uppercase mt-2">Layout Studio · Lộ trình Publisher</p>
            </div>
            <div className="md:col-span-7 space-y-4">
              <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Khám phá cấu trúc trang, hệ lưới, phân cấp kiểu chữ, trang Master và tiêu chuẩn xuất bản in ấn. Nhánh này hiện có các bài pilot kiểm định; các module tiếp theo đang trong cổng kiểm soát.</p>
              <button onClick={() => handleTrackClick('publisher')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Khám phá lộ trình Layout <ChevronRight className="size-4" /></button>
            </div>
          </div>
          <div className="py-9 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group">
            <div className="md:col-span-5">
              <h3 className="font-kanit text-[28px] sm:text-[34px] text-white group-hover:text-emerald-100 transition-colors">04. Tự động hóa &amp; Scripting</h3>
              <p className="font-kanit text-[#9aa9a7] text-[12px] tracking-[3px] uppercase mt-2">Nhánh Tự động hóa Chuyên biệt</p>
            </div>
            <div className="md:col-span-7 space-y-4">
              <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Thấu hiểu khái niệm lập trình tự động hóa, giải quyết các tác vụ sản xuất lặp lại và ranh giới tích hợp MCP. Coi mã lệnh là trợ lực cho thiết kế, không thay thế cho tư duy thị giác.</p>
              <button onClick={() => handleTrackClick('scripting')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Khám phá lộ trình Tự động hóa <ChevronRight className="size-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. SECTION 7: FULL-BLEED GALLERY STRIP (Figma node 101:70)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[360px] sm:h-[440px] lg:h-[515px] grid grid-cols-2 md:grid-cols-4 overflow-hidden">
        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-1.png"
            alt="Vector Studio Canvas"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              THỰC HÀNH VECTOR
            </span>
          </div>
        </div>

        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-2.png"
            alt="Pixel Masking Engine"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              THỰC HÀNH MẶT NẠ PIXEL
            </span>
          </div>
        </div>

        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-3.png"
            alt="Publisher Editorial Layout"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              THỰC HÀNH DÀN TRANG
            </span>
          </div>
        </div>

        <div className="relative h-full overflow-hidden group">
          <img
            src="/assets/interia/gallery-4.png"
            alt="Automation learning concept"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="font-kanit text-white text-[14px] tracking-[4px] uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              THỰC HÀNH TỰ ĐỘNG HÓA
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. SECTION 8: HOW TO USE THE ACADEMY
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 py-24">
        <div className="text-center space-y-3 mb-12">
          <p className="font-kanit text-[#6d7d7d] text-[14px] tracking-[6px] uppercase">Từ bài học lý thuyết đến thực hành độc lập</p>
          <h2 className="font-kanit text-[30px] sm:text-[36px] text-white">Vòng lặp học tập gắn liền với bằng chứng năng lực</h2>
          <p className="font-nunito text-zinc-400 max-w-[680px] mx-auto leading-relaxed">
            Thấu hiểu nguyên lý, thực hành có hướng dẫn, giải quyết thử thách mới mẻ, tự đánh giá lựa chọn và tinh chỉnh sản phẩm.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <article className="border border-white/10 bg-[#202626] p-7">
            <span className="font-mono text-xs text-[#9aa9a7]">01 / THẤU HIỂU</span>
            <h3 className="font-kanit text-xl text-white mt-4">Hiểu rõ bản chất công cụ</h3>
            <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-3">Nắm vững mục đích, thông số điều khiển cốt lõi, điểm mạnh, giới hạn và trường hợp nên chọn phương pháp khác.</p>
          </article>
          <article className="border border-white/10 bg-[#202626] p-7">
            <span className="font-mono text-xs text-[#9aa9a7]">02 / THỰC HÀNH</span>
            <h3 className="font-kanit text-xl text-white mt-4">Rèn luyện qua thực hành</h3>
            <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-3">Chuyển từ quan sát minh họa sang các bài thực hành có hướng dẫn và bài tập độc lập với tiêu chí rõ ràng.</p>
          </article>
          <article className="border border-white/10 bg-[#202626] p-7">
            <span className="font-mono text-xs text-[#9aa9a7]">03 / ỨNG BIẾN</span>
            <h3 className="font-kanit text-xl text-white mt-4">Giải quyết đề bài thiết kế mới</h3>
            <p className="font-nunito text-sm text-zinc-400 leading-relaxed mt-3">Chủ động chọn quy trình, bảo vệ quyết định thẩm mỹ, tiếp thu phản biện và bàn giao file gốc chuẩn xuất bản.</p>
          </article>
        </div>
        <div className="text-center mt-10">
          <button onClick={() => onNavigate('encyclopedia')} className="inline-flex items-center gap-3 font-kanit text-sm text-white tracking-[3px] uppercase hover:gap-4 transition-all">Khám phá Bách khoa toàn thư công cụ <ChevronRight className="size-4" /></button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. SECTION 9: START LEARNING
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-[1200px] mx-auto px-6 sm:px-12 pb-24">
        <div className="bg-[#212828] border border-white/10 rounded-[28px] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-[650px] space-y-3">
            <p className="font-kanit text-[#9aa9a7] text-[13px] tracking-[4px] uppercase">Bắt đầu từ nền tảng vững chắc</p>
            <h2 className="font-kanit text-[30px] sm:text-[38px] text-white leading-tight">Xây dựng kỹ năng thực chiến để tự tin đón nhận bất kỳ đề bài nào</h2>
            <p className="font-nunito text-[15px] text-zinc-400 leading-relaxed">Bắt đầu từ các bài học nền tảng, thực hành trong phòng thí nghiệm mô phỏng và lưu lại nhật ký các quyết định thiết kế của bạn.</p>
          </div>
          <button onClick={() => onNavigate('catalog')} className="shrink-0 px-8 py-3 rounded-full border border-[#9aa9a7] text-white font-kanit text-sm tracking-[3px] uppercase hover:bg-white hover:text-[#191d1d] transition-all">Mở Danh mục Khóa học</button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. FOOTER (Figma node 101:3)
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative w-full bg-[#131616] pt-16 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-12">
          {/* Top Row: Navigation Menu & Brand */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12">
            <div className="flex flex-wrap items-center gap-8 font-nunito text-[16px] text-zinc-300 lowercase">
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">trang chủ</button>
              <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">chương trình học</button>
              <button onClick={() => onNavigate('simulator')} className="hover:text-white transition-colors">mô phỏng sandbox</button>
              <button onClick={() => onNavigate('encyclopedia')} className="hover:text-white transition-colors">bách khoa toàn thư</button>
              <button onClick={() => onNavigate('resources')} className="hover:text-white transition-colors">tài nguyên</button>
              <button onClick={() => onNavigate('playground')} className="hover:text-white transition-colors">mcp playground</button>
            </div>

            <div className="font-kanit text-white text-[16px] tracking-[6.88px] uppercase">
              AFFINITY ACADEMY
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#6d7d7d]/30" />

          {/* Middle Row: Social & Description */}
          <div className="py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-zinc-400">
              <span className="font-kanit text-[13px] tracking-[3px] uppercase text-[#6d7d7d]">
                HỆ SINH THÁI STUDIO
              </span>
              <div className="h-4 w-px bg-zinc-700" />
              <span className="font-mono text-xs text-zinc-500">
                LAYOUT &bull; VECTOR &bull; PIXEL &bull; TỰ ĐỘNG HÓA
              </span>
            </div>

            <p className="font-nunito text-[15px] text-zinc-400 max-w-[480px] text-left md:text-right">
              Thấu hiểu công cụ, lựa chọn quy trình tối ưu và sáng tạo với mục đích thiết kế rõ ràng.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Bar in #191d1d */}
        <div className="w-full bg-[#191d1d] py-6 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-nunito text-[14px] text-zinc-500">
            <p>
              &copy; 2026 Affinity Academy &mdash; Bản quyền đã được bảo hộ.
            </p>

            <p className="font-nunito text-xs text-zinc-500">Phạm vi công cụ và phiên bản được cập nhật theo tiến độ kiểm chứng của giáo trình.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
