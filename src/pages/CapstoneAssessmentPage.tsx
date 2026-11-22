import React, { useState, useEffect } from 'react';
import {
  DEFAULT_LUMINA_PROJECT,
  CAPSTONE_RUBRIC_DIMENSIONS,
  calculateWeightedScore,
  evaluatePassFail,
  loadCurrentSubmission,
  saveStudentSubmission,
  savePracticeEvaluation,
  getSubmissionHistory,
} from '@/lib/capstone-service';
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
  Info,
} from 'lucide-react';

export const CapstoneAssessmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'brief' | 'rubric' | 'submit' | 'results'>('brief');
  const [submission, setSubmission] = useState<CapstoneSubmissionRecord>(loadCurrentSubmission);
  const [history, setHistory] = useState<SubmissionHistoryEntry[]>([]);
  const [isEvaluatorMode, setIsEvaluatorMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for student submission
  const [artifacts, setArtifacts] = useState<SubmissionArtifacts>(submission.artifacts);
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

  // Form states for official evaluation (Evaluator mode)
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
    submission.officialEvaluation?.dimensionFeedback || {
      brief_interpretation: 'Phân tích brief mạch lạc, hiểu đúng đối tượng khách hàng specialty.',
      visual_communication: 'Phân cấp thị giác rõ nét, typography kết hợp hài hòa.',
      tool_selection: 'Sử dụng Corner Tool và Live Lighting Filter rất chính xác.',
      non_destructive: 'Cấu trúc layer phi phá hủy tốt, quản lý mặt nạ chặt chẽ.',
      iteration_critique: 'Nhật ký lặp lại Draft 1 vs Draft 2 minh chứng rõ ràng sự tiến bộ.',
      production_readiness: 'File PDF/X-4 chuẩn 300 DPI có 3mm bleed đầy đủ.',
      independent_transfer: 'Tư duy thiết kế độc lập, lập luận sắc sảo.',
    }
  );
  const [evalOverall, setEvalOverall] = useState<string>(
    submission.officialEvaluation?.overallFeedback ||
      'Bài làm thể hiện năng lực thiết kế độc lập xuất sắc, đáp ứng đầy đủ chuẩn đầu ra tốt nghiệp A5.'
  );

  useEffect(() => {
    setHistory(getSubmissionHistory());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveStudentSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!artifacts.briefDeconstructionUrl.trim()) {
      showToast('Lỗi: Bắt buộc phải cung cấp liên kết tài liệu Phân rã Brief (PLO-07)!');
      return;
    }
    if (!artifacts.iterationLogUrl.trim()) {
      showToast('Lỗi: Bắt buộc phải cung cấp liên kết Nhật ký Phản biện & Sửa đổi (PLO-08)!');
      return;
    }
    if (!artifacts.vectorSourcePath.trim() || !artifacts.pixelSourcePath.trim()) {
      showToast('Lỗi: Bắt buộc phải cung cấp đường dẫn cả 2 file nguồn .afdesign và .afphoto!');
      return;
    }

    try {
      const updated = saveStudentSubmission(artifacts, {
        scores: selfScores,
        justifications: selfJustifications,
        submittedAt: new Date().toISOString(),
      });

      setSubmission(updated);
      setHistory(getSubmissionHistory());
      showToast(`Đã lưu bản nộp trên trình duyệt, phiên bản v${updated.version}!`);
    } catch {
      showToast('Không thể lưu vào bộ nhớ trình duyệt.');
    }
  };

  const handleSubmitEvaluation = () => {
    try {
      const updated = savePracticeEvaluation(
        'LOCAL-PRACTICE',
        'Chấm thử trên trình duyệt',
        evalScores,
        evalFeedback,
        evalOverall
      );
      setSubmission(updated);
      showToast('Đã lưu kết quả chấm thử trên trình duyệt.');
    } catch {
      showToast('Không thể lưu vào bộ nhớ trình duyệt.');
    }
  };

  const studentEstimatedScore = calculateWeightedScore(selfScores);
  const officialEvalPreview = evaluatePassFail(evalScores);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-zinc-900 border border-emerald-500/50 text-emerald-300 px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-mono text-xs animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="space-y-3 border-b border-[var(--color-border-hairline)] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-purple-950/40 text-purple-400 border border-purple-800/40 font-semibold tracking-wider uppercase">
                A5 GRADUATION CAPSTONE ASSESSMENT
              </span>
              <span className="font-mono text-xs text-zinc-500">
                TASK-081 &bull; REQ-LEARN-003
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              {DEFAULT_LUMINA_PROJECT.titleVi}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-3xl">
              Hệ thống đánh giá năng lực thực tế độc lập cấp độ A5. Học viên giải quyết bài toán tái định vị toàn diện cho thương hiệu cà phê thủ công Lumina, ưu tiên hai chuẩn đầu ra <strong className="text-zinc-200">PLO-07 (Brief Interpretation)</strong> và <strong className="text-zinc-200">PLO-08 (Iteration & Critique)</strong>.
            </p>
          </div>

          {/* Evaluator Mode Toggle Pill */}
          <div className="flex items-center gap-2 bg-[var(--color-canvas)] p-1.5 rounded-lg border border-[var(--color-border-hairline)]">
            <span className="text-xs font-mono text-zinc-400 pl-2">Chế độ xem:</span>
            <button
              onClick={() => setIsEvaluatorMode(false)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                !isEvaluatorMode
                  ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Học viên (Nộp bài)
            </button>
            <button
              onClick={() => setIsEvaluatorMode(true)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                isEvaluatorMode
                  ? 'bg-purple-900/60 text-purple-300 font-bold border border-purple-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Giám khảo (Chấm thử)
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border-hairline)] overflow-x-auto">
          {[
            { id: 'brief', label: '1. Đề tài & Hướng dẫn', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'rubric', label: '2. Tiêu chí & Rubric', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'submit', label: '3. Nộp bài & Tự đánh giá', icon: <Send className="w-3.5 h-3.5" /> },
            { id: 'results', label: '4. Kết quả chấm thử', icon: <Award className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
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
          {/* Brief Overview Box */}
          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                Project Background &amp; Client Overview
              </span>
              <span className="text-xs font-mono text-zinc-500">Mã dự án: {DEFAULT_LUMINA_PROJECT.id}</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-100">{DEFAULT_LUMINA_PROJECT.title}</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {DEFAULT_LUMINA_PROJECT.scenarioOverview}
            </p>
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Khán giả mục tiêu (Target Audience):
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {DEFAULT_LUMINA_PROJECT.targetAudience}
              </p>
            </div>
          </div>

          {/* Technical Constraints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-3">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Ràng buộc Kỹ thuật Bắt buộc
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
                <FileText className="w-4 h-4 text-cyan-400" />
                Danh mục tài nguyên mẫu
              </h3>
              <p className="text-xs text-zinc-400">Các tệp dưới đây có trong đặc tả nhưng chưa có bản tải xuống trong ứng dụng.</p>
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

          {/* 8-Step Design Thinking Methodology */}
          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Chu trình Design Thinking 8 Bước Cần Áp Dụng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { step: '1. Discover', desc: 'Nghiên cứu thị trường specialty coffee & lập Moodboard' },
                { step: '2. Define (PLO-07)', desc: 'Phân rã brief: Audience, Message, Constraints, Metrics' },
                { step: '3. Explore', desc: 'Phác thảo tối thiểu 2 hướng tiếp cận bố cục độc lập' },
                { step: '4. Plan', desc: 'Thiết lập grid, palette màu và quy tắc Constraints' },
                { step: '5. Create', desc: 'Thực thi trên Vector Studio & Pixel Studio 100% phi phá hủy' },
                { step: '6. Evaluate', desc: 'Tự đối soát viền, màu in CMYK và tỷ lệ co giãn' },
                { step: '7. Iterate (PLO-08)', desc: 'Lập nhật ký sửa đổi so sánh Draft 1 vs Final Work' },
                { step: '8. Deliver (PLO-09)', desc: 'Xuất bản in PDF/X-4 và file digital WebP đúng chuẩn' },
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
          {/* Graduation Threshold Banner */}
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                TIÊU CHUẨN TỐT NGHIỆP A5 (GRADUATION THRESHOLD)
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Để đạt chứng chỉ tốt nghiệp: Điểm tổng kết có trọng số phải đạt <strong className="text-emerald-300">&ge; 75/100</strong> và <strong className="text-emerald-300">TẤT CẢ 5 Tiêu chí Trọng yếu (Critical Dimensions)</strong> bắt buộc phải đạt tối thiểu <strong className="text-emerald-300">Mức 3 (Level 3 - Độc lập)</strong>.
              </p>
            </div>
            <div className="shrink-0 font-mono text-center px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block">Điểm chuẩn qua môn</span>
              <span className="text-lg font-bold text-emerald-400">&ge; 75.0</span>
            </div>
          </div>

          {/* Rubric Dimensions Accordion / List */}
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
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 font-bold uppercase">
                        CRITICAL (BẮT BUỘC &ge; MỨC 3)
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

                {/* 4 Levels Grid */}
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
                              Chuẩn Đạt
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
      {/* TAB 3: SUBMISSION & SELF-ASSESSMENT */}
      {/* ========================================================= */}
      {activeTab === 'submit' && (
        <form onSubmit={handleSaveStudentSubmission} className="space-y-8 animate-in fade-in duration-200">
          {/* Artifact URLs Section */}
          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                1. Khai báo Bằng chứng Nộp bài (Submission Artifacts)
              </h3>
              <span className="text-xs font-mono text-zinc-500">Phiên bản hiện tại: v{submission.version}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300 block">
                  Văn bản Phân rã Brief (brief-deconstruction.md) * <span className="text-emerald-400">[PLO-07]</span>
                </label>
                <input
                  type="text"
                  value={artifacts.briefDeconstructionUrl}
                  onChange={(e) => setArtifacts({ ...artifacts, briefDeconstructionUrl: e.target.value })}
                  placeholder="project-control/artifacts/brief-deconstruction.md"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300 block">
                  Nhật ký Sửa đổi & Phản biện (iteration-critique-log.md) * <span className="text-emerald-400">[PLO-08]</span>
                </label>
                <input
                  type="text"
                  value={artifacts.iterationLogUrl}
                  onChange={(e) => setArtifacts({ ...artifacts, iterationLogUrl: e.target.value })}
                  placeholder="project-control/artifacts/iteration-critique-log.md"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300 block">
                  File Nguồn Vector (.afdesign) * <span className="text-cyan-400">[Symbols & Constraints]</span>
                </label>
                <input
                  type="text"
                  value={artifacts.vectorSourcePath}
                  onChange={(e) => setArtifacts({ ...artifacts, vectorSourcePath: e.target.value })}
                  placeholder="assets/lumina-brand-system.afdesign"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300 block">
                  File Nguồn Pixel (.afphoto) * <span className="text-cyan-400">[Live Lighting 3D]</span>
                </label>
                <input
                  type="text"
                  value={artifacts.pixelSourcePath}
                  onChange={(e) => setArtifacts({ ...artifacts, pixelSourcePath: e.target.value })}
                  placeholder="assets/lumina-coldbrew-kv.afphoto"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300 block">
                  Bản Xuất In Ấn (PDF/X-4 CMYK 300 DPI, 3mm Bleed) *
                </label>
                <input
                  type="text"
                  value={artifacts.printPdfPath}
                  onChange={(e) => setArtifacts({ ...artifacts, printPdfPath: e.target.value })}
                  placeholder="exports/label-packaging-print.pdf"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300 block">
                  Poster Kỹ Thuật Số (WebP/PNG sRGB 2x) *
                </label>
                <input
                  type="text"
                  value={artifacts.digitalWebpPath}
                  onChange={(e) => setArtifacts({ ...artifacts, digitalWebpPath: e.target.value })}
                  placeholder="exports/lumina-ad-banner-2x.webp"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono text-zinc-300 block">
                Ghi chú thêm cho Giám khảo (Tùy chọn)
              </label>
              <textarea
                value={artifacts.additionalNotes || ''}
                onChange={(e) => setArtifacts({ ...artifacts, additionalNotes: e.target.value })}
                rows={2}
                placeholder="Nhập ghi chú về các điểm nhấn kỹ thuật đặc biệt..."
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {/* Self-Assessment Scoring Sliders */}
          <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  2. Tự Đánh Giá Năng Lực (Student Self-Assessment)
                </h3>
                <p className="text-xs text-zinc-400">
                  Học viên tự đánh giá trung thực mức độ đạt được cho từng chiều kích kèm lý giải ngắn gọn.
                </p>
              </div>
              <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-xs">
                <span className="text-zinc-500">Ước lượng tự chấm: </span>
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
                      placeholder="Lý giải ngắn gọn tại sao bạn tự chấm mức này..."
                      className="w-full px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500 font-mono">
                Bản nộp chỉ lưu trên trình duyệt này, không gửi tới giám khảo.
              </span>
              <button
                type="submit"
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
      {/* TAB 4: OFFICIAL RESULTS & EVALUATOR CONSOLE */}
      {/* ========================================================= */}
      {activeTab === 'results' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <p className="text-sm text-amber-300">Đây là chấm thử trên trình duyệt. Chưa cấp chứng chỉ chính thức (TASK-080).</p>
          {/* EVALUATOR MODE CONSOLE (When toggled on) */}
          {isEvaluatorMode && (
            <div className="p-6 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-900/50 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                  <span className="font-mono text-xs font-bold text-purple-300 uppercase tracking-wider">
                    BẢNG ĐIỀU KHIỂN CHẤM THỬ
                  </span>
                </div>
                <div className="font-mono text-xs text-purple-400">
                  Trạng thái dự kiến: {officialEvalPreview.passed ? 'ĐẠT (PASS)' : 'KHÔNG ĐẠT (FAIL)'}
                </div>
              </div>

              {/* Evaluator Sliders */}
              <div className="space-y-4">
                {CAPSTONE_RUBRIC_DIMENSIONS.map((dim) => {
                  const currentScore = evalScores[dim.id] || 3;
                  return (
                    <div key={dim.id} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-200">{dim.titleVi}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4].map((lvl) => (
                            <button
                              key={lvl}
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
                  onClick={handleSubmitEvaluation}
                  className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs shadow-lg transition-all"
                >
                  Lưu kết quả chấm thử
                </button>
              </div>
            </div>
          )}

          {/* OFFICIAL RESULT DISPLAY */}
          {submission.officialEvaluation ? (
            <div className="space-y-6">
              {/* Verdict Banner */}
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
                      KẾT QUẢ CHẤM THỬ CẤP ĐỘ A5
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-zinc-100">
                    {submission.officialEvaluation.passed
                      ? 'ĐẠT NGƯỠNG TRONG LẦN CHẤM THỬ'
                      : 'YÊU CẦU ĐIỀU CHỈNH & SỬA ĐỔI (NEEDS REVISION)'}
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                    {submission.officialEvaluation.overallFeedback}
                  </p>
                </div>

                <div className="text-center font-mono px-5 py-3 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                  <span className="text-[10px] text-zinc-500 uppercase block">Điểm chấm thử</span>
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

              {/* Critical Violations Alert (If any) */}
              {submission.officialEvaluation.criticalViolations.length > 0 && (
                <div className="p-5 rounded-xl border border-red-500/40 bg-red-950/20 space-y-2 text-xs">
                  <span className="font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Các vi phạm chí mạng (Critical Dimension Violations):
                  </span>
                  <ul className="space-y-1 text-red-300 font-mono">
                    {submission.officialEvaluation.criticalViolations.map((v, i) => (
                      <li key={i}>&bull; {v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Comparison Matrix: Self vs Evaluator */}
              <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                  So sánh điểm tự đánh giá và điểm chấm thử
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
                            Nhận xét: {submission.officialEvaluation?.dimensionFeedback[dim.id] || 'Chưa có nhận xét'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 font-mono">
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-500 block">Tự chấm</span>
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
              <h4 className="text-sm font-bold text-zinc-300">Chưa có kết quả chấm thử</h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Bật chế độ chấm thử để luyện áp dụng rubric. Kết quả chỉ lưu cục bộ và không dùng để cấp chứng chỉ.
              </p>
            </div>
          )}

          {/* Submission History Accordion */}
          {history.length > 0 && (
            <div className="p-6 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-canvas)] space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-500" />
                Lịch sử Các Lần Nộp &amp; Hiệu Chỉnh ({history.length} phiên bản)
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
