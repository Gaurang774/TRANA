
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Ambulance, 
  Bell, 
  Map, 
  FileText, 
  Settings as SettingsIcon,
  Bed
} from 'lucide-react';

interface EmergencySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencySidebar = ({ isOpen, onClose }: EmergencySidebarProps) => {
  const location = useLocation();
  
  // Navigation items with icons and labels
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/emergency', icon: <Bell size={20} />, label: 'Emergency' },
    { path: '/beds', icon: <Bed size={20} />, label: 'Bed Management' },
    { path: '/routes', icon: <Map size={20} />, label: 'Route Planning' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' }
  ];

  const isActive = (path: string) => location.pathname === path;
  
  // Overlay for mobile
  const overlay = isOpen && (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
      onClick={onClose}
    />
  );

  return (
    <>
      {overlay}
      
      <div 
        className={`
          fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform z-30 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <Ambulance className="h-8 w-8 text-medical-red" />
            <h1 className="ml-3 text-xl font-bold text-gray-800">Trana</h1>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors
                    ${isActive(item.path) ? 'bg-medical-blue text-white' : 'hover:bg-gray-100'}
                  `}
                  onClick={isOpen ? onClose : undefined}
                >
                  <span className={isActive(item.path) ? 'text-white' : 'text-medical-blue'}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default EmergencySidebar;
