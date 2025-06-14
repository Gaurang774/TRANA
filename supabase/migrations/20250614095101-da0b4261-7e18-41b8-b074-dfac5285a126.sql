
-- First, let's check if the profiles table has the required columns for authentication
-- Add missing columns to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update the role column to have proper constraints if needed
DO $$ 
BEGIN
    -- Drop existing role constraint if it exists
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    
    -- Add the new role constraint
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('patient', 'doctor', 'admin', 'nurse', 'dispatcher', 'paramedic'));
    
    -- Set default value for role
    ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'patient';
END $$;

-- Update existing RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can create profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can create profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    COALESCE(new.raw_user_meta_data ->> 'role', 'patient'),
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update existing tables to add better RLS policies
-- Update emergencies table policies
DROP POLICY IF EXISTS "Anyone can view emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Anyone can create emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Anyone can update emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Anyone can delete emergencies" ON public.emergencies;

CREATE POLICY "Authenticated users can view emergencies" 
  ON public.emergencies 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Dispatchers and admins can create emergencies" 
  ON public.emergencies 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'dispatcher', 'doctor')
    )
  );

CREATE POLICY "Dispatchers and admins can update emergencies" 
  ON public.emergencies 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'dispatcher', 'doctor')
    )
  );

-- Update ambulances table policies
DROP POLICY IF EXISTS "Anyone can view ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Anyone can create ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Anyone can update ambulances" ON public.ambulances;
DROP POLICY IF EXISTS "Anyone can delete ambulances" ON public.ambulances;

CREATE POLICY "Authenticated users can view ambulances" 
  ON public.ambulances 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admins and dispatchers can manage ambulances" 
  ON public.ambulances 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'dispatcher')
    )
  );

-- Update hospital_beds table policies
DROP POLICY IF EXISTS "Anyone can view hospital_beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Anyone can create hospital_beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Anyone can update hospital_beds" ON public.hospital_beds;
DROP POLICY IF EXISTS "Anyone can delete hospital_beds" ON public.hospital_beds;

CREATE POLICY "Authenticated users can view hospital beds" 
  ON public.hospital_beds 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Medical staff can manage beds" 
  ON public.hospital_beds 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse')
    )
  );

-- Try to add tables to realtime publication (ignore errors if already added)
DO $$
BEGIN
    -- Add profiles to realtime if not already added
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION 
    WHEN duplicate_object THEN
        NULL; -- Table already in publication, ignore
END $$;

-- Set replica identity for real-time updates
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
