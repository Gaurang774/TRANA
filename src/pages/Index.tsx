
import React from 'react';
import { Link } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Ambulance, AlertTriangle, Clock, Users, Bed, Activity, TrendingUp, TrendingDown, Shield, Zap, BarChart3, Globe, ExternalLink, Heart, Home } from 'lucide-react';
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
      {/* System-wide Alerts for Critical Notifications */}
      <SystemAlerts />

      {/* Enhanced Header Section with Enterprise Branding */}
      <div className="mb-8 lg:mb-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-br from-medical-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                    TRANA Command Center
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Smart Healthcare System</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl">
              Real-time healthcare management with AI-powered insights, intelligent triage, and seamless multi-hospital coordination
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Public Landing Page Access */}
            <Link to="/landing">
              <Button variant="outline" className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-emerald-100 transition-all duration-300">
                <Home className="h-4 w-4" />
                <span>Public Site</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
            
            {/* Healthcare Portal Access */}
            <Link to="/healthcare">
              <Button variant="outline" className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-emerald-100 transition-all duration-300">
                <Globe className="h-4 w-4" />
                <span>Healthcare Portal</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
            
            {/* Real-time Notifications System */}
            <NotificationSystem />
            
            {/* Analytics Quick Access */}
            <Link to="/analytics">
              <Button variant="outline" className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </Link>
            
            {/* Quick Emergency Report - Role Protected */}
            <RoleBasedAccess allowedRoles={['admin', 'dispatcher']}>
              <QuickEmergencyForm />
            </RoleBasedAccess>
            
            {/* System Status Indicator */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-xl flex items-center shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-emerald-500" />
                <div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">System Online</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">99.9% uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Real-time KPI Cards with Enterprise Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <StatCard
          title="Active Emergencies"
          value={activeEmergenciesCount.toString()}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={emergencyTrend}
          color="red"
          className="hover:shadow-lg transition-shadow duration-300 animate-fade-in border-l-4 border-l-red-500"
        />
        <StatCard
          title="Available Ambulances"
          value={availableAmbulances.toString()}
          icon={<Ambulance className="h-6 w-6" />}
          trend={ambulanceTrend}
          color="blue"
          className="hover:shadow-lg transition-shadow duration-300 animate-fade-in border-l-4 border-l-blue-500"
        />
        <StatCard
          title="Patients in Transit"
          value={patientsInTransit.toString()}
          icon={<Users className="h-6 w-6" />}
          color="green"
          className="hover:shadow-lg transition-shadow duration-300 animate-fade-in border-l-4 border-l-orange-500"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds.toString()}
          icon={<Bed className="h-6 w-6" />}
          trend={bedTrend}
          color="green"
          className="hover:shadow-lg transition-shadow duration-300 animate-fade-in border-l-4 border-l-emerald-500"
        />
      </div>
      
      {/* Enhanced Operational Overview with Real-time Map */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Real-time Emergency Map</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Live Updates</span>
                </div>
              </div>
            </div>
            <EmergencyMap />
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
            <HospitalBeds />
          </div>
        </div>
      </div>
      
      {/* Enhanced Emergency Operations Center with Role-based Access */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
          <RoleBasedAccess allowedRoles={['admin', 'dispatcher', 'doctor']}>
            <ActiveEmergencies />
          </RoleBasedAccess>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
          <RoleBasedAccess allowedRoles={['admin', 'dispatcher']}>
            <EnhancedAmbulanceStatus />
          </RoleBasedAccess>
        </div>
      </div>
      
      {/* AI-Powered TRANA Assistant Integration */}
      <TranaAssistant 
        isMinimized={isMinimized}
        onToggleMinimize={toggleMinimize}
        context={context}
      />
    </Layout>
  );
};

export default Index;
