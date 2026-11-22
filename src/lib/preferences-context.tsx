import { learningStorageKey } from '@/lib/learning-storage';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/supabase/auth-context';

export interface UserPreferences {
  displayName: string;
  email: string;
  careerTrack: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  shortcutModifier: 'windows' | 'mac';
  autoSaveProgress: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  displayName: 'Học Viên Affinity',
  email: 'hocvien@affinity.academy',
  careerTrack: 'Thiết kế Vector & Nhận diện thương hiệu',
  experienceLevel: 'Beginner',
  shortcutModifier: 'windows',
  autoSaveProgress: true,
};

const PREFS_STORAGE_KEY = 'affinity_user_preferences';
const PREFS_UPDATED_EVENT = 'affinity-preferences-updated';

const CAREER_TRACK_NORMALIZATION: Record<string, string> = {
  'Vector & Brand Identity': 'Thiết kế Vector & Nhận diện thương hiệu',
  'Photo Retouching & Compositing': 'Chỉnh sửa ảnh & Ghép cảnh chuyên nghiệp',
  'Editorial & Publication': 'Biên tập dàn trang & Xuất bản ấn phẩm',
  'Design Automation & MCP': 'Tự động hóa thiết kế & Lập trình MCP',
};

function readStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(learningStorageKey(PREFS_STORAGE_KEY));
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    const normalizedTrack = parsed.careerTrack
      ? CAREER_TRACK_NORMALIZATION[parsed.careerTrack] || parsed.careerTrack
      : DEFAULT_PREFERENCES.careerTrack;
    const level =
      parsed.experienceLevel === 'Beginner' ||
      parsed.experienceLevel === 'Intermediate' ||
      parsed.experienceLevel === 'Advanced'
        ? parsed.experienceLevel
        : DEFAULT_PREFERENCES.experienceLevel;
    const modifier =
      parsed.shortcutModifier === 'mac' || parsed.shortcutModifier === 'windows'
        ? parsed.shortcutModifier
        : DEFAULT_PREFERENCES.shortcutModifier;

    return {
      displayName: parsed.displayName?.trim() || DEFAULT_PREFERENCES.displayName,
      email: parsed.email?.trim() || DEFAULT_PREFERENCES.email,
      careerTrack: normalizedTrack,
      experienceLevel: level,
      shortcutModifier: modifier,
      autoSaveProgress:
        typeof parsed.autoSaveProgress === 'boolean'
          ? parsed.autoSaveProgress
          : DEFAULT_PREFERENCES.autoSaveProgress,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

/**
 * Provides synchronized user preferences (OS shortcut modifier, profile settings, auto-save)
 * across SettingsPage, KnowledgePage, SlidePlayer, SimulatorPage, and SearchCommand.
 */
export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, updateProfile } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(readStoredPreferences);

  // Synchronize with external localStorage mutations (e.g., cross-tab or test seeding)
  useEffect(() => {
    const handleSync = () => {
      setPreferences(readStoredPreferences());
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener(PREFS_UPDATED_EVENT, handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener(PREFS_UPDATED_EVENT, handleSync);
    };
  }, []);

  // Merge authenticated profile metadata when signed in and local storage has not overridden it
  useEffect(() => {
    if (!profile) return;
    setPreferences((prev) => {
      const next: UserPreferences = {
        ...prev,
        displayName:
          prev.displayName === DEFAULT_PREFERENCES.displayName && profile.display_name
            ? profile.display_name
            : prev.displayName,
        email:
          prev.email === DEFAULT_PREFERENCES.email && profile.email
            ? profile.email
            : prev.email,
      };
      return next;
    });
  }, [profile]);

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      setPreferences((prev) => {
        const next: UserPreferences = { ...prev, ...updates };
        try {
          localStorage.setItem(learningStorageKey(PREFS_STORAGE_KEY), JSON.stringify(next));
          window.dispatchEvent(new CustomEvent(PREFS_UPDATED_EVENT));
        } catch (err) {
          console.warn('Không thể lưu cấu hình người dùng:', err);
        }

        if (profile) {
          void updateProfile({
            display_name: next.displayName,
            career_track: next.careerTrack,
            experience_level: next.experienceLevel,
            shortcut_modifier: next.shortcutModifier,
            auto_save_progress: next.autoSaveProgress,
          });
        }
        return next;
      });
    },
    [profile, updateProfile]
  );

  const resetPreferences = useCallback(() => {
    updatePreferences(DEFAULT_PREFERENCES);
  }, [updatePreferences]);

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, resetPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePreferences = (): PreferencesContextType => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences phải được sử dụng bên trong PreferencesProvider');
  }
  return ctx;
};

/**
 * Formats a keyboard shortcut string to match the user's selected OS modifier.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function formatShortcutForOs(
  winShortcut: string,
  macShortcut: string | undefined,
  modifier: 'windows' | 'mac'
): string {
  if (modifier === 'mac') {
    if (macShortcut) return macShortcut;
    return winShortcut
      .replace(/\bCtrl\b/g, '⌘ Cmd')
      .replace(/\bAlt\b/g, '⌥ Option')
      .replace(/\bEnter\b/g, 'Return');
  }
  return winShortcut;
}
