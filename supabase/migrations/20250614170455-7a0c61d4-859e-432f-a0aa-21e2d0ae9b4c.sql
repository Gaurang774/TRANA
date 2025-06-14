
-- Create function to add a new medicine to the database
CREATE OR REPLACE FUNCTION public.add_medicine(
    p_name text,
    p_generic_name text DEFAULT NULL,
    p_description text DEFAULT NULL,
    p_uses text DEFAULT NULL,
    p_dosage text DEFAULT NULL,
    p_side_effects text DEFAULT NULL,
    p_warnings text DEFAULT NULL,
    p_drug_class text DEFAULT NULL,
    p_prescription_required boolean DEFAULT true,
    p_active_ingredients text DEFAULT NULL,
    p_brand_names text[] DEFAULT NULL,
    p_interactions text DEFAULT NULL,
    p_manufacturer text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
    medicine_id uuid;
BEGIN
    -- Validate required fields
    IF p_name IS NULL OR trim(p_name) = '' THEN
        RAISE EXCEPTION 'Medicine name is required and cannot be empty';
    END IF;
    
    -- Check if medicine with same name already exists
    IF EXISTS (
        SELECT 1 FROM public.medicines 
        WHERE LOWER(name) = LOWER(trim(p_name))
    ) THEN
        RAISE EXCEPTION 'Medicine with name "%" already exists', trim(p_name);
    END IF;
    
    -- Insert the new medicine
    INSERT INTO public.medicines (
        name,
        generic_name,
        description,
        uses,
        dosage,
        side_effects,
        warnings,
        drug_class,
        prescription_required,
        active_ingredients,
        brand_names,
        interactions,
        manufacturer,
        created_at,
        updated_at
    ) VALUES (
        trim(p_name),
        CASE WHEN trim(p_generic_name) = '' THEN NULL ELSE trim(p_generic_name) END,
        CASE WHEN trim(p_description) = '' THEN NULL ELSE trim(p_description) END,
        CASE WHEN trim(p_uses) = '' THEN NULL ELSE trim(p_uses) END,
        CASE WHEN trim(p_dosage) = '' THEN NULL ELSE trim(p_dosage) END,
        CASE WHEN trim(p_side_effects) = '' THEN NULL ELSE trim(p_side_effects) END,
        CASE WHEN trim(p_warnings) = '' THEN NULL ELSE trim(p_warnings) END,
        CASE WHEN trim(p_drug_class) = '' THEN NULL ELSE trim(p_drug_class) END,
        COALESCE(p_prescription_required, true),
        CASE WHEN trim(p_active_ingredients) = '' THEN NULL ELSE trim(p_active_ingredients) END,
        p_brand_names,
        CASE WHEN trim(p_interactions) = '' THEN NULL ELSE trim(p_interactions) END,
        CASE WHEN trim(p_manufacturer) = '' THEN NULL ELSE trim(p_manufacturer) END,
        NOW(),
        NOW()
    ) RETURNING id INTO medicine_id;
    
    RETURN medicine_id;
END;
$$;

-- Enable RLS on medicines table if not already enabled
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
    -- Drop the INSERT policy if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'medicines' 
        AND policyname = 'Medical staff can add medicines'
    ) THEN
        DROP POLICY "Medical staff can add medicines" ON public.medicines;
    END IF;
    
    -- Drop the SELECT policy if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'medicines' 
        AND policyname = 'Authenticated users can view medicines'
    ) THEN
        DROP POLICY "Authenticated users can view medicines" ON public.medicines;
    END IF;
END $$;

-- Create INSERT policy for medical staff to add medicines
CREATE POLICY "Medical staff can add medicines" 
  ON public.medicines 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'nurse')
    )
  );

-- Create SELECT policy for all authenticated users to view medicines
CREATE POLICY "Authenticated users can view medicines" 
  ON public.medicines 
  FOR SELECT 
  TO authenticated
  USING (true);
