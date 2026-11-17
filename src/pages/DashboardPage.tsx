import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  RotateCw,
  Layers,
  ArrowRight,
  Flame,
  Settings as SettingsIcon,
  UserCheck,
} from 'lucide-react';
import { ALL_PILOT_LESSONS } from '@/data/curriculum/index';
import { lessonTranslationsVi } from '@/data/curriculum/translationsVi';
import { PRACTICE_CHALLENGES } from '@/data/challenges/index';
import { useLearningProgress } from '@/lib/learning-store';
import { usePreferences } from '@/lib/preferences-context';
import { useAuth } from '@/lib/supabase/auth-context';
import { flushSyncQueue } from '@/lib/supabase/progress-sync';
import { loadCurrentSubmission } from '@/lib/capstone-service';

export interface DashboardPageProps {
  onNavigate?: (route: string) => void;
}

const TRACK_FILTER_OPTIONS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'designer', label: 'Vector Studio' },
  { id: 'photo', label: 'Pixel Studio' },
  { id: 'publisher', label: 'Layout Studio' },
  { id: 'scripting', label: 'Tự động hóa' },
] as const;

const DIFFICULTY_VI: Record<string, string> = {
  Beginner: 'Cơ bản',
  Intermediate: 'Trung cấp',
  Advanced: 'Nâng cao',
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const { preferences } = usePreferences();
  const {
    completedLessonIds,
    inProgressLessonIds,
    completedCount,
    totalLessonsCount,
    activeStreakDays,
    totalStudyMinutes,
    challengeScores,
    getTrackProgress,
  } = useLearningProgress();

  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string>(() =>
    new Date().toLocaleTimeString('vi-VN')
  );
  const [activeFilterTrack, setActiveFilterTrack] = useState<string>('all');

  const capstoneStatus = useMemo(() => {
    const record = loadCurrentSubmission();
    const isPassed = Boolean(record.officialEvaluation?.passed);
    const score = record.officialEvaluation?.weightedScore ?? 0;
    const isSubmitted = record.status !== 'draft' && record.version > 0;
    return { isPassed, score, isSubmitted };
  }, []);

  const passedChallengesCount = useMemo(
    () => Object.values(challengeScores).filter((item) => item.passed).length,
    [challengeScores]
  );

  const overallPercentage =
    totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  const tracks = useMemo(() => {
    const designerProg = getTrackProgress('designer');
    const photoProg = getTrackProgress('photo');
    const publisherProg = getTrackProgress('publisher');
    const scriptingProg = getTrackProgress('scripting');

    return [
      { id: 'designer', name: 'Vector Studio', ...designerProg },
      { id: 'photo', name: 'Pixel Studio', ...photoProg },
      { id: 'publisher', name: 'Layout Studio', ...publisherProg },
      { id: 'scripting', name: 'Tự động hóa & MCP', ...scriptingProg },
    ];
  }, [getTrackProgress]);

  useEffect(() => {
    setLastSyncTime(new Date().toLocaleTimeString('vi-VN'));
  }, [completedCount, activeStreakDays]);

  const handleTriggerSync = async () => {
    setSyncStatus('syncing');
    if (user?.id) {
      await flushSyncQueue(user.id);
    }
    setLastSyncTime(new Date().toLocaleTimeString('vi-VN'));
    setSyncStatus('synced');
  };

  const filteredLessons = useMemo(
    () =>
      ALL_PILOT_LESSONS.filter((les) => {
        if (activeFilterTrack === 'all') return true;
        return les.trackId === activeFilterTrack;
      }),
    [activeFilterTrack]
  );

  const learnerName = profile?.display_name || preferences.displayName;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bảng Điều Khiển Học Viên & Hồ Sơ Năng Lực"
        description={`Xin chào ${learnerName}. Theo dõi tiến độ hoàn thành ${totalLessonsCount} bài học thực tế theo từng Studio, kết quả rèn luyện thử thách và trạng thái Đồ án tốt nghiệp.`}
        badge={`Hồ sơ học tập · ${overallPercentage}% (${completedCount} / ${totalLessonsCount} bài học)`}
      />

      {/* Local & Cloud Progress Synchronization Bar */}
      <div className="p-4 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              syncStatus === 'synced' ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'
            }`}
          />
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-zinc-200 font-bold block">
              {syncStatus === 'synced'
                ? 'Đã lưu tiến độ cục bộ an toàn'
                : 'Đang đồng bộ hóa dữ liệu...'}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-2">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>
                Học viên: {learnerName} &bull; Cập nhật lúc: {lastSyncTime}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              void handleTriggerSync();
            }}
            disabled={syncStatus === 'syncing'}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-cyan-400' : ''}`}
            />
            <span>Đồng bộ dữ liệu</span>
          </button>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Cài đặt</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          data-testid="dashboard-completed-card"
          className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Bài học hoàn thành</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {completedCount}{' '}
            <span className="text-xs text-zinc-500 font-normal">/ {totalLessonsCount} bài</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Thử thách thực hành</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {passedChallengesCount}{' '}
            <span className="text-xs text-zinc-500 font-normal">
              / {PRACTICE_CHALLENGES.length} hoàn thành
            </span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            {passedChallengesCount > 0
              ? 'Đã hoàn thành thử thách kỹ thuật'
              : 'Chưa hoàn thành thử thách nào'}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Đồ án tốt nghiệp</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {capstoneStatus.isPassed ? (
              <span className="text-emerald-400">ĐÃ ĐẠT</span>
            ) : capstoneStatus.isSubmitted ? (
              <span className="text-amber-300 text-lg">Chờ thẩm định</span>
            ) : (
              <span className="text-zinc-500">Chưa nộp</span>
            )}
          </div>
          <div className="text-[11px] text-purple-400 font-mono">
            {capstoneStatus.isPassed
              ? `Điểm chuẩn: ${capstoneStatus.score.toFixed(1)}/100`
              : 'Yêu cầu >= 75 điểm và đạt 5 tiêu chí trọng yếu'}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Chuỗi ngày học tập</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {activeStreakDays} ngày liên tiếp
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            {totalStudyMinutes} phút học tích lũy
          </div>
        </div>
      </div>

      {/* Studio Track Progress Breakdown */}
      <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
          Tiến Độ Đào Tạo Theo Từng Studio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200">{track.name}</span>
                <span className="text-xs font-mono text-zinc-400">
                  {track.completed} / {track.total} bài ({track.percentage}%)
                </span>
              </div>

              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    track.id === 'designer'
                      ? 'bg-sky-500'
                      : track.id === 'photo'
                      ? 'bg-emerald-500'
                      : track.id === 'publisher'
                      ? 'bg-purple-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${track.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>
                  Trạng thái:{' '}
                  {track.percentage === 100
                    ? 'Hoàn thành'
                    : track.percentage > 0
                    ? 'Đang học'
                    : 'Chưa bắt đầu'}
                </span>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('catalog')}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Vào lộ trình</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed & Available Lessons Section */}
      <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
            Danh Sách Bài Học ({totalLessonsCount} Bài)
          </h3>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {TRACK_FILTER_OPTIONS.map((trk) => (
              <button
                type="button"
                key={trk.id}
                data-testid={`dashboard-filter-${trk.id}`}
                onClick={() => setActiveFilterTrack(trk.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-all ${
                  activeFilterTrack === trk.id
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {trk.id === 'all' ? `${trk.label} (${totalLessonsCount})` : trk.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto p-1">
          {filteredLessons.map((les) => {
            const isDone = completedLessonIds.includes(les.id);
            const isInProgress = !isDone && inProgressLessonIds.includes(les.id);
            const displayTitle = lessonTranslationsVi[les.id] || les.title;

            return (
              <div
                key={les.id}
                data-testid={`dashboard-lesson-${les.id}`}
                data-status={isDone ? 'completed' : isInProgress ? 'in_progress' : 'pending'}
                className={`p-3.5 rounded-lg border flex items-start justify-between gap-2.5 ${
                  isDone
                    ? 'border-emerald-500/40 bg-emerald-950/15'
                    : 'border-[var(--color-border-hairline)] bg-[var(--color-surface)]'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 shrink-0">
                      {les.id}
                    </span>
                    <span className="text-xs font-bold text-zinc-200 truncate">{displayTitle}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                    <span>{les.durationMinutes} phút</span>
                    <span>&bull;</span>
                    <span>{DIFFICULTY_VI[les.difficulty] || les.difficulty}</span>
                    {isDone && (
                      <>
                        <span>&bull;</span>
                        <span className="text-emerald-400 font-semibold">Đã xong</span>
                      </>
                    )}
                    {isInProgress && (
                      <>
                        <span>&bull;</span>
                        <span className="text-amber-400">Đang học</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <span className="text-emerald-400" title="Đã hoàn thành">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="text-zinc-600" title="Chưa hoàn thành">
                      <Clock className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
