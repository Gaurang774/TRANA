
import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface EmergencyHeaderProps {
  toggleSidebar: () => void;
}

const EmergencyHeader = ({ toggleSidebar }: EmergencyHeaderProps) => {
  return (
    <header className="bg-card sticky top-0 z-30 flex h-16 items-center border-b px-4 md:px-6 shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="md:hidden mr-2"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-2xl">Trana</h1>
        <p className="text-sm text-muted-foreground hidden md:block">
          Emergency Medical Services Management
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
};

export default EmergencyHeader;
