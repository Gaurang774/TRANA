
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface EmergencyHeaderProps {
  toggleSidebar: () => void;
}

const EmergencyHeader = ({ toggleSidebar }: EmergencyHeaderProps) => {
  const { toast } = useToast();
  
  const handleNotificationsClick = () => {
    toast({
      title: "Emergency Notifications",
      description: "No new emergency alerts at this time.",
    });
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
          <div className="h-8 w-8 bg-medical-green rounded-full flex items-center justify-center">
            <span className="text-white font-bold">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmergencyHeader;
