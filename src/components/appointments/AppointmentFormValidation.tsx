
import { z } from 'zod';

export const appointmentFormSchema = z.object({
  patient_name: z.string()
    .min(2, 'Patient name must be at least 2 characters')
    .max(100, 'Patient name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Patient name can only contain letters and spaces'),
  
  patient_phone: z.string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: 'Please enter a valid phone number'
    }),
  
  patient_email: z.string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Please enter a valid email address'
    }),
  
  doctor_id: z.string().optional(),
  
  department: z.string()
    .min(1, 'Department is required'),
  
  appointment_date: z.string()
    .min(1, 'Appointment date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Appointment date cannot be in the past'),
  
  appointment_time: z.string()
    .min(1, 'Appointment time is required')
    .refine((time) => {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(time);
    }, 'Please enter a valid time'),
  
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export const validateAppointmentTime = (date: string, time: string): boolean => {
  const appointmentDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  
  // Check if appointment is at least 30 minutes from now
  const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
  
  return appointmentDateTime >= thirtyMinutesFromNow;
};

export const validateBusinessHours = (time: string): boolean => {
  const [hours, minutes] = time.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;
  
  // Business hours: 8:00 AM to 6:00 PM
  const startTime = 8 * 60; // 8:00 AM
  const endTime = 18 * 60; // 6:00 PM
  
  return timeInMinutes >= startTime && timeInMinutes <= endTime;
};
