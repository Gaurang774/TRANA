
import React from 'react';
import { useDevicePreview } from '@/hooks/useDevicePreview';
import { RotateCcw, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DevicePreviewContainerProps {
  children: React.ReactNode;
}

export function DevicePreviewContainer({ children }: DevicePreviewContainerProps) {
  const {
    isPreviewMode,
    deviceType,
    orientation,
    toggleOrientation,
    getCurrentDimensions,
    currentConfig
  } = useDevicePreview();

  const dimensions = getCurrentDimensions();

  if (!isPreviewMode || deviceType === 'desktop') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 lg:p-8 flex flex-col items-center">
      {/* Preview Header */}
      <div className="mb-4 flex items-center justify-between w-full max-w-6xl">
        <div className="flex items-center space-x-3">
          <Monitor className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {currentConfig.icon} {currentConfig.name} Preview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dimensions.width} × {dimensions.height} • {orientation}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleOrientation}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Rotate</span>
        </Button>
      </div>

      {/* Preview Container */}
      <div 
        className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          minHeight: '600px'
        }}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Device Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Preview mode active • All interactions remain functional
        </p>
      </div>
    </div>
  );
}
