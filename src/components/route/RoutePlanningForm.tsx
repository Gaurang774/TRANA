
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation, Route, Clock, MapPin, LocateFixed, Ambulance } from 'lucide-react';

interface RoutePlanningFormProps {
  onRouteCalculate: (origin: string, destination: string) => void;
}

const RoutePlanningForm = ({ onRouteCalculate }: RoutePlanningFormProps) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onRouteCalculate(origin, destination);
    }
  };

  const emergencyLocations = [
    { id: 1, name: "Accident Site - Delhi Highway", coords: "28.5355, 77.2910" },
    { id: 2, name: "Medical Emergency - Mumbai Suburb", coords: "19.0895, 72.8656" },
    { id: 3, name: "Cardiac Case - Bangalore City Center", coords: "12.9716, 77.5946" },
  ];

  const hospitalLocations = [
    { id: 1, name: "AIIMS Delhi", address: "Ansari Nagar, New Delhi" },
    { id: 2, name: "Tata Memorial Hospital", address: "Dr. E Borges Road, Mumbai" },
    { id: 3, name: "Apollo Hospitals", address: "Greams Road, Chennai" },
    { id: 4, name: "CMC Vellore", address: "Ida Scudder Road, Vellore" },
    { id: 5, name: "PGIMER", address: "Sector 12, Chandigarh" }
  ];

  const ambulanceUnits = [
    { id: "AMB-001", status: "Available", location: "Central Delhi" },
    { id: "AMB-002", status: "En Route", location: "South Mumbai" },
    { id: "AMB-003", status: "Available", location: "East Chennai" }
  ];

  return (
    <Card className="p-4 bg-white shadow">
      <Tabs defaultValue="route" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="route">
            <Route className="mr-2 h-4 w-4" />
            Plan Route
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <Ambulance className="mr-2 h-4 w-4" />
            Emergencies
          </TabsTrigger>
          <TabsTrigger value="units">
            <LocateFixed className="mr-2 h-4 w-4" />
            Units
          </TabsTrigger>
        </TabsList>

        <TabsContent value="route" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                Origin
              </label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Enter starting location"
                  className="pl-9"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <div className="relative">
                <Navigation className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2 text-sm">
                <Route className="h-4 w-4 text-medical-blue" />
                <span className="text-gray-700">Distance:</span>
                <span id="route-distance" className="font-semibold">-</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-medical-red" />
                <span className="text-gray-700">ETA:</span>
                <span id="route-time" className="font-semibold">-</span>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full">
                <Navigation className="mr-2 h-4 w-4" />
                Calculate Optimal Route
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-2">
          <h3 className="font-medium text-sm text-gray-600 mb-2">Active Emergency Locations</h3>
          {emergencyLocations.map(location => (
            <div key={location.id} className="flex items-center p-2.5 border border-gray-100 rounded-md hover:bg-gray-50">
              <div className="w-2.5 h-2.5 rounded-full bg-medical-red mr-2 animate-pulse"></div>
              <div>
                <p className="font-medium text-sm">{location.name}</p>
                <p className="text-xs text-gray-500">{location.coords}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto"
                onClick={() => {
                  setOrigin("Your current location");
                  setDestination(location.name);
                }}
              >
                <Navigation className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2">
            Add New Emergency
          </Button>
        </TabsContent>

        <TabsContent value="units">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-gray-600 mb-2">Hospitals</h3>
              <div className="space-y-2">
                {hospitalLocations.map(hospital => (
                  <div key={hospital.id} className="flex items-center p-2.5 border border-gray-100 rounded-md hover:bg-gray-50">
                    <div className="w-2.5 h-2.5 rounded-full bg-medical-green mr-2"></div>
                    <div>
                      <p className="font-medium text-sm">{hospital.name}</p>
                      <p className="text-xs text-gray-500">{hospital.address}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => {
                        setDestination(hospital.name);
                      }}
                    >
                      <Navigation className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-600 mb-2">Ambulance Units</h3>
              <div className="space-y-2">
                {ambulanceUnits.map(unit => (
                  <div key={unit.id} className="flex items-center p-2.5 border border-gray-100 rounded-md hover:bg-gray-50">
                    <div className={`w-2.5 h-2.5 rounded-full ${unit.status === "Available" ? "bg-medical-blue" : "bg-medical-yellow"} mr-2 ${unit.status === "Available" ? "animate-pulse-slow" : ""}`}></div>
                    <div>
                      <p className="font-medium text-sm">{unit.id}</p>
                      <p className="text-xs text-gray-500">{unit.status} • {unit.location}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => {
                        setOrigin(unit.id);
                      }}
                    >
                      <LocateFixed className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RoutePlanningForm;
