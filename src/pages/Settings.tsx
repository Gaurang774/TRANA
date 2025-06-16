
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Bell, User, Map, Lock, Shield, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mapApiKey, setMapApiKey] = useState('AIzaSyBbiL-W_D_bst3kVbMAJJ1-oGviBO9-P0w');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [useHighPrecisionLocation, setUseHighPrecisionLocation] = useState(true);

  // Update darkMode state when theme changes
  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);

  // Set the API key in localStorage on component mount
  useEffect(() => {
    localStorage.setItem('google_maps_api_key', 'AIzaSyBbiL-W_D_bst3kVbMAJJ1-oGviBO9-P0w');
  }, []);

  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${settingType} settings have been updated successfully.`,
    });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  const handleSaveMapApiKey = () => {
    localStorage.setItem('google_maps_api_key', mapApiKey);
    toast({
      title: "API Key Saved",
      description: "Your Google Maps API key has been saved and is now active.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Configure your preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general">
                <SettingsIcon className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="maps">
                <Map className="h-4 w-4 mr-2" />
                Map Settings
              </TabsTrigger>
              <TabsTrigger value="account">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Lock className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Database className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-500">Enable dark mode for the application</p>
                    </div>
                    <Switch 
                      checked={darkMode}
                      onCheckedChange={handleDarkModeToggle}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant={theme === 'light' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setTheme('light')}
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('dark')}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('system')}
                      >
                        System
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Refresh Data</p>
                      <p className="text-sm text-gray-500">Automatically refresh dashboard data</p>
                    </div>
                    <Switch 
                      checked={autoRefresh}
                      onCheckedChange={(checked) => setAutoRefresh(checked)}
                    />
                  </div>

                  {autoRefresh && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="refresh-interval">Refresh Interval (minutes)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="refresh-interval"
                          type="number"
                          min={1}
                          max={60}
                          value={refreshInterval}
                          onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 5)}
                          className="w-24"
                        />
                        <span className="text-sm text-gray-500">minutes</span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSaveSettings('general')}
                    className="mt-4"
                  >
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Notifications</p>
                      <p className="text-sm text-gray-500">Receive notifications for emergencies</p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled}
                      onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                    />
                  </div>
                  
                  {notificationsEnabled && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Emergency Alerts</p>
                          <p className="text-sm text-gray-500">High priority notifications</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Route Updates</p>
                          <p className="text-sm text-gray-500">Updates to ambulance routes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Bed Status Changes</p>
                          <p className="text-sm text-gray-500">Changes to hospital bed availability</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </>
                  )}
                  
                  <Button
                    onClick={() => handleSaveSettings('notification')}
                    className="mt-4"
                  >
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maps" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Map Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">
                        Google Maps API Key is active and configured
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="google-maps-api-key">Google Maps API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="google-maps-api-key" 
                        value={mapApiKey}
                        onChange={(e) => setMapApiKey(e.target.value)}
                        placeholder="Enter your Google Maps API key"
                        className="flex-1"
                      />
                      <Button onClick={handleSaveMapApiKey}>Save API Key</Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      This key is used for route planning and mapping features.
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="font-medium">High Precision Location</p>
                      <p className="text-sm text-gray-500">Use high precision for ambulance tracking</p>
                    </div>
                    <Switch 
                      checked={useHighPrecisionLocation}
                      onCheckedChange={(checked) => setUseHighPrecisionLocation(checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Traffic Updates</p>
                      <p className="text-sm text-gray-500">Show real-time traffic data on map</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Button
                    onClick={() => handleSaveSettings('map')}
                    className="mt-4"
                  >
                    Save Map Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input id="display-name" placeholder="Your display name" />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Your email address" />
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4">
                    <Button variant="default">Update Profile</Button>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Collection</p>
                      <p className="text-sm text-gray-500">Allow collection of usage data to improve services</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Location Sharing</p>
                      <p className="text-sm text-gray-500">Share location data for better emergency response</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <Button
                    onClick={() => handleSaveSettings('privacy')}
                    className="mt-4"
                  >
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Developer Mode</p>
                      <p className="text-sm text-gray-500">Enable advanced features for developers</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Debug Logging</p>
                      <p className="text-sm text-gray-500">Enable verbose logging for troubleshooting</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex flex-col space-y-1.5 mt-4">
                    <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                    <Input 
                      id="data-retention" 
                      type="number" 
                      placeholder="30" 
                      className="w-24"
                    />
                  </div>
                  
                  <Button
                    onClick={() => handleSaveSettings('advanced')}
                    className="mt-4"
                  >
                    Save Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
