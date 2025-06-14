
-- First, let's add the missing columns to the emergencies table to match the comprehensive schema
ALTER TABLE public.emergencies 
ADD COLUMN IF NOT EXISTS emergency_number TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS caller_name TEXT,
ADD COLUMN IF NOT EXISTS caller_phone TEXT,
ADD COLUMN IF NOT EXISTS responding_unit TEXT,
ADD COLUMN IF NOT EXISTS eta_minutes INTEGER,
ADD COLUMN IF NOT EXISTS coordinates JSONB,
ADD COLUMN IF NOT EXISTS reported_by UUID REFERENCES auth.users(id);

-- Add unique constraint for emergency_number if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'emergencies_emergency_number_key') THEN
        ALTER TABLE public.emergencies ADD CONSTRAINT emergencies_emergency_number_key UNIQUE (emergency_number);
    END IF;
END $$;

-- Update the status values to match the comprehensive schema
ALTER TABLE public.emergencies DROP CONSTRAINT IF EXISTS emergencies_status_check;
ALTER TABLE public.emergencies ADD CONSTRAINT emergencies_status_check 
CHECK (status IN ('pending', 'dispatched', 'in_progress', 'completed', 'cancelled', 'active', 'en_route', 'on_scene', 'resolved'));

-- Add missing columns to ambulances table
ALTER TABLE public.ambulances 
ADD COLUMN IF NOT EXISTS equipment_status JSONB,
ADD COLUMN IF NOT EXISTS fuel_level INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS mileage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_maintenance DATE;

-- Update ambulance status constraint
ALTER TABLE public.ambulances DROP CONSTRAINT IF EXISTS ambulances_status_check;
ALTER TABLE public.ambulances ADD CONSTRAINT ambulances_status_check 
CHECK (status IN ('available', 'dispatched', 'en-route', 'at-scene', 'returning', 'maintenance', 'en_route', 'on_scene', 'out_of_service'));

-- Add missing columns to hospital_beds table
ALTER TABLE public.hospital_beds 
ADD COLUMN IF NOT EXISTS ward TEXT,
ADD COLUMN IF NOT EXISTS room_number TEXT,
ADD COLUMN IF NOT EXISTS bed_type TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS admission_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS estimated_discharge DATE,
ADD COLUMN IF NOT EXISTS equipment JSONB;

-- Update hospital_beds status constraint
ALTER TABLE public.hospital_beds DROP CONSTRAINT IF EXISTS hospital_beds_status_check;
ALTER TABLE public.hospital_beds ADD CONSTRAINT hospital_beds_status_check 
CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance'));

-- Add bed_type constraint
ALTER TABLE public.hospital_beds DROP CONSTRAINT IF EXISTS hospital_beds_bed_type_check;
ALTER TABLE public.hospital_beds ADD CONSTRAINT hospital_beds_bed_type_check 
CHECK (bed_type IN ('general', 'icu', 'emergency', 'surgery', 'pediatric', 'maternity'));

-- Create other missing tables if they don't exist
CREATE TABLE IF NOT EXISTS public.medical_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  sku TEXT UNIQUE,
  description TEXT,
  quantity_available INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  unit_type TEXT DEFAULT 'pieces',
  location TEXT,
  expiry_date DATE,
  supplier TEXT,
  cost_per_unit DECIMAL(10,2),
  reorder_level INTEGER DEFAULT 10,
  is_critical BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.staff_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES public.profiles(id) NOT NULL,
  emergency_id UUID REFERENCES public.emergencies(id),
  ambulance_id UUID REFERENCES public.ambulances(id),
  assignment_type TEXT NOT NULL CHECK (assignment_type IN ('emergency_response', 'ambulance_crew', 'dispatcher', 'supervisor')),
  role TEXT NOT NULL,
  shift_start TIMESTAMP WITH TIME ZONE,
  shift_end TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'active', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.emergency_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  emergency_id UUID REFERENCES public.emergencies(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data JSONB
);

-- Enable RLS on new tables
ALTER TABLE public.medical_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Public read access for medical_inventory" ON public.medical_inventory FOR SELECT USING (true);
CREATE POLICY "Public insert access for medical_inventory" ON public.medical_inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for medical_inventory" ON public.medical_inventory FOR UPDATE USING (true);
CREATE POLICY "Public delete access for medical_inventory" ON public.medical_inventory FOR DELETE USING (true);

CREATE POLICY "Public read access for staff_assignments" ON public.staff_assignments FOR SELECT USING (true);
CREATE POLICY "Public insert access for staff_assignments" ON public.staff_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for staff_assignments" ON public.staff_assignments FOR UPDATE USING (true);
CREATE POLICY "Public delete access for staff_assignments" ON public.staff_assignments FOR DELETE USING (true);

CREATE POLICY "Public read access for emergency_logs" ON public.emergency_logs FOR SELECT USING (true);
CREATE POLICY "Public insert access for emergency_logs" ON public.emergency_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for emergency_logs" ON public.emergency_logs FOR UPDATE USING (true);
CREATE POLICY "Public delete access for emergency_logs" ON public.emergency_logs FOR DELETE USING (true);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON public.emergencies(status);
CREATE INDEX IF NOT EXISTS idx_emergencies_priority ON public.emergencies(priority);
CREATE INDEX IF NOT EXISTS idx_emergencies_created_at ON public.emergencies(created_at);
CREATE INDEX IF NOT EXISTS idx_ambulances_status ON public.ambulances(status);
CREATE INDEX IF NOT EXISTS idx_hospital_beds_status ON public.hospital_beds(status);
CREATE INDEX IF NOT EXISTS idx_hospital_beds_department ON public.hospital_beds(department);
CREATE INDEX IF NOT EXISTS idx_routes_status ON public.routes(status);
CREATE INDEX IF NOT EXISTS idx_emergency_logs_emergency_id ON public.emergency_logs(emergency_id);

