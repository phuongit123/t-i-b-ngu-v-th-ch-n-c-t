import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  RotateCw,
  AlertTriangle,
  Layers,
  ArrowRight,
  Flame,
  Settings as SettingsIcon,
} from 'lucide-react';
import { ALL_PILOT_LESSONS } from '@/data/curriculum/index';

export interface DashboardPageProps {
  onNavigate?: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [challengesCount, setChallengesCount] = useState<number>(0);
  const [capstonePassed, setCapstonePassed] = useState<boolean>(false);
  const [capstoneScore, setCapstoneScore] = useState<number>(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('synced');
  const [syncErrorMessage, setSyncErrorMessage] = useState<string>('');
  const [activeFilterTrack, setActiveFilterTrack] = useState<string>('all');

  // Load actual progress from LocalStorage
  useEffect(() => {
    try {
      // 1. Lessons progress
      const savedLessons = localStorage.getItem('affinity_lesson_progress');
      if (savedLessons) {
        const parsed = JSON.parse(savedLessons);
        setCompletedLessonIds(Array.isArray(parsed) ? parsed : parsed.completedLessons || []);
      } else {
        // Fallback default: Mark first 2 lessons for illustration if empty
        setCompletedLessonIds(['D01-01', 'P01-01']);
      }

      // 2. Challenges progress
      const savedChallenges = localStorage.getItem('affinity_challenges_progress');
      if (savedChallenges) {
        const parsed = JSON.parse(savedChallenges) as Record<string, { completed?: boolean }>;
        const count = Object.values(parsed).filter((p) => Boolean(p?.completed)).length;
        setChallengesCount(count);
      }

      // 3. Capstone official evaluation
      const savedCapstone = localStorage.getItem('affinity_capstone_official_evaluation');
      if (savedCapstone) {
        const parsed = JSON.parse(savedCapstone);
        setCapstonePassed(parsed.isPassed || false);
        setCapstoneScore(parsed.totalWeightedScore || 0);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Track breakdown
  const tracks = [
    {
      id: 'designer',
      name: 'Vector Studio',
      totalLessons: 30,
      completed: completedLessonIds.filter((id) => id.startsWith('D')).length,
      color: 'sky',
    },
    {
      id: 'photo',
      name: 'Pixel Studio',
      totalLessons: 30,
      completed: completedLessonIds.filter((id) => id.startsWith('P')).length,
      color: 'emerald',
    },
    {
      id: 'publisher',
      name: 'Layout Studio',
      totalLessons: 3,
      completed: completedLessonIds.filter((id) => id.startsWith('B')).length,
      color: 'purple',
    },
    {
      id: 'scripting',
      name: 'Automation & MCP',
      totalLessons: 3,
      completed: completedLessonIds.filter((id) => id.startsWith('S')).length,
      color: 'amber',
    },
  ];

  const totalCompleted = completedLessonIds.length;
  const totalAvailableLessons = 66;
  const overallPercentage = Math.round((totalCompleted / totalAvailableLessons) * 100);

  // Trigger simulated sync
  const handleTriggerSync = (simulateFailure = false) => {
    setSyncStatus('syncing');
    setSyncErrorMessage('');

    setTimeout(() => {
      if (simulateFailure) {
        setSyncStatus('error');
        setSyncErrorMessage('Lỗi 503 Service Unavailable: Không thể kết nối với dịch vụ lưu trữ đám mây. Dữ liệu vẫn được bảo vệ an toàn trên trình duyệt cục bộ.');
      } else {
        setSyncStatus('synced');
      }
    }, 600);
  };

  const filteredLessons = ALL_PILOT_LESSONS.filter((les) => {
    if (activeFilterTrack === 'all') return true;
    if (activeFilterTrack === 'designer') return les.id.startsWith('D');
    if (activeFilterTrack === 'photo') return les.id.startsWith('P');
    if (activeFilterTrack === 'publisher') return les.id.startsWith('B');
    if (activeFilterTrack === 'scripting') return les.id.startsWith('S');
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <div className="flex flex-wrap items-center gap-3">
            <span>Bảng Điều Khiển Học Viên &amp; Hồ Sơ Năng Lực</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50">
              NHÓM DASHBOARD
            </span>
          </div>
        }
        description="Theo dõi tiến độ hoàn thành 66 bài học hiện hữu theo từng Studio, lịch sử rèn luyện thử thách, trạng thái tốt nghiệp Đồ án A5 và quản lý đồng bộ dữ liệu."
        badge={`Tiến độ tổng thể: ${overallPercentage}% (${totalCompleted} / 66 bài học)`}
      />

      {/* Cloud Sync Status & Error Simulation Bar */}
      <div className="p-4 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              syncStatus === 'synced'
                ? 'bg-emerald-400'
                : syncStatus === 'syncing'
                ? 'bg-cyan-400 animate-ping'
                : 'bg-red-400'
            }`}
          />
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-zinc-300 font-bold block">
              {syncStatus === 'synced' && 'Đã đồng bộ cục bộ an toàn'}
              {syncStatus === 'syncing' && 'Đang đồng bộ hóa tiến độ...'}
              {syncStatus === 'error' && 'Lỗi kết nối đồng bộ đám mây'}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">
              Lần lưu gần nhất: {new Date().toLocaleTimeString('vi-VN')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {syncStatus === 'error' ? (
            <button
              onClick={() => handleTriggerSync(false)}
              className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Thử lại đồng bộ</span>
            </button>
          ) : (
            <button
              onClick={() => handleTriggerSync(false)}
              disabled={syncStatus === 'syncing'}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Đồng bộ ngay</span>
            </button>
          )}

          {/* Error Simulation Trigger for Resilience Testing */}
          <button
            onClick={() => handleTriggerSync(true)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-500 hover:text-amber-400 border border-zinc-800 hover:border-amber-500/40"
            title="Kích hoạt giả lập lỗi đồng bộ để kiểm tra khả năng phục hồi lỗi"
          >
            Giả lập lỗi mạng
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('settings')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Cài đặt</span>
            </button>
          )}
        </div>
      </div>

      {/* Sync Error Banner if Active */}
      {syncStatus === 'error' && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/20 text-xs text-red-300 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong>Xử lý lỗi đồng bộ:</strong>
              <p className="text-zinc-400 leading-relaxed">{syncErrorMessage}</p>
            </div>
          </div>
          <button
            onClick={() => handleTriggerSync(false)}
            className="shrink-0 px-3 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 font-mono text-xs"
          >
            Đồng bộ lại
          </button>
        </div>
      )}

      {/* 4 Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Bài học hoàn thành</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {totalCompleted} <span className="text-xs text-zinc-500 font-normal">/ 66 bài</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${overallPercentage}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Thử thách thực hành</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {challengesCount} <span className="text-xs text-zinc-500 font-normal">/ 4 hoàn thành</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            {challengesCount > 0 ? 'Đã rèn luyện tương tác' : 'Chưa có thử thách nào'}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Tốt nghiệp Đồ án A5</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {capstonePassed ? (
              <span className="text-emerald-400">ĐÃ ĐẠT</span>
            ) : (
              <span className="text-zinc-500">Chưa nộp</span>
            )}
          </div>
          <div className="text-[11px] text-purple-400 font-mono">
            {capstonePassed ? `Điểm chuẩn: ${capstoneScore.toFixed(1)}/100` : 'Cần >= 75 điểm & 5 Critical'}
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Chuỗi ngày học tập</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            3 ngày <span className="text-xs text-emerald-400 font-normal">Active</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">Thời gian học: ~185 phút</div>
        </div>
      </div>

      {/* Studio Track Progress Breakdown */}
      <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
        <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
          Tiến Độ Đào Tạo Theo Từng Studio (Track Breakdown)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => {
            const pct = Math.round((track.completed / track.totalLessons) * 100);

            return (
              <div key={track.id} className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">{track.name}</span>
                  <span className="text-xs font-mono text-zinc-400">
                    {track.completed} / {track.totalLessons} bài ({pct}%)
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
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Trạng thái: {pct === 100 ? 'Hoàn thành' : pct > 0 ? 'Đang học' : 'Chưa bắt đầu'}</span>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('catalog')}
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Vào lộ trình</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed & Available Lessons Section */}
      <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
            Danh Sách Bài Học Hiện Có (66 Bài)
          </h3>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'designer', 'photo', 'publisher', 'scripting'].map((trk) => (
              <button
                key={trk}
                onClick={() => setActiveFilterTrack(trk)}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-all ${
                  activeFilterTrack === trk
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {trk === 'all' ? 'Tất cả (66)' : trk}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto p-1">
          {filteredLessons.map((les) => {
            const isDone = completedLessonIds.includes(les.id);

            return (
              <div
                key={les.id}
                className="p-3.5 rounded-lg border border-[var(--color-border-hairline)] bg-[var(--color-surface)] flex items-start justify-between gap-2.5"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {les.id}
                    </span>
                    <span className="text-xs font-bold text-zinc-200 truncate">{les.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                    <span>{les.durationMinutes} phút</span>
                    <span>&bull;</span>
                    <span className="capitalize">{les.difficulty}</span>
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
