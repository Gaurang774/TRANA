
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ambulance,
  BadgeAlert, 
  Users, 
  Bed, 
  Map,
  FileText, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink = ({ to, icon, label, active }: SidebarLinkProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
      active 
        ? "bg-white text-medical-blue font-medium" 
        : "text-white/90 hover:text-white hover:bg-white/10"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

interface EmergencySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencySidebar = ({ isOpen, onClose }: EmergencySidebarProps) => {
  const location = useLocation();
  
  const sidebarLinks = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/ambulances", icon: <Ambulance size={20} />, label: "Ambulances" },
    { to: "/emergency", icon: <BadgeAlert size={20} />, label: "Emergency" },
    { to: "/patients", icon: <Users size={20} />, label: "Patients" },
    { to: "/beds", icon: <Bed size={20} />, label: "Bed Management" },
    { to: "/routes", icon: <Map size={20} />, label: "Route Planning" },
    { to: "/reports", icon: <FileText size={20} />, label: "Reports" },
    { to: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  // Mobile overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-medical-blue fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-center mb-4">
            <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center">
              <span className="text-medical-blue font-bold">ER</span>
            </div>
            <h2 className="text-xl font-bold ml-2 text-white">
              MediEmergency
            </h2>
          </div>
          <div className="text-white/80 text-xs text-center">
            Smart Emergency Healthcare System
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              active={location.pathname === link.to}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-white/10 rounded-md p-3 text-white text-sm">
            <p className="font-medium">Emergency Hotline</p>
            <p className="text-white/80">+1 (888) 911-HELP</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default EmergencySidebar;
