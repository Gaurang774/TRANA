
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, User, MapPin } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  searchPlaceholder = "Search...",
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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            {Object.entries(filterOptions).map(([key, { label, options }]) => (
              <div key={key} className="px-2 py-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </div>
                {options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleFilterSelect(key, option.value)}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                    {activeFilters[key] === option.value && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filter Badges */}
        {Object.entries(activeFilters).map(([key, value]) => {
          const filterOption = filterOptions[key];
          const optionLabel = filterOption?.options.find(opt => opt.value === value)?.label || value;
          return (
            <Badge key={key} variant="secondary" className="flex items-center space-x-1">
              <span className="text-xs">{filterOption?.label}: {optionLabel}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(key)}
                className="h-4 w-4 p-0 hover:bg-gray-300 dark:hover:bg-gray-600 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}

        {/* Clear All Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}
