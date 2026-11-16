-- ============================================================================
-- MIGRATION: 20261116000003_rls_policies.sql
-- DESCRIPTION: Row Level Security (RLS) policies for Affinity Academy tables.
--              Implements zero-trust isolation:
--              - Strict user data partition via auth.uid()
--              - Immutable official grading results (students cannot edit scores)
--              - Public read access for curriculum catalog and resources
-- AUTHOR: BackendAgent / Orchestrator
-- ============================================================================

-- 1. Helper security functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_evaluator_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid()) AND role IN ('evaluator', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Enable RLS on all 8 application tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. PROFILES POLICIES
-- ============================================================================
-- Anyone authenticated can view user profiles (required for author/peer display)
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
-- Restrict role escalation: non-admin cannot alter their own role
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK (
    (SELECT auth.uid()) = id
    AND (
      -- If user is admin, they can change role, otherwise role must remain unchanged
      role = (SELECT p.role FROM public.profiles p WHERE p.id = (SELECT auth.uid()))
      OR public.is_admin()
    )
  );

-- Profile inserts are handled via on_auth_user_created trigger (SECURITY DEFINER),
-- but allow authenticated user to insert their own profile if missing
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================================================
-- 4. CURRICULUM CATALOG POLICIES (tracks, modules, lessons)
-- ============================================================================
-- Public read access for curriculum (anon and authenticated)
CREATE POLICY "tracks_select_public"
  ON public.tracks
  FOR SELECT
  TO public
  USING (is_active = true OR public.is_admin());

CREATE POLICY "tracks_admin_all"
  ON public.tracks
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "modules_select_public"
  ON public.modules
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "modules_admin_all"
  ON public.modules
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "lessons_select_public"
  ON public.lessons
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "lessons_admin_all"
  ON public.lessons
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 5. LEARNING RESOURCES POLICIES
-- ============================================================================
CREATE POLICY "resources_select_public"
  ON public.learning_resources
  FOR SELECT
  TO public
  USING (is_public = true OR public.is_admin());

CREATE POLICY "resources_admin_all"
  ON public.learning_resources
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 6. LESSON PROGRESS POLICIES (User Data Partition)
-- ============================================================================
-- Users can only view, insert, update, or delete their own progress
CREATE POLICY "lesson_progress_select_own"
  ON public.lesson_progress
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_evaluator_or_admin());

CREATE POLICY "lesson_progress_insert_own"
  ON public.lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "lesson_progress_update_own"
  ON public.lesson_progress
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "lesson_progress_delete_own"
  ON public.lesson_progress
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ============================================================================
-- 7. ASSESSMENTS POLICIES (Spec / Briefs)
-- ============================================================================
CREATE POLICY "assessments_select_public"
  ON public.assessments
  FOR SELECT
  TO public
  USING (is_active = true OR public.is_admin());

CREATE POLICY "assessments_admin_all"
  ON public.assessments
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 8. ASSESSMENT SUBMISSIONS POLICIES (Student Work)
-- ============================================================================
-- Students view their own work; evaluators/admins view all submissions
CREATE POLICY "submissions_select_policy"
  ON public.assessment_submissions
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_evaluator_or_admin());

-- Students insert only their own submissions
CREATE POLICY "submissions_insert_own"
  ON public.assessment_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Students update only their own submissions
CREATE POLICY "submissions_update_own"
  ON public.assessment_submissions
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ============================================================================
-- 9. ASSESSMENT RESULTS POLICIES (Official Dossiers & Grading)
-- MANDATORY SECURITY:
--   - Students can READ their own results
--   - Public can VERIFY valid certificate_ids
--   - Students can NEVER insert or update results!
--   - Evaluators and Admins CAN insert and update results
-- ============================================================================
-- Read policy
CREATE POLICY "results_select_policy"
  ON public.assessment_results
  FOR SELECT
  TO public
  USING (
    -- Public verification by certificate
    (certificate_id IS NOT NULL)
    -- Student viewing own dossier
    OR ((SELECT auth.uid()) = user_id)
    -- Evaluator / Admin viewing
    OR public.is_evaluator_or_admin()
  );

-- INSERT policy: Strictly evaluator or admin only!
CREATE POLICY "results_insert_evaluator_only"
  ON public.assessment_results
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_evaluator_or_admin());

-- UPDATE policy: Strictly evaluator or admin only!
CREATE POLICY "results_update_evaluator_only"
  ON public.assessment_results
  FOR UPDATE
  TO authenticated
  USING (public.is_evaluator_or_admin())
  WITH CHECK (public.is_evaluator_or_admin());

-- DELETE policy: Strictly admin only!
CREATE POLICY "results_delete_admin_only"
  ON public.assessment_results
  FOR DELETE
  TO authenticated
  USING (public.is_admin());
