import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Radar, Flame, Eye } from 'lucide-react';
import { MacroEvent, TimezoneMode } from '../types/calendar';
import { getMinuteOfDay, formatEventTime, isSameDayInTimezone } from '../utils/timezone';
import { formatValue, getCurrencyMeta } from '../utils/formatters';

interface Timeline24HProps {
  events: MacroEvent[];
  timezoneMode: TimezoneMode;
  onSelectEvent: (event: MacroEvent) => void;
  selectedEventId: string | null;
}

export const Timeline24H: React.FC<Timeline24HProps> = ({
  events,
  timezoneMode,
  onSelectEvent,
  selectedEventId,
}) => {
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [hoveredEvent, setHoveredEvent] = useState<MacroEvent | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ xPercent: number }>({ xPercent: 50 });

  // Update current time every 10 seconds for the playhead
  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate current playhead percentage (0 - 100%) in active timezone
  const currentMinute = getMinuteOfDay(nowMs, timezoneMode);
  const nowPercent = (currentMinute / 1440) * 100;

  // Filter events that occur on the active "Today" in the chosen timezone
  const todaysEvents = events.filter(e => isSameDayInTimezone(e.timestamp, nowMs, timezoneMode));

  // Hour tick marks (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00, 24:00)
  const hourTicks = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-4 shadow-xl backdrop-blur-sm relative overflow-hidden">
      
      {/* Header bar of Timeline */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2.5 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            24-Hour Volatility Timeline Radar
          </h2>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
            {timezoneMode === 'NY' ? 'US Eastern (UTC-4)' : 'East Africa (UTC+3)'}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-glow-red inline-block"></span>
            <span className="text-zinc-400">High Impact</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-glow-amber inline-block"></span>
            <span className="text-zinc-400">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 inline-block"></span>
            <span className="text-zinc-400">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-cyan-300 font-mono font-medium">30m Pulse Proximity</span>
          </div>
        </div>
      </div>

      {/* Market Sessions Visual Indicators */}
      <div className="relative w-full h-4 mb-2 flex text-[9px] font-mono uppercase tracking-wider text-zinc-500 select-none">
        {/* Tokyo Session */}
        <div 
          className="absolute top-0 bottom-0 bg-blue-500/10 border-l border-r border-blue-500/20 rounded-sm flex items-center justify-center text-blue-400/80"
          style={{
            left: timezoneMode === 'NY' ? '79%' : '25%', // Tokyo approx
            width: timezoneMode === 'NY' ? '21%' : '29%'
          }}
        >
          <span>Tokyo Session</span>
        </div>

        {/* London Session */}
        <div 
          className="absolute top-0 bottom-0 bg-indigo-500/10 border-l border-r border-indigo-500/20 rounded-sm flex items-center justify-center text-indigo-400/80"
          style={{
            left: timezoneMode === 'NY' ? '12.5%' : '37.5%', // 03:00 NY or 09:00 EAT
            width: '35%'
          }}
        >
          <span>London Session</span>
        </div>

        {/* New York Session */}
        <div 
          className="absolute top-0 bottom-0 bg-amber-500/10 border-l border-r border-amber-500/20 rounded-sm flex items-center justify-center text-amber-400/80"
          style={{
            left: timezoneMode === 'NY' ? '33.3%' : '58.3%', // 08:00 NY or 14:00 EAT
            width: '35%'
          }}
        >
          <span>New York Session</span>
        </div>
      </div>

      {/* Main 24-Hour Track Container */}
      <div className="relative w-full h-24 bg-zinc-900/60 rounded-lg border border-zinc-800/80 p-2 overflow-visible select-none">
        
        {/* Horizontal Center Axis Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-zinc-800 pointer-events-none"></div>

        {/* Hour Grid Lines & Labels */}
        {hourTicks.map(hour => {
          const tickPercent = (hour / 24) * 100;
          const displayLabel = hour === 24 ? '23:59' : `${String(hour).padStart(2, '0')}:00`;
          
          return (
            <div
              key={hour}
              className="absolute top-0 bottom-0 pointer-events-none flex flex-col justify-between"
              style={{ left: `${Math.min(99.5, tickPercent)}%` }}
            >
              <span className="w-[1px] h-2 bg-zinc-700 mx-auto"></span>
              <span className="text-[10px] font-mono text-zinc-500 -translate-x-1/2 select-none">
                {displayLabel}
              </span>
              <span className="w-[1px] h-2 bg-zinc-700 mx-auto"></span>
            </div>
          );
        })}

        {/* Live Playhead Marker ("NOW") */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-1000"
          style={{ left: `${nowPercent}%` }}
        >
          <div className="relative h-full flex flex-col items-center">
            {/* Playhead Badge */}
            <div className="bg-cyan-500 text-zinc-950 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded shadow-glow-cyan -translate-y-2 whitespace-nowrap">
              NOW
            </div>
            {/* Vertical Laser Line */}
            <div className="w-[2px] h-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></div>
          </div>
        </div>

        {/* Plot Event Nodes */}
        {todaysEvents.map(event => {
          const eventMin = getMinuteOfDay(event.timestamp, timezoneMode);
          const xPercent = (eventMin / 1440) * 100;
          const isSelected = selectedEventId === event.id;

          // Proximity calculation: is event within 30 minutes?
          const diffMs = event.timestamp - nowMs;
          const isWithin30Mins = diffMs > -5 * 60 * 1000 && diffMs <= 30 * 60 * 1000;

          // Color & Glow setup
          let nodeColor = 'bg-zinc-400';
          let ringColor = 'border-zinc-400/50';
          let glowShadow = '';

          if (event.impact === 'HIGH') {
            nodeColor = 'bg-rose-500';
            ringColor = 'border-rose-500/70';
            glowShadow = 'shadow-glow-red';
          } else if (event.impact === 'MEDIUM') {
            nodeColor = 'bg-amber-500';
            ringColor = 'border-amber-500/70';
            glowShadow = 'shadow-glow-amber';
          }

          return (
            <div
              key={event.id}
              className="absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer"
              style={{ left: `${xPercent}%` }}
              onMouseEnter={() => {
                setHoveredEvent(event);
                setTooltipPos({ xPercent });
              }}
              onMouseLeave={() => setHoveredEvent(null)}
              onClick={() => onSelectEvent(event)}
            >
              <div className="relative flex items-center justify-center -translate-x-1/2">
                
                {/* 30-Minute Radar Proximity Continuous Pulse Ring */}
                {isWithin30Mins && (
                  <motion.div
                    className={`absolute rounded-full border-2 ${
                      event.impact === 'HIGH' ? 'border-rose-500' : 'border-amber-400'
                    }`}
                    initial={{ width: 14, height: 14, opacity: 0.9 }}
                    animate={{ width: 36, height: 36, opacity: 0 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: 'easeOut',
                    }}
                  />
                )}

                {/* Event Core Node */}
                <motion.div
                  whileHover={{ scale: 1.4 }}
                  className={`w-3.5 h-3.5 rounded-full ${nodeColor} ${glowShadow} border-2 ${
                    isSelected ? 'border-white scale-125' : 'border-zinc-950'
                  } transition-transform shadow-md flex items-center justify-center`}
                >
                  {event.impact === 'HIGH' && (
                    <span className="w-1 h-1 rounded-full bg-white opacity-80"></span>
                  )}
                </motion.div>

                {/* Currency tag underneath node */}
                <span className="absolute top-4 font-mono text-[9px] font-bold text-zinc-400 select-none pointer-events-none">
                  {event.currency}
                </span>
              </div>
            </div>
          );
        })}

        {/* Hover Mini-Tooltip */}
        <AnimatePresence>
          {hoveredEvent && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-16 z-30 pointer-events-none -translate-x-1/2 bg-zinc-900 border border-zinc-700/80 rounded-lg p-2.5 shadow-2xl min-w-[210px] text-xs backdrop-blur-md"
              style={{ 
                left: `${Math.max(12, Math.min(88, tooltipPos.xPercent))}%` 
              }}
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-zinc-800">
                <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatEventTime(hoveredEvent.timestamp, timezoneMode)}
                </span>
                <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                  hoveredEvent.impact === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  hoveredEvent.impact === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-zinc-800 text-zinc-300'
                }`}>
                  {hoveredEvent.impact}
                </span>
              </div>

              <div className="mt-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{getCurrencyMeta(hoveredEvent.currency).flag}</span>
                  <span>{hoveredEvent.currency} {hoveredEvent.title}</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between font-mono">
                  <span>Forecast: {formatValue(hoveredEvent.forecast, hoveredEvent.unit)}</span>
                  <span>Prior: {formatValue(hoveredEvent.previous, hoveredEvent.unit)}</span>
                </div>
              </div>

              <div className="mt-1.5 pt-1 border-t border-zinc-800/80 text-[10px] text-cyan-300/80 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Click node to inspect intelligence drawer</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
