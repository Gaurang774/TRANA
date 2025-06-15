
import React, { createContext, useContext } from 'react';
import { useDevicePreview } from '@/hooks/useDevicePreview';

const DevicePreviewContext = createContext<ReturnType<typeof useDevicePreview> | undefined>(undefined);

export function DevicePreviewProvider({ children }: { children: React.ReactNode }) {
  const devicePreview = useDevicePreview();

  return (
    <DevicePreviewContext.Provider value={devicePreview}>
      {children}
    </DevicePreviewContext.Provider>
  );
}

export function useDevicePreviewContext() {
  const context = useContext(DevicePreviewContext);
  if (context === undefined) {
    throw new Error('useDevicePreviewContext must be used within a DevicePreviewProvider');
  }
  return context;
}
