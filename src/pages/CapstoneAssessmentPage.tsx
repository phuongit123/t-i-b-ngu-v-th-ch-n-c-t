import React, { useState, useEffect } from 'react';
import {
  DEFAULT_LUMINA_PROJECT,
  CAPSTONE_RUBRIC_DIMENSIONS,
  calculateWeightedScore,
  evaluatePassFail,
  loadCurrentSubmission,
  saveStudentSubmission,
  getSubmissionHistory,
} from '@/lib/capstone-service';
import {
  validateSubmissionFile,
  uploadSubmissionArtifact,
  getSubmissionSignedUrl,
} from '@/lib/supabase/storage';
import { useAuth } from '@/lib/supabase/auth-context';
import { listCloudSubmissions, submitCloudCapstone, gradeCloudCapstone } from '@/lib/cloud-capstone';
import { readOfflineArtifact } from '@/lib/offline-artifacts';
import { learningStorageKey } from '@/lib/learning-storage';
import { usePreferences } from '@/lib/preferences-context';
import type {
  RubricDimensionId,
  RubricLevelId,
  CapstoneSubmissionRecord,
  SubmissionArtifacts,
  SubmissionHistoryEntry,
} from '@/types/capstone';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  History,
  Send,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Download,
  Info,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';

type ArtifactFieldKey =
  | 'briefDeconstructionUrl'
  | 'iterationLogUrl'
  | 'vectorSourcePath'
  | 'pixelSourcePath'
  | 'printPdfPath'
  | 'digitalWebpPath';

interface UploadedFileMeta {
  filename: string;
  sizeBytes: number;
  storagePath: string;
}

interface UploadFieldConfig {
  key: ArtifactFieldKey;
  testId: string;
  label: string;
  ploTag: string;
  accept: string;
  formatHint: string;
  artifactType: string;
}

