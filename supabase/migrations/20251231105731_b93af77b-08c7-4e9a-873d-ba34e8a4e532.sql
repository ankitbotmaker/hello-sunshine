-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all purchases
CREATE POLICY "Admins can view all purchases"
ON public.purchases
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update purchases
CREATE POLICY "Admins can update purchases"
ON public.purchases
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));