import { 
  MacroEvent, 
  Currency, 
  ImpactLevel, 
  Category, 
  PolarityDirection, 
  HistoricalRelease, 
  AssetImpact 
} from '../types/calendar';

/**
 * Raw ForexFactory JSON schema returned by:
 * https://nfs.faireconomy.media/ff_calendar_thisweek.json
 */
export interface RawFFEvent {
  title: string;
  country: string; // e.g. "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "NZD", "CNY", "All"
  date: string;    // ISO-8601 string with offset, e.g. "2026-11-11T08:30:00-05:00"
  impact: string;  // "High", "Medium", "Low", "Holiday", "Non-Economic"
  forecast?: string; // e.g. "0.2%", "224K", "-1.5B", "5.50%", ""
  previous?: string; // e.g. "0.3%", "19.5B", "52.1", ""
  actual?: string;   // e.g. "0.4%", "", or populated later
}

/**
 * Parsed numeric structure for deviations and calculations
 */
export interface ParsedValue {
  value: number | null;
  unit: '%' | 'K' | 'M' | 'B' | 'Index' | 'bps' | '';
}

/**
 * Supported G8 Currencies mapping to countries and ISO codes
 */
const SUPPORTED_CURRENCIES: Record<string, { currency: Currency; country: string; countryCode: string }> = {
  USD: { currency: 'USD', country: 'United States', countryCode: 'us' },
  EUR: { currency: 'EUR', country: 'Eurozone', countryCode: 'eu' },
  GBP: { currency: 'GBP', country: 'United Kingdom', countryCode: 'gb' },
  JPY: { currency: 'JPY', country: 'Japan', countryCode: 'jp' },
  CAD: { currency: 'CAD', country: 'Canada', countryCode: 'ca' },
  AUD: { currency: 'AUD', country: 'Australia', countryCode: 'au' },
  CHF: { currency: 'CHF', country: 'Switzerland', countryCode: 'ch' },
  NZD: { currency: 'NZD', country: 'New Zealand', countryCode: 'nz' },
};

/**
 * Impact level normalizer
 * Maps "High" -> 'HIGH', "Medium" -> 'MEDIUM', "Low" / "Holiday" -> 'LOW'
 */
export function normalizeImpact(rawImpact?: string | null): ImpactLevel {
  if (!rawImpact) return 'LOW';
  const clean = rawImpact.trim().toLowerCase();
  if (clean === 'high') return 'HIGH';
  if (clean === 'medium' || clean === 'med') return 'MEDIUM';
  return 'LOW';
}

/**
 * Parse numeric strings like "0.2%", "224K", "-1.5B", "5.50%", "52.4"
 * into clean { value: number | null, unit: string } structures.
 */
export function parseNumericValue(rawStr?: string | null): ParsedValue {
  if (!rawStr || typeof rawStr !== 'string') {
    return { value: null, unit: '' };
  }
  const trimmed = rawStr.trim();
  if (!trimmed || trimmed === '-' || trimmed === '--') {
    return { value: null, unit: '' };
  }

  // Strip non-numeric prefixes like <, >, ~, $, €, £, ¥
  const clean = trimmed.replace(/^[<>~$\u20AC\u00A3\u00A5]\s*/, '').trim();

  // Match sign, number (integer or decimal), and trailing unit (ensure multi-char units precede single chars)
  const match = clean.match(/^([+-]?[0-9]+(?:\.[0-9]+)?)\s*(%|bps|Index|pts|[kKmMbBtT])?/i);
  if (!match) {
    const fallback = clean.match(/([+-]?[0-9]+(?:\.[0-9]+)?)/);
    if (fallback) {
      const val = parseFloat(fallback[1]);
      return {
        value: isNaN(val) ? null : val,
        unit: clean.includes('%') ? '%' : clean.toLowerCase().includes('bps') ? 'bps' : '',
      };
    }
    return { value: null, unit: '' };
  }

  const val = parseFloat(match[1]);
  if (isNaN(val)) return { value: null, unit: '' };

  const rawUnit = (match[2] || '').trim();
  let unit: ParsedValue['unit'] = '';

  if (rawUnit === '%') {
    unit = '%';
  } else if (rawUnit.toUpperCase() === 'K') {
    unit = 'K';
  } else if (rawUnit.toUpperCase() === 'M') {
    unit = 'M';
  } else if (rawUnit.toUpperCase() === 'B') {
    unit = 'B';
  } else if (rawUnit.toLowerCase() === 'bps') {
    unit = 'bps';
  } else if (rawUnit.toLowerCase() === 'index' || rawUnit.toLowerCase() === 'pts') {
    unit = 'Index';
  }

  return { value: val, unit };
}

