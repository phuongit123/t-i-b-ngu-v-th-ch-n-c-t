import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from './client.ts';
import { setLearningStorageAccount } from '../learning-storage';
import type { Database, UserRole } from '../../types/database.types.ts';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfilePreferences = Partial<Pick<Profile, 'display_name' | 'avatar_url' | 'career_track' |
  'experience_level' | 'shortcut_modifier' | 'auto_save_progress'>>;
type AuthResult = { error: Error | null; confirmationRequired?: boolean };

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole;
  workspaceId: string;
  recovery: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName?: string, careerTrack?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<AuthResult>;
  setNewPassword: (password: string) => Promise<AuthResult>;
  updateProfile: (updates: ProfilePreferences) => Promise<AuthResult>;
  setLocalOfflineUser: (role: UserRole, email?: string, displayName?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const OFFLINE_USER_KEY = 'affinity_academy_offline_user';
const DEFAULT_TRACK = 'Vector & Brand Identity';
const demoEnabled = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

function readOfflineProfile(email?: string): Profile | null {
  try {
    const raw = localStorage.getItem(email ? `${OFFLINE_USER_KEY}:${email}` : OFFLINE_USER_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data.email !== 'string') return null;
    return createOfflineProfile(data.email, data.display_name ?? data.displayName, data.career_track,
      demoEnabled && ['evaluator', 'admin'].includes(data.role) ? data.role : 'student', data);
  } catch {
    return null;
  }
}

function createOfflineProfile(email: string, name?: string, careerTrack?: string,
  role: UserRole = 'student', existing?: Partial<Profile>): Profile {
  const normalized = email.trim().toLowerCase();
  const now = new Date().toISOString();
  return {
    id: `offline:${normalized}`, email: normalized, display_name: name || normalized.split('@')[0],
    career_track: careerTrack || DEFAULT_TRACK, role, avatar_url: existing?.avatar_url ?? null,
    auto_save_progress: existing?.auto_save_progress ?? true,
    experience_level: existing?.experience_level ?? 'Beginner',
    shortcut_modifier: existing?.shortcut_modifier ?? 'windows',
    created_at: existing?.created_at ?? now, updated_at: now,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = getSupabaseClient();
  const isConfigured = Boolean(supabase);
  const [session, setSession] = useState<Session | null>(null);
  const [offline, setOffline] = useState<Profile | null>(null);
  const [cloudProfile, setCloudProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);
  const user = session?.user ?? null;
  const userId = user?.id;
  const profile = isConfigured ? (cloudProfile?.id === userId ? cloudProfile : null) : offline;
  const workspaceId = userId ?? offline?.id ?? '';

  useEffect(() => {
    if (!supabase) {
      const saved = readOfflineProfile();
      setLearningStorageAccount(saved?.id ?? null);
      setOffline(saved);
      setIsLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setLearningStorageAccount(newSession?.user.id ?? null);
      setSession(newSession);
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      if (event === 'SIGNED_OUT') setRecovery(false);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    setCloudProfile(null);
    if (!supabase || !userId) return;
    const request = new AbortController();
    void (async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId)
        .abortSignal(request.signal).maybeSingle();
      if (!request.signal.aborted && !error) setCloudProfile(data);
    })();
    return () => request.abort();
  }, [supabase, userId]);

  function saveOffline(next: Profile): void {
    const data = JSON.stringify(next);
    localStorage.setItem(`${OFFLINE_USER_KEY}:${next.email}`, data);
    localStorage.setItem(OFFLINE_USER_KEY, data);
    setLearningStorageAccount(next.id);
    setOffline(next);
  }

  async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
      saveOffline(readOfflineProfile(email.trim().toLowerCase()) ?? createOfflineProfile(email));
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signUp(email: string, password: string, displayName?: string, careerTrack?: string): Promise<AuthResult> {
    if (!supabase) {
      saveOffline(createOfflineProfile(email, displayName, careerTrack));
      return { error: null };
    }
    const { error, data } = await supabase.auth.signUp({ email, password, options: {
      data: { display_name: displayName || email.split('@')[0], career_track: careerTrack || DEFAULT_TRACK },
    } });
    return { error, confirmationRequired: !error && !data.session };
  }

  async function signOut(): Promise<void> {
    if (supabase) {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) throw error;
    } else {
      localStorage.removeItem(OFFLINE_USER_KEY);
      setLearningStorageAccount(null);
      setOffline(null);
    }
  }

  async function resetPasswordForEmail(email: string): Promise<AuthResult> {
    if (!supabase) return { error: new Error('Khôi phục mật khẩu cần kết nối dịch vụ tài khoản.') };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  }

  async function setNewPassword(password: string): Promise<AuthResult> {
    if (!supabase || !userId || !recovery) return { error: new Error('Liên kết khôi phục không hợp lệ hoặc đã hết hạn.') };
    const { error } = await supabase.auth.updateUser({ password });
    if (!error) setRecovery(false);
    return { error };
  }

  async function updateProfile(updates: ProfilePreferences): Promise<AuthResult> {
    if (!profile) return { error: new Error('Chưa có hồ sơ học viên.') };
    if (!supabase) {
      saveOffline({ ...profile, ...updates, updated_at: new Date().toISOString() });
      return { error: null };
    }
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', profile.id).select().single();
    if (!error) setCloudProfile(current => current?.id === data.id ? data : current);
    return { error };
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, role: profile?.role ?? 'student', workspaceId, recovery, isLoading, isConfigured,
      signInWithPassword, signUp, signOut, resetPasswordForEmail, setNewPassword, updateProfile,
      setLocalOfflineUser: (role, email = 'hocvien@affinity.academy', name) => {
        if (!supabase && demoEnabled) saveOffline(createOfflineProfile(email, name, DEFAULT_TRACK, role));
      },
    }}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within an AuthProvider');
  return value;
}
