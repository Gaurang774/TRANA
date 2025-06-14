
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Plus, 
  X,
  Puzzle,
  Pill,
  Settings
} from 'lucide-react';
import { usePluginSystem } from '@/hooks/usePluginSystem';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const routeFormSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  vehicleType: z.enum(['ambulance', 'medical_transport', 'helicopter']),
  notes: z.string().optional(),
  selectedPlugins: z.array(z.string()).optional(),
  selectedMedicines: z.array(z.string()).optional(),
  waypoints: z.array(z.string()).optional()
});

type RouteFormData = z.infer<typeof routeFormSchema>;

const RoutePlanningForm = () => {
  const { toast } = useToast();
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [newWaypoint, setNewWaypoint] = useState('');
  
  // Plugin system integration
  const { plugins, getEnabledPlugins } = usePluginSystem();
  
  // Fetch medicines
  const { data: medicines, isLoading: medicinesLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicines')
        .select('id, name, drug_class, prescription_required')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeFormSchema),
    defaultValues: {
      priority: 'medium',
      vehicleType: 'ambulance',
      selectedPlugins: [],
      selectedMedicines: [],
      waypoints: []
    }
  });

  const watchedPlugins = watch('selectedPlugins') || [];
  const watchedMedicines = watch('selectedMedicines') || [];

  const onSubmit = async (data: RouteFormData) => {
    try {
      console.log('Route planning data:', {
        ...data,
        waypoints,
        selectedPlugins: watchedPlugins,
        selectedMedicines: watchedMedicines
      });
      
      toast({
        title: "Route Planned Successfully",
        description: "Your route has been optimized with selected features",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to plan route",
        variant: "destructive"
      });
    }
  };

  const addWaypoint = () => {
    if (newWaypoint.trim()) {
      const updatedWaypoints = [...waypoints, newWaypoint.trim()];
      setWaypoints(updatedWaypoints);
      setValue('waypoints', updatedWaypoints);
      setNewWaypoint('');
    }
  };

  const removeWaypoint = (index: number) => {
    const updatedWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(updatedWaypoints);
    setValue('waypoints', updatedWaypoints);
  };

  const togglePlugin = (pluginId: string) => {
    const current = watchedPlugins;
    const updated = current.includes(pluginId)
      ? current.filter(id => id !== pluginId)
      : [...current, pluginId];
    setValue('selectedPlugins', updated);
  };

  const toggleMedicine = (medicineId: string) => {
    const current = watchedMedicines;
    const updated = current.includes(medicineId)
      ? current.filter(id => id !== medicineId)
      : [...current, medicineId];
    setValue('selectedMedicines', updated);
  };

  const availablePlugins = plugins.filter(plugin => 
    plugin.category === 'emergency' || plugin.category === 'utility'
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Navigation className="h-8 w-8 text-blue-600" />
          Route Planning
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Plan optimized routes with integrated plugins and medical resources
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Route</TabsTrigger>
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
            <TabsTrigger value="medicines">Medicines</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route Information
                </CardTitle>
                <CardDescription>
                  Set your starting point and destination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin *</Label>
                    <Input
                      id="origin"
                      {...register('origin')}
                      placeholder="Starting location"
                      className={errors.origin ? 'border-red-500' : ''}
                    />
                    {errors.origin && (
                      <p className="text-sm text-red-500">{errors.origin.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      {...register('destination')}
                      placeholder="Target location"
                      className={errors.destination ? 'border-red-500' : ''}
                    />
                    {errors.destination && (
                      <p className="text-sm text-red-500">{errors.destination.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="critical">Critical Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Controller
                      name="vehicleType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ambulance">Ambulance</SelectItem>
                            <SelectItem value="medical_transport">Medical Transport</SelectItem>
                            <SelectItem value="helicopter">Medical Helicopter</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Any special instructions or requirements"
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plugins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Puzzle className="h-5 w-5" />
                  Available Plugins
                </CardTitle>
                <CardDescription>
                  Select plugins to enhance your route planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availablePlugins.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No plugins available for route planning</p>
                    <p className="text-sm">Check the Plugin Manager to enable plugins</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availablePlugins.map((plugin) => (
                      <div 
                        key={plugin.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          watchedPlugins.includes(plugin.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => togglePlugin(plugin.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={watchedPlugins.includes(plugin.id)}
                                onChange={() => togglePlugin(plugin.id)}
                              />
                              <h3 className="font-medium">{plugin.name}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{plugin.description}</p>
                            <Badge variant="outline" className="mt-2">
                              {plugin.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medicines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Medical Supplies
                </CardTitle>
                <CardDescription>
                  Select medicines to include in route planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                {medicinesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading medicines...</p>
                  </div>
                ) : !medicines || medicines.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No medicines available</p>
                    <p className="text-sm">Add medicines in the Medicine Management section</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {medicines.map((medicine) => (
                      <div 
                        key={medicine.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          watchedMedicines.includes(medicine.id)
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleMedicine(medicine.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={watchedMedicines.includes(medicine.id)}
                                onChange={() => toggleMedicine(medicine.id)}
                              />
                              <h3 className="font-medium">{medicine.name}</h3>
                            </div>
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {medicine.drug_class && (
                                <Badge variant="outline" className="text-xs">
                                  {medicine.drug_class}
                                </Badge>
                              )}
                              <Badge 
                                variant={medicine.prescription_required ? "destructive" : "secondary"}
                                className="text-xs"
                              >
                                {medicine.prescription_required ? "Rx" : "OTC"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Waypoints & Advanced Options
                </CardTitle>
                <CardDescription>
                  Add intermediate stops and configure advanced settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label>Waypoints</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newWaypoint}
                      onChange={(e) => setNewWaypoint(e.target.value)}
                      placeholder="Add waypoint"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWaypoint())}
                    />
                    <Button type="button" onClick={addWaypoint} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {waypoints.length > 0 && (
                    <div className="space-y-2">
                      {waypoints.map((waypoint, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="flex-1">{waypoint}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeWaypoint(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Items Summary */}
            {(watchedPlugins.length > 0 || watchedMedicines.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Items Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {watchedPlugins.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Selected Plugins:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {watchedPlugins.map(pluginId => {
                          const plugin = plugins.find(p => p.id === pluginId);
                          return plugin ? (
                            <Badge key={pluginId} variant="secondary">
                              {plugin.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  {watchedMedicines.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Selected Medicines:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {watchedMedicines.map(medicineId => {
                          const medicine = medicines?.find(m => m.id === medicineId);
                          return medicine ? (
                            <Badge key={medicineId} variant="secondary">
                              {medicine.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Planning Route...' : 'Plan Route'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoutePlanningForm;
