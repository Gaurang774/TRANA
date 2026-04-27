
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Calendar, 
  Pill, 
  Settings, 
  LogOut, 
  X, 
  Activity,
  Bed,
  Route,
  FileText,
  Puzzle,
  BarChart3,
  Heart,
  Home,
  Map,
  Globe
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
    { path: '/routes', icon: <Route size={20} />, label: 'Route Planning' },
    { path: '/healthcare', icon: <Globe size={20} />, label: 'Healthcare Portal', comingSoon: true },
    { path: '/appointments', icon: <Calendar size={20} />, label: 'Appointments', comingSoon: true },
    { path: '/medicines', icon: <Pill size={20} />, label: 'Medicines', comingSoon: true },
    { path: '/beds', icon: <Bed size={20} />, label: 'Bed Management', comingSoon: true },
    { path: '/plugins', icon: <Puzzle size={20} />, label: 'Plugins', comingSoon: true },
    { path: '/reports', icon: <FileText size={20} />, label: 'Reports', comingSoon: true },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings', comingSoon: true },
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
          fixed inset-y-0 left-0 w-64 glass transform z-30 transition-all duration-300 ease-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="px-6 py-6 border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-medical group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4 space-y-0.5">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Trana</h1>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Medical EMS</p>
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
                    flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group font-medium
                    ${isActive(item.path) 
                      ? 'medical-gradient text-white shadow-medical scale-105' 
                      : 'text-foreground/80 hover:bg-foreground/5 hover:scale-102 hover:shadow-sm'
                    }
                  `}
                  onClick={isOpen ? onClose : undefined}
                >
                  <span className={`
                    transition-all duration-300
                    ${isActive(item.path) ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="ml-3 flex-1">{item.label}</span>
                  {item.comingSoon && (
                    <Badge className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0 dark:bg-amber-900/30 dark:text-amber-400">
                      Soon
                    </Badge>
                  )}
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
