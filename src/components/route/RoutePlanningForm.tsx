
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Navigation, Route, Clock, MapPin, LocateFixed, Ambulance, 
  Save, Share2, Printer, History, ArrowRightCircle, Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RoutePlanningFormProps {
  onRouteCalculate: (origin: string, destination: string) => void;
}

const RoutePlanningForm = ({ onRouteCalculate }: RoutePlanningFormProps) => {
  const { toast } = useToast();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeMode, setRouteMode] = useState('fastest');
  const [trafficModel, setTrafficModel] = useState('realtime');
  const [savedRoutes, setSavedRoutes] = useState<Array<{name: string, origin: string, destination: string}>>([]);
  const [routeName, setRouteName] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination) {
      onRouteCalculate(origin, destination);
      
      // Update the UI to show calculation in progress
      toast({
        title: "Calculating Route",
        description: `Finding optimal route from ${origin} to ${destination}`,
      });
    }
  };

  const handleSaveRoute = () => {
    if (routeName && origin && destination) {
      const newRoute = {
        name: routeName,
        origin,
        destination,
      };
      setSavedRoutes([...savedRoutes, newRoute]);
      setRouteName('');
      setIsSaveModalOpen(false);
      
      toast({
        title: "Route Saved",
        description: `Route "${routeName}" has been saved successfully.`,
      });
    }
  };

  const handleLoadRoute = (routeIndex: number) => {
    const selectedRoute = savedRoutes[routeIndex];
    setOrigin(selectedRoute.origin);
    setDestination(selectedRoute.destination);
    
    toast({
      title: "Route Loaded",
      description: `Route "${selectedRoute.name}" has been loaded.`,
    });
  };

  const emergencyLocations = [
    { id: 1, name: "Accident Site - Delhi Highway", coords: "28.5355, 77.2910", severity: "High", type: "Traffic Accident" },
    { id: 2, name: "Medical Emergency - Mumbai Suburb", coords: "19.0895, 72.8656", severity: "Medium", type: "Cardiac Case" },
    { id: 3, name: "Cardiac Case - Bangalore City Center", coords: "12.9716, 77.5946", severity: "High", type: "Cardiac Arrest" },
    { id: 4, name: "Building Collapse - Chennai", coords: "13.0827, 80.2707", severity: "Critical", type: "Mass Casualty" },
    { id: 5, name: "Fire Emergency - Kolkata", coords: "22.5726, 88.3639", severity: "High", type: "Burns" },
  ];

  const hospitalLocations = [
    { id: 1, name: "AIIMS Delhi", address: "Ansari Nagar, New Delhi", beds: "15 available", specialties: "Trauma, Critical Care" },
    { id: 2, name: "Tata Memorial Hospital", address: "Dr. E Borges Road, Mumbai", beds: "8 available", specialties: "Oncology, Surgery" },
    { id: 3, name: "Apollo Hospitals", address: "Greams Road, Chennai", beds: "12 available", specialties: "Cardiac, Multi-specialty" },
    { id: 4, name: "CMC Vellore", address: "Ida Scudder Road, Vellore", beds: "5 available", specialties: "Multi-specialty" },
    { id: 5, name: "PGIMER", address: "Sector 12, Chandigarh", beds: "10 available", specialties: "Trauma, Neurology" }
  ];

  const ambulanceUnits = [
    { id: "AMB-001", status: "Available", location: "Central Delhi", type: "Advanced Life Support", team: "4 members" },
    { id: "AMB-002", status: "En Route", location: "South Mumbai", type: "Basic Life Support", team: "2 members" },
    { id: "AMB-003", status: "Available", location: "East Chennai", type: "Mobile ICU", team: "5 members" },
    { id: "AMB-004", status: "On Call", location: "North Bangalore", type: "Advanced Life Support", team: "4 members" },
    { id: "AMB-005", status: "Maintenance", location: "West Kolkata", type: "Basic Life Support", team: "2 members" }
  ];
  
  // Getting current date and time for the history tab
  const currentDateTime = new Date().toLocaleString();

  return (
    <Card className="p-4 bg-white shadow">
      <Tabs defaultValue="route" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
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
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="route-mode">Route Type</Label>
                <Select value={routeMode} onValueChange={setRouteMode}>
                  <SelectTrigger id="route-mode">
                    <SelectValue placeholder="Select route type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fastest">Fastest Route</SelectItem>
                    <SelectItem value="shortest">Shortest Distance</SelectItem>
                    <SelectItem value="no-highways">Avoid Highways</SelectItem>
                    <SelectItem value="no-tolls">Avoid Tolls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="traffic-model">Traffic Model</Label>
                <Select value={trafficModel} onValueChange={setTrafficModel}>
                  <SelectTrigger id="traffic-model">
                    <SelectValue placeholder="Select traffic model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time Traffic</SelectItem>
                    <SelectItem value="none">No Traffic</SelectItem>
                    <SelectItem value="typical">Typical Traffic</SelectItem>
                  </SelectContent>
                </Select>
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

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" className="flex-1">
                <Navigation className="mr-2 h-4 w-4" />
                Calculate Route
              </Button>
              
              {origin && destination && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsSaveModalOpen(true)}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Route
                </Button>
              )}
            </div>

            {isSaveModalOpen && (
              <div className="border rounded-md p-4 mt-2 bg-gray-50">
                <h4 className="font-medium mb-2">Save Route</h4>
                <div className="space-y-2">
                  <Input 
                    placeholder="Enter route name" 
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsSaveModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveRoute}
                      disabled={!routeName}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 justify-center text-sm pt-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Printer className="h-3.5 w-3.5 mr-1" />
                Print
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-3.5 w-3.5 mr-1" />
                Options
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-2">
          <h3 className="font-medium text-sm text-gray-600 mb-2">Active Emergency Locations</h3>
          {emergencyLocations.map(location => (
            <div key={location.id} className="flex items-center p-2.5 border border-gray-100 rounded-md hover:bg-gray-50">
              <div className={`w-2.5 h-2.5 rounded-full ${
                location.severity === "Critical" ? "bg-red-600" : 
                location.severity === "High" ? "bg-medical-red" : 
                "bg-medical-yellow"
              } mr-2 animate-pulse`}></div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">{location.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    location.severity === "Critical" ? "bg-red-100 text-red-800" : 
                    location.severity === "High" ? "bg-medical-red/20 text-medical-red" : 
                    "bg-medical-yellow/20 text-medical-yellow-darker"
                  }`}>
                    {location.severity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">{location.coords} • {location.type}</p>
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
              </div>
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
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">{hospital.name}</p>
                        <span className="text-xs text-medical-green">{hospital.beds}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">{hospital.address} • {hospital.specialties}</p>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-600 mb-2">Ambulance Units</h3>
              <div className="space-y-2">
                {ambulanceUnits.map(unit => (
                  <div key={unit.id} className="flex items-center p-2.5 border border-gray-100 rounded-md hover:bg-gray-50">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      unit.status === "Available" ? "bg-medical-blue" : 
                      unit.status === "En Route" ? "bg-medical-yellow" : 
                      unit.status === "On Call" ? "bg-medical-green" :
                      "bg-gray-400"
                    } mr-2 ${unit.status === "Available" ? "animate-pulse-slow" : ""}`}></div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">{unit.id}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          unit.status === "Available" ? "bg-medical-blue/20 text-medical-blue" : 
                          unit.status === "En Route" ? "bg-medical-yellow/20 text-medical-yellow-darker" : 
                          unit.status === "On Call" ? "bg-medical-green/20 text-medical-green" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {unit.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">{unit.location} • {unit.type} • {unit.team}</p>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-gray-600 mb-2">Saved Routes</h3>
            {savedRoutes.length > 0 ? (
              <div className="space-y-2">
                {savedRoutes.map((route, index) => (
                  <div key={index} className="p-2.5 border border-gray-100 rounded-md hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{route.name}</p>
                        <p className="text-xs text-gray-500 mt-1">From: {route.origin}</p>
                        <p className="text-xs text-gray-500">To: {route.destination}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleLoadRoute(index)}
                      >
                        <ArrowRightCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-sm text-gray-500">No saved routes yet</p>
                <p className="text-xs text-gray-400 mt-1">Save your frequently used routes for quick access</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-600 mb-2">Recent Searches</h3>
            <div className="space-y-2">
              <div className="p-2.5 border border-gray-100 rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">{currentDateTime}</p>
                    <p className="font-medium text-sm">AIIMS Delhi to Accident Site</p>
                    <p className="text-xs text-gray-500">15 mins • 8.2 km</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setOrigin('AIIMS Delhi');
                      setDestination('Accident Site - Delhi Highway');
                    }}
                  >
                    <ArrowRightCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-2.5 border border-gray-100 rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">{currentDateTime}</p>
                    <p className="font-medium text-sm">Apollo Hospitals to Medical Emergency</p>
                    <p className="text-xs text-gray-500">22 mins • 12.5 km</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setOrigin('Apollo Hospitals');
                      setDestination('Medical Emergency - Mumbai Suburb');
                    }}
                  >
                    <ArrowRightCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default RoutePlanningForm;
