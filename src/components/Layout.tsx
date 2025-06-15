
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EnhancedHeader from '@/components/EnhancedHeader';
import EmergencySidebar from '@/components/EmergencySidebar';
import { DevicePreviewProvider } from '@/components/enhanced/DevicePreviewProvider';
import { DevicePreviewContainer } from '@/components/enhanced/DevicePreviewContainer';

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
    <DevicePreviewProvider>
      <DevicePreviewContainer>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex transition-colors duration-300">
          {/* Sidebar */}
          <EmergencySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col md:ml-64">
            <EnhancedHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            
            <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </DevicePreviewContainer>
    </DevicePreviewProvider>
  );
};

export default Layout;
