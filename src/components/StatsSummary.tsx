import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Activity,
  Flame,
  Globe2,
  Calendar
} from 'lucide-react';
import { MacroEvent } from '../types/calendar';

interface StatsSummaryProps {
  events: MacroEvent[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ events }) => {
  const totalEvents = events.length;
  const highImpactCount = events.filter(e => e.impact === 'HIGH').length;
  
  // Calculate released stats
  const releasedEvents = events.filter(e => e.actual !== null && e.forecast !== null);
  let beatCount = 0;
  let missCount = 0;
  let inLineCount = 0;

  releasedEvents.forEach(e => {
    if (e.actual === null || e.forecast === null) return;
    const delta = e.actual - e.forecast;
    if (Math.abs(delta) < 0.001) {
      inLineCount++;
    } else if (e.betterDirection === 'lower') {
      if (delta < 0) beatCount++;
      else missCount++;
    } else {
      if (delta > 0) beatCount++;
      else missCount++;
    }
  });

  const totalEvaluated = beatCount + missCount + inLineCount;
  const beatRatio = totalEvaluated > 0 ? Math.round((beatCount / totalEvaluated) * 100) : 50;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. High Impact Alert Count */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            High Impact Catalysts
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-rose-400">
              {highImpactCount}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              of {totalEvents} total
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-rose-950/50 border border-rose-800/50 flex items-center justify-center text-rose-400">
          <Flame className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Macro Surprise Beat Rate */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Consensus Beat Ratio
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-emerald-400">
              {beatRatio}%
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              ({beatCount} Beat / {missCount} Miss)
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-emerald-950/50 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Central Bank Decisions Active */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Central Bank Decisions
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-cyan-400">
              {events.filter(e => e.category === 'Central Bank').length}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              FOMC, ECB, BoE, SNB
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
          <Globe2 className="w-4 h-4" />
        </div>
      </div>

      {/* 4. Terminal Feed Surveillance Status */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            Surveillance Telemetry
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
              ONLINE • 12ms
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
          <Activity className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
