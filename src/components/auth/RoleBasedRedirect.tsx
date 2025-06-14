
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole, UserRole } from '@/hooks/useUserRole';

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

// Define role-based routes
const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/', // Admin dashboard
  doctor: '/appointments', // Doctor appointments
  ambulance: '/emergency', // Ambulance emergency dispatch
  patient: '/appointments', // Patient appointments
  staff: '/beds', // Staff bed management
};

export const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const { role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role) {
      const targetRoute = ROLE_ROUTES[role];
      const currentPath = window.location.pathname;
      
      // Only redirect if we're on the root path to avoid infinite redirects
      if (currentPath === '/' && targetRoute !== '/') {
        console.log(`Redirecting ${role} user to ${targetRoute}`);
        navigate(targetRoute);
      }
    }
  }, [role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
