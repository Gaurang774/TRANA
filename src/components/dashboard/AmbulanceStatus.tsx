
import React from 'react';
import { cn } from '@/lib/utils';
import { Ambulance, Battery, MapPin } from 'lucide-react';

interface AmbulanceData {
  id: string;
  status: 'available' | 'dispatched' | 'en-route' | 'at-scene' | 'returning';
  location: string;
  driver: string;
  batteryLevel: number;
}

const ambulances: AmbulanceData[] = [
  { id: 'AMB-101', status: 'available', location: 'Central Station', driver: 'John Smith', batteryLevel: 92 },
  { id: 'AMB-102', status: 'dispatched', location: 'En route to 1234 Main St', driver: 'Maria Garcia', batteryLevel: 78 },
  { id: 'AMB-103', status: 'at-scene', location: '5678 Oak Avenue', driver: 'David Lee', batteryLevel: 65 },
  { id: 'AMB-104', status: 'returning', location: 'Returning to East Station', driver: 'Sarah Johnson', batteryLevel: 53 },
];

const statusColors = {
  'available': 'text-medical-green',
  'dispatched': 'text-medical-blue',
  'en-route': 'text-medical-blue',
  'at-scene': 'text-medical-red',
  'returning': 'text-medical-yellow',
};

const statusBgColors = {
  'available': 'bg-medical-green/10',
  'dispatched': 'bg-medical-blue/10',
  'en-route': 'bg-medical-blue/10',
  'at-scene': 'bg-medical-red/10',
  'returning': 'bg-medical-yellow/10',
};

const statusLabels = {
  'available': 'Available',
  'dispatched': 'Dispatched',
  'en-route': 'En Route',
  'at-scene': 'At Scene',
  'returning': 'Returning',
};

const AmbulanceStatus = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Ambulance Fleet</h2>
        <p className="text-sm text-gray-500">Status monitoring of emergency vehicles</p>
      </div>
      
      <div className="p-3">
        {ambulances.map((ambulance) => (
          <div 
            key={ambulance.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border mb-2 last:mb-0"
          >
            <div className="flex items-center">
              <div className={cn(
                "p-2 rounded-md mr-3",
                statusBgColors[ambulance.status]
              )}>
                <Ambulance className={cn(
                  "h-5 w-5", 
                  statusColors[ambulance.status]
                )} />
              </div>
              
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{ambulance.id}</h3>
                  <span className={cn(
                    "text-xs ml-2 px-2 py-0.5 rounded-full",
                    statusBgColors[ambulance.status],
                    statusColors[ambulance.status]
                  )}>
                    {statusLabels[ambulance.status]}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {ambulance.location}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-3 sm:mt-0">
              <div className="text-sm">
                <span className="text-gray-500">Driver: </span>
                <span className="font-medium">{ambulance.driver}</span>
              </div>
              
              <div className="flex items-center">
                <Battery className={cn(
                  "h-4 w-4 mr-1",
                  ambulance.batteryLevel > 70 ? 'text-medical-green' :
                  ambulance.batteryLevel > 40 ? 'text-medical-yellow' : 
                  'text-medical-red'
                )} />
                <span className={cn(
                  "text-xs font-medium",
                  ambulance.batteryLevel > 70 ? 'text-medical-green' :
                  ambulance.batteryLevel > 40 ? 'text-medical-yellow' : 
                  'text-medical-red'
                )}>
                  {ambulance.batteryLevel}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmbulanceStatus;
