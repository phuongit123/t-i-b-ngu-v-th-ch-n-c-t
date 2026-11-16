/**
 * AFFINITY ACADEMY — SUPABASE CLIENT
 * Safe client initialization with offline/local fallback detection.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('placeholder')
  );
};

// Create the singleton client instance
let supabaseInstance: SupabaseClient<Database> | null = null;

export const getSupabaseClient = (): SupabaseClient<Database> | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'affinity-academy-auth',
      },
    });
  }

  return supabaseInstance;
};

// Convenience export of client instance
export const supabase = getSupabaseClient();
