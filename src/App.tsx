import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  RefreshCw, 
  Filter, 
  HelpCircle, 
  SlidersHorizontal,
  Flame,
  Clock,
  ArrowUpDown,
  Download,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { MacroEvent, TimezoneMode, FilterState, Currency, ImpactLevel, FeedMode, FeedTelemetry } from './types/calendar';
import { 
  fetchMacroCalendarWithTelemetry, 
  checkManualSyncCooldown, 
  saveActualOverride, 
  removeActualOverride 
} from './services/calendarService';
import { TopHud } from './components/TopHud';
import { Timeline24H } from './components/Timeline24H';
import { FilterBar } from './components/FilterBar';
import { EventRow } from './components/EventRow';
import { EventDrawer } from './components/EventDrawer';
import { StatsSummary } from './components/StatsSummary';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { isSameDayInTimezone, formatEventDate } from './utils/timezone';

export const App: React.FC = () => {
  const [events, setEvents] = useState<MacroEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedMode, setFeedMode] = useState<FeedMode>(() => {
    try {
      const saved = localStorage.getItem('macroradar_feed_mode');
      return (saved === 'simulation' || saved === 'live') ? saved : 'live';
    } catch {
      return 'live';
    }
  });
  const [feedTelemetry, setFeedTelemetry] = useState<FeedTelemetry | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncCooldownSec, setSyncCooldownSec] = useState<number>(() => {
    return checkManualSyncCooldown().remainingSec;
  });

  const [timezoneMode, setTimezoneMode] = useState<TimezoneMode>(() => {
    const saved = localStorage.getItem('macroradar_tz');
    return (saved === 'EAT' || saved === 'NY') ? saved : 'NY';
  });
  
  const [selectedEvent, setSelectedEvent] = useState<MacroEvent | null>(null);
  const [simulateImminent, setSimulateImminent] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [nowMs, setNowMs] = useState<number>(Date.now());

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    dayTab: 'today',
    currencies: [],
    impacts: ['HIGH', 'MEDIUM', 'LOW'],
    searchQuery: '',
    selectedCategory: null,
  });

  // Save timezone preference
  const handleToggleTimezone = (mode: TimezoneMode) => {
    setTimezoneMode(mode);
    localStorage.setItem('macroradar_tz', mode);
  };

  // Load calendar events
  const loadData = async (mode = feedMode, forceSync = false) => {
    setLoading(true);
    if (forceSync) setIsSyncing(true);
    try {
      const res = await fetchMacroCalendarWithTelemetry(mode, { forceSync });
      setEvents(res.events);
      setFeedTelemetry(res.telemetry);
    } catch (err) {
      console.error('Failed to load macro calendar:', err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  // Toggle feed mode (Live FF Feed <-> Simulator)
  const handleToggleFeedMode = (newMode: FeedMode) => {
    setFeedMode(newMode);
    try {
      localStorage.setItem('macroradar_feed_mode', newMode);
    } catch {}
    loadData(newMode, false);
  };

  // Force sync manual handler
  const handleManualSync = () => {
    if (feedMode === 'simulation') {
      loadData('simulation', false);
      return;
    }
    const cooldown = checkManualSyncCooldown();
    if (!cooldown.allowed) {
      setSyncCooldownSec(cooldown.remainingSec);
      return;
    }
    loadData('live', true);
    setTimeout(() => {
      setSyncCooldownSec(checkManualSyncCooldown().remainingSec);
    }, 100);
  };

  // Custom Actual print override handler
  const handleUpdateActual = (eventId: string, newActual: number | null) => {
    if (newActual === null) {
      removeActualOverride(eventId);
    } else {
      saveActualOverride(eventId, newActual);
    }

    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, actual: newActual } : e));
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(prev => prev ? { ...prev, actual: newActual } : null);
    }
  };

  // Cooldown countdown tick
  useEffect(() => {
    if (syncCooldownSec <= 0) return;
    const interval = setInterval(() => {
      const cd = checkManualSyncCooldown();
      setSyncCooldownSec(cd.remainingSec);
      if (cd.remainingSec <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [syncCooldownSec]);

  useEffect(() => {
    loadData(feedMode, false);
    // Refresh time tick
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Global hotkey shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleToggleTimezone(timezoneMode === 'NY' ? 'EAT' : 'NY');
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleToggleFeedMode(feedMode === 'live' ? 'simulation' : 'live');
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleManualSync();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setSimulateImminent(prev => !prev);
      } else if (e.key === '1') {
        setFilters(f => ({ ...f, dayTab: 'yesterday' }));
      } else if (e.key === '2') {
        setFilters(f => ({ ...f, dayTab: 'today' }));
      } else if (e.key === '3') {
        setFilters(f => ({ ...f, dayTab: 'tomorrow' }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timezoneMode, feedMode, syncCooldownSec]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // 1. Day Filter
      if (filters.dayTab === 'today') {
        if (!isSameDayInTimezone(e.timestamp, nowMs, timezoneMode)) return false;
      } else if (filters.dayTab === 'yesterday') {
        if (!isSameDayInTimezone(e.timestamp, nowMs - 86400000, timezoneMode)) return false;
      } else if (filters.dayTab === 'tomorrow') {
        if (!isSameDayInTimezone(e.timestamp, nowMs + 86400000, timezoneMode)) return false;
      }

      // 2. Currency Filter
      if (filters.currencies.length > 0 && !filters.currencies.includes(e.currency)) {
        return false;
      }

      // 3. Impact Filter
      if (!filters.impacts.includes(e.impact)) {
        return false;
      }

      // 4. Keyword Search Query
      if (filters.searchQuery.trim().length > 0) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(query);
        const matchesCurrency = e.currency.toLowerCase().includes(query);
        const matchesAgency = e.agency.toLowerCase().includes(query);
        const matchesCategory = e.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCurrency && !matchesAgency && !matchesCategory) {
          return false;
        }
      }

      // 5. Category filter
      if (filters.selectedCategory && e.category !== filters.selectedCategory) {
        return false;
      }

      return true;
    });
  }, [events, filters, timezoneMode, nowMs]);

  // Group events by formatted day
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: MacroEvent[] } = {};
    filteredEvents.forEach(evt => {
      const dayKey = formatEventDate(evt.timestamp, timezoneMode);
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(evt);
    });
    return groups;
  }, [filteredEvents, timezoneMode]);

  // CSV export helper
  const handleExportCSV = () => {
    const headers = ['Time', 'Currency', 'Impact', 'Title', 'Category', 'Actual', 'Forecast', 'Previous', 'Unit', 'Agency'];
    const rows = filteredEvents.map(e => [
      new Date(e.timestamp).toISOString(),
      e.currency,
      e.impact,
      `"${e.title.replace(/"/g, '""')}"`,
      e.category,
      e.actual ?? '',
      e.forecast ?? '',
      e.previous ?? '',
      e.unit,
      `"${e.agency.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MacroRadar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-300">
      
      {/* 1. Real-Time HUD & Dual Clocks */}
      <TopHud
        timezoneMode={timezoneMode}
        onToggleTimezone={handleToggleTimezone}
        events={events}
        simulateImminent={simulateImminent}
        onToggleSimulateImminent={() => setSimulateImminent(prev => !prev)}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
        feedMode={feedMode}
        onToggleFeedMode={handleToggleFeedMode}
        feedTelemetry={feedTelemetry}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        syncCooldownSec={syncCooldownSec}
      />

      {/* Main Terminal Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-5">
        
        {/* Terminal Surveillance Summary Cards */}
        <StatsSummary events={events} />

        {/* 2. Visual 24-Hour Event Timeline Radar */}
        <Timeline24H
          events={events}
          timezoneMode={timezoneMode}
          onSelectEvent={(evt) => setSelectedEvent(evt)}
          selectedEventId={selectedEvent?.id || null}
        />

        {/* 3. Multi-Dimensional Filter & Search Bar */}
        <FilterBar
          filters={filters}
          onChangeFilters={setFilters}
          totalEventsCount={events.length}
          filteredEventsCount={filteredEvents.length}
        />

        {/* Macro Calendar Table Container */}
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl overflow-hidden shadow-2xl">
          
          {/* Table Header Controls */}
          <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-cyan-400" />
              <span className="font-bold uppercase tracking-wider text-zinc-300 font-mono">
                Economic Catalyst Schedule
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[11px] border border-zinc-700">
                {filters.dayTab.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700 text-xs font-mono"
                title="Export current table to CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => handleManualSync()}
                disabled={loading || (feedMode === 'live' && syncCooldownSec > 0)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700 text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                title={syncCooldownSec > 0 ? `Sync cooldown active (${syncCooldownSec}s)` : "Sync terminal data"}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading || isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Sync</span>
              </button>

              <button
                onClick={() => setShowShortcutsModal(true)}
                className="flex items-center gap-1 text-zinc-400 hover:text-cyan-300 transition-colors"
                title="Keyboard shortcuts (?)"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabular Terminal Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-zinc-900/90 text-zinc-400 text-[10px] uppercase font-mono tracking-wider border-b border-zinc-800 select-none">
                <tr>
                  <th className="py-2.5 px-3.5">Time ({timezoneMode})</th>
                  <th className="py-2.5 px-3">Cur</th>
                  <th className="py-2.5 px-3">Impact</th>
                  <th className="py-2.5 px-3.5">Event Title & Agency</th>
                  <th className="py-2.5 px-3 text-right">Actual</th>
                  <th className="py-2.5 px-3 text-right">Forecast</th>
                  <th className="py-2.5 px-3 text-right">Previous</th>
                  <th className="py-2.5 px-4">Surprise / Deviation</th>
                  <th className="py-2.5 px-3 text-right">Intel</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/40">
                {Object.keys(groupedEvents).length > 0 ? (
                  Object.entries(groupedEvents).map(([dayLabel, dayEvts]) => (
                    <React.Fragment key={dayLabel}>
                      {/* Day Header Divider */}
                      <tr className="bg-zinc-900/40 border-y border-zinc-800/80">
                        <td colSpan={9} className="py-2 px-3.5 font-mono font-bold text-xs text-cyan-400 bg-zinc-900/30">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            <span>{dayLabel}</span>
                            <span className="text-zinc-500 font-normal">
                              ({dayEvts.length} {dayEvts.length === 1 ? 'release' : 'releases'})
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Day Events */}
                      {dayEvts.map(evt => (
                        <EventRow
                          key={evt.id}
                          event={evt}
                          timezoneMode={timezoneMode}
                          isSelected={selectedEvent?.id === evt.id}
                          onSelect={setSelectedEvent}
                        />
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-zinc-500 font-mono">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Filter className="w-6 h-6 text-zinc-600" />
                        <span className="text-sm font-semibold text-zinc-400">
                          No economic events match current filter parameters
                        </span>
                        <span className="text-xs text-zinc-600">
                          Try adjusting currency pills or clearing search terms.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Status */}
          <div className="px-4 py-2.5 bg-zinc-900/60 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500">
            <div>
              <span>Displaying <strong>{filteredEvents.length}</strong> events</span>
              <span className="mx-2">•</span>
              <span>Active Timezone: <strong className="text-zinc-300">{timezoneMode === 'NY' ? 'US Eastern (UTC-4)' : 'East Africa (UTC+3)'}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">?</kbd> for terminal hotkeys</span>
            </div>
          </div>

        </div>

      </main>

      {/* Slide-Over Macro Intelligence Drawer */}
      <EventDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        timezoneMode={timezoneMode}
        onUpdateActual={handleUpdateActual}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Terminal Bottom Minimal Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-3 px-4 text-center text-[11px] font-mono text-zinc-600">
        MacroRadar Institutional Volatility Terminal • Strictly Non-Trading Macro Intelligence & Event Deviation Surveillance
      </footer>

    </div>
  );
};

export default App;
