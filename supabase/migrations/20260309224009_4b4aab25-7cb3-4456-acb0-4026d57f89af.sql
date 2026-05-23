
-- Fix contact_leads policies: drop RESTRICTIVE, recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can submit contact info" ON public.contact_leads;
DROP POLICY IF EXISTS "Only admins can delete contacts" ON public.contact_leads;
DROP POLICY IF EXISTS "Only admins can update contacts" ON public.contact_leads;
DROP POLICY IF EXISTS "Only admins can view contacts" ON public.contact_leads;

CREATE POLICY "Anyone can submit contact info" ON public.contact_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Only admins can view contacts" ON public.contact_leads FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update contacts" ON public.contact_leads FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete contacts" ON public.contact_leads FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix assessment_submissions policies
DROP POLICY IF EXISTS "Anyone can submit assessments" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Only admins can delete assessments" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Only admins can update assessments" ON public.assessment_submissions;
DROP POLICY IF EXISTS "Only admins can view assessments" ON public.assessment_submissions;

CREATE POLICY "Anyone can submit assessments" ON public.assessment_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Only admins can view assessments" ON public.assessment_submissions FOR SELECT TO public USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update assessments" ON public.assessment_submissions FOR UPDATE TO public USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete assessments" ON public.assessment_submissions FOR DELETE TO public USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix datasheet_leads policies
DROP POLICY IF EXISTS "Anyone can submit lead info" ON public.datasheet_leads;
DROP POLICY IF EXISTS "Only admins can delete leads" ON public.datasheet_leads;
DROP POLICY IF EXISTS "Only admins can update leads" ON public.datasheet_leads;
DROP POLICY IF EXISTS "Only admins can view leads" ON public.datasheet_leads;

CREATE POLICY "Anyone can submit lead info" ON public.datasheet_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Only admins can view leads" ON public.datasheet_leads FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update leads" ON public.datasheet_leads FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete leads" ON public.datasheet_leads FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
