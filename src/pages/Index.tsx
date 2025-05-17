
import React, { useState } from 'react';
import EmergencyHeader from '@/components/EmergencyHeader';
import EmergencySidebar from '@/components/EmergencySidebar';
import StatCard from '@/components/dashboard/StatCard';
import HospitalBeds from '@/components/dashboard/HospitalBeds';
import EmergencyMap from '@/components/dashboard/EmergencyMap';
import ActiveEmergencies from '@/components/dashboard/ActiveEmergencies';
import AmbulanceStatus from '@/components/dashboard/AmbulanceStatus';
import { Ambulance, AlertTriangle, Clock, Users, Bed } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <EmergencySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <EmergencyHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-500">Smart Emergency Healthcare System</p>
              </div>
              
              <div className="mt-4 md:mt-0 text-sm bg-blue-50 text-medical-blue px-3 py-2 rounded-md flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Last updated: Today at 11:45 AM
              </div>
            </div>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Active Emergencies"
                value="7"
                icon={<AlertTriangle className="h-4 w-4 text-white" />}
                trend={{ value: 12, isPositive: false }}
                color="red"
              />
              <StatCard
                title="Available Ambulances"
                value="12"
                icon={<Ambulance className="h-4 w-4 text-white" />}
                trend={{ value: 3, isPositive: true }}
                color="blue"
              />
              <StatCard
                title="Patients In Transit"
                value="5"
                icon={<Users className="h-4 w-4 text-white" />}
                trend={{ value: 8, isPositive: false }}
                color="yellow"
              />
              <StatCard
                title="Available Beds"
                value="43"
                icon={<Bed className="h-4 w-4 text-white" />}
                trend={{ value: 5, isPositive: false }}
                color="green"
              />
            </div>
            
            {/* Map and Hospital Beds */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
              <div className="lg:col-span-3">
                <EmergencyMap />
              </div>
              <div className="lg:col-span-2">
                <HospitalBeds />
              </div>
            </div>
            
            {/* Active Emergencies and Ambulances */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActiveEmergencies />
              <AmbulanceStatus />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