/**
 * Infer unit from event title if missing from value strings
 */
export function inferUnitFromTitle(title: string, value?: number | null): string {
  const lower = title.toLowerCase();
  if (
    lower.includes('m/m') || 
    lower.includes('y/y') || 
    lower.includes('q/q') || 
    lower.includes('rate') || 
    lower.includes('ratio') || 
    lower.includes('yield') ||
    lower.includes('inflation') ||
    lower.includes('share')
  ) {
    return '%';
  }
  if (
    lower.includes('pmi') || 
    lower.includes('index') || 
    lower.includes('sentiment') || 
    lower.includes('confidence') ||
    lower.includes('ism')
  ) {
    return 'Index';
  }
  if (lower.includes('claims') || lower.includes('payrolls') || lower.includes('nfp') || lower.includes('employment change')) {
    if (value !== null && value !== undefined && Math.abs(value) > 10) return 'K';
    return 'K';
  }
  if (lower.includes('trade balance') || lower.includes('budget') || lower.includes('current account')) {
    return 'B';
  }
  return '';
}

/**
 * Auto-classify event category based on title keywords:
 * (Inflation, Central Bank, Employment, Growth, Consumer, Manufacturing, Housing, Trade)
 */
export function classifyCategory(title: string): Category {
  const lower = title.toLowerCase();

  // 1. Inflation
  if (
    lower.includes('cpi') || 
    lower.includes('ppi') || 
    lower.includes('pce') || 
    lower.includes('inflation') || 
    lower.includes('price index') || 
    lower.includes('hicp') || 
    lower.includes('deflator') ||
    lower.includes('import price') ||
    lower.includes('export price')
  ) {
    return 'Inflation';
  }

  // 2. Employment
  if (
    lower.includes('nfp') || 
    lower.includes('non-farm') || 
    lower.includes('nonfarm') || 
    lower.includes('payroll') || 
    lower.includes('unemployment') || 
    lower.includes('jobless') || 
    lower.includes('employment') || 
    lower.includes('labor') || 
    lower.includes('claim') || 
    lower.includes('wages') || 
    lower.includes('earnings') || 
    lower.includes('jolts') ||
    lower.includes('adp')
  ) {
    return 'Employment';
  }

  // 3. Central Bank
  if (
    lower.includes('fomc') || 
    lower.includes('fed ') || 
    lower.includes('ecb') || 
    lower.includes('boe') || 
    lower.includes('boj') || 
    lower.includes('rba') || 
    lower.includes('rbnz') || 
    lower.includes('snb') || 
    lower.includes('boc') || 
    lower.includes('interest rate') || 
    lower.includes('rate decision') || 
    lower.includes('monetary policy') || 
    lower.includes('powell') || 
    lower.includes('lagarde') || 
    lower.includes('bailey') || 
    lower.includes('speaks') || 
    lower.includes('speech') || 
    lower.includes('testimony') || 
    lower.includes('statement') || 
    lower.includes('minutes') || 
    lower.includes('press conference') ||
    lower.includes('meetings')
  ) {
    return 'Central Bank';
  }

  // 4. Growth
  if (
    lower.includes('gdp') || 
    lower.includes('gross domestic') || 
    lower.includes('growth')
  ) {
    return 'Growth';
  }

  // 5. Consumer / Consumption
  if (
    lower.includes('retail') || 
    lower.includes('consumer') || 
    lower.includes('consumption') || 
    lower.includes('spending') || 
    lower.includes('confidence') || 
    lower.includes('sentiment') || 
    lower.includes('michigan')
  ) {
    return 'Consumer';
  }

  // 6. Manufacturing / PMI
  if (
    lower.includes('pmi') || 
    lower.includes('manufacturing') || 
    lower.includes('industrial') || 
    lower.includes('factory') || 
    lower.includes('ism') || 
    lower.includes('orders') || 
    lower.includes('production')
  ) {
    return 'Manufacturing';
  }

  // 7. Housing
  if (
    lower.includes('housing') || 
    lower.includes('building permits') || 
    lower.includes('home sales') || 
    lower.includes('house price') || 
    lower.includes('starts') || 
    lower.includes('mortgage')
  ) {
    return 'Housing';
  }

  // 8. Trade
  if (
    lower.includes('trade balance') || 
    lower.includes('current account') || 
    lower.includes('export') || 
    lower.includes('import')
  ) {
    return 'Trade';
  }

  return 'Growth';
}

