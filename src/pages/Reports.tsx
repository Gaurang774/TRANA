
import React, { useState } from 'react';
import EmergencyHeader from '@/components/EmergencyHeader';
import EmergencySidebar from '@/components/EmergencySidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { FileText, Download, Filter, Printer, ChevronDown } from 'lucide-react';

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Mock data for reports
  const emergencyTypeData = [
    { name: 'Cardiac', value: 35 },
    { name: 'Trauma', value: 25 },
    { name: 'Respiratory', value: 20 },
    { name: 'Neurological', value: 15 },
    { name: 'Other', value: 5 },
  ];
  
  const responseTimeData = [
    { name: 'Monday', avgTime: 8.2 },
    { name: 'Tuesday', avgTime: 7.5 },
    { name: 'Wednesday', avgTime: 9.3 },
    { name: 'Thursday', avgTime: 6.8 },
    { name: 'Friday', avgTime: 10.1 },
    { name: 'Saturday', avgTime: 7.7 },
    { name: 'Sunday', avgTime: 6.5 },
  ];
  
  const hospitalAdmissionsData = [
    { name: 'Central Hospital', admissions: 45 },
    { name: 'Mercy Medical', admissions: 32 },
    { name: 'City General', admissions: 58 },
    { name: 'Community Health', admissions: 27 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const recentReports = [
    { id: 'REP001', name: 'Weekly Emergency Response', date: '2025-05-10', type: 'Performance' },
    { id: 'REP002', name: 'Hospital Capacity Analysis', date: '2025-05-08', type: 'Capacity' },
    { id: 'REP003', name: 'Ambulance Fleet Status', date: '2025-05-05', type: 'Fleet' },
    { id: 'REP004', name: 'Monthly Patient Outcome', date: '2025-04-30', type: 'Medical' },
    { id: 'REP005', name: 'Traffic Pattern Analysis', date: '2025-04-28', type: 'Traffic' },
  ];

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
                <h1 className="text-2xl font-bold">Reports</h1>
                <p className="text-gray-500">Analytics and performance insights</p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Select defaultValue="week">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="dashboard" className="mt-6">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="hospital">Hospital</TabsTrigger>
                <TabsTrigger value="ambulance">Ambulance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Emergency Types</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={emergencyTypeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {emergencyTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Response Time (minutes)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={responseTimeData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="avgTime"
                              stroke="#8884d8"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Hospital Admissions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={hospitalAdmissionsData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="admissions" fill="#0088FE" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Recent Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Report ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.id}</TableCell>
                              <TableCell>{report.name}</TableCell>
                              <TableCell>{report.date}</TableCell>
                              <TableCell>{report.type}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="emergency" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <p className="text-gray-500">Select a date range and report type to generate emergency reports</p>
                      <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-6">
                        <div>
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                          />
                        </div>
                        <div className="space-y-4">
                          <Select>
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="emergency-summary">Emergency Summary</SelectItem>
                              <SelectItem value="response-time">Response Time Analysis</SelectItem>
                              <SelectItem value="emergency-types">Emergency Types Breakdown</SelectItem>
                              <SelectItem value="location-analysis">Emergency Location Analysis</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button className="w-full">Generate Report</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="hospital" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Hospital Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <p className="text-gray-500">Select a hospital and report type to generate hospital reports</p>
                      <div className="mt-6 max-w-md mx-auto space-y-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hospital" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="central">Central Hospital</SelectItem>
                            <SelectItem value="mercy">Mercy Medical Center</SelectItem>
                            <SelectItem value="city">City General Hospital</SelectItem>
                            <SelectItem value="community">Community Health Center</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bed-occupancy">Bed Occupancy</SelectItem>
                            <SelectItem value="patient-flow">Patient Flow</SelectItem>
                            <SelectItem value="emergency-admissions">Emergency Admissions</SelectItem>
                            <SelectItem value="staff-allocation">Staff Allocation</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="w-full">Generate Report</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ambulance" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ambulance Fleet Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <p className="text-gray-500">Generate reports on ambulance fleet performance and usage</p>
                      <div className="mt-6 max-w-md mx-auto space-y-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fleet-usage">Fleet Usage</SelectItem>
                            <SelectItem value="response-times">Response Times</SelectItem>
                            <SelectItem value="maintenance">Maintenance Report</SelectItem>
                            <SelectItem value="fuel-consumption">Fuel Consumption</SelectItem>
                            <SelectItem value="staff-allocation">Staff Allocation</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline">Last 7 Days</Button>
                          <Button variant="outline">Last 30 Days</Button>
                          <Button variant="outline">Last Quarter</Button>
                          <Button variant="outline">Year to Date</Button>
                        </div>
                        <Button className="w-full">Generate Report</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
