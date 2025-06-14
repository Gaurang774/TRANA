
-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  patient_email TEXT,
  doctor_id UUID REFERENCES public.profiles(id),
  department TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Anyone can view appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete appointments" 
  ON public.appointments 
  FOR DELETE 
  USING (true);

-- Create an index on appointment_date for better query performance
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);

-- Create an index on doctor_id for better query performance
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id);
