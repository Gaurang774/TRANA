
import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'doctor' | 'ambulance' | 'patient' | 'staff';

// Mock user role hook for public access mode
export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>('admin'); // Default to admin for full access
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In public mode, grant admin role for full access
    setRole('admin');
    setLoading(false);
  }, []);

  return { role, loading };
};
