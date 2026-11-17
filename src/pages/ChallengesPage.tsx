import React, { useState, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Play,
  FileCheck,
  Target,
  Activity,
} from 'lucide-react';
import { PRACTICE_CHALLENGES } from '@/data/challenges/index';
import { useLearningProgress, recordChallengeAttempt } from '@/lib/learning-store';
import { PenNodeSimulator } from '@/components/simulator/PenNodeSimulator';
import { PhotoLayerSimulator } from '@/components/simulator/PhotoLayerSimulator';
import { PathCurve } from '@/components/simulator/types';
import { MaskEvalMetrics } from '@/components/simulator/pixel-processing';

export interface ChallengesPageProps {
  onNavigateToSandbox?: () => void;
}

const DIFFICULTY_VI: Record<string, string> = {
  Beginner: 'Cơ bản',
  Intermediate: 'Trung cấp',
  Advanced: 'Nâng cao',
};

const CHALLENGE_VECTOR_EXERCISE: Record<string, string> = {
  'ch-vec-diamond': 'ex-d02-diamond',
  'ch-vec-swave': 'ex-d03-wave',
  'ch-vec-heart': 'ex-d03-heart',
};

interface VectorEvalSnapshot {
  nodesCount: number;
  isClosed: boolean;
  accuracy: number;
  averageDistance: number;
  feedback: string;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({ onNavigateToSandbox }) => {
  const { challengeScores } = useLearningProgress();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(PRACTICE_CHALLENGES[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const [liveCanvasTouched, setLiveCanvasTouched] = useState<Record<string, boolean>>({});
  const [liveVectorEval, setLiveVectorEval] = useState<Record<string, VectorEvalSnapshot>>({});
  const [livePhotoEval, setLivePhotoEval] = useState<Record<string, MaskEvalMetrics>>({});
  const [evaluationResult, setEvaluationResult] = useState<{
    evaluated: boolean;
    passed: boolean;
    score: number;
    feedback: string;
    sourceLabel?: string;
  } | null>(null);

  const currentChallenge =
    PRACTICE_CHALLENGES.find((c) => c.id === selectedChallengeId) || PRACTICE_CHALLENGES[0];

  const isChallengeCompleted = challengeScores[currentChallenge.id]?.passed ?? false;
  const threshold = currentChallenge.starterData.targetTolerancePercent;

  const markStepsAuto = useCallback((challengeId: string, stepNums: number[]) => {
    setCompletedSteps((prev) => {
      const existing = prev[challengeId] || [];
      const merged = Array.from(new Set([...existing, ...stepNums]));
      if (merged.length === existing.length) return prev;
      return { ...prev, [challengeId]: merged };
    });
  }, []);

  const handleVectorCanvasChange = useCallback(
    (
      curve: PathCurve,
      evalRes: { accuracy: number; averageDistance: number; feedback: string }
    ) => {
      const cId = currentChallenge.id;
      const snap: VectorEvalSnapshot = {
        nodesCount: curve.nodes.length,
        isClosed: curve.isClosed,
        ...evalRes,
      };
      setLiveVectorEval((prev) => ({ ...prev, [cId]: snap }));

      if (curve.nodes.length > 0) {
        setLiveCanvasTouched((prev) => ({ ...prev, [cId]: true }));
        const autoSteps = [1];
        if (curve.nodes.length >= 3) autoSteps.push(2);
        if (
          (cId === 'ch-vec-swave' && curve.nodes.length >= 3) ||
          (cId !== 'ch-vec-swave' && curve.isClosed)
        ) {
          autoSteps.push(3);
        }
        if (evalRes.accuracy >= threshold) {
          autoSteps.push(4);
        }
        markStepsAuto(cId, autoSteps);
      }
    },
    [currentChallenge.id, threshold, markStepsAuto]
  );

  const handlePhotoMaskEvaluate = useCallback(
    (metrics: MaskEvalMetrics) => {
      const cId = currentChallenge.id;
      setLivePhotoEval((prev) => ({ ...prev, [cId]: metrics }));
      if (metrics.modifiedPixelsRatio > 0.015) {
        setLiveCanvasTouched((prev) => ({ ...prev, [cId]: true }));
        const autoSteps = [1];
        if (metrics.backdropConcealedPct >= 45) autoSteps.push(2);
        if (metrics.accuracy >= threshold) autoSteps.push(3);
        markStepsAuto(cId, autoSteps);
      }
    },
    [currentChallenge.id, threshold, markStepsAuto]
  );

  const handleToggleStep = (stepNumber: number) => {
    const list = completedSteps[currentChallenge.id] || [];
    const updated = list.includes(stepNumber)
      ? list.filter((s) => s !== stepNumber)
      : [...list, stepNumber];

    setCompletedSteps({
      ...completedSteps,
      [currentChallenge.id]: updated,
    });
  };

  const evaluateFromLiveCanvas = () => {
    const cId = currentChallenge.id;
    const isVector = currentChallenge.starterData.type === 'vector_path';

    if (!liveCanvasTouched[cId]) {
      const res = {
        evaluated: true,
        passed: false,
        score: 0,
        sourceLabel: 'Chấm điểm trực tiếp trên Canvas',
        feedback: isVector
          ? 'Bạn chưa vẽ đường path nào trên Canvas thực hành bên dưới. Hãy đặt các điểm neo theo đường mẫu xanh lá trước khi chấm điểm.'
          : 'Bạn chưa thực hiện tách nền trên Canvas Ảnh thật bên dưới. Hãy dùng cọ Mask Đen hoặc nút Tách nền thông minh trước khi chấm điểm.',
      };
      setEvaluationResult(res);
      recordChallengeAttempt(cId, 0, false);
      return;
    }

    if (isVector) {
      const snap = liveVectorEval[cId];
      const score = snap?.accuracy ?? 0;
      const passed = score >= threshold;
      const feedback = passed
        ? `Xuất sắc! Hình học Vector trên Canvas đạt ${score}% (sai số trung bình ${snap?.averageDistance ?? 0}px, đạt ngưỡng >= ${threshold}%).`
        : `${snap?.feedback ?? 'Đường path chưa khớp mẫu.'} Điểm hiện tại: ${score}% (ngưỡng yêu cầu: ${threshold}%).`;
      setEvaluationResult({
        evaluated: true,
        passed,
        score,
        sourceLabel: 'Chấm điểm hình học Bézier thực tế',
        feedback,
      });
      recordChallengeAttempt(cId, score, passed);
    } else {
      const snap = livePhotoEval[cId];
      const score = snap?.accuracy ?? 0;
      const passed = score >= threshold;
      setEvaluationResult({
        evaluated: true,
        passed,
        score,
        sourceLabel: 'Chấm điểm mặt nạ Pixel thực tế',
        feedback: snap?.feedback ?? 'Chưa phát hiện thao tác mặt nạ hợp lệ.',
      });
      recordChallengeAttempt(cId, score, passed);
    }
  };

  const handleEvaluateChallenge = () => {
    // If learner practiced directly on the embedded live Canvas, grade from real geometric/mask telemetry
    if (liveCanvasTouched[currentChallenge.id]) {
      evaluateFromLiveCanvas();
      return;
    }

    const stepCount = currentChallenge.steps.length;
    const completedCount = (completedSteps[currentChallenge.id] || []).length;

    const calculatedScore =
      completedCount === 0 || stepCount === 0
        ? 0
        : Math.round((completedCount / stepCount) * 100);
    const passed =
      completedCount > 0 && calculatedScore >= threshold;

    const result = {
      evaluated: true,
      passed,
      score: calculatedScore,
      feedback: passed
        ? `Hoàn thành tốt các bước thực hành với tỷ lệ đạt ${calculatedScore}% (ngưỡng yêu cầu: ${threshold}%).`
        : completedCount === 0
        ? `Bạn chưa hoàn thành bước thực hành nào (0 / ${stepCount} bước). Hãy thao tác trực tiếp trên Canvas bên dưới hoặc xác nhận từng bước trước khi kiểm tra.`
        : `Chưa đạt ngưỡng yêu cầu. Mức hoàn thành hiện tại là ${calculatedScore}% (yêu cầu tối thiểu ${threshold}%). Hãy hoàn tất đầy đủ các bước hướng dẫn.`,
    };

    setEvaluationResult(result);
    recordChallengeAttempt(currentChallenge.id, calculatedScore, passed);
  };

  const handleResetChallenge = () => {
    const cId = currentChallenge.id;
    setEvaluationResult(null);
    setCompletedSteps((prev) => ({ ...prev, [cId]: [] }));
    setLiveCanvasTouched((prev) => ({ ...prev, [cId]: false }));
    setLiveVectorEval((prev) => {
      const copy = { ...prev };
      delete copy[cId];
      return copy;
    });
    setLivePhotoEval((prev) => {
      const copy = { ...prev };
      delete copy[cId];
      return copy;
    });
    setActiveStepIndex(0);
  };

  const totalCompleted = Object.values(challengeScores).filter((p) => p.passed).length;
  const activeVectorAccuracy = liveVectorEval[currentChallenge.id]?.accuracy;
  const activePhotoAccuracy = livePhotoEval[currentChallenge.id]?.accuracy;
  const liveTelemetryScore =
    currentChallenge.starterData.type === 'vector_path'
      ? activeVectorAccuracy
      : activePhotoAccuracy;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thử Thách Kỹ Thuật & Bài Luyện Thực Hành"
        description="Thực hành trực tiếp trên Canvas Vector/Pixel được nhúng ngay bên dưới, chấm điểm độ chính xác hình học & mặt nạ theo thời gian thực."
        badge={`Thử thách thực hành · ${totalCompleted} / ${PRACTICE_CHALLENGES.length} hoàn thành`}
      />

      {/* Top Banner: Quick Switch to Sandbox */}
      <div className="p-4 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-zinc-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Khung Canvas nhúng bên dưới đã nạp sẵn đường mẫu thử thách hiện tại. Bạn cũng có thể mở toàn màn hình{' '}
            <strong>Phòng Mô Phỏng Tương Tác</strong>.
          </span>
        </div>
        {onNavigateToSandbox && (
          <button
            type="button"
            onClick={onNavigateToSandbox}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Mở Phòng mô phỏng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Grid: Challenge Selector & Steps/Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Challenge List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
              Danh sách thử thách ({PRACTICE_CHALLENGES.length})
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              {Math.round((totalCompleted / PRACTICE_CHALLENGES.length) * 100)}% hoàn thành
            </span>
          </div>

          <div className="space-y-2">
            {PRACTICE_CHALLENGES.map((challenge, index) => {
              const isSelected = challenge.id === selectedChallengeId;
              const isDone = challengeScores[challenge.id]?.passed ?? false;

              return (
                <button
                  type="button"
                  key={challenge.id}
                  data-testid={`challenge-item-${challenge.id}`}
                  onClick={() => {
                    setSelectedChallengeId(challenge.id);
                    setEvaluationResult(null);
                    setActiveStepIndex(0);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-zinc-800/80 border-emerald-500/50 shadow-sm'
                      : 'bg-[var(--color-canvas)] border-[var(--color-border-hairline)] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      Thử thách 0{index + 1}
                    </span>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đạt {challengeScores[challenge.id]?.score}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500">Chưa hoàn thành</span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-zinc-100 line-clamp-1">{challenge.titleVi}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {challenge.subtitleVi}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-[10px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {challenge.estimatedMinutes} phút
                    </span>
                    <span className="text-zinc-600">&bull;</span>
                    <span>{DIFFICULTY_VI[challenge.difficulty] || challenge.difficulty}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Challenge Overview, Steps & Grading Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                  {currentChallenge.relatedModule}
                </span>
                <h2 className="text-lg font-bold text-zinc-100 mt-0.5">{currentChallenge.titleVi}</h2>
              </div>
              {isChallengeCompleted && (
                <div className="px-3 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ĐÃ VƯỢT QUA</span>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{currentChallenge.scenarioOverview}</p>

            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                Kết quả kỹ thuật cần đạt:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{currentChallenge.expectedOutcome}</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                Hướng dẫn thực hiện từng bước
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                Đã hoàn thành {(completedSteps[currentChallenge.id] || []).length} /{' '}
                {currentChallenge.steps.length} bước
              </span>
            </div>

            <div className="space-y-3">
              {currentChallenge.steps.map((step, idx) => {
                const isStepChecked = (completedSteps[currentChallenge.id] || []).includes(
                  step.stepNumber
                );

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      activeStepIndex === idx
                        ? 'bg-zinc-900/90 border-cyan-500/50'
                        : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        data-testid={`challenge-step-${step.stepNumber}`}
                        aria-label={`Đánh dấu hoàn thành bước ${step.stepNumber}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStep(step.stepNumber);
                        }}
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isStepChecked
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : 'border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        {isStepChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-200">
                            Bước {step.stepNumber}: {step.title}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{step.instruction}</p>
                        {step.tip && (
                          <p className="text-[10px] text-amber-400/90 font-mono italic">
                            Mẹo: {step.tip}
                          </p>
                        )}
                        <p className="text-[10px] text-zinc-500 font-mono">
                          Điểm kiểm tra: {step.checkpoint}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetChallenge}
                className="px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại từ đầu</span>
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="evaluate-live-canvas-btn"
                  onClick={evaluateFromLiveCanvas}
                  className="px-4 py-2.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 font-semibold font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Chấm điểm trực tiếp trên Canvas</span>
                </button>

                <button
                  type="button"
                  data-testid="evaluate-challenge-btn"
                  onClick={handleEvaluateChallenge}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold font-mono text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Kiểm Tra Kết Quả (Chấm Điểm Thử Thách)</span>
                </button>
              </div>
            </div>

            {evaluationResult && (
              <div
                data-testid="challenge-evaluation-result"
                className={`p-4 rounded-xl border animate-in fade-in duration-200 space-y-2 ${
                  evaluationResult.passed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {evaluationResult.passed ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="font-mono font-bold text-xs">
                      {evaluationResult.passed
                        ? 'KẾT QUẢ: ĐẠT CHUẨN THỬ THÁCH'
                        : 'KẾT QUẢ: CẦN CẢI THIỆN'}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold">
                    Độ chính xác: {evaluationResult.score}%
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{evaluationResult.feedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width Embedded Interactive Simulator Workspace */}
      <section
        data-testid="challenge-live-workspace"
        className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Khung thực hành trực tiếp trên trình duyệt
            </span>
            <h3 className="text-base font-bold text-zinc-100 mt-0.5">
              {currentChallenge.titleVi}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              Ngưỡng đạt: <strong className="text-emerald-400">{threshold}%</strong>
            </span>
            {liveTelemetryScore !== undefined && (
              <span
                data-testid="challenge-live-telemetry"
                className={`px-2.5 py-1 rounded border ${
                  liveTelemetryScore >= threshold
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                }`}
              >
                Trên Canvas: <strong>{liveTelemetryScore}%</strong>
              </span>
            )}
          </div>
        </div>

        {currentChallenge.starterData.type === 'vector_path' ? (
          <PenNodeSimulator
            embeddedExerciseId={CHALLENGE_VECTOR_EXERCISE[currentChallenge.id] ?? 'ex-d02-diamond'}
            onCurveChange={handleVectorCanvasChange}
          />
        ) : (
          <PhotoLayerSimulator
            embeddedChallengeMode={true}
            onMaskEvaluate={handlePhotoMaskEvaluate}
          />
        )}
      </section>
    </div>
  );
};

export default ChallengesPage;
