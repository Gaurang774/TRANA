
import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, User, Phone } from 'lucide-react';
import { EnhancedAppointmentForm } from '@/components/enhanced/EnhancedAppointmentForm';
import { DataTable, TableColumn } from '@/components/enhanced/DataTable';
import { EnhancedSearchFilter } from '@/components/enhanced/EnhancedSearchFilter';
import { RoleBasedAccess } from '@/components/enhanced/RoleBasedAccess';
import { Badge } from '@/components/ui/badge';
import { useAppointments } from '@/hooks/useSupabaseQuery';

interface Appointment {
  id: string;
  appointment_number: string;
  patient_name: string;
  patient_phone?: string;
  patient_email?: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  created_at: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'default';
    case 'confirmed': return 'secondary';
    case 'completed': return 'outline';
    case 'cancelled': return 'destructive';
    case 'no-show': return 'destructive';
    default: return 'outline';
  }
};

const Appointments = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const { data: appointments, isLoading, error } = useAppointments({
    refetchInterval: 60000 // Refresh every minute
  });

  // Filter options for enhanced search
  const filterOptions = {
    status: {
      label: 'Status',
      options: [
        { key: 'scheduled', label: 'Scheduled', value: 'scheduled' },
        { key: 'confirmed', label: 'Confirmed', value: 'confirmed' },
        { key: 'completed', label: 'Completed', value: 'completed' },
        { key: 'cancelled', label: 'Cancelled', value: 'cancelled' },
        { key: 'no-show', label: 'No Show', value: 'no-show' },
      ]
    },
    department: {
      label: 'Department',
      options: [
        { key: 'cardiology', label: 'Cardiology', value: 'cardiology' },
        { key: 'emergency', label: 'Emergency', value: 'emergency' },
        { key: 'orthopedics', label: 'Orthopedics', value: 'orthopedics' },
        { key: 'neurology', label: 'Neurology', value: 'neurology' },
        { key: 'pediatrics', label: 'Pediatrics', value: 'pediatrics' },
        { key: 'surgery', label: 'Surgery', value: 'surgery' },
      ]
    }
  };

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments.filter((appointment) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.appointment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.patient_phone && appointment.patient_phone.includes(searchTerm));

      // Status filter
      const matchesStatus = !filters.status || appointment.status === filters.status;

      // Department filter
      const matchesDepartment = !filters.department || appointment.department.toLowerCase() === filters.department;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [appointments, searchTerm, filters]);

  const columns: TableColumn<Appointment>[] = [
    {
      key: 'appointment_number',
      label: 'Appointment #',
      sortable: true,
      render: (value) => (
        <div className="font-mono text-sm font-medium">{value}</div>
      ),
    },
    {
      key: 'patient_name',
      label: 'Patient',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.patient_phone && (
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>{row.patient_phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="capitalize">{value}</Badge>
      ),
    },
    {
      key: 'appointment_date',
      label: 'Date & Time',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{new Date(value).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{row.appointment_time}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={getStatusColor(value) as any} className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      label: 'Booked',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View Details',
      onClick: (appointment: Appointment) => console.log('View:', appointment),
    },
    {
      label: 'Reschedule',
      onClick: (appointment: Appointment) => console.log('Reschedule:', appointment),
    },
    {
      label: 'Cancel',
      onClick: (appointment: Appointment) => console.log('Cancel:', appointment),
      variant: 'destructive' as const,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Appointment Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Schedule and manage patient appointments with advanced search and filtering
            </p>
          </div>
          
          <RoleBasedAccess allowedRoles={['admin', 'doctor']}>
            <Button 
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>New Appointment</span>
            </Button>
          </RoleBasedAccess>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <EnhancedSearchFilter
            searchPlaceholder="Search appointments by patient name, number, or department..."
            onSearchChange={setSearchTerm}
            onFilterChange={setFilters}
            filterOptions={filterOptions}
          />
        </div>

        {/* Appointments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <DataTable
            data={filteredAppointments}
            columns={columns}
            actions={actions}
            title="All Appointments"
            description={`Found ${filteredAppointments.length} appointment${filteredAppointments.length !== 1 ? 's' : ''}`}
            isLoading={isLoading}
            error={error?.message}
            emptyMessage="No appointments found matching your criteria"
            className="border-0"
          />
        </div>

        {/* Enhanced Appointment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold">New Appointment</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowForm(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  ×
                </Button>
              </div>
              <div className="p-6">
                <EnhancedAppointmentForm onClose={() => setShowForm(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
