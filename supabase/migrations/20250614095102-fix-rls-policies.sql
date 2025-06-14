
-- Fix Row Level Security policies for public access in demo mode
-- This ensures the application works without authentication

-- Update emergencies table policies for public access
DROP POLICY IF EXISTS "Authenticated users can view emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Dispatchers and admins can create emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Dispatchers and admins can update emergencies" ON public.emergencies;

CREATE POLICY "Public can view emergencies" 
  ON public.emergencies 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can create emergencies" 
  ON public.emergencies 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update emergencies" 
  ON public.emergencies 
  FOR UPDATE 
  USING (true);

-- Update ambulances table policies for public access
DROP POLICY IF EXISTS "Authenticated users can view ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Admins and dispatchers can manage ambulances" ON public.ambulances;

CREATE POLICY "Public can view ambulances" 
  ON public.ambulances 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can manage ambulances" 
  ON public.ambulances 
  FOR ALL 
  USING (true);

-- Update hospital_beds table policies for public access
DROP POLICY IF EXISTS "Authenticated users can view hospital beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Medical staff can manage beds" ON public.hospital_beds;

CREATE POLICY "Public can view hospital beds" 
  ON public.hospital_beds 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can manage beds" 
  ON public.hospital_beds 
  FOR ALL 
  USING (true);

-- Update medicines table policies for public access
CREATE POLICY "Public can view medicines" 
  ON public.medicines 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can manage medicines" 
  ON public.medicines 
  FOR ALL 
  USING (true);

-- Update notifications table policies for public access
CREATE POLICY "Public can view notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can manage notifications" 
  ON public.notifications 
  FOR ALL 
  USING (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
