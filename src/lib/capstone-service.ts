/**
 * AFFINITY ACADEMY — CAPSTONE EVALUATION SERVICE & RUBRIC ENGINE
 * Implements business logic, validation, scoring, and persistence for TASK-081
 */

import type {
  RubricDimension,
  RubricDimensionId,
  RubricLevelId,
  CapstoneProjectSpec,
  CapstoneSubmissionRecord,
  SubmissionArtifacts,
  StudentSelfAssessment,
  OfficialEvaluationResult,
  SubmissionHistoryEntry,
} from '@/types/capstone';

export const CAPSTONE_RUBRIC_DIMENSIONS: RubricDimension[] = [
  {
    id: 'brief_interpretation',
    title: 'Brief & Audience Interpretation',
    titleVi: '1. Giải mã Brief & Khán giả mục tiêu (PLO-07)',
    mappedPlo: 'PLO-07',
    weightPercentage: 15,
    isCritical: true,
    requiredEvidence: 'Tập tin brief-deconstruction.md phân rã trọn vẹn 6 yếu tố.',
    levels: {
      1: {
        level: 1,
        label: 'Khởi điểm (1 đ)',
        points: 1,
        description: 'Bắt đầu vẽ ngay không có tài liệu brief; không xác định được khán giả hoặc mục đích.',
        behavioralIndicator: 'Không nộp brief-deconstruction.md hoặc để trống các mục then chốt.',
      },
      2: {
        level: 2,
        label: 'Đang phát triển (2 đ)',
        points: 2,
        description: 'Có văn bản brief nhưng sơ sài, thiếu ràng buộc kỹ thuật hoặc tiêu chí đo lường.',
        behavioralIndicator: 'Chỉ chép lại đề bài một cách thụ động, thiếu phân tích sâu.',
      },
      3: {
        level: 3,
        label: 'Độc lập - ĐẠT CHUẨN (3 đ)',
        points: 3,
        description: 'Phân rã trọn vẹn 6 yếu tố: Audience, Purpose, Message, Constraints, Deliverables, Metrics.',
        behavioralIndicator: 'Xác định rõ ràng khách hàng mục tiêu, các ràng buộc in ấn và tiêu chuẩn đánh giá.',
      },
      4: {
        level: 4,
        label: 'Xuất sắc (4 đ)',
        points: 4,
        description: 'Phân tích sâu sắc tâm lý khách hàng, dự đoán rủi ro in ấn và đề xuất giải pháp tối ưu hóa.',
        behavioralIndicator: 'Thấu hiểu sâu sắc thị trường specialty coffee, đưa ra chiến lược định vị vượt trội.',
      },
    },
  },
  {
    id: 'visual_communication',
    title: 'Visual Hierarchy & Typography Judgement',
    titleVi: '2. Tư duy Thị giác & Truyền thông (PLO-05, PLO-06)',
    mappedPlo: 'PLO-05, PLO-06',
    weightPercentage: 15,
    isCritical: false,
    requiredEvidence: 'Bố cục nhãn và poster hoàn thiện thể hiện phân cấp thị giác mạch lạc.',
    levels: {
      1: {
        level: 1,
        label: 'Khởi điểm (1 đ)',
        points: 1,
        description: 'Bố cục lộn xộn, thiếu tương phản, màu sắc hỗn loạn, kiểu chữ khó đọc hoặc generic.',
        behavioralIndicator: 'Các phần tử tranh chấp thị giác, vi phạm nguyên lý khoảng trắng và căn lề.',
      },
      2: {
        level: 2,
        label: 'Đang phát triển (2 đ)',
        points: 2,
        description: 'Bố cục cơ bản ổn nhưng phân cấp thị giác chưa rõ; chọn màu chưa toát lên chất specialty cao cấp.',
        behavioralIndicator: 'Đọc được nội dung nhưng chưa tạo được nhịp điệu thị giác hấp dẫn.',
      },
      3: {
        level: 3,
        label: 'Độc lập - ĐẠT CHUẨN (3 đ)',
        points: 3,
        description: 'Phân cấp thị giác mạch lạc, tỷ lệ vàng/lưới chuẩn, màu sắc và typography sang trọng, đúng tông.',
        behavioralIndicator: 'Thông điệp chính nổi bật tức thì; kiểu chữ Cinzel và Inter kết hợp hài hòa.',
      },
      4: {
        level: 4,
        label: 'Xuất sắc (4 đ)',
        points: 4,
        description: 'Bố cục đột phá, nhịp điệu thị giác ấn tượng, nghệ thuật chữ điêu luyện, cảm xúc mạnh mẽ.',
        behavioralIndicator: 'Tác phẩm đạt chuẩn thương mại quốc tế, giàu tính biểu cảm và bản sắc riêng.',
      },
    },
  },
  {
    id: 'tool_selection',
    title: 'Tool & Workflow Selection',
    titleVi: '3. Lựa chọn Công cụ & Quy trình (PLO-01, PLO-02, PLO-03)',
    mappedPlo: 'PLO-01, PLO-02, PLO-03',
    weightPercentage: 20,
    isCritical: true,
    requiredEvidence: 'Cấu trúc cây Layer trong file .afdesign và .afphoto thể hiện công cụ chuẩn.',
    levels: {
      1: {
        level: 1,
        label: 'Khởi điểm (1 đ)',
        points: 1,
        description: 'Dùng sai Studio (vẽ vector trong Pixel hoặc ngược lại); công cụ chọn tùy tiện.',
        behavioralIndicator: 'Không phân biệt được vector vô hạn và raster pixel; thao tác ngẫu hứng.',
      },
      2: {
        level: 2,
        label: 'Đang phát triển (2 đ)',
        points: 2,
        description: 'Dùng đúng Studio nhưng thao tác thủ công, chưa tận dụng tính năng nâng cao.',
        behavioralIndicator: 'Không dùng Symbols hay Constraints; bo góc thủ công thay vì Corner Tool.',
      },
      3: {
        level: 3,
        label: 'Độc lập - ĐẠT CHUẨN (3 đ)',
        points: 3,
        description: 'Chọn công cụ chuẩn xác: Corner Tool bo vát, Symbols đồng bộ, Constraints ghim co giãn, Selection Brush & Live Lighting.',
        behavioralIndicator: 'Tận dụng chính xác sức mạnh đặc thù của từng công cụ Affinity.',
      },
      4: {
        level: 4,
        label: 'Xuất sắc (4 đ)',
        points: 4,
        description: 'Tối ưu hóa quy trình mẫu mực, kết hợp nhuần nhuyễn các tính năng cao cấp của Affinity.',
        behavioralIndicator: 'Xây dựng workflow siêu tốc, kiểm soát toàn diện vector math và 3D shader.',
      },
    },
  },
  {
    id: 'non_destructive',
    title: 'Non-Destructive Craft & Architecture',
    titleVi: '4. Kỹ nghệ & Kiến trúc Phi phá hủy (PLO-04)',
    mappedPlo: 'PLO-04',
    weightPercentage: 15,
    isCritical: true,
    requiredEvidence: 'Toàn bộ file nguồn có thể chỉnh sửa lại 100% (Mask, Live Filters, Adjustments).',
    levels: {
      1: {
        level: 1,
        label: 'Khởi điểm (1 đ)',
        points: 1,
        description: 'Phá hủy dữ liệu pixel (dùng Eraser, merge layer); vector bị biến dạng đứt node.',
        behavioralIndicator: 'Không thể chỉnh sửa lại sau khi xuất file; mất trắng dữ liệu gốc.',
      },
      2: {
        level: 2,
        label: 'Đang phát triển (2 đ)',
        points: 2,
        description: 'Có dùng Mask và Adjustment nhưng còn lẫn lộn thao tác phá hủy cục bộ; layer chưa đặt tên.',
        behavioralIndicator: 'Vẫn còn layer bị flatten; cấu trúc cây layer lộn xộn.',
      },
      3: {
        level: 3,
        label: 'Độc lập - ĐẠT CHUẨN (3 đ)',
        points: 3,
        description: '100% Phi phá hủy: Layer Masks, Live Filters, Adjustment Layers; layer tổ chức ngăn nắp, đặt tên chuẩn.',
        behavioralIndicator: 'Mọi thông số ánh sáng, màu sắc và đường cắt đều có thể tinh chỉnh lại bất cứ lúc nào.',
      },
      4: {
        level: 4,
        label: 'Xuất sắc (4 đ)',
        points: 4,
        description: 'Cấu trúc component tái sử dụng hoàn hảo, nested symbols khoa học, quản trị alpha bậc thầy.',
        behavioralIndicator: 'Kiến trúc file đạt chuẩn Design System doanh nghiệp, sẵn sàng chuyển giao cho đội ngũ.',
      },
    },
  },
  {
    id: 'iteration_critique',
    title: 'Critique, Diagnosis & Iteration',
    titleVi: '5. Tự Chẩn đoán, Phản biện & Lặp lại (PLO-08)',
    mappedPlo: 'PLO-08',
    weightPercentage: 15,
    isCritical: true,
    requiredEvidence: 'Tập tin iteration-critique-log.md kèm hình ảnh so sánh Before / After rõ ràng.',
    levels: {
      1: {
        level: 1,
        label: 'Khởi điểm (1 đ)',
        points: 1,
        description: 'Không có nhật ký sửa đổi; chỉ nộp 1 bản duy nhất; từ chối hoặc bỏ qua các lỗi hiển nhiên.',
        behavioralIndicator: 'Không có bằng chứng chứng minh đã trải qua vòng lặp phản biện và cải tiến.',
      },
      2: {
        level: 2,
        label: 'Đang phát triển (2 đ)',
        points: 2,
        description: 'Có sửa đổi nhưng không ghi chép; chỉ chỉnh sửa nhỏ mang tính trang trí cảm tính.',
        behavioralIndicator: 'Sửa lỗi nhưng không giải thích được lý do kỹ thuật đằng sau.',
      },
      3: {
        level: 3,
        label: 'Độc lập - ĐẠT CHUẨN (3 đ)',
        points: 3,
        description: 'Lập nhật ký so sánh Draft 1 vs Draft 2: chỉ rõ ít nhất 3 lỗi kỹ thuật, giải thích nguyên nhân và chứng minh kết quả.',
        behavioralIndicator: 'Tự soi chiếu và khắc phục trung thực các vấn đề viền lem, tỷ lệ hoặc tương phản.',
      },
      4: {
        level: 4,
        label: 'Xuất sắc (4 đ)',
        points: 4,
        description: 'Nhật ký phản biện sâu sắc, có bằng chứng đo lường thực tế (kiểm tra tương phản, test in thử, gamut màu).',
        behavioralIndicator: 'Năng lực tự đánh giá tương đương một Art Director hoặc Senior Designer.',
      },
    },
  },
  {
    id: 'production_readiness',
    title: 'Production Readiness & Delivery Packaging',
    titleVi: '6. Chuẩn bị Sản xuất & Bàn giao (PLO-09)',
    mappedPlo: 'PLO-09',
    weightPercentage: 10,
    isCritical: true,
    requiredEvidence: 'Thư mục file xuất đầy đủ bản in PDF/X-4 CMYK (3mm bleed) và WebP sRGB 2x.',
    levels: {
      1: {
        level: 1,
        label: 'Khởi điểm (1 đ)',
        points: 1,
        description: 'File xuất sai định dạng, thiếu bleed, nhầm hệ màu RGB/CMYK, text bị vỡ hạt khi zoom.',
        behavioralIndicator: 'Xưởng in sẽ từ chối in ấn hoặc in ra sản phẩm bị lỗi hụt viền trắng.',
      },
      2: {
        level: 2,
        label: 'Đang phát triển (2 đ)',
        points: 2,
        description: 'File xuất mở được nhưng thiếu marks, profile màu in chưa chuẩn hoặc đặt tên file tùy tiện.',
        behavioralIndicator: 'Cần người khác can thiệp chỉnh sửa lại thông số xuất bản trước khi gửi xưởng.',
      },
      3: {
        level: 3,
        label: 'Độc lập - ĐẠT CHUẨN (3 đ)',
        points: 3,
        description: 'Đầy đủ bản in PDF/X-4 CMYK 300DPI có 3mm bleed + bản digital WebP sRGB 2x; đặt tên chuẩn cấu trúc.',
        behavioralIndicator: 'File sạch sẽ, sẵn sàng đưa thẳng vào máy in offset hoặc đưa lên hệ thống quảng cáo web.',
      },
      4: {
        level: 4,
        label: 'Xuất sắc (4 đ)',
        points: 4,
        description: 'Chuẩn bị đóng gói hoàn hảo, tài liệu bàn giao rõ ràng, tối ưu dung lượng file xuất sắc.',
        behavioralIndicator: 'Đóng gói chuẩn xác như một Agency chuyên nghiệp hàng đầu.',
      },
    },
  },
  {
    id: 'independent_transfer',
    title: 'Independent Transfer & Design Reflection',
    titleVi: '7. Chuyển giao Độc lập & Suy ngẫm Thiết kế (PLO-10)',
    mappedPlo: 'PLO-10',
    weightPercentage: 10,
    isCritical: false,
    requiredEvidence: 'Tập tin design-rationale.md thuyết minh lý do và hướng phát triển tiếp theo.',
    levels: {
      1: {
        level: 1,
        label: 'Khởi điểm (1 đ)',
        points: 1,
        description: 'Bài làm sao chép từ tutorial có sẵn; không giải thích được các quyết định thiết kế.',
        behavioralIndicator: 'Học vẹt từng bước bấm chuột mà không hiểu tại sao mình làm như vậy.',
      },
      2: {
        level: 2,
        label: 'Đang phát triển (2 đ)',
        points: 2,
        description: 'Tự làm được nhưng phần giải trình còn mang tính mô tả thao tác bấm nút ("tôi đã bấm nút X").',
        behavioralIndicator: 'Chưa liên kết được giữa thao tác phần mềm với mục đích kinh doanh của thương hiệu.',
      },
      3: {
        level: 3,
        label: 'Độc lập - ĐẠT CHUẨN (3 đ)',
        points: 3,
        description: 'Giải trình thuyết phục tại sao thiết kế đáp ứng được brief; nêu rõ giới hạn hiện tại và hướng cải tiến.',
        behavioralIndicator: 'Chứng minh được tư duy thiết kế độc lập, lập luận gãy gọn và tự tin.',
      },
      4: {
        level: 4,
        label: 'Xuất sắc (4 đ)',
        points: 4,
        description: 'Tư duy thiết kế độc lập xuất sắc, thể hiện năng lực tự học và khả năng thích ứng với đề tài mới.',
        behavioralIndicator: 'Thể hiện tố chất của một nhà thiết kế chiến lược (Design Strategist).',
      },
    },
  },
];

