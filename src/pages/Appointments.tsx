
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Plus, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ImprovedAppointmentForm from '@/components/appointments/ImprovedAppointmentForm';
import AppointmentsList from '@/components/appointments/AppointmentsList';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Appointments = () => {
  const [showForm, setShowForm] = useState(false);

  // Fetch appointments with proper error handling
  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles:doctor_id (
            first_name,
            last_name,
            specialty
          )
        `)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Get appointment statistics with null safety
  const getAppointmentStats = () => {
    if (!appointments) return { total: 0, today: 0, upcoming: 0, completed: 0 };

    const today = new Date().toISOString().split('T')[0];
    
    return {
      total: appointments.length,
      today: appointments.filter(apt => apt.appointment_date === today).length,
      upcoming: appointments.filter(apt => 
        ['scheduled', 'confirmed'].includes(apt.status) && 
        apt.appointment_date >= today
      ).length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
    };
  };

  const stats = getAppointmentStats();

  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load appointments. Please try refreshing the page.
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-gray-500">Manage patient appointments and scheduling</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0"
            disabled={showForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Appointments</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-2xl font-bold">{stats.today}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Upcoming</p>
                  <p className="text-2xl font-bold">{stats.upcoming}</p>
                </div>
                <User className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointment Form */}
          {showForm && (
            <div className="lg:col-span-1">
              <ImprovedAppointmentForm onClose={() => setShowForm(false)} />
            </div>
          )}

          {/* Appointments List */}
          <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
            <AppointmentsList 
              appointments={appointments || []} 
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
