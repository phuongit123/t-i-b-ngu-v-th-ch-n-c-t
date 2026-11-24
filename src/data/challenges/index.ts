/**
 * AFFINITY ACADEMY — PRACTICE CHALLENGES DATASET
 * Step-by-step authentic challenges for Vector & Pixel practice.
 * Evaluates student accuracy using deterministic geometry and layer rules.
 * Strictly zero untrusted code execution.
 */

export interface ChallengeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
  checkpoint: string;
}

export interface PracticeChallenge {
  id: string;
  trackId: 'designer' | 'photo' | 'publisher';
  titleVi: string;
  subtitleVi: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  relatedModule: string;
  estimatedMinutes: number;
  scenarioOverview: string;
  expectedOutcome: string;
  starterData: {
    type: 'vector_path' | 'photo_layer';
    defaultViewBox: string;
    targetPointsCount?: number;
    targetTolerancePercent: number;
  };
  steps: ChallengeStep[];
  successCriteria: string[];
}

export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  {
    id: 'ch-vec-diamond',
    trackId: 'designer',
    titleVi: 'Thử Thách 01: Dựng Đa Giác Kim Cương Sắc Cạnh (Sharp Diamond)',
    subtitleVi: 'Làm chủ thao tác đặt điểm neo nhọn (Sharp Nodes) và đóng kín đường path',
    difficulty: 'Beginner',
    relatedModule: 'D02: Vector Nodes & Pen Geometry',
    estimatedMinutes: 15,
    scenarioOverview: 'Thương hiệu đá quý cần biểu tượng hình học tối giản với 4 đỉnh góc nhọn tuyệt đối. Hãy dùng Pen Tool để đặt các đỉnh chính xác và khép kín đường cong.',
    expectedOutcome: 'Một hình thoi khép kín có đúng 4 điểm neo Sharp, không có tay đòn Bézier thừa, dung sai sai số vị trí dưới 15%.',
    starterData: {
      type: 'vector_path',
      defaultViewBox: '0 0 800 500',
      targetPointsCount: 4,
      targetTolerancePercent: 85,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Khởi tạo Pen Tool',
        instruction: 'Nhấn phím tắt P hoặc click vào biểu tượng Pen Tool trên thanh công cụ.',
        tip: 'Đảm bảo chế độ Pen Mode là Pen thông thường (không chọn Polygon Mode tự động).',
        checkpoint: 'Con trỏ chuột chuyển sang biểu tượng ngòi bút Pen.',
      },
      {
        stepNumber: 2,
        title: 'Đặt 4 đỉnh hình thoi',
        instruction: 'Click chuột đơn (không kéo rê) lần lượt vào 4 đỉnh: Đỉnh trên (400, 120), Đỉnh phải (580, 260), Đỉnh dưới (400, 400), Đỉnh trái (220, 260).',
        tip: 'Click dứt khoát không kéo rê chuột để tạo Sharp node thay vì Smooth node.',
        checkpoint: 'Bốn điểm neo hình vuông nhỏ xuất hiện nối với nhau bởi các đoạn thẳng.',
      },
      {
        stepNumber: 3,
        title: 'Khép kín đường path',
        instruction: 'Di chuột về điểm neo xuất phát ban đầu (400, 120), khi thấy biểu tượng vòng tròn nhỏ xuất hiện cạnh con trỏ chuột thì click để đóng kín path.',
        tip: 'Đường path khép kín (Closed path) là điều kiện bắt buộc để có thể đổ màu Fill đồng nhất.',
        checkpoint: 'Đường viền khép kín, biểu tượng vòng tròn đóng path biến mất.',
      },
      {
        stepNumber: 4,
        title: 'Đánh giá độ chính xác',
        instruction: 'Nhấn nút "Chấm Điểm Thử Thách" để hệ thống tính toán khoảng cách sai số giữa bài làm của bạn và bản mẫu chuẩn.',
        checkpoint: 'Điểm số chính xác đạt từ 85% trở lên để hoàn thành thử thách.',
      },
    ],
    successCriteria: [
      'Đường path phải được khép kín (isClosed = true)',
      'Có chính xác 4 điểm neo Sharp',
      'Độ sai lệch tọa độ trung bình không vượt quá 20px',
      'Đạt điểm đánh giá accuracy >= 85%',
    ],
  },
  {
    id: 'ch-vec-swave',
    trackId: 'designer',
    titleVi: 'Thử Thách 02: Uốn Lượn Sóng Tiếp Tuyến Mượt (Smooth S-Wave)',
    subtitleVi: 'Kiểm soát tay đòn Bézier đối xứng và tính liên tục của độ cong',
    difficulty: 'Intermediate',
    relatedModule: 'D03: Smooth Nodes & Continuity',
    estimatedMinutes: 20,
    scenarioOverview: 'Dựng dải lụa mềm mại cho bao bì sản phẩm nước giải khát. Thử thách yêu cầu kéo tay đòn Bézier tiếp tuyến mượt mà tại mỗi điểm chuyển hướng.',
    expectedOutcome: 'Một đường cong hở uốn lượn hình chữ S với 3 điểm neo Smooth, các tay đòn Bézier đối xứng không bị gãy góc.',
    starterData: {
      type: 'vector_path',
      defaultViewBox: '0 0 800 500',
      targetPointsCount: 3,
      targetTolerancePercent: 80,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Tạo điểm neo bắt đầu có tay đòn',
        instruction: 'Click tại vị trí (180, 320) và kéo rê chuột chéo lên hướng (260, 170) để kéo dài tay đòn Out handle.',
        tip: 'Độ dài tay đòn tỉ lệ thuận với độ võng và độ phồng của đường lượn sóng.',
        checkpoint: 'Xuất hiện hai tay đòn thẳng hàng đối xứng qua điểm neo đầu tiên.',
      },
      {
        stepNumber: 2,
        title: 'Đặt điểm uốn lượn trung tâm',
        instruction: 'Click tại vị trí (400, 260) và kéo rê chuột theo hướng tiếp tuyến đối xứng để duy trì độ mượt.',
        tip: 'Không nhấn phím Alt để giữ hai cánh tay đòn luôn nằm trên cùng một đường thẳng 180 độ.',
        checkpoint: 'Đoạn đường cong nối giữa điểm 1 và điểm 2 uốn lượn tự nhiên không bị gãy góc.',
      },
      {
        stepNumber: 3,
        title: 'Kết thúc đường sóng hở',
        instruction: 'Click và kéo điểm cuối tại (620, 200), sau đó nhấn phím Enter hoặc Escape để ngắt path.',
        tip: 'Đường cong hở kết thúc bằng phím Esc mà không cần đóng vòng lặp.',
        checkpoint: 'Đường cong chữ S hoàn thiện, Pen Tool nhả lệnh sẵn sàng chuyển công cụ.',
      },
    ],
    successCriteria: [
      'Đường cong có đúng 3 điểm neo Smooth',
      'Tay đòn đối xứng liên tục (Liên tục tiếp tuyến C1)',
      'Độ sai lệch so với bản mẫu <= 22px',
      'Đạt điểm đánh giá accuracy >= 80%',
    ],
  },
  {
    id: 'ch-vec-heart',
    trackId: 'designer',
    titleVi: 'Thử Thách 03: Biểu Tượng Trái Tim Kết Hợp Cusp & Smooth',
    subtitleVi: 'Phối hợp điểm gãy góc nhọn Cusp và cánh cung tròn đối xứng',
    difficulty: 'Advanced',
    relatedModule: 'D03: Advanced Shape & Boolean Operations',
    estimatedMinutes: 25,
    scenarioOverview: 'Thiết kế icon trái tim hoàn hảo. Rãnh trên và chóp nhọn dưới bắt buộc là điểm gãy góc Cusp, trong khi hai vành vòm tròn hai bên phải mượt mà tuyệt đối.',
    expectedOutcome: 'Đường path khép kín hình trái tim cân xứng, kết hợp chính xác 2 điểm Cusp và 2 điểm Smooth.',
    starterData: {
      type: 'vector_path',
      defaultViewBox: '0 0 800 500',
      targetPointsCount: 4,
      targetTolerancePercent: 80,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Bắt đầu từ rãnh trên của tim',
        instruction: 'Đặt điểm đầu tiên tại rãnh lõm giữa (400, 190). Kéo tay đòn hướng lên trên bên trái, sau đó giữ Alt để bẻ gãy tay đòn tạo góc nhọn Cusp.',
        tip: 'Phím Alt là bí quyết bẻ gãy góc độc lập cho tay đòn trong Affinity.',
        checkpoint: 'Điểm neo có hai tay đòn tạo thành góc chữ V nhọn.',
      },
      {
        stepNumber: 2,
        title: 'Dựng hai vòm tròn hai bên',
        instruction: 'Tạo điểm neo Smooth bên trái và vòm tròn bên phải, cân đối độ cao tay đòn.',
        checkpoint: 'Hai bầu tim căng tròn đều hai bên trục đối xứng.',
      },
      {
        stepNumber: 3,
        title: 'Tạo chóp đáy nhọn và khép kín',
        instruction: 'Click đặt chóp nhọn đáy tim tại (400, 420), bẻ góc nhọn rồi nối về rãnh ban đầu để khép kín.',
        checkpoint: 'Đường viền hình trái tim khép kín hoàn hảo.',
      },
    ],
    successCriteria: [
      'Đường path khép kín 100%',
      'Chóp nhọn đáy và rãnh lõm trên là điểm Cusp/Sharp',
      'Hai bầu tim là điểm Smooth',
      'Đạt điểm đánh giá accuracy >= 80%',
    ],
  },
  {
    id: 'ch-pix-portrait-mask',
    trackId: 'photo',
    titleVi: 'Thử Thách 04: Tách Nền Chân Dung Bằng Mask Phi Phá Hủy',
    subtitleVi: 'Sử dụng Selection Brush, Refine Edge và Layer Mask để tách tóc phức tạp',
    difficulty: 'Intermediate',
    relatedModule: 'P02: Selections, Masks & Refinement',
    estimatedMinutes: 20,
    scenarioOverview: 'Bộ phận biên tập tạp chí cần tách ảnh chân dung người mẫu khỏi phông nền xám phức tạp để ghép vào bìa báo. Yêu cầu 100% không dùng cục tẩy Destructive Eraser.',
    expectedOutcome: 'Layer chân dung gắn kèm Layer Mask đen trắng, viền tóc tơ được giữ nguyên, nền cũ được ẩn hoàn toàn.',
    starterData: {
      type: 'photo_layer',
      defaultViewBox: '0 0 800 600',
      targetTolerancePercent: 85,
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Tạo vùng chọn thô bằng Selection Brush',
        instruction: 'Dùng Selection Brush Tool (phím W) quét chọn thân người và khuôn mặt người mẫu.',
        tip: 'Dùng phím [ và ] để thay đổi nhanh độ rộng nét cọ cho các chi tiết nhỏ.',
        checkpoint: 'Đường kiến bò bao quanh chủ thể người mẫu.',
      },
      {
        stepNumber: 2,
        title: 'Tinh chỉnh viền tóc (Refine Selection)',
        instruction: 'Click nút Refine trên Context Toolbar, dùng cọ Refine quét qua các lọn tóc tơ để thuật toán tính toán độ trong suốt alpha.',
        checkpoint: 'Hộp thoại Refine hiển thị màu mặt nạ đỏ (Matte), các sợi tóc tơ hiện rõ.',
      },
      {
        stepNumber: 3,
        title: 'Xuất ra Layer Mask phi phá hủy',
        instruction: 'Tại mục Output của Refine dialog, chọn "Mask" và nhấn Apply.',
        tip: 'Không chọn "New layer with mask" nếu muốn giữ nguyên cấu trúc layer hiện tại.',
        checkpoint: 'Một icon mặt nạ đen trắng đính kèm bên dưới Layer ảnh gốc.',
      },
    ],
    successCriteria: [
      'Pixel ảnh gốc không bị xóa vĩnh viễn (Non-destructive mask)',
      'Tóc tơ không bị răng cưa hay vệt viền xám',
      'Mặt nạ có sắc độ chuyển êm (soft edges)',
    ],
  },
];
