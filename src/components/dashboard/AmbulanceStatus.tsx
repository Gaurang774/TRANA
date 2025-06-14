
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Ambulance, Battery, MapPin, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AmbulanceData {
  id: string;
  ambulance_number: string;
  status: 'available' | 'dispatched' | 'en-route' | 'at-scene' | 'returning' | 'maintenance';
  current_location: any;
  crew_members: any;
  assigned_emergency_id: string | null;
}

const statusColors = {
  'available': 'text-medical-green',
  'dispatched': 'text-medical-blue',
  'en-route': 'text-medical-blue',
  'at-scene': 'text-medical-red',
  'returning': 'text-medical-orange',
  'maintenance': 'text-gray-500',
};

const statusBgColors = {
  'available': 'bg-medical-green/10',
  'dispatched': 'bg-medical-blue/10',
  'en-route': 'bg-medical-blue/10',
  'at-scene': 'bg-medical-red/10',
  'returning': 'bg-medical-orange/10',
  'maintenance': 'bg-gray-500/10',
};

const statusLabels = {
  'available': 'Available',
  'dispatched': 'Dispatched',
  'en-route': 'En Route',
  'at-scene': 'At Scene',
  'returning': 'Returning',
  'maintenance': 'Maintenance',
};

const AmbulanceStatus = () => {
  const { data: ambulances, isLoading, refetch } = useQuery({
    queryKey: ['ambulances-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ambulances')
        .select('*')
        .order('ambulance_number');
      
      if (error) throw error;
      return data as AmbulanceData[];
    }
  });

  const updateAmbulanceStatus = async (id: string, status: AmbulanceData['status']) => {
    try {
      const { error } = await supabase
        .from('ambulances')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Ambulance status updated to ${status}`);
      refetch();
    } catch (error: any) {
      toast.error(`Error updating status: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Ambulance Fleet</h2>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-blue mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-3 lg:p-4 border-b">
        <h2 className="font-semibold text-lg">Ambulance Fleet</h2>
        <p className="text-sm text-gray-500">Status monitoring of emergency vehicles</p>
      </div>
      
      <div className="p-2 lg:p-3 max-h-96 overflow-y-auto">
        {ambulances && ambulances.length > 0 ? (
          ambulances.map((ambulance) => {
            const location = ambulance.current_location?.address || 'Location Unknown';
            const crewCount = ambulance.crew_members?.length || 0;
            
            return (
              <div 
                key={ambulance.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-3 rounded-lg border mb-2 last:mb-0 gap-3"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className={cn(
                    "p-2 rounded-md mr-3 flex-shrink-0",
                    statusBgColors[ambulance.status]
                  )}>
                    <Ambulance className={cn(
                      "h-4 w-4 lg:h-5 lg:w-5", 
                      statusColors[ambulance.status]
                    )} />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm lg:text-base">{ambulance.ambulance_number}</h3>
                      <Badge className={cn(
                        "text-xs",
                        statusBgColors[ambulance.status],
                        statusColors[ambulance.status]
                      )}>
                        {statusLabels[ambulance.status]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-xs lg:text-sm text-gray-500 mb-1">
                      <MapPin className="h-3 lg:h-3.5 w-3 lg:w-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Crew: {crewCount} member{crewCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                  <div className="flex items-center">
                    <Battery className="h-4 w-4 mr-1 text-medical-green" />
                    <span className="text-xs font-medium text-medical-green">
                      85%
                    </span>
                  </div>
                  
                  <select 
                    value={ambulance.status}
                    onChange={(e) => updateAmbulanceStatus(ambulance.id, e.target.value as AmbulanceData['status'])}
                    className="text-xs border rounded px-2 py-1 bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="en-route">En Route</option>
                    <option value="at-scene">At Scene</option>
                    <option value="returning">Returning</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <Ambulance className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-600">No Ambulances</h3>
            <p className="text-gray-500 mt-1">No ambulances registered in the system</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceStatus;
