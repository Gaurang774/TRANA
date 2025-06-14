
-- Drop ALL existing policies on all tables to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on each table
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Enable Row Level Security on all tables
ALTER TABLE public.ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_assignments ENABLE ROW LEVEL SECURITY;

-- Create security definer function to prevent infinite recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create comprehensive RLS policies for authenticated users

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Anyone can create profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Emergencies policies
CREATE POLICY "Authenticated users can view emergencies" ON public.emergencies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Medical staff can create emergencies" ON public.emergencies
  FOR INSERT TO authenticated WITH CHECK (
    public.get_current_user_role() IN ('admin', 'doctor', 'ambulance', 'staff')
  );

CREATE POLICY "Medical staff can update emergencies" ON public.emergencies
  FOR UPDATE TO authenticated USING (
    public.get_current_user_role() IN ('admin', 'doctor', 'ambulance', 'staff')
  );

-- Ambulances policies
CREATE POLICY "Authenticated users can view ambulances" ON public.ambulances
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and ambulance staff can manage ambulances" ON public.ambulances
  FOR ALL TO authenticated USING (
    public.get_current_user_role() IN ('admin', 'ambulance', 'staff')
  );

-- Hospital beds policies
CREATE POLICY "Authenticated users can view hospital beds" ON public.hospital_beds
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Medical staff can manage beds" ON public.hospital_beds
  FOR ALL TO authenticated USING (
    public.get_current_user_role() IN ('admin', 'doctor', 'staff')
  );

-- Appointments policies
CREATE POLICY "Users can view appointments" ON public.appointments
  FOR SELECT TO authenticated USING (
    auth.uid()::text = patient_name OR 
    public.get_current_user_role() IN ('admin', 'doctor', 'staff')
  );

CREATE POLICY "Anyone can create appointments" ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Medical staff can update appointments" ON public.appointments
  FOR UPDATE TO authenticated USING (
    public.get_current_user_role() IN ('admin', 'doctor', 'staff')
  );

-- Medicines policies
CREATE POLICY "Authenticated users can view medicines" ON public.medicines
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Medical staff can manage medicines" ON public.medicines
  FOR ALL TO authenticated USING (
    public.get_current_user_role() IN ('admin', 'doctor', 'staff')
  );

-- Medical records policies (most restrictive)
CREATE POLICY "Patients can view their own records" ON public.medical_records
  FOR SELECT TO authenticated USING (
    patient_id = auth.uid() OR
    public.get_current_user_role() IN ('admin', 'doctor')
  );

CREATE POLICY "Doctors can create medical records" ON public.medical_records
  FOR INSERT TO authenticated WITH CHECK (
    public.get_current_user_role() IN ('admin', 'doctor')
  );

CREATE POLICY "Doctors can update medical records" ON public.medical_records
  FOR UPDATE TO authenticated USING (
    doctor_id = auth.uid() OR
    public.get_current_user_role() = 'admin'
  );

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR user_id IS NULL OR
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (
    user_id = auth.uid() OR
    public.get_current_user_role() = 'admin'
  );

-- Other tables - basic authenticated access
CREATE POLICY "Authenticated access" ON public.hospitals FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access" ON public.departments FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access" ON public.routes FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access" ON public.reports FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access" ON public.medical_inventory FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access" ON public.emergency_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access" ON public.staff_assignments FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated access" ON public.ambulance_assignments FOR ALL TO authenticated USING (true);

-- Revoke anonymous access that was previously granted
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- Grant authenticated users access to tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
