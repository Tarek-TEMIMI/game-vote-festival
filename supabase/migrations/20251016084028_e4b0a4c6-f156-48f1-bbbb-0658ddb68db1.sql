-- Allow super admins to view all users
CREATE POLICY "Super admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (has_app_role(auth.uid(), 'super_admin'));

-- Allow super admins to update all users
CREATE POLICY "Super admins can update all users"
ON public.users
FOR UPDATE
TO authenticated
USING (has_app_role(auth.uid(), 'super_admin'))
WITH CHECK (has_app_role(auth.uid(), 'super_admin'));