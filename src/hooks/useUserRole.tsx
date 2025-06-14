
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'doctor' | 'ambulance' | 'patient' | 'staff';

// Enhanced user role hook with proper error handling
export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>('admin'); // Default to admin for public access
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();

  useEffect(() => {
    const determineUserRole = async () => {
      setLoading(true);
      setError(null);

      try {
        // In public mode without authentication, grant admin role for full access
        if (!user || !session) {
          setRole('admin');
          setLoading(false);
          return;
        }

        // If authenticated, you could fetch role from user metadata or database
        // For now, default to admin for full functionality
        const userRole = user.user_metadata?.role as UserRole || 'admin';
        setRole(userRole);
        
      } catch (err) {
        console.error('Error determining user role:', err);
        setError('Failed to determine user role');
        // Fallback to admin to ensure app functionality
        setRole('admin');
      } finally {
        setLoading(false);
      }
    };

    determineUserRole();
  }, [user, session]);

  return { 
    role, 
    loading, 
    error,
    hasRole: (requiredRole: UserRole) => role === requiredRole || role === 'admin',
    isAdmin: role === 'admin'
  };
};
