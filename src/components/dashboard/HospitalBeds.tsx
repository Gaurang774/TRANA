
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BadgeAlert, Bed } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HospitalBedData {
  id: string;
  bed_number: string;
  department: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  patient_id: string | null;
}

const HospitalBeds = () => {
  const { data: beds, isLoading } = useQuery({
    queryKey: ['hospital-beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospital_beds')
        .select('*')
        .order('department', { ascending: true });
      
      if (error) throw error;
      return data as HospitalBedData[];
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Hospital Bed Availability</h2>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-blue mx-auto"></div>
        </div>
      </div>
    );
  }

  // Group beds by department
  const bedsByDepartment = beds?.reduce((acc, bed) => {
    if (!acc[bed.department]) {
      acc[bed.department] = [];
    }
    acc[bed.department].push(bed);
    return acc;
  }, {} as Record<string, HospitalBedData[]>) || {};

  const departments = Object.keys(bedsByDepartment);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-3 lg:p-4 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2 lg:mb-0">
          <div>
            <h2 className="font-semibold text-lg">Hospital Bed Availability</h2>
            <p className="text-sm text-gray-500">Real-time capacity monitoring</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 lg:mt-0 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-medical-blue mr-1"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-medical-red mr-1"></div>
              <span>Reserved</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {departments.length > 0 ? (
          departments.map((department) => {
            const departmentBeds = bedsByDepartment[department];
            const totalBeds = departmentBeds.length;
            const occupiedBeds = departmentBeds.filter(b => b.status === 'occupied').length;
            const availableBeds = departmentBeds.filter(b => b.status === 'available').length;
            const reservedBeds = departmentBeds.filter(b => b.status === 'reserved').length;
            const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
            const isCritical = availableBeds <= 2;
            
            return (
              <div key={department} className="p-3 lg:p-4 border-b last:border-b-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-sm lg:text-base">{department}</h3>
                    <p className="text-xs text-gray-500">
                      {availableBeds} of {totalBeds} beds available
                    </p>
                  </div>
                  
                  <Badge 
                    className={cn(
                      "text-xs mt-2 lg:mt-0",
                      isCritical 
                        ? "bg-medical-red/10 text-medical-red"
                        : occupancyRate > 75
                        ? "bg-medical-yellow/10 text-yellow-700"
                        : "bg-medical-green/10 text-medical-green"
                    )}
                  >
                    {isCritical && <BadgeAlert className="h-3 w-3 mr-1" />}
                    {isCritical ? "Critical" : occupancyRate > 75 ? "Busy" : "Available"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Occupancy: {occupiedBeds}/{totalBeds}</span>
                    <span>{Math.round(occupancyRate)}%</span>
                  </div>
                  <Progress 
                    value={occupancyRate} 
                    className={cn(
                      "h-2", 
                      occupancyRate > 90 ? "bg-red-100" : "bg-blue-50"
                    )}
                  />
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      {availableBeds} Available
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {occupiedBeds} Occupied
                    </span>
                    {reservedBeds > 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                        {reservedBeds} Reserved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <Bed className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-600">No Bed Data</h3>
            <p className="text-gray-500 mt-1">Hospital bed information will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalBeds;
