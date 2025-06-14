
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTranaAssistant = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [context, setContext] = useState<any>(null);

  // Fetch current system context for the assistant
  const { data: emergenciesData } = useQuery({
    queryKey: ['assistant-context-emergencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergencies')
        .select('*')
        .neq('status', 'completed')
        .neq('status', 'cancelled')
        .limit(5);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: ambulancesData } = useQuery({
    queryKey: ['assistant-context-ambulances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ambulances')
        .select('*');
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000
  });

  const { data: bedsData } = useQuery({
    queryKey: ['assistant-context-beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospital_beds')
        .select('*')
        .eq('status', 'available')
        .limit(10);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000
  });

  // Update context when data changes
  useEffect(() => {
    const newContext = {
      activeEmergencies: emergenciesData?.length || 0,
      availableAmbulances: ambulancesData?.filter(a => a.status === 'available').length || 0,
      availableBeds: bedsData?.length || 0,
      timestamp: new Date().toISOString()
    };
    setContext(newContext);
  }, [emergenciesData, ambulancesData, bedsData]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return {
    isMinimized,
    toggleMinimize,
    context
  };
};
