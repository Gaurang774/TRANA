
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface RealTimeDataProps<T> {
  table: string;
  queryKey: string[];
  queryFn: () => Promise<T[]>;
  title?: string;
  description?: string;
  renderItem: (item: T) => React.ReactNode;
  enableRealtime?: boolean;
  refreshInterval?: number;
  className?: string;
  emptyMessage?: string;
  errorMessage?: string;
}

export function RealTimeData<T extends Record<string, any>>({
  table,
  queryKey,
  queryFn,
  title,
  description,
  renderItem,
  enableRealtime = true,
  refreshInterval,
  className,
  emptyMessage = 'No data available',
  errorMessage = 'Failed to load data'
}: RealTimeDataProps<T>) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        console.error(`Query error for ${table}:`, error);
        // Return empty array instead of throwing to prevent infinite loops
        return [];
      }
    },
    refetchInterval: refreshInterval,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      // Don't retry on permission errors
      if (error?.code === '42501' || error?.code === '42P01') {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Real-time subscription with proper cleanup
  useEffect(() => {
    if (!enableRealtime || !mountedRef.current) return;

    // Clean up existing channel first
    if (channelRef.current) {
      console.log(`Cleaning up existing channel for ${table}`);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const setupRealtimeSubscription = async () => {
      try {
        console.log(`Setting up real-time subscription for table: ${table}`);
        
        const channel = supabase
          .channel(`realtime-${table}-${Math.random()}`) // Add random suffix to prevent conflicts
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: table
            },
            (payload) => {
              if (!mountedRef.current) return;
              
              console.log('Real-time update received:', payload);
              setLastUpdate(new Date());
              
              // Invalidate and refetch the query
              queryClient.invalidateQueries({ queryKey });
              
              // Show toast notification for updates
              if (payload.eventType === 'INSERT') {
                toast({
                  title: "New data available",
                  description: `New ${table} record added`,
                });
              }
            }
          )
          .subscribe((status) => {
            if (!mountedRef.current) return;
            
            console.log(`Real-time subscription status for ${table}:`, status);
            
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
              setIsConnected(false);
              
              if (status === 'CHANNEL_ERROR') {
                toast({
                  title: "Connection Error",
                  description: "Real-time updates temporarily unavailable",
                  variant: "destructive"
                });
              }
            }
          });

        channelRef.current = channel;
      } catch (error) {
        console.error(`Error setting up real-time subscription for ${table}:`, error);
        setIsConnected(false);
      }
    };

    // Delay subscription setup to prevent rapid creation/destruction
    const timeoutId = setTimeout(setupRealtimeSubscription, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (channelRef.current) {
        console.log(`Cleaning up real-time subscription for table: ${table}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [enableRealtime, table, queryClient, queryKey, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
    setLastUpdate(new Date());
  }, [refetch]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-red-600">Connection Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">
            {error?.code === '42P01' 
              ? `Table "${table}" not found in database`
              : error?.code === '42501'
              ? `Access denied to table "${table}"`
              : errorMessage
            }
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center space-x-2">
            {enableRealtime && (
              <Badge variant={isConnected ? 'default' : 'secondary'} className="flex items-center space-x-1">
                {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                <span>{isConnected ? 'Live' : 'Offline'}</span>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefetching}
            >
              <RefreshCw className={cn('h-4 w-4', isRefetching && 'animate-spin')} />
            </Button>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index}>
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
