
import React from 'react';
import { Menu, Bell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface EmergencyHeaderProps {
  toggleSidebar: () => void;
}

const EmergencyHeader = ({ toggleSidebar }: EmergencyHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-30 flex h-16 items-center border-b border-gray-100 px-6 md:px-8">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="md:hidden mr-3 hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex-1 flex items-center">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <h1 className="text-xl font-light text-gray-900">Trana</h1>
            <p className="text-xs text-gray-500 hidden md:block font-light">
              Emergency Medical Services
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
};

export default EmergencyHeader;
