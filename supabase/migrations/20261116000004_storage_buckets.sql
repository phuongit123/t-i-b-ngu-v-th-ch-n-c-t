-- ============================================================================
-- MIGRATION: 20261116000004_storage_buckets.sql
-- DESCRIPTION: Storage buckets and RLS policies for student submissions and
--              curriculum practice assets.
-- AUTHOR: BackendAgent / Orchestrator
-- ============================================================================

-- 1. Create 'submissions' and 'resources' storage buckets if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'submissions',
    'submissions',
    false,
    52428800, -- 50 MB limit
    ARRAY[
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream' -- Required for native .afdesign, .afphoto, .afpub files
    ]
  ),
  (
    'resources',
    'resources',
    true,
    104857600, -- 100 MB limit for course resources
    NULL -- Open to all document types
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- 2. STORAGE OBJECTS RLS POLICIES
-- ============================================================================
-- Ensure RLS is active on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 'resources' bucket policies
-- ----------------------------------------------------------------------------
-- Public read for all resources
CREATE POLICY "resources_bucket_public_read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'resources');

-- Admin write for resources
CREATE POLICY "resources_bucket_admin_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resources' AND public.is_admin());

CREATE POLICY "resources_bucket_admin_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resources' AND public.is_admin())
  WITH CHECK (bucket_id = 'resources' AND public.is_admin());

CREATE POLICY "resources_bucket_admin_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resources' AND public.is_admin());

-- ----------------------------------------------------------------------------
-- 'submissions' bucket policies
-- Path structure: submissions/{user_id}/{assessment_id}/{filename}
-- ----------------------------------------------------------------------------
-- Upload: Authenticated student can upload only to their own user_id directory
CREATE POLICY "submissions_bucket_student_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Read: Student can read their own submissions; evaluators and admins can read any
CREATE POLICY "submissions_bucket_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (
      (storage.foldername(name))[1] = (SELECT auth.uid())::text
      OR public.is_evaluator_or_admin()
    )
  );

-- Update: Student can update their own files
CREATE POLICY "submissions_bucket_student_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Delete: Student can delete their own files before grading
CREATE POLICY "submissions_bucket_student_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'submissions'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
