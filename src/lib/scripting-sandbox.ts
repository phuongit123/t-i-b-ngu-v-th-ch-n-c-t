export interface SandboxArtboard {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export interface SandboxEffects {
  blurRadius?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  glowColor?: string;
  glowBlur?: number;
  bevel?: boolean;
}

export interface SandboxNode {
  id: string;
  kind: 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'cog';
  name: string;
  artboardId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  sides: number;
  points: number;
  teeth: number;
  rotation: number;
  opacity: number;
  effects: SandboxEffects;
}

export interface SandboxLogEntry {
  level: 'info' | 'warn' | 'error';
  text: string;
}

export interface SandboxExecutionResult {
  success: boolean;
  durationMs: number;
  artboards: SandboxArtboard[];
  nodes: SandboxNode[];
  logs: SandboxLogEntry[];
  documentInfo: {
    title: string;
    sessionUuid: string;
    dpi: number;
    units: string;
    pageCount: number;
  };
  errorMessage?: string;
}

export interface PlaygroundPreset {
  id: string;
  title: string;
  subtitle: string;
  code: string;
}

export interface SdkClassDocVi {
  titleVi: string;
  summaryVi: string;
  affinityUsageVi: string;
  sampleCode: string;
}

export const PLAYGROUND_PRESETS: PlaygroundPreset[] = [
  {
    id: 'preset-geometric-series',
    title: '1. Tạo chuỗi hình học xoắn ốc',
    subtitle: 'Sinh hàng loạt ShapeStar & ShapeEllipse đối xứng kèm hiệu ứng OuterGlow',
    code: `// Kịch bản 1: Tạo chuỗi hình học xoắn ốc bằng Affinity Shapes API
const { Application } = require('/application.js');
const { Document } = require('/document.js');
const { ShapeEllipse, ShapeStar } = require('/shapes.js');
const { OuterGlowLayerEffect } = require('/layereffects.js');

const doc = Document.current;
const cx = 400;
const cy = 260;

for (let i = 0; i < 8; i++) {
  const angle = (i * Math.PI * 2) / 8;
  const dist = 125;
  const x = Math.round(cx + Math.cos(angle) * dist);
  const y = Math.round(cy + Math.sin(angle) * dist);

  const ring = ShapeEllipse.create();
  ring.name = "Vòng sáng #" + (i + 1);
  ring.x = x - 34;
  ring.y = y - 34;
  ring.width = 68;
  ring.height = 68;
  ring.fill = i % 2 === 0 ? "#06b6d4" : "#38bdf8";
  ring.stroke = "#e0f2fe";
  ring.opacity = 0.28 + (i * 0.06);
  doc.addNode(ring);
}

const coreStar = ShapeStar.create(8);
coreStar.name = "Ngôi sao trung tâm";
coreStar.x = cx - 72;
coreStar.y = cy - 72;
coreStar.width = 144;
coreStar.height = 144;
coreStar.fill = "#f59e0b";
coreStar.stroke = "#fef08a";
coreStar.strokeWidth = 2.5;
const glow = new OuterGlowLayerEffect("#fbbf24", 18);
coreStar.addEffect(glow);
doc.addNode(coreStar);

console.log("Đã dựng chuỗi 8 vòng elip và Ngôi sao trung tâm trên", doc.title);
console.log("Tổng số đối tượng đang hiển thị:", doc.selectedNodes.length);`,
  },
  {
    id: 'preset-batch-recolor',
    title: '2. Đổi bảng màu hàng loạt',
    subtitle: 'Tạo hệ thẻ bo góc ShapeRectangle và đồng bộ bảng màu Dark Luxury tự động',
    code: `// Kịch bản 2: Dựng hệ thẻ sản phẩm và đổi bảng màu đồng loạt
const { Document } = require('/document.js');
const { ShapeRectangle } = require('/shapes.js');
const { OuterShadowLayerEffect } = require('/layereffects.js');

const doc = Document.current;
const palette = ["#06b6d4", "#38bdf8", "#10b981", "#f59e0b", "#fb7185", "#a78bfa"];

const cards = [];
for (let i = 0; i < 6; i++) {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const card = ShapeRectangle.create();
  card.name = "Thẻ thiết kế 0" + (i + 1);
  card.x = 120 + col * 195;
  card.y = 95 + row * 175;
  card.width = 170;
  card.height = 140;
  card.setRadius(16, 170, 140);
  card.fill = "#27272a";
  card.stroke = "#52525b";
  doc.addNode(card);
  cards.push(card);
}

// Đổi màu hàng loạt theo bảng sắc độ thương hiệu
cards.forEach((node, idx) => {
  const accent = palette[idx % palette.length];
  node.fill = accent + "28";
  node.stroke = accent;
  node.strokeWidth = 2.2;
  node.addEffect(new OuterShadowLayerEffect(accent, 14));
  console.log("Đã áp bảng màu", accent, "cho", node.name);
});`,
  },
  {
    id: 'preset-artboard-grid',
    title: '3. Tự động dàn lưới Artboard',
    subtitle: 'Dùng DocumentCommand.createAddPages sinh lưới đa kích thước Desktop / Mobile',
    code: `// Kịch bản 3: Tự động dàn lưới Artboard đa nền tảng cho thiết kế UI & In ấn
const { Document, DocumentCommand } = require('/document.js');
const { ShapeRectangle, ShapePolygon } = require('/shapes.js');

const doc = Document.current;
const specs = [
  { name: "Desktop Hero (1440px)", x: 70, y: 70, w: 320, h: 185, accent: "#06b6d4" },
  { name: "Tablet Layout (768px)", x: 425, y: 70, w: 180, h: 185, accent: "#38bdf8" },
  { name: "Mobile Story (9:16)", x: 640, y: 70, w: 100, h: 185, accent: "#10b981" },
  { name: "Bìa Tạp Chí A5 (Bleed)", x: 70, y: 290, w: 670, h: 165, accent: "#fb7185" },
];

doc.executeCommand(DocumentCommand.createAddPages(specs.length, specs));

specs.forEach((item, index) => {
  const badge = ShapePolygon.create(6);
  badge.name = "Icon lưới #" + (index + 1);
  badge.x = item.x + 18;
  badge.y = item.y + 42;
  badge.width = 48;
  badge.height = 48;
  badge.fill = item.accent + "33";
  badge.stroke = item.accent;
  doc.addNode(badge);

  const wire = ShapeRectangle.create();
  wire.name = "Khung nội dung " + item.name;
  wire.x = item.x + 80;
  wire.y = item.y + 42;
  wire.width = Math.max(40, item.w - 98);
  wire.height = 48;
  wire.setRadius(8, wire.width, 48);
  wire.fill = "#18181b";
  wire.stroke = item.accent;
  doc.addNode(wire);
});

console.log("Tổng số Artboard đã dàn lưới:", doc.spreads.length);`,
  },
  {
    id: 'preset-inspect-layers',
    title: '4. Kiểm tra cấu trúc Layer & UUID',
    subtitle: 'Trích xuất Session UUID, thông số DPI từ Application & Document và kiểm thử Blur',
    code: `// Kịch bản 4: Kiểm tra cấu trúc tài liệu, Session UUID & hiệu ứng nền
const { Application } = require('/application.js');
const { Document } = require('/document.js');
const { ShapeCog, ShapeRectangle } = require('/shapes.js');
const { GaussianBlurLayerEffect, BevelEmbossLayerEffect } = require('/layereffects.js');

const doc = Document.current;

console.log("=== THÔNG TIN PHIÊN AFFINITY ===");
console.log("Sản phẩm :", Application.productFullName);
console.log("Phiên bản:", Application.version);
console.log("Session  :", doc.sessionUuid);
console.log("Đơn vị   :", doc.units, "| DPI:", doc.dpi);

const bgPlate = ShapeRectangle.create();
bgPlate.name = "Nền kiểm thử Blur";
bgPlate.x = 160;
bgPlate.y = 85;
bgPlate.width = 480;
bgPlate.height = 340;
bgPlate.setRadius(22, 480, 340);
bgPlate.fill = "#0f172a";
bgPlate.stroke = "#334155";
bgPlate.addEffect(new GaussianBlurLayerEffect(4));
doc.addNode(bgPlate);

const gear = ShapeCog.create(12);
gear.name = "Bánh răng hệ thống DOM";
gear.x = 300;
gear.y = 155;
gear.width = 200;
gear.height = 200;
gear.fill = "#10b981";
gear.stroke = "#6ee7b7";
gear.addEffect(new BevelEmbossLayerEffect(0.75));
doc.addNode(gear);

console.log("Hoàn tất kiểm tra", doc.selectedNodes.length, "lớp đối tượng.");`,
  },
];

export const SDK_CLASS_DOCS_VI: Record<string, SdkClassDocVi> = {
  Application: {
    titleVi: 'Điểm truy cập ứng dụng Affinity gốc',
    summaryVi:
      'Cung cấp phiên bản build, đường dẫn thư mục Desktop được cấp phép sandbox, danh sách tài liệu đang mở và hộp thoại giao tiếp người dùng.',
    affinityUsageVi:
      'Luôn là điểm khởi đầu khi viết script kiểm tra môi trường Affinity hoặc ghi tệp xuất hàng loạt ra userDesktopPath.',
    sampleCode: `const { Application } = require('/application.js');
const { Document } = require('/document.js');
const { ShapeRectangle } = require('/shapes.js');

const doc = Document.current;
console.log("Tên ứng dụng:", Application.productFullName);
console.log("Phiên bản:", Application.version);
console.log("Thư mục Desktop:", Application.userDesktopPath);

const card = ShapeRectangle.create();
card.name = Application.productFullName + " v" + Application.buildVersion;
card.x = 220; card.y = 160; card.width = 360; card.height = 180;
card.setRadius(18, 360, 180);
card.fill = "#06b6d430"; card.stroke = "#06b6d4";
doc.addNode(card);`,
  },
  ApplicationDocuments: {
    titleVi: 'Trình quản lý tập tài liệu đang mở',
    summaryVi:
      'Cho phép lấy tài liệu đang kích hoạt (current), duyệt mảng toàn bộ tài liệu đang mở (all) hoặc nạp tệp thiết kế từ ổ đĩa.',
    affinityUsageVi:
      'Dùng khi tự động hóa xử lý hàng loạt trên nhiều file .af cùng lúc (xuất PDF/PNG đồng loạt hoặc kiểm tra sai hệ màu CMYK/sRGB).',
    sampleCode: `const { Application } = require('/application.js');
const { ShapeEllipse } = require('/shapes.js');

const docs = Application.documents;
const doc = docs.current;
console.log("Số tài liệu đang mở:", docs.all.length);
console.log("Tài liệu hiện tại:", doc.title);

const dot = ShapeEllipse.create();
dot.name = "Active Document Marker";
dot.x = 320; dot.y = 180; dot.width = 160; dot.height = 160;
dot.fill = "#10b98133"; dot.stroke = "#10b981";
doc.addNode(dot);`,
  },
  Document: {
    titleVi: 'Đối tượng Tài liệu thiết kế (DOM Root)',
    summaryVi:
      'Đại diện cho tệp đồ họa đang mở: chứa danh sách spreads (trang/artboard), thông số DPI/đơn vị, sessionUuid và phương thức thêm node hoặc chạy lệnh.',
    affinityUsageVi:
      'Dùng Document.current để đọc thông số tài liệu, thêm hình vector bằng addNode() và kích hoạt DocumentCommand.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeStar } = require('/shapes.js');

const doc = Document.current;
console.log("Session UUID:", doc.sessionUuid);
const star = ShapeStar.create(6);
star.name = "DOM Node Mẫu";
star.x = 310; star.y = 170; star.width = 180; star.height = 180;
star.fill = "#06b6d430"; star.stroke = "#22d3ee";
doc.addNode(star);`,
  },
  ShapeRectangle: {
    titleVi: 'Hình chữ nhật tham số & Bo góc tự do',
    summaryVi:
      'Tạo hình chữ nhật tham số hỗ trợ bo góc từng đỉnh hoặc bo góc đồng nhất bằng setRadius(radius, width, height).',
    affinityUsageVi:
      'Tối ưu để sinh tự động khung thẻ UI, bảng lưới danh thiếp, viền khung ảnh báo chí hay nút bấm đồng bộ kích thước.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeRectangle } = require('/shapes.js');

const doc = Document.current;
for (let i = 0; i < 3; i++) {
  const box = ShapeRectangle.create();
  box.name = "Box bo góc r=" + (8 + i * 14);
  box.x = 130 + i * 195; box.y = 170; box.width = 160; box.height = 160;
  box.setRadius(8 + i * 14, 160, 160);
  box.fill = "#06b6d428"; box.stroke = "#22d3ee";
  doc.addNode(box);
}`,
  },
  ShapeEllipse: {
    titleVi: 'Hình Elip & Hình tròn hoàn hảo',
    summaryVi:
      'Khởi tạo đối tượng hình Elip bằng ShapeEllipse.create() với tọa độ khung bao và thuộc tính tô màu / nét viền.',
    affinityUsageVi:
      'Ứng dụng trong tạo huy hiệu tròn, họa tiết hình học đối xứng, vòng tròn trạng thái hoặc mặt nạ khung avatar.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeEllipse } = require('/shapes.js');

const doc = Document.current;
[70, 115, 160].forEach((r, idx) => {
  const el = ShapeEllipse.create();
  el.name = "Vòng tròn đồng tâm #" + (idx + 1);
  el.x = 400 - r; el.y = 260 - r; el.width = r * 2; el.height = r * 2;
  el.fill = "#38bdf818"; el.stroke = "#38bdf8";
  doc.addNode(el);
});`,
  },
  ShapePolygon: {
    titleVi: 'Đa giác đều N cạnh tham số',
    summaryVi:
      'Sinh đa giác đều tùy chọn số cạnh bằng ShapePolygon.create(sides) như tam giác, lục giác hay bát giác.',
    affinityUsageVi:
      'Cực kỳ hữu ích khi dựng lưới tổ ong lục giác (hexagonal pattern), huy hiệu kỹ thuật hoặc biểu tượng công nghệ.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapePolygon } = require('/shapes.js');

const doc = Document.current;
[3, 5, 6, 8].forEach((sides, i) => {
  const poly = ShapePolygon.create(sides);
  poly.name = "Đa giác " + sides + " cạnh";
  poly.x = 90 + i * 165; poly.y = 190; poly.width = 125; poly.height = 125;
  poly.fill = "#10b9812b"; poly.stroke = "#34d399";
  doc.addNode(poly);
});`,
  },
  ShapeStar: {
    titleVi: 'Ngôi sao tham số tùy chỉnh số cánh',
    summaryVi:
      'Tạo hình ngôi sao chuẩn tâm bằng ShapeStar.create(points) dùng cho tem nhãn khuyến mãi, huy hiệu và trang trí vector.',
    affinityUsageVi:
      'Kết hợp vòng lặp để tạo dải sao đánh giá hoặc hoa văn cánh sao nhiều tầng phi phá hủy.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeStar } = require('/shapes.js');

const doc = Document.current;
[5, 7, 10].forEach((pts, i) => {
  const st = ShapeStar.create(pts);
  st.name = "Ngôi sao " + pts + " cánh";
  st.x = 120 + i * 200; st.y = 180; st.width = 150; st.height = 150;
  st.fill = "#f59e0b33"; st.stroke = "#fbbf24";
  doc.addNode(st);
});`,
  },
  ShapeCog: {
    titleVi: 'Hình bánh răng cơ khí (Cog Tool DOM)',
    summaryVi:
      'Khởi tạo bánh răng tham số với số răng tùy biến thông qua ShapeCog.create(teeth).',
    affinityUsageVi:
      'Thường dùng tạo icon cài đặt, họa tiết đồng hồ cơ học hoặc chi tiết kỹ thuật chính xác cao.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeCog } = require('/shapes.js');

const doc = Document.current;
const cog1 = ShapeCog.create(10);
cog1.name = "Bánh răng 10 răng";
cog1.x = 220; cog1.y = 160; cog1.width = 180; cog1.height = 180;
cog1.fill = "#06b6d430"; cog1.stroke = "#22d3ee";
doc.addNode(cog1);

const cog2 = ShapeCog.create(14);
cog2.name = "Bánh răng 14 răng";
cog2.x = 420; cog2.y = 140; cog2.width = 210; cog2.height = 210;
cog2.fill = "#f59e0b30"; cog2.stroke = "#fbbf24";
doc.addNode(cog2);`,
  },
  GaussianBlurLayerEffect: {
    titleVi: 'Hiệu ứng làm mờ Gaussian (Layer FX)',
    summaryVi:
      'Áp hiệu ứng làm mờ mềm phi phá hủy lên bất kỳ lớp Vector hoặc Group nào với bán kính trong dải [0.0, 1024.0].',
    affinityUsageVi:
      'Dùng để tạo hiệu ứng ánh sáng nền (glow backdrop), bóng đổ mềm dưới thẻ UI hoặc chiều sâu không gian.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeEllipse } = require('/shapes.js');
const { GaussianBlurLayerEffect } = require('/layereffects.js');

const doc = Document.current;
const orb = ShapeEllipse.create();
orb.name = "Quả cầu ánh sáng Gaussian Blur";
orb.x = 300; orb.y = 160; orb.width = 200; orb.height = 200;
orb.fill = "#06b6d4aa"; orb.stroke = "#67e8f9";
orb.addEffect(new GaussianBlurLayerEffect(12));
doc.addNode(orb);`,
  },
  OuterShadowLayerEffect: {
    titleVi: 'Hiệu ứng Đổ bóng ngoài (Drop Shadow)',
    summaryVi:
      'Tạo bóng đổ dưới lớp đối tượng với cường độ kiểm chứng [0.0, 1.0] giúp tách bạch thành phần nổi trên giao diện.',
    affinityUsageVi:
      'Rất phổ biến khi áp tự động cho hàng chục nút bấm UI, thẻ sản phẩm hoặc chữ tiêu đề nổi.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeRectangle } = require('/shapes.js');
const { OuterShadowLayerEffect } = require('/layereffects.js');

const doc = Document.current;
const card = ShapeRectangle.create();
card.name = "Thẻ nổi Outer Shadow";
card.x = 240; card.y = 150; card.width = 320; card.height = 200;
card.setRadius(20, 320, 200);
card.fill = "#18181b"; card.stroke = "#06b6d4";
card.addEffect(new OuterShadowLayerEffect("#06b6d4", 24));
doc.addNode(card);`,
  },
  InnerShadowLayerEffect: {
    titleVi: 'Hiệu ứng Đổ bóng trong (Inner Shadow)',
    summaryVi:
      'Tạo cảm giác khoét lõm hoặc viền bóng hắt vào bên trong khung hình vector với cường độ [0.0, 1.0].',
    affinityUsageVi:
      'Dùng cho ô nhập liệu giao diện tối, nút bấm dập chìm hoặc huy hiệu dạng khắc.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeRectangle } = require('/shapes.js');
const { InnerShadowLayerEffect } = require('/layereffects.js');

const doc = Document.current;
const slot = ShapeRectangle.create();
slot.name = "Khung dập chìm Inner Shadow";
slot.x = 220; slot.y = 175; slot.width = 360; slot.height = 150;
slot.setRadius(18, 360, 150);
slot.fill = "#09090b"; slot.stroke = "#3f3f46";
slot.addEffect(new InnerShadowLayerEffect("#00d2ff", 16));
doc.addNode(slot);`,
  },
  OuterGlowLayerEffect: {
    titleVi: 'Hiệu ứng Hào quang phát sáng ngoài',
    summaryVi:
      'Phủ quầng sáng rực quanh đường viền hình học hay chữ typography với cường độ [0.0, 1.0].',
    affinityUsageVi:
      'Tạo ánh đèn neon, điểm nhấn nút CTA hoặc vầng sáng cho ngôi sao/biểu tượng.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapeStar } = require('/shapes.js');
const { OuterGlowLayerEffect } = require('/layereffects.js');

const doc = Document.current;
const star = ShapeStar.create(5);
star.name = "Biểu tượng Neon Outer Glow";
star.x = 300; star.y = 150; star.width = 200; star.height = 200;
star.fill = "#f59e0b44"; star.stroke = "#fbbf24";
star.addEffect(new OuterGlowLayerEffect("#fbbf24", 28));
doc.addNode(star);`,
  },
  BevelEmbossLayerEffect: {
    titleVi: 'Hiệu ứng Nổi khối 3D Bevel / Emboss',
    summaryVi:
      'Thêm cạnh vát ánh sáng nổi khối giả 3D trên hình vector với tham số làm mềm soften trong dải [0.0, 1.0].',
    affinityUsageVi:
      'Thường gắn lên huy hiệu kim loại, nút bấm 3D hoặc bánh răng kỹ thuật.',
    sampleCode: `const { Document } = require('/document.js');
const { ShapePolygon } = require('/shapes.js');
const { BevelEmbossLayerEffect } = require('/layereffects.js');

const doc = Document.current;
const badge = ShapePolygon.create(6);
badge.name = "Huy hiệu nổi khối Bevel";
badge.x = 290; badge.y = 150; badge.width = 220; badge.height = 220;
badge.fill = "#38bdf835"; badge.stroke = "#7dd3fc";
badge.addEffect(new BevelEmbossLayerEffect(0.85));
doc.addNode(badge);`,
  },
  DocumentCommand: {
    titleVi: 'Bộ lệnh cấp hệ thống tài liệu (Commands)',
    summaryVi:
      'Thực thi các tác vụ cấp cấu trúc tài liệu như thêm trang, xóa trang, gắn Master Page hoặc chạy lệnh lọc raster hàng loạt.',
    affinityUsageVi:
      'Dùng khi khởi tạo tự động dàn trang tạp chí nhiều trang, chèn hàng loạt Artboard chuẩn kích thước bằng script.',
    sampleCode: `const { Document, DocumentCommand } = require('/document.js');
const { ShapeRectangle } = require('/shapes.js');

const doc = Document.current;
doc.executeCommand(DocumentCommand.createAddPages(2, [
  { name: "Trang bìa A5 (Lệnh DOM)", x: 80, y: 90, w: 300, h: 330, accent: "#06b6d4" },
  { name: "Trang mục lục (Lệnh DOM)", x: 420, y: 90, w: 300, h: 330, accent: "#f59e0b" },
]));

const box = ShapeRectangle.create();
box.name = "Khung tiêu đề trang";
box.x = 105; box.y = 140; box.width = 250; box.height = 70;
box.setRadius(8, 250, 70);
box.fill = "#06b6d430"; box.stroke = "#22d3ee";
doc.addNode(box);

console.log("Số lượng trang/spread hiện tại:", doc.spreads.length);`,
  },
};

const BLOCKED_GLOBALS_REGEX =
  /\b(window|document|globalThis|localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|WebSocket|importScripts|Function|eval|__proto__|constructor)\b/;

/**
 * Removes comments and string literals before scanning for forbidden browser globals,
 * so valid Affinity module paths like require('/document.js') are allowed while actual DOM access is blocked.
 */
function stripCommentsAndStrings(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ' ')
    .replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '""');
}

