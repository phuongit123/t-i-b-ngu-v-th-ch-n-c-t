import { useEffect } from 'react';
import type { AffinityTrackId } from '@/types/design-system';
import type { CurriculumLesson, CurriculumModule } from '@/types/curriculum';
import { getLessonVisualShowcase } from '@/lib/lesson-visuals';
import { SITE_ORIGIN, getLessonCanonicalPath, getRoutePath } from '@/lib/seo-router';
import { lessonTranslationsVi, moduleTranslationsVi } from '@/data/curriculum/translationsVi';

interface SeoMetadataOptions {
  activeRoute: string;
  activeTrack: AffinityTrackId;
  activeLesson?: CurriculumLesson | null;
  activeModule?: CurriculumModule | null;
}

interface PageSeoDescriptor {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage: string;
  breadcrumbs: { name: string; path: string }[];
}

const TRACK_META: Record<
  AffinityTrackId,
  { name: string; title: string; description: string; image: string }
> = {
  designer: {
    name: 'Vector Studio (Thiết kế Vector)',
    title: 'Lộ trình Vector Studio (Affinity Designer) — Học Viện Affinity Academy',
    description:
      'Làm chủ Pen Tool, đường cong Bézier, phép toán Boolean, lưới Isometric và xuất file vector sản xuất trên Affinity Vector Studio.',
    image: '/assets/academy/studio-vector-art.png',
  },
  photo: {
    name: 'Pixel Studio (Chỉnh sửa Ảnh)',
    title: 'Lộ trình Pixel Studio (Affinity Photo) — Học Viện Affinity Academy',
    description:
      'Thành thạo Layer Stack, mặt nạ tách tóc phi phá hủy, chỉnh màu Curves, tráng ảnh RAW Develop và ghép ảnh nghệ thuật trên Affinity Pixel Studio.',
    image: '/assets/academy/studio-pixel-retouch.png',
  },
  publisher: {
    name: 'Layout Studio (Dàn trang Xuất bản)',
    title: 'Lộ trình Layout Studio (Affinity Publisher) — Học Viện Affinity Academy',
    description:
      'Nắm vững Master Page, hệ lưới tạp chí, Bleed 3mm, Baseline Grid và chuẩn xuất bản in ấn PDF/X-4 trên Affinity Layout Studio.',
    image: '/assets/academy/studio-layout-editorial.png',
  },
  scripting: {
    name: 'Tự động hóa JS DOM & MCP',
    title: 'Lộ trình Tự động hóa Scripting & MCP — Học Viện Affinity Academy',
    description:
      'Khám phá kiến trúc V8 JavaScript DOM API và máy chủ Affinity MCP để tự động hóa dàn trang và tạo hình hàng loạt.',
    image: '/assets/academy/studio-automation-dom.png',
  },
};

const FAQ_ENTRIES = [
  {
    q: 'Affinity Academy dạy phiên bản Affinity nào?',
    a: 'Chương trình giảng dạy chuẩn hóa cho Affinity Studio hợp nhất (Layout, Vector và Pixel Studio), đồng thời giữ rõ nhãn tài liệu tham khảo cho người dùng chuyển từ Affinity V2.',
  },
  {
    q: 'Học viên có cần cài đặt phần mềm để luyện tập các công cụ tương tác không?',
    a: 'Không bắt buộc ngay lúc đầu. Bạn có thể thực hành vẽ đường cong Bézier, phép toán Boolean, chỉnh màu Curves LUT trên ảnh chân dung thật và chạy mã JavaScript DOM trực tiếp trên trình duyệt.',
  },
  {
    q: 'Một bài học chuẩn trong giáo trình gồm những phần nào?',
    a: 'Mỗi bài học trong 66 bài đều tuân thủ cấu trúc 10 phần: Mục tiêu, Kiến thức nền tảng, Công cụ & Phím tắt, Quy trình từng bước, Sơ đồ minh họa, Thực hành hướng dẫn, Thử thách độc lập, Lỗi thường gặp, Trắc nghiệm và Tổng kết.',
  },
  {
    q: 'Điểm đánh giá năng lực học viên dựa trên tiêu chí gì?',
    a: 'Tiến độ hoàn thành bài học, độ chính xác hình học hoặc mặt nạ trong Thử thách thực hành và Đồ án tốt nghiệp 6 tệp bằng chứng được thẩm định theo chuẩn PLO-01 đến PLO-11.',
  },
];

