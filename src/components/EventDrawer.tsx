import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Building2, 
  Calendar, 
  Zap, 
  ShieldAlert, 
  BarChart2, 
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  CheckCircle2,
  Edit3,
  RotateCcw
} from 'lucide-react';
import { MacroEvent, TimezoneMode } from '../types/calendar';
import { formatEventDate, formatEventTime, getRelativeTimeBadge } from '../utils/timezone';
import { 
  formatValue, 
  computeSurprise, 
  getCurrencyMeta, 
  getImpactMeta, 
  getCategoryBadge 
} from '../utils/formatters';

interface EventDrawerProps {
  event: MacroEvent | null;
  onClose: () => void;
  timezoneMode: TimezoneMode;
  onUpdateActual?: (eventId: string, newActual: number | null) => void;
}

export const EventDrawer: React.FC<EventDrawerProps> = ({
  event,
  onClose,
  timezoneMode,
  onUpdateActual,
}) => {
  const [overrideInput, setOverrideInput] = React.useState<string>('');

  // Synchronize input when event changes
  React.useEffect(() => {
    if (event?.actual !== null && event?.actual !== undefined) {
      setOverrideInput(String(event.actual));
    } else {
      setOverrideInput('');
    }
  }, [event?.id, event?.actual]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const currencyMeta = getCurrencyMeta(event.currency);
  const impactMeta = getImpactMeta(event.impact);
  const categoryBadge = getCategoryBadge(event.category);
  const formattedTime = formatEventTime(event.timestamp, timezoneMode);
  const formattedDate = formatEventDate(event.timestamp, timezoneMode);
  const relBadge = getRelativeTimeBadge(event.timestamp);

  const isReleased = event.actual !== null;
  const surprise = computeSurprise(
    event.actual,
    event.forecast,
    event.betterDirection,
    event.unit
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Panel */}
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="relative w-full max-w-2xl bg-zinc-950 border-l border-zinc-800/90 h-full shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="p-4 bg-zinc-900/80 border-b border-zinc-800/80 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-xl select-none">{currencyMeta.flag}</span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                  {event.currency}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-xs font-bold border ${impactMeta.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${impactMeta.dotColor}`}></span>
                  <span>{impactMeta.label} IMPACT</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${categoryBadge.class}`}>
                  {categoryBadge.label}
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                {event.title}
              </h2>
              
              <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  {formattedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <Clock className="w-3.5 h-3.5" />
                  {formattedTime} ({timezoneMode})
                </span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">{relBadge.text}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors border border-zinc-700"
              title="Close Drawer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
            
            {/* 1. Real-Time Status / Deviation Snapshot */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
                <span>Release Figures & Surprise Metric</span>
                {isReleased ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> RELEASE COMPLETE
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> SCHEDULED RELEASE
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80">
                  <div className="text-[11px] font-mono text-zinc-500 uppercase">Actual</div>
                  <div className={`text-base md:text-lg font-bold font-mono mt-1 ${
                    isReleased
                      ? surprise?.isBeat
                        ? 'text-emerald-400'
                        : surprise?.isMiss
                          ? 'text-rose-400'
                          : 'text-zinc-100'
                      : 'text-zinc-500 italic font-sans text-sm'
                  }`}>
                    {formatValue(event.actual, event.unit)}
                  </div>
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80">
                  <div className="text-[11px] font-mono text-zinc-500 uppercase">Forecast</div>
                  <div className="text-base md:text-lg font-bold font-mono mt-1 text-zinc-200">
                    {formatValue(event.forecast, event.unit)}
                  </div>
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800/80">
                  <div className="text-[11px] font-mono text-zinc-500 uppercase">Previous</div>
                  <div className="text-base md:text-lg font-bold font-mono mt-1 text-zinc-400">
                    {formatValue(event.previous, event.unit)}
                  </div>
                </div>
              </div>

              {/* Surprise Deviation Meter */}
              {isReleased && surprise && (
                <div className="mt-4 pt-3.5 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-400 font-mono">Surprise Delta:</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded border text-xs ${surprise.polarityClass}`}>
                      {surprise.badgeLabel}
                    </span>
                  </div>

                  <div className="relative h-4 bg-zinc-950 rounded border border-zinc-800 overflow-hidden flex items-center">
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-zinc-600 z-10"></div>
                    {surprise.isBeat && (
                      <div
                        className="absolute left-1/2 top-0 bottom-0 bg-emerald-500 shadow-glow-green"
                        style={{ width: `${(surprise.meterPercent / 100) * 50}%` }}
                      ></div>
                    )}
                    {surprise.isMiss && (
                      <div
                        className="absolute right-1/2 top-0 bottom-0 bg-rose-500 shadow-glow-red"
                        style={{ width: `${(surprise.meterPercent / 100) * 50}%` }}
                      ></div>
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                    <span>Miss (- Bearish)</span>
                    <span>Consensus</span>
                    <span>Beat (+ Bullish)</span>
                  </div>
                </div>
              )}

              {/* Custom Actual Override / Simulation Form */}
              {onUpdateActual && (
                <div className="mt-3.5 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Actual Override / Sim:</span>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const num = parseFloat(overrideInput);
                      if (!isNaN(num)) {
                        onUpdateActual(event.id, num);
                      }
                    }} 
                    className="flex items-center gap-2"
                  >
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        placeholder={event.forecast !== null ? String(event.forecast) : "0.0"}
                        value={overrideInput}
                        onChange={(e) => setOverrideInput(e.target.value)}
                        className="w-24 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                      />
                      {event.unit && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-500 pointer-events-none">
                          {event.unit}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-semibold transition-colors shadow-sm"
                      title="Apply custom actual override to event"
                    >
                      Apply
                    </button>

                    {event.actual !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setOverrideInput('');
                          onUpdateActual(event.id, null);
                        }}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title="Reset override"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>

            {/* 2. Volatility Playbook & Scenario Thresholds */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Institutional Volatility Playbook</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Bullish Scenario */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Hawkish / Beat Scenario</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {event.bullishScenario}
                  </p>
                </div>

                {/* Bearish Scenario */}
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Dovish / Miss Scenario</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {event.bearishScenario}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. "Why Traders Care" & Indicator Explanation */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  Why Global Desks & Algorithmic Traders Care
                </h3>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-800/80 font-sans">
                  {event.whyTradersCare}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-zinc-500" />
                  Indicator Methodology & Issuing Agency
                </h3>
                <div className="bg-zinc-900/40 p-3.5 rounded-lg border border-zinc-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Issuing Agency:</span>
                    <span className="font-semibold text-zinc-200">{event.agency}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-400">Reporting Frequency:</span>
                    <span className="font-semibold text-zinc-200">{event.frequency}</span>
                  </div>
                  <div className="pt-1 text-zinc-400 leading-relaxed">
                    {event.description}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Asset Class Impact Matrix */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Affected Asset Classes & Expected Volatility
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {event.affectedAssets.map((asset, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono text-xs font-bold text-white">{asset.symbol}</div>
                      <div className="text-[10px] text-zinc-400 truncate max-w-[110px]">{asset.name}</div>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        asset.volatility === 'EXTREME'
                          ? 'bg-rose-950 text-rose-300 border-rose-700/60 shadow-glow-red'
                          : asset.volatility === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border-amber-700/60'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {asset.volatility}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Historical Releases Series (Last 6 prints) */}
            {event.history && event.history.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2.5 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  Historical Release Series (Prior 6 Releases)
                </h3>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase border-b border-zinc-800">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3 text-right">Actual</th>
                        <th className="py-2 px-3 text-right">Forecast</th>
                        <th className="py-2 px-3 text-right">Previous</th>
                        <th className="py-2 px-3 text-right">Surprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {event.history.map(item => (
                        <tr key={item.id} className="hover:bg-zinc-900/80">
                          <td className="py-2 px-3 text-zinc-300">{item.date}</td>
                          <td className={`py-2 px-3 text-right font-bold ${
                            item.isBeat ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {formatValue(item.actual, event.unit)}
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-400">
                            {formatValue(item.forecast, event.unit)}
                          </td>
                          <td className="py-2 px-3 text-right text-zinc-500">
                            {formatValue(item.previous, event.unit)}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.isBeat
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-600/40'
                                : 'bg-rose-950/60 text-rose-300 border border-rose-600/40'
                            }`}>
                              {item.surpriseDelta > 0 ? `+${item.surpriseDelta}` : item.surpriseDelta}
                              {event.unit === '%' ? '%' : ''}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span className="font-mono text-[11px]">MacroRadar Surveillance Terminal</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold transition-colors border border-zinc-700"
            >
              Close Drawer
            </button>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};
