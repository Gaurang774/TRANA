
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Map, Navigation, LocateFixed, Route } from 'lucide-react';

interface GoogleMapProps {
  className?: string;
  apiKey?: string;
}

// Create a single loader instance to avoid conflicts
let loaderInstance: Loader | null = null;
let currentApiKey: string | null = null;

const GoogleMap = forwardRef<any, GoogleMapProps>(({ className, apiKey }, ref) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [mapApiKey, setMapApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string>('');

  // Initialize API key from props, localStorage, or default
  useEffect(() => {
    let keyToUse = '';
    
    if (apiKey) {
      keyToUse = apiKey;
    } else {
      const savedKey = localStorage.getItem('google_maps_api_key');
      if (savedKey) {
        keyToUse = savedKey;
      } else {
        keyToUse = 'AIzaSyBbiL-W_D_bst3kVbMAJJ1-oGviBO9-P0w';
      }
    }
    
    setMapApiKey(keyToUse);
    
    // Show key input if no valid key is available
    if (!keyToUse || keyToUse === 'YOUR_API_KEY_HERE') {
      setShowKeyInput(true);
    }
  }, [apiKey]);

  // Expose calculateRoute method to parent component via ref
  useImperativeHandle(ref, () => ({
    calculateRoute: (origin: string, destination: string) => {
      if (!directionsService || !directionsRenderer) {
        console.error('Directions service not initialized');
        return;
      }

      directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS
        }
      }, (response, status) => {
        if (status === 'OK' && response) {
          directionsRenderer.setDirections(response);

          // Display route information
          const route = response.routes[0];
          const leg = route.legs[0];
          
          const distanceElement = document.getElementById('route-info-distance');
          const timeElement = document.getElementById('route-info-time');
          
          if (distanceElement && leg?.distance) {
            distanceElement.textContent = leg.distance.text || 'Unknown';
          }
          
          if (timeElement && leg?.duration) {
            timeElement.textContent = leg.duration.text || 'Unknown';
          }
        } else {
          console.error(`Directions request failed: ${status}`);
        }
      });
    }
  }));

  useEffect(() => {
    if (!mapContainer.current || !mapApiKey || mapApiKey === 'YOUR_API_KEY_HERE') {
      return;
    }

    const initMap = async () => {
      try {
        setMapError('');

        // Only create a new loader if we don't have one or the API key changed
        if (!loaderInstance || currentApiKey !== mapApiKey) {
          loaderInstance = new Loader({
            apiKey: mapApiKey,
            version: "weekly",
            libraries: ["places", "routes"]
          });
          currentApiKey = mapApiKey;
        }

        const google = await loaderInstance.load();
        
        if (!mapContainer.current) return;

        const newMap = new google.maps.Map(mapContainer.current, {
          center: { lat: 20.5937, lng: 78.9629 }, // Center on India
          zoom: 5,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        // Add hospitals as markers
        const hospitals = [
          { name: "AIIMS Delhi", position: { lat: 28.5672, lng: 77.2100 } },
          { name: "Tata Memorial Hospital", position: { lat: 18.9977, lng: 72.8111 } },
          { name: "Apollo Hospitals", position: { lat: 13.0067, lng: 80.2206 } },
          { name: "CMC Vellore", position: { lat: 12.9240, lng: 79.1370 } },
          { name: "PGIMER", position: { lat: 30.7650, lng: 76.7786 } }
        ];

        hospitals.forEach(hospital => {
          const marker = new google.maps.Marker({
            position: hospital.position,
            map: newMap,
            title: hospital.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#00AA55',
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 10
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="p-2"><strong>${hospital.name}</strong><br>Emergency beds: 12<br>ICU beds: 5</div>`
          });

          marker.addListener('click', () => {
            infoWindow.open(newMap, marker);
          });
        });

        // Add ambulance markers
        const ambulances = [
          { id: "AMB-001", position: { lat: 28.6139, lng: 77.2090 } },
          { id: "AMB-002", position: { lat: 19.0760, lng: 72.8777 } },
          { id: "AMB-003", position: { lat: 13.0827, lng: 80.2707 } }
        ];

        ambulances.forEach(ambulance => {
          const marker = new google.maps.Marker({
            position: ambulance.position,
            map: newMap,
            title: ambulance.id,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#0066CC',
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 8
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div class="p-2"><strong>${ambulance.id}</strong><br>Status: Active<br>ETA: 8 mins</div>`
          });

          marker.addListener('click', () => {
            infoWindow.open(newMap, marker);
          });
        });

        // Initialize directions services
        const newDirectionsService = new google.maps.DirectionsService();
        const newDirectionsRenderer = new google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#0066CC',
            strokeWeight: 5,
            strokeOpacity: 0.7
          }
        });

        setMap(newMap);
        setDirectionsService(newDirectionsService);
        setDirectionsRenderer(newDirectionsRenderer);
        
        console.log('Google Maps initialized successfully');
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setMapError(`Failed to load Google Maps: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    initMap();
  }, [mapApiKey]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('google-maps-api-key') as HTMLInputElement;
    if (input && input.value) {
      setMapApiKey(input.value);
      setShowKeyInput(false);
      localStorage.setItem('google_maps_api_key', input.value);
      // Reset loader to use new key
      loaderInstance = null;
      currentApiKey = null;
    }
  };

  // Show error message if there's a map error
  if (mapError) {
    return (
      <div className={cn("flex flex-col", className)}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Map Error</p>
          <p className="text-sm text-red-600 mt-1">{mapError}</p>
          <Button 
            onClick={() => setShowKeyInput(true)} 
            className="mt-2"
            size="sm"
          >
            Update API Key
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {showKeyInput ? (
        <div className="p-4 bg-white rounded-lg shadow mb-4">
          <form onSubmit={handleApiKeySubmit} className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600">
              To use Google Maps, please enter your Google Maps API key. You can get one from the 
              <a href="https://console.cloud.google.com/google/maps-apis/overview" 
                target="_blank" rel="noopener noreferrer"
                className="text-medical-blue hover:underline ml-1">
                Google Cloud Console
              </a>.
            </p>
            <div className="flex space-x-2">
              <input 
                id="google-maps-api-key"
                type="text" 
                placeholder="Enter Google Maps API Key"
                defaultValue={mapApiKey}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-blue"
              />
              <Button type="submit">
                Apply
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      <div 
        ref={mapContainer} 
        className={cn(
          "w-full h-[500px] rounded-lg overflow-hidden relative",
          (!mapApiKey || mapApiKey === 'YOUR_API_KEY_HERE') && "bg-gray-100 flex items-center justify-center"
        )}
      >
        {(!mapApiKey || mapApiKey === 'YOUR_API_KEY_HERE') && (
          <div className="text-center p-4">
            <Map className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 mb-2">Enter Google Maps API key to display the map</p>
            <Button onClick={() => setShowKeyInput(true)}>
              Configure API Key
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

GoogleMap.displayName = "GoogleMap";

export default GoogleMap;
