
import React from 'react';
import { cn } from '@/lib/utils';

const EmergencyMap = () => {
  // This is a mockup map for the demo
  // In a real app, this would integrate with a mapping API like Google Maps or Mapbox
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">Emergency Response Map</h2>
          <p className="text-sm text-gray-500">Live ambulance tracking & hospital locations</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-medical-blue mr-1 animate-pulse"></div>
            <span>Ambulance</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-medical-red mr-1"></div>
            <span>Emergency</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-medical-green mr-1"></div>
            <span>Hospital</span>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: '440px' }}>
        {/* Map Background */}
        <div className="absolute inset-0 bg-gray-100 p-1">
          <div className="w-full h-full bg-gray-200 relative overflow-hidden">
            {/* Simulated Map with Grid */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-300/30"></div>
              ))}
            </div>
            
            {/* Road Network */}
            <div className="absolute inset-0">
              {/* Horizontal Roads */}
              <div className="absolute h-1.5 bg-gray-400/40 left-0 right-0 top-1/4"></div>
              <div className="absolute h-1.5 bg-gray-400/40 left-0 right-0 top-2/4"></div>
              <div className="absolute h-1.5 bg-gray-400/40 left-0 right-0 top-3/4"></div>
              
              {/* Vertical Roads */}
              <div className="absolute w-1.5 bg-gray-400/40 top-0 bottom-0 left-1/4"></div>
              <div className="absolute w-1.5 bg-gray-400/40 top-0 bottom-0 left-2/4"></div>
              <div className="absolute w-1.5 bg-gray-400/40 top-0 bottom-0 left-3/4"></div>
            </div>
            
            {/* Hospitals */}
            <div className="absolute w-5 h-5 bg-medical-green rounded-full top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[10px] font-bold">H</div>
            <div className="absolute w-5 h-5 bg-medical-green rounded-full top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[10px] font-bold">H</div>
            
            {/* Ambulances */}
            <div className="absolute w-4 h-4 bg-medical-blue rounded-full top-[30%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[8px] animate-pulse-slow">A1</div>
            <div className="absolute w-4 h-4 bg-medical-blue rounded-full top-[65%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[8px] animate-pulse-slow">A2</div>
            
            {/* Emergency Incident */}
            <div className="absolute top-[65%] left-[45%]">
              <div className="w-5 h-5 bg-medical-red rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-[10px] font-bold">!</div>
              <div className="w-12 h-12 bg-medical-red/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>
            
            {/* Optimal Route */}
            <svg className="absolute inset-0" style={{ zIndex: 5 }}>
              <path 
                d="M245,130 L200,200 L250,280 L350,310" 
                stroke="#0066CC" 
                strokeWidth="2.5" 
                strokeDasharray="6 3" 
                fill="none" 
              />
            </svg>
            
            {/* Traffic Congestion */}
            <div className="absolute w-12 h-12 bg-medical-yellow/20 rounded-full top-[50%] left-[60%] transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
