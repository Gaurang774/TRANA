
import React, { useRef } from 'react';
import Layout from '@/components/Layout';
import GoogleMap from '@/components/maps/GoogleMap';
import RoutePlanningForm from '@/components/route/RoutePlanningForm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Navigation, 
  LocateFixed, 
  RotateCcw, 
  X, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Users, 
  Sparkles,
  MapPin
} from 'lucide-react';

const RoutePlanning = () => {
  const mapRef = useRef<any>(null);
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [routeCities, setRouteCities] = React.useState({ origin: '', destination: '' });
  const [routeInfo, setRouteInfo] = React.useState({ distance: '-', duration: '-', nextTurn: 'Continue straight' });

  const handleRouteCalculate = (origin: string, destination: string) => {
    setRouteCities({ origin, destination });
    if (mapRef.current && mapRef.current.calculateRoute) {
      mapRef.current.calculateRoute(origin, destination);
      setIsNavigating(true);
      setRouteInfo({
        distance: '425 km',
        duration: '7h 15m',
        nextTurn: `Exit NH-48 towards ${destination}`
      });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Route Planning & Navigation</h1>
          <p className="text-gray-500">Professional tracking for city-to-city emergency transport</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Badge variant={isNavigating ? "default" : "secondary"} className={isNavigating ? "bg-emerald-600 shadow-lg shadow-emerald-500/20" : ""}>
            {isNavigating ? "INTER-CITY TRACKING ACTIVE" : "PLANNING MODE"}
          </Badge>
          {isNavigating && (
            <Button variant="ghost" size="sm" onClick={() => setIsNavigating(false)} className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold">
              <X className="h-4 w-4 mr-1" /> END TRIP
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative h-[650px]">
          <Card className="h-full overflow-hidden relative shadow-2xl border-primary/10">
            <CardContent className="p-0 h-full relative">
              {/* Turn-by-Turn Header (Mobile Style) */}
              {isNavigating && (
                <div className="absolute top-0 left-0 right-0 z-[20] p-4 animate-fade-in-down">
                  <div className="bg-[#004d40] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500/30 p-3 rounded-xl backdrop-blur-md">
                        <Navigation className="h-8 w-8 rotate-45" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-extrabold tracking-tighter">1.2 km</span>
                          <span className="text-emerald-300 text-sm font-bold uppercase tracking-widest">Next Turn</span>
                        </div>
                        <p className="text-lg font-medium opacity-90 leading-tight">{routeInfo.nextTurn}</p>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <Sparkles className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Map Component */}
              <GoogleMap 
                className="w-full h-full" 
                ref={mapRef}
              />

              {/* Floating Action Buttons */}
              {isNavigating && (
                <div className="absolute bottom-40 right-4 z-[20] flex flex-col gap-3">
                  <Button size="icon" variant="secondary" className="rounded-2xl shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-none h-14 w-14 group">
                    <LocateFixed className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-2xl shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-none h-14 w-14 group">
                    <RotateCcw className="h-7 w-7 text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
                  </Button>
                </div>
              )}

              {/* Bottom Details Sheet (Mobile Style) */}
              {isNavigating && (
                <div className="absolute bottom-0 left-0 right-0 z-[20] p-4 animate-fade-in-up">
                  <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl p-6 rounded-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border border-gray-200/50 dark:border-white/5">
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-6"></div>
                    
                    <div className="flex items-center justify-between mb-8">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{routeInfo.duration}</span>
                          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 font-bold">FASTEST</Badge>
                        </div>
                        <p className="text-base font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" /> {routeCities.origin} → {routeCities.destination}
                        </p>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {routeInfo.distance} • Arriving 11:30 PM
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-8 h-14 font-black text-lg shadow-xl shadow-red-500/30 animate-pulse">
                          EMERGENCY SOS
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <Button variant="ghost" className="flex flex-col h-auto py-4 gap-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight opacity-70">Add Stop</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="flex flex-col h-auto py-4 gap-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all"
                        onClick={() => mapRef.current?.toggleMapType()}
                      >
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl">
                          <Navigation className="h-6 w-6 text-emerald-600" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight opacity-70">Photo Type</span>
                      </Button>
                      <Button variant="ghost" className="flex flex-col h-auto py-4 gap-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl">
                          <AlertTriangle className="h-6 w-6 text-amber-600" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight opacity-70">Road Block</span>
                      </Button>
                      <Button variant="ghost" className="flex flex-col h-auto py-4 gap-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight opacity-70">Call Medic</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <RoutePlanningForm onRouteCalculate={handleRouteCalculate} />
        </div>
      </div>
    </Layout>
  );
};

export default RoutePlanning;
