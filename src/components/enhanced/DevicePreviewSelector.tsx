
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Monitor, Smartphone, Tablet, RotateCcw, X, Eye } from 'lucide-react';
import { useDevicePreview, DeviceType, deviceConfigs } from '@/hooks/useDevicePreview';

interface DevicePreviewSelectorProps {
  className?: string;
}

export function DevicePreviewSelector({ className = "" }: DevicePreviewSelectorProps) {
  const {
    isPreviewMode,
    deviceType,
    orientation,
    changeDevice,
    toggleOrientation,
    exitPreview,
    currentConfig
  } = useDevicePreview();

  const getDeviceIcon = (device: DeviceType) => {
    switch (device) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isPreviewMode && (
        <Badge 
          variant="secondary" 
          className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
        >
          <Eye className="h-3 w-3 mr-1" />
          Preview Mode
        </Badge>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2 h-10 px-4 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {getDeviceIcon(deviceType)}
            <span className="font-medium hidden sm:inline">
              {isPreviewMode ? `${currentConfig.name} Preview` : 'Device Preview'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-2" align="end">
          <div className="px-2 py-2">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Device Preview Mode
            </div>
            
            {Object.entries(deviceConfigs).map(([key, config]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => changeDevice(key as DeviceType)}
                className="flex items-center justify-between text-sm cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-1"
              >
                <div className="flex items-center space-x-3">
                  {getDeviceIcon(key as DeviceType)}
                  <div>
                    <div className="font-medium">{config.name}</div>
                    {key !== 'desktop' && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {config.width} × {config.height}
                      </div>
                    )}
                  </div>
                </div>
                {deviceType === key && isPreviewMode && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </DropdownMenuItem>
            ))}

            {isPreviewMode && deviceType !== 'desktop' && (
              <>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  onClick={toggleOrientation}
                  className="flex items-center space-x-3 text-sm cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>
                    Switch to {orientation === 'portrait' ? 'Landscape' : 'Portrait'}
                  </span>
                </DropdownMenuItem>
              </>
            )}

            {isPreviewMode && (
              <>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  onClick={exitPreview}
                  className="flex items-center space-x-3 text-sm cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
                >
                  <X className="h-4 w-4" />
                  <span>Exit Preview Mode</span>
                </DropdownMenuItem>
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
