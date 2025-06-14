
-- Update the profiles table role constraint to include all the requested roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'doctor', 'ambulance', 'patient', 'staff', 'dispatcher', 'paramedic', 'nurse'));

-- Update any existing roles that don't match the new constraint
UPDATE public.profiles 
SET role = CASE 
  WHEN role = 'paramedic' THEN 'ambulance'
  WHEN role = 'dispatcher' THEN 'staff'
  WHEN role = 'nurse' THEN 'staff'
  ELSE role
END
WHERE role NOT IN ('admin', 'doctor', 'ambulance', 'patient', 'staff');

-- Create an index on the role column for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Create a function to get user role efficiently
CREATE OR REPLACE FUNCTION public.get_user_role_by_id(user_id uuid)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
