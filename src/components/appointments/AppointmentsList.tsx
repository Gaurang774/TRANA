
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string | null;
  patient_email: string | null;
  department: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    specialty: string | null;
  } | null;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  isLoading: boolean;
}

const AppointmentsList = ({ appointments, isLoading }: AppointmentsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateAppointmentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment status updated",
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
      console.error('Error updating appointment:', error);
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
      console.error('Error deleting appointment:', error);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading appointments...</div>
        </CardContent>
      </Card>
    );
  }

  if (!appointments.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No appointments found. Create your first appointment to get started.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Appointments List</h2>
      
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{appointment.patient_name}</span>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(appointment.appointment_date), 'PPP')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.appointment_time}</span>
                  </div>

                  {appointment.patient_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.patient_phone}</span>
                    </div>
                  )}

                  {appointment.patient_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{appointment.patient_email}</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Department:</strong> {appointment.department}</p>
                  {appointment.profiles && (
                    <p><strong>Doctor:</strong> Dr. {appointment.profiles.first_name} {appointment.profiles.last_name}</p>
                  )}
                  {appointment.notes && (
                    <p><strong>Notes:</strong> {appointment.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Select
                  value={appointment.status}
                  onValueChange={(value) => 
                    updateAppointmentStatus.mutate({ id: appointment.id, status: value })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteAppointment.mutate(appointment.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentsList;
