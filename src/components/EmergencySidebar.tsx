
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
          fixed inset-y-0 left-0 w-64 bg-white border-r border-neutral-200 transform z-30 transition-transform duration-300 ease-in-out shadow-large
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="px-6 py-6 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-medical-red rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-neutral-900">Trana</h1>
              <p className="text-xs text-neutral-500">Medical EMS</p>
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
                    flex items-center px-4 py-3 text-neutral-600 rounded-lg transition-all duration-200 group
                    ${isActive(item.path) 
                      ? 'bg-medical-blue text-white shadow-soft' 
                      : 'hover:bg-neutral-100 hover:text-neutral-900'
                    }
                  `}
                  onClick={isOpen ? onClose : undefined}
                >
                  <span className={`
                    ${isActive(item.path) ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600'}
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
