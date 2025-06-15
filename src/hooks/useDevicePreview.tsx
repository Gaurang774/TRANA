
import { useState, useCallback } from 'react';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type OrientationType = 'portrait' | 'landscape';

export interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  icon: string;
}

export const deviceConfigs: Record<DeviceType, DeviceConfig> = {
  mobile: {
    name: 'Mobile',
    width: 360,
    height: 640,
    icon: '📱'
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: '📒'
  },
  desktop: {
    name: 'Desktop',
    width: 0, // Full width
    height: 0, // Full height
    icon: '🖥️'
  }
};

export function useDevicePreview() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [orientation, setOrientation] = useState<OrientationType>('portrait');

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  const changeDevice = useCallback((device: DeviceType) => {
    setDeviceType(device);
    if (!isPreviewMode) {
      setIsPreviewMode(true);
    }
  }, [isPreviewMode]);

  const toggleOrientation = useCallback(() => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  }, []);

  const exitPreview = useCallback(() => {
    setIsPreviewMode(false);
    setDeviceType('desktop');
  }, []);

  const getCurrentDimensions = useCallback(() => {
    const config = deviceConfigs[deviceType];
    if (deviceType === 'desktop' || !isPreviewMode) {
      return { width: '100%', height: '100%' };
    }

    const width = orientation === 'portrait' ? config.width : config.height;
    const height = orientation === 'portrait' ? config.height : config.width;

    return { width: `${width}px`, height: `${height}px` };
  }, [deviceType, orientation, isPreviewMode]);

  return {
    isPreviewMode,
    deviceType,
    orientation,
    togglePreviewMode,
    changeDevice,
    toggleOrientation,
    exitPreview,
    getCurrentDimensions,
    currentConfig: deviceConfigs[deviceType]
  };
}
