import { useState, useMemo } from 'react';

export function useFilters<T>(
  items: T[],
  filterFn: (item: T, filters: Record<string, any>) => boolean
) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => filterFn(item, filters));
  }, [items, filters, filterFn]);

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen((prev) => !prev);
  };

  return {
    filters,
    filteredItems,
    isFilterPanelOpen,
    handleFilterChange,
    handleClearFilters,
    toggleFilterPanel,
  };
}

// Utility functions for common filter operations
export const filterHelpers = {
  // Check if text matches (case-insensitive)
  textMatches: (value: string | undefined | null, filterText: string): boolean => {
    if (!filterText) return true;
    if (!value) return false;
    return value.toLowerCase().includes(filterText.toLowerCase());
  },

  // Check if value is in array
  isInArray: (value: any, filterArray: any[]): boolean => {
    if (!filterArray || filterArray.length === 0) return true;
    return filterArray.includes(value);
  },

  // Check if value matches exactly
  exactMatch: (value: any, filterValue: any): boolean => {
    if (filterValue === '' || filterValue === null || filterValue === undefined) return true;
    return value === filterValue;
  },

  // Check if date is in range
  dateInRange: (
    dateStr: string,
    range: { from?: string; to?: string } | undefined
  ): boolean => {
    if (!range || (!range.from && !range.to)) return true;
    const date = new Date(dateStr);
    if (range.from && date < new Date(range.from)) return false;
    if (range.to && date > new Date(range.to)) return false;
    return true;
  },

  // Check if number is in range
  numberInRange: (
    value: number | undefined | null,
    range: { min?: string; max?: string } | undefined
  ): boolean => {
    if (!range || (!range.min && !range.max)) return true;
    if (value === null || value === undefined) return false;
    if (range.min && value < parseFloat(range.min)) return false;
    if (range.max && value > parseFloat(range.max)) return false;
    return true;
  },
};
