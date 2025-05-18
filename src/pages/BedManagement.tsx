import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bed, Filter, Plus, RefreshCw } from 'lucide-react';

interface HospitalBed {
  id: string;
  name: string;
  type: 'ICU' | 'Emergency' | 'General' | 'Pediatric' | 'Maternity';
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
  patient?: string;
  admittedAt?: string;
  department: string;
  location: string;
}

const BedManagement = () => {
  const beds: HospitalBed[] = [
    { id: 'B1001', name: 'Bed 101', type: 'ICU', status: 'Occupied', patient: 'John Doe', admittedAt: '2025-05-16 08:30', department: 'Critical Care', location: 'Floor 3, Wing A' },
    { id: 'B1002', name: 'Bed 102', type: 'ICU', status: 'Available', department: 'Critical Care', location: 'Floor 3, Wing A' },
    { id: 'B1003', name: 'Bed 103', type: 'Emergency', status: 'Reserved', patient: 'Incoming', department: 'Emergency', location: 'Floor 1, ER' },
    { id: 'B1004', name: 'Bed 104', type: 'General', status: 'Available', department: 'General Medicine', location: 'Floor 2, Wing B' },
    { id: 'B1005', name: 'Bed 105', type: 'Pediatric', status: 'Occupied', patient: 'Jane Smith', admittedAt: '2025-05-15 14:15', department: 'Pediatrics', location: 'Floor 4, Wing C' },
    { id: 'B1006', name: 'Bed 106', type: 'Maternity', status: 'Maintenance', department: 'Obstetrics', location: 'Floor 5, Wing D' },
    { id: 'B1007', name: 'Bed 107', type: 'General', status: 'Available', department: 'General Medicine', location: 'Floor 2, Wing B' },
    { id: 'B1008', name: 'Bed 108', type: 'Emergency', status: 'Occupied', patient: 'Robert Johnson', admittedAt: '2025-05-17 09:45', department: 'Emergency', location: 'Floor 1, ER' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-medical-green/10 text-medical-green';
      case 'Occupied':
        return 'bg-medical-red/10 text-medical-red';
      case 'Reserved':
        return 'bg-medical-yellow/10 text-amber-700';
      case 'Maintenance':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bed Management</h1>
          <p className="text-gray-500">Monitor and manage hospital beds</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button size="sm" variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button size="sm" variant="outline" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add Bed
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Beds</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="occupied">Occupied</TabsTrigger>
          <TabsTrigger value="reserved">Reserved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Bed className="h-5 w-5 mr-2" />
                Hospital Bed Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bed ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead className="hidden lg:table-cell">Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beds.map((bed) => (
                      <TableRow key={bed.id}>
                        <TableCell className="font-medium">{bed.id}</TableCell>
                        <TableCell>{bed.type}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(bed.status)}`}>
                            {bed.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {bed.patient ? (
                            <div>
                              <div>{bed.patient}</div>
                              <div className="text-xs text-gray-500">{bed.admittedAt}</div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{bed.department}</TableCell>
                        <TableCell className="hidden lg:table-cell">{bed.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="available" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Available Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bed ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beds
                      .filter((bed) => bed.status === 'Available')
                      .map((bed) => (
                        <TableRow key={bed.id}>
                          <TableCell className="font-medium">{bed.id}</TableCell>
                          <TableCell>{bed.type}</TableCell>
                          <TableCell>{bed.department}</TableCell>
                          <TableCell>{bed.location}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="occupied" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Occupied Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bed ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Admitted At</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beds
                      .filter((bed) => bed.status === 'Occupied')
                      .map((bed) => (
                        <TableRow key={bed.id}>
                          <TableCell className="font-medium">{bed.id}</TableCell>
                          <TableCell>{bed.type}</TableCell>
                          <TableCell>{bed.patient}</TableCell>
                          <TableCell>{bed.admittedAt}</TableCell>
                          <TableCell className="hidden md:table-cell">{bed.department}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reserved" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Reserved Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bed ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beds
                      .filter((bed) => bed.status === 'Reserved')
                      .map((bed) => (
                        <TableRow key={bed.id}>
                          <TableCell className="font-medium">{bed.id}</TableCell>
                          <TableCell>{bed.type}</TableCell>
                          <TableCell>{bed.patient || '-'}</TableCell>
                          <TableCell>{bed.department}</TableCell>
                          <TableCell>{bed.location}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bed Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-medical-green mr-2"></div>
                  <span>Available</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.status === 'Available').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-medical-red mr-2"></div>
                  <span>Occupied</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.status === 'Occupied').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-medical-yellow mr-2"></div>
                  <span>Reserved</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.status === 'Reserved').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <span>Maintenance</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.status === 'Maintenance').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bed Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-medical-blue mr-2"></div>
                  <span>ICU</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.type === 'ICU').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-medical-red mr-2"></div>
                  <span>Emergency</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.type === 'Emergency').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-medical-green mr-2"></div>
                  <span>General</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.type === 'General').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span>Pediatric</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.type === 'Pediatric').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                  <span>Maternity</span>
                </div>
                <span className="font-semibold">{beds.filter(b => b.type === 'Maternity').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BedManagement;