-- Insert sample data with correct column names
INSERT INTO public.emergencies (type, priority, status, location, notes) VALUES
('Cardiac Arrest', 'critical', 'dispatched', '1234 Main St, Cityville', 'Elderly patient experiencing chest pain and difficulty breathing'),
('Traffic Accident', 'high', 'in_progress', 'Highway 101, Mile 23', 'Multi-vehicle collision with possible injuries'),
('Fall Injury', 'medium', 'pending', '987 Oak Ave, Townsburg', 'Elderly patient fell down stairs, conscious but unable to move'),
('Allergic Reaction', 'high', 'completed', '456 Pine St, Riverside', 'Severe allergic reaction to medication'),
('Chest Pain', 'critical', 'in_progress', '789 Elm St, Downtown', 'Middle-aged male with severe chest pain')
ON CONFLICT DO NOTHING;

-- Insert sample ambulance data
INSERT INTO public.ambulances (ambulance_number, status, crew_members, equipment_status, fuel_level, mileage) VALUES
('AMB-101', 'available', '{"driver": "John Doe", "paramedic": "Jane Smith", "emt": "Mike Johnson"}', '{"defibrillator": "operational", "oxygen": "full", "stretcher": "operational"}', 85, 45230),
('AMB-102', 'dispatched', '{"driver": "Sarah Wilson", "paramedic": "Tom Brown", "emt": "Lisa Davis"}', '{"defibrillator": "operational", "oxygen": "3/4", "stretcher": "operational"}', 92, 38750),
('AMB-103', 'en-route', '{"driver": "Mark Taylor", "paramedic": "Amy Garcia", "emt": "Chris Lee"}', '{"defibrillator": "operational", "oxygen": "full", "stretcher": "operational"}', 78, 52100),
('AMB-104', 'at-scene', '{"driver": "David Miller", "paramedic": "Jennifer White", "emt": "Kevin Martinez"}', '{"defibrillator": "operational", "oxygen": "1/2", "stretcher": "operational"}', 65, 41800),
('AMB-105', 'returning', '{"driver": "Robert Anderson", "paramedic": "Michelle Thompson", "emt": "Brian Clark"}', '{"defibrillator": "operational", "oxygen": "full", "stretcher": "operational"}', 88, 29500)
ON CONFLICT (ambulance_number) DO NOTHING;

-- Insert sample hospital bed data
INSERT INTO public.hospital_beds (bed_number, department, ward, room_number, bed_type, status, patient_name, admission_date) VALUES
('ICU-001', 'Intensive Care', 'ICU North', '101', 'icu', 'occupied', 'John Anderson', '2024-06-13 08:00:00'),
('ICU-002', 'Intensive Care', 'ICU North', '102', 'icu', 'available', NULL, NULL),
('ICU-003', 'Intensive Care', 'ICU South', '103', 'icu', 'occupied', 'Maria Rodriguez', '2024-06-12 14:30:00'),
('ER-001', 'Emergency', 'Emergency Ward', '201', 'emergency', 'occupied', 'Robert Johnson', '2024-06-14 10:15:00'),
('ER-002', 'Emergency', 'Emergency Ward', '202', 'emergency', 'available', NULL, NULL),
('ER-003', 'Emergency', 'Emergency Ward', '203', 'emergency', 'reserved', NULL, NULL),
('GEN-001', 'General Medicine', 'Ward A', '301', 'general', 'occupied', 'Sarah Davis', '2024-06-11 16:45:00'),
('GEN-002', 'General Medicine', 'Ward A', '302', 'general', 'available', NULL, NULL),
('SUR-001', 'Surgery', 'Surgical Ward', '401', 'surgery', 'maintenance', NULL, NULL),
('PED-001', 'Pediatrics', 'Children Ward', '501', 'pediatric', 'occupied', 'Emma Wilson', '2024-06-13 12:00:00')
ON CONFLICT (bed_number) DO NOTHING;

-- Insert sample medical inventory data
INSERT INTO public.medical_inventory (item_name, category, sku, description, quantity_available, unit_type, location, expiry_date, reorder_level, is_critical) VALUES
('Epinephrine Auto-Injector', 'Emergency Medications', 'MED-001', 'Emergency allergy treatment', 25, 'units', 'Pharmacy - Emergency Stock', '2025-12-31', 10, true),
('Defibrillator Pads', 'Medical Equipment', 'EQP-001', 'AED replacement pads', 50, 'pairs', 'Equipment Storage', '2026-06-30', 15, true),
('Oxygen Mask', 'Respiratory Equipment', 'RES-001', 'Adult oxygen mask with tubing', 75, 'units', 'Ambulance Storage', NULL, 20, true),
('Bandages - Large', 'First Aid', 'FA-001', 'Large sterile bandages', 200, 'units', 'Supply Room A', '2025-08-15', 50, false),
('IV Fluids - Saline', 'IV Supplies', 'IV-001', '1000ml normal saline bags', 100, 'bags', 'IV Storage', '2025-10-20', 25, true),
('Surgical Gloves', 'PPE', 'PPE-001', 'Sterile surgical gloves - Size M', 500, 'pairs', 'PPE Storage', '2025-05-30', 100, false),
('Morphine 10mg', 'Pain Management', 'PAIN-001', 'Injectable morphine for severe pain', 15, 'vials', 'Controlled Substances', '2025-09-15', 5, true),
('Stretcher Sheets', 'General Supplies', 'GEN-001', 'Disposable stretcher sheets', 300, 'sheets', 'Linen Storage', NULL, 75, false)
ON CONFLICT (sku) DO NOTHING;
