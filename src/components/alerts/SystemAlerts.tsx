
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Ambulance, Bed, X, Bell } from 'lucide-react';
import { useAmbulances, useHospitalBeds, useEmergencies } from '@/hooks/useSupabaseQuery';
import { cn } from '@/lib/utils';

interface SystemAlert {
  id: string;
  type: 'low-ambulances' | 'emergency-surge' | 'no-beds';
  title: string;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: Date;
}

export function SystemAlerts() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  
  const { data: ambulances } = useAmbulances({ refetchInterval: 30000 });
  const { data: hospitalBeds } = useHospitalBeds({ refetchInterval: 30000 });
  const { data: emergencies } = useEmergencies({ refetchInterval: 15000 });

  useEffect(() => {
    const newAlerts: SystemAlert[] = [];

    // Check for low ambulance availability
    if (ambulances) {
      const availableAmbulances = ambulances.filter(a => a.status === 'available').length;
      const totalAmbulances = ambulances.length;
      const availabilityRate = totalAmbulances > 0 ? (availableAmbulances / totalAmbulances) * 100 : 0;

      if (availabilityRate < 30 && availabilityRate > 0) {
        newAlerts.push({
          id: 'low-ambulances',
          type: 'low-ambulances',
          title: 'Low Ambulance Availability',
          message: `Only ${availableAmbulances} of ${totalAmbulances} ambulances available (${Math.round(availabilityRate)}%)`,
          severity: availabilityRate < 15 ? 'critical' : 'warning',
          timestamp: new Date()
        });
      } else if (availableAmbulances === 0 && totalAmbulances > 0) {
        newAlerts.push({
          id: 'no-ambulances',
          type: 'low-ambulances',
          title: 'No Ambulances Available',
          message: 'All ambulances are currently dispatched or unavailable',
          severity: 'critical',
          timestamp: new Date()
        });
      }
    }

    // Check for emergency surge
    if (emergencies) {
      const recentEmergencies = emergencies.filter(e => {
        const emergencyTime = new Date(e.created_at);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return emergencyTime > oneHourAgo;
      });

      if (recentEmergencies.length > 5) {
        newAlerts.push({
          id: 'emergency-surge',
          type: 'emergency-surge',
          title: 'Emergency Case Surge Detected',
          message: `${recentEmergencies.length} emergencies reported in the last hour`,
          severity: recentEmergencies.length > 10 ? 'critical' : 'warning',
          timestamp: new Date()
        });
      }
    }

    // Check for bed availability
    if (hospitalBeds) {
      const availableBeds = hospitalBeds.filter(b => b.status === 'available').length;
      const totalBeds = hospitalBeds.length;
      const bedAvailabilityRate = totalBeds > 0 ? (availableBeds / totalBeds) * 100 : 0;

      if (bedAvailabilityRate < 20 && bedAvailabilityRate > 0) {
        newAlerts.push({
          id: 'low-beds',
          type: 'no-beds',
          title: 'Low Bed Availability',
          message: `Only ${availableBeds} of ${totalBeds} beds available (${Math.round(bedAvailabilityRate)}%)`,
          severity: bedAvailabilityRate < 10 ? 'critical' : 'warning',
          timestamp: new Date()
        });
      } else if (availableBeds === 0 && totalBeds > 0) {
        newAlerts.push({
          id: 'no-beds-critical',
          type: 'no-beds',
          title: 'No Beds Available',
          message: 'All hospital beds are currently occupied',
          severity: 'critical',
          timestamp: new Date()
        });
      }
    }

    setAlerts(newAlerts.filter(alert => !dismissedAlerts.has(alert.id)));
  }, [ambulances, hospitalBeds, emergencies, dismissedAlerts]);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'low-ambulances':
        return <Ambulance className="h-5 w-5" />;
      case 'no-beds':
        return <Bed className="h-5 w-5" />;
      case 'emergency-surge':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.severity === 'critical' ? 'destructive' : 'default'}
          className={cn(
            "relative animate-fade-in",
            alert.severity === 'critical' 
              ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/50" 
              : "border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-full",
                alert.severity === 'critical' 
                  ? "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                  : "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
              )}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTitle className="text-sm font-semibold">
                    {alert.title}
                  </AlertTitle>
                  <Badge 
                    variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">
                  {alert.message}
                </AlertDescription>
                <p className="text-xs text-gray-500 mt-1">
                  {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.id)}
              className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
}
