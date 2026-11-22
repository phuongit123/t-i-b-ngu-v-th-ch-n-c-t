import { learningStorageKey } from './learning-storage';

/**
 * Google Drive Cloud Storage Bridge & LocalStorage Expansion for Affinity Academy
 * Solves the 5MB browser localStorage limit and prevents backend server overload
 * by leveraging Google Drive for heavy graphic assets, project templates, and student backups.
 */

export interface GDriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  description: string;
  category: 'vector' | 'photo' | 'layout' | 'scripting' | 'backup';
  previewUrl: string;
  downloadUrl: string;
  webUrl: string;
}

export const GDRIVE_STORAGE_CONFIG = {
  folderId: '1cS5McFPt8MpdFQOXSgOAmH_9Gt3CLGDR',
  folderName: 'Affinity Academy Storage',
  folderWebUrl: 'https://drive.google.com/drive/folders/1cS5McFPt8MpdFQOXSgOAmH_9Gt3CLGDR',
  embeddedGridUrl: 'https://drive.google.com/embeddedfolderview?id=1cS5McFPt8MpdFQOXSgOAmH_9Gt3CLGDR#grid',
  embeddedListUrl: 'https://drive.google.com/embeddedfolderview?id=1cS5McFPt8MpdFQOXSgOAmH_9Gt3CLGDR#list',
  uploadUrl: 'https://drive.google.com/drive/u/0/folders/1cS5McFPt8MpdFQOXSgOAmH_9Gt3CLGDR',
};

// Verified files currently hosted on Affinity Academy Google Drive Storage
export const GDRIVE_OFFICIAL_ASSETS: GDriveFileItem[] = [
  {
    id: '10nOJZNGNQwKsC0NYGS1Ilxd4s6dQWEYu',
    name: 'P01_starter.afphoto',
    mimeType: 'application/octet-stream',
    size: '1.6 MB',
    description: 'Tệp mẫu gốc Affinity Photo (RAW + Layers) cho bài thực hành P01 về không gian Pixel và Layer Mask.',
    category: 'photo',
    previewUrl: 'https://drive.google.com/file/d/10nOJZNGNQwKsC0NYGS1Ilxd4s6dQWEYu/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=10nOJZNGNQwKsC0NYGS1Ilxd4s6dQWEYu',
    webUrl: 'https://drive.google.com/file/d/10nOJZNGNQwKsC0NYGS1Ilxd4s6dQWEYu/view',
  },
  {
    id: '1v5glZJfx3QeUkJiY4JXmbcPb07e8beLN',
    name: 'portrait-subject-studio.png',
    mimeType: 'image/png',
    size: '1.5 MB',
    description: 'Ảnh chân dung studio độ phân giải cao dùng thực hành Refine Selection, tách nền tóc và ánh sáng viền.',
    category: 'photo',
    previewUrl: 'https://drive.google.com/file/d/1v5glZJfx3QeUkJiY4JXmbcPb07e8beLN/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1v5glZJfx3QeUkJiY4JXmbcPb07e8beLN',
    webUrl: 'https://drive.google.com/file/d/1v5glZJfx3QeUkJiY4JXmbcPb07e8beLN/view',
  },
  {
    id: '1sII2li30L-jHBTy3TnZh6ICb8tLRrvLX',
    name: 'before-color-raw.png',
    mimeType: 'image/png',
    size: '1.8 MB',
    description: 'Ảnh phong cảnh RAW chưa chỉnh màu, dùng đối chiếu trước/sau khi kéo Curves và tách tông ấm lạnh.',
    category: 'photo',
    previewUrl: 'https://drive.google.com/file/d/1sII2li30L-jHBTy3TnZh6ICb8tLRrvLX/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1sII2li30L-jHBTy3TnZh6ICb8tLRrvLX',
    webUrl: 'https://drive.google.com/file/d/1sII2li30L-jHBTy3TnZh6ICb8tLRrvLX/view',
  },
];

export interface StudentBackupData {
  version: string;
  exportedAt: string;
  appName: string;
  storageType: 'google_drive_expanded';
  localData: Record<string, unknown>;
}

