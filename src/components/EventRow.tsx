import React from 'react';
import { 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { MacroEvent, TimezoneMode } from '../types/calendar';
import { formatEventTime, getRelativeTimeBadge } from '../utils/timezone';
import { 
  formatValue, 
  computeSurprise, 
  getCurrencyMeta, 
  getImpactMeta, 
  getCategoryBadge 
} from '../utils/formatters';

interface EventRowProps {
  event: MacroEvent;
  timezoneMode: TimezoneMode;
  isSelected: boolean;
  onSelect: (event: MacroEvent) => void;
}

export const EventRow: React.FC<EventRowProps> = ({
  event,
  timezoneMode,
  isSelected,
  onSelect,
}) => {
  const currencyMeta = getCurrencyMeta(event.currency);
  const impactMeta = getImpactMeta(event.impact);
  const categoryBadge = getCategoryBadge(event.category);
  const formattedTime = formatEventTime(event.timestamp, timezoneMode);
  const relBadge = getRelativeTimeBadge(event.timestamp);

  // Compute surprise / deviation
  const surprise = computeSurprise(
    event.actual,
    event.forecast,
    event.betterDirection,
    event.unit
  );

  const isReleased = event.actual !== null;

  return (
    <tr
      onClick={() => onSelect(event)}
      className={`group cursor-pointer border-b border-zinc-800/60 transition-colors select-none ${
        isSelected
          ? 'bg-zinc-800/80 border-cyan-500/50'
          : 'hover:bg-zinc-900/70 bg-zinc-950/40'
      } ${
        relBadge.isImminent ? 'bg-red-950/15' : ''
      }`}
    >
      {/* 1. Release Time & Relative Countdown Badge */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>{formattedTime}</span>
          </div>
          <div className="mt-0.5">
            <span
              className={`inline-block font-mono text-[10px] px-1.5 py-0.5 rounded font-medium ${
                relBadge.isImminent
                  ? 'bg-red-900/60 text-red-200 border border-red-500/50 animate-pulse font-bold'
                  : relBadge.isUpcoming
                    ? 'bg-zinc-900 text-cyan-300 border border-zinc-800'
                    : 'bg-zinc-900/80 text-zinc-500'
              }`}
            >
              {relBadge.text}
            </span>
          </div>
        </div>
      </td>

      {/* 2. Currency Badge + Country Flag */}
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="text-base select-none">{currencyMeta.flag}</span>
          <span className="font-mono text-xs font-bold text-zinc-100 tracking-wider">
            {event.currency}
          </span>
        </div>
      </td>

      {/* 3. Impact Badge (HIGH / MED / LOW with glowing status ring) */}
      <td className="py-3 px-3 whitespace-nowrap">
        <div className="flex items-center">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider border ${impactMeta.badgeClass} ${
              event.impact === 'HIGH' ? 'shadow-glow-red' : ''
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${impactMeta.dotColor} ${event.impact === 'HIGH' ? 'animate-ping' : ''}`}></span>
            <span>{impactMeta.label}</span>
          </span>
        </div>
      </td>

      {/* 4. Event Name & Category Tag */}
      <td className="py-3 px-3.5 max-w-[280px] md:max-w-none">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-100 group-hover:text-cyan-200 transition-colors">
              {event.title}
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${categoryBadge.class}`}>
              {categoryBadge.label}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 truncate max-w-sm">
            {event.agency}
          </span>
        </div>
      </td>

      {/* 5. Monospace Columns: Actual, Forecast, Previous */}
      <td className="py-3 px-3 text-right font-mono text-xs whitespace-nowrap">
        {isReleased ? (
          <span
            className={`font-bold tabular-nums px-2 py-0.5 rounded ${
              surprise?.isBeat
                ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/40'
                : surprise?.isMiss
                  ? 'text-rose-300 bg-rose-950/60 border border-rose-500/40'
                  : 'text-zinc-200 bg-zinc-900 border border-zinc-700'
            }`}
          >
            {formatValue(event.actual, event.unit)}
          </span>
        ) : (
          <span className="text-zinc-500 italic tabular-nums font-sans text-xs">
            Pending
          </span>
        )}
      </td>

      <td className="py-3 px-3 text-right font-mono text-xs text-zinc-300 whitespace-nowrap tabular-nums">
        {formatValue(event.forecast, event.unit)}
      </td>

      <td className="py-3 px-3 text-right font-mono text-xs text-zinc-400 whitespace-nowrap tabular-nums">
        {formatValue(event.previous, event.unit)}
      </td>

      {/* 6. Visual Surprise / Deviation Meter Bar */}
      <td className="py-3 px-4 min-w-[190px] whitespace-nowrap">
        {isReleased && surprise ? (
          <div className="flex items-center gap-2.5">
            {/* Bidirectional Deviation Meter */}
            <div className="relative flex-1 h-3.5 bg-zinc-900 rounded border border-zinc-800 overflow-hidden flex items-center">
              {/* Center 0 line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-zinc-700 z-10"></div>
              
              {/* Beat fill (extends to the right of center) */}
              {surprise.isBeat && (
                <div
                  className="absolute left-1/2 top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-glow-green"
                  style={{ width: `${(surprise.meterPercent / 100) * 50}%` }}
                ></div>
              )}

              {/* Miss fill (extends to the left of center) */}
              {surprise.isMiss && (
                <div
                  className="absolute right-1/2 top-0 bottom-0 bg-gradient-to-l from-rose-600 to-rose-400 shadow-glow-red"
                  style={{ width: `${(surprise.meterPercent / 100) * 50}%` }}
                ></div>
              )}
            </div>

            {/* Surprise Badge Tag */}
            <div className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap flex items-center gap-1 ${surprise.polarityClass}`}>
              {surprise.isBeat && <TrendingUp className="w-3 h-3 text-emerald-400" />}
              {surprise.isMiss && <TrendingDown className="w-3 h-3 text-rose-400" />}
              {surprise.isInLine && <Minus className="w-3 h-3 text-zinc-400" />}
              <span>{surprise.badgeLabel}</span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] font-mono text-zinc-600 flex items-center gap-1">
            <span>Awaiting Release</span>
          </div>
        )}
      </td>

      {/* 7. Action / Open Drawer Trigger */}
      <td className="py-3 px-3 text-right whitespace-nowrap">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(event);
          }}
          className="p-1 rounded text-zinc-500 hover:text-cyan-300 hover:bg-zinc-800 transition-colors"
          title="Inspect Macro Intelligence Drawer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
