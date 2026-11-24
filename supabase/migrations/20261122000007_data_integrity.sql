-- TASK-030–033 / REQ-BE-001–004: restrict account data and preserve evidence.
ALTER FUNCTION public.is_admin() SET search_path = '';
ALTER FUNCTION public.is_evaluator_or_admin() SET search_path = '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, role, career_track)
  VALUES (
    NEW.id, coalesce(NEW.email, ''),
    coalesce(nullif(left(btrim(NEW.raw_user_meta_data->>'display_name'), 100), ''),
             nullif(split_part(coalesce(NEW.email, ''), '@', 1), ''), 'Học viên Affinity'),
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN NEW.raw_app_meta_data->>'role' IN ('admin', 'evaluator')
      THEN NEW.raw_app_meta_data->>'role' ELSE 'student' END,
    coalesce(nullif(left(btrim(NEW.raw_user_meta_data->>'career_track'), 120), ''),
             'Vector & Brand Identity')
  );
  RETURN NEW;
END;
$$;

DROP POLICY profiles_insert_own ON public.profiles;
DROP POLICY profiles_select_authenticated ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
DROP POLICY profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
GRANT SELECT ON public.tracks, public.modules, public.lessons, public.learning_resources, public.assessments
  TO anon, authenticated;
GRANT SELECT ON public.profiles, public.lesson_progress, public.assessment_submissions, public.assessment_results
  TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT UPDATE (display_name, avatar_url, career_track, experience_level, shortcut_modifier, auto_save_progress)
  ON public.profiles TO authenticated;

DROP POLICY results_select_policy ON public.assessment_results;
CREATE POLICY results_select_own ON public.assessment_results FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_evaluator_or_admin());
CREATE FUNCTION public.verify_affinity_certificate(code text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT FROM public.assessment_results AS result
    WHERE result.certificate_id = code AND result.is_passed AND result.certified_at IS NOT NULL
  );
$$;
REVOKE EXECUTE ON FUNCTION public.verify_affinity_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_affinity_certificate(text) TO anon, authenticated;

DROP POLICY submissions_update_own ON public.assessment_submissions;
REVOKE UPDATE, DELETE ON public.assessment_submissions FROM PUBLIC, anon, authenticated;
DROP POLICY submissions_bucket_student_update ON storage.objects;
DROP POLICY submissions_bucket_student_delete ON storage.objects;

ALTER TABLE public.assessment_submissions ADD CONSTRAINT uq_submission_owner UNIQUE (id, user_id);
ALTER TABLE public.assessment_results ADD CONSTRAINT fk_result_submission_owner
  FOREIGN KEY (submission_id, user_id) REFERENCES public.assessment_submissions (id, user_id)
  ON DELETE CASCADE NOT VALID;

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/png','image/jpeg','image/webp','application/pdf','application/zip',
  'application/x-zip-compressed','application/octet-stream','text/markdown','text/x-markdown','text/plain'
]
WHERE id = 'submissions';

-- Reject stale writes atomically during upsert. A completed lesson remains completed on revisit.
CREATE FUNCTION public.preserve_latest_lesson_progress()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.client_updated_at < OLD.client_updated_at THEN
    RETURN NULL;
  END IF;
  IF OLD.status = 'completed' AND NEW.status <> 'completed' THEN
    NEW.status := 'completed';
    NEW.completed_at := OLD.completed_at;
    NEW.quiz_score := OLD.quiz_score;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_lesson_progress_order BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.preserve_latest_lesson_progress();
