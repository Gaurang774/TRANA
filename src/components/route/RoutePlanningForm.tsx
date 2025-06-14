
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, Route, Clock, MapPin, LocateFixed, Ambulance, 
  Save, Share2, Printer, History, ArrowRightCircle, Settings,
  Plus, AlertCircle, Heart, Activity
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
  
  const currentDateTime = new Date().toLocaleString();

  const getSeverityBadge = (severity: string) => {
    const variants = {
      "Critical": "bg-red-600 text-white",
      "High": "bg-red-500 text-white", 
      "Medium": "bg-amber-500 text-white",
      "Low": "bg-green-500 text-white"
    };
    return variants[severity as keyof typeof variants] || "bg-gray-500 text-white";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      "Available": "bg-brand-success",
      "En Route": "bg-brand-warning", 
      "On Call": "bg-brand-info",
      "Maintenance": "bg-gray-400"
    };
    return colors[status as keyof typeof colors] || "bg-gray-400";
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0 rounded-xl overflow-hidden">
      <Tabs defaultValue="route" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 bg-gray-50/80 p-1 rounded-lg">
          <TabsTrigger value="route" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Plan Route</span>
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Emergencies</span>
          </TabsTrigger>
          <TabsTrigger value="units" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
            <LocateFixed className="h-4 w-4" />
            <span className="hidden sm:inline">Units</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <div className="px-6 pb-6">
          <TabsContent value="route" className="mt-0 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-primary" />
                    Origin Location
                  </Label>
                  <Input 
                    id="origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Enter starting location..."
                    className="h-12 px-4 border-2 border-gray-200 focus:border-brand-primary transition-colors rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-brand-secondary" />
                    Destination
                  </Label>
                  <Input 
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination..."
                    className="h-12 px-4 border-2 border-gray-200 focus:border-brand-primary transition-colors rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="route-mode" className="text-sm font-semibold text-gray-700">Route Type</Label>
                    <Select value={routeMode} onValueChange={setRouteMode}>
                      <SelectTrigger id="route-mode" className="h-12 border-2 border-gray-200 focus:border-brand-primary rounded-lg">
                        <SelectValue placeholder="Select route type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 shadow-lg rounded-lg">
                        <SelectItem value="fastest">🚀 Fastest Route</SelectItem>
                        <SelectItem value="shortest">📏 Shortest Distance</SelectItem>
                        <SelectItem value="no-highways">🛣️ Avoid Highways</SelectItem>
                        <SelectItem value="no-tolls">💰 Avoid Tolls</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="traffic-model" className="text-sm font-semibold text-gray-700">Traffic Model</Label>
                    <Select value={trafficModel} onValueChange={setTrafficModel}>
                      <SelectTrigger id="traffic-model" className="h-12 border-2 border-gray-200 focus:border-brand-primary rounded-lg">
                        <SelectValue placeholder="Select traffic model" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 shadow-lg rounded-lg">
                        <SelectItem value="realtime">🔴 Real-time Traffic</SelectItem>
                        <SelectItem value="none">⚪ No Traffic</SelectItem>
                        <SelectItem value="typical">🟡 Typical Traffic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Route className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Distance</p>
                          <p id="route-distance" className="font-bold text-lg text-gray-900">-</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Clock className="h-5 w-5 text-brand-danger" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ETA</p>
                          <p id="route-time" className="font-bold text-lg text-gray-900">-</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200">
                    <Navigation className="mr-2 h-5 w-5" />
                    Calculate Route
                  </Button>
                  
                  {origin && destination && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsSaveModalOpen(true)}
                      className="flex-1 h-12 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200 rounded-lg"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      Save Route
                    </Button>
                  )}
                </div>

                {isSaveModalOpen && (
                  <Card className="border-2 border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Route
                      </h4>
                      <div className="space-y-3">
                        <Input 
                          placeholder="Enter route name..." 
                          value={routeName}
                          onChange={(e) => setRouteName(e.target.value)}
                          className="border-2 border-gray-200 focus:border-brand-primary rounded-lg"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsSaveModalOpen(false)}
                            className="border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSaveRoute}
                            disabled={!routeName}
                            className="bg-brand-primary hover:bg-blue-600"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-gray-200">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-brand-primary hover:bg-blue-50">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-brand-primary hover:bg-blue-50">
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-brand-primary hover:bg-blue-50">
                    <Settings className="h-4 w-4 mr-1" />
                    Options
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="emergency" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Active Emergency Locations
              </h3>
              <Badge variant="destructive" className="animate-pulse">
                {emergencyLocations.length} Active
              </Badge>
            </div>
            <div className="space-y-3">
              {emergencyLocations.map(location => (
                <Card key={location.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            location.severity === "Critical" ? "bg-red-600 animate-pulse" : 
                            location.severity === "High" ? "bg-red-500 animate-pulse" : 
                            "bg-amber-500"
                          }`}></div>
                          <h4 className="font-semibold text-gray-900">{location.name}</h4>
                          <Badge className={getSeverityBadge(location.severity)} variant="secondary">
                            {location.severity}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">📍 {location.coords}</p>
                          <p className="text-sm text-gray-600">🏥 {location.type}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setOrigin("Your current location");
                          setDestination(location.name);
                        }}
                        className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full border-2 border-dashed border-gray-300 text-gray-600 hover:border-brand-primary hover:text-brand-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add New Emergency
            </Button>
          </TabsContent>

          <TabsContent value="units" className="mt-0 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-gray-800">Hospitals</h3>
              </div>
              <div className="space-y-3">
                {hospitalLocations.map(hospital => (
                  <Card key={hospital.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <h4 className="font-semibold text-gray-900">{hospital.name}</h4>
                            <Badge className="bg-green-100 text-green-700" variant="secondary">
                              {hospital.beds}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">📍 {hospital.address}</p>
                            <p className="text-sm text-gray-600">🏥 {hospital.specialties}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDestination(hospital.name)}
                          className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ambulance className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">Ambulance Units</h3>
              </div>
              <div className="space-y-3">
                {ambulanceUnits.map(unit => (
                  <Card key={unit.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(unit.status)} ${unit.status === "Available" ? "animate-pulse" : ""}`}></div>
                            <h4 className="font-semibold text-gray-900">{unit.id}</h4>
                            <Badge className={`${
                              unit.status === "Available" ? "bg-green-100 text-green-700" : 
                              unit.status === "En Route" ? "bg-amber-100 text-amber-700" : 
                              unit.status === "On Call" ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-600"
                            }`} variant="secondary">
                              {unit.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">📍 {unit.location}</p>
                            <p className="text-sm text-gray-600">🚑 {unit.type}</p>
                            <p className="text-sm text-gray-600">👥 {unit.team}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setOrigin(unit.id)}
                          className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                        >
                          <LocateFixed className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Save className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">Saved Routes</h3>
              </div>
              {savedRoutes.length > 0 ? (
                <div className="space-y-3">
                  {savedRoutes.map((route, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{route.name}</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">🏁 From: {route.origin}</p>
                              <p className="text-sm text-gray-600">🎯 To: {route.destination}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLoadRoute(index)}
                            className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                          >
                            <ArrowRightCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Save className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="font-semibold text-gray-600 mb-2">No saved routes yet</h4>
                    <p className="text-sm text-gray-500">Save your frequently used routes for quick access</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-gray-800">Recent Searches</h3>
              </div>
              <div className="space-y-3">
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">{currentDateTime}</p>
                        <h4 className="font-semibold text-gray-900 mb-1">AIIMS Delhi to Accident Site</h4>
                        <p className="text-sm text-gray-600">⏱️ 15 mins • 📏 8.2 km</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setOrigin('AIIMS Delhi');
                          setDestination('Accident Site - Delhi Highway');
                        }}
                        className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                      >
                        <ArrowRightCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">{currentDateTime}</p>
                        <h4 className="font-semibold text-gray-900 mb-1">Apollo Hospitals to Medical Emergency</h4>
                        <p className="text-sm text-gray-600">⏱️ 22 mins • 📏 12.5 km</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setOrigin('Apollo Hospitals');
                          setDestination('Medical Emergency - Mumbai Suburb');
                        }}
                        className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white"
                      >
                        <ArrowRightCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default RoutePlanningForm;
