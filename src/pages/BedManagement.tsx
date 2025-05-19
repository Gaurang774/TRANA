
import React, { useState, useCallback } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

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

interface FilterOptions {
  department?: string;
  type?: string;
}

const BedManagement = () => {
  const initialBeds: HospitalBed[] = [
    { id: 'B1001', name: 'Bed 101', type: 'ICU', status: 'Occupied', patient: 'Arjun Patel', admittedAt: '2025-05-16 08:30', department: 'Critical Care', location: 'Floor 3, Wing A' },
    { id: 'B1002', name: 'Bed 102', type: 'ICU', status: 'Available', department: 'Critical Care', location: 'Floor 3, Wing A' },
    { id: 'B1003', name: 'Bed 103', type: 'Emergency', status: 'Reserved', patient: 'Incoming', department: 'Emergency', location: 'Floor 1, ER' },
    { id: 'B1004', name: 'Bed 104', type: 'General', status: 'Available', department: 'General Medicine', location: 'Floor 2, Wing B' },
    { id: 'B1005', name: 'Bed 105', type: 'Pediatric', status: 'Occupied', patient: 'Ananya Sharma', admittedAt: '2025-05-15 14:15', department: 'Pediatrics', location: 'Floor 4, Wing C' },
    { id: 'B1006', name: 'Bed 106', type: 'Maternity', status: 'Maintenance', department: 'Obstetrics', location: 'Floor 5, Wing D' },
    { id: 'B1007', name: 'Bed 107', type: 'General', status: 'Available', department: 'General Medicine', location: 'Floor 2, Wing B' },
    { id: 'B1008', name: 'Bed 108', type: 'Emergency', status: 'Occupied', patient: 'Vikram Singh', admittedAt: '2025-05-17 09:45', department: 'Emergency', location: 'Floor 1, ER' },
  ];

  const [beds, setBeds] = useState<HospitalBed[]>(initialBeds);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [isAddBedDialogOpen, setIsAddBedDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      bedId: '',
      bedName: '',
      bedType: 'General',
      department: 'General Medicine',
      location: '',
    }
  });

  const refreshBeds = () => {
    // Simulate refresh with a slight delay
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          setBeds([...initialBeds]);
          resolve();
        }, 500);
      }),
      {
        loading: 'Refreshing bed status...',
        success: 'Bed status refreshed successfully',
        error: 'Failed to refresh bed status'
      }
    );
  };

  const applyFilters = useCallback(() => {
    let filteredBeds = [...initialBeds];
    
    if (filterOptions.department) {
      filteredBeds = filteredBeds.filter(bed => bed.department === filterOptions.department);
    }
    
    if (filterOptions.type) {
      filteredBeds = filteredBeds.filter(bed => bed.type === filterOptions.type);
    }
    
    setBeds(filteredBeds);
    setFilterOpen(false);
    
    toast.success('Filters applied');
  }, [filterOptions]);

  const resetFilters = () => {
    setFilterOptions({});
    setBeds([...initialBeds]);
    setFilterOpen(false);
    
    toast.success('Filters reset');
  };

  const handleAddBed = (data: any) => {
    const newBed: HospitalBed = {
      id: data.bedId,
      name: data.bedName,
      type: data.bedType as any,
      status: 'Available',
      department: data.department,
      location: data.location,
    };
    
    setBeds(prev => [...prev, newBed]);
    setIsAddBedDialogOpen(false);
    form.reset();
    
    toast.success('New bed added successfully');
  };

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
          <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Beds</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <FormLabel>Department</FormLabel>
                  <Select 
                    value={filterOptions.department || ''} 
                    onValueChange={(value) => setFilterOptions(prev => ({ ...prev, department: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      <SelectItem value="Critical Care">Critical Care</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Obstetrics">Obstetrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Bed Type</FormLabel>
                  <Select 
                    value={filterOptions.type || ''}
                    onValueChange={(value) => setFilterOptions(prev => ({ ...prev, type: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Pediatric">Pediatric</SelectItem>
                      <SelectItem value="Maternity">Maternity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={resetFilters}>Reset</Button>
                  <Button onClick={applyFilters}>Apply Filters</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button size="sm" variant="outline" className="flex items-center" onClick={refreshBeds}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          
          <Dialog open={isAddBedDialogOpen} onOpenChange={setIsAddBedDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Add Bed
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Bed</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddBed)} className="space-y-4 py-2">
                  <FormField
                    control={form.control}
                    name="bedId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bed ID</FormLabel>
                        <FormControl>
                          <Input placeholder="B1009" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bedName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bed Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Bed 109" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bedType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bed Type</FormLabel>
                        <Select 
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ICU">ICU</SelectItem>
                            <SelectItem value="Emergency">Emergency</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Pediatric">Pediatric</SelectItem>
                            <SelectItem value="Maternity">Maternity</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select 
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Critical Care">Critical Care</SelectItem>
                            <SelectItem value="Emergency">Emergency</SelectItem>
                            <SelectItem value="General Medicine">General Medicine</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Obstetrics">Obstetrics</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Floor 2, Wing B" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Add Bed</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
