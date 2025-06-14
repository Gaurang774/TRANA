
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden transition-all duration-300"
      onClick={onClose}
    />
  );

  return (
    <>
      {overlay}
      
      <div 
        className={`
          fixed inset-y-0 left-0 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transform z-30 transition-all duration-300 ease-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/50 dark:to-gray-600/50">
          <div className="flex items-center group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4 space-y-0.5">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Trana</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider">Medical EMS</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3.5 text-gray-700 dark:text-gray-200 rounded-2xl transition-all duration-200 group font-medium
                    ${isActive(item.path) 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                      : 'hover:bg-gray-100/80 dark:hover:bg-gray-700/50 hover:scale-102 hover:shadow-md'
                    }
                  `}
                  onClick={isOpen ? onClose : undefined}
                >
                  <span className={`
                    transition-all duration-200
                    ${isActive(item.path) ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  )}
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
