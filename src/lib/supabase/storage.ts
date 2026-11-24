/**
 * AFFINITY ACADEMY — STORAGE CLIENT
 * Handles file validation, secure uploads to Supabase Storage buckets,
 * and signed/public URL generation with offline resilience.
 */

import { learningStorageKey } from '../learning-storage';
import { writeOfflineArtifact } from '../offline-artifacts';
import { getSupabaseClient, isSupabaseConfigured } from './client.ts';

export const MAX_SUBMISSION_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ALLOWED_EXTENSIONS = [
  'afdesign',
  'afphoto',
  'afpub',
  'pdf',
  'zip',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'md',
  'txt',
];

export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream', // Used for native Affinity files (.afdesign, .afphoto, .afpub)
  'text/markdown',
  'text/x-markdown',
  'text/plain',
];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface UploadResult {
  path: string;
  url: string;
  sizeBytes: number;
  error?: string;
}

/**
 * Validates file size and type against Affinity Academy submission standards
 */
export const validateSubmissionFile = (file: File): FileValidationResult => {
  // 1. Size check
  if (!file.size) return { isValid: false, error: 'Tệp trống.' };
  if (file.size > MAX_SUBMISSION_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `Tệp quá lớn (${sizeMb} MB). Giới hạn tối đa là 50 MB.`,
    };
  }

  // 2. Extension check
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `Định dạng .${ext} không được hỗ trợ. Chỉ chấp nhận các định dạng: ${ALLOWED_EXTENSIONS.join(', ')}.`,
    };
  }

  // 3. MIME check (allow empty type for OS-specific native files if extension is valid)
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    // If it's a known Affinity extension, allow octet-stream fallback
    if (!['afdesign', 'afphoto', 'afpub'].includes(ext)) {
      return {
        isValid: false,
        error: `MIME type (${file.type}) không hợp lệ cho quy trình kiểm định đồ án.`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Uploads a student submission artifact to the private 'submissions' bucket
 */
export const uploadSubmissionArtifact = async (
  userId: string,
  assessmentId: string,
  file: File,
  artifactType: string
): Promise<UploadResult> => {
  // Validate
  const validation = validateSubmissionFile(file);
  if (!validation.isValid) {
    return {
      path: '',
      url: '',
      sizeBytes: file.size,
      error: validation.error,
    };
  }

  const supabase = getSupabaseClient();
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${userId}/${assessmentId}/${crypto.randomUUID()}_${artifactType}_${cleanName}`;

  // Offline / Mock mode fallback
  if (!isSupabaseConfigured() || !supabase) {
    const path = `local://submissions/${filePath}`;
    try {
      await writeOfflineArtifact(learningStorageKey(path), file);
      return { path, url: '', sizeBytes: file.size };
    } catch {
      return { path: '', url: '', sizeBytes: file.size, error: 'Không lưu được tệp trên thiết bị này.' };
    }
  }

  try {
    const { data, error } = await supabase.storage
      .from('submissions')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (error) {
      return {
        path: '',
        url: '',
        sizeBytes: file.size,
        error: `Tải lên thất bại: ${error.message}`,
      };
    }

    return { path: data.path, url: '', sizeBytes: file.size };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi ngoại lệ khi tải lên tệp';
    return {
      path: '',
      url: '',
      sizeBytes: file.size,
      error: msg,
    };
  }
};

/**
 * Retrieves a temporary signed URL for viewing private submissions
 */
export const getSubmissionSignedUrl = async (path: string, expiresInSeconds = 3600): Promise<string | null> => {
  if (path.startsWith('local://') || path.startsWith('blob:')) {
    return null;
  }

  const supabase = getSupabaseClient();
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase.storage
      .from('submissions')
      .createSignedUrl(path, expiresInSeconds, { download: true });

    if (error || !data) {
      console.warn('Không tạo được signed URL:', error?.message);
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.warn('Lỗi lấy signed URL:', err);
    return null;
  }
};

/**
 * Retrieves public URL for curriculum practice resources
 */
export const getResourcePublicUrl = (storagePath: string): string => {
  const supabase = getSupabaseClient();
  if (!isSupabaseConfigured() || !supabase) {
    return `/assets/${storagePath}`;
  }

  const { data } = supabase.storage
    .from('resources')
    .getPublicUrl(storagePath);

  return data.publicUrl;
};
