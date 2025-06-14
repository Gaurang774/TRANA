
import React from 'react';
import { z } from 'zod';
import { ModalForm } from './ModalForm';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';
import { useCreateEmergency } from '@/hooks/useSupabaseQuery';

const emergencySchema = z.object({
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Emergency type is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().optional(),
  caller_name: z.string().optional(),
  caller_phone: z.string().optional(),
  patient_name: z.string().optional(),
  patient_age: z.coerce.number().min(0).max(150).optional(),
  patient_gender: z.enum(['male', 'female', 'other']).optional(),
});

type EmergencyFormData = z.infer<typeof emergencySchema>;

const emergencyFields = [
  {
    name: 'location',
    label: 'Emergency Location',
    type: 'input' as const,
    placeholder: 'Enter address or location',
    required: true,
  },
  {
    name: 'type',
    label: 'Emergency Type',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'medical', label: 'Medical Emergency' },
      { value: 'accident', label: 'Traffic Accident' },
      { value: 'fire', label: 'Fire Emergency' },
      { value: 'cardiac', label: 'Cardiac Arrest' },
      { value: 'trauma', label: 'Trauma' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    name: 'priority',
    label: 'Priority Level',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'low', label: 'Low Priority' },
      { value: 'medium', label: 'Medium Priority' },
      { value: 'high', label: 'High Priority' },
      { value: 'critical', label: 'Critical Emergency' },
    ],
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea' as const,
    placeholder: 'Describe the emergency situation...',
  },
  {
    name: 'caller_name',
    label: 'Caller Name',
    type: 'input' as const,
    placeholder: 'Name of person reporting',
  },
  {
    name: 'caller_phone',
    label: 'Caller Phone',
    type: 'tel' as const,
    placeholder: '+1234567890',
  },
  {
    name: 'patient_name',
    label: 'Patient Name',
    type: 'input' as const,
    placeholder: 'Name of patient (if known)',
  },
  {
    name: 'patient_age',
    label: 'Patient Age',
    type: 'input' as const,
    placeholder: 'Age of patient',
  },
  {
    name: 'patient_gender',
    label: 'Patient Gender',
    type: 'select' as const,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
  },
];

export function QuickEmergencyForm() {
  const createEmergency = useCreateEmergency();

  const handleSubmit = async (data: EmergencyFormData) => {
    const emergencyData = {
      ...data,
      status: 'pending',
      emergency_number: `EMG-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    await createEmergency.mutateAsync(emergencyData);
  };

  return (
    <ModalForm
      trigger={
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Emergency
        </Button>
      }
      title="Report New Emergency"
      description="Please provide details about the emergency situation"
      fields={emergencyFields}
      schema={emergencySchema}
      onSubmit={handleSubmit}
      submitText="Report Emergency"
      className="max-w-2xl"
    />
  );
}