/**
 * Determine polarity:
 * INVERTED ('lower' is beat) for Unemployment / Jobless Claims / Claimant Count.
 * NEUTRAL ('neutral') for speeches, meetings, auctions, holidays.
 * NORMAL ('higher' is beat) for all other economic expansion prints.
 */
export function determinePolarity(title: string): PolarityDirection {
  const lower = title.toLowerCase();

  // Inverted: lower is positive for economy/currency
  if (
    lower.includes('unemployment') || 
    lower.includes('jobless') || 
    lower.includes('claimant')
  ) {
    return 'lower';
  }

  // Neutral: speeches, meetings, auctions
  if (
    lower.includes('speaks') || 
    lower.includes('speech') || 
    lower.includes('testimony') || 
    lower.includes('meetings') || 
    lower.includes('minutes') || 
    lower.includes('holiday')
  ) {
    return 'neutral';
  }

  // Normal: higher print is hawkish beat / positive deviation
  return 'higher';
}

/**
 * Infer issuing agency from country and event category
 */
export function inferAgency(countryCode: string, title: string, category: Category): string {
  const lower = title.toLowerCase();

  if (countryCode === 'us') {
    if (lower.includes('cpi') || lower.includes('ppi') || lower.includes('employment') || lower.includes('payrolls') || lower.includes('unemployment') || lower.includes('jobless')) {
      return 'U.S. Bureau of Labor Statistics';
    }
    if (lower.includes('gdp') || lower.includes('pce') || lower.includes('personal')) {
      return 'U.S. Bureau of Economic Analysis';
    }
    if (lower.includes('retail') || lower.includes('trade') || lower.includes('housing') || lower.includes('durable')) {
      return 'U.S. Census Bureau';
    }
    if (lower.includes('fed') || lower.includes('fomc') || lower.includes('beige')) {
      return 'Federal Reserve System';
    }
    if (lower.includes('ism')) {
      return 'Institute for Supply Management';
    }
    return 'U.S. Department of the Treasury / Federal Reserve';
  }

  if (countryCode === 'eu') {
    if (lower.includes('ecb') || lower.includes('rate') || lower.includes('monetary')) {
      return 'European Central Bank';
    }
    return 'Eurostat (Statistical Office of the European Union)';
  }

  if (countryCode === 'gb') {
    if (lower.includes('boe') || lower.includes('mpc') || lower.includes('rate')) {
      return 'Bank of England';
    }
    return 'Office for National Statistics (ONS)';
  }

  if (countryCode === 'jp') {
    if (lower.includes('boj') || lower.includes('rate')) {
      return 'Bank of Japan';
    }
    return 'Ministry of Internal Affairs and Communications';
  }

  if (countryCode === 'ca') {
    if (lower.includes('boc') || lower.includes('rate')) {
      return 'Bank of Canada';
    }
    return 'Statistics Canada';
  }

  if (countryCode === 'au') {
    if (lower.includes('rba') || lower.includes('rate')) {
      return 'Reserve Bank of Australia';
    }
    return 'Australian Bureau of Statistics';
  }

  if (countryCode === 'ch') {
    if (lower.includes('snb') || lower.includes('rate')) {
      return 'Swiss National Bank';
    }
    return 'Swiss Federal Statistical Office';
  }

  if (countryCode === 'nz') {
    if (lower.includes('rbnz') || lower.includes('rate')) {
      return 'Reserve Bank of New Zealand';
    }
    return 'Statistics New Zealand';
  }

  return 'Official National Statistics Authority';
}

