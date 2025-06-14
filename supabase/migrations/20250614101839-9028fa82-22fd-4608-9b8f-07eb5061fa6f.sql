
CREATE OR REPLACE FUNCTION public.book_appointment(
    p_patient_name text,
    p_department text,
    p_appointment_date date,
    p_appointment_time time,
    p_patient_phone text DEFAULT NULL,
    p_patient_email text DEFAULT NULL,
    p_doctor_id uuid DEFAULT NULL,
    p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
    appointment_id uuid;
    appointment_number text;
BEGIN
    -- Generate a unique appointment number
    appointment_number := 'APT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    
    -- Validate appointment date is not in the past
    IF p_appointment_date < CURRENT_DATE THEN
        RAISE EXCEPTION 'Appointment date cannot be in the past';
    END IF;
    
    -- Validate appointment time for today
    IF p_appointment_date = CURRENT_DATE AND p_appointment_time <= CURRENT_TIME THEN
        RAISE EXCEPTION 'Appointment time must be in the future for today';
    END IF;
    
    -- Insert the appointment
    INSERT INTO public.appointments (
        appointment_number,
        patient_name,
        patient_phone,
        patient_email,
        doctor_id,
        department,
        appointment_date,
        appointment_time,
        status,
        notes,
        created_at,
        updated_at
    ) VALUES (
        appointment_number,
        p_patient_name,
        p_patient_phone,
        p_patient_email,
        p_doctor_id,
        p_department,
        p_appointment_date,
        p_appointment_time,
        'scheduled',
        p_notes,
        NOW(),
        NOW()
    ) RETURNING id INTO appointment_id;
    
    RETURN appointment_id;
END;
$$;
