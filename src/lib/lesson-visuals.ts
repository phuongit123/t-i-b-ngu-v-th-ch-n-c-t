import type { AffinityTrackId } from '@/types/design-system';

export interface LessonVisualShowcase {
  primary: {
    src: string;
    alt: string;
    caption: string;
    isDiagram: boolean;
  };
  canvaSlide: {
    src: string;
    title: string;
  };
  comparisonSlider?: {
    beforeSrc: string;
    afterSrc: string;
    beforeLabel: string;
    afterLabel: string;
  };
}

export function getLessonVisualShowcase(
  lessonId: string,
  moduleId: string,
  trackId: AffinityTrackId
): LessonVisualShowcase {
  const canvaSlideMap: Record<AffinityTrackId, { src: string; title: string }> = {
    designer: {
      src: '/assets/academy/canva-slide-1.png',
      title: 'Thẻ tổng quan Vector Studio',
    },
    photo: {
      src: '/assets/academy/canva-slide-2.png',
      title: 'Thẻ tổng quan Pixel Studio',
    },
    publisher: {
      src: '/assets/academy/canva-slide-3.png',
      title: 'Thẻ tổng quan Layout Studio',
    },
    scripting: {
      src: '/assets/academy/canva-slide-4.png',
      title: 'Thẻ tổng quan Tự động hóa DOM & MCP',
    },
  };

  let primary = {
    src: '/assets/academy/studio-vector-art.png',
    alt: 'Minh họa thực hành Vector Studio',
    caption: 'Minh họa cấu trúc đối tượng và quy trình làm việc trong Vector Studio.',
    isDiagram: false,
  };

  if (moduleId === 'D01') {
    primary = {
      src: '/assets/lessons/diagram-vector-workspace-vi.svg',
      alt: 'Sơ đồ giải phẫu không gian làm việc Vector Studio',
      caption: 'Sơ đồ 5 vùng giao diện cốt lõi trong Vector Persona, Pixel Persona và Export Persona.',
      isDiagram: true,
    };
  } else if (moduleId === 'D02') {
    primary = {
      src: '/assets/lessons/diagram-bezier-nodes-vi.svg',
      alt: 'Sơ đồ điểm neo Sharp, Smooth, Smart và tay nắm tiếp tuyến Bézier',
      caption: 'Phân loại điểm neo (Node Tool) và cơ chế điều khiển tiếp tuyến đường cong Bézier.',
      isDiagram: true,
    };
  } else if (moduleId === 'D03') {
    primary = {
      src: '/assets/lessons/diagram-boolean-ops-vi.svg',
      alt: 'Sơ đồ phép toán hình học Boolean (Add, Subtract, Intersect, Xor)',
      caption: 'Minh họa 4 phép toán hình học Boolean và cấu trúc Compound Shapes phi phá hủy.',
      isDiagram: true,
    };
  } else if (trackId === 'photo') {
    if (moduleId === 'P01' || moduleId === 'P02' || moduleId === 'P03') {
      primary = {
        src: '/assets/lessons/diagram-pixel-masking-vi.svg',
        alt: 'Sơ đồ cấu trúc Layer Mask & Adjustment Layer phi phá hủy',
        caption: 'Nguyên lý mặt nạ Đen ẩn / Trắng hiện tách biệt khỏi dữ liệu ảnh gốc.',
        isDiagram: true,
      };
    } else if (moduleId === 'P04') {
      primary = {
        src: '/assets/simulator/coldbrew-product-plate.png',
        alt: 'Ảnh mẫu sản phẩm thủy tinh thực hành Retouching & xử lý chi tiết',
        caption: 'Ảnh mẫu sản phẩm thực hành xóa bụi bẩn, giữ hạt kết cấu và cân chỉnh bề mặt.',
        isDiagram: false,
      };
    } else if (moduleId === 'P05' || moduleId === 'P09') {
      primary = {
        src: '/assets/lessons/after-color-graded.png',
        alt: 'Ảnh phong cảnh hậu kỳ Curves & phát triển ảnh RAW',
        caption: 'Kết quả phát triển RAW 32-bit, kéo Curves và tách tương phản tông màu.',
        isDiagram: false,
      };
    } else if (moduleId === 'P07') {
      primary = {
        src: '/assets/simulator/background-sunset-city.png',
        alt: 'Ảnh nền đô thị hoàng hôn thực hành ghép cảnh Compositing',
        caption: 'Tấm nền môi trường chuẩn ánh sáng ấm để ghép chủ thể và khớp bóng đổ.',
        isDiagram: false,
      };
    } else {
      primary = {
        src: '/assets/academy/studio-pixel-retouch.png',
        alt: 'Ảnh ghép thương mại ánh sáng phòng studio Pixel Studio',
        caption: 'Minh họa quy trình hậu kỳ, Live Filters và tách sáng trong Pixel Studio.',
        isDiagram: false,
      };
    }
  } else if (trackId === 'publisher') {
    primary = {
      src: '/assets/lessons/diagram-layout-bleed-vi.svg',
      alt: 'Sơ đồ trang đôi Facing Pages, Margin và chuẩn tràn lề Bleed 3mm',
      caption: 'Phân biệt đường an toàn chữ (Margin), đường cắt thành phẩm (Trim) và Bleed 3mm.',
      isDiagram: true,
    };
  } else if (trackId === 'scripting') {
    primary = {
      src: '/assets/lessons/diagram-mcp-bridge-vi.svg',
      alt: 'Sơ đồ kiến trúc V8 JavaScript DOM và cầu nối MCP localhost:6767',
      caption: 'Kiến trúc runtime JavaScript nhúng điều khiển trực tiếp cây Layer & Document DOM.',
      isDiagram: true,
    };
  }

  const showBeforeAfter =
    moduleId === 'P05' ||
    moduleId === 'P09' ||
    lessonId === 'P10-03';

  return {
    primary,
    canvaSlide: canvaSlideMap[trackId],
    comparisonSlider: showBeforeAfter
      ? {
          beforeSrc: '/assets/lessons/before-color-raw.png',
          afterSrc: '/assets/lessons/after-color-graded.png',
          beforeLabel: 'Trước: RAW gốc phẳng',
          afterLabel: 'Sau: Curves & Color Grade',
        }
      : undefined,
  };
}
