import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  Radio, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  Flame, 
  RefreshCw,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { MacroEvent, TimezoneMode, FeedMode, FeedTelemetry } from '../types/calendar';
import { getLiveClockString, formatCountdown } from '../utils/timezone';

interface TopHudProps {
  timezoneMode: TimezoneMode;
  onToggleTimezone: (mode: TimezoneMode) => void;
  events: MacroEvent[];
  simulateImminent: boolean;
  onToggleSimulateImminent: () => void;
  onSelectEvent: (event: MacroEvent) => void;
  feedMode: FeedMode;
  onToggleFeedMode: (mode: FeedMode) => void;
  feedTelemetry: FeedTelemetry | null;
  onManualSync: () => void;
  isSyncing: boolean;
  syncCooldownSec: number;
}

export const TopHud: React.FC<TopHudProps> = ({
  timezoneMode,
  onToggleTimezone,
  events,
  simulateImminent,
  onToggleSimulateImminent,
  onSelectEvent,
  feedMode,
  onToggleFeedMode,
  feedTelemetry,
  onManualSync,
  isSyncing,
  syncCooldownSec,
}) => {
  const [nyClock, setNyClock] = useState<string>('--:--:--');
  const [eatClock, setEatClock] = useState<string>('--:--:--');
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Live ticking clock every second
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNowMs(d.getTime());
      setNyClock(getLiveClockString('America/New_York', d));
      setEatClock(getLiveClockString('Africa/Addis_Ababa', d));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format "Last synced: Xm ago"
  const getSyncTimeStr = (): string => {
    if (!feedTelemetry?.lastUpdated) return 'Not synced';
    const elapsedMs = Math.max(0, nowMs - feedTelemetry.lastUpdated);
    const sec = Math.floor(elapsedMs / 1000);
    if (sec < 45) return 'Just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hours = Math.floor(min / 60);
    return `${hours}h ago`;
  };

  // Find next upcoming HIGH impact event
  const upcomingHighEvents = events
    .filter(e => e.impact === 'HIGH' && e.timestamp > nowMs)
    .sort((a, b) => a.timestamp - b.timestamp);

  const nextHighEvent = upcomingHighEvents[0] || null;

  // Imminent warning logic: is there a HIGH impact event within 15 minutes?
  const isRealImminent = nextHighEvent 
    ? (nextHighEvent.timestamp - nowMs <= 15 * 60 * 1000 && nextHighEvent.timestamp > nowMs) 
    : false;

  const showWarningBanner = isRealImminent || simulateImminent;

  // Event to display in warning banner
  const bannerEvent = simulateImminent
    ? ({
        id: 'simulated-imminent',
        title: 'US CPI (YoY) & Core Inflation Rate',
        currency: 'USD',
        timestamp: nowMs + 4 * 60 * 1000 + 18 * 1000,
        forecast: 3.1,
        previous: 3.3,
        unit: '%'
      } as unknown as MacroEvent)
    : nextHighEvent;

  // Desktop OS native notification bridge
  useEffect(() => {
    if (showWarningBanner && bannerEvent && typeof window !== 'undefined' && window.electronAPI?.sendDesktopNotification) {
      window.electronAPI.sendDesktopNotification(
        'Macro Volatility Alert: Imminent Release',
        `${bannerEvent.currency} ${bannerEvent.title} releasing in less than 15 minutes!`
      );
    }
  }, [showWarningBanner, bannerEvent?.id]);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl">
      {/* 1. Macro Volatility Warning Banner (Appears when HIGH impact < 15 mins or Simulated) */}
      {showWarningBanner && bannerEvent && (
        <div className="relative overflow-hidden bg-gradient-to-r from-red-950 via-rose-950/90 to-red-950 border-b border-red-500/60 px-4 py-2.5 shadow-glow-red animate-pulse-fast">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-red-200">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs md:text-sm text-red-100">
                <Flame className="w-4 h-4 text-red-400" />
                <span>MACRO VOLATILITY ALERT:</span>
                <span className="text-white bg-red-900/80 border border-red-400/40 px-2 py-0.5 rounded font-mono text-xs">
                  {simulateImminent ? '[SIMULATED TEST]' : 'IMMINENT HIGH-IMPACT RELEASE'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => onSelectEvent(bannerEvent)}
                className="flex items-center gap-2 hover:underline text-xs md:text-sm font-semibold text-white bg-red-900/50 hover:bg-red-800/60 px-3 py-1 rounded border border-red-500/40 transition-colors"
              >
                <span>{bannerEvent.currency} {bannerEvent.title}</span>
                <span className="font-mono text-yellow-300 font-bold">
                  {formatCountdown(bannerEvent.timestamp, nowMs)}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Terminal Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Section: Brand & Data Source Control Pill */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 shadow-inner group">
              <Radio className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base md:text-lg tracking-tight text-white flex items-center gap-1">
                  Macro<span className="text-cyan-400">Radar</span>
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider bg-zinc-800 text-cyan-300 border border-zinc-700 font-semibold">
                  v2.4
                </span>
              </div>
            </div>
          </div>

          {/* Data Source Control Pill */}
          <div className="flex items-center bg-zinc-900/95 border border-zinc-800 rounded-lg p-0.5 text-xs shadow-inner">
            {/* Mode Switcher: LIVE FF FEED */}
            <button
              onClick={() => onToggleFeedMode('live')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all font-mono text-[11px] ${
                feedMode === 'live'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Connect to Live ForexFactory weekly JSON feed via Vite Proxy"
            >
              <span className="relative flex h-2 w-2">
                {feedMode === 'live' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${feedMode === 'live' ? 'bg-emerald-400' : 'bg-zinc-600'}`}></span>
              </span>
              <span>LIVE FF FEED</span>
            </button>

            {/* Mode Switcher: SIMULATOR */}
            <button
              onClick={() => onToggleFeedMode('simulation')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all font-mono text-[11px] ${
                feedMode === 'simulation'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50 shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Switch to Synthetic Simulation Engine (30 Scenarios)"
            >
              <span className={`w-2 h-2 rounded-full ${feedMode === 'simulation' ? 'bg-purple-400 shadow-glow-purple' : 'bg-zinc-600'}`}></span>
              <span>SIMULATOR</span>
            </button>

            {/* Divider */}
            <span className="w-[1px] h-3.5 bg-zinc-800 mx-1"></span>

            {/* Sync Status Readout & Refresh Button */}
            <div className="flex items-center gap-1.5 pl-1 pr-1 font-mono text-[10px] text-zinc-400">
              <span className="hidden sm:inline">Last synced:</span>
              <span className="text-zinc-300 font-semibold">{getSyncTimeStr()}</span>

              <button
                onClick={onManualSync}
                disabled={isSyncing || syncCooldownSec > 0}
                className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
                  isSyncing 
                    ? 'text-cyan-400 cursor-wait' 
                    : syncCooldownSec > 0 
                      ? 'text-zinc-600 cursor-not-allowed' 
                      : 'text-zinc-400 hover:text-white'
                }`}
                title={
                  syncCooldownSec > 0 
                    ? `Rate-limit guard active: wait ${syncCooldownSec}s before re-syncing` 
                    : 'Force sync live feed from ForexFactory'
                }
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Graceful Fallback Badges (Amber) */}
          {feedMode === 'live' && feedTelemetry?.source === 'cache' && (
            <div 
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/50 border border-amber-600/40 text-amber-300"
              title={feedTelemetry.error || 'Serving cached weekly payload (TTL 15m)'}
            >
              <Database className="w-3 h-3 text-amber-400" />
              <span>{feedTelemetry.isStale ? 'CACHE FALLBACK' : 'CACHED (15M TTL)'}</span>
            </div>
          )}

          {feedMode === 'live' && feedTelemetry?.source === 'fallback_mock' && (
            <div 
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 border border-rose-600/50 text-rose-300"
              title={feedTelemetry.error || 'Live feed unavailable; running in dynamic mock engine'}
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>SIMULATION MODE (FALLBACK)</span>
            </div>
          )}
        </div>

        {/* Center: Next High Impact Countdown Display */}
        <div className="flex items-center">
          {nextHighEvent ? (
            <div 
              onClick={() => onSelectEvent(nextHighEvent)}
              className="cursor-pointer group flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm"
              title="Click to view event details"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  NEXT CATALYST:
                </span>
              </div>
              <span className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors">
                {nextHighEvent.currency} {nextHighEvent.title}
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-950 text-amber-400 border border-zinc-800">
                IN {formatCountdown(nextHighEvent.timestamp, nowMs)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
              <span>No upcoming high-impact catalysts remaining today</span>
            </div>
          )}
        </div>

        {/* Right Section: Dual Monospace Clocks & Timezone Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Dual Monospace Clocks */}
          <div className="flex items-center rounded-lg bg-zinc-900/90 border border-zinc-800/90 p-1 text-xs">
            {/* New York Clock (UTC-4) */}
            <button
              onClick={() => onToggleTimezone('NY')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                timezoneMode === 'NY'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Display terminal schedule in New York (EDT/UTC-4)"
            >
              <span className="text-[10px] font-mono tracking-wider opacity-75">NY</span>
              <span className="font-mono text-xs tabular-nums font-semibold tracking-wider">{nyClock}</span>
            </button>

            <span className="w-[1px] h-4 bg-zinc-800 mx-1"></span>

            {/* Addis Ababa / EAT Clock (UTC+3) */}
            <button
              onClick={() => onToggleTimezone('EAT')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                timezoneMode === 'EAT'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Display terminal schedule in Addis Ababa (EAT/UTC+3)"
            >
              <span className="text-[10px] font-mono tracking-wider opacity-75">EAT</span>
              <span className="font-mono text-xs tabular-nums font-semibold tracking-wider">{eatClock}</span>
            </button>
          </div>

          {/* Quick Simulate Alert Toggle Button */}
          <button
            onClick={onToggleSimulateImminent}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              simulateImminent
                ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-glow-red animate-pulse'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-zinc-100'
            }`}
            title="Toggle simulated 15-minute high impact warning banner"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Simulate Imminent News</span>
            <span className="xl:hidden">Alert Test</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
            title={audioEnabled ? 'Alarm sounds enabled' : 'Alarm sounds muted'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>

      </div>
    </header>
  );
};
