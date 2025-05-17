
import React, { useState } from 'react';
import EmergencyHeader from '@/components/EmergencyHeader';
import EmergencySidebar from '@/components/EmergencySidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Route, 
  Ambulance, 
  Hospital, 
  Clock, 
  AlertCircle,
  BarChart,
  Save
} from 'lucide-react';

const RoutePlanning = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock route data
  const routes = [
    { 
      id: 'R001', 
      name: 'Route 1', 
      start: 'Downtown', 
      destination: 'Central Hospital', 
      eta: '8 mins', 
      distance: '2.5 miles', 
      status: 'Active',
      trafficLevel: 'Low',
      ambulanceId: 'AMB-1234'
    },
    { 
      id: 'R002', 
      name: 'Route 2', 
      start: 'North District', 
      destination: 'Mercy Medical Center', 
      eta: '15 mins', 
      distance: '4.8 miles', 
      status: 'Active',
      trafficLevel: 'Medium',
      ambulanceId: 'AMB-5678'
    },
    { 
      id: 'R003', 
      name: 'Route 3', 
      start: 'East Block', 
      destination: 'City General Hospital', 
      eta: '20 mins', 
      distance: '6.2 miles', 
      status: 'Delayed',
      trafficLevel: 'High',
      ambulanceId: 'AMB-9101'
    },
    { 
      id: 'R004', 
      name: 'Route 4', 
      start: 'South End', 
      destination: 'Community Health Center', 
      eta: '12 mins', 
      distance: '3.7 miles', 
      status: 'Completed',
      trafficLevel: 'Low',
      ambulanceId: 'AMB-1121'
    }
  ];

  // Traffic hotspots
  const trafficHotspots = [
    { id: 1, location: 'Main St & 5th Ave', severity: 'High', duration: '45 mins' },
    { id: 2, location: 'Highway 101 North', severity: 'Medium', duration: '30 mins' },
    { id: 3, location: 'Central Bridge', severity: 'Low', duration: '15 mins' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-medical-green/10 text-medical-green';
      case 'Delayed':
        return 'bg-medical-red/10 text-medical-red';
      case 'Completed':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <EmergencySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <EmergencyHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Route Planning</h1>
                <p className="text-gray-500">Optimize emergency response routes</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Map className="h-5 w-5 mr-2" />
                      Emergency Route Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Mock Map UI */}
                    <div className="relative bg-gray-200 rounded-md h-96 overflow-hidden">
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className="border border-gray-300/30"></div>
                        ))}
                      </div>
                      
                      {/* Road Network */}
                      <div className="absolute inset-0">
                        {/* Horizontal Roads */}
                        <div className="absolute h-1.5 bg-gray-400/40 left-0 right-0 top-1/4"></div>
                        <div className="absolute h-1.5 bg-gray-400/40 left-0 right-0 top-2/4"></div>
                        <div className="absolute h-1.5 bg-gray-400/40 left-0 right-0 top-3/4"></div>
                        
                        {/* Vertical Roads */}
                        <div className="absolute w-1.5 bg-gray-400/40 top-0 bottom-0 left-1/4"></div>
                        <div className="absolute w-1.5 bg-gray-400/40 top-0 bottom-0 left-2/4"></div>
                        <div className="absolute w-1.5 bg-gray-400/40 top-0 bottom-0 left-3/4"></div>
                      </div>
                      
                      {/* Hospitals */}
                      <div className="absolute w-5 h-5 bg-medical-green rounded-full top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold">H</div>
                      <div className="absolute w-5 h-5 bg-medical-green rounded-full top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold">H</div>
                      
                      {/* Ambulances */}
                      <div className="absolute w-4 h-4 bg-medical-blue rounded-full top-[30%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[8px] animate-pulse">A1</div>
                      <div className="absolute w-4 h-4 bg-medical-blue rounded-full top-[65%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[8px] animate-pulse">A2</div>
                      
                      {/* Traffic Hotspot */}
                      <div className="absolute w-8 h-8 bg-medical-yellow/30 rounded-full top-[50%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-3 h-3 bg-medical-yellow rounded-full"></div>
                      </div>
                      
                      {/* Routes */}
                      <svg className="absolute inset-0" style={{ zIndex: 5 }}>
                        <path 
                          d="M100,100 L200,200 L300,150 L350,310" 
                          stroke="#0066CC" 
                          strokeWidth="2.5" 
                          strokeDasharray="6 3" 
                          fill="none" 
                        />
                        <path 
                          d="M400,350 L300,250 L200,300 L100,350" 
                          stroke="#4CAF50" 
                          strokeWidth="2.5" 
                          strokeDasharray="6 3" 
                          fill="none" 
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Route className="h-5 w-5 mr-2" />
                      New Route
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-location">Start Location</Label>
                        <Input id="start-location" placeholder="Enter starting location" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hospital" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="central">Central Hospital</SelectItem>
                            <SelectItem value="mercy">Mercy Medical Center</SelectItem>
                            <SelectItem value="general">City General Hospital</SelectItem>
                            <SelectItem value="community">Community Health Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ambulance-id">Ambulance ID</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ambulance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AMB-1234">AMB-1234</SelectItem>
                            <SelectItem value="AMB-5678">AMB-5678</SelectItem>
                            <SelectItem value="AMB-9101">AMB-9101</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-2">
                        <Button className="w-full">
                          <Route className="h-4 w-4 mr-2" />
                          Calculate Route
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Traffic Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {trafficHotspots.map((hotspot) => (
                        <div key={hotspot.id} className="flex items-start p-3 bg-gray-50 rounded-md">
                          <div className={`h-3 w-3 rounded-full mt-1 mr-2 ${
                            hotspot.severity === 'High' ? 'bg-medical-red' :
                            hotspot.severity === 'Medium' ? 'bg-medical-yellow' :
                            'bg-medical-green'
                          }`}></div>
                          <div>
                            <p className="font-medium">{hotspot.location}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Expected: {hotspot.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Active Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route ID</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>ETA</TableHead>
                        <TableHead>Traffic</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {routes.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell className="font-medium">{route.id}</TableCell>
                          <TableCell>{route.start}</TableCell>
                          <TableCell>{route.destination}</TableCell>
                          <TableCell>{route.distance}</TableCell>
                          <TableCell>{route.eta}</TableCell>
                          <TableCell>
                            <Badge className={getTrafficColor(route.trafficLevel)}>
                              {route.trafficLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(route.status)}>
                              {route.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoutePlanning;
