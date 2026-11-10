import React, { useMemo, useState } from 'react';
import { BookOpen, Braces, CheckCircle2, Code2, Search } from 'lucide-react';
import apiReference from '../../AFFINITY_DOM_API_REFERENCE.json';
import { PageHeader } from '../components/layout/PageHeader';

type ApiMember = { name: string; type?: string; params?: string[]; returns?: string; note?: string; verifiedValue?: string };
type ApiClass = {
  factory?: string;
  properties?: ApiMember[];
  methods?: ApiMember[];
  staticMethods?: string[] | ApiMember[];
  property?: string;
  range?: string;
};
type ApiModule = { path: string; nativeModule: string; status: string; classes: Record<string, ApiClass> };
type ApiReference = { metadata: { version: string; totalTopics: number; extractedAt: string; environment: string }; modules: Record<string, ApiModule> };

const reference = apiReference as ApiReference;
const moduleLabels: Record<string, string> = {
  application: 'Application', document: 'Document', shapes: 'Shapes', layereffects: 'Layer Effects', commands: 'Commands',
};

export const EncyclopediaPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const entries = useMemo(() => Object.entries(reference.modules).flatMap(([moduleId, module]) =>
    Object.entries(module.classes ?? {}).map(([className, definition]) => ({
      id: `${moduleId}.${className}`, moduleId, module, className, definition,
    }))), []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (moduleFilter !== 'all' && entry.moduleId !== moduleFilter) return false;
      if (!normalized) return true;
      const searchable = [entry.className, entry.moduleId, entry.module.nativeModule,
        entry.definition.factory, entry.definition.property, entry.definition.range,
        ...(entry.definition.properties ?? []).flatMap((item) => [item.name, item.type, item.note]),
        ...(entry.definition.methods ?? []).flatMap((item) => [item.name, ...(item.params ?? []), item.returns]),
        ...(entry.definition.staticMethods ?? []).flatMap((item) => typeof item === 'string' ? [item] : [item.name, ...(item.params ?? [])]),
      ].filter(Boolean).join(' ').toLowerCase();
      return searchable.includes(normalized);
    });
  }, [entries, moduleFilter, query]);

  const activeEntry = filtered.find((entry) => entry.id === selected) ?? entries.find((entry) => entry.id === selected) ?? filtered[0];
  const totalClasses = entries.length;
  const totalMethods = entries.reduce((sum, entry) => sum + (entry.definition.methods?.length ?? 0) + (entry.definition.staticMethods?.length ?? 0), 0);
  const totalProperties = entries.reduce((sum, entry) => sum + (entry.definition.properties?.length ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Affinity DOM API Encyclopedia"
        description="Search the locally extracted Affinity JavaScript DOM reference. Entries reflect the bundled SDK snapshot, not a live connection to the desktop app."
        badge={`SDK ${reference.metadata.version}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'SDK topics', value: reference.metadata.totalTopics, icon: BookOpen },
          { label: 'Classes / types', value: totalClasses, icon: Braces },
          { label: 'Methods + properties', value: totalMethods + totalProperties, icon: Code2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4">
            <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]"><span>{label}</span><Icon className="w-4 h-4" /></div>
            <div className="mt-2 text-2xl font-semibold tabular-nums text-[var(--color-text-primary)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search classes, methods, properties…" className="w-full rounded-md border border-[var(--color-border-hairline)] bg-[var(--color-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-cyan-500" />
        </label>
        <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="rounded-md border border-[var(--color-border-hairline)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)]">
          <option value="all">All API modules</option>
          {Object.keys(reference.modules).map((id) => <option key={id} value={id}>{moduleLabels[id] ?? id}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.5fr)] gap-4 min-h-[420px]">
        <section className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border-hairline)] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">API symbols</h2>
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">{filtered.length} results</span>
          </div>
          <div className="max-h-[560px] overflow-y-auto p-2 space-y-1">
            {filtered.map((entry) => (
              <button key={entry.id} onClick={() => setSelected(entry.id)} className={`w-full rounded-md px-3 py-2.5 text-left transition-colors ${activeEntry?.id === entry.id ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-[var(--color-canvas)] border border-transparent'}`}>
                <div className="text-sm font-medium text-[var(--color-text-primary)]">{entry.className}</div>
                <div className="mt-1 text-[11px] font-mono text-[var(--color-text-secondary)]">{entry.moduleId} · {entry.module.nativeModule}</div>
              </button>
            ))}
            {filtered.length === 0 && <p className="p-5 text-sm text-[var(--color-text-secondary)]">No API symbols match this search.</p>}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 sm:p-5">
          {activeEntry ? <>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border-hairline)] pb-4">
              <div><div className="text-xs font-mono uppercase tracking-wider text-cyan-400">{activeEntry.moduleId} · {activeEntry.module.path}</div><h2 className="mt-1 text-xl font-semibold text-[var(--color-text-primary)]">{activeEntry.className}</h2><p className="mt-1 text-xs text-[var(--color-text-secondary)]">{activeEntry.module.nativeModule}</p></div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[11px] text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" />{activeEntry.module.status.replaceAll('_', ' ')}</span>
            </div>
            {activeEntry.definition.factory && <div className="mt-4"><h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Factory</h3><code className="mt-2 block rounded bg-[var(--color-canvas)] p-3 text-sm text-cyan-300">{activeEntry.definition.factory}</code></div>}
            {activeEntry.definition.properties?.length ? <div className="mt-5"><h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Properties</h3><div className="divide-y divide-[var(--color-border-hairline)]">{activeEntry.definition.properties.map((item) => <div key={item.name} className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1"><span className="text-sm font-mono text-[var(--color-text-primary)]">{item.name}</span><span className="text-xs text-[var(--color-text-secondary)] sm:text-right">{item.type ?? '—'}{item.note ? ` · ${item.note}` : ''}</span></div>)}</div></div> : null}
            {activeEntry.definition.methods?.length || activeEntry.definition.staticMethods?.length ? <div className="mt-5"><h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Methods</h3><div className="space-y-2">{[...(activeEntry.definition.methods ?? []), ...(activeEntry.definition.staticMethods ?? []).map((item) => typeof item === 'string' ? { name: item } : item)].map((item) => <div key={item.name} className="rounded-md bg-[var(--color-canvas)] p-3"><div className="font-mono text-sm text-cyan-300">{item.name}({(item.params ?? []).join(', ')})</div>{item.returns && <div className="mt-1 text-xs text-[var(--color-text-secondary)]">Returns: {item.returns}</div>}</div>)}</div></div> : null}
            {activeEntry.definition.property && <p className="mt-4 text-sm text-[var(--color-text-secondary)]">Property: {activeEntry.definition.property}</p>}
            {activeEntry.definition.range && <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Range: {activeEntry.definition.range}</p>}
            <p className="mt-6 border-t border-[var(--color-border-hairline)] pt-3 text-[11px] text-[var(--color-text-secondary)]">Snapshot extracted {new Date(reference.metadata.extractedAt).toLocaleString()} · {reference.metadata.environment}</p>
          </> : <div className="h-full min-h-64 flex items-center justify-center text-sm text-[var(--color-text-secondary)]">Choose an API symbol to inspect its definition.</div>}
        </section>
      </div>
    </div>
  );
};

export default EncyclopediaPage;
