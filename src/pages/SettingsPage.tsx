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
import {
  usePreferences,
  type UserPreferences,
} from '@/lib/preferences-context';
import { useLearningProgress } from '@/lib/learning-store';

export interface SettingsPageProps {
  onBackToDashboard?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBackToDashboard }) => {
  const { preferences, updatePreferences } = usePreferences();
  const { resetAllLearningProgress } = useLearningProgress();

  const [draft, setDraft] = useState<UserPreferences>(preferences);
  const [isDirty, setIsDirty] = useState(false);
  const [isSavedToastVisible, setIsSavedToastVisible] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isDirty) {
      setDraft(preferences);
    }
  }, [preferences, isDirty]);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences(draft);
    setIsDirty(false);
    setIsSavedToastVisible(true);
    setTimeout(() => setIsSavedToastVisible(false), 2500);
  };

  const handleShortcutChange = (modifier: 'windows' | 'mac') => {
    setDraft((prev) => ({ ...prev, shortcutModifier: modifier }));
    updatePreferences({ shortcutModifier: modifier });
  };

  const handleExportData = () => {
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        preferences: draft,
        lessonProgressV2: localStorage.getItem('affinity_academy_progress_v2'),
        learningActivity: localStorage.getItem('affinity_academy_activity_v1'),
        capstoneSubmission: localStorage.getItem('affinity_academy_capstone_submission'),
        capstoneHistory: localStorage.getItem('affinity_academy_capstone_history'),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `affinity-academy-sao-luu-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Storage / blob fallback
    }
  };

  const handleResetAllProgress = () => {
    try {
      resetAllLearningProgress();
      localStorage.removeItem('affinity_academy_capstone_submission');
      localStorage.removeItem('affinity_academy_capstone_history');
      localStorage.removeItem('affinity_capstone_submission');
      localStorage.removeItem('affinity_capstone_official_evaluation');
      localStorage.removeItem('affinity_capstone_history');
      setIsResetConfirmOpen(false);
      setImportStatus('Đã đặt lại toàn bộ tiến độ học tập và đưa hồ sơ về trạng thái ban đầu.');
      setTimeout(() => setImportStatus(null), 3000);
    } catch {
      // Error
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cài Đặt Hệ Thống & Cấu Hình Tài Khoản"
        description="Quản lý hồ sơ học viên, lựa chọn phím tắt theo hệ điều hành Windows hoặc macOS, sao lưu và đặt lại dữ liệu tiến độ."
        badge="Thiết lập tài khoản & Hệ thống"
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
              <label htmlFor="settings-display-name" className="text-xs font-mono text-zinc-300 block">
                Tên hiển thị:
              </label>
              <input
                id="settings-display-name"
                type="text"
                value={draft.displayName}
                onChange={(e) => {
                  setIsDirty(true);
                  setDraft({ ...draft, displayName: e.target.value });
                }}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-email" className="text-xs font-mono text-zinc-300 block">
                Địa chỉ Email:
              </label>
              <input
                id="settings-email"
                type="email"
                value={draft.email}
                onChange={(e) => {
                  setIsDirty(true);
                  setDraft({ ...draft, email: e.target.value });
                }}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-career-track" className="text-xs font-mono text-zinc-300 block">
                Định hướng nghề nghiệp:
              </label>
              <select
                id="settings-career-track"
                value={draft.careerTrack}
                onChange={(e) => {
                  setIsDirty(true);
                  setDraft({ ...draft, careerTrack: e.target.value });
                }}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Thiết kế Vector & Nhận diện thương hiệu">
                  Thiết kế Vector &amp; Nhận diện thương hiệu
                </option>
                <option value="Chỉnh sửa ảnh & Ghép cảnh chuyên nghiệp">
                  Chỉnh sửa ảnh &amp; Ghép cảnh chuyên nghiệp
                </option>
                <option value="Biên tập dàn trang & Xuất bản ấn phẩm">
                  Biên tập dàn trang &amp; Xuất bản ấn phẩm
                </option>
                <option value="Tự động hóa thiết kế & Lập trình MCP">
                  Tự động hóa thiết kế &amp; Lập trình MCP
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-level" className="text-xs font-mono text-zinc-300 block">
                Trình độ hiện tại:
              </label>
              <select
                id="settings-level"
                value={draft.experienceLevel}
                onChange={(e) => {
                  setIsDirty(true);
                  setDraft({
                    ...draft,
                    experienceLevel: e.target.value as UserPreferences['experienceLevel'],
                  });
                }}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Beginner">Cơ bản</option>
                <option value="Intermediate">Trung cấp</option>
                <option value="Advanced">Nâng cao</option>
              </select>
            </div>
          </div>
        </div>

        {/* Studio & Shortcuts Preferences */}
        <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-purple-400" />
              2. Tùy Chọn Studio &amp; Phím Tắt Hệ Điều Hành
            </h3>
            <span className="text-xs font-mono text-zinc-500">Đồng bộ toàn ứng dụng</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-300 block">
                Phím bổ trợ hiển thị mặc định:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-testid="settings-os-windows"
                  onClick={() => handleShortcutChange('windows')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                    draft.shortcutModifier === 'windows'
                      ? 'bg-zinc-800 text-zinc-100 border-cyan-500/60 font-bold'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>Windows (Ctrl / Alt / Shift)</span>
                </button>

                <button
                  type="button"
                  data-testid="settings-os-mac"
                  onClick={() => handleShortcutChange('mac')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                    draft.shortcutModifier === 'mac'
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
                checked={draft.autoSaveProgress}
                onChange={(e) => {
                  setIsDirty(true);
                  setDraft({ ...draft, autoSaveProgress: e.target.checked });
                }}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-emerald-500"
              />
              <label htmlFor="autoSave" className="text-xs text-zinc-300 cursor-pointer">
                Tự động ghi nhớ vị trí trang học và kết quả thực hành trên trình duyệt
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
              Quay lại Hồ sơ học tập
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
            Sao lưu dữ liệu học tập ra tệp JSON hoặc đặt lại dữ liệu khi muốn bắt đầu học lại từ đầu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sao Lưu Dữ Liệu (Tải tệp JSON)</span>
          </button>

          <button
            type="button"
            data-testid="reset-progress-trigger"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Đặt lại toàn bộ tiến độ bài học</span>
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
                Hành động này sẽ xóa toàn bộ bài học đã hoàn thành, điểm số thử thách và hồ sơ nộp đồ án trên trình duyệt. Thao tác này không thể hoàn tác.
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
                  data-testid="confirm-reset-progress-btn"
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
