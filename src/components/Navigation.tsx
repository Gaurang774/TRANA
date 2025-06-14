
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
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
