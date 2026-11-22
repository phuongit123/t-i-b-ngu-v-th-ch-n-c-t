import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  User,
  Settings as SettingsIcon,
  Laptop,
  Apple,
  Save,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export interface UserPreferences {
  displayName: string;
  email: string;
  careerTrack: string;
  experienceLevel: string;
  shortcutModifier: 'windows' | 'mac';
  autoSaveProgress: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  displayName: 'Nhà Thiết Kế Học Viên',
  email: 'learner@affinity.academy',
  careerTrack: 'Vector & Brand Identity',
  experienceLevel: 'Intermediate',
  shortcutModifier: 'windows',
  autoSaveProgress: true,
};

const PREFS_STORAGE_KEY = 'affinity_user_preferences';

export interface SettingsPageProps {
  onBackToDashboard?: () => void;
  onProgressReset?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBackToDashboard, onProgressReset }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isSavedToastVisible, setIsSavedToastVisible] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Load preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(saved) });
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(preferences));
      setIsSavedToastVisible(true);
      setTimeout(() => setIsSavedToastVisible(false), 2500);
    } catch {
      // Storage error
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        preferences,
        lessonProgress: localStorage.getItem('affinity_lesson_progress'),
        challengeProgress: localStorage.getItem('affinity_challenges_progress'),
        capstoneSubmission: localStorage.getItem('affinity_capstone_submission'),
        capstoneEvaluation: localStorage.getItem('affinity_capstone_official_evaluation'),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `affinity-academy-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Error handling
    }
  };

  const handleResetAllProgress = () => {
    try {
      localStorage.removeItem('affinity_lesson_progress');
      localStorage.removeItem('affinity_challenges_progress');
      localStorage.removeItem('affinity_capstone_submission');
      localStorage.removeItem('affinity_capstone_official_evaluation');
      onProgressReset?.();
      setIsResetConfirmOpen(false);
      setImportStatus('Đã thiết lập lại toàn bộ tiến độ học tập thành công.');
      setTimeout(() => setImportStatus(null), 3000);
    } catch {
      // Error
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          <div className="flex flex-wrap items-center gap-3">
            <span>Cài Đặt Hệ Thống &amp; Cấu Hình Tài Khoản</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              NHÓM DASHBOARD
            </span>
          </div>
        }
        description="Quản lý hồ sơ học viên, lựa chọn phím tắt theo hệ điều hành Windows hoặc macOS, sao lưu và quản lý dữ liệu tiến độ."
        badge="Cấu hình hệ thống · Bảo vệ dữ liệu cục bộ"
      />

      {isSavedToastVisible && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Đã lưu thành công các cài đặt và cấu hình tài khoản!</span>
        </div>
      )}

      {importStatus && (
        <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Profile Configuration Section */}
        <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              1. Cấu Hình Tài Khoản Học Viên
            </h3>
            <span className="text-xs font-mono text-zinc-500">Thông tin cá nhân</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 block">Tên hiển thị (Display Name):</label>
              <input
                type="text"
                value={preferences.displayName}
                onChange={(e) => setPreferences({ ...preferences, displayName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 block">Địa chỉ Email:</label>
              <input
                type="email"
                value={preferences.email}
                onChange={(e) => setPreferences({ ...preferences, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 block">Định hướng nghề nghiệp:</label>
              <select
                value={preferences.careerTrack}
                onChange={(e) => setPreferences({ ...preferences, careerTrack: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Vector & Brand Identity">Vector &amp; Nhận diện thương hiệu</option>
                <option value="Photo Retouching & Compositing">Chỉnh sửa ảnh chuyên nghiệp (Photo Retouching)</option>
                <option value="Editorial & Publication">Biên tập dàn trang xuất bản (Layout Studio)</option>
                <option value="Design Automation & MCP">Tự động hóa thiết kế (Scripting &amp; MCP)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300 block">Trình độ kinh nghiệm:</label>
              <select
                value={preferences.experienceLevel}
                onChange={(e) => setPreferences({ ...preferences, experienceLevel: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Beginner">Mới bắt đầu (Beginner)</option>
                <option value="Intermediate">Đã có nền tảng (Intermediate)</option>
                <option value="Advanced">Chuyên nghiệp (Advanced)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Studio & Shortcuts Preferences */}
        <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-purple-400" />
              2. Tùy Chọn Studio &amp; Phím Tắt
            </h3>
            <span className="text-xs font-mono text-zinc-500">Môi trường thao tác</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-300 block">
                Phím bổ trợ hiển thị mặc định (Modifier Keys):
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, shortcutModifier: 'windows' })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                    preferences.shortcutModifier === 'windows'
                      ? 'bg-zinc-800 text-zinc-100 border-cyan-500/60 font-bold'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>Windows (Ctrl / Alt / Shift)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, shortcutModifier: 'mac' })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                    preferences.shortcutModifier === 'mac'
                      ? 'bg-zinc-800 text-zinc-100 border-cyan-500/60 font-bold'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  <Apple className="w-4 h-4 text-zinc-200" />
                  <span>macOS (Cmd / Option / Shift)</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <input
                type="checkbox"
                id="autoSave"
                checked={preferences.autoSaveProgress}
                onChange={(e) => setPreferences({ ...preferences, autoSaveProgress: e.target.checked })}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
              />
              <label htmlFor="autoSave" className="text-xs text-zinc-300 cursor-pointer">
                Tự động lưu tiến độ làm bài tập và bài nộp vào bộ nhớ trình duyệt (Auto-Save Local Storage)
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            >
              Quay lại Bảng điều khiển
            </button>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold font-mono text-xs flex items-center gap-2 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu Thay Đổi Cài Đặt</span>
          </button>
        </div>
      </form>

      {/* Data Management Section (Export, Reset) */}
      <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
        <div className="border-b border-zinc-800 pb-3">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            3. Quản Lý Dữ Liệu &amp; Tiến Độ Học Tập
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Sao lưu dữ liệu học tập ra file JSON hoặc đặt lại dữ liệu khi cần làm lại từ đầu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sao Lưu Dữ Liệu (Export JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Đặt Lại Toàn Bộ Tiến Độ (Reset Progress)</span>
          </button>
        </div>

        {/* Confirmation Modal */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full p-6 rounded-xl bg-zinc-900 border border-red-500/40 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h4 className="text-sm font-bold font-mono">Xác nhận xóa toàn bộ tiến độ?</h4>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Hành động này sẽ xóa toàn bộ bài học đã hoàn thành, điểm số thử thách và bản nộp Đồ án A5 khỏi trình duyệt. Thao tác này không thể hoàn tác.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleResetAllProgress}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono"
                >
                  Đồng ý xóa sạch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
