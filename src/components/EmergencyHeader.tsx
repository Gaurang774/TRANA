
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell as BellIcon, 
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyHeaderProps {
  toggleSidebar: () => void;
}

const EmergencyHeader = ({ toggleSidebar }: EmergencyHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden mr-2"
            aria-label="Toggle Menu"
          >
            <Menu size={20} />
          </Button>
          
          <div className="relative ml-2 flex-1 md:flex-initial">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-8 py-1 pr-4 rounded-md bg-gray-50 focus:bg-white focus:ring-1 focus:ring-medical-blue/20 focus:outline-none border border-gray-200 w-full md:w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5 text-gray-500" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-medical-red"></span>
          </Button>
          
          <Link to="/settings" className="flex items-center">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-medical-blue/10 text-medical-blue">
              <User size={16} />
            </span>
            <span className="ml-2 text-sm font-medium hidden md:block">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default EmergencyHeader;
