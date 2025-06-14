
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface CachedHospital {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
  available_beds: number;
  total_beds: number;
}

export interface OfflineMapData {
  hospitals: CachedHospital[];
  emergencies: any[];
  ambulances: any[];
  lastUpdated: string;
}

const CACHE_KEY = 'trana_offline_map_data';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useOfflineMap = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState<OfflineMapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Using cached data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data on mount
    loadCachedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached) as OfflineMapData;
        const lastUpdated = new Date(data.lastUpdated);
        const now = new Date();
        
        // Check if cache is still valid
        if (now.getTime() - lastUpdated.getTime() < CACHE_DURATION) {
          setCachedData(data);
        } else {
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  };

  const cacheMapData = async (data: Partial<OfflineMapData>) => {
    setIsLoading(true);
    try {
      const existingData = cachedData || {
        hospitals: [],
        emergencies: [],
        ambulances: [],
        lastUpdated: new Date().toISOString()
      };

      const updatedData: OfflineMapData = {
        ...existingData,
        ...data,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(updatedData));
      setCachedData(updatedData);
      
      console.log('Map data cached successfully');
    } catch (error) {
      console.error('Error caching map data:', error);
      toast.error('Failed to cache map data');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    setCachedData(null);
    toast.success('Offline cache cleared');
  };

  const getNearestHospitals = (userLat: number, userLng: number, limit = 5): CachedHospital[] => {
    if (!cachedData?.hospitals) return [];

    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    return cachedData.hospitals
      .map(hospital => ({
        ...hospital,
        distance: calculateDistance(
          userLat, userLng,
          hospital.coordinates.lat, hospital.coordinates.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  };

  const getOfflineMapBounds = () => {
    if (!cachedData?.hospitals || cachedData.hospitals.length === 0) {
      return null;
    }

    const lats = cachedData.hospitals.map(h => h.coordinates.lat);
    const lngs = cachedData.hospitals.map(h => h.coordinates.lng);

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs)
    };
  };

  return {
    isOnline,
    cachedData,
    isLoading,
    cacheMapData,
    clearCache,
    getNearestHospitals,
    getOfflineMapBounds,
    isCacheAvailable: !!cachedData
  };
};
