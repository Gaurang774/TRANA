
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EmergencyHeader from '@/components/EmergencyHeader';
import EmergencySidebar from '@/components/EmergencySidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Close sidebar on route change (mobile only)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <EmergencySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <EmergencyHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
