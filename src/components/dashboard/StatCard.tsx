
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
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-amber-500 to-amber-600',
  };

  const iconBgVariants = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    red: 'bg-gradient-to-br from-red-500 to-red-600',
    yellow: 'bg-gradient-to-br from-amber-500 to-amber-600',
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-none">
            {value}
          </h3>
          
          {trend && (
            <div className="flex items-center space-x-2">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm font-bold",
                  trend.isPositive ? 'text-emerald-500' : 'text-red-500'
                )}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs last period</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300',
          iconBgVariants[color]
        )}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
