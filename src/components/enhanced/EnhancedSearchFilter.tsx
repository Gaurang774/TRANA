
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, User, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

interface FilterOption {
  key: string;
  label: string;
  value: string;
}

interface EnhancedSearchFilterProps {
  searchPlaceholder?: string;
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
  filterOptions?: {
    [key: string]: { label: string; options: FilterOption[] };
  };
  className?: string;
}

export function EnhancedSearchFilter({
  searchPlaceholder = "Search emergencies, patients, locations...",
  onSearchChange,
  onFilterChange,
  filterOptions = {},
  className = ""
}: EnhancedSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterSelect = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const removeFilter = (filterKey: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  const getFilterIcon = (filterKey: string) => {
    switch (filterKey.toLowerCase()) {
      case 'priority':
        return <AlertTriangle className="h-3 w-3" />;
      case 'date':
      case 'time':
        return <Clock className="h-3 w-3" />;
      case 'location':
        return <MapPin className="h-3 w-3" />;
      case 'assignee':
      case 'doctor':
        return <User className="h-3 w-3" />;
      default:
        return <Filter className="h-3 w-3" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Enhanced Search Bar with Enterprise Styling */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 pr-12 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-medical-blue dark:focus:border-medical-blue rounded-xl shadow-sm text-base"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Enhanced Filter Controls with Better UX */}
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2 h-10 px-4 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-2 text-xs bg-medical-blue text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-2" align="start">
            {Object.entries(filterOptions).map(([key, { label, options }], index) => (
              <div key={key}>
                {index > 0 && <DropdownMenuSeparator className="my-2" />}
                <div className="px-2 py-2">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {getFilterIcon(key)}
                    <span>{label}</span>
                  </div>
                  <div className="space-y-1">
                    {options.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => handleFilterSelect(key, option.value)}
                        className="text-sm cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          {activeFilters[key] === option.value && (
                            <div className="w-2 h-2 bg-medical-blue rounded-full" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Enhanced Active Filter Badges */}
        {Object.entries(activeFilters).map(([key, value]) => {
          const filterOption = filterOptions[key];
          const optionLabel = filterOption?.options.find(opt => opt.value === value)?.label || value;
          return (
            <Badge 
              key={key} 
              variant="secondary" 
              className="flex items-center space-x-2 bg-medical-blue/10 text-medical-blue border-medical-blue/20 hover:bg-medical-blue/20 transition-colors px-3 py-1.5 rounded-lg"
            >
              <div className="flex items-center space-x-1">
                {getFilterIcon(key)}
                <span className="text-xs font-medium">
                  {filterOption?.label}: {optionLabel}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(key)}
                className="h-4 w-4 p-0 hover:bg-medical-blue/30 ml-1 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}

        {/* Enhanced Clear All Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