const BACKUP_KEYS = [
  'affinity_academy_progress_v2',
  'affinity_academy_activity_v1',
  'affinity_user_preferences',
] as const;
const MAX_BACKUP_BYTES = 1024 * 1024;

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validBackupEntry(key: typeof BACKUP_KEYS[number], value: unknown): boolean {
  if (!isObject(value)) return false;
  if (key === 'affinity_academy_progress_v2') {
    return Object.keys(value).length <= 66 && Object.entries(value).every(([id, entry]) =>
      /^[DPBS][0-9]{2}-[0-9]{2}$/.test(id) && isObject(entry) && entry.lessonId === id
      && ['not_started', 'in_progress', 'completed'].includes(String(entry.status))
      && Number.isInteger(entry.lastSlideIndex) && Number(entry.lastSlideIndex) >= 0
      && typeof entry.clientUpdatedAt === 'string' && Number.isFinite(Date.parse(entry.clientUpdatedAt)));
  }
  if (key === 'affinity_academy_activity_v1') {
    return Array.isArray(value.studyDates) && value.studyDates.every(date => typeof date === 'string'
      && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))
      && typeof value.extraStudyMinutes === 'number' && value.extraStudyMinutes >= 0
      && isObject(value.challengeScores) && Object.values(value.challengeScores).every(score =>
        isObject(score) && typeof score.score === 'number' && score.score >= 0 && score.score <= 100
        && typeof score.passed === 'boolean' && typeof score.completedAt === 'string');
  }
  return ['displayName', 'email', 'careerTrack', 'experienceLevel', 'shortcutModifier']
    .every(field => value[field] === undefined || typeof value[field] === 'string')
    && (value.autoSaveProgress === undefined || typeof value.autoSaveProgress === 'boolean');
}

/** Exports only portable learner data for the current account. */
export function exportLocalStorageToDriveBackup(): StudentBackupData {
  const localData: Record<string, unknown> = {};
  for (const key of BACKUP_KEYS) {
    try {
      const raw = localStorage.getItem(learningStorageKey(key));
      if (!raw) continue;
      const value: unknown = JSON.parse(raw);
      if (validBackupEntry(key, value)) localData[key] = value;
    } catch {
      // Old or damaged records can be recovered from the original browser storage.
    }
  }
  return {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    appName: 'Affinity Academy',
    storageType: 'google_drive_expanded',
    localData,
  };
}

/**
 * Triggers a download of the backup file as a JSON document ready to be uploaded to Google Drive.
 */
export function downloadBackupForGoogleDrive(): void {
  const backup = exportLocalStorageToDriveBackup();
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `affinity_academy_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Restores a JSON backup into localStorage.
 */
export function restoreBackupFromJSON(jsonText: string): { success: boolean; keyCount: number; error?: string } {
  const written: [string, string | null][] = [];
  try {
    if (new Blob([jsonText]).size > MAX_BACKUP_BYTES) throw new Error('Tệp sao lưu vượt quá 1 MB.');
    const data: unknown = JSON.parse(jsonText);
    if (!isObject(data) || data.appName !== 'Affinity Academy'
      || !['1.0.0', '2.0.0'].includes(String(data.version)) || !isObject(data.localData)) {
      throw new Error('Tệp sao lưu không đúng định dạng Affinity Academy.');
    }
    const entries = BACKUP_KEYS.filter(key => Object.hasOwn(data.localData as object, key)).map(key => {
      const value = (data.localData as Record<string, unknown>)[key];
      if (!validBackupEntry(key, value)) throw new Error('Tệp sao lưu chứa dữ liệu học tập không hợp lệ.');
      return [learningStorageKey(key), JSON.stringify(value)] as const;
    });
    if (!entries.length) throw new Error('Tệp sao lưu không có dữ liệu học tập hỗ trợ.');
    for (const [key, value] of entries) {
      const previous = localStorage.getItem(key);
      localStorage.setItem(key, value);
      written.push([key, previous]);
    }
    return { success: true, keyCount: written.length };
  } catch (error) {
    for (const [key, previous] of written.reverse()) {
      if (previous === null) localStorage.removeItem(key);
      else localStorage.setItem(key, previous);
    }
    return { success: false, keyCount: 0, error: error instanceof Error ? error.message : 'Không thể phục hồi.' };
  }
}
