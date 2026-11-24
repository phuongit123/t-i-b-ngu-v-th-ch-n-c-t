import React, { useMemo, useState } from 'react';
import { BookOpen, Braces, CheckCircle2, Code2, Play, Search, Sparkles } from 'lucide-react';
import apiReference from '../../AFFINITY_DOM_API_REFERENCE.json';
import { PageHeader } from '../components/layout/PageHeader';
import { SDK_CLASS_DOCS_VI } from '@/lib/scripting-sandbox';

type ApiMember = {
  name: string;
  type?: string;
  params?: string[];
  returns?: string;
  note?: string;
  verifiedValue?: string;
};
type ApiClass = {
  factory?: string;
  properties?: ApiMember[];
  methods?: ApiMember[];
  staticMethods?: string[] | ApiMember[];
  property?: string;
  range?: string;
};
type ApiModule = {
  path: string;
  nativeModule: string;
  status: string;
  classes: Record<string, ApiClass>;
};
type ApiReference = {
  metadata: { version: string; totalTopics: number; extractedAt: string; environment: string };
  modules: Record<string, ApiModule>;
};

export interface EncyclopediaPageProps {
  onOpenInPlayground?: (className: string) => void;
}

const reference = apiReference as ApiReference;

const moduleLabels: Record<string, string> = {
  application: 'Ứng dụng (Application)',
  document: 'Tài liệu (Document)',
  shapes: 'Hình học (Shapes)',
  layereffects: 'Hiệu ứng Layer (Effects)',
  commands: 'Lệnh hệ thống (Commands)',
};

const statusLabelsVi: Record<string, string> = {
  VERIFIED_LIVE: 'Đã xác thực thực tế',
  DOCUMENTED_AND_SAMPLED: 'Đã biên soạn tài liệu & mẫu',
  DOCUMENTED_PARAM_RANGES_VERIFIED: 'Đã xác thực dải thông số',
  DOCUMENTED: 'Đã lập tài liệu SDK',
};

