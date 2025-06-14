
-- First, update existing emergency records to match new status constraint
UPDATE public.emergencies 
SET status = CASE 
  WHEN status = 'in_progress' THEN 'on_scene'
  WHEN status = 'completed' THEN 'resolved'
  WHEN status = 'active' THEN 'on_scene'
  WHEN status NOT IN ('pending', 'dispatched', 'en_route', 'on_scene', 'resolved', 'cancelled') THEN 'pending'
  ELSE status
END;

-- Update ambulance status values to match new constraint
UPDATE public.ambulances 
SET status = CASE 
  WHEN status = 'at-scene' THEN 'on_scene'
  WHEN status = 'en-route' THEN 'en_route'
  WHEN status NOT IN ('available', 'dispatched', 'en_route', 'on_scene', 'returning', 'maintenance', 'out_of_service') THEN 'available'
  ELSE status
END;

-- Drop existing conflicting policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table (extends auth.users) - only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE NOT NULL,
          first_name TEXT,
          last_name TEXT,
          phone TEXT,
          role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'patient', 'dispatcher', 'paramedic')),
          department TEXT,
          specialty TEXT,
          license_number TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Create hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  coordinates JSONB, -- {lat: number, lng: number}
  total_beds INTEGER DEFAULT 0,
  available_beds INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  head_doctor_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing emergencies table to add missing columns
ALTER TABLE public.emergencies 
ADD COLUMN IF NOT EXISTS emergency_number TEXT,
ADD COLUMN IF NOT EXISTS caller_name TEXT,
ADD COLUMN IF NOT EXISTS caller_phone TEXT,
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_age INTEGER,
ADD COLUMN IF NOT EXISTS patient_gender TEXT,
ADD COLUMN IF NOT EXISTS coordinates JSONB,
ADD COLUMN IF NOT EXISTS assigned_ambulance_id UUID,
ADD COLUMN IF NOT EXISTS assigned_hospital_id UUID,
ADD COLUMN IF NOT EXISTS dispatcher_id UUID,
ADD COLUMN IF NOT EXISTS estimated_arrival TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS actual_arrival TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Add constraints to emergencies if they don't exist
DO $$ 
BEGIN
    -- Add unique constraint for emergency_number if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'emergencies_emergency_number_key') THEN
        ALTER TABLE public.emergencies ADD CONSTRAINT emergencies_emergency_number_key UNIQUE (emergency_number);
    END IF;
    
    -- Update status constraint (now that data is cleaned)
    ALTER TABLE public.emergencies DROP CONSTRAINT IF EXISTS emergencies_status_check;
    ALTER TABLE public.emergencies ADD CONSTRAINT emergencies_status_check 
    CHECK (status IN ('pending', 'dispatched', 'en_route', 'on_scene', 'resolved', 'cancelled'));
    
    -- Add gender constraint
    ALTER TABLE public.emergencies DROP CONSTRAINT IF EXISTS emergencies_patient_gender_check;
    ALTER TABLE public.emergencies ADD CONSTRAINT emergencies_patient_gender_check 
    CHECK (patient_gender IN ('male', 'female', 'other'));
END $$;

-- Update existing ambulances table
ALTER TABLE public.ambulances 
ADD COLUMN IF NOT EXISTS license_plate TEXT,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS base_station TEXT,
ADD COLUMN IF NOT EXISTS crew_size INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS driver_id UUID,
ADD COLUMN IF NOT EXISTS paramedic_id UUID,
ADD COLUMN IF NOT EXISTS next_maintenance_date DATE,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Add constraints to ambulances
DO $$ 
BEGIN
    -- Update ambulance status constraint (now that data is cleaned)
    ALTER TABLE public.ambulances DROP CONSTRAINT IF EXISTS ambulances_status_check;
    ALTER TABLE public.ambulances ADD CONSTRAINT ambulances_status_check 
    CHECK (status IN ('available', 'dispatched', 'en_route', 'on_scene', 'returning', 'maintenance', 'out_of_service'));
    
    ALTER TABLE public.ambulances DROP CONSTRAINT IF EXISTS ambulances_type_check;
    ALTER TABLE public.ambulances ADD CONSTRAINT ambulances_type_check 
    CHECK (type IN ('basic', 'advanced', 'critical_care'));
    
    ALTER TABLE public.ambulances DROP CONSTRAINT IF EXISTS ambulances_fuel_level_check;
    ALTER TABLE public.ambulances ADD CONSTRAINT ambulances_fuel_level_check 
    CHECK (fuel_level >= 0 AND fuel_level <= 100);
