
import React, { useState, useEffect, useCallback } from 'react';
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
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey,
    queryFn,
    refetchInterval: refreshInterval,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Real-time subscription
  useEffect(() => {
    if (!enableRealtime) return;

    console.log(`Setting up real-time subscription for table: ${table}`);
    
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
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
        console.log(`Real-time subscription status for ${table}:`, status);
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'CHANNEL_ERROR') {
          toast({
            title: "Connection Error",
            description: "Real-time updates temporarily unavailable",
            variant: "destructive"
          });
        }
      });

    return () => {
      console.log(`Cleaning up real-time subscription for table: ${table}`);
      supabase.removeChannel(channel);
    };
  }, [enableRealtime, table, queryClient, queryKey, toast]);

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
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">{errorMessage}</p>
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
              <Badge variant={isConnected ? 'default' : 'destructive'} className="flex items-center space-x-1">
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
