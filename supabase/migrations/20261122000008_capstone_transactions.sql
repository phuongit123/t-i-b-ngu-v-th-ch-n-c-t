-- TASK-081 / REQ-LEARN-003: submit and grade one immutable Lumina version at a time.
UPDATE public.assessments SET
  title_vi = 'Chiến dịch ra mắt Lumina Artisanal Roastery',
  scenario_overview = 'Thiết kế nhận diện, bao bì và poster cho dòng cà phê cold brew Lumina.',
  starter_assets = '[]'::jsonb,
  rubric_spec = '[
    {"id":"brief_interpretation","weight":15,"critical":true},
    {"id":"visual_communication","weight":15,"critical":false},
    {"id":"tool_selection","weight":20,"critical":true},
    {"id":"non_destructive","weight":15,"critical":true},
    {"id":"iteration_critique","weight":15,"critical":true},
    {"id":"production_readiness","weight":10,"critical":true},
    {"id":"independent_transfer","weight":10,"critical":false}
  ]'::jsonb
WHERE id = 'capstone-a5-lumina';

CREATE FUNCTION public.submit_lumina_capstone(files jsonb, self_review jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  owner_id uuid := auth.uid();
  file_key text;
  object_name text;
  result_id uuid;
BEGIN
  IF owner_id IS NULL OR NOT EXISTS (SELECT FROM public.profiles WHERE id = owner_id) THEN
    RAISE EXCEPTION 'Active learner profile required' USING ERRCODE = '42501';
  END IF;
  IF jsonb_typeof(files) IS DISTINCT FROM 'object' OR jsonb_typeof(self_review) IS DISTINCT FROM 'object'
      OR length(files::text) + length(self_review::text) > 65536 THEN
    RAISE EXCEPTION 'Invalid submission metadata' USING ERRCODE = '22023';
  END IF;
  FOREACH file_key IN ARRAY ARRAY['briefDeconstructionUrl', 'iterationLogUrl', 'vectorSourcePath',
                                    'pixelSourcePath', 'printPdfPath', 'digitalWebpPath'] LOOP
    object_name := files->>file_key;
    IF object_name IS NULL OR split_part(object_name, '/', 1) <> owner_id::text
       OR split_part(object_name, '/', 2) <> 'capstone-a5-lumina'
       OR NOT EXISTS (SELECT FROM storage.objects WHERE bucket_id = 'submissions' AND name = object_name) THEN
      RAISE EXCEPTION 'Required evidence missing: %', file_key USING ERRCODE = '22023';
    END IF;
  END LOOP;

  PERFORM pg_advisory_xact_lock(hashtextextended(owner_id::text || ':capstone-a5-lumina', 0));
  SELECT id INTO result_id FROM public.assessment_submissions
  WHERE user_id = owner_id AND assessment_id = 'capstone-a5-lumina'
    AND artifacts_json = files AND self_assessment_json - 'submittedAt' = self_review - 'submittedAt'
  ORDER BY version DESC LIMIT 1;
  IF result_id IS NOT NULL THEN
    RETURN result_id;
  END IF;
  INSERT INTO public.assessment_submissions (user_id, assessment_id, version, artifacts_json, self_assessment_json)
  SELECT owner_id, 'capstone-a5-lumina', coalesce(max(version), 0) + 1, files, self_review
  FROM public.assessment_submissions
  WHERE user_id = owner_id AND assessment_id = 'capstone-a5-lumina'
  RETURNING id INTO result_id;
  RETURN result_id;
END;
$$;

CREATE FUNCTION public.evaluate_lumina_capstone(submission uuid, levels jsonb, feedback jsonb, notes text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  reviewer uuid := auth.uid();
  learner uuid;
  reviewer_name text;
  dimensions jsonb;
  dimension jsonb;
  grade text;
  weighted numeric := 0;
  critical_failures jsonb := '[]'::jsonb;
  passed boolean;
  result_id uuid;
BEGIN
  IF NOT public.is_evaluator_or_admin() THEN
    RAISE EXCEPTION 'Evaluator required' USING ERRCODE = '42501';
  END IF;
  SELECT user_id INTO STRICT learner FROM public.assessment_submissions
    WHERE id = submission AND assessment_id = 'capstone-a5-lumina';
  IF learner = reviewer THEN
    RAISE EXCEPTION 'Independent evaluator required' USING ERRCODE = '42501';
  END IF;
  IF jsonb_typeof(levels) IS DISTINCT FROM 'object' OR jsonb_typeof(feedback) IS DISTINCT FROM 'object'
      OR length(levels::text) + length(feedback::text) + length(coalesce(notes, '')) > 65536 THEN
    RAISE EXCEPTION 'Invalid grade' USING ERRCODE = '22023';
  END IF;
  SELECT rubric_spec INTO STRICT dimensions FROM public.assessments WHERE id = 'capstone-a5-lumina';
  FOR dimension IN SELECT value FROM jsonb_array_elements(dimensions) LOOP
    grade := levels->>(dimension->>'id');
    IF grade IS NULL OR grade !~ '^[1-4]$' THEN
      RAISE EXCEPTION 'Invalid rubric level' USING ERRCODE = '22023';
    END IF;
    weighted := weighted + (dimension->>'weight')::numeric * grade::integer / 4;
    IF (dimension->>'critical')::boolean AND grade::integer < 3 THEN
      critical_failures := critical_failures || jsonb_build_array(dimension->>'id');
    END IF;
  END LOOP;
  passed := weighted >= 75 AND jsonb_array_length(critical_failures) = 0;
  SELECT display_name INTO STRICT reviewer_name FROM public.profiles WHERE id = reviewer;
  INSERT INTO public.assessment_results
    (submission_id, user_id, evaluator_id, evaluator_name, total_weighted_score, is_passed,
     official_scores_json, evaluator_notes, certificate_id, certified_at)
  VALUES
    (submission, learner, reviewer, reviewer_name, weighted, passed,
     jsonb_build_object('scores', levels, 'feedback', feedback, 'criticalFailures', critical_failures),
     notes, CASE WHEN passed THEN 'AFFINITY-A5-' || gen_random_uuid()::text END, CASE WHEN passed THEN now() END)
  RETURNING id INTO result_id;
  RETURN result_id;
END;
$$;

DROP POLICY submissions_insert_own ON public.assessment_submissions;
REVOKE INSERT ON public.assessment_submissions FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.assessment_results FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.submit_lumina_capstone(jsonb, jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.evaluate_lumina_capstone(uuid, jsonb, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_lumina_capstone(jsonb, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.evaluate_lumina_capstone(uuid, jsonb, jsonb, text) TO authenticated;
