
import React from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/dashboard/StatCard';
import HospitalBeds from '@/components/dashboard/HospitalBeds';
import EmergencyMap from '@/components/dashboard/EmergencyMap';
import ActiveEmergencies from '@/components/dashboard/ActiveEmergencies';
import AmbulanceStatus from '@/components/dashboard/AmbulanceStatus';
import { Ambulance, AlertTriangle, Clock, Users, Bed, Activity } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Emergency Dashboard</h1>
            <p className="text-gray-500 font-light">Real-time medical emergency management system</p>
          </div>
          
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center shadow-sm">
            <Activity className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-600">System Active</span>
            <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Emergencies"
          value="7"
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: 12, isPositive: false }}
          color="red"
        />
        <StatCard
          title="Available Ambulances"
          value="12"
          icon={<Ambulance className="h-5 w-5" />}
          trend={{ value: 3, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Patients In Transit"
          value="5"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 8, isPositive: false }}
          color="yellow"
        />
        <StatCard
          title="Available Beds"
          value="43"
          icon={<Bed className="h-5 w-5" />}
          trend={{ value: 5, isPositive: false }}
          color="green"
        />
      </div>
      
      {/* Map and Hospital Beds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <EmergencyMap />
        </div>
        <div className="lg:col-span-1">
          <HospitalBeds />
        </div>
      </div>
      
      {/* Active Emergencies and Ambulances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveEmergencies />
        <AmbulanceStatus />
      </div>
    </Layout>
  );
};

export default Index;