/**
 * Runs bundled Affinity DOM examples against the browser-only mock API.
 */
export function runAffinityDomSandbox(code: string): SandboxExecutionResult {
  const startMs = performance.now();
  const logs: SandboxLogEntry[] = [];
  const artboards: SandboxArtboard[] = [
    {
      id: 'spread-1',
      name: 'Artboard 01 — Không gian thiết kế chính (800×520)',
      x: 40,
      y: 35,
      width: 720,
      height: 450,
      fill: '#0d0d12',
    },
  ];
  const nodes: SandboxNode[] = [];

  const documentInfo = {
    title: 'TapChi_ThietKe_Master.afdesign',
    sessionUuid: '695C8818-C576-40BA-A670-7D2D1A87A8B0',
    dpi: 300,
    units: 'Pixels',
    pageCount: 1,
  };

  if (BLOCKED_GLOBALS_REGEX.test(stripCommentsAndStrings(code))) {
    return {
      success: false,
      durationMs: Math.round(performance.now() - startMs),
      artboards,
      nodes,
      logs: [
        {
          level: 'error',
          text: 'Bị chặn bởi Sandbox: Không được phép truy cập biến DOM trình duyệt, mạng hoặc bộ nhớ ngoài trong mã Affinity DOM API.',
        },
      ],
      documentInfo,
      errorMessage: 'Vi phạm quy tắc cô lập Sandbox (Blocked Global API).',
    };
  }

  // Mocked Safe SDK Factories
  class BaseEffect {
    kind: string;
    color: string;
    value: number;
    constructor(kind: string, color: string, value: number) {
      this.kind = kind;
      this.color = color;
      this.value = value;
    }
  }

  class GaussianBlurLayerEffect extends BaseEffect {
    constructor(radius: number = 8) {
      super('blur', '#ffffff', Math.max(0, Math.min(1024, Number(radius) || 0)));
    }
  }
  class OuterShadowLayerEffect extends BaseEffect {
    constructor(color: string = '#000000', blur: number = 16) {
      super('shadow', color, Math.max(0, Math.min(64, Number(blur) || 12)));
    }
  }
  class InnerShadowLayerEffect extends BaseEffect {
    constructor(color: string = '#06b6d4', blur: number = 12) {
      super('innerShadow', color, Math.max(0, Math.min(48, Number(blur) || 10)));
    }
  }
  class OuterGlowLayerEffect extends BaseEffect {
    constructor(color: string = '#fbbf24', blur: number = 20) {
      super('glow', color, Math.max(0, Math.min(64, Number(blur) || 16)));
    }
  }
  class BevelEmbossLayerEffect extends BaseEffect {
    constructor(soften: number = 0.6) {
      super('bevel', '#ffffff', Math.max(0, Math.min(1, Number(soften) || 0.6)));
    }
  }

  const makeShapeNode = (
    kind: SandboxNode['kind'],
    extras?: Partial<SandboxNode>
  ) => {
    const node = {
      id: `node-${nodes.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
      kind,
      name: `${kind}-${nodes.length + 1}`,
      x: 320,
      y: 180,
      width: 140,
      height: 140,
      fill: '#06b6d433',
      stroke: '#06b6d4',
      strokeWidth: 2,
      cornerRadius: 0,
      sides: extras?.sides ?? 6,
      points: extras?.points ?? 5,
      teeth: extras?.teeth ?? 10,
      rotation: 0,
      opacity: 1,
      effects: {} as SandboxEffects,
      setRadius(radius: number) {
        this.cornerRadius = Math.max(0, Number(radius) || 0);
      },
      addEffect(fx: BaseEffect) {
        if (!fx || typeof fx !== 'object') return;
        if (fx.kind === 'blur') this.effects.blurRadius = fx.value;
        else if (fx.kind === 'shadow' || fx.kind === 'innerShadow') {
          this.effects.shadowColor = fx.color;
          this.effects.shadowBlur = fx.value;
          this.effects.shadowOffsetX = 0;
          this.effects.shadowOffsetY = fx.kind === 'shadow' ? 6 : 0;
        } else if (fx.kind === 'glow') {
          this.effects.glowColor = fx.color;
          this.effects.glowBlur = fx.value;
        } else if (fx.kind === 'bevel') {
          this.effects.bevel = true;
        }
      },
    };
    return node;
  };

  const ShapeRectangle = { create: () => makeShapeNode('rectangle') };
  const ShapeEllipse = { create: () => makeShapeNode('ellipse') };
  const ShapePolygon = {
    create: (sides: number = 6) =>
      makeShapeNode('polygon', { sides: Math.max(3, Math.min(16, Number(sides) || 6)) }),
  };
  const ShapeStar = {
    create: (points: number = 5) =>
      makeShapeNode('star', { points: Math.max(3, Math.min(16, Number(points) || 5)) }),
  };
  const ShapeCog = {
    create: (teeth: number = 10) =>
      makeShapeNode('cog', { teeth: Math.max(4, Math.min(24, Number(teeth) || 10)) }),
  };

  const DocumentCommand = {
    createAddPages: (
      count: number,
      specs?: Array<{ name?: string; x?: number; y?: number; w?: number; h?: number; accent?: string }>
    ) => ({
      type: 'addPages',
      count: Math.max(1, Math.min(8, Number(count) || 1)),
      specs,
    }),
    createDeletePages: (count: number) => ({ type: 'deletePages', count }),
    createAddMasterPages: (count: number) => ({ type: 'addMasterPages', count }),
    createFeatherRasterSelectionCommand: () => ({ type: 'feather' }),
    createGenerativeUpscaleCommand: () => ({ type: 'upscale' }),
    createImageTraceCommand: () => ({ type: 'trace' }),
    createMixedLightCorrectionCommand: () => ({ type: 'mixedLight' }),
    createRasterMLDenoiseCommand: () => ({ type: 'denoise' }),
    createRasterFloodFillCommand: () => ({ type: 'floodFill' }),
    createRasterFloodSelectCommand: () => ({ type: 'floodSelect' }),
  };

  const currentDoc = {
    get title() {
      return documentInfo.title;
    },
    get name() {
      return documentInfo.title;
    },
    get sessionUuid() {
      return documentInfo.sessionUuid;
    },
    get persistentUuid() {
      return '8E24B12F-A409-4D13-91D2-0F2C815D0001';
    },
    get widthPixels() {
      return 800;
    },
    get heightPixels() {
      return 520;
    },
    get dpi() {
      return documentInfo.dpi;
    },
    get viewDpi() {
      return 72;
    },
    get units() {
      return documentInfo.units;
    },
    get isDirty() {
      return nodes.length > 0;
    },
    get isReadOnly() {
      return false;
    },
    get spreads() {
      return artboards;
    },
    get spreadCount() {
      return artboards.length;
    },
    get pageCount() {
      return artboards.length;
    },
    get selectedNodes() {
      return nodes;
    },
    addNode(def: ReturnType<typeof makeShapeNode>) {
      if (!def || typeof def !== 'object') return def;
      const normalized: SandboxNode = {
        id: String(def.id),
        kind: def.kind,
        name: String(def.name ?? def.kind),
        x: Number(def.x) || 0,
        y: Number(def.y) || 0,
        width: Math.max(12, Number(def.width) || 100),
        height: Math.max(12, Number(def.height) || 100),
        fill: String(def.fill ?? '#06b6d433'),
        stroke: String(def.stroke ?? '#06b6d4'),
        strokeWidth: Math.max(0.5, Number(def.strokeWidth) || 2),
        cornerRadius: Math.max(0, Number(def.cornerRadius) || 0),
        sides: def.sides ?? 6,
        points: def.points ?? 5,
        teeth: def.teeth ?? 10,
        rotation: Number(def.rotation) || 0,
        opacity: Math.max(0.05, Math.min(1, Number(def.opacity) || 1)),
        effects: { ...(def.effects ?? {}) },
      };
      nodes.push(normalized);
      return def;
    },
    executeCommand(cmd: { type: string; count?: number; specs?: Array<{ name?: string; x?: number; y?: number; w?: number; h?: number; accent?: string }> }) {
      if (!cmd) return;
      if (cmd.type === 'addPages') {
        if (Array.isArray(cmd.specs) && cmd.specs.length > 0) {
          artboards.length = 0;
          cmd.specs.forEach((s, idx) => {
            artboards.push({
              id: `spread-${idx + 1}`,
              name: s.name ?? `Artboard ${idx + 1}`,
              x: s.x ?? 60 + idx * 180,
              y: s.y ?? 70,
              width: s.w ?? 160,
              height: s.h ?? 200,
              fill: '#121218',
            });
          });
        } else {
          const n = cmd.count ?? 1;
          for (let i = 0; i < n; i++) {
            artboards.push({
              id: `spread-${artboards.length + 1}`,
              name: `Artboard ${artboards.length + 1}`,
              x: 60 + ((artboards.length - 1) % 3) * 230,
              y: 60 + Math.floor((artboards.length - 1) / 3) * 200,
              width: 210,
              height: 170,
              fill: '#121218',
            });
          }
        }
        documentInfo.pageCount = artboards.length;
      }
    },
  };

  const ApplicationDocuments = {
    get current() {
      return currentDoc;
    },
    get all() {
      return [currentDoc];
    },
    load(path: string) {
      logs.push({ level: 'info', text: `[Mock Load] Đã mở tài liệu mẫu: ${path}` });
      return currentDoc;
    },
  };

  const Application = {
    version: 'Affinity 3.3.3.5004 Win32 (Oct 30 2026)',
    productFullName: 'Affinity',
    buildVersion: 3,
    platformName: 'Windows 11 (Trình duyệt Sandbox)',
    userDesktopPath: 'C:\\Users\\HocVien\\Desktop',
    resourcesPath: 'C:\\Program Files\\Affinity\\Resources',
    documents: ApplicationDocuments,
    settings: { uiTheme: 'Dark', units: 'Pixels' },
    alert: (msg: string) => logs.push({ level: 'info', text: `[Alert] ${msg}` }),
    confirm: (msg: string) => {
      logs.push({ level: 'info', text: `[Confirm] ${msg}` });
      return true;
    },
    prompt: (_msg: string, _title?: string, def: string = '') => def,
    chooseFile: () => 'sample.afdesign',
  };

  const sandboxRequire = (modPath: string): Record<string, unknown> => {
    switch (modPath) {
      case '/application.js':
        return { Application, ApplicationDocuments };
      case '/document.js':
        return { Document: ApplicationDocuments, DocumentCommand };
      case '/shapes.js':
        return { ShapeRectangle, ShapeEllipse, ShapePolygon, ShapeStar, ShapeCog };
      case '/layereffects.js':
        return {
          GaussianBlurLayerEffect,
          OuterShadowLayerEffect,
          InnerShadowLayerEffect,
          OuterGlowLayerEffect,
          BevelEmbossLayerEffect,
        };
      case '/commands.js':
        return { DocumentCommand };
      default:
        logs.push({ level: 'warn', text: `Cảnh báo: Module "${modPath}" không có trong Sandbox SDK.` });
        return {};
    }
  };

  const formatArg = (arg: unknown): string => {
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  };

  const sandboxConsole = {
    log: (...args: unknown[]) =>
      logs.push({ level: 'info', text: args.map(formatArg).join(' ') }),
    info: (...args: unknown[]) =>
      logs.push({ level: 'info', text: args.map(formatArg).join(' ') }),
    warn: (...args: unknown[]) =>
      logs.push({ level: 'warn', text: args.map(formatArg).join(' ') }),
    error: (...args: unknown[]) =>
      logs.push({ level: 'error', text: args.map(formatArg).join(' ') }),
  };

  try {
    const examples = [...PLAYGROUND_PRESETS.map(item => item.code), ...Object.values(SDK_CLASS_DOCS_VI).map(item => item.sampleCode)];
    if (!examples.includes(code)) {
      throw new Error('Chỉ chạy được các ví dụ có sẵn. Hãy chọn ví dụ hoặc khôi phục mã mẫu.');
    }
    const runner = new Function(
      'require',
      'console',
      'window',
      'document',
      'globalThis',
      'self',
      'fetch',
      'XMLHttpRequest',
      'localStorage',
      'sessionStorage',
      `"use strict";\n${code}`
    );

    runner(
      sandboxRequire,
      sandboxConsole,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    return {
      success: true,
      durationMs: Math.max(1, Math.round(performance.now() - startMs)),
      artboards,
      nodes,
      logs,
      documentInfo,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logs.push({ level: 'error', text: `Lỗi thực thi: ${message}` });
    return {
      success: false,
      durationMs: Math.round(performance.now() - startMs),
      artboards,
      nodes,
      logs,
      documentInfo,
      errorMessage: message,
    };
  }
}

/**
 * Draws the simulated Affinity document spread and all generated DOM scene nodes onto a 2D canvas.
 */
export function renderSandboxSceneToCanvas(
  ctx: CanvasRenderingContext2D,
  result: SandboxExecutionResult,
  width: number = 800,
  height: number = 520
): void {
  ctx.clearRect(0, 0, width, height);

  // Dark canvas workspace + subtle dot grid
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let gy = 20; gy < height; gy += 20) {
    for (let gx = 20; gx < width; gx += 20) {
      ctx.fillRect(gx, gy, 1.5, 1.5);
    }
  }

  // Draw Artboards / Spreads
  for (const ab of result.artboards) {
    ctx.save();
    ctx.fillStyle = ab.fill;
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1.2;
    ctx.fillRect(ab.x, ab.y, ab.width, ab.height);
    ctx.strokeRect(ab.x, ab.y, ab.width, ab.height);

    ctx.font = '11px ui-monospace, monospace';
    ctx.fillStyle = '#a1a1aa';
    ctx.fillText(ab.name, ab.x, Math.max(16, ab.y - 8));
    ctx.restore();
  }

  // Draw DOM Shape Nodes
  for (const node of result.nodes) {
    ctx.save();
    ctx.globalAlpha = node.opacity;

    if (node.effects.blurRadius && node.effects.blurRadius > 0) {
      ctx.filter = `blur(${Math.min(18, node.effects.blurRadius)}px)`;
    }
    if (node.effects.glowColor && node.effects.glowBlur) {
      ctx.shadowColor = node.effects.glowColor;
      ctx.shadowBlur = node.effects.glowBlur;
    } else if (node.effects.shadowColor && node.effects.shadowBlur) {
      ctx.shadowColor = node.effects.shadowColor;
      ctx.shadowBlur = node.effects.shadowBlur;
      ctx.shadowOffsetX = node.effects.shadowOffsetX ?? 0;
      ctx.shadowOffsetY = node.effects.shadowOffsetY ?? 4;
    }

    const cx = node.x + node.width / 2;
    const cy = node.y + node.height / 2;
    const rx = node.width / 2;
    const ry = node.height / 2;

    ctx.beginPath();
    if (node.kind === 'rectangle') {
      const r = Math.min(node.cornerRadius, node.width / 2, node.height / 2);
      ctx.roundRect(node.x, node.y, node.width, node.height, r);
    } else if (node.kind === 'ellipse') {
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    } else if (node.kind === 'polygon') {
      const sides = Math.max(3, node.sides);
      for (let i = 0; i < sides; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / sides;
        const px = cx + Math.cos(a) * rx;
        const py = cy + Math.sin(a) * ry;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else if (node.kind === 'star') {
      const pts = Math.max(3, node.points);
      const total = pts * 2;
      for (let i = 0; i < total; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / pts;
        const factor = i % 2 === 0 ? 1 : 0.44;
        const px = cx + Math.cos(a) * rx * factor;
        const py = cy + Math.sin(a) * ry * factor;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else if (node.kind === 'cog') {
      const teeth = Math.max(4, node.teeth);
      const steps = teeth * 4;
      for (let i = 0; i < steps; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / steps;
        const mod = i % 4;
        const factor = mod === 0 || mod === 1 ? 1 : 0.74;
        const px = cx + Math.cos(a) * rx * factor;
        const py = cy + Math.sin(a) * ry * factor;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      // Center hole
      ctx.moveTo(cx + rx * 0.28, cy);
      ctx.arc(cx, cy, Math.min(rx, ry) * 0.28, 0, Math.PI * 2, true);
    }

    ctx.fillStyle = node.fill;
    ctx.fill('evenodd');

    ctx.lineWidth = node.strokeWidth;
    ctx.strokeStyle = node.stroke;
    ctx.stroke();

    if (node.effects.bevel) {
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }
}