const UPLOAD_FIELDS: UploadFieldConfig[] = [
  {
    key: 'briefDeconstructionUrl',
    testId: 'upload-brief',
    label: 'Văn bản Phân rã Brief (brief-deconstruction.md) *',
    ploTag: 'PLO-07',
    accept: '.md,.pdf,.txt',
    formatHint: 'Chấp nhận .md, .pdf, .txt (tối đa 50 MB)',
    artifactType: 'brief',
  },
  {
    key: 'iterationLogUrl',
    testId: 'upload-iteration',
    label: 'Nhật ký Sửa đổi & Phản biện (iteration-critique-log.md) *',
    ploTag: 'PLO-08',
    accept: '.md,.pdf,.txt',
    formatHint: 'Chấp nhận .md, .pdf, .txt (tối đa 50 MB)',
    artifactType: 'iteration',
  },
  {
    key: 'vectorSourcePath',
    testId: 'upload-vector',
    label: 'File nguồn Vector (.afdesign) *',
    ploTag: 'Symbols & Constraints',
    accept: '.afdesign,.zip',
    formatHint: 'Chấp nhận .afdesign, .zip (tối đa 50 MB)',
    artifactType: 'vector',
  },
  {
    key: 'pixelSourcePath',
    testId: 'upload-pixel',
    label: 'File nguồn Pixel (.afphoto) *',
    ploTag: 'Live Lighting & Mask',
    accept: '.afphoto,.zip',
    formatHint: 'Chấp nhận .afphoto, .zip (tối đa 50 MB)',
    artifactType: 'pixel',
  },
  {
    key: 'printPdfPath',
    testId: 'upload-print-pdf',
    label: 'Bản xuất in ấn PDF/X-4 CMYK 300 DPI (3mm Bleed) *',
    ploTag: 'PLO-09 In ấn',
    accept: '.pdf',
    formatHint: 'Chấp nhận .pdf (tối đa 50 MB)',
    artifactType: 'print_pdf',
  },
  {
    key: 'digitalWebpPath',
    testId: 'upload-digital-webp',
    label: 'Ấn phẩm kỹ thuật số (WebP / PNG / JPG 2x) *',
    ploTag: 'PLO-09 Digital',
    accept: '.webp,.png,.jpg,.jpeg',
    formatHint: 'Chấp nhận .webp, .png, .jpg, .jpeg (tối đa 50 MB)',
    artifactType: 'digital_poster',
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const CapstoneAssessmentPage: React.FC = () => {
  const { user, profile, role, isConfigured } = useAuth();
  const { preferences } = usePreferences();

  // Strict RBAC check: evaluator console is ONLY rendered for authenticated evaluators or admins
  const canEvaluate = Boolean(user && (role === 'evaluator' || role === 'admin'));

  const [activeTab, setActiveTab] = useState<'brief' | 'rubric' | 'submit' | 'results'>('brief');
  const [submission, setSubmission] = useState<CapstoneSubmissionRecord>(() => loadCurrentSubmission(!isConfigured));
  const [assignedWork, setAssignedWork] = useState<CapstoneSubmissionRecord[]>([]);
  const [reviewId, setReviewId] = useState('');
  const [saving, setSaving] = useState(false);
  const userId = user?.id;
  const review = assignedWork.find(row => row.id === reviewId);
  const [history, setHistory] = useState<SubmissionHistoryEntry[]>([]);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Student artifact upload state
  const [artifacts, setArtifacts] = useState<SubmissionArtifacts>(submission.artifacts);
  const [uploadedMeta, setUploadedMeta] = useState<Partial<Record<ArtifactFieldKey, UploadedFileMeta>>>({});
  const [uploadErrors, setUploadErrors] = useState<Partial<Record<ArtifactFieldKey, string>>>({});
  const [uploadingField, setUploadingField] = useState<ArtifactFieldKey | null>(null);

  const [selfScores, setSelfScores] = useState<Record<RubricDimensionId, RubricLevelId>>(
    submission.selfAssessment?.scores || {
      brief_interpretation: 3,
      visual_communication: 3,
      tool_selection: 3,
      non_destructive: 3,
      iteration_critique: 3,
      production_readiness: 3,
      independent_transfer: 3,
    }
  );
  const [selfJustifications, setSelfJustifications] = useState<Record<RubricDimensionId, string>>(
    submission.selfAssessment?.justifications || {
      brief_interpretation: '',
      visual_communication: '',
      tool_selection: '',
      non_destructive: '',
      iteration_critique: '',
      production_readiness: '',
      independent_transfer: '',
    }
  );

  // Evaluator grading state (used only when canEvaluate is true)
  const [evalScores, setEvalScores] = useState<Record<RubricDimensionId, RubricLevelId>>(
    submission.officialEvaluation?.scores || {
      brief_interpretation: 3,
      visual_communication: 3,
      tool_selection: 4,
      non_destructive: 3,
      iteration_critique: 3,
      production_readiness: 3,
      independent_transfer: 3,
    }
  );
  const [evalFeedback, setEvalFeedback] = useState<Record<RubricDimensionId, string>>(
    () => Object.fromEntries(CAPSTONE_RUBRIC_DIMENSIONS.map(dim => [dim.id, ''])) as Record<RubricDimensionId, string>
  );
  const [evalOverall, setEvalOverall] = useState('');

  useEffect(() => {
    let active = true;
    if (!userId) {
      if (!isConfigured) setHistory(getSubmissionHistory());
      return;
    }
    listCloudSubmissions(userId).then(rows => {
      if (!active) return;
      if (rows[0]) {
        setSubmission(rows[0]);
        setArtifacts(previous => Object.values(previous).some(Boolean) ? previous : rows[0].artifacts);
      }
      setHistory(rows.slice(1).map(row => ({ ...row, timestamp: row.createdAt, changelogSummary: `Bản nộp v${row.version}` })));
    }).catch(() => {
      if (active) setToastMessage({ text: 'Không tải được hồ sơ đồ án từ máy chủ.', isError: true });
    });
    if (canEvaluate) listCloudSubmissions().then(rows => {
      if (active) setAssignedWork(rows.filter(row => row.studentId !== userId));
    }).catch(() => {
      if (active) setToastMessage({ text: 'Không tải được danh sách bài cần chấm.', isError: true });
    });
    return () => { active = false; };
  }, [userId, canEvaluate, isConfigured]);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFileSelected = async (
    field: UploadFieldConfig,
    file: File | undefined
  ): Promise<void> => {
    if (!file) return;
    if (isConfigured && !userId) { showToast('Đăng nhập để nộp tệp lên máy chủ.', true); return; }
    const extension = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!field.accept.split(',').includes(extension)) {
      setUploadErrors(prev => ({ ...prev, [field.key]: 'Chọn đúng định dạng của mục này.' }));
      return;
    }

    const validation = validateSubmissionFile(file);
    if (!validation.isValid) {
      setUploadErrors((prev) => ({ ...prev, [field.key]: validation.error || 'Tệp không hợp lệ.' }));
      showToast(validation.error || 'Tệp tải lên không hợp lệ.', true);
      return;
    }

    setUploadingField(field.key);
    setUploadErrors((prev) => ({ ...prev, [field.key]: undefined }));

    const activeUserId = user?.id || profile?.id || 'offline-student';
    const result = await uploadSubmissionArtifact(
      activeUserId,
      DEFAULT_LUMINA_PROJECT.id,
      file,
      field.artifactType
    );

    setUploadingField(null);

    if (result.error) {
      setUploadErrors((prev) => ({ ...prev, [field.key]: result.error }));
      showToast(result.error, true);
      return;
    }

    setArtifacts((prev) => ({
      ...prev,
      [field.key]: result.path,
    }));
    setUploadedMeta((prev) => ({
      ...prev,
      [field.key]: {
        filename: file.name,
        sizeBytes: result.sizeBytes,
        storagePath: result.path,
      },
    }));
  };

  const handleSaveStudentSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || uploadingField) return;
    if (isConfigured && !userId) { showToast('Đăng nhập để nộp hồ sơ lên máy chủ.', true); return; }
    for (const field of UPLOAD_FIELDS) {
      if (!artifacts[field.key]?.trim()) {
        const errText = `Vui lòng tải lên tệp cho mục "${field.label.replace(' *', '')}".`;
        setUploadErrors((prev) => ({ ...prev, [field.key]: errText }));
        showToast(errText, true);
        return;
      }
    }

    const learnerName = profile?.display_name || preferences.displayName;
    const selfReview = {
      scores: selfScores, justifications: selfJustifications, submittedAt: new Date().toISOString(),
    };
    setSaving(true);
    try {
      if (userId) {
        await submitCloudCapstone(artifacts, selfReview);
        const rows = await listCloudSubmissions(userId);
        if (rows[0]) setSubmission(rows[0]);
        setHistory(rows.slice(1).map(row => ({ ...row, timestamp: row.createdAt, changelogSummary: `Bản nộp v${row.version}` })));
        showToast('Đã nộp hồ sơ đồ án lên máy chủ.');
      } else {
        for (const field of UPLOAD_FIELDS) {
          if (!await readOfflineArtifact(learningStorageKey(artifacts[field.key]))) {
            throw new Error('Một số tệp chưa có trên thiết bị. Hãy đính kèm lại.');
          }
        }
        const updated = saveStudentSubmission(artifacts, selfReview, learnerName);
        setSubmission(updated);
        setHistory(getSubmissionHistory());
        showToast(`Đã nộp thành công hồ sơ đồ án phiên bản v${updated.version} trên thiết bị này.`);
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không lưu được hồ sơ đồ án.', true);
    } finally { setSaving(false); }
  };

  async function downloadEvidence(path: string) {
    try {
      if (path.startsWith('local://')) {
        const file = await readOfflineArtifact(learningStorageKey(path));
        if (!file) throw new Error('Tệp chưa có trên thiết bị. Hãy đính kèm lại.');
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else {
        const url = await getSubmissionSignedUrl(path);
        if (!url) throw new Error('Không mở được tệp minh chứng.');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      }
    } catch (error) { showToast(error instanceof Error ? error.message : 'Không mở được tệp.', true); }
  }

  const handleSubmitEvaluation = async () => {
    if (!canEvaluate || !review || review.officialEvaluation || saving) return;
    if (!evalOverall.trim() || Object.values(evalFeedback).some(value => !value.trim())) {
      showToast('Nhập nhận xét cho từng tiêu chí và nhận xét chung trước khi chấm.', true);
      return;
    }
    setSaving(true);
    try {
      await gradeCloudCapstone(review.id, evalScores, evalFeedback, evalOverall);
      setAssignedWork((await listCloudSubmissions()).filter(row => row.studentId !== userId));
      showToast('Đã lưu kết quả thẩm định chính thức.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể lưu kết quả thẩm định.', true);
    } finally { setSaving(false); }
  };

  const studentEstimatedScore = calculateWeightedScore(selfScores);
  const officialEvalPreview = evaluatePassFail(evalScores);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-mono text-xs border animate-in fade-in slide-in-from-top-2 ${
            toastMessage.isError
              ? 'bg-red-950/95 border-red-500/50 text-red-200'
              : 'bg-zinc-900 border-emerald-500/50 text-emerald-300'
          }`}
        >
          <Sparkles
            className={`w-4 h-4 shrink-0 ${toastMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}
          />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="space-y-3 border-b border-[var(--color-border-hairline)] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-purple-950/40 text-purple-300 border border-purple-800/40 font-semibold">
                Đồ án tốt nghiệp cuối khóa
              </span>
              {canEvaluate && (
                <span
                  data-testid="evaluator-role-badge"
                  className="inline-flex items-center gap-1 font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-700/40 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Chế độ Hội đồng Giám khảo
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              {DEFAULT_LUMINA_PROJECT.titleVi}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-3xl">
              Hệ thống đánh giá năng lực thực tế độc lập. Học viên giải quyết bài toán tái định vị toàn diện cho thương hiệu cà phê thủ công Lumina, trọng tâm là <strong className="text-zinc-200">PLO-07 (Phân rã Brief)</strong> và <strong className="text-zinc-200">PLO-08 (Phản biện &amp; Sửa đổi)</strong>.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border-hairline)] overflow-x-auto">
          {[
            { id: 'brief', label: '1. Đề tài & Hướng dẫn', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'rubric', label: '2. Tiêu chí & Rubric', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'submit', label: '3. Nộp bài & Tự đánh giá', icon: <Send className="w-3.5 h-3.5" /> },
            { id: 'results', label: '4. Kết quả & Chứng nhận', icon: <Award className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              data-testid={`capstone-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium font-mono whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PROJECT BRIEF & INSTRUCTIONS */}
      {/* ========================================================= */}
      {activeTab === 'brief' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                Bối cảnh dự án &amp; Hồ sơ thương hiệu
              </span>
              <span className="text-xs font-mono text-zinc-500">
                Mã đề tài: {DEFAULT_LUMINA_PROJECT.id}
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-100">{DEFAULT_LUMINA_PROJECT.titleVi}</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {DEFAULT_LUMINA_PROJECT.scenarioOverview}
            </p>
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Chân dung khách hàng mục tiêu:
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {DEFAULT_LUMINA_PROJECT.targetAudience}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-3">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Ràng buộc kỹ thuật bắt buộc
              </h3>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {DEFAULT_LUMINA_PROJECT.technicalConstraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-500 font-mono font-bold">&bull;</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-3">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Bộ học liệu khởi đầu
              </h3>
              <div className="space-y-2">
                {DEFAULT_LUMINA_PROJECT.starterAssets.map((asset, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-200 block">
                        {asset.filename}
                      </span>
                      <span className="text-[11px] text-zinc-500">{asset.description}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                      {asset.filesize}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Chu trình Tư duy Thiết kế 8 bước cần áp dụng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { step: '1. Khám phá (Discover)', desc: 'Nghiên cứu thị trường cà phê thủ công & lập bảng cảm hứng' },
                { step: '2. Xác định (Define · PLO-07)', desc: 'Phân rã brief: Khách hàng, Mục tiêu, Thông điệp, Ràng buộc, Đo lường' },
                { step: '3. Khai phá (Explore)', desc: 'Phác thảo tối thiểu 2 hướng tiếp cận bố cục độc lập' },
                { step: '4. Lập kế hoạch (Plan)', desc: 'Thiết lập hệ lưới, bảng màu và quy tắc co giãn Constraints' },
                { step: '5. Tạo tác (Create)', desc: 'Thực thi trên Vector Studio & Pixel Studio hoàn toàn phi phá hủy' },
                { step: '6. Đánh giá (Evaluate)', desc: 'Tự đối soát viền cắt, màu in CMYK và tỷ lệ co giãn' },
                { step: '7. Sửa đổi (Iterate · PLO-08)', desc: 'Lập nhật ký phản biện so sánh Bản nháp 1 với Bản hoàn thiện' },
                { step: '8. Bàn giao (Deliver · PLO-09)', desc: 'Xuất bản in PDF/X-4 và tệp kỹ thuật số WebP đúng chuẩn' },
              ].map((s, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-xs font-mono font-bold text-zinc-200 block">{s.step}</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SCORING RUBRIC MATRIX */}
      {/* ========================================================= */}
      {activeTab === 'rubric' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Ngưỡng điểm đạt chuẩn tốt nghiệp
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Để đạt chứng nhận tốt nghiệp: Điểm tổng kết có trọng số phải đạt <strong className="text-emerald-300">&ge; 75/100</strong> và <strong className="text-emerald-300">tất cả 5 tiêu chí trọng yếu</strong> bắt buộc đạt tối thiểu <strong className="text-emerald-300">Mức 3 (Độc lập)</strong>.
              </p>
            </div>
            <div className="shrink-0 font-mono text-center px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Điểm chuẩn đạt</span>
              <span className="text-lg font-bold text-emerald-400">&ge; 75.0</span>
            </div>
          </div>

          <div className="space-y-4">
            {CAPSTONE_RUBRIC_DIMENSIONS.map((dim) => (
              <div
                key={dim.id}
                className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-zinc-100">{dim.titleVi}</span>
                    {dim.isCritical && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40 font-bold uppercase">
                        Tiêu chí trọng yếu (Bắt buộc &ge; Mức 3)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-zinc-500">Chuẩn: {dim.mappedPlo}</span>
                    <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                      Trọng số: {dim.weightPercentage}%
                    </span>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 italic">
                  <strong>Bằng chứng yêu cầu:</strong> {dim.requiredEvidence}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                  {[1, 2, 3, 4].map((lvl) => {
                    const levelData = dim.levels[lvl as RubricLevelId];
                    const isPassing = lvl >= 3;
                    return (
                      <div
                        key={lvl}
                        className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                          isPassing
                            ? 'bg-zinc-900/60 border-zinc-800'
                            : 'bg-zinc-950/40 border-zinc-900 text-zinc-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono font-bold ${
                              isPassing ? 'text-zinc-200' : 'text-zinc-500'
                            }`}
                          >
                            {levelData.label}
                          </span>
                          {lvl === 3 && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                              Chuẩn đạt
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-relaxed">
                          {levelData.description}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          {levelData.behavioralIndicator}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FILE UPLOAD SUBMISSION & SELF-ASSESSMENT */}
      {/* ========================================================= */}
      {activeTab === 'submit' && (
        <form onSubmit={event => { void handleSaveStudentSubmission(event); }} className="space-y-8 animate-in fade-in duration-200">
          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                1. Hồ sơ &amp; Tệp bài làm nộp chấm
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                {submission.version > 0
                  ? `Phiên bản đã nộp: v${submission.version}`
                  : 'Chưa có bản nộp'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UPLOAD_FIELDS.map((field) => {
                const meta = uploadedMeta[field.key];
                const savedPath = artifacts[field.key];
                const fieldErr = uploadErrors[field.key];
                const isUploading = uploadingField === field.key;

                return (
                  <div
                    key={field.key}
                    className={`p-4 rounded-lg border space-y-2 transition-colors ${
                      fieldErr
                        ? 'border-red-500/50 bg-red-950/10'
                        : savedPath
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-zinc-800 bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <label
                        htmlFor={field.testId}
                        className="text-xs font-mono text-zinc-200 font-medium block"
                      >
                        {field.label}
                      </label>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 shrink-0">
                        {field.ploTag}
                      </span>
                    </div>

                    <input
                      id={field.testId}
                      data-testid={field.testId}
                      type="file"
                      accept={field.accept}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        void handleFileSelected(field, file);
                      }}
                      className="block w-full text-xs text-zinc-400 font-mono file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-zinc-700 file:text-xs file:font-mono file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                    />

                    <p className="text-[10px] text-zinc-500 font-mono">{field.formatHint}</p>

                    {isUploading && (
                      <p className="text-[11px] font-mono text-cyan-400">Đang kiểm tra và tải tệp...</p>
                    )}

                    {meta && !fieldErr && (
                      <div
                        data-testid={`${field.testId}-status`}
                        className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          Đã kiểm tra: {meta.filename} ({formatBytes(meta.sizeBytes)})
                        </span>
                      </div>
                    )}

                    {!meta && savedPath && !fieldErr && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <button type="button" className="truncate underline" onClick={() => { void downloadEvidence(savedPath); }}>Tệp đã lưu: {savedPath.split('/').pop()}</button>
                      </div>
                    )}

                    {fieldErr && (
                      <div
                        data-testid={`${field.testId}-error`}
                        className="flex items-start gap-1.5 text-[11px] font-mono text-red-400"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{fieldErr}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono text-zinc-300 block">
                Ghi chú giải trình cho Hội đồng Giám khảo (Tùy chọn)
              </label>
              <textarea
                value={artifacts.additionalNotes || ''}
                onChange={(e) => setArtifacts({ ...artifacts, additionalNotes: e.target.value })}
                rows={2}
                placeholder="Ghi chú ngắn gọn về các quyết định kỹ thuật hoặc điểm cải tiến nổi bật..."
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  2. Tự đối chiếu năng lực trước khi nộp
                </h3>
                <p className="text-xs text-zinc-400">
                  Học viên tự đối chiếu mức độ đạt được theo từng tiêu chí kèm lý giải ngắn gọn.
                </p>
              </div>
              <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-xs">
                <span className="text-zinc-500">Điểm tự đối chiếu tham khảo: </span>
                <span className="font-bold text-emerald-400">{studentEstimatedScore} / 100</span>
              </div>
            </div>

            <div className="space-y-5">
              {CAPSTONE_RUBRIC_DIMENSIONS.map((dim) => {
                const currentScore = selfScores[dim.id] || 3;
                return (
                  <div key={dim.id} className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-200">{dim.titleVi}</span>
                        {dim.isCritical && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 font-bold">
                            BẮT BUỘC &ge; 3
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4].map((lvl) => (
                          <button
                            type="button"
                            key={lvl}
                            onClick={() => setSelfScores({ ...selfScores, [dim.id]: lvl as RubricLevelId })}
                            className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                              currentScore === lvl
                                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            Mức {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 italic">
                      Mô tả: {dim.levels[currentScore].description}
                    </p>

                    <input
                      type="text"
                      value={selfJustifications[dim.id] || ''}
                      onChange={(e) =>
                        setSelfJustifications({ ...selfJustifications, [dim.id]: e.target.value })
                      }
                      placeholder="Lý giải ngắn gọn minh chứng trong bài làm của bạn..."
                      className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500 font-mono">
                Hồ sơ sẽ được chuyển đến Hội đồng Giám khảo độc lập để chấm điểm chính thức.
              </span>
              <button
                type="submit"
                data-testid="submit-capstone-btn"
                disabled={saving || Boolean(uploadingField)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono shadow-subtle transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Nộp Bài &amp; Cập Nhật Bản Nộp</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 4: OFFICIAL RESULTS & RBAC-PROTECTED EVALUATOR CONSOLE */}
      {/* ========================================================= */}
      {activeTab === 'results' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {canEvaluate && (
            <div
              data-testid="evaluator-console"
              className="p-6 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                  <span className="font-mono text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Bảng thẩm định chính thức của Hội đồng Giám khảo
                  </span>
                </div>
                <div
                  data-testid="evaluator-preview-verdict"
                  className="font-mono text-xs text-purple-300"
                >
                  Kết quả dự kiến: {officialEvalPreview.passed ? 'ĐẠT' : 'KHÔNG ĐẠT'} ({officialEvalPreview.score} điểm)
                </div>
              </div>

              <label className="block">
                Chọn hồ sơ thẩm định
                <select className="block w-full bg-surface border border-hairline rounded p-2" value={reviewId}
                  onChange={event => {
                    setReviewId(event.target.value);
                    setEvalScores(Object.fromEntries(CAPSTONE_RUBRIC_DIMENSIONS.map(dim => [dim.id, 3])) as Record<RubricDimensionId, RubricLevelId>);
                    setEvalFeedback(Object.fromEntries(CAPSTONE_RUBRIC_DIMENSIONS.map(dim => [dim.id, ''])) as Record<RubricDimensionId, string>);
                    setEvalOverall('');
                  }}>
                  <option value="">Chọn bản nộp</option>
                  {assignedWork.map(row => <option key={row.id} value={row.id}>Hồ sơ {row.id.slice(0, 8)} · v{row.version} · {new Date(row.createdAt).toLocaleDateString('vi-VN')}</option>)}
                </select>
              </label>
              {review && <div className="flex flex-wrap gap-2">
                {UPLOAD_FIELDS.map(field => <button type="button" key={field.key} className="underline"
                  onClick={() => { void downloadEvidence(review.artifacts[field.key]); }}>{field.label}</button>)}
                {review.officialEvaluation && <p>Đã thẩm định: {review.officialEvaluation.weightedScore} điểm</p>}
              </div>}
              <div className="space-y-4">
                {CAPSTONE_RUBRIC_DIMENSIONS.map((dim) => {
                  const currentScore = evalScores[dim.id] || 3;
                  return (
                    <div
                      key={dim.id}
                      data-testid={`eval-dim-${dim.id}`}
                      className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-200">{dim.titleVi}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4].map((lvl) => (
                            <button
                              type="button"
                              key={lvl}
                              data-testid={`eval-${dim.id}-lvl-${lvl}`}
                              onClick={() => setEvalScores({ ...evalScores, [dim.id]: lvl as RubricLevelId })}
                              className={`px-2.5 py-1 rounded text-xs font-mono ${
                                currentScore === lvl
                                  ? 'bg-purple-600 text-white font-bold'
                                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              Mức {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={evalFeedback[dim.id] || ''}
                        onChange={(e) => setEvalFeedback({ ...evalFeedback, [dim.id]: e.target.value })}
                        placeholder="Nhận xét chuyên môn của giám khảo..."
                        className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-purple-300 block">
                  Nhận xét tổng quan chính thức của Hội đồng:
                </label>
                <textarea
                  value={evalOverall}
                  onChange={(e) => setEvalOverall(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  data-testid="evaluator-signoff-btn"
                  onClick={() => { void handleSubmitEvaluation(); }}
                  disabled={!review || Boolean(review.officialEvaluation) || saving}
                  className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-lg transition-all"
                >
                  Ký Duyệt Kết Quả Chính Thức &amp; Cấp Chứng Nhận
                </button>
              </div>
            </div>
          )}

          {submission.officialEvaluation ? (
            <div className="space-y-6">
              <div
                className={`p-6 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  submission.officialEvaluation.passed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/20 border-red-500/40 text-red-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {submission.officialEvaluation.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-xs font-mono uppercase font-bold tracking-wider">
                      Kết quả thẩm định chính thức đồ án tốt nghiệp
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-zinc-100">
                    {submission.officialEvaluation.passed
                      ? 'ĐẠT CHUẨN TỐT NGHIỆP — XÁC NHẬN NĂNG LỰC ĐỘC LẬP'
                      : 'KHÔNG ĐẠT — YÊU CẦU ĐIỀU CHỈNH & NỘP LẠI'}
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                    {submission.officialEvaluation.overallFeedback}
                  </p>
                </div>

                <div className="text-center font-mono px-5 py-3 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                  <span className="text-[10px] text-zinc-500 uppercase block">Điểm chính thức</span>
                  <span
                    className={`text-3xl font-extrabold ${
                      submission.officialEvaluation.passed ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {submission.officialEvaluation.weightedScore}
                  </span>
                  <span className="text-xs text-zinc-500 block">/ 100</span>
                </div>
              </div>

              {submission.officialEvaluation.criticalViolations.length > 0 && (
                <div className="p-5 rounded-xl border border-red-500/40 bg-red-950/20 space-y-2 text-xs">
                  <span className="font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Các tiêu chí trọng yếu chưa đạt yêu cầu:
                  </span>
                  <ul className="space-y-1 text-red-300 font-mono">
                    {submission.officialEvaluation.criticalViolations.map((v, i) => (
                      <li key={i}>&bull; {v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {submission.officialEvaluation.passed && (
                <div className="p-8 rounded-xl border border-amber-500/30 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-amber-950/20 relative overflow-hidden space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
                          CHỨNG NHẬN TỐT NGHIỆP AFFINITY ACADEMY
                        </span>
                        <h4 className="text-lg font-bold text-zinc-100">
                          Chứng Nhận Năng Lực Thiết Kế Độc Lập
                        </h4>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                      Mã xác thực: {submission.officialEvaluation.certificateId}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                    Chứng nhận học viên <strong className="text-zinc-100">{submission.studentName}</strong> đã hoàn thành đồ án tốt nghiệp <strong className="text-zinc-100">{DEFAULT_LUMINA_PROJECT.titleVi}</strong>, chứng minh năng lực tư duy thiết kế độc lập, làm chủ quy trình Vector &amp; Pixel Studio và đáp ứng trọn vẹn hai chuẩn đầu ra PLO-07 và PLO-08.
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
                    <span>Đánh giá bởi: {submission.officialEvaluation.evaluatorName}</span>
                    <span>
                      Ngày cấp:{' '}
                      {new Date(submission.officialEvaluation.evaluatedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  Đối soát điểm tự chấm và điểm Hội đồng Giám khảo
                </h4>
                <div className="space-y-3">
                  {CAPSTONE_RUBRIC_DIMENSIONS.map((dim) => {
                    const selfLvl = submission.selfAssessment?.scores[dim.id] || 0;
                    const evalLvl = submission.officialEvaluation?.scores[dim.id] || 0;
                    return (
                      <div
                        key={dim.id}
                        className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-zinc-200 block">{dim.titleVi}</span>
                          <span className="text-[11px] text-zinc-400">
                            Nhận xét:{' '}
                            {submission.officialEvaluation?.dimensionFeedback[dim.id] || 'Chưa có nhận xét'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 font-mono">
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-500 block">Tự đối chiếu</span>
                            <span className="text-zinc-300 font-bold">Mức {selfLvl}/4</span>
                          </div>
                          <div className="text-right pl-3 border-l border-zinc-800">
                            <span className="text-[10px] text-zinc-500 block">Giám khảo</span>
                            <span
                              className={`font-bold ${
                                evalLvl >= 3 ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              Mức {evalLvl}/4
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-zinc-800 text-center space-y-3">
              <Info className="w-8 h-8 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-300">
                Hồ sơ đồ án đang chờ Hội đồng Giám khảo độc lập thẩm định
              </h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                {submission.version > 0
                  ? `Hồ sơ phiên bản v${submission.version} đã được ghi nhận. Hội đồng Giám khảo sẽ đối soát tệp nguồn .afdesign, .afphoto và nhật ký phản biện trước khi công bố kết quả chính thức.`
                  : 'Vui lòng tải lên đầy đủ 6 tệp bằng chứng ở mục "3. Nộp bài & Tự đánh giá" để gửi hồ sơ đến Hội đồng Giám khảo.'}
              </p>
            </div>
          )}

          {history.length > 0 && (
            <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-500" />
                Lịch sử các lần nộp &amp; hiệu chỉnh ({history.length} phiên bản)
              </h4>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-zinc-300">Phiên bản v{h.version}</span>
                      <span className="text-zinc-500 pl-3">
                        {new Date(h.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <span className="text-zinc-400">{h.changelogSummary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CapstoneAssessmentPage;
