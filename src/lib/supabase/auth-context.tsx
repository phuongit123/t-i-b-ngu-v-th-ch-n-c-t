/**
 * AFFINITY ACADEMY — AUTH CONTEXT & PROVIDER
 * Provides authentication state, session management, user profile data,
 * and role-based access control with offline fallback support.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from './client.ts';
import type { Database, UserRole } from '../../types/database.types.ts';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string, careerTrack?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  setLocalOfflineUser: (role: UserRole, email?: string, displayName?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_OFFLINE_USER_KEY = 'affinity_academy_offline_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isConfigured = isSupabaseConfigured();
  const supabase = getSupabaseClient();

  // Load profile from Supabase profiles table
  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Không thể tải profile từ Supabase:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.warn('Lỗi kết nối khi tải profile:', err);
      return null;
    }
  }, [supabase]);

  // Initial load
  useEffect(() => {
    if (!isConfigured || !supabase) {
      // Check for saved offline user in localStorage
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_OFFLINE_USER_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as { role: UserRole; email: string; displayName: string };
          setRole(parsed.role);
          setProfile({
            id: 'offline-local-user-id',
            email: parsed.email,
            display_name: parsed.displayName,
            avatar_url: null,
            career_track: 'Vector & Brand Identity',
            experience_level: 'Intermediate',
            shortcut_modifier: 'windows',
            auto_save_progress: true,
            role: parsed.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn('Không đọc được offline user cache', e);
      }
      setIsLoading(false);
      return;
    }

    // Supabase is configured: get active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        if (userProfile) {
          setProfile(userProfile);
          setRole(userProfile.role);
        } else {
          // Default profile if trigger hasn't fired yet
          setRole('student');
        }
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        const userProfile = await fetchProfile(newSession.user.id);
        if (userProfile) {
          setProfile(userProfile);
          setRole(userProfile.role);
        }
      } else {
        setProfile(null);
        setRole('student');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured, supabase, fetchProfile]);

  // Sign In
  const signInWithPassword = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (!isConfigured || !supabase) {
      // Offline fallback login
      setLocalOfflineUser('student', email, email.split('@')[0]);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: new Error(error.message) };
      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        if (userProfile) {
          setProfile(userProfile);
          setRole(userProfile.role);
        }
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Đăng nhập thất bại') };
    }
  };

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    displayName?: string,
    careerTrack?: string
  ): Promise<{ error: Error | null }> => {
    if (!isConfigured || !supabase) {
      setLocalOfflineUser('student', email, displayName || email.split('@')[0]);
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
            career_track: careerTrack || 'Vector & Brand Identity',
          },
        },
      });
      if (error) return { error: new Error(error.message) };
      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        if (userProfile) {
          setProfile(userProfile);
          setRole(userProfile.role);
        }
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Đăng ký thất bại') };
    }
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    if (isConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_OFFLINE_USER_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole('student');
  };

  // Reset Password
  const resetPasswordForEmail = async (email: string): Promise<{ error: Error | null }> => {
    if (!isConfigured || !supabase) {
      return { error: null };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Gửi yêu cầu đặt lại mật khẩu thất bại') };
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    if (!profile) return { error: new Error('Người dùng chưa đăng nhập') };

    // Prevent client escalation of role
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.role && role !== 'admin') {
      delete sanitizedUpdates.role;
    }

    if (!isConfigured || !supabase) {
      const updated = { ...profile, ...sanitizedUpdates, updated_at: new Date().toISOString() };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_OFFLINE_USER_KEY, JSON.stringify({
        role: updated.role,
        email: updated.email,
        displayName: updated.display_name,
      }));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('id', profile.id);

      if (error) return { error: new Error(error.message) };
      setProfile(prev => prev ? { ...prev, ...sanitizedUpdates } : null);
      return { error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error('Cập nhật hồ sơ thất bại') };
    }
  };

  // Offline mock switcher for testing roles
  const setLocalOfflineUser = (newRole: UserRole, email = 'hocvien@affinity.academy', displayName = 'Học Viên Affinity') => {
    const mockProfile: Profile = {
      id: 'offline-local-user-id',
      email,
      display_name: displayName,
      avatar_url: null,
      career_track: 'Vector & Brand Identity',
      experience_level: 'Intermediate',
      shortcut_modifier: 'windows',
      auto_save_progress: true,
      role: newRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(mockProfile);
    setRole(newRole);
    localStorage.setItem(LOCAL_STORAGE_OFFLINE_USER_KEY, JSON.stringify({
      role: newRole,
      email,
      displayName,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isLoading,
        isConfigured,
        signInWithPassword,
        signUp,
        signOut,
        resetPasswordForEmail,
        updateProfile,
        setLocalOfflineUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
