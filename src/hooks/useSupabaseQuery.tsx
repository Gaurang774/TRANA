
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatErrorMessage } from '@/lib/asyncUtils';

export interface UseSupabaseQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchInterval?: number;
}

export interface UseSupabaseMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[][];
}

export function useSupabaseQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: UseSupabaseQueryOptions = {}
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await queryFn();
      if (error) throw error;
      return data;
    },
    enabled: options.enabled,
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    gcTime: options.gcTime ?? 10 * 60 * 1000, // 10 minutes default
    refetchInterval: options.refetchInterval,
  });
}

export function useSupabaseMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<{ data: T | null; error: any }>,
  options: UseSupabaseMutationOptions = {}
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (variables: V) => {
      const { data, error } = await mutationFn(variables);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      const message = formatErrorMessage(error);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      options.onError?.(error);
    },
  });
}

// Specific hooks for common operations
export function useEmergencies(options: UseSupabaseQueryOptions = {}) {
  return useSupabaseQuery(
    ['emergencies'],
    async () => {
      const { data, error } = await supabase.from('emergencies').select('*').neq('status', 'completed');
      return { data, error };
    },
    options
  );
}

export function useAmbulances(options: UseSupabaseQueryOptions = {}) {
  return useSupabaseQuery(
    ['ambulances'],
    async () => {
      const { data, error } = await supabase.from('ambulances').select('*');
      return { data, error };
    },
    options
  );
}

export function useHospitalBeds(options: UseSupabaseQueryOptions = {}) {
  return useSupabaseQuery(
    ['hospital_beds'],
    async () => {
      const { data, error } = await supabase.from('hospital_beds').select('*');
      return { data, error };
    },
    options
  );
}

export function useMedicines(options: UseSupabaseQueryOptions = {}) {
  return useSupabaseQuery(
    ['medicines'],
    async () => {
      const { data, error } = await supabase.from('medicines').select('*').order('name');
      return { data, error };
    },
    options
  );
}

export function useAppointments(options: UseSupabaseQueryOptions = {}) {
  return useSupabaseQuery(
    ['appointments'],
    async () => {
      const { data, error } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: false });
      return { data, error };
    },
    options
  );
}

// Mutation hooks
export function useCreateEmergency() {
  return useSupabaseMutation(
    async (emergency: any) => {
      const { data, error } = await supabase.from('emergencies').insert([emergency]).select().single();
      return { data, error };
    },
    { invalidateQueries: [['emergencies']] }
  );
}

export function useUpdateEmergency() {
  return useSupabaseMutation(
    async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase.from('emergencies').update(updates).eq('id', id).select().single();
      return { data, error };
    },
    { invalidateQueries: [['emergencies']] }
  );
}

export function useCreateAppointment() {
  return useSupabaseMutation(
    async (appointment: any) => {
      const { data, error } = await supabase.rpc('book_appointment', appointment);
      return { data, error };
    },
    { invalidateQueries: [['appointments']] }
  );
}

export function useUpdateAmbulanceLocation() {
  return useSupabaseMutation(
    async ({ ambulanceId, latitude, longitude, address }: { 
      ambulanceId: string; 
      latitude: number; 
      longitude: number; 
      address?: string 
    }) => {
      const { data, error } = await supabase.rpc('update_ambulance_location', {
        p_ambulance_id: ambulanceId,
        p_latitude: latitude,
        p_longitude: longitude,
        p_address: address
      });
      return { data, error };
    },
    { invalidateQueries: [['ambulances']] }
  );
}
