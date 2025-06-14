
-- Fix All Supabase Security Warnings - Function Search Path Only
-- This version only addresses the function search path security issues

-- 1. Fix Function Search Path Security Issues - Using specific function signatures

-- Fix get_user_role_by_id function
ALTER FUNCTION public.get_user_role_by_id(uuid) SET search_path = '';

-- Fix both book_appointment function overloads
ALTER FUNCTION public.book_appointment(uuid, uuid, uuid, uuid, date, time, text) SET search_path = '';
ALTER FUNCTION public.book_appointment(text, text, date, time, text, text, uuid, text) SET search_path = '';

-- Fix update_ambulance_location function
ALTER FUNCTION public.update_ambulance_location(uuid, numeric, numeric, text) SET search_path = '';

-- Fix get_current_user_role function
ALTER FUNCTION public.get_current_user_role() SET search_path = '';

-- Fix get_user_role function
ALTER FUNCTION public.get_user_role() SET search_path = '';

-- Fix add_medicine function
ALTER FUNCTION public.add_medicine(text, text, text, text, text, text, text, text, boolean, text, text[], text, text) SET search_path = '';

-- Fix assign_ambulance function
ALTER FUNCTION public.assign_ambulance(uuid, uuid, uuid) SET search_path = '';

-- Fix has_role function if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
        ALTER FUNCTION public.has_role(uuid, text) SET search_path = '';
    END IF;
END $$;

-- Verify Function Changes (Run this to check if fixes worked)
SELECT 
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    array_to_string(p.proconfig, ', ') as config_settings,
    CASE 
        WHEN array_to_string(p.proconfig, ', ') LIKE '%search_path%' 
        THEN 'FIXED' 
        ELSE 'NEEDS ATTENTION' 
    END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname IN (
    'get_user_role_by_id', 
    'book_appointment', 
    'update_ambulance_location', 
    'get_current_user_role',
    'get_user_role',
    'add_medicine',
    'assign_ambulance',
    'has_role'
)
ORDER BY p.proname, pg_get_function_identity_arguments(p.oid);
