
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RealTimeData } from './RealTimeData';
import { DataTable, TableColumn } from './DataTable';
import { useAmbulances, useUpdateAmbulanceLocation } from '@/hooks/useSupabaseQuery';
import { MapPin, Navigation, Fuel, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Ambulance {
  id: string;
  ambulance_number: string;
  status: string;
  current_location?: any;
  fuel_level?: number;
  crew_size?: number;
  type: string;
  last_maintenance?: string;
  license_plate?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'default';
    case 'dispatched': return 'destructive';
    case 'en-route': return 'secondary';
    case 'returning': return 'outline';
    case 'maintenance': return 'destructive';
    default: return 'outline';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'available': return '🟢';
    case 'dispatched': return '🔴';
    case 'en-route': return '🟡';
    case 'returning': return '🔵';
    case 'maintenance': return '🔧';
    default: return '⚪';
  }
};

export function EnhancedAmbulanceStatus() {
  const { data: ambulances, isLoading, error } = useAmbulances({
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const updateLocation = useUpdateAmbulanceLocation();

  const handleLocationUpdate = async (ambulanceId: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await updateLocation.mutateAsync({
            ambulanceId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const columns: TableColumn<Ambulance>[] = [
    {
      key: 'ambulance_number',
      label: 'Unit #',
      sortable: true,
      render: (value) => (
        <div className="font-medium">{value}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={getStatusColor(value) as any} className="flex items-center space-x-1">
          <span>{getStatusIcon(value)}</span>
          <span className="capitalize">{value}</span>
        </Badge>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: 'current_location',
      label: 'Location',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {value?.address || 'Location updating...'}
          </span>
        </div>
      ),
    },
    {
      key: 'fuel_level',
      label: 'Fuel',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Fuel className={`h-4 w-4 ${value < 25 ? 'text-red-500' : 'text-green-500'}`} />
          <span className={value < 25 ? 'text-red-600 font-medium' : ''}>{value}%</span>
        </div>
      ),
    },
    {
      key: 'crew_size',
      label: 'Crew',
      sortable: true,
      render: (value) => (
        <span>{value || 0} members</span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Update Location',
      onClick: (ambulance: Ambulance) => handleLocationUpdate(ambulance.id),
    },
    {
      label: 'View Details',
      onClick: (ambulance: Ambulance) => console.log('View details:', ambulance),
    },
  ];

  const renderAmbulanceCard = (ambulance: Ambulance) => (
    <Card key={ambulance.id} className="p-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{ambulance.ambulance_number}</span>
            <Badge variant={getStatusColor(ambulance.status) as any}>
              {getStatusIcon(ambulance.status)} {ambulance.status}
            </Badge>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleLocationUpdate(ambulance.id)}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-1">
            <Fuel className={`h-3 w-3 ${ambulance.fuel_level! < 25 ? 'text-red-500' : 'text-green-500'}`} />
            <span>Fuel: {ambulance.fuel_level}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Crew: {ambulance.crew_size || 0}</span>
          </div>
        </div>
        
        {ambulance.current_location?.address && (
          <div className="mt-2 text-sm text-gray-600 flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{ambulance.current_location.address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Real-time card view for mobile */}
      <div className="md:hidden">
        <RealTimeData
          table="ambulances"
          queryKey={['ambulances']}
          queryFn={async () => {
            const { data, error } = await supabase.from('ambulances').select('*');
            if (error) throw error;
            return data || [];
          }}
          title="Ambulance Status"
          description="Real-time ambulance tracking and status updates"
          renderItem={renderAmbulanceCard}
          enableRealtime={true}
          emptyMessage="No ambulances available"
        />
      </div>

      {/* Table view for desktop */}
      <div className="hidden md:block">
        <DataTable
          data={ambulances || []}
          columns={columns}
          actions={actions}
          title="Ambulance Fleet Status"
          description="Real-time tracking of all ambulance units"
          isLoading={isLoading}
          error={error?.message}
          searchable={true}
          searchPlaceholder="Search ambulances..."
          emptyMessage="No ambulances in the fleet"
        />
      </div>
    </div>
  );
}
