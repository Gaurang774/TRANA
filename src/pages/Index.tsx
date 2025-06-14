
import React from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/dashboard/StatCard';
import HospitalBeds from '@/components/dashboard/HospitalBeds';
import EmergencyMap from '@/components/dashboard/EmergencyMap';
import ActiveEmergencies from '@/components/dashboard/ActiveEmergencies';
import TranaAssistant from '@/components/assistant/TranaAssistant';
import { useTranaAssistant } from '@/hooks/useTranaAssistant';
import { QuickEmergencyForm } from '@/components/enhanced/QuickEmergencyForm';
import { EnhancedAmbulanceStatus } from '@/components/enhanced/EnhancedAmbulanceStatus';
import { useEmergencies, useAmbulances, useHospitalBeds } from '@/hooks/useSupabaseQuery';
import { Ambulance, AlertTriangle, Clock, Users, Bed, Activity } from 'lucide-react';

const Index = () => {
  // TRANA Assistant integration
  const { isMinimized, toggleMinimize, context } = useTranaAssistant();

  // Fetch real-time dashboard data using enhanced hooks
  const { data: emergencies } = useEmergencies();
  const { data: ambulances } = useAmbulances();
  const { data: hospitalBeds } = useHospitalBeds();

  // Calculate statistics with proper type checking
  const activeEmergenciesCount = Array.isArray(emergencies) ? emergencies.length : 0;
  const availableAmbulances = Array.isArray(ambulances) 
    ? ambulances.filter(a => a.status === 'available').length 
    : 0;
  const patientsInTransit = Array.isArray(ambulances) 
    ? ambulances.filter(a => a.status === 'en-route' || a.status === 'returning').length 
    : 0;
  const availableBeds = Array.isArray(hospitalBeds) 
    ? hospitalBeds.filter(b => b.status === 'available').length 
    : 0;

  return (
    <Layout>
      {/* Enhanced Header Section */}
      <div className="mb-8 lg:mb-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Emergency Dashboard
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium">
              Real-time medical emergency management system
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Emergency Report Button */}
            <QuickEmergencyForm />
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300">
              <Activity className="h-5 w-5 text-emerald-500 mr-3" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">System Active</span>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ml-3 animate-pulse shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <StatCard
          title="Active Emergencies"
          value={activeEmergenciesCount.toString()}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={{ value: 12, isPositive: false }}
          color="red"
        />
        <StatCard
          title="Available Ambulances"
          value={availableAmbulances.toString()}
          icon={<Ambulance className="h-6 w-6" />}
          trend={{ value: 3, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Patients In Transit"
          value={patientsInTransit.toString()}
          icon={<Users className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds.toString()}
          icon={<Bed className="h-6 w-6" />}
          trend={{ value: 5, isPositive: false }}
          color="green"
        />
      </div>
      
      {/* Enhanced Map and Hospital Beds Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <div className="xl:col-span-3">
          <EmergencyMap />
        </div>
        <div className="xl:col-span-2">
          <HospitalBeds />
        </div>
      </div>
      
      {/* Enhanced Active Emergencies and Ambulances Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <ActiveEmergencies />
        <EnhancedAmbulanceStatus />
      </div>
      
      {/* TRANA Assistant Integration */}
      <TranaAssistant 
        isMinimized={isMinimized}
        onToggleMinimize={toggleMinimize}
        context={context}
      />
    </Layout>
  );
};

export default Index;