END $$;

-- Update existing hospital_beds table
ALTER TABLE public.hospital_beds 
ADD COLUMN IF NOT EXISTS hospital_id UUID,
ADD COLUMN IF NOT EXISTS department_id UUID,
ADD COLUMN IF NOT EXISTS floor_number INTEGER,
ADD COLUMN IF NOT EXISTS daily_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Add foreign key constraints to hospital_beds if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hospital_beds_hospital_id_fkey') THEN
        ALTER TABLE public.hospital_beds ADD CONSTRAINT hospital_beds_hospital_id_fkey 
        FOREIGN KEY (hospital_id) REFERENCES public.hospitals(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'hospital_beds_department_id_fkey') THEN
        ALTER TABLE public.hospital_beds ADD CONSTRAINT hospital_beds_department_id_fkey 
        FOREIGN KEY (department_id) REFERENCES public.departments(id);
    END IF;
END $$;

-- Update existing appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS appointment_number TEXT,
ADD COLUMN IF NOT EXISTS hospital_id UUID,
ADD COLUMN IF NOT EXISTS department_id UUID,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'consultation',
ADD COLUMN IF NOT EXISTS symptoms TEXT,
ADD COLUMN IF NOT EXISTS diagnosis TEXT,
ADD COLUMN IF NOT EXISTS prescription TEXT,
ADD COLUMN IF NOT EXISTS fees DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Add constraints to appointments
DO $$ 
BEGIN
    ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_type_check;
    ALTER TABLE public.appointments ADD CONSTRAINT appointments_type_check 
    CHECK (type IN ('consultation', 'follow_up', 'surgery', 'emergency', 'screening'));
    
    ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_payment_status_check;
    ALTER TABLE public.appointments ADD CONSTRAINT appointments_payment_status_check 
    CHECK (payment_status IN ('pending', 'paid', 'refunded'));
END $$;

-- Create new tables that don't exist
CREATE TABLE IF NOT EXISTS public.ambulance_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambulance_id UUID REFERENCES public.ambulances(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('driver', 'paramedic', 'emt', 'supervisor')),
  shift_start TIMESTAMP WITH TIME ZONE NOT NULL,
  shift_end TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.profiles(id),
  hospital_id UUID REFERENCES public.hospitals(id),
  record_type TEXT CHECK (record_type IN ('consultation', 'emergency', 'surgery', 'lab_result', 'imaging')),
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT,
  lab_results JSONB,
  vitals JSONB, -- {temperature: number, blood_pressure: string, heart_rate: number}
  allergies TEXT[],
  visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  follow_up_date DATE,
  notes TEXT,
  attachments TEXT[], -- file URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('emergency', 'appointment', 'system', 'reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role() = 'admin');

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.get_user_role() = 'admin');

-- Create RLS policies for hospitals (public read, admin write)
CREATE POLICY "Anyone can view hospitals" ON public.hospitals
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage hospitals" ON public.hospitals
  FOR ALL USING (public.get_user_role() = 'admin');

-- Create RLS policies for departments
CREATE POLICY "Anyone can view departments" ON public.departments
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (public.get_user_role() = 'admin');

-- Create RLS policies for medical records
CREATE POLICY "Patients can view their records" ON public.medical_records
  FOR SELECT USING (patient_id = auth.uid() OR doctor_id = auth.uid() OR public.get_user_role() = 'admin');

