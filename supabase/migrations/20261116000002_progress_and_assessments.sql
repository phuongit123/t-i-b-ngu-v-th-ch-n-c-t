-- ============================================================================
-- MIGRATION: 20261116000002_progress_and_assessments.sql
-- DESCRIPTION: Student progress tracking, lesson completions, assessment briefs,
--              capstone submissions, and official evaluation dossiers.
-- AUTHOR: BackendAgent / Orchestrator
-- ============================================================================

-- 1. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  last_slide_index INT NOT NULL DEFAULT 0,
  quiz_score INT DEFAULT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  client_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_status ON public.lesson_progress(status);

CREATE TRIGGER trg_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. Assessments Table (Specs for Capstone & Track Challenges)
CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY, -- e.g. 'capstone-a5-lumina', 'ch-vec-diamond'
  type TEXT NOT NULL CHECK (type IN ('capstone', 'challenge', 'milestone')),
  title_vi TEXT NOT NULL,
  scenario_overview TEXT NOT NULL,
  rubric_spec JSONB NOT NULL DEFAULT '{}'::jsonb,
  starter_assets JSONB NOT NULL DEFAULT '[]'::jsonb,
  pass_threshold_score NUMERIC(5,2) NOT NULL DEFAULT 75.0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Assessment Submissions Table (Student Submissions)
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  artifacts_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  self_assessment_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  student_notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_assessment_version UNIQUE (user_id, assessment_id, version)
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.assessment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assessment ON public.assessment_submissions(assessment_id);

CREATE TRIGGER trg_submissions_updated_at
  BEFORE UPDATE ON public.assessment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Assessment Results Table (Official Evaluation & Certificate)
-- STRICT RULE: Only evaluators and service_role can insert or update records in this table.
-- Students are strictly READ-ONLY.
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.assessment_submissions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  evaluator_name TEXT NOT NULL DEFAULT 'Giám Khảo Độc Lập Hội Đồng Chuyên Môn',
  total_weighted_score NUMERIC(5,2) NOT NULL,
  is_passed BOOLEAN NOT NULL DEFAULT false,
  official_scores_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  evaluator_notes TEXT,
  certificate_id TEXT UNIQUE DEFAULT NULL, -- e.g. 'AFFINITY-A5-8F3A29B1'
  certified_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_submission_result UNIQUE (submission_id)
);

CREATE INDEX IF NOT EXISTS idx_results_user_id ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_certificate ON public.assessment_results(certificate_id);

CREATE TRIGGER trg_results_updated_at
  BEFORE UPDATE ON public.assessment_results
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
