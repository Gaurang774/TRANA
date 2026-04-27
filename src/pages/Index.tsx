
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
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 medical-gradient rounded-2xl flex items-center justify-center shadow-medical">
                  <Heart className="h-7 w-7 text-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                    TRANA Command Center
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Smart Healthcare System</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl">
              Real-time healthcare management with AI-powered insights, intelligent triage, and seamless multi-hospital coordination
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Public Landing Page Access */}
            <Link to="/landing">
              <Button variant="outline" className="glass flex items-center space-x-2 text-primary hover:bg-primary/5 transition-all duration-300">
                <Home className="h-4 w-4" />
                <span>Public Site</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
            
            {/* Healthcare Portal Access */}
            <Link to="/healthcare">
              <Button variant="outline" className="glass flex items-center space-x-2 text-primary hover:bg-primary/5 transition-all duration-300">
                <Globe className="h-4 w-4" />
                <span>Healthcare Portal</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
            
            {/* Real-time Notifications System */}
            <NotificationSystem />
            
            {/* Analytics Quick Access */}
            <Link to="/analytics">
              <Button variant="outline" className="glass flex items-center space-x-2 text-foreground hover:bg-foreground/5 transition-all duration-300">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </Link>
            
            {/* Quick Emergency Report - Role Protected */}
            <RoleBasedAccess allowedRoles={['admin', 'dispatcher']}>
              <QuickEmergencyForm />
            </RoleBasedAccess>
            
            {/* System Status Indicator */}
            <div className="glass px-6 py-3 rounded-xl flex items-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-emerald-500" />
                <div>
                  <span className="text-sm font-semibold text-foreground">System Online</span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">99.9% uptime</span>
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
          className="glass-card hover:shadow-xl transition-all duration-300 animate-fade-in border-l-4 border-l-red-500"
        />
        <StatCard
          title="Available Ambulances"
          value={availableAmbulances.toString()}
          icon={<Ambulance className="h-6 w-6" />}
          trend={ambulanceTrend}
          color="blue"
          className="glass-card hover:shadow-xl transition-all duration-300 animate-fade-in border-l-4 border-l-blue-500"
        />
        <StatCard
          title="Patients in Transit"
          value={patientsInTransit.toString()}
          icon={<Users className="h-6 w-6" />}
          color="green"
          className="glass-card hover:shadow-xl transition-all duration-300 animate-fade-in border-l-4 border-l-orange-500"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds.toString()}
          icon={<Bed className="h-6 w-6" />}
          trend={bedTrend}
          color="green"
          className="glass-card hover:shadow-xl transition-all duration-300 animate-fade-in border-l-4 border-l-emerald-500"
        />
      </div>
      
      {/* Enhanced Operational Overview with Real-time Map */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 mb-8 lg:mb-10">
        <div className="xl:col-span-3">
          <div className="glass-card rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-4 border-b border-border/50 bg-foreground/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">Real-time Emergency Map</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Live Updates</span>
                </div>
              </div>
            </div>
            <EmergencyMap />
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="glass-card rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
            <HospitalBeds />
          </div>
        </div>
      </div>
      
      {/* Enhanced Emergency Operations Center with Role-based Access */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <div className="glass-card rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
          <RoleBasedAccess allowedRoles={['admin', 'dispatcher', 'doctor']}>
            <ActiveEmergencies />
          </RoleBasedAccess>
        </div>
        <div className="glass-card rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden">
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
