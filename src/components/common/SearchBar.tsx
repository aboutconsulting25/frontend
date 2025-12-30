'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value: initialValue = '',
  onSearch,
  placeholder = '검색...',
  debounceMs = 300,
  className,
  autoFocus = false,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  // Sync with external value
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}

// ============================================
// Advanced SearchBar with filters
// ============================================
interface AdvancedSearchBarProps extends Omit<SearchBarProps, 'onSearch'> {
  onSearch: (value: string, filters: Record<string, string>) => void;
  filterOptions?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
}

export function AdvancedSearchBar({
  value: initialValue = '',
  onSearch,
  placeholder = '검색...',
  debounceMs = 300,
  filterOptions = [],
  className,
}: AdvancedSearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value, filters);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, filters, debounceMs, onSearch]);

  return (
    <div className={cn('flex flex-col md:flex-row gap-3', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filterOptions.map((filter) => (
        <select
          key={filter.key}
          value={filters[filter.key] || ''}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