function upsertMetaTag(
  attribute: 'name' | 'property',
  key: string,
  content: string
): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function buildDescriptor(opts: SeoMetadataOptions): PageSeoDescriptor {
  const { activeRoute, activeTrack, activeLesson, activeModule } = opts;

  if (activeRoute === 'lesson' && activeLesson) {
    const lessonTitleVi = lessonTranslationsVi[activeLesson.id] || activeLesson.title;
    const moduleTitleVi =
      (activeModule && moduleTranslationsVi[activeModule.id]) ||
      activeModule?.title ||
      activeLesson.moduleId;
    const trackMeta = TRACK_META[activeLesson.trackId] ?? TRACK_META.designer;
    const canonicalPath = getLessonCanonicalPath(activeLesson);
    const visual = getLessonVisualShowcase(
      activeLesson.id,
      activeLesson.moduleId,
      activeLesson.trackId
    );
    const desc =
      activeLesson.subtitle?.trim() ||
      `Bài học ${activeLesson.id}: ${lessonTitleVi} thuộc học phần ${moduleTitleVi} (${activeLesson.durationMinutes} phút).`;

    return {
      title: `${activeLesson.id}: ${lessonTitleVi} — Affinity Academy`,
      description: desc,
      canonicalPath,
      ogImage: visual.primary.src,
      breadcrumbs: [
        { name: 'Trang chủ', path: '/' },
        { name: trackMeta.name, path: getRoutePath('catalog', { trackId: activeLesson.trackId }) },
        { name: `${activeLesson.id}: ${lessonTitleVi}`, path: canonicalPath },
      ],
    };
  }

  switch (activeRoute) {
    case 'catalog': {
      const tm = TRACK_META[activeTrack] ?? TRACK_META.designer;
      const overview = /^\/(lo-trinh|catalog)\/?$/.test(window.location.pathname);
      const path = overview ? '/lo-trinh' : getRoutePath('catalog', { trackId: activeTrack });
      return {
        title: overview ? 'Lộ trình đào tạo — Affinity Academy' : tm.title,
        description: tm.description,
        canonicalPath: path,
        ogImage: tm.image,
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Lộ trình đào tạo', path: '/lo-trinh' },
          ...(overview ? [] : [{ name: tm.name, path }]),
        ],
      };
    }
    case 'simulator':
    case 'sandbox':
      return {
        title: 'Phòng Mô Phỏng Vector Bézier & Pixel Layers — Affinity Academy',
        description:
          'Thực hành trực tiếp Pen Tool, Node Tool, phép toán Boolean đa lớp và chỉnh sửa ảnh chân dung thật với Layer Mask, Blend Modes & Curves LUT.',
        canonicalPath: '/phong-mo-phong',
        ogImage: '/assets/academy/studio-vector-art.png',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Phòng mô phỏng tương tác', path: '/phong-mo-phong' },
        ],
      };
    case 'challenges':
      return {
        title: 'Thử Thách Kỹ Thuật & Chấm Điểm Canvas Thực Tế — Affinity Academy',
        description:
          'Hoàn thành bài luyện tập Pen Bézier và tách nền chân dung phi phá hủy với hệ thống chấm sai số hình học và độ phủ mặt nạ theo thời gian thực.',
        canonicalPath: '/thu-thach',
        ogImage: '/assets/lessons/diagram-bezier-nodes-vi.svg',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Thử thách thực hành', path: '/thu-thach' },
        ],
      };
    case 'knowledge':
    case 'search':
      return {
        title: 'Trung Tâm Tri Thức, Phím Tắt & Từ Điển Thiết Kế — Affinity Academy',
        description:
          'Tra cứu nhanh phím tắt Windows/macOS, bảng tóm tắt phép toán Boolean, chế độ hòa trộn và từ điển thuật ngữ thiết kế Affinity bằng tiếng Việt.',
        canonicalPath: '/tri-thuc',
        ogImage: '/assets/academy/canva-slide-1.png',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Trung tâm tri thức', path: '/tri-thuc' },
        ],
      };
    case 'shortcuts':
      return {
        title: 'Bảng Phím Tắt Chính Thức Affinity Studio — Affinity Academy',
        description:
          'Danh mục phím tắt đã kiểm chứng cho Vector Studio, Pixel Studio và Layout Studio hỗ trợ chuyển đổi linh hoạt giữa Windows và macOS.',
        canonicalPath: '/tri-thuc/phim-tat',
        ogImage: '/assets/academy/canva-slide-1.png',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Tri thức', path: '/tri-thuc' },
          { name: 'Bảng phím tắt', path: '/tri-thuc/phim-tat' },
        ],
      };
    case 'cheatsheet':
      return {
        title: 'Bảng Tóm Tắt Quy Tắc Đồ Họa & In Ấn — Affinity Academy',
        description:
          'Tra cứu nhanh 5 phép toán Boolean, phân loại Node Bézier, Layer Blend Modes và thông số xuất bản PDF/X-4, WebP, SVG.',
        canonicalPath: '/tri-thuc/tom-tat',
        ogImage: '/assets/lessons/diagram-boolean-ops-vi.svg',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Tri thức', path: '/tri-thuc' },
          { name: 'Bảng tóm tắt', path: '/tri-thuc/tom-tat' },
        ],
      };
    case 'glossary':
      return {
        title: 'Từ Điển Thuật Ngữ Tư Duy Thiết Kế & Đồ Họa — Affinity Academy',
        description:
          'Giải nghĩa tiếng Việt chuẩn xác các khái niệm Design Thinking 8 bước, Bleed, Curves, Histogram, Compound Shape và chỉnh sửa phi phá hủy.',
        canonicalPath: '/tri-thuc/tu-dien-thuat-ngu',
        ogImage: '/assets/lessons/diagram-layout-bleed-vi.svg',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Tri thức', path: '/tri-thuc' },
          { name: 'Từ điển thuật ngữ', path: '/tri-thuc/tu-dien-thuat-ngu' },
        ],
      };
    case 'resources':
      return {
        title: 'Thư Viện Tài Nguyên, Ảnh Mẫu & Tệp Thực Hành — Affinity Academy',
        description:
          'Tải về bộ 20 tài liệu hướng dẫn thực hành, kịch bản JavaScript DOM, tệp .afphoto gốc và ảnh studio độ phân giải cao.',
        canonicalPath: '/tai-nguyen',
        ogImage: '/assets/simulator/portrait-subject-studio.png',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Thư viện tài nguyên', path: '/tai-nguyen' },
        ],
      };
    case 'playground':
      return {
        title: 'Phòng Thực Hành Tự Động Hóa JS DOM & MCP — Affinity Academy',
        description:
          'Viết và chạy mã JavaScript Affinity DOM API ngay trên trình duyệt với 4 kịch bản mẫu Việt hóa và Live Document Canvas.',
        canonicalPath: '/thuc-hanh-tu-dong-hoa',
        ogImage: '/assets/academy/studio-automation-dom.png',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Thực hành tự động hóa', path: '/thuc-hanh-tu-dong-hoa' },
        ],
      };
    case 'encyclopedia':
      return {
        title: 'Bách Khoa Toàn Thư Affinity JavaScript DOM API — Affinity Academy',
        description:
          'Tra cứu giải nghĩa tiếng Việt và chạy thử ví dụ cho 14 lớp SDK trích xuất từ Affinity 3.3.3 DOM API.',
        canonicalPath: '/bach-khoa-api',
        ogImage: '/assets/lessons/diagram-mcp-bridge-vi.svg',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Bách khoa API', path: '/bach-khoa-api' },
        ],
      };
    case 'dashboard':
      return {
        title: 'Hồ Sơ Học Tập & Theo Dõi Tiến Độ — Affinity Academy',
        description:
          'Theo dõi số bài học đã hoàn thành trên 66 bài chuẩn, điểm thử thách thực hành và lịch sử rèn luyện tại Affinity Academy.',
        canonicalPath: '/ho-so-hoc-tap',
        ogImage: '/assets/academy/hero-studio-showcase.png',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Hồ sơ học tập', path: '/ho-so-hoc-tap' },
        ],
      };
    case 'settings':
      return {
        title: 'Cài Đặt Phím Tắt Nền Tảng & Hệ Thống — Affinity Academy',
        description:
          'Tùy chỉnh bộ phím tắt Windows (Ctrl) hoặc macOS (Cmd) và quản lý dữ liệu tiến độ học tập cá nhân.',
        canonicalPath: '/cai-dat',
        ogImage: '/assets/academy/hero-studio-showcase.png',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Cài đặt', path: '/cai-dat' },
        ],
      };
    case 'capstone':
      return {
        title: 'Đồ Án Tốt Nghiệp Tổng Hợp A5 & Thẩm Định PLO — Affinity Academy',
        description:
          'Nộp bộ 6 tệp bằng chứng thiết kế thực tế và đáp ứng chuẩn đầu ra PLO-07 & PLO-08 trong dự án tổng hợp cuối khóa.',
        canonicalPath: '/do-an-tot-nghiep',
        ogImage: '/assets/academy/studio-layout-editorial.png',
        breadcrumbs: [
          { name: 'Trang chủ', path: '/' },
          { name: 'Đồ án tốt nghiệp', path: '/do-an-tot-nghiep' },
        ],
      };
    case 'design-system':
      return { title: 'Hệ thống thiết kế — Affinity Academy', description: 'Các thành phần và token giao diện của Affinity Academy.', canonicalPath: '/he-thong-thiet-ke', ogImage: '/assets/academy/hero-studio-showcase.png', breadcrumbs: [] };
    case 'reset-password':
    case 'not-found':
      return { title: activeRoute === 'not-found' ? 'Không tìm thấy trang — Affinity Academy' : 'Đặt lại mật khẩu — Affinity Academy', description: '', canonicalPath: window.location.pathname, ogImage: '/assets/academy/hero-studio-showcase.png', breadcrumbs: [] };
    case 'home':
    default:
      return {
        title: 'Affinity Academy — Học Viện Thiết Kế Đồ Họa Vector, Pixel, Layout & Tự Động Hóa',
        description:
          'Học thiết kế đồ họa bài bản với 66 bài giảng tiếng Việt chuyên sâu, phòng mô phỏng Vector/Pixel chạy thật trên trình duyệt và tư duy thiết kế 8 bước.',
        canonicalPath: '/',
        ogImage: '/assets/academy/hero-studio-showcase.png',
        breadcrumbs: [{ name: 'Trang chủ', path: '/' }],
      };
  }
}

