import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Download,
  HelpCircle,
  Lightbulb,
  Keyboard,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Laptop,
  Apple,
  Layers,
  X,
  ZoomIn,
} from 'lucide-react';
import type { CurriculumLesson, LessonSlide } from '@/types/curriculum';
import { lessonTranslationsVi } from '@/data/curriculum/translationsVi';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/supabase/auth-context';
import { usePreferences, formatShortcutForOs } from '@/lib/preferences-context';
import { getLocalProgress } from '@/lib/supabase/progress-sync';
import { recordLessonSlideVisit, markLessonCompleted } from '@/lib/learning-store';
import { resolveCurriculumAssetUrl } from '@/lib/curriculum-asset-urls';
import { getLessonVisualShowcase } from '@/lib/lesson-visuals';
import { InlineMarkdown, SafeMarkdown } from '@/components/common/SafeMarkdown';
import { BeforeAfterSlider } from '@/components/common/BeforeAfterSlider';
import { LessonSectionsReader } from '@/components/lesson/LessonSectionsReader';

export interface SlidePlayerProps {
  lesson: CurriculumLesson;
  onLessonComplete?: (lessonId: string) => void;
  onBackToCatalog?: () => void;
  viewMode?: 'slides' | 'sections';
  onViewModeChange?: (mode: 'slides' | 'sections') => void;
  activeSectionIndex?: number | null;
  onSelectLesson?: (lessonId: string) => void;
  onNavigate?: (route: string) => void;
}

const SLIDE_TYPE_LABELS_VI: Record<string, string> = {
  intro: 'Tổng quan',
  theory: 'Lý thuyết nền tảng',
  concept: 'Khái niệm cốt lõi',
  'tool-anatomy': 'Cấu tạo công cụ',
  'step-by-step': 'Thực hành từng bước',
  step: 'Thực hành từng bước',
  workflow: 'Quy trình thực hiện',
  'guided-practice': 'Thực hành có hướng dẫn',
  practice: 'Bài tập ứng dụng',
  interaction: 'Tương tác công cụ',
  layout: 'Bố cục & Giao diện',
  detail: 'Chi tiết kỹ thuật',
  diagram: 'Sơ đồ minh họa',
  tip: 'Mẹo thực chiến',
  warning: 'Lưu ý kỹ thuật',
  pitfalls: 'Lỗi thường gặp & Khắc phục',
  quiz: 'Câu hỏi kiểm tra',
  challenge: 'Thử thách độc lập',
  summary: 'Tổng kết bài học',
};

const TRACK_LABELS_VI: Record<string, string> = {
  designer: 'Vector Studio',
  photo: 'Pixel Studio',
  publisher: 'Layout Studio',
  scripting: 'Tự động hóa',
};

const DIFFICULTY_LABELS_VI: Record<string, string> = {
  Beginner: 'Cơ bản',
  Intermediate: 'Trung cấp',
  Advanced: 'Nâng cao',
};

