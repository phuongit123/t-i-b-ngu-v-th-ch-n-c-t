import React, { useState } from 'react';
import {
  Cloud,
  Download,
  Upload,
  ExternalLink,
  FileText,
  FileImage,
  RefreshCw,
  CheckCircle2,
  LayoutGrid,
  List,
  FolderOpen,
} from 'lucide-react';
import {
  GDRIVE_STORAGE_CONFIG,
  GDRIVE_OFFICIAL_ASSETS,
  downloadBackupForGoogleDrive,
  restoreBackupFromJSON,
} from '@/lib/gdrive-storage';

export const GoogleDriveStorageHub: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setRestoreStatus('Tệp sao lưu vượt quá 1 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = restoreBackupFromJSON(content);
        if (result.success) {
          setRestoreStatus(`Đã phục hồi ${result.keyCount} nhóm dữ liệu học tập trên thiết bị.`);
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setRestoreStatus(`Lỗi: ${result.error}`);
        }
      }
    };
    reader.readAsText(file);
  };

  const embedUrl =
    viewMode === 'grid'
      ? GDRIVE_STORAGE_CONFIG.embeddedGridUrl
      : GDRIVE_STORAGE_CONFIG.embeddedListUrl;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Architecture Explanation */}
      <div className="rounded-2xl border border-hairline bg-gradient-to-br from-surface via-canvas to-elevated p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Cloud className="w-64 h-64 text-cyan-400" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Cloud className="w-3.5 h-3.5" />
              <span>Google Drive Cloud Storage Bridge</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Học Liệu Trên Google Drive
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Duyệt thư mục học liệu trên Drive. Tệp sao lưu tiến độ được tải về thiết bị dưới dạng JSON.
            </p>
          </div>

        </div>

        {/* Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={downloadBackupForGoogleDrive}
            className="btn-tactile-cyan inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white tracking-wide cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải Tệp Sao Lưu (.json)</span>
          </button>

          <label className="btn-tactile-dark inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-200 cursor-pointer">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Phục Hồi Từ Tệp JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <a
            href={GDRIVE_STORAGE_CONFIG.folderWebUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-tactile-amber inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Mở Thư Mục Google Drive Gốc</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {restoreStatus && (
          <div className="flex items-center gap-2 text-xs font-medium p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{restoreStatus}</span>
          </div>
        )}
      </div>

      {/* 2. Embedded Google Drive Folder Viewer */}
      <div className="rounded-2xl border border-hairline bg-surface overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-cyan-400" />
              Khung Xem Nhúng Trực Tiếp Google Drive (Live Embedded View)
            </h3>
            <p className="text-xs text-zinc-400">
              Thư mục đám mây chính thức của Affinity Academy (ID: <code className="text-cyan-300">{GDRIVE_STORAGE_CONFIG.folderId}</code>)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Switcher: Grid vs List */}
            <div className="flex items-center bg-canvas p-1 rounded-lg border border-hairline text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Dạng lưới (Grid)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lưới</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all flex items-center gap-1 ${
                  viewMode === 'list'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Dạng danh sách (List)"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Danh sách</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsIframeLoading(true);
                const iframe = document.getElementById('gdrive-iframe') as HTMLIFrameElement;
                if (iframe) iframe.src = embedUrl;
              }}
              className="p-2 rounded-lg bg-canvas border border-hairline text-zinc-400 hover:text-white transition"
              title="Tải lại khung nhúng"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-hairline bg-canvas">
          {isIframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-canvas/90 z-10 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs text-zinc-400 font-mono">
                Đang tải tệp từ Google Drive Cloud...
              </span>
            </div>
          )}

          <iframe
            id="gdrive-iframe"
            src={embedUrl}
            title="Google Drive Embedded Folder"
            className="w-full h-full border-0"
            onLoad={() => setIsIframeLoading(false)}
            allow="autoplay"
          />
        </div>
      </div>

      {/* 3. Verified Heavy Graphic Assets Hosted on Drive */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Kho Tệp Đồ Họa Nặng (.afphoto, RAW &amp; Tư Liệu)
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Tải Trực Tiếp Từ Google Drive CDN
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {GDRIVE_OFFICIAL_ASSETS.length} tệp đã được đồng bộ hóa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GDRIVE_OFFICIAL_ASSETS.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl border border-hairline bg-surface p-5 flex flex-col justify-between space-y-4 hover:border-cyan-400/50 transition-all shadow-md group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    {asset.mimeType.includes('image') ? (
                      <FileImage className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {asset.size}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {asset.name}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {asset.description}
                </p>
              </div>

              <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2">
                <a
                  href={asset.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <span>Xem trước</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={asset.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-tactile-cyan px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải tệp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
