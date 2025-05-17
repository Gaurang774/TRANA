
import React, { useEffect, useState } from 'react';
import { Bell, Menu, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface EmergencyHeaderProps {
  toggleSidebar: () => void;
}

const EmergencyHeader = ({ toggleSidebar }: EmergencyHeaderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState('');
  
  useEffect(() => {
    // Check if user is logged in
    const storedUserType = localStorage.getItem('userType');
    const storedUserEmail = localStorage.getItem('userEmail');
    
    if (storedUserType && storedUserEmail) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
      
      // Create initials from email (first letter + first letter after @)
      const emailParts = storedUserEmail.split('@');
      if (emailParts.length > 1) {
        const initials = (emailParts[0][0] + emailParts[1][0]).toUpperCase();
        setUserInitials(initials);
      } else {
        setUserInitials('U');
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  const handleNotificationsClick = () => {
    toast({
      title: "Emergency Notifications",
      description: "No new emergency alerts at this time.",
    });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    navigate('/settings');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <div className="h-8 w-8 bg-medical-blue rounded-md flex items-center justify-center">
              <span className="text-white font-bold">ER</span>
            </div>
            <h1 className="text-xl font-bold ml-2 text-medical-blue">
              MediEmergency
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNotificationsClick}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-medical-red rounded-full"></span>
          </Button>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-1">
              <div 
                onClick={handleProfileClick}
                className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer ${
                  userType === 'doctor' ? 'bg-medical-blue' : 'bg-medical-green'
                }`}
              >
                <span className="text-white font-bold">{userInitials}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-sm"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLoginClick}
              className="flex items-center"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default EmergencyHeader;
