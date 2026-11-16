-- ============================================================================
-- MIGRATION: 20261116000001_initial_schema.sql
-- DESCRIPTION: Core schema setup for Affinity Academy: profiles, tracks, modules,
--              lessons, and learning resources.
-- AUTHOR: BackendAgent / Orchestrator
-- ============================================================================

-- 1. Helper function for automated updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Profiles Table (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Học viên Affinity',
  avatar_url TEXT,
  career_track TEXT NOT NULL DEFAULT 'Vector & Brand Identity',
  experience_level TEXT NOT NULL DEFAULT 'Beginner',
  shortcut_modifier TEXT NOT NULL DEFAULT 'windows' CHECK (shortcut_modifier IN ('windows', 'mac')),
  auto_save_progress BOOLEAN NOT NULL DEFAULT true,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'evaluator', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Trigger to auto-update profiles.updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to create a public profile entry when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_app_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Tracks Table
CREATE TABLE IF NOT EXISTS public.tracks (
  id TEXT PRIMARY KEY, -- 'designer', 'photo', 'publisher', 'scripting'
  name TEXT NOT NULL,
  label_vi TEXT NOT NULL,
  tagline_vi TEXT NOT NULL,
  description_vi TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
  id TEXT PRIMARY KEY, -- 'D01', 'P01', 'B01', 'S01'
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  module_number TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_vi TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_minutes INT NOT NULL DEFAULT 60,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_modules_track_id ON public.modules(track_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(order_index);

-- 5. Lessons Table (Existing 66 lessons)
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY, -- 'D01-01', 'P01-01', etc.
  module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  order_index INT NOT NULL DEFAULT 1,
  title_vi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 20,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  practice_asset_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_track_id ON public.lessons(track_id);

-- 6. Learning Resources Table
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('designer', 'photo', 'publisher', 'scripting', 'common')),
  extension TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  storage_path TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  download_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_category ON public.learning_resources(category);
