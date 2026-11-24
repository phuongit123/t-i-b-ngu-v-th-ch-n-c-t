import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Search,
  FileCode,
  BookOpen,
  Keyboard,
  Layers,
  ExternalLink,
  Laptop,
  Apple,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import {
  OFFICIAL_SHORTCUTS,
  CHEATSHEET_SECTIONS,
  GLOSSARY_TERMS,
} from '@/data/knowledge-hub-data';
import { getLessonById } from '@/data/curriculum/index';
import { lessonTranslationsVi } from '@/data/curriculum/translationsVi';
import { getLessonCanonicalPath, getRoutePath } from '@/lib/seo-router';
import { usePreferences, formatShortcutForOs } from '@/lib/preferences-context';

export type KnowledgeTab = 'search' | 'shortcuts' | 'cheatsheet' | 'glossary';

export interface KnowledgePageProps {
  initialTab?: KnowledgeTab;
  onNavigate?: (route: string) => void;
  onLaunchLesson?: (lessonId: string) => void;
}

const TAB_TO_ROUTE: Record<KnowledgeTab, string> = {
  search: 'knowledge',
  shortcuts: 'shortcuts',
  cheatsheet: 'cheatsheet',
  glossary: 'glossary',
};

export const KnowledgePage: React.FC<KnowledgePageProps> = ({
  initialTab = 'search',
  onNavigate,
  onLaunchLesson,
}) => {
  const { preferences, updatePreferences } = usePreferences();
  const [activeTab, setActiveTab] = useState<KnowledgeTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudio, setSelectedStudio] = useState<'all' | 'layout' | 'vector' | 'pixel'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const osPlatform = preferences.shortcutModifier;

  // Sync tab with props if changed externally
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Combined search across all knowledge domains
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { shortcuts: [], cheatsheets: [], glossary: [] };

    const q = searchQuery.toLowerCase().trim();

    const matchedShortcuts = OFFICIAL_SHORTCUTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.winKey.toLowerCase().includes(q) ||
        s.macKey.toLowerCase().includes(q)
    );

    const matchedGlossary = GLOSSARY_TERMS.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.termVi.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );

    const matchedCheatsheets = CHEATSHEET_SECTIONS.flatMap((sec) =>
      sec.items
        .filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            (item.tips && item.tips.toLowerCase().includes(q))
        )
        .map((item) => ({ ...item, sectionTitle: sec.titleVi, studio: sec.studio }))
    );

    return {
      shortcuts: matchedShortcuts,
      cheatsheets: matchedCheatsheets,
      glossary: matchedGlossary,
    };
  }, [searchQuery]);

  const totalSearchResults =
    searchResults.shortcuts.length +
    searchResults.cheatsheets.length +
    searchResults.glossary.length;

  // Filtered Shortcuts
  const filteredShortcuts = useMemo(() => {
    return OFFICIAL_SHORTCUTS.filter((sc) => {
      if (selectedStudio !== 'all' && sc.studio !== selectedStudio && sc.studio !== 'all') {
        return false;
      }
      if (selectedCategory !== 'all' && sc.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          sc.name.toLowerCase().includes(q) ||
          sc.description.toLowerCase().includes(q) ||
          sc.winKey.toLowerCase().includes(q) ||
          sc.macKey.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedStudio, selectedCategory, searchQuery]);

  // Filtered Glossary
  const filteredGlossary = useMemo(() => {
    return GLOSSARY_TERMS.filter((g) => {
      if (selectedCategory !== 'all' && g.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          g.term.toLowerCase().includes(q) ||
          g.termVi.toLowerCase().includes(q) ||
          g.definition.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trung Tâm Tri Thức & Tra Cứu Toàn Diện"
        description="Tra cứu phím tắt chính thức, bảng tóm tắt quy tắc đồ họa, từ điển thuật ngữ tư duy thiết kế và tìm kiếm nhanh trên toàn hệ thống."
        badge="Trung tâm tra cứu · 4 phân hệ kiến thức"
      />

      {/* Navigation Sub-Tabs & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[var(--color-border-hairline)] pb-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'search', label: '1. Tìm kiếm tri thức', icon: <Search className="w-3.5 h-3.5" /> },
            { id: 'shortcuts', label: '2. Bảng phím tắt', icon: <Keyboard className="w-3.5 h-3.5" /> },
            { id: 'cheatsheet', label: '3. Bảng tóm tắt (CheatSheet)', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'glossary', label: '4. Từ điển thuật ngữ', icon: <BookOpen className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                const nextTab = tab.id as KnowledgeTab;
                setActiveTab(nextTab);
                setSelectedCategory('all');
                if (typeof window !== 'undefined') {
                  const targetPath = getRoutePath(TAB_TO_ROUTE[nextTab]);
                  if (window.location.pathname !== targetPath) {
                    window.history.replaceState(null, '', targetPath);
                  }
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* External Jump to Encyclopedia */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('encyclopedia')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-cyan-300 border border-[var(--color-border-hairline)] hover:border-cyan-500/40 bg-[var(--color-surface)] transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mở Bách khoa thư DOM API</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: KNOWLEDGE SEARCH */}
          {/* ========================================================= */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search Input Box */}
              <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm phím tắt, phép toán boolean, thuật ngữ thiết kế, mặt nạ, bleed..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      autoFocus
                    />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg"
                    >
                      Xóa tìm kiếm
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className="text-zinc-500">Gợi ý từ khóa:</span>
                  {['Pen Tool', 'Boolean', 'Bleed', 'Curves', 'Layer Mask', 'Compound', 'Develop', 'PDF/X-4'].map(
                    (kw) => (
                      <button
                        key={kw}
                        onClick={() => setSearchQuery(kw)}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-[11px]"
                      >
                        {kw}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Search Results Display */}
              {searchQuery.trim() ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-mono text-zinc-400">
                      Tìm thấy <strong className="text-cyan-400">{totalSearchResults}</strong> kết quả cho từ khóa "{searchQuery}"
                    </span>
                  </div>

                  {totalSearchResults === 0 ? (
                    <EmptyState
                      icon={<Search className="w-6 h-6 text-zinc-500" />}
                      title="Không tìm thấy kết quả phù hợp"
                      description={`Không có phím tắt, bảng tra cứu hay thuật ngữ nào khớp với từ khóa "${searchQuery}". Vui lòng thử từ khóa khác hoặc duyệt theo danh mục.`}
                    />
                  ) : (
                    <div className="space-y-6">
                      {/* Matched Shortcuts */}
                      {searchResults.shortcuts.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                            <Keyboard className="w-3.5 h-3.5" />
                            Phím tắt ({searchResults.shortcuts.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {searchResults.shortcuts.map((sc) => (
                              <div
                                key={sc.id}
                                className="p-4 rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] flex items-start justify-between gap-3"
                              >
                                <div className="space-y-1 min-w-0">
                                  <h4 className="text-xs font-bold text-zinc-200">{sc.name}</h4>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed">{sc.description}</p>
                                </div>
                                <kbd className="shrink-0 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-mono text-emerald-400 font-bold shadow-sm">
                                  {formatShortcutForOs(sc.winKey, sc.macKey, osPlatform)}
                                </kbd>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matched Cheatsheets */}
                      {searchResults.cheatsheets.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5" />
                            Quy tắc &amp; Bảng tóm tắt ({searchResults.cheatsheets.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {searchResults.cheatsheets.map((cs, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-zinc-200">{cs.title}</span>
                                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{cs.sectionTitle}</span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">{cs.description}</p>
                                {cs.tips && (
                                  <p className="text-[10px] text-emerald-400/90 font-mono italic">Mẹo: {cs.tips}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matched Glossary */}
                      {searchResults.glossary.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5" />
                            Thuật ngữ chuyên ngành ({searchResults.glossary.length})
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {searchResults.glossary.map((gl) => (
                              <div
                                key={gl.id}
                                className="p-4 rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-zinc-100">{gl.term}</span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                                    {gl.category}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed">{gl.definition}</p>
                                <p className="text-[11px] text-zinc-500 italic">Bối cảnh áp dụng: {gl.exampleContext}</p>
                                <div className="pt-2 border-t border-zinc-800/70 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                                  {gl.relatedLessonIds.map((lId) => {
                                    const lessonObj = getLessonById(lId);
                                    const href = getLessonCanonicalPath(lessonObj ?? lId);
                                    const lTitle = lessonTranslationsVi[lId] || lessonObj?.title || lId;
                                    return (
                                      <a
                                        key={lId}
                                        href={href}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onLaunchLesson?.(lId);
                                        }}
                                        className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                                      >
                                        Bài học {lId}: {lTitle}
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Default View: Quick Stats & Categories */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setActiveTab('shortcuts')}
                    className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] hover:border-cyan-500/40 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Keyboard className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs font-mono text-zinc-500">{OFFICIAL_SHORTCUTS.length} phím tắt</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-200">Bảng Phím Tắt Chính Thức</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Phím tắt chuẩn xác minh trên Affinity Studio Desktop cho Vector, Pixel và Layout Studio.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('cheatsheet')}
                    className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] hover:border-purple-500/40 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Layers className="w-5 h-5 text-purple-400" />
                      <span className="text-xs font-mono text-zinc-500">{CHEATSHEET_SECTIONS.length} chủ đề</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-200">Bảng Tra Cứu Quy Tắc Đồ Họa</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Phép toán Boolean, phân loại Node Bézier, chế độ hòa trộn lớp và chuẩn xuất bản in.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('glossary')}
                    className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] hover:border-amber-500/40 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-mono text-zinc-500">{GLOSSARY_TERMS.length} mục từ</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-200">Từ Điển Thuật Ngữ Thiết Kế</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Khái niệm Design Thinking 8 bước, Bleed, Curves, Histogram và nguyên lý phi phá hủy.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SHORTCUTS DIRECTORY */}
          {/* ========================================================= */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              {/* Studio Filter & Platform OS Switch */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)]">
                {/* Studio Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs font-mono text-zinc-500 mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Studio:
                  </span>
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'vector', label: 'Vector Studio' },
                    { id: 'pixel', label: 'Pixel Studio' },
                    { id: 'layout', label: 'Layout Studio' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudio(s.id as typeof selectedStudio)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                        selectedStudio === s.id
                          ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* OS Toggle */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    data-testid="knowledge-os-windows"
                    onClick={() => updatePreferences({ shortcutModifier: 'windows' })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                      osPlatform === 'windows'
                        ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Windows (Ctrl)</span>
                  </button>
                  <button
                    type="button"
                    data-testid="knowledge-os-mac"
                    onClick={() => updatePreferences({ shortcutModifier: 'mac' })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                      osPlatform === 'mac'
                        ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Apple className="w-3.5 h-3.5" />
                    <span>macOS (Cmd)</span>
                  </button>
                </div>
              </div>

              {/* Shortcuts Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredShortcuts.map((sc) => (
                  <div
                    key={sc.id}
                    className="p-4 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] hover:border-zinc-700 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-100">{sc.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase">
                          {sc.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{sc.description}</p>
                      <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Nguồn: {sc.evidenceSource}</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <kbd className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-emerald-400 font-bold shadow-sm whitespace-nowrap">
                        {formatShortcutForOs(sc.winKey, sc.macKey, osPlatform)}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>

              {filteredShortcuts.length === 0 && (
                <EmptyState
                  icon={<Keyboard className="w-6 h-6 text-zinc-500" />}
                  title="Không có phím tắt phù hợp"
                  description="Hãy thử đổi bộ lọc Studio hoặc tìm kiếm bằng từ khóa khác."
                />
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CHEATSHEETS */}
          {/* ========================================================= */}
          {activeTab === 'cheatsheet' && (
            <div className="space-y-8">
              {CHEATSHEET_SECTIONS.map((section) => (
                <div
                  key={section.id}
                  className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4"
                >
                  <div className="border-b border-zinc-800 pb-3">
                    <h3 className="text-base font-bold text-zinc-100">{section.titleVi}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{section.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                    {section.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-bold text-zinc-200">{item.title}</h4>
                            {item.badge && (
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-300 leading-relaxed">{item.description}</p>
                        </div>

                        {item.tips && (
                          <div className="pt-2 border-t border-zinc-800/80 text-[10px] font-mono text-emerald-400/90 leading-relaxed">
                            Mẹo: {item.tips}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: GLOSSARY */}
          {/* ========================================================= */}
          {activeTab === 'glossary' && (
            <div className="space-y-6">
              {/* Category Filter for Glossary */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-4 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)]">
                <span className="text-xs font-mono text-zinc-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Phân nhóm:
                </span>
                {[
                  'all',
                  'Design Thinking',
                  'Vector Studio',
                  'Pixel Studio',
                  'Layout Studio',
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả thuật ngữ' : cat}
                  </button>
                ))}
              </div>

              {/* Glossary Terms List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGlossary.map((term) => (
                  <div
                    key={term.id}
                    className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] hover:border-zinc-700 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-2.5">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100">{term.term}</h4>
                        <span className="text-xs text-zinc-400">{term.termVi}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-cyan-300 border border-zinc-800">
                        {term.category}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">{term.definition}</p>

                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <div className="text-zinc-500 font-mono">
                        <strong>Công cụ liên quan:</strong> {term.relatedTools.join(', ')}
                      </div>
                      <div className="text-emerald-400/90 font-mono text-[10px] italic">
                        Ví dụ: {term.exampleContext}
                      </div>
                    </div>

                    {/* Silo Internal Links to Lessons & Interactive Practice */}
                    <div className="pt-2.5 border-t border-zinc-800/80 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      {term.relatedLessonIds.map((lId) => {
                        const lessonObj = getLessonById(lId);
                        const href = getLessonCanonicalPath(lessonObj ?? lId);
                        const lTitle = lessonTranslationsVi[lId] || lessonObj?.title || lId;
                        return (
                          <a
                            key={lId}
                            href={href}
                            data-testid={`glossary-silo-lesson-${lId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onLaunchLesson?.(lId);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                          >
                            <span>Học ngay {lId}: {lTitle}</span>
                          </a>
                        );
                      })}
                      {term.relatedPracticeRoute && (
                        <a
                          href={getRoutePath(term.relatedPracticeRoute)}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate?.(term.relatedPracticeRoute!);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                        >
                          <span>
                            {term.relatedPracticeRoute === 'capstone'
                              ? 'Mở Đồ án A5'
                              : term.relatedPracticeRoute === 'playground'
                              ? 'Mở Thực hành DOM'
                              : 'Mở Phòng mô phỏng'}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredGlossary.length === 0 && (
                <EmptyState
                  icon={<BookOpen className="w-6 h-6 text-zinc-500" />}
                  title="Không tìm thấy thuật ngữ"
                  description="Hãy thử chọn danh mục khác hoặc xóa bộ lọc tìm kiếm."
                />
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default KnowledgePage;
