import { Currency, ImpactLevel, PolarityDirection } from '../types/calendar';

export interface SurpriseResult {
  delta: number;
  deltaFormatted: string;
  isBeat: boolean;
  isInLine: boolean;
  isMiss: boolean;
  polarityClass: string;
  badgeLabel: string;
  meterPercent: number; // 0 to 100 for bidirectional meter width
  direction: 'beat' | 'miss' | 'inline';
}

/**
 * Format numeric values with their unit
 */
export function formatValue(val: number | null | undefined, unit: string): string {
  if (val === null || val === undefined) return '--';
  
  // Format based on unit
  if (unit === '%') {
    return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
  }
  if (unit === 'K') {
    return `${val.toLocaleString()}K`;
  }
  if (unit === 'B') {
    return `$${val.toFixed(1)}B`;
  }
  if (unit === 'Index' || unit === 'pts') {
    return `${val.toFixed(1)}`;
  }
  return `${val}${unit ? ` ${unit}` : ''}`;
}

/**
 * Compute the surprise deviation and sentiment classification
 */
export function computeSurprise(
  actual: number | null,
  forecast: number | null,
  betterDirection: PolarityDirection,
  unit: string
): SurpriseResult | null {
  if (actual === null || forecast === null) return null;

  const delta = Math.round((actual - forecast) * 100) / 100;
  const absDelta = Math.abs(delta);
  
  const isInLine = absDelta < 0.001;
  let isBeat = false;
  let isMiss = false;

  if (!isInLine) {
    if (betterDirection === 'higher') {
      isBeat = delta > 0;
      isMiss = delta < 0;
    } else if (betterDirection === 'lower') {
      isBeat = delta < 0;
      isMiss = delta > 0;
    } else {
      // Neutral - positive delta is beat, negative is miss
      isBeat = delta > 0;
      isMiss = delta < 0;
    }
  }

  // Delta format string
  let sign = delta > 0 ? '+' : '';
  let deltaFormatted = `${sign}${delta}`;
  if (unit === '%') deltaFormatted = `${sign}${delta.toFixed(1)}%`;
  else if (unit === 'K') deltaFormatted = `${sign}${delta}K`;
  else if (unit === 'B') deltaFormatted = `${sign}$${delta.toFixed(1)}B`;

  // Scale meter between 0% and 100% relative to a reasonable max delta for each unit
  let maxScale = 1.0;
  if (unit === '%') maxScale = 0.6; // e.g., 0.6% deviation is maximum bar
  else if (unit === 'K') maxScale = 50; // 50K deviation
  else if (unit === 'B') maxScale = 10;
  else if (unit === 'Index') maxScale = 4;

  const meterPercent = Math.min(100, Math.max(10, Math.round((absDelta / maxScale) * 100)));

  const badgeLabel = isInLine 
    ? 'IN-LINE' 
    : isBeat 
      ? `${deltaFormatted} BEAT` 
      : `${deltaFormatted} MISS`;

  const polarityClass = isInLine
    ? 'text-zinc-400 bg-zinc-800/60 border-zinc-700/60'
    : isBeat
      ? 'text-emerald-400 bg-emerald-950/50 border-emerald-500/40'
      : 'text-rose-400 bg-rose-950/50 border-rose-500/40';

  return {
    delta,
    deltaFormatted,
    isBeat,
    isInLine,
    isMiss,
    polarityClass,
    badgeLabel,
    meterPercent,
    direction: isInLine ? 'inline' : isBeat ? 'beat' : 'miss',
  };
}

/**
 * Return country flag emoji & description for a currency
 */
export function getCurrencyMeta(curr: Currency): {
  code: Currency;
  name: string;
  flag: string;
  country: string;
  borderBadge: string;
} {
  switch (curr) {
    case 'USD':
      return { code: 'USD', name: 'US Dollar', flag: '🇺🇸', country: 'United States', borderBadge: 'border-blue-500/40 text-blue-400 bg-blue-950/30' };
    case 'EUR':
      return { code: 'EUR', name: 'Euro', flag: '🇪🇺', country: 'Eurozone', borderBadge: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/30' };
    case 'GBP':
      return { code: 'GBP', name: 'British Pound', flag: '🇬🇧', country: 'United Kingdom', borderBadge: 'border-sky-500/40 text-sky-400 bg-sky-950/30' };
    case 'JPY':
      return { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', country: 'Japan', borderBadge: 'border-red-500/40 text-red-400 bg-red-950/30' };
    case 'CAD':
      return { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', country: 'Canada', borderBadge: 'border-rose-500/40 text-rose-400 bg-rose-950/30' };
    case 'AUD':
      return { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', country: 'Australia', borderBadge: 'border-amber-500/40 text-amber-400 bg-amber-950/30' };
    case 'CHF':
      return { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', country: 'Switzerland', borderBadge: 'border-teal-500/40 text-teal-400 bg-teal-950/30' };
    case 'NZD':
      return { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', country: 'New Zealand', borderBadge: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/30' };
    case 'CNY':
      return { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', country: 'China', borderBadge: 'border-red-500/40 text-red-400 bg-red-950/30' };
    default:
      return { code: curr, name: curr, flag: '🌐', country: 'Global', borderBadge: 'border-zinc-500/40 text-zinc-400 bg-zinc-900/30' };
  }
}

/**
 * Return impact colors and badge styles
 */
export function getImpactMeta(impact: ImpactLevel): {
  label: string;
  dotColor: string;
  badgeClass: string;
  ringClass: string;
} {
  switch (impact) {
    case 'HIGH':
      return {
        label: 'HIGH',
        dotColor: 'bg-rose-500',
        badgeClass: 'text-rose-400 bg-rose-950/50 border-rose-600/50',
        ringClass: 'shadow-glow-red border-rose-500/60',
      };
    case 'MEDIUM':
      return {
        label: 'MED',
        dotColor: 'bg-amber-500',
        badgeClass: 'text-amber-400 bg-amber-950/40 border-amber-600/40',
        ringClass: 'shadow-glow-amber border-amber-500/60',
      };
    case 'LOW':
    default:
      return {
        label: 'LOW',
        dotColor: 'bg-zinc-400',
        badgeClass: 'text-zinc-400 bg-zinc-900/60 border-zinc-700/50',
        ringClass: 'border-zinc-600/40',
      };
  }
}

/**
 * Category styling tags
 */
export function getCategoryBadge(category: string): { label: string; class: string } {
  switch (category) {
    case 'Inflation':
      return { label: 'Inflation', class: 'bg-purple-950/40 text-purple-300 border-purple-700/40' };
    case 'Central Bank':
      return { label: 'Central Bank', class: 'bg-blue-950/40 text-blue-300 border-blue-700/40' };
    case 'Employment':
      return { label: 'Employment', class: 'bg-emerald-950/40 text-emerald-300 border-emerald-700/40' };
    case 'Growth':
      return { label: 'Growth / GDP', class: 'bg-cyan-950/40 text-cyan-300 border-cyan-700/40' };
    case 'Consumer':
      return { label: 'Consumer', class: 'bg-amber-950/40 text-amber-300 border-amber-700/40' };
    case 'Trade':
      return { label: 'Trade', class: 'bg-teal-950/40 text-teal-300 border-teal-700/40' };
    default:
      return { label: category, class: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/40' };
  }
}
