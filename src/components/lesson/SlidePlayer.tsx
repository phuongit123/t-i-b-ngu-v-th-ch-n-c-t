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
  ShieldCheck
} from 'lucide-react';
import type { CurriculumLesson, LessonSlide } from '../../types/curriculum.ts';
import { Button } from '../ui/Button.tsx';

export interface SlidePlayerProps {
  lesson: CurriculumLesson;
  onLessonComplete?: (lessonId: string) => void;
  onBackToCatalog?: () => void;
}

export const SlidePlayer: React.FC<SlidePlayerProps> = ({
  lesson,
  onLessonComplete,
  onBackToCatalog,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const totalSlides = lesson.slides.length;
  const currentSlide: LessonSlide = lesson.slides[currentSlideIndex];
  const progressPercent = Math.round(((currentSlideIndex + 1) / totalSlides) * 100);

  // Navigate slides
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
    }
  }, [currentSlideIndex, totalSlides]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
    }
  }, [currentSlideIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

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
  }, [goToNextSlide, goToPrevSlide]);

  const handleCheckpointToggle = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleManualComplete = () => {
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

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] shadow-2xl overflow-hidden">
      {/* Top Header & Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-hairline)] bg-[var(--color-canvas)]">
        <div className="flex items-center gap-3">
          {onBackToCatalog && (
            <button
              onClick={onBackToCatalog}
              className="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
              title="Back to Catalog"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-mono font-semibold px-2 py-0.5 rounded border border-[var(--color-border-subtle)]"
                style={{ color: accentColor }}
              >
                {lesson.id}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)] font-medium uppercase tracking-wider">
                {lesson.trackId} Track &bull; {lesson.difficulty}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] truncate max-w-md">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Slide Counter & Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-[var(--color-text-primary)]">
              Slide {currentSlideIndex + 1}
            </span>
            <span className="text-xs font-mono text-[var(--color-text-secondary)]">
              {' '}/ {totalSlides}
            </span>
          </div>

          {/* Quick-Jump Dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {lesson.slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setSelectedQuizOption(null);
                  setIsQuizSubmitted(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-5'
                    : 'hover:opacity-75'
                }`}
                style={{
                  backgroundColor: idx === currentSlideIndex ? accentColor : 'var(--color-border-subtle)',
                }}
                title={`Jump to Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-[var(--color-canvas)] overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%`, backgroundColor: accentColor }}
        />
      </div>

      {/* Main Slide Stage Viewport */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col justify-between min-h-[460px]">
        <div>
          {/* Slide Type Tag & Header */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-canvas)] border border-[var(--color-border-hairline)] text-[var(--color-text-secondary)]">
                {currentSlide.type === 'intro' && <BookOpen className="w-3 h-3" />}
                {currentSlide.type === 'tool-anatomy' && <Keyboard className="w-3 h-3" />}
                {currentSlide.type === 'quiz' && <HelpCircle className="w-3 h-3" />}
                {currentSlide.type === 'challenge' && <Sparkles className="w-3 h-3" />}
                {currentSlide.type}
              </span>
              {currentSlide.subtitle && (
                <span className="text-xs text-[var(--color-text-secondary)]">
                  &bull; {currentSlide.subtitle}
                </span>
              )}
            </div>
            
            {/* Transparent Asset Status & Action */}
            {currentSlide.practiceData?.starterAsset && (
              <div>
                {currentSlide.practiceData.starterAsset.assetStatus === 'NOT_YET_AVAILABLE' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded border border-[var(--color-border-hairline)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Project File: In Development</span>
                  </span>
                ) : (
                  <a
                    href={`/${currentSlide.practiceData.starterAsset.filepath}`}
                    download
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono rounded border border-[var(--color-border-subtle)] bg-[var(--color-canvas)] hover:border-[var(--color-accent-scripting)] transition-colors text-[var(--color-text-primary)]"
                    title={`Download ${currentSlide.practiceData.starterAsset.filename}`}
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--color-accent-scripting)]" />
                    <span className="font-semibold text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border-hairline)]">
                      {currentSlide.practiceData.starterAsset.assetStatus === 'REAL_AFFINITY_FILE' && 'Native Project'}
                      {currentSlide.practiceData.starterAsset.assetStatus === 'GUIDE_DOCUMENT' && 'Guide Spec'}
                      {currentSlide.practiceData.starterAsset.assetStatus === 'JAVASCRIPT_SCRIPT' && 'DOM Script'}
                      {currentSlide.practiceData.starterAsset.assetStatus === 'EXTERNAL_RESOURCE' && 'External'}
                    </span>
                    <span>{currentSlide.practiceData.starterAsset.filename}</span>
                    <span className="text-[10px] text-[var(--color-text-secondary)]">
                      ({currentSlide.practiceData.starterAsset.filesize})
                    </span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Slide Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight mb-6">
            {currentSlide.title}
          </h1>

          {/* Current and legacy slide content */}
          <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-[var(--color-text-primary)] opacity-95 space-y-4 mb-6 whitespace-pre-line font-sans">
            {(currentSlide.contentMarkdown ?? currentSlide.content) && (
              <p>{currentSlide.contentMarkdown ?? currentSlide.content}</p>
            )}
            {currentSlide.bullets && currentSlide.bullets.length > 0 && (
              <ul className="list-disc pl-6 space-y-2">
                {currentSlide.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>

          {(currentSlide.tips || currentSlide.proTip || currentSlide.callout) && (
            <div className="my-4 p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-canvas)] text-sm text-[var(--color-text-primary)]">
              <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: accentColor }}>
                {currentSlide.tips ? 'Practice Tip' : 'Pro Tip'}
              </div>
              {currentSlide.tips ?? currentSlide.proTip ?? currentSlide.callout}
            </div>
          )}

          {currentSlide.codeSnippet && (
            <pre className="my-4 p-4 rounded-lg bg-[#0a0a0d] border border-[var(--color-border-hairline)] overflow-x-auto whitespace-pre-wrap text-xs font-mono text-emerald-300">
              {currentSlide.codeSnippet}
            </pre>
          )}

          {currentSlide.visualDescription && (
            <div className="my-4 p-4 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border-hairline)] text-xs text-[var(--color-text-secondary)]">
              {currentSlide.visualDescription}
            </div>
          )}

          {/* Action Box Callout */}
          {currentSlide.actionBox && (
            <div className="my-6 p-4 rounded-lg bg-[var(--color-canvas)] border-l-4 border-[var(--color-border-hairline)] flex items-start gap-3"
                 style={{ borderLeftColor: accentColor }}>
              <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                  {currentSlide.actionBox.label}
                </div>
                <div className="text-sm text-[var(--color-text-primary)]">
                  {currentSlide.actionBox.text}
                </div>
                {currentSlide.actionBox.shortcut && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
                    <span>Windows: <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-hairline)] text-white">{currentSlide.actionBox.shortcut.win}</kbd></span>
                    <span>&bull;</span>
                    <span>macOS: <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-hairline)] text-white">{currentSlide.actionBox.shortcut.mac}</kbd></span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visual Block (Diagram / Code / Table) */}
          {currentSlide.visual && (
            <div className="my-6 p-4 rounded-lg bg-[#0a0a0d] border border-[var(--color-border-hairline)] overflow-x-auto">
              {currentSlide.visual.type === 'code' && (
                <pre className="font-mono text-xs md:text-sm text-emerald-400 whitespace-pre">
                  {currentSlide.visual.content}
                </pre>
              )}
              {currentSlide.visual.type === 'diagram' && (
                <pre className="font-mono text-xs md:text-sm text-cyan-300 whitespace-pre">
                  {currentSlide.visual.content}
                </pre>
              )}
              {currentSlide.visual.type !== 'code' && currentSlide.visual.type !== 'diagram' && (
                <div className="font-mono text-xs text-[var(--color-text-secondary)] whitespace-pre-wrap">
                  {currentSlide.visual.content}
                </div>
              )}
            </div>
          )}

          {/* Interactive Quiz Renderer */}
          {currentSlide.quizData && (
            <div className="my-6 p-5 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border-subtle)]">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" style={{ color: accentColor }} />
                <span>{currentSlide.quizData.question}</span>
              </h3>

              <div className="space-y-2.5">
                {currentSlide.quizData.options.map((opt, optIdx) => {
                  let optStyle = 'border-[var(--color-border-hairline)] bg-[var(--color-surface)] hover:border-[var(--color-border-subtle)]';
                  
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

              {/* Submit Quiz Button */}
              {!isQuizSubmitted ? (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedQuizOption === null}
                    onClick={() => setIsQuizSubmitted(true)}
                  >
                    Submit Answer
                  </Button>
                </div>
              ) : (
                <div className="mt-4 p-3.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)]">
                  <div className="font-semibold mb-1 flex items-center gap-1.5">
                    {selectedQuizOption === currentSlide.quizData.correctIndex ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-rose-400">
                        Incorrect. Option {String.fromCharCode(65 + currentSlide.quizData.correctIndex)} is correct.
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--color-text-secondary)]">
                    {currentSlide.quizData.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Interactive Guided Practice Checkpoints */}
          {currentSlide.practiceData?.checkpoints && (
            <div className="my-6 p-5 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border-hairline)]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Hands-on Practice Checkpoints</span>
              </h3>

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
                        {cp}
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
            onClick={goToPrevSlide}
            disabled={currentSlideIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous Slide
          </Button>

          {/* Completion Button on Final Slide */}
          {currentSlideIndex === totalSlides - 1 ? (
            <Button
              variant={isCompleted ? 'outline' : 'accent-scripting'}
              size="sm"
              onClick={handleManualComplete}
              leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            >
              {isCompleted ? 'Lesson Completed ✓' : 'Mark as Completed'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={goToNextSlide}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next Slide
            </Button>
          )}
        </div>
      </div>

      {/* Footer Navigation Hints */}
      <div className="px-6 py-2.5 bg-[var(--color-canvas)] border-t border-[var(--color-border-hairline)] flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-hairline)] font-mono text-[10px] text-white">&larr;</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-hairline)] font-mono text-[10px] text-white">&rarr;</kbd>
          <span>Use Arrow keys or buttons to navigate slides</span>
        </span>
        <span className="font-mono">
          Affinity 3.0 Curriculum &bull; 10-Part Standard Model
        </span>
      </div>
    </div>
  );
};
