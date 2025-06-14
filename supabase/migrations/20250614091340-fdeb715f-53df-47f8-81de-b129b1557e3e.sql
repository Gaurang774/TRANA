
-- Example: restrict based on user roles
CREATE POLICY "Staff can read emergencies" ON public.emergencies 
FOR SELECT USING (auth.jwt() ->> 'role' IN ('dispatcher', 'paramedic', 'admin'));
