import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, BookOpen, Wrench, Terminal, PlayCircle, Bookmark } from 'lucide-react';
import { ALL_PILOT_MODULES, ALL_PILOT_LESSONS } from '@/data/curriculum/index';
import { moduleTranslationsVi, lessonTranslationsVi } from '@/data/curriculum/translationsVi';
import { OFFICIAL_SHORTCUTS, GLOSSARY_TERMS } from '@/data/knowledge-hub-data';
import { usePreferences, formatShortcutForOs } from '@/lib/preferences-context';
import apiReference from '../../../AFFINITY_DOM_API_REFERENCE.json';

export interface SearchResultItem {
  id: string;
  category: 'lesson' | 'module' | 'tool' | 'glossary' | 'doc';
  title: string;
  subtitle: string;
  badge?: string;
  keywords?: string;
}

export interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: SearchResultItem) => void;
}

interface ApiReferenceShape {
  modules: Record<
    string,
    {
      nativeModule: string;
      classes?: Record<string, { factory?: string; property?: string }>;
    }
  >;
}

const normalizeSearchText = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const TRACK_LABELS_VI: Record<string, string> = {
  designer: 'Vector Studio',
  photo: 'Pixel Studio',
  publisher: 'Layout Studio',
  scripting: 'Tự động hóa & MCP',
};

export const SearchCommand: React.FC<SearchCommandProps> = ({
  isOpen,
  onClose,
  onSelectItem,
}) => {
  const { preferences } = usePreferences();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const searchableItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. All 22 modules
    for (const mod of ALL_PILOT_MODULES) {
      const modNumber = mod.moduleNumber || mod.id;
      const modVi = moduleTranslationsVi[mod.id];
      items.push({
        id: mod.id,
        category: 'module',
        title: `${modNumber}: ${modVi?.title || mod.title}`,
        subtitle: `${TRACK_LABELS_VI[mod.trackId] || mod.trackId} · ${mod.lessons.length} bài học`,
        badge: 'Học phần',
        keywords: `${mod.id} ${modNumber} ${mod.title} ${mod.description} ${mod.primaryPersona ?? ''}`,
      });
    }

    // 2. All 66 lessons
    for (const les of ALL_PILOT_LESSONS) {
      const lesVi = lessonTranslationsVi[les.id] || les.title;
      const toolName = les.standardSections?.toolAndFeatureExplanation?.toolName ?? '';
      items.push({
        id: les.id,
        category: 'lesson',
        title: `${les.id}: ${lesVi}`,
        subtitle: `${TRACK_LABELS_VI[les.trackId] || les.trackId} · ${les.durationMinutes} phút`,
        badge: 'Bài học',
        keywords: `${les.id} ${les.title} ${les.subtitle ?? ''} ${toolName}`,
      });
    }

    // 3. Official shortcuts (OS-aware)
    for (const sc of OFFICIAL_SHORTCUTS) {
      const keyLabel = formatShortcutForOs(sc.winKey, sc.macKey, preferences.shortcutModifier);
      items.push({
        id: sc.id,
        category: 'tool',
        title: sc.name,
        subtitle: `Phím tắt (${preferences.shortcutModifier === 'mac' ? 'macOS' : 'Windows'}): ${keyLabel}`,
        badge: 'Phím tắt',
        keywords: `${sc.description} ${sc.winKey} ${sc.macKey}`,
      });
    }

    // 4. Glossary terms
    for (const gl of GLOSSARY_TERMS) {
      items.push({
        id: gl.id,
        category: 'glossary',
        title: gl.term,
        subtitle: `${gl.termVi} · ${gl.category}`,
        badge: 'Thuật ngữ',
        keywords: `${gl.definition} ${gl.relatedTools.join(' ')}`,
      });
    }

    // 5. SDK API classes
    const ref = apiReference as ApiReferenceShape;
    for (const [moduleId, modData] of Object.entries(ref.modules ?? {})) {
      for (const className of Object.keys(modData.classes ?? {})) {
        items.push({
          id: `${moduleId}.${className}`,
          category: 'doc',
          title: className,
          subtitle: `DOM API · ${modData.nativeModule}`,
          badge: 'DOM API',
          keywords: `${moduleId} ${className} ${modData.nativeModule}`,
        });
      }
    }

    return items;
  }, [preferences.shortcutModifier]);

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Show helpful curated subset first when search bar is empty
      return searchableItems.slice(0, 14);
    }
    const qLower = trimmed.toLowerCase();
    const qNorm = normalizeSearchText(trimmed);

    return searchableItems
      .filter((item) => {
        const haystack = `${item.title} ${item.subtitle} ${item.keywords ?? ''}`;
        return (
          haystack.toLowerCase().includes(qLower) ||
          normalizeSearchText(haystack).includes(qNorm)
        );
      })
      .slice(0, 24);
  }, [query, searchableItems]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
        return;
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        onSelectItem(filtered[activeIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filtered, activeIndex, onSelectItem]);

  if (!isOpen) return null;

  const getCategoryIcon = (cat: SearchResultItem['category']) => {
    switch (cat) {
      case 'lesson':
        return <PlayCircle className="w-3.5 h-3.5 text-sky-400" />;
      case 'module':
        return <BookOpen className="w-3.5 h-3.5 text-cyan-400" />;
      case 'tool':
        return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      case 'glossary':
        return <Bookmark className="w-3.5 h-3.5 text-purple-400" />;
      case 'doc':
        return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm nhanh toàn hệ thống"
        className="relative w-full max-w-xl bg-surface border border-hairline rounded-sm shadow-card z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Tìm nhanh trong ${searchableItems.length} bài học, học phần, phím tắt, thuật ngữ & API...`}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1"
            aria-label="Đóng bảng tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Không tìm thấy bài học, học phần, công cụ hoặc tài liệu API phù hợp.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map((item, idx) => (
                <button
                  type="button"
                  key={`${item.category}-${item.id}`}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xs text-left transition-colors group ${
                    idx === activeIndex ? 'bg-zinc-800/90' : 'hover:bg-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xs bg-zinc-850 flex items-center justify-center shrink-0 border border-hairline">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-zinc-400 truncate">{item.subtitle}</p>
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

        <div className="px-4 py-2 border-t border-hairline bg-zinc-950/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Dùng ↑ ↓ và Enter để mở nhanh kết quả</span>
          <span>Nhấn ESC để đóng</span>
        </div>
      </div>
    </div>
  );
};
