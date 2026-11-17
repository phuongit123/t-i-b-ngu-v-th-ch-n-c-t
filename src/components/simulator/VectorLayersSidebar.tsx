import React from 'react';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { PathCurve, SimulatorExercise } from './types';
import { SIMULATOR_EXERCISES } from './exercises';

interface EvaluationResult {
  accuracy: number;
  averageDistance: number;
  feedback: string;
}

interface VectorLayersSidebarProps {
  layers: PathCurve[];
  activeLayerId: string;
  onSelectLayer: (id: string) => void;
  onAddEmptyLayer: () => void;
  onToggleLayerVisibility: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onDeleteLayer: (id: string) => void;
  activeExercise: SimulatorExercise | null;
  onSelectExercise: (ex: SimulatorExercise | null) => void;
  showHints: boolean;
  onToggleHints: () => void;
  onEvaluate: () => void;
  canEvaluate: boolean;
  evaluationResult: EvaluationResult | null;
  embeddedMode?: boolean;
}

export const VectorLayersSidebar: React.FC<VectorLayersSidebarProps> = ({
  layers,
  activeLayerId,
  onSelectLayer,
  onAddEmptyLayer,
  onToggleLayerVisibility,
  onMoveLayer,
  onDeleteLayer,
  activeExercise,
  onSelectExercise,
  showHints,
  onToggleHints,
  onEvaluate,
  canEvaluate,
  evaluationResult,
  embeddedMode = false,
}) => {
  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      {/* Vector Multi-Layer Stack */}
      <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Lớp Vector ({layers.length})
          </span>
          <button
            type="button"
            data-testid="vec-add-layer"
            onClick={onAddEmptyLayer}
            className="text-[11px] px-2 py-1 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 flex items-center gap-1 transition-colors"
            title="Thêm lớp vector mới"
          >
            <Plus className="w-3 h-3" /> Thêm lớp
          </button>
        </div>

        <div data-testid="vec-layer-list" className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
          {[...layers].reverse().map((layer, revIdx) => {
            const isActive = layer.id === activeLayerId;
            const visible = layer.visible !== false;
            return (
              <div
                key={layer.id}
                data-testid={`vec-layer-item-${layer.id}`}
                onClick={() => onSelectLayer(layer.id)}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-elevated border-cyan-500/50 text-zinc-100'
                    : 'bg-canvas/70 border-hairline text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLayerVisibility(layer.id);
                    }}
                    className="text-zinc-400 hover:text-zinc-200 shrink-0"
                    title={visible ? 'Ẩn lớp' : 'Hiện lớp'}
                  >
                    {visible ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <span
                    className="w-2.5 h-2.5 rounded-sm border border-zinc-600 shrink-0"
                    style={{ backgroundColor: layer.strokeColor ?? '#06b6d4' }}
                  />
                  <div className="truncate">
                    <div className="font-medium truncate">{layer.name ?? 'Đường cong Vector'}</div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      {layer.nodes.length} điểm{layer.compoundPathD ? ' · Boolean' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    disabled={revIdx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayer(layer.id, 'up');
                    }}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-25"
                    title="Đưa lên trên"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={revIdx === layers.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayer(layer.id, 'down');
                    }}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-200 disabled:opacity-25"
                    title="Đưa xuống dưới"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  {layers.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLayer(layer.id);
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-rose-400"
                      title="Xóa lớp"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exercise Selector (Hidden in Embedded Challenge Mode) */}
      {!embeddedMode && (
        <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Bài tập thực hành
            </span>
            <button
              type="button"
              onClick={onToggleHints}
              className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHints ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {SIMULATOR_EXERCISES.map((ex) => {
              const isSelected = activeExercise?.id === ex.id;
              return (
                <button
                  type="button"
                  key={ex.id}
                  onClick={() => onSelectExercise(ex)}
                  className={`text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-elevated border-cyan-500/40 text-zinc-100 shadow-xs'
                      : 'border-hairline text-zinc-400 hover:text-zinc-200 hover:bg-canvas'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{ex.title}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        ex.difficulty === 'Beginner'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : ex.difficulty === 'Intermediate'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {ex.difficulty === 'Beginner'
                        ? 'Cơ bản'
                        : ex.difficulty === 'Intermediate'
                        ? 'Trung cấp'
                        : 'Nâng cao'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {ex.subtitle}
                  </p>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onSelectExercise(null)}
              className={`text-left p-2.5 rounded-lg border transition-all ${
                activeExercise === null
                  ? 'bg-elevated border-cyan-500/40 text-zinc-100 shadow-xs'
                  : 'border-hairline text-zinc-400 hover:text-zinc-200 hover:bg-canvas'
              }`}
            >
              <span className="text-xs font-semibold">Tự do sáng tạo (Free Sandbox)</span>
              <p className="text-[11px] text-zinc-500 mt-0.5">Vẽ tự do & thử nghiệm phép toán Boolean</p>
            </button>
          </div>

          {activeExercise && showHints && (
            <div className="pt-3 border-t border-hairline space-y-2">
              <p className="text-xs text-zinc-300 leading-relaxed">{activeExercise.description}</p>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Các bước thực hiện:
                </span>
                <ul className="text-[11px] text-zinc-400 space-y-1 pl-3.5 list-disc">
                  {activeExercise.hints.map((hint, idx) => (
                    <li key={idx} className="leading-snug">
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeExercise && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onEvaluate}
                disabled={!canEvaluate}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shadow-subtle disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chấm điểm đường cong</span>
              </button>
            </div>
          )}

          {evaluationResult && (
            <div
              className={`p-3 rounded-lg border ${
                evaluationResult.accuracy >= 80
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : evaluationResult.accuracy >= 60
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
              } space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  {evaluationResult.accuracy >= 80 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                  Độ chính xác: {evaluationResult.accuracy}%
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Độ lệch: {evaluationResult.averageDistance}px
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{evaluationResult.feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Cheatsheet */}
      {!embeddedMode && (
        <div className="p-3.5 rounded-xl bg-surface border border-hairline space-y-2 text-xs text-zinc-400">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
            Bảng tra cứu nhanh Bézier & Boolean
          </span>
          <div className="space-y-1.5 text-[11px] leading-relaxed">
            <div>
              <strong className="text-zinc-200">Corner Tool [C]:</strong> Chọn điểm góc nhọn và kéo thanh Bo góc phi phá hủy.
            </div>
            <div>
              <strong className="text-zinc-200">Phép toán Boolean:</strong> Tạo 2 hình chồng nhau (hoặc bấm cặp hình mẫu) rồi chọn Add / Subtract / Intersect / Xor.
            </div>
            <div>
              <strong className="text-zinc-200">Alt + Kéo chuột:</strong> Bẻ gãy liên kết thẳng hàng giữa 2 tay đòn (Cusp Handle).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