export const EncyclopediaPage: React.FC<EncyclopediaPageProps> = ({ onOpenInPlayground }) => {
  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const entries = useMemo(
    () =>
      Object.entries(reference.modules).flatMap(([moduleId, module]) =>
        Object.entries(module.classes ?? {}).map(([className, definition]) => ({
          id: `${moduleId}.${className}`,
          moduleId,
          module,
          className,
          definition,
        }))
      ),
    []
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (moduleFilter !== 'all' && entry.moduleId !== moduleFilter) return false;
      if (!normalized) return true;
      const viDoc = SDK_CLASS_DOCS_VI[entry.className];
      const searchable = [
        entry.className,
        entry.moduleId,
        entry.module.nativeModule,
        entry.definition.factory,
        entry.definition.property,
        entry.definition.range,
        viDoc?.titleVi,
        viDoc?.summaryVi,
        ...(entry.definition.properties ?? []).flatMap((item) => [item.name, item.type, item.note]),
        ...(entry.definition.methods ?? []).flatMap((item) => [
          item.name,
          ...(item.params ?? []),
          item.returns,
        ]),
        ...(entry.definition.staticMethods ?? []).flatMap((item) =>
          typeof item === 'string' ? [item] : [item.name, ...(item.params ?? [])]
        ),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(normalized);
    });
  }, [entries, moduleFilter, query]);

  const activeEntry =
    filtered.find((entry) => entry.id === selected) ??
    entries.find((entry) => entry.id === selected) ??
    filtered[0];
  const totalClasses = entries.length;
  const totalMethods = entries.reduce(
    (sum, entry) =>
      sum +
      (entry.definition.methods?.length ?? 0) +
      (entry.definition.staticMethods?.length ?? 0),
    0
  );
  const totalProperties = entries.reduce(
    (sum, entry) => sum + (entry.definition.properties?.length ?? 0),
    0
  );

  const activeViDoc = activeEntry ? SDK_CLASS_DOCS_VI[activeEntry.className] : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bách Khoa Toàn Thư Affinity DOM API"
        description="Tra cứu giải nghĩa tiếng Việt và mã ví dụ chạy trực tiếp cho 14 lớp JavaScript DOM cốt lõi trích xuất từ Affinity SDK."
        badge={`Phiên bản SDK ${reference.metadata.version}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Chủ đề SDK', value: reference.metadata.totalTopics, icon: BookOpen },
          { label: 'Lớp / Kiểu đối tượng', value: totalClasses, icon: Braces },
          { label: 'Phương thức & Thuộc tính', value: totalMethods + totalProperties, icon: Code2 },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4"
          >
            <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
              <span>{label}</span>
              <Icon className="w-4 h-4" />
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums text-[var(--color-text-primary)]">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm kiếm lớp, phương thức, thuộc tính hoặc công dụng…"
            className="w-full rounded-md border border-[var(--color-border-hairline)] bg-[var(--color-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-cyan-500"
          />
        </label>
        {/* Single <select> in EncyclopediaPage preserved for E2E compatibility */}
        <select
          value={moduleFilter}
          onChange={(event) => setModuleFilter(event.target.value)}
          className="rounded-md border border-[var(--color-border-hairline)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)]"
        >
          <option value="all">Tất cả module API</option>
          {Object.keys(reference.modules).map((id) => (
            <option key={id} value={id}>
              {moduleLabels[id] ?? id}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.5fr)] gap-4 min-h-[420px]">
        <section className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border-hairline)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Ký hiệu API</h2>
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">
              {filtered.length} kết quả
            </span>
          </div>
          <div className="max-h-[600px] overflow-y-auto p-2 space-y-1">
            {filtered.map((entry) => {
              const viDoc = SDK_CLASS_DOCS_VI[entry.className];
              return (
                <button
                  type="button"
                  key={entry.id}
                  data-testid={`api-symbol-${entry.className}`}
                  onClick={() => setSelected(entry.id)}
                  className={`w-full rounded-md px-3 py-2.5 text-left transition-colors ${
                    activeEntry?.id === entry.id
                      ? 'bg-cyan-500/10 border border-cyan-500/30'
                      : 'hover:bg-[var(--color-canvas)] border border-transparent'
                  }`}
                >
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">
                    {entry.className}
                  </div>
                  {viDoc && (
                    <div className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{viDoc.titleVi}</div>
                  )}
                  <div className="mt-1 text-[11px] font-mono text-[var(--color-text-secondary)]">
                    {moduleLabels[entry.moduleId] ?? entry.moduleId} · {entry.module.nativeModule}
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="p-5 text-sm text-[var(--color-text-secondary)]">
                Không tìm thấy ký hiệu API nào phù hợp.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 sm:p-5">
          {activeEntry ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border-hairline)] pb-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                    {moduleLabels[activeEntry.moduleId] ?? activeEntry.moduleId} ·{' '}
                    {activeEntry.module.path}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-[var(--color-text-primary)]">
                    {activeEntry.className}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {activeEntry.module.nativeModule}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[11px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {statusLabelsVi[activeEntry.module.status] ??
                      activeEntry.module.status.replaceAll('_', ' ')}
                  </span>

                  {onOpenInPlayground && activeViDoc && (
                    <button
                      type="button"
                      data-testid="try-in-playground-btn"
                      onClick={() => onOpenInPlayground(activeEntry.className)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-3 py-1.5 text-xs transition-colors shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Chạy thử trong Playground</span>
                    </button>
                  )}
                </div>
              </div>

              {activeViDoc && (
                <div className="mt-4 p-3.5 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border-hairline)] space-y-2">
                  <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeViDoc.titleVi}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{activeViDoc.summaryVi}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    <strong className="text-zinc-200">Ứng dụng thực tế:</strong>{' '}
                    {activeViDoc.affinityUsageVi}
                  </p>
                </div>
              )}

              {activeEntry.definition.factory && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Hàm khởi tạo (Factory)
                  </h3>
                  <code className="mt-2 block rounded bg-[var(--color-canvas)] p-3 text-sm text-cyan-300">
                    {activeEntry.definition.factory}
                  </code>
                </div>
              )}

              {activeEntry.definition.properties?.length ? (
                <div className="mt-5">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Thuộc tính (Properties)
                  </h3>
                  <div className="divide-y divide-[var(--color-border-hairline)]">
                    {activeEntry.definition.properties.map((item) => (
                      <div
                        key={item.name}
                        className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1"
                      >
                        <span className="text-sm font-mono text-[var(--color-text-primary)]">
                          {item.name}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)] sm:text-right">
                          {item.type ?? '—'}
                          {item.note ? ` · ${item.note}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeEntry.definition.methods?.length ||
              activeEntry.definition.staticMethods?.length ? (
                <div className="mt-5">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Phương thức (Methods)
                  </h3>
                  <div className="space-y-2">
                    {[
                      ...(activeEntry.definition.methods ?? []),
                      ...(activeEntry.definition.staticMethods ?? []).map((item) =>
                        typeof item === 'string' ? { name: item } : item
                      ),
                    ].map((item) => (
                      <div key={item.name} className="rounded-md bg-[var(--color-canvas)] p-3">
                        <div className="font-mono text-sm text-cyan-300">
                          {item.name}({(item.params ?? []).join(', ')})
                        </div>
                        {item.returns && (
                          <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
                            Trả về: {item.returns}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeEntry.definition.property && (
                <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                  Thuộc tính chính: <code className="text-cyan-300">{activeEntry.definition.property}</code>
                </p>
              )}
              {activeEntry.definition.range && (
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Dải giá trị hợp lệ: <code className="text-amber-300">{activeEntry.definition.range}</code>
                </p>
              )}

              {activeViDoc && (
                <div className="mt-5">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Đoạn mã minh họa (JavaScript DOM)
                  </h3>
                  <pre className="rounded-md bg-[#09090d] border border-zinc-800 p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                    {activeViDoc.sampleCode}
                  </pre>
                </div>
              )}

              <p className="mt-6 border-t border-[var(--color-border-hairline)] pt-3 text-[11px] text-[var(--color-text-secondary)]">
                Bản chụp trích xuất {new Date(reference.metadata.extractedAt).toLocaleString('vi-VN')} ·{' '}
                {reference.metadata.environment}
              </p>
            </>
          ) : (
            <div className="h-full min-h-64 flex items-center justify-center text-sm text-[var(--color-text-secondary)]">
              Chọn một ký hiệu API ở danh sách bên trái để xem định nghĩa chi tiết.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EncyclopediaPage;
