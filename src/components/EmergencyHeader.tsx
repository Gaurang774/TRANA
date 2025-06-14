
import React from 'react';
import { Menu, Bell, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface EmergencyHeaderProps {
  toggleSidebar: () => void;
}

const EmergencyHeader = ({ toggleSidebar }: EmergencyHeaderProps) => {
  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-30 flex h-16 lg:h-18 items-center px-6 md:px-8 shadow-lg">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="md:hidden mr-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex-1 flex items-center">
        <div className="flex items-center group">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Trana
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider hidden md:block">
              Emergency Medical Services
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-gray-100 dark:hover:bg-gray-700 relative rounded-xl transition-all duration-200 hover:scale-105"
        >
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-sm animate-pulse"></div>
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
};

export default EmergencyHeader;
