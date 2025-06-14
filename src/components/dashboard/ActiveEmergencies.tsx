
import React from 'react';
import { AlertCircle, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Emergency {
  id: string;
  type: string;
  location: string;
  timeReceived: string;
  status: 'critical' | 'serious' | 'stable';
  respondingUnit: string;
  eta: string;
}

const emergencies: Emergency[] = [
  {
    id: 'E-7823',
    type: 'Cardiac Arrest',
    location: '1234 Main St, Cityville',
    timeReceived: '10:24 AM',
    status: 'critical',
    respondingUnit: 'Ambulance #103',
    eta: '4 min'
  },
  {
    id: 'E-7824',
    type: 'Traffic Accident',
    location: 'Highway 101, Mile 23',
    timeReceived: '10:31 AM',
    status: 'serious',
    respondingUnit: 'Ambulance #105',
    eta: '7 min'
  },
  {
    id: 'E-7825',
    type: 'Fall Injury',
    location: '987 Oak Ave, Townsburg',
    timeReceived: '10:45 AM',
    status: 'stable',
    respondingUnit: 'Ambulance #102',
    eta: '12 min'
  }
];

const statusColors = {
  critical: 'text-medical-red',
  serious: 'text-medical-orange',
  stable: 'text-medical-green'
};

const statusBgColors = {
  critical: 'bg-medical-red/10',
  serious: 'bg-medical-orange/10',
  stable: 'bg-medical-green/10'
};

const ActiveEmergencies = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">Active Emergencies</h2>
          <p className="text-sm text-gray-500">Ongoing emergency responses</p>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="divide-y">
        {emergencies.map((emergency) => (
          <div key={emergency.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className={cn(
                  "p-2 rounded-full mr-3",
                  statusBgColors[emergency.status]
                )}>
                  <AlertCircle className={cn(
                    "h-5 w-5", 
                    statusColors[emergency.status]
                  )} />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{emergency.type}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded ml-2">
                      {emergency.id}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {emergency.location}
                  </div>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Received at {emergency.timeReceived}
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "text-xs px-2 py-1 rounded-full",
                statusBgColors[emergency.status],
                statusColors[emergency.status]
              )}>
                {emergency.status.charAt(0).toUpperCase() + emergency.status.slice(1)}
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="bg-blue-50 text-medical-blue px-2 py-1 rounded">
                {emergency.respondingUnit}
              </div>
              <div className="flex items-center text-medical-blue font-medium">
                <Clock className="h-3.5 w-3.5 mr-1" />
                ETA: {emergency.eta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveEmergencies;
