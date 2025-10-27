import React from 'react';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FilterConfig {
  type: 'text' | 'select' | 'multiselect' | 'daterange' | 'numberrange';
  label: string;
  field: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: Record<string, any>;
  onFilterChange: (field: string, value: any) => void;
  onClearFilters: () => void;
  filterConfigs: FilterConfig[];
  resultsCount: number;
  totalCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onToggle,
  filters,
  onFilterChange,
  onClearFilters,
  filterConfigs,
  resultsCount,
  totalCount,
}) => {
  const { t } = useLanguage();

  const hasActiveFilters = Object.values(filters).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some((v) => v !== '' && v !== null && v !== undefined);
    }
    return value !== '' && value !== null && value !== undefined;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('filters')}
          </h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
              {t('active')}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('showingResults', { count: resultsCount, total: totalCount })}
          </span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterConfigs.map((config) => (
              <div key={config.field} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {config.label}
                </label>
                {renderFilterInput(config, filters, onFilterChange)}
              </div>
            ))}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <X className="h-4 w-4" />
                <span>{t('clearFilters')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function renderFilterInput(
  config: FilterConfig,
  filters: Record<string, any>,
  onFilterChange: (field: string, value: any) => void
) {
  const value = filters[config.field];

  switch (config.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onFilterChange(config.field, e.target.value)}
          placeholder={config.placeholder}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
        />
      );

    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => onFilterChange(config.field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value="">{config.placeholder || 'All'}</option>
          {config.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'multiselect':
      return (
        <select
          multiple
          value={value || []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions, (option) => option.value);
            onFilterChange(config.field, selected);
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm min-h-[100px]"
        >
          {config.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'daterange':
      const dateValue = value || { from: '', to: '' };
      return (
        <div className="space-y-2">
          <input
            type="date"
            value={dateValue.from || ''}
            onChange={(e) =>
              onFilterChange(config.field, { ...dateValue, from: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            placeholder="From"
          />
          <input
            type="date"
            value={dateValue.to || ''}
            onChange={(e) =>
              onFilterChange(config.field, { ...dateValue, to: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            placeholder="To"
          />
        </div>
      );

    case 'numberrange':
      const numValue = value || { min: '', max: '' };
      return (
        <div className="space-y-2">
          <input
            type="number"
            value={numValue.min || ''}
            onChange={(e) =>
              onFilterChange(config.field, { ...numValue, min: e.target.value })
            }
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          />
          <input
            type="number"
            value={numValue.max || ''}
            onChange={(e) =>
              onFilterChange(config.field, { ...numValue, max: e.target.value })
            }
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          />
        </div>
      );

    default:
      return null;
  }
}

export default FilterPanel;
