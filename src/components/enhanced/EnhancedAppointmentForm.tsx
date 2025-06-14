
import React from 'react';
import { z } from 'zod';
import { InteractiveForm, FormField } from './InteractiveForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateAppointment } from '@/hooks/useSupabaseQuery';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';

const appointmentSchema = z.object({
  patient_name: z.string().min(2, 'Patient name must be at least 2 characters'),
  patient_phone: z.string().optional(),
  patient_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  department: z.string().min(1, 'Department is required'),
  doctor_id: z.string().optional(),
  appointment_date: z.string().min(1, 'Date is required'),
  appointment_time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export function EnhancedAppointmentForm({ onClose }: { onClose: () => void }) {
  const createAppointment = useCreateAppointment();

  // Fetch doctors for the dropdown
  const { data: doctors } = useQuery({
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
  });

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

  const appointmentFields: FormField[] = [
    {
      name: 'patient_name',
      label: 'Patient Name',
      type: 'input',
      placeholder: 'Enter patient full name',
      required: true,
    },
    {
      name: 'patient_phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1234567890',
    },
    {
      name: 'patient_email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'patient@example.com',
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: departments.map(dept => ({ value: dept, label: dept })),
    },
    {
      name: 'doctor_id',
      label: 'Preferred Doctor (Optional)',
      type: 'select',
      options: doctors?.map(doctor => ({
        value: doctor.id,
        label: `Dr. ${doctor.first_name} ${doctor.last_name}${doctor.specialty ? ` - ${doctor.specialty}` : ''}`,
      })) || [],
    },
    {
      name: 'appointment_date',
      label: 'Appointment Date',
      type: 'date',
      required: true,
    },
    {
      name: 'appointment_time',
      label: 'Appointment Time',
      type: 'time',
      required: true,
    },
    {
      name: 'notes',
      label: 'Additional Notes',
      type: 'textarea',
      placeholder: 'Any special requirements or notes...',
    },
  ];

  const handleSubmit = async (data: AppointmentFormData) => {
    const appointmentData = {
      p_patient_name: data.patient_name.trim(),
      p_department: data.department,
      p_appointment_date: data.appointment_date,
      p_appointment_time: data.appointment_time,
      p_patient_phone: data.patient_phone?.trim() || null,
      p_patient_email: data.patient_email?.trim() || null,
      p_doctor_id: data.doctor_id || null,
      p_notes: data.notes?.trim() || null,
    };

    await createAppointment.mutateAsync(appointmentData);
    onClose();
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>Schedule New Appointment</CardTitle>
            <CardDescription>
              Book an appointment with our medical professionals
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <InteractiveForm
          fields={appointmentFields.map(field => ({
            ...field,
            // Set minimum date for date field
            ...(field.type === 'date' && { 
              className: `min-date-${minDate}` 
            }),
            // Set business hours for time field
            ...(field.type === 'time' && { 
              placeholder: 'Business hours: 8:00 AM - 6:00 PM' 
            }),
          }))}
          schema={appointmentSchema}
          onSubmit={handleSubmit}
          submitText="Schedule Appointment"
          className="space-y-6"
        >
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">Business Hours</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Monday - Friday: 8:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 2:00 PM<br />
                  Sunday: Emergency only
                </p>
              </div>
            </div>
          </div>
        </InteractiveForm>
      </CardContent>
    </Card>
  );
}
