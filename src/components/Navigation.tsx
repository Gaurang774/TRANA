
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Heart className="h-6 w-6 text-red-500 mr-2" />
            <span className="text-xl font-bold text-gray-900">TRANA</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Public Access Mode</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
