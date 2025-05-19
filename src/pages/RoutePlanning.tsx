
import React, { useRef } from 'react';
import Layout from '@/components/Layout';
import GoogleMap from '@/components/maps/GoogleMap';
import RoutePlanningForm from '@/components/route/RoutePlanningForm';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Route, Settings } from 'lucide-react';

const RoutePlanning = () => {
  const mapRef = useRef<any>(null);

  const handleRouteCalculate = (origin: string, destination: string) => {
    // Reference the GoogleMap component's calculateRoute method
    if (mapRef.current && mapRef.current.calculateRoute) {
      mapRef.current.calculateRoute(origin, destination);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Route Planning</h1>
          <p className="text-gray-500">Plan optimal emergency routes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <GoogleMap className="w-full" />
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">
                  <Map className="mr-2 h-4 w-4" />
                  Route Information
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Route Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Route Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Distance</p>
                        <p className="font-medium" id="route-info-distance">-</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Estimated Time</p>
                        <p className="font-medium" id="route-info-time">-</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Traffic Conditions</p>
                        <p className="font-medium">Moderate</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Route Type</p>
                        <p className="font-medium">Fastest</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Route Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500">Route Type</label>
                        <select className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring focus:ring-medical-blue focus:ring-opacity-50">
                          <option>Fastest Route</option>
                          <option>Shortest Distance</option>
                          <option>Avoid Highways</option>
                          <option>Avoid Tolls</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500">Traffic Conditions</label>
                        <select className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-medical-blue focus:ring focus:ring-medical-blue focus:ring-opacity-50">
                          <option>Real-time Traffic</option>
                          <option>No Traffic</option>
                          <option>Typical Traffic</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <RoutePlanningForm onRouteCalculate={handleRouteCalculate} />
        </div>
      </div>
    </Layout>
  );
};

export default RoutePlanning;
