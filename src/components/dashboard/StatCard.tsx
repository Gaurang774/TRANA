
import { cn } from '@/lib/utils';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

const StatCard = ({ title, value, icon, trend, color = 'blue' }: StatCardProps) => {
  const colorVariants = {
    blue: 'bg-medical-blue text-white',
    green: 'bg-medical-green text-white',
    red: 'bg-medical-red text-white',
    yellow: 'bg-medical-yellow text-gray-900',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs",
                  trend.isPositive ? 'text-medical-green' : 'text-medical-red'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={cn('p-2 rounded-md', colorVariants[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
