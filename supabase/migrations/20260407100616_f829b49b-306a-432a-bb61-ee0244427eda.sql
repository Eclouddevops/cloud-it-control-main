
-- =============================================================
-- 1. Media bucket: restrict INSERT / UPDATE / DELETE to admins
-- =============================================================

CREATE POLICY "Only admins can upload to media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Only admins can update media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Only admins can delete media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'media'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- =============================================================
-- 2. contact_leads: scope SELECT/UPDATE/DELETE to authenticated
-- =============================================================

DROP POLICY IF EXISTS "Only admins can view contacts" ON public.contact_leads;
CREATE POLICY "Only admins can view contacts"
ON public.contact_leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can update contacts" ON public.contact_leads;
CREATE POLICY "Only admins can update contacts"
ON public.contact_leads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can delete contacts" ON public.contact_leads;
CREATE POLICY "Only admins can delete contacts"
ON public.contact_leads
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =============================================================
-- 3. assessment_submissions: scope SELECT/UPDATE/DELETE to authenticated
-- =============================================================

DROP POLICY IF EXISTS "Only admins can view assessments" ON public.assessment_submissions;
CREATE POLICY "Only admins can view assessments"
ON public.assessment_submissions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can update assessments" ON public.assessment_submissions;
CREATE POLICY "Only admins can update assessments"
ON public.assessment_submissions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can delete assessments" ON public.assessment_submissions;
CREATE POLICY "Only admins can delete assessments"
ON public.assessment_submissions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- =============================================================
-- 4. user_roles: explicit INSERT restriction (defense in depth)
--    The existing ALL policy already blocks non-admins, but an
--    explicit INSERT policy makes intent clear and prevents
--    accidental bypass if the ALL policy is ever modified.
-- =============================================================

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
