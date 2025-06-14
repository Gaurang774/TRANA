
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import StatCard from '@/components/dashboard/StatCard';
import HospitalBeds from '@/components/dashboard/HospitalBeds';
import EmergencyMap from '@/components/dashboard/EmergencyMap';
import ActiveEmergencies from '@/components/dashboard/ActiveEmergencies';
import AmbulanceStatus from '@/components/dashboard/AmbulanceStatus';
import { supabase } from '@/integrations/supabase/client';
import { Ambulance, AlertTriangle, Clock, Users, Bed, Activity } from 'lucide-react';

const Index = () => {
  // Fetch real-time dashboard data
  const { data: emergencies } = useQuery({
    queryKey: ['emergencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergencies')
        .select('*')
        .neq('status', 'completed')
        .neq('status', 'cancelled');
      if (error) throw error;
      return data;
    }
  });

  const { data: ambulances } = useQuery({
    queryKey: ['ambulances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ambulances')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: hospitalBeds } = useQuery({
    queryKey: ['hospital_beds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospital_beds')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  // Calculate statistics
  const activeEmergenciesCount = emergencies?.length || 0;
  const availableAmbulances = ambulances?.filter(a => a.status === 'available').length || 0;
  const patientsInTransit = ambulances?.filter(a => a.status === 'en-route' || a.status === 'returning').length || 0;
  const availableBeds = hospitalBeds?.filter(b => b.status === 'available').length || 0;

  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-900 mb-2">Emergency Dashboard</h1>
            <p className="text-sm lg:text-base text-neutral-600">Real-time medical emergency management system</p>
          </div>
          
          <div className="bg-white border border-neutral-200 px-3 lg:px-4 py-2 rounded-lg flex items-center shadow-soft">
            <Activity className="h-4 w-4 text-medical-green mr-2" />
            <span className="text-xs lg:text-sm text-neutral-600 font-medium">System Active</span>
            <div className="w-2 h-2 bg-medical-green rounded-full ml-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Active Emergencies"
          value={activeEmergenciesCount.toString()}
          icon={<AlertTriangle className="h-4 lg:h-5 w-4 lg:w-5" />}
          trend={{ value: 12, isPositive: false }}
          color="red"
        />
        <StatCard
          title="Available Ambulances"
          value={availableAmbulances.toString()}
          icon={<Ambulance className="h-4 lg:h-5 w-4 lg:w-5" />}
          trend={{ value: 3, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Patients In Transit"
          value={patientsInTransit.toString()}
          icon={<Users className="h-4 lg:h-5 w-4 lg:w-5" />}
          color="green"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds.toString()}
          icon={<Bed className="h-4 lg:h-5 w-4 lg:w-5" />}
          trend={{ value: 5, isPositive: false }}
          color="green"
        />
      </div>
      
      {/* Map and Hospital Beds */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="xl:col-span-2">
          <EmergencyMap />
        </div>
        <div className="xl:col-span-1">
          <HospitalBeds />
        </div>
      </div>
      
      {/* Active Emergencies and Ambulances */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <ActiveEmergencies />
        <AmbulanceStatus />
      </div>
    </Layout>
  );
};

export default Index;
