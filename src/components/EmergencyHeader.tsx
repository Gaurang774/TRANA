
import React from 'react';
import { Menu, Bell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface EmergencyHeaderProps {
  toggleSidebar: () => void;
}

const EmergencyHeader = ({ toggleSidebar }: EmergencyHeaderProps) => {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 flex h-16 items-center px-6 md:px-8 shadow-soft">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="md:hidden mr-3 hover:bg-neutral-100"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex-1 flex items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-medical-red rounded-lg mr-3">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Trana</h1>
            <p className="text-xs text-neutral-500 hidden md:block">
              Emergency Medical Services
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="hover:bg-neutral-100 relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-medical-red rounded-full"></div>
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
};

export default EmergencyHeader;