export const SlidePlayer: React.FC<SlidePlayerProps> = ({
  lesson,
  onLessonComplete,
  onBackToCatalog,
  viewMode: controlledViewMode,
  onViewModeChange,
  activeSectionIndex = null,
  onSelectLesson,
  onNavigate,
}) => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = usePreferences();

  const [internalViewMode, setInternalViewMode] = useState<'slides' | 'sections'>('slides');
  const viewMode = controlledViewMode ?? internalViewMode;
  const setViewMode = (nextMode: 'slides' | 'sections') => {
    setInternalViewMode(nextMode);
    if (onViewModeChange) onViewModeChange(nextMode);
  };

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [lastQuizScore, setLastQuizScore] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [lightboxVisual, setLightboxVisual] = useState<{
    src: string;
    alt: string;
    caption?: string;
    isDiagram?: boolean;
  } | null>(null);

  const totalSlides = lesson.slides.length;
  const safeIndex = Math.min(currentSlideIndex, Math.max(0, totalSlides - 1));
  const currentSlide: LessonSlide = lesson.slides[safeIndex];
  const progressPercent = Math.round(((safeIndex + 1) / totalSlides) * 100);

  // Restore saved progress when switching lessons
  useEffect(() => {
    const saved = getLocalProgress(lesson.id);
    setIsCompleted(saved?.status === 'completed');
    setLastQuizScore(saved?.quizScore ?? null);
    if (
      saved &&
      saved.status === 'in_progress' &&
      saved.lastSlideIndex >= 0 &&
      saved.lastSlideIndex < lesson.slides.length
    ) {
      setCurrentSlideIndex(saved.lastSlideIndex);
    } else {
      setCurrentSlideIndex(0);
    }
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setLightboxVisual(null);
  }, [lesson.id, lesson.slides.length]);

  const navigateToSlide = useCallback(
    (nextIndex: number) => {
      setCurrentSlideIndex(nextIndex);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
      if (preferences.autoSaveProgress) {
        recordLessonSlideVisit(user?.id ?? null, lesson.id, nextIndex);
      }
    },
    [preferences.autoSaveProgress, user?.id, lesson.id]
  );

  const goToNextSlide = useCallback(() => {
    if (safeIndex < totalSlides - 1) {
      navigateToSlide(safeIndex + 1);
    }
  }, [safeIndex, totalSlides, navigateToSlide]);

  const goToPrevSlide = useCallback(() => {
    if (safeIndex > 0) {
      navigateToSlide(safeIndex - 1);
    }
  }, [safeIndex, navigateToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxVisual) {
        setLightboxVisual(null);
        return;
      }
      if (viewMode !== 'slides') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, viewMode, lightboxVisual]);

  const handleCheckpointToggle = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizOption === null || !currentSlide.quizData) return;
    setIsQuizSubmitted(true);
    const passed = selectedQuizOption === currentSlide.quizData.correctIndex;
    setLastQuizScore(passed ? 100 : 0);
  };

  const handleManualComplete = async () => {
    let resolvedQuizScore = lastQuizScore;
    if (resolvedQuizScore === null && currentSlide.quizData && isQuizSubmitted) {
      resolvedQuizScore = selectedQuizOption === currentSlide.quizData.correctIndex ? 100 : 0;
    }

    await markLessonCompleted(user?.id ?? null, lesson.id, safeIndex, resolvedQuizScore);
    setIsCompleted(true);
    if (onLessonComplete) {
      onLessonComplete(lesson.id);
    }
  };

  const trackColorMap: Record<string, string> = {
    designer: 'var(--color-accent-designer, #00d2ff)',
    photo: 'var(--color-accent-photo, #38bdf8)',
    publisher: 'var(--color-accent-publisher, #fb7185)',
    scripting: 'var(--color-accent-scripting, #10b981)',
  };

  const accentColor = trackColorMap[lesson.trackId] || 'var(--color-brand-cyan, #00d2ff)';
  const displayLessonTitle = lessonTranslationsVi[lesson.id] || lesson.title;
  const slideTypeLabel =
    (currentSlide.type && SLIDE_TYPE_LABELS_VI[currentSlide.type]) || 'Nội dung bài học';
  const visualShowcase = getLessonVisualShowcase(lesson.id, lesson.moduleId, lesson.trackId);

  const slideStarterAsset =
    currentSlide.practiceData?.starterAsset ??
    (safeIndex === totalSlides - 1
      ? lesson.standardSections.independentChallenge.starterAsset ?? lesson.practiceAsset
      : undefined);
  const starterDownloadUrl = slideStarterAsset
    ? resolveCurriculumAssetUrl(slideStarterAsset.filepath) ??
      resolveCurriculumAssetUrl(slideStarterAsset.filename)
    : null;

  const shouldShowVisualCard =
    safeIndex === 0 ||
    currentSlide.type === 'tool-anatomy' ||
    currentSlide.type === 'diagram' ||
    currentSlide.type === 'layout';

  const shouldShowBeforeAfterInSlide =
    !!visualShowcase.comparisonSlider &&
    (safeIndex === 1 || safeIndex === 3 || currentSlide.type === 'detail');

  return (
    <div className="flex flex-col h-full w-full rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
      {/* Top Header & Navigation Bar (Strictly single H2 across entire lesson view) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[var(--color-border-hairline)] bg-[var(--color-canvas)]">
        <div className="flex items-center gap-3 min-w-0">
          {onBackToCatalog && (
            <button
              type="button"
              onClick={onBackToCatalog}
              className="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
              title="Quay lại Danh mục Khóa học"
              aria-label="Quay lại Danh mục Khóa học"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-mono font-semibold px-2 py-0.5 rounded border border-[var(--color-border-subtle)]"
                style={{ color: accentColor }}
              >
                {lesson.id}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
                {TRACK_LABELS_VI[lesson.trackId] || lesson.trackId} &bull;{' '}
                {DIFFICULTY_LABELS_VI[lesson.difficulty] || lesson.difficulty}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                </span>
              )}
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] truncate max-w-xl">
              {displayLessonTitle}
            </h2>
          </div>
        </div>

        {/* Mode Switcher, OS Shortcut Switcher & Slide Counter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Slide vs 10-Section Reader Switch */}
          <div
            role="tablist"
            aria-label="Chế độ xem bài giảng"
            className="flex items-center gap-1 p-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-hairline)] text-[11px] font-mono"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'slides'}
              data-testid="lesson-mode-slides"
              onClick={() => setViewMode('slides')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'slides'
                  ? 'bg-zinc-800 text-cyan-300 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Trình chiếu Slide</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'sections'}
              data-testid="lesson-mode-sections"
              onClick={() => setViewMode('sections')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'sections'
                  ? 'bg-zinc-800 text-cyan-300 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Đọc sâu 10 Học phần</span>
            </button>
          </div>

          {/* OS Shortcut Switcher */}
          <div
            className="hidden md:flex items-center gap-1 p-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-hairline)] text-[10px] font-mono"
            title="Chuyển nhanh kiểu phím tắt hiển thị"
          >
            <button
              type="button"
              onClick={() => updatePreferences({ shortcutModifier: 'windows' })}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                preferences.shortcutModifier === 'windows'
                  ? 'bg-zinc-800 text-cyan-300 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              aria-label="Phím tắt Windows"
            >
              <Laptop className="w-3 h-3" /> Win
            </button>
            <button
              type="button"
              onClick={() => updatePreferences({ shortcutModifier: 'mac' })}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                preferences.shortcutModifier === 'mac'
                  ? 'bg-zinc-800 text-cyan-300 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              aria-label="Phím tắt macOS"
            >
              <Apple className="w-3 h-3" /> Mac
            </button>
          </div>

          <div data-testid="slide-counter" className="text-right font-mono text-xs">
            <span className="font-semibold text-[var(--color-text-primary)]">
              Trang {safeIndex + 1}
            </span>
            <span className="text-[var(--color-text-secondary)]"> / {totalSlides}</span>
          </div>

          {viewMode === 'slides' && (
            <div className="hidden sm:flex items-center gap-1.5">
              {lesson.slides.map((s, idx) => (
                <button
                  type="button"
                  key={s.id ?? idx}
                  onClick={() => navigateToSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === safeIndex ? 'w-5' : 'hover:opacity-75'
                  }`}
                  style={{
                    backgroundColor:
                      idx === safeIndex ? accentColor : 'var(--color-border-subtle)',
                  }}
                  title={`Chuyển đến trang ${idx + 1}: ${s.title}`}
                  aria-label={`Chuyển đến trang ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[var(--color-canvas)] overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${viewMode === 'sections' ? 100 : progressPercent}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>

      {/* Main Content Stage */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between min-h-[480px]">
        {viewMode === 'sections' ? (
          <div className="flex-1 flex flex-col justify-between gap-6">
            <LessonSectionsReader
              lesson={lesson}
              displayTitle={displayLessonTitle}
              accentColor={accentColor}
              checkedItems={checkedItems}
              onToggleCheckpoint={handleCheckpointToggle}
              activeSectionIndex={activeSectionIndex}
              onSelectLesson={onSelectLesson}
              onNavigate={onNavigate}
              onOpenLightbox={setLightboxVisual}
              isCompleted={isCompleted}
              onCompleteLesson={() => {
                void handleManualComplete();
              }}
            />

            <div className="pt-5 border-t border-hairline flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('slides')}
                leftIcon={<Layers className="w-4 h-4" />}
              >
                Quay lại Trình chiếu Slide
              </Button>
              <Button
                variant={isCompleted ? 'outline' : 'accent-scripting'}
                size="sm"
                data-testid="complete-lesson-btn"
                onClick={() => {
                  void handleManualComplete();
                }}
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              >
                {isCompleted ? 'Đã hoàn thành bài học ✓' : 'Đánh dấu hoàn thành'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              {/* Slide Type Tag & Starter Asset Download */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-canvas)] border border-[var(--color-border-hairline)] text-[var(--color-text-secondary)]">
                    {currentSlide.type === 'intro' && <BookOpen className="w-3 h-3" />}
                    {currentSlide.type === 'tool-anatomy' && <Keyboard className="w-3 h-3" />}
                    {currentSlide.type === 'quiz' && <HelpCircle className="w-3 h-3" />}
                    {currentSlide.type === 'challenge' && <Sparkles className="w-3 h-3" />}
                    {slideTypeLabel}
                  </span>
                  {currentSlide.subtitle && (
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      &bull; {currentSlide.subtitle}
                    </span>
                  )}
                </div>

                {slideStarterAsset && (
                  <div>
                    {slideStarterAsset.assetStatus === 'NOT_YET_AVAILABLE' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded border border-[var(--color-border-hairline)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Tệp thực hành: Đang hoàn thiện</span>
                      </span>
                    ) : starterDownloadUrl ? (
                      <a
                        href={starterDownloadUrl}
                        download={slideStarterAsset.filename}
                        className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded border border-[var(--color-border-subtle)] bg-[var(--color-canvas)] hover:border-[var(--color-accent-scripting)] transition-colors text-[var(--color-text-primary)]"
                        title={`Tải về ${slideStarterAsset.filename}`}
                      >
                        <Download className="w-3.5 h-3.5 text-[var(--color-accent-scripting)]" />
                        <span className="font-semibold text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border-hairline)]">
                          {slideStarterAsset.assetStatus === 'REAL_AFFINITY_FILE' &&
                            'File Affinity gốc'}
                          {slideStarterAsset.assetStatus === 'GUIDE_DOCUMENT' &&
                            'Tài liệu hướng dẫn'}
                          {slideStarterAsset.assetStatus === 'JAVASCRIPT_SCRIPT' &&
                            'Kịch bản DOM'}
                          {slideStarterAsset.assetStatus === 'EXTERNAL_RESOURCE' &&
                            'Tài nguyên ngoài'}
                        </span>
                        <span>{slideStarterAsset.filename}</span>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">
                          ({slideStarterAsset.filesize})
                        </span>
                      </a>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Strictly Single H1 Title in Slide Mode */}
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight mb-5">
                {currentSlide.title}
              </h1>

              {/* Rendered Safe Markdown Content & Legacy Bullets */}
              <div className="max-w-none text-sm md:text-base leading-relaxed text-[var(--color-text-primary)] space-y-4 mb-6 font-sans">
                {(currentSlide.contentMarkdown ?? currentSlide.content) && (
                  <SafeMarkdown
                    content={currentSlide.contentMarkdown ?? currentSlide.content ?? ''}
                  />
                )}
                {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                  <ul className="list-disc pl-6 space-y-2 text-zinc-200">
                    {currentSlide.bullets.map((bullet, index) => (
                      <li key={index} className="leading-relaxed">
                        <InlineMarkdown text={bullet} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Contextual Visual Plate / SVG Diagram with Zoom Lightbox */}
              {shouldShowVisualCard && (
                <div className="my-5 rounded-xl border border-hairline bg-[#090b10] overflow-hidden">
                  <div className="relative flex items-center justify-center max-h-64 overflow-hidden bg-[#090b10]">
                    <img
                      src={visualShowcase.primary.src}
                      alt={visualShowcase.primary.alt}
                      className={
                        visualShowcase.primary.isDiagram
                          ? 'w-full max-h-64 object-contain p-3'
                          : 'w-full max-h-64 object-cover'
                      }
                    />
                    <button
                      type="button"
                      data-testid="open-visual-lightbox"
                      onClick={() => setLightboxVisual(visualShowcase.primary)}
                      className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-md border border-hairline bg-obsidian/90 px-2.5 py-1 text-[11px] font-mono text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Phóng to sơ đồ</span>
                    </button>
                  </div>
                  <div className="px-4 py-2 border-t border-hairline bg-canvas text-xs text-zinc-400">
                    {visualShowcase.primary.caption}
                  </div>
                </div>
              )}

              {/* Embedded Interactive Before/After Slider for Color / RAW Lessons */}
              {shouldShowBeforeAfterInSlide && visualShowcase.comparisonSlider && (
                <div className="my-5">
                  <BeforeAfterSlider
                    beforeSrc={visualShowcase.comparisonSlider.beforeSrc}
                    afterSrc={visualShowcase.comparisonSlider.afterSrc}
                    beforeLabel={visualShowcase.comparisonSlider.beforeLabel}
                    afterLabel={visualShowcase.comparisonSlider.afterLabel}
                  />
                </div>
              )}

              {(currentSlide.tips || currentSlide.proTip || currentSlide.callout) && (
                <div className="my-4 p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-canvas)] text-sm text-[var(--color-text-primary)]">
                  <div
                    className="text-[10px] uppercase tracking-wider font-semibold mb-1"
                    style={{ color: accentColor }}
                  >
                    {currentSlide.tips ? 'Mẹo thực hành' : 'Mẹo chuyên gia'}
                  </div>
                  <InlineMarkdown
                    text={currentSlide.tips ?? currentSlide.proTip ?? currentSlide.callout ?? ''}
                  />
                </div>
              )}

              {currentSlide.codeSnippet && (
                <pre className="my-4 p-4 rounded-lg bg-[#0a0a0d] border border-[var(--color-border-hairline)] overflow-x-auto whitespace-pre-wrap text-xs font-mono text-emerald-300">
                  {currentSlide.codeSnippet}
                </pre>
              )}

              {currentSlide.visualDescription && (
                <div className="my-4 p-4 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border-hairline)] text-xs text-[var(--color-text-secondary)]">
                  <InlineMarkdown text={currentSlide.visualDescription} />
                </div>
              )}

              {/* Action Box Callout with OS-Aware Shortcut */}
              {currentSlide.actionBox && (
                <div
                  className="my-5 p-4 rounded-lg bg-[var(--color-canvas)] border-l-4 border-[var(--color-border-hairline)] flex items-start gap-3"
                  style={{ borderLeftColor: accentColor }}
                >
                  <Lightbulb
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: accentColor }}
                  />
                  <div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: accentColor }}
                    >
                      {currentSlide.actionBox.label}
                    </div>
                    <div className="text-sm text-[var(--color-text-primary)]">
                      <InlineMarkdown text={currentSlide.actionBox.text} />
                    </div>
                    {currentSlide.actionBox.shortcut && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
                        <span>
                          {preferences.shortcutModifier === 'mac'
                            ? 'Phím tắt macOS:'
                            : 'Phím tắt Windows:'}
                        </span>
                        <kbd
                          data-testid="active-os-shortcut"
                          className="px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-hairline)] text-emerald-300 font-semibold"
                        >
                          {formatShortcutForOs(
                            currentSlide.actionBox.shortcut.win,
                            currentSlide.actionBox.shortcut.mac,
                            preferences.shortcutModifier
                          )}
                        </kbd>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Visual Block (Diagram / Code / Badge Grid / Table / Comparison) */}
              {currentSlide.visual && (
                <div className="my-5 p-4 rounded-lg bg-[#0a0a0d] border border-[var(--color-border-hairline)] overflow-x-auto">
                  {currentSlide.visual.type === 'code' ? (
                    <pre className="font-mono text-xs md:text-sm text-emerald-400 whitespace-pre">
                      {currentSlide.visual.content}
                    </pre>
                  ) : currentSlide.visual.type === 'diagram' ? (
                    <pre className="font-mono text-xs md:text-sm text-cyan-300 whitespace-pre">
                      {currentSlide.visual.content}
                    </pre>
                  ) : currentSlide.visual.type === 'badge-grid' ? (
                    <div className="flex flex-wrap gap-2">
                      {currentSlide.visual.content.split('|').map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-xs font-mono text-cyan-200"
                        >
                          <InlineMarkdown text={item.trim()} />
                        </span>
                      ))}
                    </div>
                  ) : currentSlide.visual.content.includes('|---') ? (
                    <SafeMarkdown content={currentSlide.visual.content} />
                  ) : (
                    <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                      <InlineMarkdown text={currentSlide.visual.content} />
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Quiz Renderer */}
              {currentSlide.quizData && (
                <div className="my-5 p-5 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border-subtle)]">
                  <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                    <span>
                      <InlineMarkdown text={currentSlide.quizData.question} />
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {currentSlide.quizData.options.map((opt, optIdx) => {
                      let optStyle =
                        'border-[var(--color-border-hairline)] bg-[var(--color-surface)] hover:border-[var(--color-border-subtle)]';

                      if (isQuizSubmitted) {
                        if (optIdx === currentSlide.quizData!.correctIndex) {
                          optStyle = 'border-emerald-500/80 bg-emerald-950/20 text-emerald-200';
                        } else if (optIdx === selectedQuizOption) {
                          optStyle = 'border-rose-500/80 bg-rose-950/20 text-rose-200';
                        }
                      } else if (selectedQuizOption === optIdx) {
                        optStyle = 'border-cyan-500 bg-cyan-950/20 text-cyan-200';
                      }

                      return (
                        <button
                          type="button"
                          key={optIdx}
                          disabled={isQuizSubmitted}
                          onClick={() => setSelectedQuizOption(optIdx)}
                          className={`w-full text-left p-3.5 rounded-md border text-sm transition-all flex items-start gap-3 ${optStyle}`}
                        >
                          <span className="font-mono text-xs opacity-60 w-5 flex-shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!isQuizSubmitted ? (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={selectedQuizOption === null}
                        onClick={handleSubmitQuiz}
                      >
                        Nộp câu trả lời
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 p-3.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)]">
                      <div className="font-semibold mb-1 flex items-center gap-1.5">
                        {selectedQuizOption === currentSlide.quizData.correctIndex ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Chính xác! Hoàn thành xuất sắc.
                          </span>
                        ) : (
                          <span className="text-rose-400">
                            Chưa chính xác. Đáp án đúng là{' '}
                            {String.fromCharCode(65 + currentSlide.quizData.correctIndex)}.
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--color-text-secondary)]">
                        <InlineMarkdown text={currentSlide.quizData.explanation} />
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Guided Practice Checkpoints */}
              {currentSlide.practiceData?.checkpoints && (
                <div className="my-5 p-5 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border-hairline)]">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Các bước kiểm tra thực hành có hướng dẫn</span>
                  </div>

                  <div className="space-y-2">
                    {currentSlide.practiceData.checkpoints.map((cp, idx) => {
                      const cpId = `${lesson.id}-cp-${idx}`;
                      const isChecked = !!checkedItems[cpId];

                      return (
                        <label
                          key={idx}
                          onClick={() => handleCheckpointToggle(cpId)}
                          className={`flex items-start gap-3 p-2.5 rounded cursor-pointer border transition-colors ${
                            isChecked
                              ? 'border-emerald-500/30 bg-emerald-950/10 text-[var(--color-text-primary)]'
                              : 'border-transparent hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                          }`}
                        >
                          <span className="mt-0.5">
                            {isChecked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-[var(--color-border-subtle)]" />
                            )}
                          </span>
                          <span className={`text-sm ${isChecked ? 'line-through opacity-70' : ''}`}>
                            <InlineMarkdown text={cp} />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Slide Controls Toolbar */}
            <div className="pt-6 border-t border-[var(--color-border-hairline)] flex items-center justify-between gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                data-testid="prev-slide-btn"
                onClick={goToPrevSlide}
                disabled={safeIndex === 0}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Trang Trước
              </Button>

              {safeIndex === totalSlides - 1 ? (
                <Button
                  variant={isCompleted ? 'outline' : 'accent-scripting'}
                  size="sm"
                  data-testid="complete-lesson-btn"
                  onClick={() => {
                    void handleManualComplete();
                  }}
                  leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                >
                  {isCompleted ? 'Đã hoàn thành bài học ✓' : 'Đánh dấu hoàn thành'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  data-testid="next-slide-btn"
                  onClick={goToNextSlide}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Trang Tiếp Theo
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer Navigation Hints */}
      <div className="px-6 py-2.5 bg-[var(--color-canvas)] border-t border-[var(--color-border-hairline)] flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-hairline)] font-mono text-[10px] text-white">
            &larr;
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-hairline)] font-mono text-[10px] text-white">
            &rarr;
          </kbd>
          <span>Sử dụng phím mũi tên hoặc các nút để điều hướng bài học</span>
        </span>
        <span className="font-mono">
          Giáo trình Affinity Studio &bull; Cấu trúc chuẩn 10 học phần
        </span>
      </div>

      {/* Visual Zoom Lightbox Modal */}
      {lightboxVisual && (
        <div
          data-testid="lesson-visual-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh minh họa phóng to"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setLightboxVisual(null)}
        >
          <div
            className="relative max-w-5xl w-full rounded-xl border border-hairline bg-[#090b10] p-4 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-cyan-300 truncate">
                {lightboxVisual.alt}
              </span>
              <button
                type="button"
                onClick={() => setLightboxVisual(null)}
                aria-label="Đóng khung xem phóng to"
                className="p-1.5 rounded-md border border-hairline bg-surface text-zinc-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={lightboxVisual.src}
                alt={lightboxVisual.alt}
                className="max-h-[72vh] w-auto object-contain rounded"
              />
            </div>
            {lightboxVisual.caption && (
              <p className="text-xs text-zinc-300 text-center">{lightboxVisual.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
