import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Compass,
  Download,
  ExternalLink,
  HelpCircle,
  Image as ImageIcon,
  Keyboard,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench,
  ZoomIn,
} from 'lucide-react';
import type { CurriculumLesson, PitfallItem } from '@/types/curriculum';
import { usePreferences, formatShortcutForOs } from '@/lib/preferences-context';
import { resolveCurriculumAssetUrl } from '@/lib/curriculum-asset-urls';
import { getLessonVisualShowcase } from '@/lib/lesson-visuals';
import { BeforeAfterSlider } from '@/components/common/BeforeAfterSlider';
import { InlineMarkdown, SafeMarkdown } from '@/components/common/SafeMarkdown';
import { Button } from '@/components/ui/Button';

export interface LessonSectionsReaderProps {
  lesson: CurriculumLesson;
  displayTitle: string;
  accentColor: string;
  checkedItems: Record<string, boolean>;
  onToggleCheckpoint: (id: string) => void;
  activeSectionIndex?: number | null;
  onSelectLesson?: (lessonId: string) => void;
  onNavigate?: (route: string) => void;
  onOpenLightbox?: (visual: { src: string; alt: string; caption?: string; isDiagram?: boolean }) => void;
  isCompleted?: boolean;
  onCompleteLesson?: () => void;
}

