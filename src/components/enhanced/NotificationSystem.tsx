
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'ambulance' | 'bed' | 'appointment';
  timestamp: Date;
  read: boolean;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission);
      }
    }

    // Set up real-time listeners with error handling
    const setupRealtimeListeners = () => {
      try {
        const emergencyChannel = supabase
          .channel('emergency-notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'emergencies'
            },
            (payload) => {
              const emergency = payload.new;
              const notification: PushNotification = {
                id: `emergency-${emergency.id}`,
                title: 'New Emergency Reported',
                message: `${emergency.type} emergency at ${emergency.location}`,
                type: 'emergency',
                timestamp: new Date(),
                read: false
              };

              setNotifications(prev => [notification, ...prev.slice(0, 19)]);
              
              // Show browser notification
              if (permission === 'granted') {
                new Notification(notification.title, {
                  body: notification.message,
                  icon: '/favicon.ico',
                  tag: notification.id
                });
              }

              // Show toast notification
              toast({
                title: notification.title,
                description: notification.message,
                variant: emergency.priority === 'critical' ? 'destructive' : 'default'
              });
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'ambulances'
            },
            (payload) => {
              const ambulance = payload.new;
              if (ambulance.status === 'dispatched') {
                const notification: PushNotification = {
                  id: `ambulance-${ambulance.id}-${Date.now()}`,
                  title: 'Ambulance Dispatched',
                  message: `${ambulance.ambulance_number} has been dispatched`,
                  type: 'ambulance',
                  timestamp: new Date(),
                  read: false
                };

                setNotifications(prev => [notification, ...prev.slice(0, 19)]);
                
                toast({
                  title: notification.title,
                  description: notification.message
                });
              }
            }
          )
          .subscribe((status) => {
            console.log('Notification subscription status:', status);
            if (status === 'SUBSCRIBED') {
              setConnectionError(false);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              setConnectionError(true);
              console.error('Notification system connection error');
            }
          });

        return emergencyChannel;
      } catch (error) {
        console.error('Error setting up real-time listeners:', error);
        setConnectionError(true);
        return null;
      }
    };

    const channel = setupRealtimeListeners();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [permission, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
        {connectionError && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center space-x-2">
              {connectionError && (
                <AlertCircle className="h-4 w-4 text-red-500" title="Connection Error" />
              )}
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {connectionError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Real-time notifications temporarily unavailable
                </p>
              </div>
            )}
            
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