function buildJsonLdGraph(
  descriptor: PageSeoDescriptor,
  opts: SeoMetadataOptions
): Record<string, unknown> {
  const canonicalUrl = `${SITE_ORIGIN}${descriptor.canonicalPath}`;
  const graph: Record<string, unknown>[] = [];

  graph.push({
    '@type': 'EducationalOrganization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'Affinity Academy',
    url: SITE_ORIGIN,
    description:
      'Học viện đào tạo thiết kế đồ họa Vector, Pixel, Layout và Tự động hóa JavaScript DOM bằng tiếng Việt.',
  });

  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: descriptor.breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: `${SITE_ORIGIN}${b.path}`,
    })),
  });

  if (opts.activeRoute === 'home' || opts.activeRoute === 'catalog') {
    graph.push({
      '@type': 'Course',
      '@id': `${SITE_ORIGIN}/#course`,
      name: 'Chương Trình Đào Tạo Thiết Kế Đồ Họa Affinity Toàn Diện (66 Bài Học)',
      description: descriptor.description,
      provider: { '@id': `${SITE_ORIGIN}/#organization` },
      inLanguage: 'vi',
      numberOfCredits: 66,
      url: canonicalUrl,
    });
  }

  if (opts.activeRoute === 'lesson' && opts.activeLesson) {
    const lessonTitleVi =
      lessonTranslationsVi[opts.activeLesson.id] || opts.activeLesson.title;
    graph.push({
      '@type': 'LearningResource',
      name: `${opts.activeLesson.id}: ${lessonTitleVi}`,
      description: descriptor.description,
      learningResourceType: 'Interactive Lesson',
      educationalLevel: opts.activeLesson.difficulty,
      timeRequired: `PT${opts.activeLesson.durationMinutes}M`,
      inLanguage: 'vi',
      url: canonicalUrl,
      isPartOf: { '@id': `${SITE_ORIGIN}/#course` },
    });
  }

  if (
    opts.activeRoute === 'home' ||
    ['knowledge', 'search', 'shortcuts', 'cheatsheet', 'glossary'].includes(opts.activeRoute)
  ) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: FAQ_ENTRIES.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/**
 * Synchronizes document title, meta description, canonical link, Open Graph, and JSON-LD Schema.org
 * on every route, track filter, or lesson switch.
 */
