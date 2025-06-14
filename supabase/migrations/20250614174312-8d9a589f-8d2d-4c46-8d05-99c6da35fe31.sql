
-- Drop all existing RLS policies and disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulances DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_beds DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_assignments DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (this will clean up any remaining policies)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Dispatchers and admins can create emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Dispatchers and admins can update emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Authenticated users can view ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Admins and dispatchers can manage ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Authenticated users can view hospital beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Medical staff can manage beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Anyone can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can delete appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can view ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Anyone can create ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Anyone can update ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Anyone can delete ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Anyone can view emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Anyone can create emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Anyone can update emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Anyone can delete emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Anyone can view hospital_beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Anyone can create hospital_beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Anyone can update hospital_beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Anyone can delete hospital_beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Staff can read emergencies" ON public.emergencies;

-- Grant public access to all tables for anonymous users
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.appointments TO anon;
GRANT ALL ON public.emergencies TO anon;
GRANT ALL ON public.ambulances TO anon;
GRANT ALL ON public.hospital_beds TO anon;
GRANT ALL ON public.medicines TO anon;
GRANT ALL ON public.hospitals TO anon;
GRANT ALL ON public.departments TO anon;
GRANT ALL ON public.routes TO anon;
GRANT ALL ON public.reports TO anon;
GRANT ALL ON public.notifications TO anon;
GRANT ALL ON public.medical_records TO anon;
GRANT ALL ON public.medical_inventory TO anon;
GRANT ALL ON public.emergency_logs TO anon;
GRANT ALL ON public.staff_assignments TO anon;
GRANT ALL ON public.ambulance_assignments TO anon;

-- Grant usage on sequences to allow inserts
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure all existing tables have proper grants
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
