
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
import { SystemAlerts } from '@/components/alerts/SystemAlerts';
import { NotificationSystem } from '@/components/enhanced/NotificationSystem';
import { useEmergencies, useAmbulances, useHospitalBeds } from '@/hooks/useSupabaseQuery';
import { Ambulance, AlertTriangle, Clock, Users, Bed, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { RoleBasedAccess } from '@/components/enhanced/RoleBasedAccess';

const Index = () => {
  // TRANA Assistant integration
  const { isMinimized, toggleMinimize, context } = useTranaAssistant();

  // Fetch real-time dashboard data with automatic refresh
  const { data: emergencies } = useEmergencies({ 
    refetchInterval: 15000 // 15 seconds for emergency data
  });
  const { data: ambulances } = useAmbulances({ 
    refetchInterval: 30000 // 30 seconds for ambulance data
  });
  const { data: hospitalBeds } = useHospitalBeds({ 
    refetchInterval: 30000 // 30 seconds for bed data
  });

  // Calculate statistics with proper type checking and trends
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

  // Calculate trends (simplified - in real app, you'd compare with historical data)
  const emergencyTrend = activeEmergenciesCount > 5 ? { value: 15, isPositive: false } : { value: 8, isPositive: true };
  const ambulanceTrend = availableAmbulances > 3 ? { value: 12, isPositive: true } : { value: 5, isPositive: false };
  const bedTrend = availableBeds > 10 ? { value: 7, isPositive: true } : { value: 10, isPositive: false };

  return (
    <Layout>
      {/* System Alerts */}
      <SystemAlerts />

      {/* Enhanced Header Section */}
      <div className="mb-8 lg:mb-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Emergency Command Center
            </h1>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium">
              Real-time medical emergency management system
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationSystem />
            
            {/* Quick Emergency Report Button */}
            <RoleBasedAccess allowedRoles={['admin', 'dispatcher']}>
              <QuickEmergencyForm />
            </RoleBasedAccess>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-xl flex items-center shadow-md hover:shadow-lg transition-all duration-300">
              <Activity className="h-5 w-5 text-emerald-500 mr-3" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">System Online</span>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ml-3 animate-pulse shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Stat Cards Grid with Real-time Updates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <StatCard
          title="Active Emergencies"
          value={activeEmergenciesCount.toString()}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={emergencyTrend}
          color="red"
          className="hover:shadow-lg transition-shadow duration-300 animate-fade-in"
        />
        <StatCard
          title="Available Ambulances"
          value={availableAmbulances.toString()}
          icon={<Ambulance className="h-6 w-6" />}
          trend={ambulanceTrend}
          color="blue"
          className="hover:shadow-lg transition-shadow duration-300 animate-fade-in"
        />
        <StatCard
          title="Patients in Transit"
          value={patientsInTransit.toString()}
          icon={<Users className="h-6 w-6" />}
          color="green"
          className="hover:shadow-lg transition-shadow duration-300 animate-fade-in"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds.toString()}
          icon={<Bed className="h-6 w-6" />}
          trend={bedTrend}
          color="green"
          className="hover:shadow-lg transition-shadow duration-300 animate-fade-in"
        />
      </div>
      
      {/* Enhanced Map and Hospital Beds Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <EmergencyMap />
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <HospitalBeds />
          </div>
        </div>
      </div>
      
      {/* Enhanced Active Emergencies and Ambulances Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <RoleBasedAccess allowedRoles={['admin', 'dispatcher', 'doctor']}>
            <ActiveEmergencies />
          </RoleBasedAccess>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <RoleBasedAccess allowedRoles={['admin', 'dispatcher']}>
            <EnhancedAmbulanceStatus />
          </RoleBasedAccess>
        </div>
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
