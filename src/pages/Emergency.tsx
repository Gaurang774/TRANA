import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Ambulance, Bell, CheckCircle, Clock, MapPin, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Emergency {
  id: string;
  type: string;
  location: string;
  status: 'pending' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reported_by?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

type EmergencyFormData = {
  type: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
};

const Emergency = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<EmergencyFormData>({
    type: '',
    location: '',
    priority: 'medium',
    notes: ''
  });
  
  // Fetch emergencies
  const { data: emergencies, isLoading, error, refetch } = useQuery({
    queryKey: ['emergencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergencies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Emergency[];
    }
  });
  
  const activeEmergencies = emergencies?.filter(
    e => e.status !== 'completed' && e.status !== 'cancelled'
  ) || [];
  
  const historyEmergencies = emergencies?.filter(
    e => e.status === 'completed' || e.status === 'cancelled'
  ) || [];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from('emergencies').insert([
        {
          type: formData.type,
          location: formData.location,
          priority: formData.priority,
          status: 'pending',
          notes: formData.notes || null
        }
      ]);
      
      if (error) throw error;
      
      toast.success('Emergency reported successfully');
      setIsCreating(false);
      setFormData({
        type: '',
        location: '',
        priority: 'medium',
        notes: ''
      });
      refetch();
      
    } catch (error: any) {
      toast.error(`Error reporting emergency: ${error.message}`);
    }
  };
  
  const updateEmergencyStatus = async (id: string, status: Emergency['status']) => {
    try {
      const { error } = await supabase
        .from('emergencies')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Emergency status updated to ${status}`);
      refetch();
      
    } catch (error: any) {
      toast.error(`Error updating status: ${error.message}`);
    }
  };
  
  const assignAmbulance = async (emergencyId: string) => {
    try {
      // Find the first available ambulance
      const { data: ambulances, error: fetchError } = await supabase
        .from('ambulances')
        .select('*')
        .eq('status', 'available')
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      if (!ambulances || ambulances.length === 0) {
        toast.error('No available ambulances found');
        return;
      }
      
      const ambulanceId = ambulances[0].id;
      
      // Use the new assign_ambulance function
      const { data: result, error: assignError } = await supabase.rpc('assign_ambulance', {
        p_emergency_id: emergencyId,
        p_ambulance_id: ambulanceId,
        p_dispatcher_id: null // For now, we don't have dispatcher authentication
      });
      
      if (assignError) throw assignError;
      
      if (result) {
        toast.success('Ambulance dispatched successfully');
        refetch();
      } else {
        toast.error('Failed to assign ambulance');
      }
      
    } catch (error: any) {
      toast.error(`Error dispatching ambulance: ${error.message}`);
    }
  };
  
  const getPriorityColor = (priority: Emergency['priority']) => {
    switch(priority) {
      case 'critical': return 'text-medical-red';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-medical-yellow';
      case 'low': return 'text-medical-green';
      default: return 'text-medical-blue';
    }
  };
  
  const getStatusColor = (status: Emergency['status']) => {
    switch(status) {
      case 'pending': return 'text-medical-yellow bg-medical-yellow/10';
      case 'dispatched': return 'text-medical-blue bg-medical-blue/10';
      case 'in_progress': return 'text-orange-500 bg-orange-500/10';
      case 'completed': return 'text-medical-green bg-medical-green/10';
      case 'cancelled': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };
  
  const getStatusLabel = (status: Emergency['status']) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'dispatched': return 'Dispatched';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };
  
  const renderEmergencyCard = (emergency: Emergency) => {
    const isActive = emergency.status !== 'completed' && emergency.status !== 'cancelled';
    
    return (
      <Card key={emergency.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                {emergency.type}
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusColor(emergency.status)}`}>
                  {getStatusLabel(emergency.status)}
                </span>
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {emergency.location}
              </CardDescription>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-opacity-20 ${getPriorityColor(emergency.priority)} bg-${emergency.priority === 'critical' ? 'red' : emergency.priority === 'high' ? 'orange' : emergency.priority === 'medium' ? 'yellow' : 'green'}-100`}>
              {emergency.priority.charAt(0).toUpperCase() + emergency.priority.slice(1)} Priority
            </span>
          </div>
        </CardHeader>
        <CardContent className="text-sm pb-2">
          {emergency.notes && <p className="text-gray-600">{emergency.notes}</p>}
          <div className="flex items-center text-xs text-gray-400 mt-2">
            <Clock className="h-3 w-3 mr-1" />
            Reported {new Date(emergency.created_at).toLocaleString()}
          </div>
        </CardContent>
        {isActive && (
          <CardFooter className="pt-0 flex flex-wrap gap-2">
            {emergency.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  variant="default" 
                  className="flex items-center" 
                  onClick={() => assignAmbulance(emergency.id)}
                >
                  <Ambulance className="mr-1 h-4 w-4" />
                  Dispatch Ambulance
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center text-gray-500" 
                  onClick={() => updateEmergencyStatus(emergency.id, 'cancelled')}
                >
                  Cancel
                </Button>
              </>
            )}
            {emergency.status === 'dispatched' && (
              <Button 
                size="sm" 
                variant="default" 
                className="flex items-center" 
                onClick={() => updateEmergencyStatus(emergency.id, 'in_progress')}
              >
                <Bell className="mr-1 h-4 w-4" />
                Mark In Progress
              </Button>
            )}
            {emergency.status === 'in_progress' && (
              <Button 
                size="sm" 
                variant="default" 
                className="flex items-center bg-medical-green hover:bg-medical-green/80" 
                onClick={() => updateEmergencyStatus(emergency.id, 'completed')}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Complete Emergency
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    );
  };
  
  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Emergency Management</h1>
          <p className="text-gray-500">Handle critical situations efficiently</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 flex items-center"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? 'Cancel' : (
            <>
              <Plus className="mr-1 h-4 w-4" />
              Report Emergency
            </>
          )}
        </Button>
      </div>
      
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report New Emergency</CardTitle>
            <CardDescription>Fill in the details of the emergency situation</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Type
                </label>
                <Input
                  id="type"
                  name="type"
                  placeholder="e.g., Cardiac Arrest, Traffic Accident"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Full address or location details"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <Select 
                  name="priority" 
                  value={formData.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Provide any additional details about the emergency"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-medical-red hover:bg-medical-red/80">
                  Report Emergency
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="relative">
            Active Emergencies
            {activeEmergencies.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-medical-red text-white rounded-full">
                {activeEmergencies.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-blue mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading emergencies...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Error loading emergencies</p>
                <p className="text-sm">Please try refreshing the page</p>
              </div>
            </div>
          ) : activeEmergencies.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Bell className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-600">No Active Emergencies</h3>
              <p className="text-gray-500 mt-1">All emergencies have been handled</p>
            </div>
          ) : (
            activeEmergencies.map(renderEmergencyCard)
          )}
        </TabsContent>
        
        <TabsContent value="history">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-blue mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading history...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Error loading history</p>
                <p className="text-sm">Please try refreshing the page</p>
              </div>
            </div>
          ) : historyEmergencies.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Clock className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-600">No Emergency History</h3>
              <p className="text-gray-500 mt-1">Previous emergencies will appear here</p>
            </div>
          ) : (
            historyEmergencies.map(renderEmergencyCard)
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Emergency;
