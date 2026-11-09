export type ImpactLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type Currency = 
  | 'USD' 
  | 'EUR' 
  | 'GBP' 
  | 'JPY' 
  | 'CAD' 
  | 'AUD' 
  | 'CHF' 
  | 'NZD'
  | 'CNY'
  | (string & {});

export type FeedMode = 'live' | 'simulation';

export interface FeedTelemetry {
  mode: FeedMode;
  source: 'network' | 'cache' | 'fallback_mock';
  lastUpdated: number | null;
  isStale: boolean;
  error?: string | null;
  itemCount: number;
}

export type Category = 
  | 'Inflation' 
  | 'Central Bank' 
  | 'Employment' 
  | 'Growth' 
  | 'Consumer' 
  | 'Trade' 
  | 'Housing' 
  | 'Manufacturing';

export type PolarityDirection = 'higher' | 'lower' | 'neutral';

export interface HistoricalRelease {
  id: string;
  date: string;
  actual: number;
  forecast: number;
  previous: number;
  surpriseDelta: number;
  isBeat: boolean;
}

export interface AssetImpact {
  symbol: string;
  name: string;
  volatility: 'EXTREME' | 'HIGH' | 'MODERATE';
}

export interface MacroEvent {
  id: string;
  title: string;
  currency: Currency;
  country: string;
  countryCode: string;
  timestamp: number; // Unix timestamp in ms
  datetimeISO: string;
  impact: ImpactLevel;
  category: Category;
  agency: string;
  frequency: string;
  description: string;
  whyTradersCare: string;
  bullishScenario: string;
  bearishScenario: string;
  affectedAssets: AssetImpact[];
  actual: number | null;
  forecast: number | null;
  previous: number | null;
  revisedFrom?: number | null;
  unit: string;
  betterDirection: PolarityDirection;
  history: HistoricalRelease[];
  isSimulated?: boolean;
}

export type TimezoneMode = 'NY' | 'EAT';

export interface FilterState {
  dayTab: 'all' | 'yesterday' | 'today' | 'tomorrow' | string;
  currencies: Currency[];
  impacts: ImpactLevel[];
  searchQuery: string;
  selectedCategory: string | null;
}
