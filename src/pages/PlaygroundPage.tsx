import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  Layers,
  Code2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  PLAYGROUND_PRESETS,
  SDK_CLASS_DOCS_VI,
  SandboxExecutionResult,
  runAffinityDomSandbox,
  renderSandboxSceneToCanvas,
} from '@/lib/scripting-sandbox';

export interface PlaygroundPageProps {
  initialSymbolId?: string | null;
  onNavigateToEncyclopedia?: () => void;
}

const CANVAS_W = 800;
const CANVAS_H = 520;

export const PlaygroundPage: React.FC<PlaygroundPageProps> = ({
  initialSymbolId,
  onNavigateToEncyclopedia,
}) => {
  const resolveInitialState = (symbol?: string | null) => {
    if (symbol && SDK_CLASS_DOCS_VI[symbol]) {
      return {
        presetId: `sdk-${symbol}`,
        code: SDK_CLASS_DOCS_VI[symbol].sampleCode,
        title: `Ví dụ SDK: ${symbol}`,
      };
    }
    return {
      presetId: PLAYGROUND_PRESETS[0].id,
      code: PLAYGROUND_PRESETS[0].code,
      title: PLAYGROUND_PRESETS[0].title,
    };
  };

  const initial = resolveInitialState(initialSymbolId);
  const [activePresetId, setActivePresetId] = useState<string>(initial.presetId);
  const [activeTitle, setActiveTitle] = useState<string>(initial.title);
  const [code, setCode] = useState<string>(initial.code);
  const [execResult, setExecResult] = useState<SandboxExecutionResult>(() =>
    runAffinityDomSandbox(initial.code)
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const executeAndRender = useCallback((sourceCode: string) => {
    const res = runAffinityDomSandbox(sourceCode);
    setExecResult(res);
    return res;
  }, []);

  // Re-initialize cleanly if opened with a new symbol from EncyclopediaPage
  useEffect(() => {
    if (initialSymbolId && SDK_CLASS_DOCS_VI[initialSymbolId]) {
      const nextCode = SDK_CLASS_DOCS_VI[initialSymbolId].sampleCode;
      setActivePresetId(`sdk-${initialSymbolId}`);
      setActiveTitle(`Ví dụ SDK: ${initialSymbolId}`);
      setCode(nextCode);
      executeAndRender(nextCode);
    }
  }, [initialSymbolId, executeAndRender]);

  // Paint live spread onto Canvas whenever execution updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderSandboxSceneToCanvas(ctx, execResult, CANVAS_W, CANVAS_H);
  }, [execResult]);

  const handleSelectPreset = (presetId: string) => {
    const preset = PLAYGROUND_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setActiveTitle(preset.title);
    setCode(preset.code);
    executeAndRender(preset.code);
  };

  const handleResetCode = () => {
    const symbolKey = activePresetId.startsWith('sdk-') ? activePresetId.slice(4) : null;
    if (symbolKey && SDK_CLASS_DOCS_VI[symbolKey]) {
      const sample = SDK_CLASS_DOCS_VI[symbolKey].sampleCode;
      setCode(sample);
      executeAndRender(sample);
      return;
    }
    const preset =
      PLAYGROUND_PRESETS.find((p) => p.id === activePresetId) ?? PLAYGROUND_PRESETS[0];
    setCode(preset.code);
    executeAndRender(preset.code);
  };

  const handleDownloadJs = () => {
    const blob = new Blob([code], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePresetId}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phòng Thí Nghiệm Lập Trình Scripting & MCP"
        description="Chạy các ví dụ JavaScript DOM có sẵn và xem kết quả mô phỏng trên Canvas. Có thể tải tệp .js để thực hành trong Affinity."
        badge="Thực hành tự động hóa · JavaScript DOM IDE"
      />

      {/* Top Preset Selector & Action Bar */}
      <div className="p-4 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Kịch bản tự động hóa mẫu (4 mẫu thực chiến)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToEncyclopedia && (
              <button
                type="button"
                onClick={onNavigateToEncyclopedia}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tra cứu Bách khoa API</span>
              </button>
            )}
            <button
              type="button"
              data-testid="playground-reset-btn"
              onClick={handleResetCode}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại mã gốc</span>
            </button>
            <button
              type="button"
              data-testid="playground-download-btn"
              onClick={handleDownloadJs}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải tệp .js</span>
            </button>
            <button
              type="button"
              data-testid="playground-run-btn"
              onClick={() => executeAndRender(code)}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Chạy Kịch Bản</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PLAYGROUND_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                type="button"
                key={preset.id}
                data-testid={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-zinc-100'
                    : 'bg-[var(--color-canvas)] border-[var(--color-border-hairline)] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="text-xs font-semibold">{preset.title}</div>
                <div className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{preset.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split IDE: Left Code + Console | Right Live Canvas + Scene Tree */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Pane (6 cols): Code Editor + V8 Sandbox Console */}
        <div className="xl:col-span-6 space-y-4">
          <div className="rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--color-border-hairline)] flex items-center justify-between bg-zinc-900/70">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-200">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>{activeTitle}</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">{lineCount} dòng · Affinity DOM API</span>
            </div>

            <div className="flex bg-[#09090d]">
              <div
                aria-hidden="true"
                className="py-3 px-2.5 text-right font-mono text-[11px] leading-6 text-zinc-600 select-none border-r border-zinc-800/80 min-w-[2.5rem]"
              >
                {Array.from({ length: Math.min(80, Math.max(12, lineCount)) }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                data-testid="playground-editor"
                aria-label="Mã ví dụ Affinity JavaScript DOM"
                value={code}
                readOnly
                spellCheck={false}
                rows={18}
                className="w-full bg-transparent text-zinc-100 font-mono text-xs leading-6 p-3 outline-none resize-y"
              />
            </div>
          </div>

          {/* V8 Console Output */}
          <div
            data-testid="playground-console"
            className="rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] overflow-hidden"
          >
            <div className="px-4 py-2.5 border-b border-[var(--color-border-hairline)] flex items-center justify-between bg-zinc-900/70">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-200">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Nhật ký mô phỏng ví dụ</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                {execResult.success ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Thành công ({execResult.durationMs}ms)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Gặp lỗi thực thi
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#09090d] max-h-48 overflow-y-auto font-mono text-xs space-y-1.5">
              {execResult.logs.length === 0 ? (
                <div className="text-zinc-500">
                  Kịch bản đã chạy xong không phát sinh nhật ký console.log.
                </div>
              ) : (
                execResult.logs.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      entry.level === 'error'
                        ? 'text-rose-400'
                        : entry.level === 'warn'
                        ? 'text-amber-300'
                        : 'text-emerald-300'
                    }`}
                  >
                    <span className="text-zinc-600 mr-2">&gt;</span>
                    {entry.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Pane (6 cols): Live Document Spread Canvas + Scene Tree */}
        <div className="xl:col-span-6 space-y-4">
          <div className="rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--color-border-hairline)] flex flex-wrap items-center justify-between gap-2 bg-zinc-900/70">
              <div className="text-xs font-mono text-zinc-200">
                Xem trước Tài liệu Trực tiếp — <span className="text-cyan-400">{execResult.documentInfo.title}</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {execResult.artboards.length} Artboard · {execResult.nodes.length} đối tượng Vector
              </span>
            </div>

            <div className="p-3 bg-zinc-950 flex justify-center">
              <canvas
                ref={canvasRef}
                data-testid="playground-canvas"
                width={CANVAS_W}
                height={CANVAS_H}
                className="w-full h-auto rounded border border-zinc-800 block bg-[#09090b]"
              />
            </div>
          </div>

          {/* Scene Tree Inspector */}
          <div
            data-testid="playground-scene-tree"
            className="rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border-hairline)] pb-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-200">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Cây đối tượng tài liệu (DOM Scene Tree)</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {execResult.documentInfo.dpi} DPI · {execResult.documentInfo.units}
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 text-xs">
              {execResult.artboards.map((ab) => (
                <div
                  key={ab.id}
                  className="px-2.5 py-1.5 rounded bg-zinc-900/70 border border-zinc-800 font-mono text-[11px] text-zinc-300 flex items-center justify-between"
                >
                  <span>Artboard: {ab.name}</span>
                  <span className="text-zinc-500">
                    {ab.width}×{ab.height}
                  </span>
                </div>
              ))}
              {execResult.nodes.map((node) => (
                <div
                  key={node.id}
                  className="ml-4 px-2.5 py-1.5 rounded bg-[#09090d] border border-zinc-800/80 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-sm border border-zinc-600 shrink-0"
                      style={{ backgroundColor: node.stroke }}
                    />
                    <span className="text-zinc-200 truncate">{node.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {node.kind} · ({Math.round(node.x)}, {Math.round(node.y)})
                  </span>
                </div>
              ))}
              {execResult.nodes.length === 0 && (
                <p className="text-xs text-zinc-500 pl-4">
                  Chưa có đối tượng hình học nào được sinh ra từ kịch bản hiện tại.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
