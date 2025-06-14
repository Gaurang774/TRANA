
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppointmentFormData {
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  doctor_id: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
}

interface AppointmentFormProps {
  onClose: () => void;
}

const AppointmentForm = ({ onClose }: AppointmentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AppointmentFormData>();

  // Fetch doctors/profiles for the dropdown
  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor');

      if (error) throw error;
      return data;
    },
  });

  const createAppointment = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_name: data.patient_name,
          patient_phone: data.patient_phone,
          patient_email: data.patient_email,
          doctor_id: data.doctor_id || null,
          department: data.department,
          appointment_date: data.appointment_date,
          appointment_time: data.appointment_time,
          notes: data.notes,
          status: 'scheduled'
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
      console.error('Error creating appointment:', error);
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    createAppointment.mutate(data);
  };

  const departments = [
    'Emergency',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Surgery',
    'Internal Medicine',
    'Radiology'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>New Appointment</CardTitle>
            <CardDescription>Schedule a new patient appointment</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="patient_name">Patient Name *</Label>
            <Input
              id="patient_name"
              {...register('patient_name', { required: 'Patient name is required' })}
              placeholder="Enter patient name"
            />
            {errors.patient_name && (
              <p className="text-sm text-red-500 mt-1">{errors.patient_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="patient_phone">Phone Number</Label>
            <Input
              id="patient_phone"
              {...register('patient_phone')}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label htmlFor="patient_email">Email</Label>
            <Input
              id="patient_email"
              type="email"
              {...register('patient_email')}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="department">Department *</Label>
            <Select onValueChange={(value) => setValue('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doctor_id">Doctor (Optional)</Label>
            <Select onValueChange={(value) => setValue('doctor_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors?.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="appointment_date">Date *</Label>
            <Input
              id="appointment_date"
              type="date"
              {...register('appointment_date', { required: 'Appointment date is required' })}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.appointment_date && (
              <p className="text-sm text-red-500 mt-1">{errors.appointment_date.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="appointment_time">Time *</Label>
            <Input
              id="appointment_time"
              type="time"
              {...register('appointment_time', { required: 'Appointment time is required' })}
            />
            {errors.appointment_time && (
              <p className="text-sm text-red-500 mt-1">{errors.appointment_time.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              {...register('notes')}
              placeholder="Additional notes"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={createAppointment.isPending}
              className="flex-1"
            >
              {createAppointment.isPending ? 'Creating...' : 'Create Appointment'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