export const DEFAULT_LUMINA_PROJECT: CapstoneProjectSpec = {
  id: 'CAPSTONE-001',
  title: 'Lumina Artisanal Roastery Launch Campaign',
  titleVi: 'Chiến Dịch Tái Định Vị & Ra Mắt Thương Hiệu Cà Phê Lumina',
  clientName: 'Lumina Artisanal Roastery',
  scenarioOverview:
    'Lumina Artisanal Roastery là thương hiệu xưởng rang specialty coffee thủ công cao cấp. Dự án yêu cầu tái thiết kế toàn bộ hệ thống nhận diện cốt lõi (Vector Studio) và tạo lập hình ảnh key visual quảng cáo cho dòng sản phẩm Cold Brew cao cấp mới ra mắt (Pixel Studio). Học viên phải đóng vai trò Lead Designer thực thi dự án độc lập từ khâu giải mã brief đến bàn giao thành phẩm in ấn.',
  targetAudience:
    'Người tiêu dùng thành thị độ tuổi 22–40, thu nhập khá trở lên, sành cà phê specialty, trân trọng nghệ thuật thủ công và tính bền vững.',
  technicalConstraints: [
    'Hệ vector: Vẽ logo và nhãn bao bì hoàn toàn bằng Vector Studio (.afdesign), sử dụng Corner Tool bo góc, Symbols panel đồng bộ nhãn, và Constraints panel để nhãn co giãn thích ứng.',
    'Hệ pixel: Xử lý chai Cold Brew trong Pixel Studio (.afphoto) với Selection Brush, Refine edge, Live Lighting Filter (Spotlight) kết hợp Bump map 3D texture, 100% phi phá hủy.',
    'Chuẩn in ấn: Nhãn bao bì xuất bản PDF/X-4 CMYK FOGRA39 300 DPI, bù xén bleed 3mm, crop marks.',
    'Chuẩn digital: Poster quảng cáo xuất WebP sRGB tỉ lệ 4:5 độ phân giải 2x (2160x2700 px).',
    'Bắt buộc hoàn thành 2 tài liệu tư duy: brief-deconstruction.md (PLO-07) và iteration-critique-log.md (PLO-08).',
  ],
  deliverableRequirements: [
    {
      id: 'DELIV-01',
      name: 'Văn bản Phân rã Brief (brief-deconstruction.md)',
      format: 'Markdown (.md)',
      description: 'Phân tích Audience, Purpose, Message, Constraints, Deliverables, Metrics (PLO-07).',
      isMandatory: true,
    },
    {
      id: 'DELIV-02',
      name: 'Nhật ký Sửa đổi & Phản biện (iteration-critique-log.md)',
      format: 'Markdown (.md)',
      description: 'Ghi lại ít nhất 3 lỗi kỹ thuật từ Draft 1 và chứng minh giải pháp cải tiến Before/After (PLO-08).',
      isMandatory: true,
    },
    {
      id: 'DELIV-03',
      name: 'File Nguồn Hệ Thống Nhãn Vector (lumina-brand-system.afdesign)',
      format: 'Affinity Designer (.afdesign)',
      description: 'File vector nguyên bản với cấu trúc Symbols và Constraints panel.',
      isMandatory: true,
    },
    {
      id: 'DELIV-04',
      name: 'File Nguồn Poster Key Visual (lumina-coldbrew-kv.afphoto)',
      format: 'Affinity Photo (.afphoto)',
      description: 'File xử lý ảnh phi phá hủy với Live Lighting 3D, Bump map và Mask.',
      isMandatory: true,
    },
    {
      id: 'DELIV-05',
      name: 'Bản Xuất In Ấn Nhãn Bao Bì (label-packaging-print.pdf)',
      format: 'PDF/X-4 (CMYK 300 DPI, 3mm Bleed)',
      description: 'Tệp in ấn công nghiệp sẵn sàng gửi xưởng in.',
      isMandatory: true,
    },
    {
      id: 'DELIV-06',
      name: 'Poster Kỹ Thuật Số (lumina-ad-banner-2x.webp)',
      format: 'WebP / PNG sRGB 2x',
      description: 'Ảnh quảng cáo cho mạng xã hội và web.',
      isMandatory: true,
    },
  ],
  starterAssets: [
    {
      filename: 'lumina_project_brief.md',
      filesize: '4.2 KB',
      filetype: 'Markdown Guide',
      description: 'Tài liệu chi tiết yêu cầu khách hàng, bảng kích thước bao bì và thông số kỹ thuật.',
    },
    {
      filename: 'lumina_coldbrew_raw_plate.jpg',
      filesize: '2.8 MB',
      filetype: 'High-Res Photo',
      description: 'Ảnh chụp sản phẩm thô chai Cold Brew trên phông nền xám phòng chụp.',
    },
    {
      filename: 'coffee_texture_bump_map.png',
      filesize: '1.4 MB',
      filetype: 'Grayscale Texture',
      description: 'Bản đồ độ sần sùi hạt giấy và bao bố dùng cho Bump Map trong Live Lighting.',
    },
    {
      filename: 'brand_fonts_license.md',
      filesize: '1.1 KB',
      filetype: 'License Guide',
      description: 'Quy chuẩn sử dụng bộ font mở cao cấp Cinzel và Inter cho dự án.',
    },
  ],
};

