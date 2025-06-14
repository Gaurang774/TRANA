
CREATE OR REPLACE FUNCTION public.assign_ambulance(
    p_emergency_id uuid,
    p_ambulance_id uuid,
    p_dispatcher_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    -- Check if emergency exists and is in a valid state for assignment
    IF NOT EXISTS (
        SELECT 1 FROM public.emergencies 
        WHERE id = p_emergency_id 
        AND status IN ('pending', 'dispatched')
    ) THEN
        RAISE EXCEPTION 'Emergency not found or not in a valid state for ambulance assignment';
    END IF;
    
    -- Check if ambulance exists and is available
    IF NOT EXISTS (
        SELECT 1 FROM public.ambulances 
        WHERE id = p_ambulance_id 
        AND status = 'available'
    ) THEN
        RAISE EXCEPTION 'Ambulance not found or not available for assignment';
    END IF;
    
    -- Update emergency with ambulance assignment
    UPDATE public.emergencies 
    SET 
        assigned_ambulance_id = p_ambulance_id,
        assigned_to = p_dispatcher_id,
        status = 'dispatched',
        updated_at = NOW()
    WHERE id = p_emergency_id;
    
    -- Update ambulance status to dispatched
    UPDATE public.ambulances 
    SET 
        status = 'dispatched',
        assigned_emergency_id = p_emergency_id,
        updated_at = NOW()
    WHERE id = p_ambulance_id;
    
    -- Log the assignment in emergency_logs
    INSERT INTO public.emergency_logs (
        emergency_id, 
        user_id, 
        action, 
        description,
        data
    ) VALUES (
        p_emergency_id, 
        p_dispatcher_id, 
        'ambulance_assigned', 
        'Ambulance assigned to emergency',
        jsonb_build_object(
            'ambulance_id', p_ambulance_id,
            'dispatcher_id', p_dispatcher_id,
            'timestamp', NOW()
        )
    );
    
    RETURN TRUE;
END;
$$;
