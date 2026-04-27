
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useNotifications } from '@/hooks/useNotifications';
import { useOfflineMap } from '@/hooks/useOfflineMap';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { DevicePreviewSelector } from '@/components/enhanced/DevicePreviewSelector';
import { 
  Bell, 
  Menu, 
  Wifi, 
  WifiOff, 
  Settings,
  Download,
  Activity
} from 'lucide-react';

interface EnhancedHeaderProps {
  toggleSidebar: () => void;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();
  const { isOnline, isCacheAvailable } = useOfflineMap();

  return (
    <header className="sticky top-0 z-20 glass px-6 py-4 flex items-center justify-between border-x-0 border-t-0 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="md:hidden hover:bg-primary/10 rounded-xl"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Activity className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-xl text-gray-900 dark:text-white tracking-tighter">TRANA</span>
            <div className="h-0.5 w-full bg-primary/30 rounded-full group-hover:bg-primary transition-colors"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:inline">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-600">
              <WifiOff className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:inline">
                Offline {isCacheAvailable ? '(Cached)' : '(No Cache)'}
              </span>
            </div>
          )}
        </div>

        {/* Device Preview Selector */}
        <DevicePreviewSelector />

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
          
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50">
              <NotificationCenter />
            </div>
          )}
        </div>

        <ThemeToggle />
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default EnhancedHeader;
