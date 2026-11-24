import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { TrackCard } from '@/components/cards/TrackCard';
import {
  TrackFilterBar,
  type CatalogTrackFilter,
  type TrackCounts,
} from '@/components/catalog/TrackFilterBar';
import { ModuleGrid } from '@/components/catalog/ModuleGrid';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Search, X, Sparkles, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRoutePath } from '@/lib/seo-router';
import type { AffinityTrackId, LessonDifficulty } from '@/types/curriculum';
import { ALL_PILOT_MODULES, ALL_PILOT_LESSONS } from '@/data/curriculum/index';
import {
  moduleTranslationsVi,
  lessonTranslationsVi,
} from '@/data/curriculum/translationsVi';
import { useLearningProgress } from '@/lib/learning-store';

export type DifficultyFilter = 'all' | LessonDifficulty;

export interface CatalogPageProps {
  activeTrack?: AffinityTrackId;
  onSelectTrack?: (trackId: AffinityTrackId) => void;
  onLaunchLesson: (lessonId: string) => void;
  activeLessonId?: string | null;
  className?: string;
}

const trackInfoVi: Record<
  AffinityTrackId,
  { name: string; label: string; tagline: string; description: string }
> = {
  designer: {
    name: 'Vector Studio',
    label: 'Lộ trình Thiết kế Vector',
    tagline: 'Đường cong Bézier, Node & Hình học',
    description: 'Thực hành đường cong, node, hình học vector và thiết lập artboard.',
  },
  photo: {
    name: 'Pixel Studio',
    label: 'Lộ trình Chỉnh sửa Ảnh',
    tagline: 'Layer, Mặt nạ & Chỉnh sửa ảnh',
    description: 'Thực hành layer, vùng chọn, mask và chỉnh sửa ảnh phi phá hủy.',
  },
  publisher: {
    name: 'Layout Studio',
    label: 'Lộ trình Dàn trang & Xuất bản',
    tagline: 'Typography, Hệ lưới & Dàn trang',
    description: 'Thực hành cấu trúc trang, hệ lưới, phân cấp thị giác và xuất bản in ấn.',
  },
  scripting: {
    name: 'Tự động hóa',
    label: 'Nhánh Scripting & MCP',
    tagline: 'Tự động hóa JS DOM & MCP',
    description: 'Tìm hiểu scripting, quy trình lặp lại và cầu nối tích hợp MCP.',
  },
};

const DIFFICULTY_OPTIONS: { id: DifficultyFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả độ khó' },
  { id: 'Beginner', label: 'Cơ bản' },
  { id: 'Intermediate', label: 'Trung cấp' },
  { id: 'Advanced', label: 'Nâng cao' },
];

