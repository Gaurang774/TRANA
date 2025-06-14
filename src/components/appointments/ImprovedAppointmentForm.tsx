import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, AlertCircle } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  appointmentFormSchema, 
  AppointmentFormData, 
  validateAppointmentTime, 
  validateBusinessHours 
} from './AppointmentFormValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OCRPrescriptionUpload from './OCRPrescriptionUpload';

interface ImprovedAppointmentFormProps {
  onClose: () => void;
}

const ImprovedAppointmentForm = ({ onClose }: ImprovedAppointmentFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    register, 
    handleSubmit, 
    control, 
    watch, 
    reset, 
    setValue,
    formState: { errors, isSubmitting },
    setError
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patient_name: '',
      patient_phone: '',
      patient_email: '',
      doctor_id: '',
      department: '',
      appointment_date: '',
      appointment_time: '',
      notes: ''
    }
  });

  const watchDate = watch('appointment_date');
  const watchTime = watch('appointment_time');

  // Handle OCR extracted data
  const handleOCRDataExtracted = (extractedData: {
    patient_name: string;
    patient_phone: string;
    patient_email: string;
    notes: string;
  }) => {
    if (extractedData.patient_name) {
      setValue('patient_name', extractedData.patient_name);
    }
    if (extractedData.patient_phone) {
      setValue('patient_phone', extractedData.patient_phone);
    }
    if (extractedData.patient_email) {
      setValue('patient_email', extractedData.patient_email);
    }
    if (extractedData.notes) {
      const currentNotes = watch('notes') || '';
      const newNotes = currentNotes ? `${currentNotes}\n\n${extractedData.notes}` : extractedData.notes;
      setValue('notes', newNotes);
    }
  };

  // Fetch doctors with error handling
  const { data: doctors, isLoading: doctorsLoading, error: doctorsError } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, specialty, department')
        .eq('role', 'doctor')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check for appointment conflicts
  const checkAppointmentConflict = async (date: string, time: string, doctorId?: string) => {
    if (!doctorId) return false;

    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .in('status', ['scheduled', 'confirmed']);

    if (error) throw error;
    return data.length > 0;
  };

  const createAppointment = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      // Additional validation
      if (!validateAppointmentTime(data.appointment_date, data.appointment_time)) {
        throw new Error('Appointment must be at least 30 minutes from now');
      }

      if (!validateBusinessHours(data.appointment_time)) {
        throw new Error('Appointments can only be scheduled between 8:00 AM and 6:00 PM');
      }

      // Check for conflicts if doctor is selected
      if (data.doctor_id) {
        const hasConflict = await checkAppointmentConflict(
          data.appointment_date, 
          data.appointment_time, 
          data.doctor_id
        );
        
        if (hasConflict) {
          throw new Error('This time slot is already booked for the selected doctor');
        }
      }

      // Use the new book_appointment function
      const { data: appointmentId, error } = await supabase.rpc('book_appointment', {
        p_patient_name: data.patient_name.trim(),
        p_department: data.department,
        p_appointment_date: data.appointment_date,
        p_appointment_time: data.appointment_time,
        p_patient_phone: data.patient_phone?.trim() || null,
        p_patient_email: data.patient_email?.trim() || null,
        p_doctor_id: data.doctor_id || null,
        p_notes: data.notes?.trim() || null
      });

      if (error) throw error;
      return appointmentId;
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
    onError: (error: Error) => {
      if (error.message.includes('time slot')) {
        setError('appointment_time', { message: error.message });
      } else if (error.message.includes('30 minutes')) {
        setError('appointment_time', { message: error.message });
      } else if (error.message.includes('business hours')) {
        setError('appointment_time', { message: error.message });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create appointment",
          variant: "destructive",
        });
      }
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
    'Radiology',
    'Oncology',
    'Dermatology'
  ];

  return (
    <div className="space-y-6">
      {/* OCR Upload Component */}
      <OCRPrescriptionUpload onDataExtracted={handleOCRDataExtracted} />

      {/* Existing Appointment Form */}
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
          {doctorsError && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load doctors. Please refresh the page.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="patient_name">Patient Name *</Label>
              <Input
                id="patient_name"
                {...register('patient_name')}
                placeholder="Enter patient full name"
                className={errors.patient_name ? 'border-red-500' : ''}
              />
              {errors.patient_name && (
                <p className="text-sm text-red-500 mt-1">{errors.patient_name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient_phone">Phone Number</Label>
                <Input
                  id="patient_phone"
                  {...register('patient_phone')}
                  placeholder="+1234567890"
                  className={errors.patient_phone ? 'border-red-500' : ''}
                />
                {errors.patient_phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.patient_phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="patient_email">Email</Label>
                <Input
                  id="patient_email"
                  type="email"
                  {...register('patient_email')}
                  placeholder="patient@example.com"
                  className={errors.patient_email ? 'border-red-500' : ''}
                />
                {errors.patient_email && (
                  <p className="text-sm text-red-500 mt-1">{errors.patient_email.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
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
                )}
              />
              {errors.department && (
                <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="doctor_id">Doctor (Optional)</Label>
              <Controller
                name="doctor_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={doctorsLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder={doctorsLoading ? "Loading doctors..." : "Select doctor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors?.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.first_name} {doctor.last_name}
                          {doctor.specialty && ` - ${doctor.specialty}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appointment_date">Date *</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  {...register('appointment_date')}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.appointment_date ? 'border-red-500' : ''}
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
                  {...register('appointment_time')}
                  min="08:00"
                  max="18:00"
                  step="900" // 15-minute intervals
                  className={errors.appointment_time ? 'border-red-500' : ''}
                />
                {errors.appointment_time && (
                  <p className="text-sm text-red-500 mt-1">{errors.appointment_time.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Business hours: 8:00 AM - 6:00 PM
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                {...register('notes')}
                placeholder="Additional notes (optional)"
                maxLength={500}
              />
              {errors.notes && (
                <p className="text-sm text-red-500 mt-1">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Appointment'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImprovedAppointmentForm;
