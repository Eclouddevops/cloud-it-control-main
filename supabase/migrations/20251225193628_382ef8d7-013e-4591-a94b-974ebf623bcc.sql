-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Create a PERMISSIVE policy that allows authenticated users to view their own role
-- This is needed for the has_role() function to work properly
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a PERMISSIVE policy that allows admins to view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));