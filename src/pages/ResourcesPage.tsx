/// <reference types="vite/client" />
import React, { useMemo, useState } from 'react';
import { Download, FileCode2, FileImage, FileText, Search } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';

const assetUrls = import.meta.glob('../../curriculum/assets/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

type ResourceCategory = 'all' | 'designer' | 'photo' | 'publisher' | 'scripting';
const categoryLabels: Record<Exclude<ResourceCategory, 'all'>, string> = {
  designer: 'Designer', photo: 'Photo', publisher: 'Publisher', scripting: 'Scripting',
};
const getCategory = (path: string): Exclude<ResourceCategory, 'all'> => {
  const segment = path.split('/').at(-2) ?? 'designer';
  return segment in categoryLabels ? segment as Exclude<ResourceCategory, 'all'> : 'designer';
};

export const ResourcesPage: React.FC = () => {
  const [category, setCategory] = useState<ResourceCategory>('all');
  const [query, setQuery] = useState('');
  const resources = useMemo(() => Object.entries(assetUrls).map(([path, url]) => {
    const filename = path.split('/').pop() ?? path;
    const extension = filename.split('.').pop()?.toLowerCase() ?? 'file';
    const title = filename.replace(/\.[^.]+$/, '').replace(/^[A-Z]\d+_/, '').replaceAll('_', ' ');
    return { path, url, filename, extension, title, category: getCategory(path) };
  }).sort((a, b) => a.filename.localeCompare(b.filename)), []);
  const filtered = resources.filter((item) =>
    (category === 'all' || item.category === category) &&
    `${item.filename} ${item.title} ${item.category} ${item.extension}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Resource Library" description="Download the real learning assets bundled with this project. The library is generated from files present in the repository; no placeholder downloads are shown." badge={`${resources.length} local assets`} />
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides, scripts, starter files…" className="w-full rounded-md border border-[var(--color-border-hairline)] bg-[var(--color-surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-cyan-500" /></label>
        <select value={category} onChange={(event) => setCategory(event.target.value as ResourceCategory)} className="rounded-md border border-[var(--color-border-hairline)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)]"><option value="all">All tracks</option>{Object.entries(categoryLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((item) => {
          const Icon = item.extension === 'afphoto' ? FileImage : item.extension === 'js' ? FileCode2 : FileText;
          return <article key={item.path} className="rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 flex flex-col min-h-44">
            <div className="flex items-start justify-between gap-3"><div className="rounded-md bg-[var(--color-canvas)] p-2 text-cyan-400"><Icon className="w-5 h-5" /></div><span className="rounded border border-[var(--color-border-hairline)] px-2 py-1 text-[10px] uppercase font-mono text-[var(--color-text-secondary)]">.{item.extension}</span></div>
            <h2 className="mt-3 text-sm font-semibold capitalize text-[var(--color-text-primary)]">{item.title}</h2>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{categoryLabels[item.category]} · {item.filename}</p>
            <div className="mt-auto pt-4"><a href={item.url} download={item.filename} className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-hairline)] px-3 py-2 text-xs font-medium text-[var(--color-text-primary)] hover:border-cyan-500 hover:text-cyan-400"><Download className="w-3.5 h-3.5" />Download file</a></div>
          </article>;
        })}
      </div>
      {filtered.length === 0 && <div className="rounded-lg border border-dashed border-[var(--color-border-hairline)] p-10 text-center text-sm text-[var(--color-text-secondary)]">No bundled resources match your filters.</div>}
      <p className="text-xs text-[var(--color-text-secondary)]">Files are served from the app bundle. Cloud uploads, user submissions, and download analytics are not enabled in this release.</p>
    </div>
  );
};

export default ResourcesPage;
