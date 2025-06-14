
import React, { useState } from 'react';
import { usePluginSystem, Plugin } from '@/hooks/usePluginSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Puzzle, 
  Download, 
  Trash2, 
  Activity,
  BarChart3,
  Zap,
  Smartphone
} from 'lucide-react';

const PluginManager = () => {
  const { 
    plugins, 
    isLoading, 
    togglePlugin, 
    updatePluginConfig, 
    getPluginsByCategory 
  } = usePluginSystem();
  
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});

  const getCategoryIcon = (category: Plugin['category']) => {
    switch (category) {
      case 'dashboard': return <Activity className="h-4 w-4" />;
      case 'emergency': return <Zap className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'integration': return <Smartphone className="h-4 w-4" />;
      case 'utility': return <Settings className="h-4 w-4" />;
      default: return <Puzzle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Plugin['category']) => {
    switch (category) {
      case 'dashboard': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'analytics': return 'bg-green-100 text-green-800';
      case 'integration': return 'bg-purple-100 text-purple-800';
      case 'utility': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfigSave = (plugin: Plugin) => {
    updatePluginConfig(plugin.id, configValues);
    setSelectedPlugin(null);
    setConfigValues({});
  };

  const renderPluginCard = (plugin: Plugin) => (
    <Card key={plugin.id} className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getCategoryIcon(plugin.category)}
              {plugin.name}
            </CardTitle>
            <CardDescription className="text-sm">
              {plugin.description}
            </CardDescription>
          </div>
          <Switch
            checked={plugin.isEnabled}
            onCheckedChange={() => togglePlugin(plugin.id)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getCategoryColor(plugin.category)}>
            {plugin.category}
          </Badge>
          <span className="text-xs text-gray-500">v{plugin.version}</span>
        </div>
        
        <div className="text-xs text-gray-600">
          by {plugin.author}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setSelectedPlugin(plugin);
              setConfigValues(plugin.config || {});
            }}
            className="flex-1"
          >
            <Settings className="h-3 w-3 mr-1" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plugin Manager</h1>
          <p className="text-gray-500">Manage and configure system plugins</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Browse Plugins
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Plugins</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plugins.map(renderPluginCard)}
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPluginsByCategory('dashboard').map(renderPluginCard)}
          </div>
        </TabsContent>

        <TabsContent value="emergency">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPluginsByCategory('emergency').map(renderPluginCard)}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPluginsByCategory('analytics').map(renderPluginCard)}
          </div>
        </TabsContent>

        <TabsContent value="integration">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPluginsByCategory('integration').map(renderPluginCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Plugin Configuration Modal */}
      {selectedPlugin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Configure {selectedPlugin.name}</CardTitle>
              <CardDescription>
                Update plugin configuration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPlugin.config && Object.entries(selectedPlugin.config).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </Label>
                  <Input
                    id={key}
                    type={typeof value === 'boolean' ? 'checkbox' : 'text'}
                    value={configValues[key] || value}
                    onChange={(e) => setConfigValues({
                      ...configValues,
                      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
                    })}
                  />
                </div>
              ))}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => handleConfigSave(selectedPlugin)}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPlugin(null);
                    setConfigValues({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PluginManager;
