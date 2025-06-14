
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  AlertTriangle, 
  Map, 
  FileText, 
  Settings as SettingsIcon,
  Bed,
  Calendar,
  Heart
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
    { path: '/emergency', icon: <AlertTriangle size={20} />, label: 'Emergency' },
    { path: '/appointments', icon: <Calendar size={20} />, label: 'Appointments' },
    { path: '/beds', icon: <Bed size={20} />, label: 'Bed Management' },
    { path: '/routes', icon: <Map size={20} />, label: 'Route Planning' },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reports' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' }
  ];

  const isActive = (path: string) => location.pathname === path;
  
  // Overlay for mobile
  const overlay = isOpen && (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
      onClick={onClose}
    />
  );

  return (
    <>
      {overlay}
      
      <div 
        className={`
          fixed inset-y-0 left-0 w-64 bg-white/95 backdrop-blur-sm border-r border-gray-100 transform z-30 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <h1 className="text-xl font-light text-gray-900">Trana</h1>
              <p className="text-xs text-gray-500 font-light">Medical EMS</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-gray-600 rounded-xl transition-all duration-200 group
                    ${isActive(item.path) 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={isOpen ? onClose : undefined}
                >
                  <span className={`
                    ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                    transition-colors duration-200
                  `}>
                    {item.icon}
                  </span>
                  <span className="ml-3 font-medium">{item.label}</span>
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
