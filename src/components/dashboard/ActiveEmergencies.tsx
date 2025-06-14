
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Emergency {
  id: string;
  type: string;
  location: string;
  created_at: string;
  status: 'pending' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: string | null;
  notes: string | null;
  emergency_number: string | null;
  description: string | null;
  caller_name: string | null;
  caller_phone: string | null;
  responding_unit: string | null;
  eta_minutes: number | null;
}

const statusColors = {
  pending: 'text-medical-yellow',
  dispatched: 'text-medical-blue',
  in_progress: 'text-medical-orange',
  completed: 'text-medical-green',
  cancelled: 'text-gray-500'
};

const statusBgColors = {
  pending: 'bg-medical-yellow/10',
  dispatched: 'bg-medical-blue/10',
  in_progress: 'bg-medical-orange/10',
  completed: 'bg-medical-green/10',
  cancelled: 'bg-gray-500/10'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const ActiveEmergencies = () => {
  const { data: emergencies, isLoading, refetch } = useQuery({
    queryKey: ['active-emergencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergencies')
        .select('*')
        .neq('status', 'completed')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Emergency[];
    }
  });

  const updateEmergencyStatus = async (id: string, status: Emergency['status']) => {
    try {
      const { error } = await supabase
        .from('emergencies')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Emergency status updated to ${status}`);
      refetch();
    } catch (error: any) {
      toast.error(`Error updating status: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Active Emergencies</h2>
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
      <div className="p-3 lg:p-4 border-b flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="mb-2 lg:mb-0">
          <h2 className="font-semibold text-lg">Active Emergencies</h2>
          <p className="text-sm text-gray-500">Ongoing emergency responses</p>
        </div>
        <Button variant="outline" size="sm" className="self-start lg:self-auto">
          View All
        </Button>
      </div>
      
      <div className="divide-y max-h-96 overflow-y-auto">
        {emergencies && emergencies.length > 0 ? (
          emergencies.map((emergency) => (
            <div key={emergency.id} className="p-3 lg:p-4">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3">
                <div className="flex">
                  <div className={cn(
                    "p-2 rounded-full mr-3 flex-shrink-0",
                    statusBgColors[emergency.status]
                  )}>
                    <AlertCircle className={cn(
                      "h-4 w-4 lg:h-5 lg:w-5", 
                      statusColors[emergency.status]
                    )} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm lg:text-base">{emergency.type}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {emergency.emergency_number || emergency.id.slice(0, 8)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs lg:text-sm text-gray-500 mb-1">
                      <MapPin className="h-3 lg:h-3.5 w-3 lg:w-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">{emergency.location}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Reported {new Date(emergency.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:items-end gap-2">
                  <Badge className={cn("text-xs", priorityColors[emergency.priority])}>
                    {emergency.priority.charAt(0).toUpperCase() + emergency.priority.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    statusColors[emergency.status]
                  )}>
                    {emergency.status.charAt(0).toUpperCase() + emergency.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              {(emergency.notes || emergency.description) && (
                <div className="mt-2 text-xs lg:text-sm text-gray-600 pl-11 lg:pl-14">
                  {emergency.description || emergency.notes}
                </div>
              )}
              
              <div className="mt-3 flex flex-wrap gap-2 pl-11 lg:pl-14">
                {emergency.status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="text-xs"
                    onClick={() => updateEmergencyStatus(emergency.id, 'dispatched')}
                  >
                    Dispatch
                  </Button>
                )}
                {emergency.status === 'dispatched' && (
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="text-xs"
                    onClick={() => updateEmergencyStatus(emergency.id, 'in_progress')}
                  >
                    Mark In Progress
                  </Button>
                )}
                {emergency.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="text-xs bg-medical-green hover:bg-medical-green/80"
                    onClick={() => updateEmergencyStatus(emergency.id, 'completed')}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-600">No Active Emergencies</h3>
            <p className="text-gray-500 mt-1">All emergencies have been handled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveEmergencies;
