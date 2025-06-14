
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

// Built-in plugins
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

  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = () => {
    setIsLoading(true);
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
      toast.error('Failed to load plugins');
    } finally {
      setIsLoading(false);
    }
  };

  const savePlugins = (updatedPlugins: PluginRegistry) => {
    try {
      localStorage.setItem(PLUGINS_STORAGE_KEY, JSON.stringify(updatedPlugins));
      setPlugins(updatedPlugins);
    } catch (error) {
      console.error('Error saving plugins:', error);
      toast.error('Failed to save plugin configuration');
    }
  };

  const togglePlugin = (pluginId: string) => {
    const plugin = plugins[pluginId];
    if (!plugin) return;

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
  };

  const updatePluginConfig = (pluginId: string, config: Record<string, any>) => {
    const plugin = plugins[pluginId];
    if (!plugin) return;

    const updatedPlugins = {
      ...plugins,
      [pluginId]: {
        ...plugin,
        config: { ...plugin.config, ...config }
      }
    };

    savePlugins(updatedPlugins);
    toast.success(`Plugin "${plugin.name}" configuration updated`);
  };

  const getEnabledPlugins = (): Plugin[] => {
    return Object.values(plugins).filter(plugin => plugin.isEnabled);
  };

  const getPluginsByCategory = (category: Plugin['category']): Plugin[] => {
    return Object.values(plugins).filter(plugin => plugin.category === category);
  };

  const installPlugin = (plugin: Plugin) => {
    if (plugins[plugin.id]) {
      toast.error('Plugin already installed');
      return;
    }

    const updatedPlugins = {
      ...plugins,
      [plugin.id]: plugin
    };

    savePlugins(updatedPlugins);
    toast.success(`Plugin "${plugin.name}" installed successfully`);
  };

  const uninstallPlugin = (pluginId: string) => {
    const plugin = plugins[pluginId];
    if (!plugin) return;

    // Don't allow uninstalling built-in plugins
    if (builtInPlugins.find(p => p.id === pluginId)) {
      toast.error('Cannot uninstall built-in plugins');
      return;
    }

    const updatedPlugins = { ...plugins };
    delete updatedPlugins[pluginId];

    savePlugins(updatedPlugins);
    toast.success(`Plugin "${plugin.name}" uninstalled`);
  };

  const executePluginHook = (hookName: keyof Plugin['hooks'], data: any) => {
    getEnabledPlugins().forEach(plugin => {
      if (plugin.hooks && plugin.hooks[hookName]) {
        try {
          plugin.hooks[hookName]!(data);
        } catch (error) {
          console.error(`Error executing ${hookName} hook for plugin ${plugin.name}:`, error);
        }
      }
    });
  };

  return {
    plugins: Object.values(plugins),
    isLoading,
    togglePlugin,
    updatePluginConfig,
    getEnabledPlugins,
    getPluginsByCategory,
    installPlugin,
    uninstallPlugin,
    executePluginHook
  };
};
