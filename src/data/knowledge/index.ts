/**
 * AFFINITY ACADEMY — KNOWLEDGE DATASET
 * Verified shortcuts, cheatsheets, and glossary terms for
 * Layout Studio, Vector Studio, Pixel Studio, and Design Thinking.
 */

export interface ShortcutItem {
  id: string;
  name: string;
  category: 'Tools' | 'Selection' | 'View' | 'Editing' | 'Layers' | 'Geometry';
  studio: 'layout' | 'vector' | 'pixel' | 'all';
  winKey: string;
  macKey: string;
  description: string;
  evidenceSource: string;
}

export interface CheatSheetSection {
  id: string;
  titleVi: string;
  studio: 'layout' | 'vector' | 'pixel' | 'all';
  description: string;
  items: {
    title: string;
    description: string;
    badge?: string;
    codeOrRule?: string;
    tips?: string;
  }[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  termVi: string;
  category: 'Design Thinking' | 'Vector Studio' | 'Pixel Studio' | 'Layout Studio' | 'Production & Color';
  definition: string;
  relatedTools: string[];
  exampleContext: string;
}

// ---------------------------------------------------------------------------
// 1. OFFICIAL SHORTCUTS DATASET (Verified against Affinity Studio Desktop & Help Center)
// ---------------------------------------------------------------------------
export const OFFICIAL_SHORTCUTS: ShortcutItem[] = [
  // Vector Studio Tools
  {
    id: 'sc-vec-01',
    name: 'Move Tool (Công cụ di chuyển & chọn)',
    category: 'Tools',
    studio: 'vector',
    winKey: 'V',
    macKey: 'V',
    description: 'Chọn đối tượng, dịch chuyển, xoay và thay đổi kích thước trên khung vẽ.',
    evidenceSource: 'Affinity Help Center - Move Tool',
  },
  {
    id: 'sc-vec-02',
    name: 'Node Tool (Công cụ chỉnh sửa điểm neo)',
    category: 'Tools',
    studio: 'vector',
    winKey: 'A',
    macKey: 'A',
    description: 'Chọn và điều chỉnh điểm neo, bẻ tay đòn Bézier và uốn cong đoạn path.',
    evidenceSource: 'Affinity Help Center - Node Tool',
  },
  {
    id: 'sc-vec-03',
    name: 'Pen Tool (Công cụ vẽ đường cong Bézier)',
    category: 'Tools',
    studio: 'vector',
    winKey: 'P',
    macKey: 'P',
    description: 'Đặt điểm neo nhọn (click) hoặc kéo tạo đường cong tiếp tuyến (click & drag).',
    evidenceSource: 'Affinity Help Center - Pen Tool',
  },
  {
    id: 'sc-vec-04',
    name: 'Corner Tool (Công cụ bo góc thông minh)',
    category: 'Tools',
    studio: 'vector',
    winKey: 'C',
    macKey: 'C',
    description: 'Kéo bo góc trực quan cho đa giác và đường cong (Rounded, Concave, Straight, Cutout).',
    evidenceSource: 'Affinity Help Center - Corner Tool',
  },
  {
    id: 'sc-vec-05',
    name: 'Convert to Curves (Chuyển hình khối sang đường cong)',
    category: 'Geometry',
    studio: 'vector',
    winKey: 'Ctrl + Enter',
    macKey: 'Cmd + Return',
    description: 'Chuyển hình học tham số (Rectangle, Ellipse, Star) thành đường cong Bézier có thể sửa điểm neo.',
    evidenceSource: 'Serif Desktop Standard Keyboard Map',
  },
  {
    id: 'sc-vec-06',
    name: 'Compound Geometry (Tạo hình hợp nhất phi phá hủy)',
    category: 'Geometry',
    studio: 'vector',
    winKey: 'Menu Layer > Create Compound',
    macKey: 'Menu Layer > Create Compound',
    description: 'Tạo đối tượng Compound bảo toàn các hình khối con độc lập bên trong.',
    evidenceSource: 'Affinity Help Center - Compound Shapes',
  },

  // Pixel Studio Tools
  {
    id: 'sc-pix-01',
    name: 'Selection Brush Tool (Cọ quét chọn thông minh)',
    category: 'Selection',
    studio: 'pixel',
    winKey: 'W',
    macKey: 'W',
    description: 'Quét chọn vùng ảnh dựa trên thuật toán nhận diện biên độ tương phản màu sắc.',
    evidenceSource: 'Affinity Help Center - Selection Brush',
  },
  {
    id: 'sc-pix-02',
    name: 'Brush Size Decrease / Increase (Tăng giảm kích thước cọ)',
    category: 'Tools',
    studio: 'pixel',
    winKey: '[ / ]',
    macKey: '[ / ]',
    description: 'Điều chỉnh đường kính đầu cọ Selection Brush hoặc Paint Brush nhanh chóng.',
    evidenceSource: 'Affinity Desktop Standard Interaction',
  },
  {
    id: 'sc-pix-03',
    name: 'Invert Selection (Đảo ngược vùng chọn)',
    category: 'Selection',
    studio: 'pixel',
    winKey: 'Ctrl + Shift + I',
    macKey: 'Cmd + Shift + I',
    description: 'Đảo ngược vùng chọn từ chủ thể sang hậu cảnh hoặc ngược lại.',
    evidenceSource: 'Affinity Help Center - Pixel Selections',
  },
  {
    id: 'sc-pix-04',
    name: 'Deselect (Hủy vùng chọn)',
    category: 'Selection',
    studio: 'pixel',
    winKey: 'Ctrl + D',
    macKey: 'Cmd + D',
    description: 'Xóa bỏ toàn bộ đường kiến bò của vùng chọn hiện tại.',
    evidenceSource: 'Affinity Help Center - Pixel Selections',
  },
  {
    id: 'sc-pix-05',
    name: 'Curves Adjustment (Hiệu chỉnh đường cong sắc độ)',
    category: 'Layers',
    studio: 'pixel',
    winKey: 'Ctrl + M',
    macKey: 'Cmd + M',
    description: 'Mở hộp thoại Curves để tinh chỉnh độ tương phản RGB hoặc từng kênh màu.',
    evidenceSource: 'Affinity Help Center - Curves Adjustment',
  },
  {
    id: 'sc-pix-06',
    name: 'New Live Filter Layer (Bộ lọc trực tiếp phi phá hủy)',
    category: 'Layers',
    studio: 'pixel',
    winKey: 'Layer > New Live Filter Layer',
    macKey: 'Layer > New Live Filter Layer',
    description: 'Chèn bộ lọc Lighting, Gaussian Blur, Unsharp Mask dưới dạng layer có mask tích hợp.',
    evidenceSource: 'Affinity Help Center - Live Filters',
  },

  // Layout Studio Tools
  {
    id: 'sc-lay-01',
    name: 'Frame Text Tool (Khung văn bản dàn trang)',
    category: 'Tools',
    studio: 'layout',
    winKey: 'T',
    macKey: 'T',
    description: 'Tạo khung chứa văn bản dạng đoạn, hỗ trợ liên kết dòng chảy giữa các trang (flowing text).',
    evidenceSource: 'Affinity Help Center - Text Frames',
  },
  {
    id: 'sc-lay-02',
    name: 'Glyph Browser (Bảng duyệt ký tự đặc biệt)',
    category: 'View',
    studio: 'layout',
    winKey: 'Window > Text > Glyph Browser',
    macKey: 'Window > Text > Glyph Browser',
    description: 'Duyệt và chèn các ký tự đặc biệt, OpenType alternates và dấu ngoặc bản quyền.',
    evidenceSource: 'Affinity Help Center - Glyph Browser',
  },
  {
    id: 'sc-lay-03',
    name: 'Toggle Snapping (Bật/tắt chế độ hít nam châm)',
    category: 'View',
    studio: 'all',
    winKey: ';',
    macKey: ';',
    description: 'Bật hoặc tắt nhanh tính năng hít theo lưới, lề trang (bleed/margin) và điểm neo.',
    evidenceSource: 'Affinity Help Center - Snapping Manager',
  },
  {
    id: 'sc-lay-04',
    name: 'Zoom to Fit Spread (Phóng to vừa trang đôi)',
    category: 'View',
    studio: 'all',
    winKey: 'Ctrl + 0',
    macKey: 'Cmd + 0',
    description: 'Căn chỉnh toàn bộ trang đôi hoặc artboard hiện tại vừa khít khung nhìn làm việc.',
    evidenceSource: 'Standard Canvas Navigation',
  },
  {
    id: 'sc-lay-05',
    name: 'Duplicate in Place (Nhân bản tại chỗ)',
    category: 'Editing',
    studio: 'all',
    winKey: 'Ctrl + J',
    macKey: 'Cmd + J',
    description: 'Nhân bản layer hoặc đối tượng được chọn, ghi nhớ bước biến đổi kế tiếp (Power Duplicate).',
    evidenceSource: 'Affinity Help Center - Duplicating Objects',
  },
];

// ---------------------------------------------------------------------------
// 2. CHEATSHEETS DATASET
// ---------------------------------------------------------------------------
export const CHEATSHEET_SECTIONS: CheatSheetSection[] = [
  {
    id: 'cs-boolean',
    titleVi: 'Phép Toán Hình Học Vector (Boolean Operations)',
    studio: 'vector',
    description: 'Quy tắc kết hợp các hình khối cơ bản thành hình khối phức tạp trong Vector Studio.',
    items: [
      {
        title: 'Add (Hợp nhất)',
        description: 'Gộp hai hoặc nhiều hình chồng lấn thành một đường cong duy nhất bao phủ diện tích chung.',
        badge: 'Destructive / Non-destructive with Compound',
        codeOrRule: 'Layer > Geometry > Add',
        tips: 'Tạo đối tượng Compound để giữ nguyên khả năng tinh chỉnh từng hình khối con.',
      },
      {
        title: 'Subtract (Loại trừ)',
        description: 'Lấy hình nằm dưới trừ đi phần diện tích giao nhau với hình nằm trên.',
        badge: 'Cutout Rule',
        codeOrRule: 'Layer > Geometry > Subtract',
        tips: 'Hình trên cùng luôn đóng vai trò là "khuôn cắt".',
      },
      {
        title: 'Intersect (Giao thoa)',
        description: 'Chỉ giữ lại phần diện tích chung nơi tất cả các hình được chọn cùng chồng lấn.',
        badge: 'Common Area',
        codeOrRule: 'Layer > Geometry > Intersect',
      },
      {
        title: 'XOR (Loại bỏ phần giao)',
        description: 'Giữ lại các phần không giao nhau và tạo ra lỗ rỗng tại vị trí các hình chồng chéo.',
        badge: 'Even-Odd Rule',
        codeOrRule: 'Layer > Geometry > Xor',
      },
      {
        title: 'Divide (Chia cắt rời)',
        description: 'Cắt tất cả các hình tại các giao điểm thành nhiều mảnh độc lập.',
        badge: 'All Pieces',
        codeOrRule: 'Layer > Geometry > Divide',
      },
    ],
  },
  {
    id: 'cs-nodes',
    titleVi: 'Phân Loại Điểm Neo Bézier (Node Types & Handles)',
    studio: 'vector',
    description: 'Các loại điểm neo quyết định tính liên tục và độ mượt mà của đường cong vector.',
    items: [
      {
        title: 'Sharp Node (Điểm neo góc nhọn)',
        description: 'Không có tay đòn hoặc hai tay đòn độc lập không phụ thuộc góc nhau (Cusp). Tạo các góc gập nhọn và cạnh gấp khúc.',
        badge: 'Góc gập',
        tips: 'Giữ Alt khi kéo tay đòn bằng Node Tool để bẻ gãy góc tạo Cusp.',
      },
      {
        title: 'Smooth Node (Điểm neo đường cong mượt)',
        description: 'Hai tay đòn nằm thẳng hàng (tiếp tuyến $180^\\circ$). Khi xoay một tay đòn, tay đòn đối diện tự động xoay theo.',
        badge: 'Mượt mà',
        tips: 'Độ dài tay đòn quyết định bán kính phồng của đường lượn sóng.',
      },
      {
        title: 'Smart Node (Điểm neo tính toán tự động)',
        description: 'Thuật toán nội suy của Affinity tự động tính toán góc tiếp tuyến tối ưu dựa trên vị trí hai điểm neo lân cận.',
        badge: 'Tự động',
        tips: 'Rất hữu ích khi vẽ phác thảo nhanh đường viền cong phức tạp.',
      },
    ],
  },
  {
    id: 'cs-blend-modes',
    titleVi: 'Chế Độ Hòa Trộn Lớp Ảnh (Layer Blend Modes)',
    studio: 'pixel',
    description: 'Cơ chế tính toán sắc độ giữa lớp trên (Blend Layer) và lớp dưới (Base Layer).',
    items: [
      {
        title: 'Multiply (Làm tối)',
        description: 'Nhân các giá trị màu sắc: màu trắng ($1.0$) biến mất thành trong suốt, màu đen ($0.0$) giữ nguyên.',
        badge: 'Darken Group',
        tips: 'Dùng để ghép chữ đen, tạo bóng đổ hoặc ghép texture lên bề mặt sáng.',
      },
      {
        title: 'Screen (Làm sáng)',
        description: 'Nghịch đảo nhân rồi nghịch đảo lại: màu đen biến mất, màu trắng giữ nguyên.',
        badge: 'Lighten Group',
        tips: 'Lý tưởng để ghép tia sáng, đốm pháo hoa, khói hoặc hạt bụi phát sáng.',
      },
      {
        title: 'Overlay (Tăng tương phản trung thực)',
        description: 'Kết hợp Multiply cho vùng tối và Screen cho vùng sáng. Màu xám trung tính $50\\%$ biến mất.',
        badge: 'Contrast Group',
        tips: 'Tạo độ đanh và thêm texture chất liệu mà không làm bạc màu ảnh.',
      },
      {
        title: 'Luminosity (Hòa trộn độ sáng)',
        description: 'Chỉ áp dụng độ sáng/tối của layer trên, giữ nguyên màu sắc và độ bão hòa của layer dưới.',
        badge: 'Component Group',
        tips: 'Dùng khi chỉnh tương phản bằng Curves mà không muốn làm sai lệch màu sắc da người.',
      },
    ],
  },
  {
    id: 'cs-export',
    titleVi: 'Chuẩn Xuất Bản Đồ Họa & In Ấn (Production Profiles)',
    studio: 'layout',
    description: 'Thông số kỹ thuật chuẩn quốc tế khi bàn giao file thiết kế cho in ấn và kỹ thuật số.',
    items: [
      {
        title: 'PDF/X-4:2010 (Chuẩn in ấn thương mại)',
        description: 'Hỗ trợ không gian màu CMYK chuẩn in, độ phân giải 300 DPI, vùng tràn lề Bleed 3mm, bảo toàn layer trong suốt.',
        badge: 'Commercial Print',
        tips: 'Luôn kiểm tra Convert Text to Curves nếu xưởng in không cài font thương hiệu.',
      },
      {
        title: 'WebP (Định dạng ảnh số hiện đại)',
        description: 'Nén lossy hoặc lossless tối ưu cho web, dung lượng nhỏ hơn JPEG 30% mà vẫn giữ được độ sắc nét và alpha trong suốt.',
        badge: 'Digital Web',
        tips: 'Độ nén khuyến nghị từ 80% đến 85% để cân bằng dung lượng và chất lượng.',
      },
      {
        title: 'SVG (Vector chuẩn web)',
        description: 'Dữ liệu đường cong XML độ phân giải độc lập, giữ nguyên cấu trúc nhóm và tên layer semantic.',
        badge: 'Web Vector',
        tips: 'Bật Flatten Transforms để tránh lỗi rendering trên các trình duyệt cũ.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 3. GLOSSARY DATASET (Design Thinking & Affinity Technical Terms)
// ---------------------------------------------------------------------------
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Design Thinking Framework
  {
    id: 'gl-dt-01',
    term: 'Design Thinking (Tư duy Thiết kế)',
    termVi: 'Chu trình tư duy thiết kế 8 bước',
    category: 'Design Thinking',
    definition: 'Phương pháp giải quyết vấn đề lấy con người làm trung tâm, trải qua 8 bước: Discover → Define → Explore → Plan → Create → Evaluate → Iterate → Deliver.',
    relatedTools: ['Tất cả các Studio', 'Rubric Đồ án A5'],
    exampleContext: 'Thay vì mở phần mềm và vẽ ngẫu hứng, nhà thiết kế giải mã Brief trước để xác định tiêu chí thành công.',
  },
  {
    id: 'gl-dt-02',
    term: 'Brief Deconstruction (Giải mã Đề bài)',
    termVi: 'Phân rã yêu cầu khách hàng',
    category: 'Design Thinking',
    definition: 'Quá trình bóc tách 6 thành phần cốt lõi của một đề tài: Khách hàng, Mục tiêu, Khán giả, Thông điệp, Ràng buộc kỹ thuật và Tiêu chí đo lường (PLO-07).',
    relatedTools: ['brief-deconstruction.md'],
    exampleContext: 'Xác định rõ bảng màu cà phê di sản và quy chuẩn in ấn trước khi phác thảo logo.',
  },
  {
    id: 'gl-dt-03',
    term: 'Technical Critique & Iteration (Phản biện & Sửa đổi)',
    termVi: 'Vòng lặp sửa đổi có đối chiếu',
    category: 'Design Thinking',
    definition: 'Hành vi đối chiếu bản phác thảo Draft 1 với tiêu chuẩn kỹ thuật, phát hiện ít nhất 3 lỗi kỹ thuật và viết nhật ký sửa đổi có dẫn chứng (PLO-08).',
    relatedTools: ['iteration-critique-log.md'],
    exampleContext: 'Phát hiện clipping ở kênh đỏ của poster và dùng Curves cục bộ để hồi phục chi tiết điểm cháy sáng.',
  },

  // Technical Studio Terms
  {
    id: 'gl-tech-01',
    term: 'Bleed (Tràn lề in ấn)',
    termVi: 'Vùng tràn lề kỹ thuật',
    category: 'Layout Studio',
    definition: 'Khoảng diện tích mở rộng ra ngoài đường cắt thành phẩm (thường là 3mm), đảm bảo khi máy xén giấy xê dịch sẽ không để lại vệt trắng mép giấy.',
    relatedTools: ['Document Setup', 'Spread Setup', 'PDF/X Export'],
    exampleContext: 'Các hình ảnh nền và mảng màu chạm mép ấn phẩm phải được kéo phủ hết đường chỉ đỏ Bleed.',
  },
  {
    id: 'gl-tech-02',
    term: 'Bézier Curve (Đường cong Bézier)',
    termVi: 'Đường cong tham số điều khiển bằng tay đòn',
    category: 'Vector Studio',
    definition: 'Mô hình toán học tạo ra đường cong mượt mà thông qua điểm neo (Anchor Node) và các tay đòn tiếp tuyến (Control Handles).',
    relatedTools: ['Pen Tool', 'Node Tool', 'PenNodeSimulator'],
    exampleContext: 'Điều chỉnh độ dài tay đòn để tăng giảm độ cong mà không làm tăng số lượng điểm neo không cần thiết.',
  },
  {
    id: 'gl-tech-03',
    term: 'Non-Destructive Editing (Chỉnh sửa phi phá hủy)',
    termVi: 'Nguyên lý bảo toàn dữ liệu gốc',
    category: 'Pixel Studio',
    definition: 'Kỹ thuật xử lý hình ảnh sử dụng Layer Masks, Adjustment Layers và Live Filters, cho phép sửa đổi hoặc hoàn tác bất kỳ lúc nào mà không làm mất pixel ảnh mộc.',
    relatedTools: ['Layer Masks', 'Live Filter Layers', 'PhotoLayerSimulator'],
    exampleContext: 'Tô cọ đen trên Mask để ẩn đối tượng thay vì dùng Eraser Tool xóa vĩnh viễn pixel.',
  },
  {
    id: 'gl-tech-04',
    term: 'Develop Studio (Không gian tráng ảnh RAW)',
    termVi: 'Phân hệ xử lý dữ liệu cảm biến ảnh mộc',
    category: 'Pixel Studio',
    definition: 'Studio chuyên biệt trong Affinity Photo dùng để giải mã tệp ảnh RAW từ máy ảnh, hỗ trợ cân bằng trắng, kiểm soát dải động (Dynamic Range) và xuất lớp ảnh Pixel hoặc RAW liên kết.',
    relatedTools: ['Develop Studio', 'Basic Panel', 'Tones Panel'],
    exampleContext: 'Mở ảnh mộc Cold Brew trong Develop Studio để cứu chi tiết vùng tối trước khi chuyển sang Pixel Studio.',
  },
  {
    id: 'gl-tech-05',
    term: 'Compound Shape (Hình khối hợp nhất động)',
    termVi: 'Đối tượng vector kết hợp bảo toàn',
    category: 'Vector Studio',
    definition: 'Hình khối được tạo ra từ nhiều đường cong vector thông qua phép toán Boolean (Add, Subtract) nhưng vẫn cho phép nhấp đúp chọn và chỉnh sửa hình con bên trong.',
    relatedTools: ['Create Compound', 'Boolean Engine'],
    exampleContext: 'Dựng biểu tượng logo chữ A bằng Compound để có thể thay đổi độ dày thanh ngang sau này.',
  },
  {
    id: 'gl-tech-06',
    term: 'Glyph Browser (Bảng duyệt ký tự font)',
    termVi: 'Bảng tra cứu ký tự đặc biệt',
    category: 'Layout Studio',
    definition: 'Bảng điều khiển cho phép người dùng khám phá toàn bộ bộ ký tự (Glyphs) của font chữ, bao gồm chữ hoa nhỏ (Small Caps), chữ ghép (Ligatures) và biểu tượng tiền tệ.',
    relatedTools: ['Window > Text > Glyph Browser', 'Context Toolbar'],
    exampleContext: 'Chèn ký tự bản quyền © và dấu gạch dài Em Dash (—) chính xác vào văn bản menu.',
  },
  {
    id: 'gl-tech-07',
    term: 'Snapping & Pixel Alignment (Hít nam châm & Căn lưới)',
    termVi: 'Hệ thống gióng hàng tự động',
    category: 'Vector Studio',
    definition: 'Công cụ hỗ trợ hít điểm neo và cạnh đối tượng vào lề trang, trục tọa độ, tâm đối tượng hoặc lưới pixel hoàn hảo (Force Pixel Alignment).',
    relatedTools: ['Snapping Manager', 'Move Tool'],
    exampleContext: 'Bật Force Pixel Alignment khi vẽ biểu tượng vector cho web để tránh đường viền bị mờ đục.',
  },
  {
    id: 'gl-tech-08',
    term: 'Tone Curve & Histogram (Đường cong sắc độ & Biểu đồ phân bổ)',
    termVi: 'Phân tích và điều chỉnh phân bố ánh sáng',
    category: 'Pixel Studio',
    definition: 'Histogram biểu diễn mật độ điểm ảnh từ vùng tối đen (Shadows) đến vùng sáng trắng (Highlights). Curves cho phép uốn đường dốc để tăng tương phản chữ S.',
    relatedTools: ['Histogram Panel', 'Curves Adjustment', 'Levels'],
    exampleContext: 'Nhìn vào Histogram để nhận biết ảnh bị cháy sáng (clipping ở cạnh phải) và kéo đỉnh Curve xuống để xử lý.',
  },
];
