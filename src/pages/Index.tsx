
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
      <div className="mesh-bg" />
      
      {/* System-wide Alerts for Critical Notifications */}
      <SystemAlerts />

      {/* Enhanced Header Section with Enterprise Branding */}
      <div className="mb-12 lg:mb-16 animate-fade-in">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 dark:border-white/5">
                  <Heart className="h-9 w-9 text-primary animate-pulse-medical" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none medical-gradient-text">
                  TRANA
                  <span className="block text-3xl lg:text-4xl mt-2 text-foreground/80 font-bold tracking-tight">Command Center</span>
                </h1>
                <div className="flex items-center space-x-3 mt-4">
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold tracking-wider uppercase text-[10px]">
                    <Shield className="h-3 w-3 mr-1.5 inline" /> Smart Healthcare OS
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 text-primary/70 font-bold tracking-wider uppercase text-[10px]">
                    v2.4.0-PRO
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-xl text-muted-foreground/80 font-medium max-w-2xl leading-relaxed">
              Real-time healthcare management with AI-powered insights, intelligent triage, and <span className="text-foreground font-bold">seamless multi-hospital coordination</span> across city boundaries.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-white/50 dark:bg-black/20 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 dark:border-white/5 shadow-xl">
              <Link to="/landing">
                <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold text-xs h-10 hover:bg-white dark:hover:bg-white/10 transition-all">
                  <Home className="h-4 w-4 mr-2" /> SITE
                </Button>
              </Link>
              <Link to="/healthcare">
                <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold text-xs h-10 hover:bg-white dark:hover:bg-white/10 transition-all">
                  <Globe className="h-4 w-4 mr-2" /> PORTAL
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold text-xs h-10 hover:bg-white dark:hover:bg-white/10 transition-all">
                  <BarChart3 className="h-4 w-4 mr-2" /> STATS
                </Button>
              </Link>
            </div>

            <NotificationSystem />
            
            <RoleBasedAccess allowedRoles={['admin', 'dispatcher']}>
              <QuickEmergencyForm />
            </RoleBasedAccess>
            
            {/* System Status Indicator */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center shadow-2xl border border-white/50 dark:border-white/5 hover:scale-105 transition-all duration-500">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Zap className="h-6 w-6 text-emerald-500" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                </div>
                <div>
                  <span className="text-xs font-black text-foreground/50 uppercase tracking-widest block">System Status</span>
                  <span className="text-sm font-bold text-foreground">ONLINE • 99.9%</span>
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