export const LessonSectionsReader: React.FC<LessonSectionsReaderProps> = ({
  lesson,
  displayTitle,
  accentColor,
  checkedItems,
  onToggleCheckpoint,
  activeSectionIndex = null,
  onSelectLesson,
  onNavigate,
  onOpenLightbox,
  isCompleted = false,
  onCompleteLesson,
}) => {
  const { preferences } = usePreferences();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setSelectedAnswers({});
    setSubmittedQuestions({});
  }, [lesson.id]);

  useEffect(() => {
    if (!activeSectionIndex || activeSectionIndex < 1 || activeSectionIndex > 10) return;
    const el = document.getElementById(`lesson-section-${activeSectionIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSectionIndex, lesson.id]);

  const sections = lesson.standardSections;
  const visualShowcase = getLessonVisualShowcase(lesson.id, lesson.moduleId, lesson.trackId);
  const starterAsset = sections.independentChallenge.starterAsset ?? lesson.practiceAsset;
  const starterDownloadUrl = starterAsset
    ? resolveCurriculumAssetUrl(starterAsset.filepath) ?? resolveCurriculumAssetUrl(starterAsset.filename)
    : null;
  const challengeCriteria =
    sections.independentChallenge.challengeCriteria ??
    sections.independentChallenge.successCriteria ??
    [];
  const summaryPoints =
    sections.summaryAndResources.summaryPoints ??
    sections.summaryAndResources.keyTakeaways ??
    [];
  const relatedResources = sections.summaryAndResources.relatedResources ?? [];

  const formatPitfallTitle = (item: PitfallItem) => item.pitfall ?? item.mistake ?? 'Lỗi thường gặp';
  const formatPitfallCause = (item: PitfallItem) => item.cause ?? item.consequence ?? '';

  return (
    <div className="space-y-6 pb-4" data-testid="lesson-sections-reader">
      {/* Single H1 when in 10-section Reader mode */}
      <div className="border-b border-hairline pb-4">
        <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
          Tài Liệu Đọc Sâu 10 Học Phần Chuẩn Hóa
        </div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold text-white tracking-tight">
          {displayTitle}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">{lesson.subtitle}</p>
      </div>

      {/* Section 1: Learning Objectives */}
      <section
        id="lesson-section-1"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <Target className="w-4 h-4" />
          <span>01 · Mục tiêu bài học (Learning Objectives)</span>
        </div>
        <ul className="space-y-2">
          {sections.learningObjectives.map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-200 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>
                <InlineMarkdown text={obj} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 2: Foundational Knowledge */}
      <section
        id="lesson-section-2"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
            <BookOpen className="w-4 h-4" />
            <span>02 · Kiến thức nền tảng &amp; Tư duy thiết kế</span>
          </div>
          {sections.technicalEvidence && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
              <ShieldCheck className="w-3 h-3" />
              Kiểm chứng kỹ thuật · {sections.technicalEvidence.source}
            </span>
          )}
        </div>
        <SafeMarkdown content={sections.foundationalKnowledge} className="text-sm text-zinc-200" />
      </section>

      {/* Section 3: Tool & Feature Explanation */}
      <section
        id="lesson-section-3"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <Wrench className="w-4 h-4" />
          <span>03 · Giải phẫu công cụ &amp; Phím tắt chính thức</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border border-hairline bg-surface p-4">
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Công cụ / Tính năng</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {sections.toolAndFeatureExplanation.toolName}
            </div>
            <div className="text-xs text-cyan-300 mt-1">
              Không gian: {sections.toolAndFeatureExplanation.persona}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {preferences.shortcutModifier === 'mac' ? 'Phím tắt macOS' : 'Phím tắt Windows'}
              </span>
            </div>
            <div className="mt-1 inline-block rounded border border-hairline bg-obsidian px-2.5 py-1 text-xs font-mono text-emerald-300">
              {formatShortcutForOs(
                sections.toolAndFeatureExplanation.shortcut.win,
                sections.toolAndFeatureExplanation.shortcut.mac,
                preferences.shortcutModifier
              )}
            </div>
          </div>
        </div>

        <SafeMarkdown
          content={sections.toolAndFeatureExplanation.description}
          className="text-sm text-zinc-200"
        />

        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Tùy chọn trên Context Toolbar &amp; Bảng điều khiển
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.toolAndFeatureExplanation.contextBarOptions.map((opt, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-hairline bg-surface/70 px-3 py-2 text-xs text-zinc-300 leading-relaxed"
              >
                <InlineMarkdown text={opt} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 4: Step-by-Step Instructions */}
      <section
        id="lesson-section-4"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
          <ListChecks className="w-4 h-4" />
          <span>04 · Quy trình thực hành từng bước</span>
        </div>
        <div className="space-y-3">
          {sections.stepByStepInstructions.map((step) => (
            <div
              key={step.stepNumber}
              className="rounded-lg border border-hairline bg-surface p-4 flex flex-col sm:flex-row sm:items-start gap-3"
            >
              <span
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold text-zinc-950"
                style={{ backgroundColor: accentColor }}
              >
                {step.stepNumber}
              </span>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-bold text-white">{step.title}</div>
                  {step.shortcutTip && (
                    <kbd className="rounded border border-hairline bg-obsidian px-2 py-0.5 text-[11px] font-mono text-emerald-300">
                      {formatShortcutForOs(
                        step.shortcutTip.win,
                        step.shortcutTip.mac,
                        preferences.shortcutModifier
                      )}
                    </kbd>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  <InlineMarkdown text={step.instruction} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Visual Examples & Interactive Graphics */}
      <section
        id="lesson-section-5"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <ImageIcon className="w-4 h-4" />
          <span>05 · Ví dụ trực quan, Sơ đồ &amp; Bảng thông số</span>
        </div>

        {/* Visual Showcase Plate or Before/After Comparison */}
        {visualShowcase.comparisonSlider && (
          <BeforeAfterSlider
            beforeSrc={visualShowcase.comparisonSlider.beforeSrc}
            afterSrc={visualShowcase.comparisonSlider.afterSrc}
            beforeLabel={visualShowcase.comparisonSlider.beforeLabel}
            afterLabel={visualShowcase.comparisonSlider.afterLabel}
          />
        )}

        <div className="rounded-xl border border-hairline bg-[#090b10] overflow-hidden">
          <div className="relative flex items-center justify-center max-h-80 overflow-hidden bg-[#090b10]">
            <img
              src={visualShowcase.primary.src}
              alt={visualShowcase.primary.alt}
              className={
                visualShowcase.primary.isDiagram
                  ? 'w-full max-h-80 object-contain p-3'
                  : 'w-full max-h-80 object-cover'
              }
            />
            {onOpenLightbox && (
              <button
                type="button"
                onClick={() => onOpenLightbox(visualShowcase.primary)}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-hairline bg-obsidian/90 px-3 py-1.5 text-xs font-mono text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Phóng to hình minh họa</span>
              </button>
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-hairline bg-surface text-xs text-zinc-300">
            {visualShowcase.primary.caption}
          </div>
        </div>

        <div className="space-y-4">
          {sections.visualExamples.map((example, idx) => (
            <div key={idx} className="rounded-lg border border-hairline bg-surface p-4 space-y-2.5">
              <div className="text-sm font-bold text-white">{example.title}</div>
              <p className="text-xs text-zinc-400">{example.description}</p>
              {example.visualType === 'table' || example.visualContent.includes('|---') ? (
                <SafeMarkdown content={example.visualContent} />
              ) : example.visualType === 'code' ? (
                <pre className="p-3.5 rounded-lg bg-[#0a0a0d] border border-hairline font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre">
                  {example.visualContent}
                </pre>
              ) : (
                <pre className="p-3.5 rounded-lg bg-[#0a0a0d] border border-hairline font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                  {example.visualContent}
                </pre>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Guided Practice */}
      <section
        id="lesson-section-6"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>06 · Thực hành có hướng dẫn (Guided Practice)</span>
        </div>
        <div className="text-base font-bold text-white">{sections.guidedPractice.title}</div>
        <SafeMarkdown content={sections.guidedPractice.taskDescription} className="text-sm text-zinc-300" />
        <div className="space-y-2 pt-1">
          {sections.guidedPractice.checkpoints.map((cp, idx) => {
            const cpId = `${lesson.id}-sec-cp-${idx}`;
            const isChecked = !!checkedItems[cpId];
            return (
              <label
                key={idx}
                onClick={() => onToggleCheckpoint(cpId)}
                className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                  isChecked
                    ? 'border-emerald-500/30 bg-emerald-950/10 text-zinc-100'
                    : 'border-hairline bg-surface/50 hover:bg-surface text-zinc-300'
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-500" />
                  )}
                </span>
                <span className={`text-xs sm:text-sm ${isChecked ? 'line-through opacity-75' : ''}`}>
                  <InlineMarkdown text={cp} />
                </span>
              </label>
            );
          })}
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/10 p-3 text-xs text-emerald-200">
          <span className="font-mono font-semibold uppercase mr-2">Kết quả mong đợi:</span>
          {sections.guidedPractice.expectedOutcome}
        </div>
      </section>

      {/* Section 7: Independent Challenge */}
      <section
        id="lesson-section-7"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>07 · Thử thách thiết kế độc lập</span>
          </div>
          {starterAsset && starterDownloadUrl && (
            <a
              href={starterDownloadUrl}
              download={starterAsset.filename}
              className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-mono text-cyan-300 hover:border-cyan-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải tệp thực hành ({starterAsset.filename})</span>
            </a>
          )}
        </div>
        <div className="text-base font-bold text-white">{sections.independentChallenge.title}</div>
        <SafeMarkdown content={sections.independentChallenge.prompt} className="text-sm text-zinc-200" />
        {challengeCriteria.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-mono uppercase text-zinc-400">Tiêu chí tự nghiệm thu sản phẩm</div>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-zinc-300">
              {challengeCriteria.map((criterion, idx) => (
                <li key={idx}>
                  <InlineMarkdown text={criterion} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {sections.independentChallenge.bonusGoal && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <span className="font-mono font-semibold uppercase mr-1.5">Mục tiêu mở rộng:</span>
            {sections.independentChallenge.bonusGoal}
          </div>
        )}
      </section>

      {/* Section 8: Common Pitfalls */}
      <section
        id="lesson-section-8"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400">
          <AlertTriangle className="w-4 h-4" />
          <span>08 · Lỗi thường gặp &amp; Cách khắc phục</span>
        </div>
        <div className="space-y-3">
          {sections.commonPitfalls.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-hairline bg-surface p-4 space-y-1.5">
              <div className="text-sm font-bold text-rose-300">{formatPitfallTitle(item)}</div>
              {formatPitfallCause(item) && (
                <p className="text-xs text-zinc-400">
                  <span className="font-mono text-zinc-300 font-semibold">Nguyên nhân: </span>
                  <InlineMarkdown text={formatPitfallCause(item)} />
                </p>
              )}
              <p className="text-xs sm:text-sm text-emerald-300">
                <span className="font-mono font-semibold">Cách xử lý: </span>
                <InlineMarkdown text={item.solution} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9: Knowledge Check (All Quiz Questions) */}
      <section
        id="lesson-section-9"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
          <HelpCircle className="w-4 h-4" />
          <span>09 · Kiểm tra kiến thức ({sections.knowledgeCheck.length} câu hỏi)</span>
        </div>
        <div className="space-y-4">
          {sections.knowledgeCheck.map((q, qIdx) => {
            const chosen = selectedAnswers[qIdx];
            const isSubmitted = !!submittedQuestions[qIdx];
            return (
              <div key={q.id ?? qIdx} className="rounded-lg border border-hairline bg-surface p-4 space-y-3">
                <div className="text-sm font-semibold text-white">
                  Câu {qIdx + 1}: <InlineMarkdown text={q.question} />
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    let cls =
                      'border-hairline bg-canvas hover:border-zinc-500 text-zinc-200';
                    if (isSubmitted) {
                      if (optIdx === q.correctIndex) {
                        cls = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200';
                      } else if (optIdx === chosen) {
                        cls = 'border-rose-500/80 bg-rose-950/30 text-rose-200';
                      }
                    } else if (chosen === optIdx) {
                      cls = 'border-cyan-500 bg-cyan-950/30 text-cyan-200';
                    }
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() =>
                          setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                        }
                        className={`w-full text-left rounded-md border px-3 py-2 text-xs sm:text-sm flex items-start gap-2.5 transition-colors ${cls}`}
                      >
                        <span className="font-mono text-zinc-400 shrink-0">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {!isSubmitted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={chosen === undefined}
                    onClick={() =>
                      setSubmittedQuestions((prev) => ({ ...prev, [qIdx]: true }))
                    }
                  >
                    Kiểm tra đáp án
                  </Button>
                ) : (
                  <div className="rounded border border-hairline bg-canvas p-3 text-xs text-zinc-300 space-y-1">
                    <div
                      className={
                        chosen === q.correctIndex
                          ? 'text-emerald-400 font-semibold'
                          : 'text-rose-400 font-semibold'
                      }
                    >
                      {chosen === q.correctIndex
                        ? 'Chính xác!'
                        : `Chưa đúng. Đáp án chuẩn là ${String.fromCharCode(65 + q.correctIndex)}.`}
                    </div>
                    <p>
                      <InlineMarkdown text={q.explanation} />
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 10: Summary & Related Resources */}
      <section
        id="lesson-section-10"
        className="scroll-mt-24 rounded-xl border border-hairline bg-canvas p-5 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
          <Compass className="w-4 h-4" />
          <span>10 · Tổng kết nguyên lý &amp; Học liệu mở rộng</span>
        </div>

        <ul className="space-y-2">
          {summaryPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <span>
                <InlineMarkdown text={point} />
              </span>
            </li>
          ))}
        </ul>

        {sections.summaryAndResources.nextSteps && (
          <div className="rounded-lg border border-hairline bg-surface p-3 text-xs text-zinc-300">
            <span className="font-mono text-cyan-300 font-semibold mr-1.5">Bước tiếp theo:</span>
            {sections.summaryAndResources.nextSteps}
          </div>
        )}

        <div className="flex flex-wrap gap-2.5 pt-1">
          {relatedResources.map((res, idx) => {
            const guideUrl = resolveCurriculumAssetUrl(res.target);
            if ((res.type === 'next-lesson' || res.type === 'next-track') && onSelectLesson) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectLesson(res.target)}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-medium text-cyan-200 hover:bg-cyan-500/20 transition-colors"
                >
                  <span>{res.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              );
            }
            if (guideUrl) {
              return (
                <a
                  key={idx}
                  href={guideUrl}
                  download={res.target.split('/').pop()}
                  className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3.5 py-2 text-xs font-medium text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{res.title}</span>
                </a>
              );
            }
            if (res.target.startsWith('http')) {
              return (
                <a
                  key={idx}
                  href={res.target}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3.5 py-2 text-xs font-medium text-zinc-300 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{res.title}</span>
                </a>
              );
            }
            return null;
          })}

          {sections.summaryAndResources.officialDocsUrl && (
            <a
              href={sections.summaryAndResources.officialDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3.5 py-2 text-xs font-medium text-zinc-300 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>Tài liệu Affinity chính thức</span>
            </a>
          )}

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/20 transition-colors"
            >
              <span>Thực hành ngay trên Bộ mô phỏng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onCompleteLesson && (
            <Button
              variant={isCompleted ? 'outline' : 'accent-scripting'}
              size="sm"
              data-testid="sections-complete-lesson-btn"
              onClick={onCompleteLesson}
              leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            >
              {isCompleted ? 'Đã hoàn thành bài học ✓' : 'Đánh dấu hoàn thành bài học'}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default LessonSectionsReader;
