-- Drop existing restrictive insert policy
DROP POLICY IF EXISTS "Anyone can submit contact info" ON public.contact_leads;

-- Create a PERMISSIVE policy for anonymous inserts
CREATE POLICY "Anyone can submit contact info" 
ON public.contact_leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also fix the datasheet_leads table
DROP POLICY IF EXISTS "Anyone can submit lead info" ON public.datasheet_leads;

CREATE POLICY "Anyone can submit lead info" 
ON public.datasheet_leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);