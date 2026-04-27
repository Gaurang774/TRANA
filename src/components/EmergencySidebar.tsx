
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
          fixed inset-y-0 left-0 w-72 glass-card rounded-none border-y-0 border-l-0 transform z-30 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="px-8 py-10 border-b border-border/10">
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-white/20 dark:border-white/5 transition-transform duration-500 group-hover:scale-110">
                <Heart className="h-8 w-8 text-primary animate-pulse-medical" />
              </div>
            </div>
            <div className="ml-5">
              <h1 className="text-3xl font-black text-foreground tracking-tighter leading-none">Trana</h1>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1 opacity-70">Medical EMS</p>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-280px)] px-4 mt-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-5 py-4 rounded-2xl transition-all duration-500 group font-bold text-sm tracking-tight
                    ${isActive(item.path) 
                      ? 'bg-primary text-white shadow-[0_10px_25px_-5px_rgba(59,130,246,0.5)] scale-[1.02]' 
                      : 'text-foreground/60 hover:bg-white dark:hover:bg-white/5 hover:text-foreground hover:scale-[1.02]'
                    }
                  `}
                  onClick={isOpen ? onClose : undefined}
                >
                  <span className={`
                    transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110
                    ${isActive(item.path) ? 'text-white' : 'text-primary/70 group-hover:text-primary'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="ml-4 flex-1">{item.label}</span>
                  {item.comingSoon && (
                    <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary/50 group-hover:text-primary transition-colors">
                      Soon
                    </Badge>
                  )}
                  {isActive(item.path) && (
                    <div className="ml-2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl p-5 border border-emerald-500/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">System Health</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-white dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <p className="text-[10px] font-bold text-foreground/50 text-center uppercase tracking-tighter">94% Efficiency • 4 active nodes</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmergencySidebar;