const STORAGE_KEY_SUBMISSION = 'affinity_academy_capstone_submission';
const STORAGE_KEY_HISTORY = 'affinity_academy_capstone_history';

/**
 * Calculates weighted score from 1-4 scale scores (converted to percentage 0-100)
 */
export function calculateWeightedScore(
  scores: Record<RubricDimensionId, RubricLevelId>
): number {
  let totalScore = 0;

  for (const dim of CAPSTONE_RUBRIC_DIMENSIONS) {
    const rawLevel = scores[dim.id] || 1;
    // Map Level 1 -> 25%, Level 2 -> 50%, Level 3 -> 75%, Level 4 -> 100%
    const normalizedPercent = (rawLevel / 4) * 100;
    const dimensionWeightedPoints = (normalizedPercent * dim.weightPercentage) / 100;
    totalScore += dimensionWeightedPoints;
  }

  return Math.round(totalScore * 10) / 10;
}

/**
 * Rigorous Pass/Fail determination
 * Condition 1: Total score >= 75
 * Condition 2: ALL CRITICAL dimensions must be >= Level 3
 */
export function evaluatePassFail(
  scores: Record<RubricDimensionId, RubricLevelId>
): {
  passed: boolean;
  score: number;
  criticalViolations: string[];
} {
  const score = calculateWeightedScore(scores);
  const criticalViolations: string[] = [];

  for (const dim of CAPSTONE_RUBRIC_DIMENSIONS) {
    if (dim.isCritical) {
      const level = scores[dim.id] || 1;
      if (level < 3) {
        criticalViolations.push(
          `Tiêu chí "${dim.titleVi}" thuộc diện BẮT BUỘC (CRITICAL) chỉ đạt Mức ${level}/4. Yêu cầu tối thiểu phải đạt Mức 3 (Độc lập).`
        );
      }
    }
  }

  const passed = score >= 75 && criticalViolations.length === 0;

  return {
    passed,
    score,
    criticalViolations,
  };
}

