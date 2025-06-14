
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        console.log('Fetching profile for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setUserName(user.email || '');
        } else if (profile) {
          console.log('Profile data:', profile);
          const fullName = [profile.first_name, profile.last_name]
            .filter(Boolean)
            .join(' ');
          setUserName(fullName || user.email || '');
        } else {
          setUserName(user.email || '');
        }
      } else {
        setUserName('');
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getRoleDisplayName = (role: string | null) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Heart className="h-6 w-6 text-red-500 mr-2" />
            <span className="text-xl font-bold text-gray-900">TRANA</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">
                    <span className="text-gray-600">Hello, {userName}</span>
                    {role && (
                      <div className="text-xs text-blue-600 font-medium">
                        {getRoleDisplayName(role)}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600">Public Access Mode</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
