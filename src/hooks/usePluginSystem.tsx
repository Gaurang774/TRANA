
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: 'dashboard' | 'emergency' | 'analytics' | 'integration' | 'utility';
  isEnabled: boolean;
  config?: Record<string, any>;
  component?: React.ComponentType<any>;
  hooks?: {
    onEmergencyCreated?: (emergency: any) => void;
    onAmbulanceDispatched?: (ambulance: any) => void;
    onPatientAdmitted?: (patient: any) => void;
  };
}

export interface PluginRegistry {
  [key: string]: Plugin;
}

const PLUGINS_STORAGE_KEY = 'trana_plugins';

// Built-in plugins with better error handling
const builtInPlugins: Plugin[] = [
  {
    id: 'weather-widget',
    name: 'Weather Widget',
    version: '1.0.0',
    description: 'Displays current weather conditions for emergency planning',
    author: 'TRANA System',
    category: 'dashboard',
    isEnabled: false,
    config: {
      apiKey: '',
      refreshInterval: 30000
    }
  },
  {
    id: 'traffic-monitor',
    name: 'Traffic Monitor',
    version: '1.0.0',
    description: 'Real-time traffic updates for ambulance routing',
    author: 'TRANA System',
    category: 'emergency',
    isEnabled: false,
    config: {
      updateInterval: 60000,
      routeOptimization: true
    }
  },
  {
    id: 'analytics-dashboard',
    name: 'Advanced Analytics',
    version: '1.0.0',
    description: 'Enhanced analytics and reporting dashboard',
    author: 'TRANA System',
    category: 'analytics',
    isEnabled: false,
    config: {
      refreshRate: 5000,
      showPredictions: true
    }
  },
  {
    id: 'sms-notifications',
    name: 'SMS Notifications',
    version: '1.0.0',
    description: 'Send SMS alerts for critical emergencies',
    author: 'TRANA System',
    category: 'integration',
    isEnabled: false,
    config: {
      provider: 'twilio',
      apiKey: '',
      fromNumber: ''
    }
  }
];

export const usePluginSystem = () => {
  const [plugins, setPlugins] = useState<PluginRegistry>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const saved = localStorage.getItem(PLUGINS_STORAGE_KEY);
      const savedPlugins = saved ? JSON.parse(saved) : {};
      
      // Merge built-in plugins with saved configuration
      const pluginRegistry: PluginRegistry = {};
      
      builtInPlugins.forEach(plugin => {
        const savedConfig = savedPlugins[plugin.id];
        pluginRegistry[plugin.id] = {
          ...plugin,
          isEnabled: savedConfig?.isEnabled || false,
          config: { ...plugin.config, ...savedConfig?.config }
        };
      });

      setPlugins(pluginRegistry);
    } catch (error) {
      console.error('Error loading plugins:', error);
      const errorMessage = 'Failed to load plugins';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Fallback to built-in plugins only
      const fallbackRegistry: PluginRegistry = {};
      builtInPlugins.forEach(plugin => {
        fallbackRegistry[plugin.id] = { ...plugin };
      });
      setPlugins(fallbackRegistry);
    } finally {
      setIsLoading(false);
    }
  };

  const savePlugins = (updatedPlugins: PluginRegistry) => {
    try {
      localStorage.setItem(PLUGINS_STORAGE_KEY, JSON.stringify(updatedPlugins));
      setPlugins(updatedPlugins);
      setError(null);
    } catch (error) {
      console.error('Error saving plugins:', error);
      const errorMessage = 'Failed to save plugin configuration';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const togglePlugin = (pluginId: string) => {
    const plugin = plugins[pluginId];
    if (!plugin) {
      toast.error('Plugin not found');
      return;
    }

    try {
      const updatedPlugins = {
        ...plugins,
        [pluginId]: {
          ...plugin,
          isEnabled: !plugin.isEnabled
        }
      };

      savePlugins(updatedPlugins);
      
      toast.success(
        `Plugin "${plugin.name}" ${updatedPlugins[pluginId].isEnabled ? 'enabled' : 'disabled'}`
      );
    } catch (error) {
      console.error('Error toggling plugin:', error);
      toast.error('Failed to toggle plugin');
    }
  };

  const updatePluginConfig = (pluginId: string, config: Record<string, any>) => {
    const plugin = plugins[pluginId];
    if (!plugin) {
      toast.error('Plugin not found');
      return;
    }

    try {
      const updatedPlugins = {
        ...plugins,
        [pluginId]: {
          ...plugin,
          config: { ...plugin.config, ...config }
        }
      };

      savePlugins(updatedPlugins);
      toast.success(`Plugin "${plugin.name}" configuration updated`);
    } catch (error) {
      console.error('Error updating plugin config:', error);
      toast.error('Failed to update plugin configuration');
    }
  };

  const getEnabledPlugins = (): Plugin[] => {
    try {
      return Object.values(plugins).filter(plugin => plugin.isEnabled);
    } catch (error) {
      console.error('Error getting enabled plugins:', error);
      return [];
    }
  };

  const getPluginsByCategory = (category: Plugin['category']): Plugin[] => {
    try {
      return Object.values(plugins).filter(plugin => plugin.category === category);
    } catch (error) {
      console.error('Error getting plugins by category:', error);
      return [];
    }
  };

  const installPlugin = (plugin: Plugin) => {
    if (plugins[plugin.id]) {
      toast.error('Plugin already installed');
      return;
    }

    try {
      const updatedPlugins = {
        ...plugins,
        [plugin.id]: plugin
      };

      savePlugins(updatedPlugins);
      toast.success(`Plugin "${plugin.name}" installed successfully`);
    } catch (error) {
      console.error('Error installing plugin:', error);
      toast.error('Failed to install plugin');
    }
  };

  const uninstallPlugin = (pluginId: string) => {
    const plugin = plugins[pluginId];
    if (!plugin) {
      toast.error('Plugin not found');
      return;
    }

    // Don't allow uninstalling built-in plugins
    if (builtInPlugins.find(p => p.id === pluginId)) {
      toast.error('Cannot uninstall built-in plugins');
      return;
    }

    try {
      const updatedPlugins = { ...plugins };
      delete updatedPlugins[pluginId];

      savePlugins(updatedPlugins);
      toast.success(`Plugin "${plugin.name}" uninstalled`);
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
      toast.error('Failed to uninstall plugin');
    }
  };

  const executePluginHook = (hookName: keyof Plugin['hooks'], data: any) => {
    try {
      getEnabledPlugins().forEach(plugin => {
        if (plugin.hooks && plugin.hooks[hookName]) {
          try {
            plugin.hooks[hookName]!(data);
          } catch (error) {
            console.error(`Error executing ${hookName} hook for plugin ${plugin.name}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('Error executing plugin hooks:', error);
    }
  };

  return {
    plugins: Object.values(plugins),
    isLoading,
    error,
    togglePlugin,
    updatePluginConfig,
    getEnabledPlugins,
    getPluginsByCategory,
    installPlugin,
    uninstallPlugin,
    executePluginHook
  };
};