export const CatalogPage: React.FC<CatalogPageProps> = ({
  activeTrack,
  onSelectTrack,
  onLaunchLesson,
  activeLessonId = null,
  className,
}) => {
  const { getTrackProgress } = useLearningProgress();
  const [selectedTrack, setSelectedTrack] = useState<CatalogTrackFilter>(
    activeTrack || 'designer'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all');
  const lastActiveTrackRef = useRef(activeTrack);

  // Synchronize internal track state only when parent activeTrack prop genuinely changes
  useEffect(() => {
    if (activeTrack && activeTrack !== lastActiveTrackRef.current) {
      lastActiveTrackRef.current = activeTrack;
      setSelectedTrack(activeTrack);
    }
  }, [activeTrack]);

  const handleTrackChange = (track: CatalogTrackFilter) => {
    setSelectedTrack(track);
    if (track !== 'all') {
      lastActiveTrackRef.current = track;
      if (onSelectTrack) {
        onSelectTrack(track);
      }
    }
  };

  const handleResetFilters = () => {
    setSelectedTrack('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };

  // Compute track-level counts for TrackFilterBar badges and TrackCards
  const trackCounts = useMemo<Record<CatalogTrackFilter, TrackCounts>>(() => {
    const counts: Record<CatalogTrackFilter, TrackCounts> = {
      all: { modules: ALL_PILOT_MODULES.length, lessons: ALL_PILOT_LESSONS.length },
      designer: { modules: 0, lessons: 0 },
      photo: { modules: 0, lessons: 0 },
      publisher: { modules: 0, lessons: 0 },
      scripting: { modules: 0, lessons: 0 },
    };

    for (const mod of ALL_PILOT_MODULES) {
      if (counts[mod.trackId]) {
        counts[mod.trackId].modules += 1;
        counts[mod.trackId].lessons += mod.lessons.length;
      }
    }

    return counts;
  }, []);

  // Filter modules based on selected track, difficulty, and instant search query
  const filteredModules = useMemo(() => {
    const q = searchQuery.trim();

    const normalizeStr = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const matchText = (source: string, query: string) => {
      const sLower = source.toLowerCase();
      const qLower = query.toLowerCase();
      return sLower.includes(qLower) || normalizeStr(sLower).includes(normalizeStr(qLower));
    };

    return ALL_PILOT_MODULES.filter((mod) => {
      if (selectedTrack !== 'all' && mod.trackId !== selectedTrack) {
        return false;
      }

      if (selectedDifficulty !== 'all' && mod.difficulty !== selectedDifficulty) {
        return false;
      }

      if (!q) {
        return true;
      }

      const modNumber = mod.moduleNumber || mod.id;
      const modVi = moduleTranslationsVi[mod.id];
      const matchModule = [
        mod.id,
        modNumber,
        mod.title,
        modVi?.title,
        mod.description,
        modVi?.description,
        mod.tagline,
        mod.primaryPersona,
      ]
        .filter((field): field is string => Boolean(field))
        .some((text) => matchText(text, q));

      if (matchModule) {
        return true;
      }

      return mod.lessons.some((les) => {
        const lesVi = lessonTranslationsVi[les.id];
        const toolName = les.standardSections?.toolAndFeatureExplanation?.toolName;
        const objectives = les.standardSections?.learningObjectives?.join(' ');

        return [
          les.id,
          les.title,
          lesVi,
          les.subtitle,
          toolName,
          objectives,
        ]
          .filter((field): field is string => Boolean(field))
          .some((text) => matchText(text, q));
      });
    });
  }, [selectedTrack, selectedDifficulty, searchQuery]);

  const readyLessonsCount = useMemo(() => {
    return filteredModules.reduce((acc, m) => acc + m.lessons.length, 0);
  }, [filteredModules]);

  const isFiltered =
    selectedTrack !== 'all' || selectedDifficulty !== 'all' || searchQuery.trim().length > 0;

  const designerProgress = getTrackProgress('designer');
  const photoProgress = getTrackProgress('photo');
  const publisherProgress = getTrackProgress('publisher');
  const scriptingProgress = getTrackProgress('scripting');

  return (
    <div className={cn('space-y-8', className)}>
      <PageHeader
        title="Khóa học Affinity"
        description="Tìm theo Studio, tên công cụ hoặc bài học. Chọn một học phần để xem nội dung và bắt đầu thực hành."
        badge="66 bài · 22 học phần"
      />

      <section className="path-entry" aria-labelledby="beginner-entry-title">
        <div>
          <h2 id="beginner-entry-title">Mới học Affinity?</h2>
          <p>Làm poster đầu tiên, sau đó học từng chặng có bài tự làm và tiêu chí tự kiểm.</p>
        </div>
        <a className="path-primary" href={getRoutePath('journey')}>Bắt đầu từ số 0 <ArrowRight size={16} aria-hidden="true" /></a>
      </section>

      {/* 4 Track Summary Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TrackCard
          id="designer"
          name={trackInfoVi.designer.name}
          tagline={trackInfoVi.designer.tagline}
          description={trackInfoVi.designer.description}
          moduleCount={trackCounts.designer.modules}
          lessonCount={trackCounts.designer.lessons}
          completedLessonsCount={designerProgress.completed}
          progressPercentage={designerProgress.percentage}
          coverImage="/assets/academy/tra-mat.webp"
          onClick={() => handleTrackChange('designer')}
        />
        <TrackCard
          id="photo"
          name={trackInfoVi.photo.name}
          tagline={trackInfoVi.photo.tagline}
          description={trackInfoVi.photo.description}
          moduleCount={trackCounts.photo.modules}
          lessonCount={trackCounts.photo.lessons}
          completedLessonsCount={photoProgress.completed}
          progressPercentage={photoProgress.percentage}
          coverImage="/assets/academy/retouch.webp"
          onClick={() => handleTrackChange('photo')}
        />
        <TrackCard
          id="publisher"
          name={trackInfoVi.publisher.name}
          tagline={trackInfoVi.publisher.tagline}
          description={trackInfoVi.publisher.description}
          moduleCount={trackCounts.publisher.modules}
          lessonCount={trackCounts.publisher.lessons}
          completedLessonsCount={publisherProgress.completed}
          progressPercentage={publisherProgress.percentage}
          coverImage="/assets/academy/editorial.webp"
          onClick={() => handleTrackChange('publisher')}
        />
        <TrackCard
          id="scripting"
          name={trackInfoVi.scripting.name}
          tagline={trackInfoVi.scripting.tagline}
          description={trackInfoVi.scripting.description}
          moduleCount={trackCounts.scripting.modules}
          lessonCount={trackCounts.scripting.lessons}
          completedLessonsCount={scriptingProgress.completed}
          progressPercentage={scriptingProgress.percentage}
          coverImage="/assets/academy/studio-automation-dom.png"
          onClick={() => handleTrackChange('scripting')}
        />
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col gap-3">
          {/* Track Filter Tabs */}
          <TrackFilterBar
            activeTrack={selectedTrack}
            onSelectTrack={handleTrackChange}
            trackCounts={trackCounts}
          />

          {/* Search & Difficulty Filter Group */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                aria-label="Tìm học phần, bài học hoặc công cụ"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm học phần, bài học, công cụ..."
                className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-surface border border-hairline text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-500 hover:text-zinc-300"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-surface/80 border border-hairline">
              <Filter className="w-3.5 h-3.5 text-zinc-500 ml-1.5" />
              <div className="flex items-center gap-1">
                {DIFFICULTY_OPTIONS.map((opt) => {
                  const isActive = selectedDifficulty === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(opt.id)}
                      className={cn(
                        'px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap shrink-0 transition-colors',
                        isActive
                          ? 'bg-zinc-800 text-zinc-100 font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Filters Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded border border-hairline transition-colors"
                title="Đặt lại tất cả bộ lọc"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Track Modules & Lessons Section */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-hairline)] pb-4">
          <div>
            <h2
              data-testid="catalog-track-heading"
              className="text-xl font-bold text-[var(--color-text-primary)]"
            >
              {selectedTrack === 'all'
                ? 'Tất cả học phần'
                : `Lộ trình ${trackInfoVi[selectedTrack].name} (${trackInfoVi[selectedTrack].label})`}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Chọn bài học bên dưới để khởi chạy trình học tương tác.
            </p>
          </div>
          <div
            data-testid="catalog-lesson-count-badge"
            className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/20 px-3 py-1 rounded border border-emerald-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{readyLessonsCount} bài học sẵn sàng</span>
          </div>
        </div>

        <div className={selectedTrack === 'all' ? undefined : 'academy-track-layout'}>
        <ModuleGrid
          className="course-module-list"
          modules={filteredModules}
          activeLessonId={activeLessonId}
          onLaunchLesson={onLaunchLesson}
          onResetFilters={handleResetFilters}
        />
          {selectedTrack !== 'all' && (
            <aside className="academy-track-summary">
              <h3>{trackInfoVi[selectedTrack].name}</h3>
              <p>{trackCounts[selectedTrack].lessons} bài · {trackCounts[selectedTrack].modules} học phần</p>
              {filteredModules[0]?.lessons[0] && (
                <Button onClick={() => onLaunchLesson(filteredModules[0].lessons[0].id)}>Bắt đầu học</Button>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
