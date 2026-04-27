
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
  className?: string;
}

const StatCard = ({ title, value, icon, trend, color = 'blue', className }: StatCardProps) => {
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
    <div className={cn(
      "glass-card group p-6 lg:p-8",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-4">
          <p className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest opacity-70">
            {title}
          </p>
          <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">
            {value}
          </h3>
          
          {trend && (
            <div className="flex items-center space-x-2 pt-2">
              <div className={cn(
                "flex items-center px-2 py-1 rounded-lg text-xs font-black",
                trend.isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 mr-1" />
                )}
                {Math.abs(trend.value)}%
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">vs last period</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'p-4 rounded-2xl shadow-2xl group-hover:scale-110 transition-all duration-500 relative',
          iconBgVariants[color]
        )}>
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity",
            iconBgVariants[color]
          )}></div>
          <div className="relative text-white">
            {React.cloneElement(icon as React.ReactElement, { className: 'h-7 w-7' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