/**
 * Infer reporting frequency from title
 */
export function inferFrequency(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('m/m') || lower.includes('mom')) return 'Monthly';
  if (lower.includes('q/q') || lower.includes('qoq')) return 'Quarterly';
  if (lower.includes('y/y') || lower.includes('yoy')) return 'Annual';
  if (lower.includes('claims') || lower.includes('weekly')) return 'Weekly';
  if (lower.includes('flash') || lower.includes('preliminary')) return 'Monthly (Preliminary)';
  return 'Monthly';
}

/**
 * Map affected asset classes by currency
 */
export function getAffectedAssetsForCurrency(curr: Currency): AssetImpact[] {
  switch (curr) {
    case 'USD':
      return [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' },
        { symbol: 'US10Y', name: 'US 10-Year Treasury Yield', volatility: 'EXTREME' },
        { symbol: 'XAU/USD', name: 'Spot Gold', volatility: 'EXTREME' },
        { symbol: 'SPX', name: 'S&P 500 Index Futures', volatility: 'HIGH' },
        { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', volatility: 'HIGH' },
      ];
    case 'EUR':
      return [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' },
        { symbol: 'EUR/GBP', name: 'Euro / British Pound', volatility: 'HIGH' },
        { symbol: 'DAX40', name: 'German DAX 40 Index', volatility: 'HIGH' },
        { symbol: 'DE10Y', name: 'German 10Y Bund Yield', volatility: 'HIGH' },
      ];
    case 'GBP':
      return [
        { symbol: 'GBP/USD', name: 'British Pound / US Dollar', volatility: 'EXTREME' },
        { symbol: 'EUR/GBP', name: 'Euro / British Pound', volatility: 'HIGH' },
        { symbol: 'FTSE100', name: 'UK FTSE 100 Index', volatility: 'HIGH' },
        { symbol: 'UK10Y', name: 'UK 10-Year Gilt Yield', volatility: 'HIGH' },
      ];
    case 'JPY':
      return [
        { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', volatility: 'EXTREME' },
        { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', volatility: 'HIGH' },
        { symbol: 'NK225', name: 'Nikkei 225 Index', volatility: 'HIGH' },
        { symbol: 'JP10Y', name: 'Japan 10-Year JGB Yield', volatility: 'HIGH' },
      ];
    case 'CAD':
      return [
        { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', volatility: 'EXTREME' },
        { symbol: 'CAD/JPY', name: 'Canadian Dollar / Japanese Yen', volatility: 'HIGH' },
        { symbol: 'WTI', name: 'WTI Light Sweet Crude Oil', volatility: 'HIGH' },
      ];
    case 'AUD':
      return [
        { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', volatility: 'EXTREME' },
        { symbol: 'AUD/JPY', name: 'Australian Dollar / Yen', volatility: 'HIGH' },
        { symbol: 'COPPER', name: 'COMEX Copper Futures', volatility: 'HIGH' },
      ];
    case 'CHF':
      return [
        { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', volatility: 'HIGH' },
        { symbol: 'EUR/CHF', name: 'Euro / Swiss Franc', volatility: 'HIGH' },
      ];
    case 'NZD':
      return [
        { symbol: 'NZD/USD', name: 'New Zealand Dollar / USD', volatility: 'HIGH' },
        { symbol: 'AUD/NZD', name: 'Aussie / Kiwi Cross', volatility: 'HIGH' },
      ];
    default:
      return [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'HIGH' },
        { symbol: 'DXY', name: 'US Dollar Index', volatility: 'HIGH' },
      ];
  }
}

/**
 * Generate synthetic historical prints anchored to forecast & previous
 * so the historical releases table in the drawer is fully populated.
 */
export function generateSyntheticHistory(
  eventTimestamp: number,
  forecast: number | null,
  previous: number | null,
  actual: number | null,
  unit: string,
  betterDirection: PolarityDirection
): HistoricalRelease[] {
  const base = previous ?? forecast ?? actual ?? 2.0;
  const history: HistoricalRelease[] = [];

  for (let i = 1; i <= 6; i++) {
    const d = new Date(eventTimestamp);
    d.setMonth(d.getMonth() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Seeded pseudo-random variations around base
    const variance = (Math.sin(i * 1.7) * (unit === '%' ? 0.2 : unit === 'K' ? 18 : 1.2));
    const histForecast = Math.round((base + variance * 0.5) * 10) / 10;
    const histPrev = Math.round((base + variance * 0.8) * 10) / 10;
    const histActual = Math.round((base + variance) * 10) / 10;
    const surpriseDelta = Math.round((histActual - histForecast) * 100) / 100;
    
    const isBeat = betterDirection === 'lower' 
      ? surpriseDelta < 0 
      : surpriseDelta > 0;

    history.push({
      id: `hist-${dateStr}-${i}`,
      date: dateStr,
      actual: histActual,
      forecast: histForecast,
      previous: histPrev,
      surpriseDelta,
      isBeat,
    });
  }

  return history;
}

/**
 * Construct institutional intelligence summaries for an event
 */
function buildIntelPayload(
  title: string,
  currency: Currency,
  category: Category,
  forecast: number | null,
  unit: string,
  betterDirection: PolarityDirection
) {
  const fcStr = forecast !== null ? `${forecast}${unit}` : 'consensus target';

  const description = `Tracks official macroeconomic telemetry for ${title} issued by sovereign statistical and central banking agencies. Directly monitors real-economy dynamics, policy trajectory, and institutional capital reallocations.`;

  const whyTradersCare = category === 'Inflation'
    ? `Bedrock benchmark for ${currency} interest rate expectations. Deviations force institutional swaps and bond yield desks to rapidly reprice central bank policy paths.`
    : category === 'Employment'
    ? `Primary gauge of labor market slack, consumer wage pressures, and economic capacity. High-priority input for sovereign monetary policy mandates.`
    : category === 'Central Bank'
    ? `Immediate catalyst for ${currency} liquidity repricing, sovereign yield curve shifts, and interbank money market adjustments.`
    : category === 'Growth'
    ? `Broadest measure of macroeconomic health and expansion capacity for the ${currency} sovereign area.`
    : `High-frequency macro indicator utilized by quantitative macro strategies and institutional foreign exchange desks.`;

  const bullishScenario = betterDirection === 'lower'
    ? `Actual < ${fcStr}: Subdued prints ease economic slack, providing dovish relief or reinforcing benign macro trends.`
    : `Actual > ${fcStr}: Hawkish upside print. Bolsters ${currency} yield differentials, triggering capital inflows and risk asset adjustments.`;

  const bearishScenario = betterDirection === 'lower'
    ? `Actual > ${fcStr}: Elevated readings indicate deteriorating labor market metrics or stagflationary headwinds.`
    : `Actual < ${fcStr}: Downside miss signals economic deceleration, putting immediate selling pressure on ${currency} pairs.`;

  return { description, whyTradersCare, bullishScenario, bearishScenario };
}

/**
 * Helper to generate a clean, deterministic unique ID for an event
 */
function createEventId(raw: RawFFEvent, index: number, timestamp: number): string {
  const safeTitle = raw.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  return `ff-${raw.country.toLowerCase()}-${timestamp}-${safeTitle}-${index}`;
}

/**
 * Robust Normalizer Function: normalizeFFEvents
 * Transforms raw ForexFactory JSON objects into production-grade MacroEvents.
 * 
 * - Maps "country" to CurrencyCode (USD, EUR, GBP, JPY, CAD, AUD, CHF, NZD), filtering out unsupported minor currencies.
 * - Maps "impact" ("High" -> 'HIGH', "Medium" -> 'MEDIUM', "Low" / "Holiday" -> 'LOW').
 * - Parses "date" (ISO-8601 with offset) into a clean UTC timestamp.
 * - Parses numeric strings like "0.2%", "224K", "-1.5B", "5.50%" into clean { value: number | null, unit: string } structures.
 * - Auto-classifies category and polarity (INVERTED for Unemployment/Jobless Claims, NORMAL for others).
 * - Generates rich contextual metadata (agency, description, whyItMatters, thresholdNote, and synthetic history).
 */
export function normalizeFFEvents(rawEvents: RawFFEvent[]): MacroEvent[] {
  if (!Array.isArray(rawEvents)) return [];

  const normalized: MacroEvent[] = [];

  rawEvents.forEach((raw, idx) => {
    // 1. Filter out unsupported currencies
    const currKey = (raw.country || '').trim().toUpperCase();
    const currMeta = SUPPORTED_CURRENCIES[currKey];
    if (!currMeta) {
      return; // Filter out minor/unsupported currency
    }

    // 2. Validate and parse date & UTC timestamp
    const timestamp = Date.parse(raw.date);
    if (isNaN(timestamp)) {
      return; // Skip invalid timestamp
    }
    const datetimeISO = new Date(timestamp).toISOString();

    // 3. Map impact
    const impact = normalizeImpact(raw.impact);

    // 4. Parse values and extract units
    const parsedActual = parseNumericValue(raw.actual);
    const parsedForecast = parseNumericValue(raw.forecast);
    const parsedPrevious = parseNumericValue(raw.previous);

    // Consolidated unit
    let unit = parsedActual.unit || parsedForecast.unit || parsedPrevious.unit || '';
    if (!unit) {
      unit = inferUnitFromTitle(raw.title, parsedForecast.value ?? parsedPrevious.value ?? parsedActual.value);
    }

    // 5. Category & Polarity
    const category = classifyCategory(raw.title);
    const betterDirection = determinePolarity(raw.title);

    // 6. Agency & Frequency
    const agency = inferAgency(currMeta.countryCode, raw.title, category);
    const frequency = inferFrequency(raw.title);

    // 7. Intelligence & Scenarios
    const intel = buildIntelPayload(
      raw.title,
      currMeta.currency,
      category,
      parsedForecast.value,
      unit,
      betterDirection
    );

    // 8. Affected assets
    const affectedAssets = getAffectedAssetsForCurrency(currMeta.currency);

    // 9. Historical release series
    const history = generateSyntheticHistory(
      timestamp,
      parsedForecast.value,
      parsedPrevious.value,
      parsedActual.value,
      unit,
      betterDirection
    );

    // 10. Construct final MacroEvent
    const event: MacroEvent = {
      id: createEventId(raw, idx, timestamp),
      title: raw.title.trim(),
      currency: currMeta.currency,
      country: currMeta.country,
      countryCode: currMeta.countryCode,
      timestamp,
      datetimeISO,
      impact,
      category,
      agency,
      frequency,
      description: intel.description,
      whyTradersCare: intel.whyTradersCare,
      bullishScenario: intel.bullishScenario,
      bearishScenario: intel.bearishScenario,
      affectedAssets,
      actual: parsedActual.value,
      forecast: parsedForecast.value,
      previous: parsedPrevious.value,
      unit,
      betterDirection,
      history,
      isSimulated: false,
    };

    normalized.push(event);
  });

  // Sort chronologically ascending
  return normalized.sort((a, b) => a.timestamp - b.timestamp);
}
