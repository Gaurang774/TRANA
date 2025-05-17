
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BadgeAlert } from 'lucide-react';

interface HospitalBedData {
  id: number;
  name: string;
  total: number;
  occupied: number;
  emergency: number;
  distance: string;
  eta: string;
}

const hospitalBedsData: HospitalBedData[] = [
  { id: 1, name: 'Central Hospital', total: 200, occupied: 145, emergency: 12, distance: '2.5 miles', eta: '8 mins' },
  { id: 2, name: 'Mercy Medical Center', total: 150, occupied: 82, emergency: 5, distance: '4.8 miles', eta: '15 mins' },
  { id: 3, name: 'City General Hospital', total: 300, occupied: 275, emergency: 20, distance: '6.2 miles', eta: '20 mins' },
  { id: 4, name: 'Community Health', total: 120, occupied: 65, emergency: 3, distance: '8.5 miles', eta: '25 mins' },
];

const HospitalBeds = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">Hospital Bed Availability</h2>
          <p className="text-sm text-gray-500">Real-time capacity monitoring</p>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center text-sm">
          <div className="flex items-center mr-3">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center mr-3">
            <div className="w-3 h-3 rounded-full bg-medical-blue mr-1"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-medical-red mr-1"></div>
            <span>Emergency</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm bg-gray-50">
              <th className="py-3 px-4 font-medium">Hospital</th>
              <th className="py-3 px-4 font-medium">Capacity</th>
              <th className="py-3 px-4 font-medium">Distance</th>
              <th className="py-3 px-4 font-medium">ETA</th>
              <th className="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {hospitalBedsData.map((hospital) => {
              const occupancyRate = (hospital.occupied / hospital.total) * 100;
              const availableBeds = hospital.total - hospital.occupied;
              const isCritical = availableBeds <= 10;
              
              return (
                <tr key={hospital.id} className="border-t">
                  <td className="py-3 px-4">
                    <div className="font-medium">{hospital.name}</div>
                    <div className="text-xs text-gray-500">
                      {availableBeds} beds available
                    </div>
                  </td>
                  <td className="py-3 px-4 w-40">
                    <div className="flex mb-1 text-xs">
                      <span>{hospital.occupied} / {hospital.total}</span>
                      <span className="ml-auto">{Math.round(occupancyRate)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Progress 
                        value={occupancyRate} 
                        className={cn(
                          "h-2", 
                          occupancyRate > 90 ? "bg-red-100" : "bg-blue-50"
                        )}
                      />
                      {hospital.emergency > 0 && (
                        <div className="bg-medical-red/10 px-1.5 py-0.5 text-xs rounded">
                          <span className="font-medium text-medical-red">{hospital.emergency} ER</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">{hospital.distance}</td>
                  <td className="py-3 px-4">{hospital.eta}</td>
                  <td className="py-3 px-4">
                    <div 
                      className={cn(
                        "text-xs px-2 py-1 rounded-full inline-flex items-center",
                        isCritical 
                          ? "bg-medical-red/10 text-medical-red"
                          : occupancyRate > 75
                          ? "bg-medical-yellow/10 text-yellow-700"
                          : "bg-medical-green/10 text-medical-green"
                      )}
                    >
                      {isCritical && (
                        <BadgeAlert className="h-3 w-3 mr-1" />
                      )}
                      {isCritical ? "Critical" : occupancyRate > 75 ? "Busy" : "Available"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HospitalBeds;
