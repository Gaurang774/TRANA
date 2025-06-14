
import React from 'react';

const EmergencyMap = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Emergency Response Map</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Live ambulance tracking & hospital locations
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center text-xs font-medium bg-white dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
              <span className="text-gray-700 dark:text-gray-200">Ambulance</span>
            </div>
            <div className="flex items-center text-xs font-medium bg-white dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></div>
              <span className="text-gray-700 dark:text-gray-200">Emergency</span>
            </div>
            <div className="flex items-center text-xs font-medium bg-white dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></div>
              <span className="text-gray-700 dark:text-gray-200">Hospital</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: '480px' }}>
        {/* Enhanced Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-2">
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 relative overflow-hidden rounded-xl border border-gray-300 dark:border-gray-600">
            {/* Enhanced Grid */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-30">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="border border-gray-400/20 dark:border-gray-500/20"></div>
              ))}
            </div>
            
            {/* Enhanced Road Network */}
            <div className="absolute inset-0">
              {/* Horizontal Roads */}
              <div className="absolute h-2 bg-gray-500/60 dark:bg-gray-400/60 left-0 right-0 top-1/4 rounded-full"></div>
              <div className="absolute h-2 bg-gray-500/60 dark:bg-gray-400/60 left-0 right-0 top-2/4 rounded-full"></div>
              <div className="absolute h-2 bg-gray-500/60 dark:bg-gray-400/60 left-0 right-0 top-3/4 rounded-full"></div>
              
              {/* Vertical Roads */}
              <div className="absolute w-2 bg-gray-500/60 dark:bg-gray-400/60 top-0 bottom-0 left-1/4 rounded-full"></div>
              <div className="absolute w-2 bg-gray-500/60 dark:bg-gray-400/60 top-0 bottom-0 left-2/4 rounded-full"></div>
              <div className="absolute w-2 bg-gray-500/60 dark:bg-gray-400/60 top-0 bottom-0 left-3/4 rounded-full"></div>
            </div>
            
            {/* Enhanced Hospitals */}
            <div className="absolute w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white">
              H
            </div>
            <div className="absolute w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full top-3/4 left-3/4 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white">
              H
            </div>
            
            {/* Enhanced Ambulances */}
            <div className="absolute w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full top-[30%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg border-2 border-white">
              A1
            </div>
            <div className="absolute w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full top-[65%] left-[20%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg border-2 border-white">
              A2
            </div>
            
            {/* Enhanced Emergency Incident */}
            <div className="absolute top-[65%] left-[45%]">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white">
                !
              </div>
              <div className="w-16 h-16 bg-red-500/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="w-24 h-24 bg-red-500/10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>
            
            {/* Enhanced Optimal Route */}
            <svg className="absolute inset-0" style={{ zIndex: 5 }}>
              <path 
                d="M245,130 L200,200 L250,280 L350,310" 
                stroke="#3B82F6" 
                strokeWidth="3" 
                strokeDasharray="8 4" 
                fill="none" 
                className="drop-shadow-sm"
              />
            </svg>
            
            {/* Enhanced Traffic Congestion */}
            <div className="absolute w-16 h-16 bg-amber-500/30 rounded-full top-[50%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 border-2 border-amber-400/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMap;