/**
 * Loads current capstone submission from storage, or creates initial state
 */
export function loadCurrentSubmission(): CapstoneSubmissionRecord {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SUBMISSION);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to load submission from localStorage', err);
  }

  return {
    id: 'SUB-2026-001',
    projectId: DEFAULT_LUMINA_PROJECT.id,
    studentId: 'STU-CURRENT-USER',
    studentName: 'Học Viên Affinity Academy',
    version: 1,
    status: 'draft',
    artifacts: {
      briefDeconstructionUrl: 'project-control/artifacts/brief-deconstruction.md',
      iterationLogUrl: 'project-control/artifacts/iteration-critique-log.md',
      designRationaleUrl: 'project-control/artifacts/design-rationale.md',
      vectorSourcePath: 'assets/lumina-brand-system.afdesign',
      pixelSourcePath: 'assets/lumina-coldbrew-kv.afphoto',
      printPdfPath: 'exports/label-packaging-print.pdf',
      digitalWebpPath: 'exports/lumina-ad-banner-2x.webp',
      additionalNotes: 'Bản nộp đợt 1 kiểm tra phân rã brief và mô phỏng ánh sáng 3D.',
    },
    selfAssessment: {
      scores: {
        brief_interpretation: 3,
        visual_communication: 3,
        tool_selection: 4,
        non_destructive: 3,
        iteration_critique: 3,
        production_readiness: 3,
        independent_transfer: 3,
      },
      justifications: {
        brief_interpretation: 'Đã hoàn thành bảng phân tích 6 yếu tố trong brief-deconstruction.md.',
        visual_communication: 'Áp dụng phân cấp thị giác mạch lạc, kiểu chữ Cinzel cho thương hiệu.',
        tool_selection: 'Sử dụng Corner Tool và Live Lighting Filter đúng chuẩn studio.',
        non_destructive: '100% layer masks và live filters không phá hủy điểm ảnh gốc.',
        iteration_critique: 'Ghi nhận 3 lỗi viền lem và điều chỉnh góc chiếu sáng ở Draft 2.',
        production_readiness: 'File xuất PDF/X-4 CMYK 300 DPI có 3mm bleed đầy đủ.',
        independent_transfer: 'Tự thực hiện toàn bộ ý tưởng không sao chép từ bài mẫu.',
      },
      submittedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Saves or updates student submission.
 * IMPORTANT: Student CANNOT modify officialEvaluation!
 */
export function saveStudentSubmission(
  artifacts: SubmissionArtifacts,
  selfAssessment?: StudentSelfAssessment
): CapstoneSubmissionRecord {
  const current = loadCurrentSubmission();

  // Create history entry before bumping
  const historyEntry: SubmissionHistoryEntry = {
    version: current.version,
    timestamp: new Date().toISOString(),
    artifacts: { ...current.artifacts },
    selfAssessment: current.selfAssessment ? { ...current.selfAssessment } : undefined,
    officialEvaluation: current.officialEvaluation ? { ...current.officialEvaluation } : undefined,
    changelogSummary: `Cập nhật bài nộp phiên bản v${current.version}`,
  };

  const updatedRecord: CapstoneSubmissionRecord = {
    ...current,
    version: current.version + 1,
    status: 'submitted',
    artifacts: { ...artifacts },
    selfAssessment: selfAssessment ? { ...selfAssessment } : current.selfAssessment,
    updatedAt: new Date().toISOString(),
    // Preserve existing official evaluation (immutable by student)
    officialEvaluation: current.officialEvaluation,
  };

  localStorage.setItem(STORAGE_KEY_SUBMISSION, JSON.stringify(updatedRecord));
  appendSubmissionHistory(historyEntry);

  return updatedRecord;
}

/**
 * Records a local rubric practice result. It is not evaluator verification or a credential.
 */
export function savePracticeEvaluation(
  evaluatorId: string,
  evaluatorName: string,
  scores: Record<RubricDimensionId, RubricLevelId>,
  dimensionFeedback: Record<RubricDimensionId, string>,
  overallFeedback: string
): CapstoneSubmissionRecord {
  const current = loadCurrentSubmission();
  const evaluation = evaluatePassFail(scores);

  const officialResult: OfficialEvaluationResult = {
    evaluatorId,
    evaluatorName,
    scores,
    dimensionFeedback,
    overallFeedback,
    weightedScore: evaluation.score,
    passed: evaluation.passed,
    criticalViolations: evaluation.criticalViolations,
    evaluatedAt: new Date().toISOString(),
    isOfficial: false,
  };

  const updatedRecord: CapstoneSubmissionRecord = {
    ...current,
    // Practice results cannot change the formal submission status.
    officialEvaluation: officialResult,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_SUBMISSION, JSON.stringify(updatedRecord));

  return updatedRecord;
}

/**
 * Gets submission history entries
 */
export function getSubmissionHistory(): SubmissionHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load history', err);
  }
  return [];
}

function appendSubmissionHistory(entry: SubmissionHistoryEntry): void {
  const history = getSubmissionHistory();
  history.push(entry);
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to append history', err);
  }
}
