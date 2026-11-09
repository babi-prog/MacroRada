import React, { useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  RotateCcw, 
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { Currency, ImpactLevel, FilterState } from '../types/calendar';
import { getCurrencyMeta } from '../utils/formatters';

interface FilterBarProps {
  filters: FilterState;
  onChangeFilters: (newFilters: FilterState) => void;
  totalEventsCount: number;
  filteredEventsCount: number;
}

const ALL_CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'NZD', 'CNY'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  totalEventsCount,
  filteredEventsCount,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut ('/' or 'Cmd+K' / 'Ctrl+K') to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && document.activeElement !== searchInputRef.current) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Day tabs options
  const dayTabs = [
    { key: 'all', label: 'All Week' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
  ];

  // Helper to toggle currency in multi-select
  const handleToggleCurrency = (curr: Currency | 'ALL') => {
    if (curr === 'ALL') {
      onChangeFilters({
        ...filters,
        currencies: [], // empty means all
      });
      return;
    }

    const currentList = filters.currencies;
    if (currentList.includes(curr)) {
      const nextList = currentList.filter(c => c !== curr);
      onChangeFilters({ ...filters, currencies: nextList });
    } else {
      onChangeFilters({ ...filters, currencies: [...currentList, curr] });
    }
  };

  // Helper to toggle impact
  const handleToggleImpact = (impact: ImpactLevel) => {
    const currentList = filters.impacts;
    if (currentList.includes(impact)) {
      // Keep at least one or allow empty to mean none
      const nextList = currentList.filter(i => i !== impact);
      onChangeFilters({ ...filters, impacts: nextList });
    } else {
      onChangeFilters({ ...filters, impacts: [...currentList, impact] });
    }
  };

  const hasActiveFilters = 
    filters.dayTab !== 'all' ||
    filters.currencies.length > 0 ||
    filters.impacts.length < 3 ||
    filters.searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    onChangeFilters({
      dayTab: 'all',
      currencies: [],
      impacts: ['HIGH', 'MEDIUM', 'LOW'],
      searchQuery: '',
      selectedCategory: null,
    });
  };

  return (
    <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-3.5 shadow-lg space-y-3">
      
      {/* Row 1: Day Navigation Tabs & Keyword Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Day Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
            {dayTabs.map(tab => {
              const isActive = filters.dayTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onChangeFilters({ ...filters, dayTab: tab.key })}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/80'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input with Shortcut Badge */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={filters.searchQuery}
            onChange={e => onChangeFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search catalyst (e.g. CPI, Powell, NFP, GDP, Labor)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-16 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 font-mono transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {filters.searchQuery && (
              <button
                onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
                className="text-zinc-400 hover:text-zinc-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 rounded select-none">
              /
            </kbd>
          </div>
        </div>

      </div>

      {/* Row 2: Currency Pills, Impact Toggles, and Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-zinc-800/60">
        
        {/* Currency Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mr-1 hidden sm:inline">
            Currency:
          </span>

          {/* ALL pill */}
          <button
            onClick={() => handleToggleCurrency('ALL')}
            className={`px-2 py-1 rounded text-xs font-mono font-semibold transition-all ${
              filters.currencies.length === 0
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            ALL
          </button>

          {/* Specific Currencies */}
          {ALL_CURRENCIES.map(curr => {
            const meta = getCurrencyMeta(curr);
            const isSelected = filters.currencies.includes(curr);

            return (
              <button
                key={curr}
                onClick={() => handleToggleCurrency(curr)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-all ${
                  isSelected
                    ? `${meta.borderBadge} font-bold shadow-sm`
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span>{meta.flag}</span>
                <span>{curr}</span>
              </button>
            );
          })}
        </div>

        {/* Impact Toggles & Reset */}
        <div className="flex items-center gap-3">
          
          {/* Impact Pills */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
            {/* HIGH */}
            <button
              onClick={() => handleToggleImpact('HIGH')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all ${
                filters.impacts.includes('HIGH')
                  ? 'bg-rose-950/70 text-rose-300 border border-rose-600/60 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>High</span>
            </button>

            {/* MEDIUM */}
            <button
              onClick={() => handleToggleImpact('MEDIUM')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all ${
                filters.impacts.includes('MEDIUM')
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-600/60 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Med</span>
            </button>

            {/* LOW */}
            <button
              onClick={() => handleToggleImpact('LOW')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all ${
                filters.impacts.includes('LOW')
                  ? 'bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
              <span>Low</span>
            </button>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-400 transition-colors px-2 py-1 rounded border border-transparent hover:border-zinc-800"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Filter count badge */}
          <span className="font-mono text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
            Showing <strong className="text-white font-bold">{filteredEventsCount}</strong> of {totalEventsCount}
          </span>
        </div>

      </div>

    </div>
  );
};
