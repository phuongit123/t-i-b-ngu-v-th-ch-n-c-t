import { SimulatorExercise } from './types';

export const SIMULATOR_EXERCISES: SimulatorExercise[] = [
  {
    id: 'ex-d02-diamond',
    title: 'D02: Sharp Diamond Polygon',
    subtitle: 'Luyện tập đặt điểm neo Sharp góc nhọn và đóng đường path khép kín',
    difficulty: 'Beginner',
    relatedLesson: 'D02-01: Pen Tool Fundamentals',
    description:
      'Tập làm quen với thao tác cơ bản nhất của Pen Tool: Click đơn để đặt các điểm neo Sharp (không có tay đòn Bézier), sau đó di chuột về điểm xuất phát để đóng kín hình thoi.',
    tolerance: 20,
    hints: [
      'Chọn Pen Tool (phím P)',
      'Click lần lượt 4 đỉnh mà không kéo rê chuột',
      'Hover vào điểm đầu tiên và click khi thấy chỉ báo để đóng kín path',
      'Dùng Node Tool (phím A) để tinh chỉnh vị trí các đỉnh nếu bị lệch',
    ],
    targetCurve: {
      id: 'target-diamond',
      isClosed: true,
      nodes: [
        {
          id: 't-d-1',
          point: { x: 400, y: 120 },
          type: 'sharp',
        },
        {
          id: 't-d-2',
          point: { x: 580, y: 260 },
          type: 'sharp',
        },
        {
          id: 't-d-3',
          point: { x: 400, y: 400 },
          type: 'sharp',
        },
        {
          id: 't-d-4',
          point: { x: 220, y: 260 },
          type: 'sharp',
        },
      ],
    },
  },
  {
    id: 'ex-d03-wave',
    title: 'D03: Smooth S-Wave Curve',
    subtitle: 'Luyện tập kéo tay đòn Bézier đối xứng (Smooth handles)',
    difficulty: 'Intermediate',
    relatedLesson: 'D03-01: Smooth Nodes & Continuity',
    description:
      'Khám phá sức mạnh đường cong mượt mà. Click và kéo chuột tại mỗi điểm neo để kéo dài tay cầm Bézier, tạo ra đường lượn sóng hình chữ S mềm mại.',
    tolerance: 22,
    hints: [
      'Chọn Pen Tool (phím P)',
      'Click và kéo rê chuột theo hướng tiếp tuyến của sóng',
      'Độ dài tay đòn tỉ lệ thuận với độ phồng của đường cong',
      'Nhấn phím Enter hoặc phím Esc khi hoàn thành để kết thúc đường path hở',
    ],
    targetCurve: {
      id: 'target-wave',
      isClosed: false,
      nodes: [
        {
          id: 't-w-1',
          point: { x: 180, y: 320 },
          handleOut: { x: 260, y: 170 },
          type: 'smooth',
        },
        {
          id: 't-w-2',
          point: { x: 400, y: 260 },
          handleIn: { x: 320, y: 370 },
          handleOut: { x: 480, y: 150 },
          type: 'smooth',
        },
        {
          id: 't-w-3',
          point: { x: 620, y: 200 },
          handleIn: { x: 540, y: 330 },
          type: 'smooth',
        },
      ],
    },
  },
  {
    id: 'ex-d03-heart',
    title: 'D03: Heart Silhouette (Cusp & Smooth)',
    subtitle: 'Kết hợp điểm gãy góc nhọn Cusp và cánh cung Smooth đối xứng',
    difficulty: 'Advanced',
    relatedLesson: 'D03-02: Cusp & Smart Nodes',
    description:
      'Thử thách kết hợp đỉnh gập gãy (Cusp node) ở rãnh giữa và chóp đáy của hình trái tim, cùng hai vành cung tròn mềm mại được kiểm soát bởi các điểm neo Smooth.',
    tolerance: 25,
    hints: [
      'Rãnh trên (400, 190) và chóp nhọn dưới (400, 420) là Sharp / Cusp node',
      'Hai bên vành tim là Smooth node với tay đòn dọc thẳng đứng',
      'Dùng phím Alt khi kéo tay cầm để bẻ gãy góc (Cusp handle)',
      'Đóng kín đường cong ở điểm rãnh trên cùng',
    ],
    targetCurve: {
      id: 'target-heart',
      isClosed: true,
      nodes: [
        {
          id: 't-h-1',
          point: { x: 400, y: 190 },
          handleIn: { x: 370, y: 160 },
          handleOut: { x: 430, y: 160 },
          type: 'sharp',
        },
        {
          id: 't-h-2',
          point: { x: 540, y: 240 },
          handleIn: { x: 540, y: 160 },
          handleOut: { x: 540, y: 320 },
          type: 'smooth',
        },
        {
          id: 't-h-3',
          point: { x: 400, y: 420 },
          handleIn: { x: 450, y: 380 },
          handleOut: { x: 350, y: 380 },
          type: 'sharp',
        },
        {
          id: 't-h-4',
          point: { x: 260, y: 240 },
          handleIn: { x: 260, y: 320 },
          handleOut: { x: 260, y: 160 },
          type: 'smooth',
        },
      ],
    },
  },
];
