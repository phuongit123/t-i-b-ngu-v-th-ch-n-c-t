import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { TrackCard } from '@/components/cards/TrackCard';
import {
  TrackFilterBar,
  type CatalogTrackFilter,
  type TrackCounts,
} from '@/components/catalog/TrackFilterBar';
import { ModuleGrid } from '@/components/catalog/ModuleGrid';
import { Search, X, Sparkles, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AffinityTrackId, LessonDifficulty } from '@/types/curriculum';
import { ALL_PILOT_MODULES, ALL_PILOT_LESSONS } from '@/data/curriculum/index';
import {
  moduleTranslationsVi,
  lessonTranslationsVi,
} from '@/data/curriculum/translationsVi';

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
    label: 'Lộ trình học tập Designer',
    tagline: 'Bézier, Node & hình học',
    description: 'Thực hành đường cong, node, hình học vector và artboard.',
  },
  photo: {
    name: 'Pixel Studio',
    label: 'Lộ trình học tập Photo',
    tagline: 'Layers, masks & retouching',
    description: 'Thực hành layer, vùng chọn, mask và chỉnh sửa ảnh phi phá hủy.',
  },
  publisher: {
    name: 'Layout Studio',
    label: 'Lộ trình học tập Publisher',
    tagline: 'Typography, grids & pages',
    description: 'Thực hành cấu trúc trang, hệ lưới, phân cấp thị giác và xuất bản.',
  },
  scripting: {
    name: 'Automation & MCP',
    label: 'Nhánh học tập tự động hóa',
    tagline: 'Scripting & integration',
    description: 'Tìm hiểu scripting, quy trình lặp lại và giới hạn tích hợp MCP.',
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

  // Compute track-level counts for TrackFilterBar badges
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
      // 1. Track filter
      if (selectedTrack !== 'all' && mod.trackId !== selectedTrack) {
        return false;
      }

      // 2. Difficulty filter
      if (selectedDifficulty !== 'all' && mod.difficulty !== selectedDifficulty) {
        return false;
      }

      // 3. Search query filter
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

      // Search across module's lessons
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

  return (
    <div className={cn('space-y-8', className)}>
      <PageHeader
        title="Course Catalog — Danh Mục Khóa Học & Lộ Trình Đào Tạo"
        description="Course Catalog & Track Browser — Kế hoạch gồm 40 module / 120 bài. Hiện có 66 bài: 60 bài cốt lõi và 6 bài pilot; danh mục phân biệt rõ nội dung hiện có với phạm vi còn dự kiến."
        badge="Course Catalog · 66 bài hiện có · 60 cốt lõi + 6 pilot · 120 bài theo kế hoạch"
      />

      {/* 4 Track Summary Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TrackCard
          id="designer"
          name="Vector Studio"
          tagline={trackInfoVi.designer.tagline}
          description={trackInfoVi.designer.description}
          moduleCount={10}
          lessonCount={30}
          plannedModuleCount={10}
          plannedLessonCount={30}
          progressPercentage={100}
          onClick={() => handleTrackChange('designer')}
        />
        <TrackCard
          id="photo"
          name="Pixel Studio"
          tagline={trackInfoVi.photo.tagline}
          description={trackInfoVi.photo.description}
          moduleCount={10}
          lessonCount={30}
          plannedModuleCount={10}
          plannedLessonCount={30}
          progressPercentage={100}
          onClick={() => handleTrackChange('photo')}
        />
        <TrackCard
          id="publisher"
          name="Layout Studio"
          tagline={trackInfoVi.publisher.tagline}
          description={trackInfoVi.publisher.description}
          moduleCount={1}
          lessonCount={3}
          plannedModuleCount={10}
          plannedLessonCount={30}
          progressPercentage={10}
          onClick={() => handleTrackChange('publisher')}
        />
        <TrackCard
          id="scripting"
          name="Automation & MCP"
          tagline={trackInfoVi.scripting.tagline}
          description={trackInfoVi.scripting.description}
          moduleCount={1}
          lessonCount={3}
          plannedModuleCount={10}
          plannedLessonCount={30}
          progressPercentage={10}
          onClick={() => handleTrackChange('scripting')}
        />
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Track Filter Tabs */}
          <TrackFilterBar
            activeTrack={selectedTrack}
            onSelectTrack={handleTrackChange}
            trackCounts={trackCounts}
          />

          {/* Search & Difficulty Filter Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm module, bài học, persona..."
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
                        'px-2.5 py-1 rounded text-[11px] font-mono transition-colors',
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
        <div className="flex items-center justify-between border-b border-[var(--color-border-hairline)] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] capitalize">
              <span>
                {selectedTrack === 'all'
                  ? 'Tất Cả Lộ Trình Đào Tạo'
                  : `Lộ trình ${trackInfoVi[selectedTrack].name} (${trackInfoVi[selectedTrack].label})`}
              </span>
              <span className="sr-only">
                {selectedTrack === 'all'
                  ? 'all Track Curriculum'
                  : `${selectedTrack} Track Curriculum`}
              </span>
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Chọn bài học bên dưới để khởi chạy Trình phát Slide Tương tác.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/20 px-3 py-1 rounded border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {readyLessonsCount} Bài Học Sẵn Sàng Học
              <span className="sr-only">{readyLessonsCount} Lessons Ready to Play</span>
            </span>
          </div>
        </div>

        {/* Module Grid Component */}
        <ModuleGrid
          modules={filteredModules}
          activeLessonId={activeLessonId}
          onLaunchLesson={onLaunchLesson}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};

export default CatalogPage;
