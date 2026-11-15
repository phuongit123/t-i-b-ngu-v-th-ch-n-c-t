import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Wrench, Terminal } from 'lucide-react';

export interface SearchResultItem {
  id: string;
  category: 'module' | 'tool' | 'doc';
  title: string;
  subtitle: string;
  badge?: string;
}

export interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: SearchResultItem) => void;
}

export const SearchCommand: React.FC<SearchCommandProps> = ({
  isOpen,
  onClose,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');

  // Search examples reference modules that exist in the current 66-lesson curriculum.
  // Product/tool and API identifiers remain in their official English form where useful.
  const searchableItems: SearchResultItem[] = [
    { id: 'D01', category: 'module', title: 'D01: Giao diện Vector và các Persona', subtitle: 'Lộ trình Vector Studio', badge: 'Mô-đun' },
    { id: 'D02', category: 'module', title: 'D02: Pen Tool và các node Vector', subtitle: 'Lộ trình Vector Studio', badge: 'Mô-đun' },
    { id: 'P01', category: 'module', title: 'P01: Giao diện Pixel và các bảng Studio', subtitle: 'Lộ trình Pixel Studio', badge: 'Mô-đun' },
    { id: 'P06', category: 'module', title: 'P06: Live Filters và bộ lọc động', subtitle: 'Lộ trình Pixel Studio', badge: 'Mô-đun' },
    { id: 'B01', category: 'module', title: 'B01: Dàn trang ấn phẩm và lưới văn bản', subtitle: 'Lộ trình Layout Studio — bài học thử nghiệm', badge: 'Mô-đun' },
    { id: 'S01', category: 'module', title: 'S01: Runtime JavaScript V8 và máy chủ MCP', subtitle: 'Nhánh Tự động hóa — bài học thử nghiệm', badge: 'Mô-đun' },
    { id: 'tool-pen', category: 'tool', title: 'Công cụ Pen Tool', subtitle: 'Phím tắt: P (Windows / macOS)', badge: 'Vector' },
    { id: 'tool-node', category: 'tool', title: 'Công cụ Node Tool', subtitle: 'Phím tắt: A (Windows / macOS)', badge: 'Vector' },
    { id: 'tool-inpainting', category: 'tool', title: 'Công cụ Inpainting Brush Tool', subtitle: 'Phím tắt: J (Windows / macOS)', badge: 'Pixel' },
    { id: 'api-render-spread', category: 'doc', title: 'render_spread(uuid, spreadIndex)', subtitle: 'API kết xuất trang trong Affinity MCP', badge: 'API MCP' },
    { id: 'api-execute-script', category: 'doc', title: 'execute_script(script)', subtitle: 'API thực thi JavaScript trong Affinity', badge: 'API MCP' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? searchableItems
    : searchableItems.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.subtitle.toLowerCase().includes(query.toLowerCase())
      );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'module': return <BookOpen className="w-3.5 h-3.5 text-cyan-400" />;
      case 'tool': return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      case 'doc': return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Search className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl bg-surface border border-hairline rounded-sm shadow-card z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm module, công cụ hoặc lệnh API MCP..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1"
            aria-label="Đóng bảng tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Không tìm thấy module hoặc công cụ phù hợp.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xs text-left hover:bg-zinc-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xs bg-zinc-850 flex items-center justify-center shrink-0 border border-hairline">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-850 text-zinc-400 border border-hairline shrink-0 ml-2">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-hairline bg-zinc-950/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Điều hướng bằng chuột hoặc phím mũi tên</span>
          <span>Nhấn ESC để đóng</span>
        </div>
      </div>
    </div>
  );
};