CREATE POLICY "Doctors can create records" ON public.medical_records
  FOR INSERT WITH CHECK (public.get_user_role() IN ('doctor', 'admin'));

CREATE POLICY "Doctors can update records" ON public.medical_records
  FOR UPDATE USING (doctor_id = auth.uid() OR public.get_user_role() = 'admin');

-- Create RLS policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emergencies_emergency_number ON public.emergencies(emergency_number);
CREATE INDEX IF NOT EXISTS idx_ambulances_license_plate ON public.ambulances(license_plate);
CREATE INDEX IF NOT EXISTS idx_hospital_beds_hospital ON public.hospital_beds(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_number ON public.appointments(appointment_number);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- Create functions for business logic
CREATE OR REPLACE FUNCTION public.book_appointment(
  p_patient_id UUID,
  p_doctor_id UUID,
  p_hospital_id UUID,
  p_department_id UUID,
  p_appointment_date DATE,
  p_appointment_time TIME,
  p_symptoms TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  appointment_id UUID;
  appointment_num TEXT;
BEGIN
  -- Generate appointment number
  appointment_num := 'APT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  
  -- Insert appointment
  INSERT INTO public.appointments (
    appointment_number, patient_name, doctor_id, hospital_id, department_id,
    appointment_date, appointment_time, symptoms, status
  ) VALUES (
    appointment_num, (SELECT first_name || ' ' || last_name FROM public.profiles WHERE id = p_patient_id), 
    p_doctor_id, p_hospital_id, p_department_id,
    p_appointment_date, p_appointment_time, p_symptoms, 'scheduled'
  ) RETURNING id INTO appointment_id;
  
  RETURN appointment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.assign_ambulance(
  p_emergency_id UUID,
  p_ambulance_id UUID,
  p_dispatcher_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Update emergency with ambulance assignment
  UPDATE public.emergencies 
  SET 
    assigned_ambulance_id = p_ambulance_id,
    dispatcher_id = p_dispatcher_id,
    status = 'dispatched',
    updated_at = NOW()
  WHERE id = p_emergency_id;
  
  -- Update ambulance status
  UPDATE public.ambulances 
  SET 
    status = 'dispatched',
    updated_at = NOW()
  WHERE id = p_ambulance_id;
  
  -- Log the assignment
  INSERT INTO public.emergency_logs (emergency_id, user_id, action, description)
  VALUES (p_emergency_id, p_dispatcher_id, 'ambulance_assigned', 'Ambulance assigned to emergency');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_ambulance_location(
  p_ambulance_id UUID,
  p_latitude DECIMAL,
  p_longitude DECIMAL,
  p_address TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.ambulances 
  SET 
    current_location = jsonb_build_object(
      'lat', p_latitude,
      'lng', p_longitude,
      'address', COALESCE(p_address, ''),
      'updated_at', NOW()
    ),
    updated_at = NOW()
  WHERE id = p_ambulance_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for ambulance tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.ambulances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergencies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hospital_beds;

-- Set replica identity for realtime
ALTER TABLE public.ambulances REPLICA IDENTITY FULL;
ALTER TABLE public.emergencies REPLICA IDENTITY FULL;
ALTER TABLE public.hospital_beds REPLICA IDENTITY FULL;

-- Insert sample data for hospitals
INSERT INTO public.hospitals (name, address, phone, coordinates, total_beds, available_beds) VALUES
('City General Hospital', '123 Main St, Downtown', '+1-555-0101', '{"lat": 40.7128, "lng": -74.0060}', 200, 45),
('St. Mary Medical Center', '456 Oak Ave, Midtown', '+1-555-0102', '{"lat": 40.7589, "lng": -73.9851}', 150, 32),
('Metro Emergency Hospital', '789 Pine St, Uptown', '+1-555-0103', '{"lat": 40.7831, "lng": -73.9712}', 100, 28)
ON CONFLICT DO NOTHING;
