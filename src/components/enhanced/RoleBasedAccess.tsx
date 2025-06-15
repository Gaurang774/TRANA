
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface RoleBasedAccessProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleBasedAccess({ allowedRoles, children, fallback }: RoleBasedAccessProps) {
  const { role, loading, isAdmin } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Admin users have access to everything
  if (isAdmin || (role && allowedRoles.includes(role))) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
      <Shield className="h-4 w-4" />
      <AlertDescription>
        You don't have permission to access this feature. Required role: {allowedRoles.join(' or ')}.
        Current role: {role || 'No role assigned'}.
      </AlertDescription>
    </Alert>
  );
}
