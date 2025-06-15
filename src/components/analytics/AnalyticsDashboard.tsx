
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Users, Bed, Ambulance, Clock, Calendar, RefreshCw } from 'lucide-react';
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns';

interface AnalyticsData {
  emergencyTrends: any[];
  responseTimeData: any[];
  bedOccupancyData: any[];
  ambulanceUtilization: any[];
  emergencyTypeDistribution: any[];
  hourlyActivity: any[];
  performanceMetrics: {
    avgResponseTime: number;
    completionRate: number;
    bedUtilization: number;
    ambulanceEfficiency: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch analytics data
  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = subDays(new Date(), days);

      // Fetch emergencies data
      const { data: emergencies } = await supabase
        .from('emergencies')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Fetch ambulances data
      const { data: ambulances } = await supabase
        .from('ambulances')
        .select('*');

      // Fetch hospital beds data
      const { data: beds } = await supabase
        .from('hospital_beds')
        .select('*');

      // Process emergency trends
      const emergencyTrends = generateTimeSeriesData(emergencies || [], days, 'created_at');
      
      // Process response time data
      const responseTimeData = calculateResponseTimes(emergencies || []);
      
      // Process bed occupancy
      const bedOccupancyData = calculateBedOccupancy(beds || [], days);
      
      // Calculate ambulance utilization
      const ambulanceUtilization = calculateAmbulanceUtilization(ambulances || []);
      
      // Emergency type distribution
      const emergencyTypeDistribution = calculateTypeDistribution(emergencies || []);
      
      // Hourly activity patterns
      const hourlyActivity = calculateHourlyActivity(emergencies || []);
      
      // Performance metrics
      const performanceMetrics = calculatePerformanceMetrics(emergencies || [], ambulances || [], beds || []);

      return {
        emergencyTrends,
        responseTimeData,
        bedOccupancyData,
        ambulanceUtilization,
        emergencyTypeDistribution,
        hourlyActivity,
        performanceMetrics
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Real-Time Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive emergency response insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Avg Response Time"
          value={`${analyticsData?.performanceMetrics.avgResponseTime || 0} min`}
          change={-12}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Completion Rate"
          value={`${analyticsData?.performanceMetrics.completionRate || 0}%`}
          change={5}
          icon={<Activity className="h-5 w-5" />}
        />
        <KPICard
          title="Bed Utilization"
          value={`${analyticsData?.performanceMetrics.bedUtilization || 0}%`}
          change={-3}
          icon={<Bed className="h-5 w-5" />}
        />
        <KPICard
          title="Ambulance Efficiency"
          value={`${analyticsData?.performanceMetrics.ambulanceEfficiency || 0}%`}
          change={8}
          icon={<Ambulance className="h-5 w-5" />}
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Emergency Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="activity">Activity Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Volume Over Time</CardTitle>
                <CardDescription>Daily emergency case count trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData?.emergencyTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#0066CC" fill="#0066CC" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response times by day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData?.responseTimeData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgTime" stroke="#00AA55" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bed Occupancy Rate</CardTitle>
                <CardDescription>Hospital bed utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.bedOccupancyData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="occupancy" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ambulance Utilization</CardTitle>
                <CardDescription>Fleet efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData?.ambulanceUtilization || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(analyticsData?.ambulanceUtilization || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Type Distribution</CardTitle>
              <CardDescription>Breakdown of emergency cases by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData?.emergencyTypeDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884D8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity Patterns</CardTitle>
              <CardDescription>Emergency case volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData?.hourlyActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#FF8042" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// KPI Card Component
function KPICard({ title, value, change, icon }: { title: string; value: string; change: number; icon: React.ReactNode }) {
  const isPositive = change > 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions for data processing
function generateTimeSeriesData(data: any[], days: number, dateField: string) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'MMM dd');
    const dayStart = startOfDay(subDays(new Date(), i));
    const dayEnd = endOfDay(subDays(new Date(), i));
    
    const count = data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= dayStart && itemDate <= dayEnd;
    }).length;
    
    result.push({ date, count });
  }
  return result;
}

function calculateResponseTimes(emergencies: any[]) {
  // Mock response time calculation - in real app, calculate from dispatch to arrival
  return emergencies.slice(0, 7).map((_, index) => ({
    date: format(subDays(new Date(), 6 - index), 'MMM dd'),
    avgTime: Math.floor(Math.random() * 10) + 5 // 5-15 minutes
  }));
}

function calculateBedOccupancy(beds: any[], days: number) {
  return Array.from({ length: Math.min(days, 7) }, (_, index) => ({
    date: format(subDays(new Date(), 6 - index), 'MMM dd'),
    occupancy: Math.floor(Math.random() * 30) + 70 // 70-100%
  }));
}

function calculateAmbulanceUtilization(ambulances: any[]) {
  const statusCounts = ambulances.reduce((acc, amb) => {
    acc[amb.status] = (acc[amb.status] || 0) + 1;
    return acc;
  }, {});
  
  const total = ambulances.length || 1;
  return Object.entries(statusCounts).map(([status, count]: [string, any]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: Math.round((count / total) * 100)
  }));
}

function calculateTypeDistribution(emergencies: any[]) {
  const typeCounts = emergencies.reduce((acc, emergency) => {
    acc[emergency.type] = (acc[emergency.type] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count
  }));
}

function calculateHourlyActivity(emergencies: any[]) {
  const hourCounts = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
  
  emergencies.forEach(emergency => {
    const hour = new Date(emergency.created_at).getHours();
    hourCounts[hour].count++;
  });
  
  return hourCounts.map(({ hour, count }) => ({
    hour: `${hour}:00`,
    count
  }));
}

function calculatePerformanceMetrics(emergencies: any[], ambulances: any[], beds: any[]) {
  // Mock calculations - in real app, calculate from actual data
  return {
    avgResponseTime: Math.floor(Math.random() * 5) + 8, // 8-13 minutes
    completionRate: Math.floor(Math.random() * 10) + 85, // 85-95%
    bedUtilization: Math.floor(Math.random() * 20) + 75, // 75-95%
    ambulanceEfficiency: Math.floor(Math.random() * 15) + 80 // 80-95%
  };
}
