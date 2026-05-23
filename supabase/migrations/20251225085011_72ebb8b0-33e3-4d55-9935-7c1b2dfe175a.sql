-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Create a permissive SELECT policy that only allows admins to view roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));