export function useSeoMetadata({
  activeRoute,
  activeTrack,
  activeLesson,
  activeModule,
}: SeoMetadataOptions): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = 'vi';

    const currentOpts: SeoMetadataOptions = {
      activeRoute,
      activeTrack,
      activeLesson,
      activeModule,
    };
    const descriptor = buildDescriptor(currentOpts);
    const canonicalUrl = `${SITE_ORIGIN}${descriptor.canonicalPath}`;
    const fullImageUrl = descriptor.ogImage.startsWith('http')
      ? descriptor.ogImage
      : `${SITE_ORIGIN}${descriptor.ogImage}`;

    document.title = descriptor.title;
    upsertMetaTag('name', 'robots', ['not-found', 'reset-password'].includes(activeRoute) ? 'noindex' : 'index,follow');
    upsertMetaTag('name', 'description', descriptor.description);
    upsertMetaTag('property', 'og:title', descriptor.title);
    upsertMetaTag('property', 'og:description', descriptor.description);
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:image', fullImageUrl);
    upsertMetaTag('name', 'twitter:title', descriptor.title);
    upsertMetaTag('name', 'twitter:description', descriptor.description);
    upsertMetaTag('name', 'twitter:image', fullImageUrl);

    let canonicalEl = document.head.querySelector('#canonical-link') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.id = 'canonical-link';
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonicalUrl;

    let jsonLdEl = document.head.querySelector('#academy-jsonld') as HTMLScriptElement | null;
    if (!jsonLdEl) {
      jsonLdEl = document.createElement('script');
      jsonLdEl.id = 'academy-jsonld';
      jsonLdEl.type = 'application/ld+json';
      document.head.appendChild(jsonLdEl);
    }
    jsonLdEl.textContent = JSON.stringify(buildJsonLdGraph(descriptor, currentOpts));
  }, [activeRoute, activeTrack, activeLesson, activeModule]);
}
