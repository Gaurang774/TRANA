
import { cn } from '@/lib/utils';
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
    blue: 'bg-medical-blue/10 text-medical-blue border-medical-blue/20',
    green: 'bg-medical-green/10 text-medical-green border-medical-green/20',
    red: 'bg-medical-red/10 text-medical-red border-medical-red/20',
    yellow: 'bg-medical-yellow/10 text-medical-yellow border-medical-yellow/20',
  };

  const iconBgVariants = {
    blue: 'bg-medical-blue',
    green: 'bg-medical-green',
    red: 'bg-medical-red',
    yellow: 'bg-medical-yellow',
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-soft hover:shadow-medium transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500 mb-2">{title}</p>
          <h3 className="text-3xl font-semibold text-neutral-900 mb-3">{value}</h3>
          
          {trend && (
            <div className="flex items-center">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-medical-green mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-medical-red mr-1" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? 'text-medical-green' : 'text-medical-red'
                )}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-neutral-400 ml-1">vs last period</span>
            </div>
          )}
        </div>
        
        <div className={cn('p-3 rounded-lg', iconBgVariants[color])}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
