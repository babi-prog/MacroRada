import { MacroEvent } from '../types/calendar';

/**
 * Generates dynamic timestamps relative to the current moment.
 * Offsets in minutes relative to Date.now().
 */
function offsetTimestamp(minutes: number): number {
  return Date.now() + minutes * 60 * 1000;
}

/**
 * Format a past date string relative to a given event timestamp
 */
function getHistoricalDateStr(baseTs: number, monthsAgo: number): string {
  const d = new Date(baseTs);
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toISOString().split('T')[0];
}

/**
 * Generate high-fidelity realistic economic calendar data
 * anchored around the current runtime time.
 */
export function generateDynamicMockCalendar(): MacroEvent[] {
  const now = Date.now();

  const events: MacroEvent[] = [
    // ==========================================
    // 1. IMMINENT UPCOMING HIGH IMPACT EVENT (14 mins from now!)
    // Triggers 15m alert banner and 30m timeline pulse!
    // ==========================================
    {
      id: 'evt-cpi-yoy-primary',
      title: 'US CPI (YoY)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(14.2), // ~14 mins in future
      datetimeISO: new Date(offsetTimestamp(14.2)).toISOString(),
      impact: 'HIGH',
      category: 'Inflation',
      agency: 'U.S. Bureau of Labor Statistics',
      frequency: 'Monthly',
      description: 'The Consumer Price Index (CPI) measures the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services. It is the bedrock gauge for institutional inflation expectations and Federal Reserve interest rate trajectory.',
      whyTradersCare: 'Inflation dictates the Federal Reserve interest rate path. A sticky or upside surprise forces swap markets to price out rate cuts, spiking US Treasury yields and propelling the US Dollar across all G10 pairs. Conversely, downside disinflation triggers rapid dovish repricing.',
      bullishScenario: 'Actual > 3.2%: Hawkish shock. USD rallies aggressively vs EUR, JPY, GBP. Equity index futures and Gold suffer immediate liquidity drain.',
      bearishScenario: 'Actual < 2.9%: Dovish relief. US 10-Year yield collapses, tech equities surge, XAU/USD (Gold) pushes higher on real yield easing.',
      affectedAssets: [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' },
        { symbol: 'US10Y', name: 'US 10-Year Treasury Yield', volatility: 'EXTREME' },
        { symbol: 'XAU/USD', name: 'Spot Gold', volatility: 'EXTREME' },
        { symbol: 'SPX', name: 'S&P 500 Index', volatility: 'HIGH' },
        { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 3.1,
      previous: 3.3,
      unit: '%',
      betterDirection: 'higher', // For USD strength / hawkishness
      history: [
        { id: 'h-cpi-1', date: getHistoricalDateStr(now, 1), actual: 3.3, forecast: 3.2, previous: 3.4, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-cpi-2', date: getHistoricalDateStr(now, 2), actual: 3.4, forecast: 3.5, previous: 3.6, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-cpi-3', date: getHistoricalDateStr(now, 3), actual: 3.6, forecast: 3.6, previous: 3.8, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-cpi-4', date: getHistoricalDateStr(now, 4), actual: 3.8, forecast: 3.9, previous: 4.0, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-cpi-5', date: getHistoricalDateStr(now, 5), actual: 4.0, forecast: 3.8, previous: 4.1, surpriseDelta: 0.2, isBeat: true },
        { id: 'h-cpi-6', date: getHistoricalDateStr(now, 6), actual: 4.1, forecast: 4.2, previous: 4.3, surpriseDelta: -0.1, isBeat: false },
      ]
    },

    // ==========================================
    // 2. CONCURRENT UPCOMING CPI MoM (14 mins from now)
    // ==========================================
    {
      id: 'evt-cpi-mom-secondary',
      title: 'US CPI (MoM)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(14.2),
      datetimeISO: new Date(offsetTimestamp(14.2)).toISOString(),
      impact: 'HIGH',
      category: 'Inflation',
      agency: 'U.S. Bureau of Labor Statistics',
      frequency: 'Monthly',
      description: 'Month-over-month rate of change in prices paid for goods and services across urban areas.',
      whyTradersCare: 'Shows near-term inflationary momentum before base effects smooth the annual YoY calculation.',
      bullishScenario: 'Actual > 0.4%: Fast accelerating price pressure; hawkish Federal Reserve risk.',
      bearishScenario: 'Actual < 0.1%: Deflationary trend reaffirmation; risk assets rally.',
      affectedAssets: [
        { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', volatility: 'HIGH' },
        { symbol: 'QQQ', name: 'Nasdaq 100 ETF', volatility: 'HIGH' },
        { symbol: 'US02Y', name: 'US 2-Year Yield', volatility: 'EXTREME' }
      ],
      actual: null,
      forecast: 0.2,
      previous: 0.3,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-cpim-1', date: getHistoricalDateStr(now, 1), actual: 0.3, forecast: 0.2, previous: 0.2, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-cpim-2', date: getHistoricalDateStr(now, 2), actual: 0.2, forecast: 0.3, previous: 0.4, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-cpim-3', date: getHistoricalDateStr(now, 3), actual: 0.4, forecast: 0.3, previous: 0.3, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-cpim-4', date: getHistoricalDateStr(now, 4), actual: 0.3, forecast: 0.3, previous: 0.2, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-cpim-5', date: getHistoricalDateStr(now, 5), actual: 0.2, forecast: 0.1, previous: 0.1, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-cpim-6', date: getHistoricalDateStr(now, 6), actual: 0.1, forecast: 0.2, previous: 0.3, surpriseDelta: -0.1, isBeat: false },
      ]
    },

    // ==========================================
    // 3. UPCOMING EVENT WITHIN 30 MINS (24 mins from now)
    // ==========================================
    {
      id: 'evt-us-core-cpi',
      title: 'US Core CPI (MoM)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(24.0),
      datetimeISO: new Date(offsetTimestamp(24.0)).toISOString(),
      impact: 'HIGH',
      category: 'Inflation',
      agency: 'U.S. Bureau of Labor Statistics',
      frequency: 'Monthly',
      description: 'Measures changes in the price of goods and services excluding volatile food and energy components. Federal Reserve officials focus heavily on core metrics for underlying trend analysis.',
      whyTradersCare: 'Stripping food and energy provides institutional desks with clear visibility into shelter and supercore service sticky inflation.',
      bullishScenario: 'Actual > 0.3%: Eliminates chances of outsized rate easing in upcoming FOMC sessions.',
      bearishScenario: 'Actual <= 0.1%: Confirms cooling services inflation; bond yields plummet.',
      affectedAssets: [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' },
        { symbol: 'USD/JPY', name: 'US Dollar / Yen', volatility: 'EXTREME' },
        { symbol: 'US10Y', name: '10Y Yield', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 0.2,
      previous: 0.3,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-ccpi-1', date: getHistoricalDateStr(now, 1), actual: 0.3, forecast: 0.2, previous: 0.2, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-ccpi-2', date: getHistoricalDateStr(now, 2), actual: 0.2, forecast: 0.2, previous: 0.3, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ccpi-3', date: getHistoricalDateStr(now, 3), actual: 0.3, forecast: 0.3, previous: 0.3, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ccpi-4', date: getHistoricalDateStr(now, 4), actual: 0.3, forecast: 0.2, previous: 0.4, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-ccpi-5', date: getHistoricalDateStr(now, 5), actual: 0.4, forecast: 0.3, previous: 0.3, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-ccpi-6', date: getHistoricalDateStr(now, 6), actual: 0.3, forecast: 0.3, previous: 0.2, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 4. RECENTLY RELEASED EARLIER TODAY - BIG BEAT (+2h ago)
    // ==========================================
    {
      id: 'evt-uk-gdp-mom',
      title: 'UK Monthly GDP (MoM)',
      currency: 'GBP',
      country: 'United Kingdom',
      countryCode: 'gb',
      timestamp: offsetTimestamp(-125), // 2h 5m ago
      datetimeISO: new Date(offsetTimestamp(-125)).toISOString(),
      impact: 'HIGH',
      category: 'Growth',
      agency: 'Office for National Statistics (ONS)',
      frequency: 'Monthly',
      description: 'Gross Domestic Product (GDP) is the headline monetary measure of all finished goods and services produced within the United Kingdom during the reporting month.',
      whyTradersCare: 'Primary gauge of economic expansion vs recessionary contraction. BoE uses GDP momentum to calibrate monetary restrictiveness.',
      bullishScenario: 'Strong expansion allows the Bank of England to maintain higher terminal interest rates without triggering severe debt stress.',
      bearishScenario: 'Negative reading reinforces UK stagflation narratives and pounds sterling underperformance.',
      affectedAssets: [
        { symbol: 'GBP/USD', name: 'Cable', volatility: 'EXTREME' },
        { symbol: 'EUR/GBP', name: 'Euro / Sterling', volatility: 'HIGH' },
        { symbol: 'FTSE 100', name: 'UK Top 100 Equities', volatility: 'MODERATE' }
      ],
      actual: 0.4,
      forecast: 0.1,
      previous: -0.1,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-ukg-1', date: getHistoricalDateStr(now, 1), actual: 0.4, forecast: 0.1, previous: -0.1, surpriseDelta: 0.3, isBeat: true },
        { id: 'h-ukg-2', date: getHistoricalDateStr(now, 2), actual: -0.1, forecast: 0.0, previous: 0.2, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-ukg-3', date: getHistoricalDateStr(now, 3), actual: 0.2, forecast: 0.2, previous: -0.2, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ukg-4', date: getHistoricalDateStr(now, 4), actual: -0.2, forecast: 0.1, previous: 0.3, surpriseDelta: -0.3, isBeat: false },
        { id: 'h-ukg-5', date: getHistoricalDateStr(now, 5), actual: 0.3, forecast: 0.2, previous: 0.1, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-ukg-6', date: getHistoricalDateStr(now, 6), actual: 0.1, forecast: 0.0, previous: 0.0, surpriseDelta: 0.1, isBeat: true },
      ]
    },

    // ==========================================
    // 5. RECENTLY RELEASED EARLIER TODAY - MISS (-3h ago)
    // ==========================================
    {
      id: 'evt-ez-zew-sentiment',
      title: 'Eurozone ZEW Economic Sentiment',
      currency: 'EUR',
      country: 'Eurozone',
      countryCode: 'eu',
      timestamp: offsetTimestamp(-180), // 3 hours ago
      datetimeISO: new Date(offsetTimestamp(-180)).toISOString(),
      impact: 'MEDIUM',
      category: 'Growth',
      agency: 'ZEW - Leibniz Centre for European Economic Research',
      frequency: 'Monthly',
      description: 'Survey of up to 300 European economic analysts and institutional investors reflecting 6-month economic outlook across the Euro Area.',
      whyTradersCare: 'Leading indicator for industrial production and capital allocation trends in Germany and broader Eurozone.',
      bullishScenario: 'Index above expectations indicates reviving industrial demand and consumer willingness to invest.',
      bearishScenario: 'Contraction below 15 points signals worsening export slump and ECB easing pressure.',
      affectedAssets: [
        { symbol: 'EUR/USD', name: 'Euro / Dollar', volatility: 'HIGH' },
        { symbol: 'DAX 40', name: 'German Equities Index', volatility: 'HIGH' }
      ],
      actual: 18.2,
      forecast: 22.5,
      previous: 20.1,
      unit: 'Index',
      betterDirection: 'higher',
      history: [
        { id: 'h-zew-1', date: getHistoricalDateStr(now, 1), actual: 18.2, forecast: 22.5, previous: 20.1, surpriseDelta: -4.3, isBeat: false },
        { id: 'h-zew-2', date: getHistoricalDateStr(now, 2), actual: 20.1, forecast: 19.0, previous: 17.5, surpriseDelta: 1.1, isBeat: true },
        { id: 'h-zew-3', date: getHistoricalDateStr(now, 3), actual: 17.5, forecast: 16.0, previous: 14.2, surpriseDelta: 1.5, isBeat: true },
        { id: 'h-zew-4', date: getHistoricalDateStr(now, 4), actual: 14.2, forecast: 15.5, previous: 12.8, surpriseDelta: -1.3, isBeat: false },
        { id: 'h-zew-5', date: getHistoricalDateStr(now, 5), actual: 12.8, forecast: 12.0, previous: 11.5, surpriseDelta: 0.8, isBeat: true },
        { id: 'h-zew-6', date: getHistoricalDateStr(now, 6), actual: 11.5, forecast: 10.0, previous: 8.4, surpriseDelta: 1.5, isBeat: true },
      ]
    },

    // ==========================================
    // 6. RECENTLY RELEASED EARLIER TODAY - EMPLOYMENT BEAT (-5h ago)
    // Lower unemployment is better!
    // ==========================================
    {
      id: 'evt-uk-unemployment',
      title: 'UK Claimant Count / Jobless Claims',
      currency: 'GBP',
      country: 'United Kingdom',
      countryCode: 'gb',
      timestamp: offsetTimestamp(-310), // ~5 hours ago
      datetimeISO: new Date(offsetTimestamp(-310)).toISOString(),
      impact: 'MEDIUM',
      category: 'Employment',
      agency: 'Office for National Statistics',
      frequency: 'Monthly',
      description: 'Measures change in the number of individuals claiming unemployment-related benefits during the previous month.',
      whyTradersCare: 'Tight labor supply keeps wage inflation elevated, compelling the Bank of England to maintain high interest rates.',
      bullishScenario: 'Fewer jobless claims signifies resilient employment fundamentals and upward wage pressure.',
      bearishScenario: 'Surge in claims heralds consumer spending slowdown and imminent BoE rate cuts.',
      affectedAssets: [
        { symbol: 'GBP/USD', name: 'Cable', volatility: 'HIGH' },
        { symbol: 'GBP/JPY', name: 'Sterling / Yen', volatility: 'HIGH' }
      ],
      actual: 12.4, // 12.4K vs forecast 28.0K (Lower is better!)
      forecast: 28.0,
      previous: 24.5,
      unit: 'K',
      betterDirection: 'lower',
      history: [
        { id: 'h-ukcc-1', date: getHistoricalDateStr(now, 1), actual: 12.4, forecast: 28.0, previous: 24.5, surpriseDelta: -15.6, isBeat: true },
        { id: 'h-ukcc-2', date: getHistoricalDateStr(now, 2), actual: 24.5, forecast: 20.0, previous: 18.2, surpriseDelta: 4.5, isBeat: false },
        { id: 'h-ukcc-3', date: getHistoricalDateStr(now, 3), actual: 18.2, forecast: 19.5, previous: 22.0, surpriseDelta: -1.3, isBeat: true },
        { id: 'h-ukcc-4', date: getHistoricalDateStr(now, 4), actual: 22.0, forecast: 21.0, previous: 25.1, surpriseDelta: 1.0, isBeat: false },
        { id: 'h-ukcc-5', date: getHistoricalDateStr(now, 5), actual: 25.1, forecast: 26.0, previous: 27.4, surpriseDelta: -0.9, isBeat: true },
        { id: 'h-ukcc-6', date: getHistoricalDateStr(now, 6), actual: 27.4, forecast: 25.0, previous: 23.8, surpriseDelta: 2.4, isBeat: false },
      ]
    },

    // ==========================================
    // 7. UPCOMING TODAY IN 2 HOURS (FOMC Interest Rate Decision)
    // ==========================================
    {
      id: 'evt-fomc-rate-decision',
      title: 'FOMC Interest Rate Decision',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(135), // 2h 15m in future
      datetimeISO: new Date(offsetTimestamp(135)).toISOString(),
      impact: 'HIGH',
      category: 'Central Bank',
      agency: 'Federal Open Market Committee (Fed)',
      frequency: '8 times per year',
      description: 'The Federal Reserve benchmark target range for the overnight Federal Funds Rate, determining borrowing costs across global financial markets.',
      whyTradersCare: 'The single most consequential macro catalyst on Earth. Sets global liquidity conditions, dollar parity, sovereign credit spreads, and asset valuation multiples.',
      bullishScenario: 'Hawkish pause or 25bps hike with Dot Plot signaling "higher for longer" policy rates.',
      bearishScenario: 'Dovish 50bps rate cut accompanied by explicit admission of labor market weakness.',
      affectedAssets: [
        { symbol: 'DXY', name: 'US Dollar Index', volatility: 'EXTREME' },
        { symbol: 'US10Y', name: 'US 10Y Benchmark', volatility: 'EXTREME' },
        { symbol: 'XAU/USD', name: 'Gold Bullion', volatility: 'EXTREME' },
        { symbol: 'BTC/USD', name: 'Bitcoin', volatility: 'EXTREME' },
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' }
      ],
      actual: null,
      forecast: 4.75,
      previous: 5.00,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-fed-1', date: getHistoricalDateStr(now, 2), actual: 5.00, forecast: 5.00, previous: 5.25, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-fed-2', date: getHistoricalDateStr(now, 3), actual: 5.25, forecast: 5.25, previous: 5.50, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-fed-3', date: getHistoricalDateStr(now, 5), actual: 5.50, forecast: 5.50, previous: 5.50, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-fed-4', date: getHistoricalDateStr(now, 7), actual: 5.50, forecast: 5.50, previous: 5.50, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-fed-5', date: getHistoricalDateStr(now, 8), actual: 5.50, forecast: 5.50, previous: 5.25, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-fed-6', date: getHistoricalDateStr(now, 10), actual: 5.25, forecast: 5.25, previous: 5.00, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 8. UPCOMING TODAY IN 2.5 HOURS (Powell Press Conference)
    // ==========================================
    {
      id: 'evt-fomc-powell-presser',
      title: 'FOMC Press Conference (Chair Powell Speaks)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(165), // 2h 45m in future
      datetimeISO: new Date(offsetTimestamp(165)).toISOString(),
      impact: 'HIGH',
      category: 'Central Bank',
      agency: 'Federal Reserve Board of Governors',
      frequency: '8 times per year',
      description: 'Post-meeting press conference by Fed Chair Jerome Powell providing detailed qualitative guidance on economic forecasts, inflation persistence, and future rate path.',
      whyTradersCare: 'High-frequency algorithmic trading reaction to nuanced phraseology around neutral rates ("R-star"), balance sheet runoff (QT), and financial conditions.',
      bullishScenario: 'Powell highlights sticky wage gains and downplays near-term urgency to deliver additional rate cuts.',
      bearishScenario: 'Powell emphasizes mounting downside risks to employment and hints at aggressive policy easing.',
      affectedAssets: [
        { symbol: 'US02Y', name: 'US 2-Year Treasury', volatility: 'EXTREME' },
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' },
        { symbol: 'NAS100', name: 'Nasdaq 100 Index', volatility: 'EXTREME' }
      ],
      actual: null,
      forecast: null,
      previous: null,
      unit: '',
      betterDirection: 'neutral',
      history: []
    },

    // ==========================================
    // 9. UPCOMING TODAY IN 4 HOURS (Crude Oil Inventories)
    // ==========================================
    {
      id: 'evt-eia-crude-stocks',
      title: 'EIA Crude Oil Stocks Change',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(240),
      datetimeISO: new Date(offsetTimestamp(240)).toISOString(),
      impact: 'MEDIUM',
      category: 'Trade',
      agency: 'U.S. Energy Information Administration (EIA)',
      frequency: 'Weekly',
      description: 'Measures the weekly change in barrels of commercial crude oil held by US firms.',
      whyTradersCare: 'Direct impact on WTI & Brent crude prices, refinery margins, and commodity-linked currencies like CAD and NOK.',
      bullishScenario: 'Heavy inventory drawdown signals robust energy demand, boosting CAD and oil equities.',
      bearishScenario: 'Unexpected inventory buildup indicates refining bottleneck or slowing industrial freight activity.',
      affectedAssets: [
        { symbol: 'WTI', name: 'US Crude Oil', volatility: 'EXTREME' },
        { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: -1.2,
      previous: 2.1,
      unit: 'B',
      betterDirection: 'lower', // Drawdown is bullish for oil / economy
      history: [
        { id: 'h-eia-1', date: getHistoricalDateStr(now, 1), actual: 2.1, forecast: 0.5, previous: -1.8, surpriseDelta: 1.6, isBeat: false },
        { id: 'h-eia-2', date: getHistoricalDateStr(now, 2), actual: -1.8, forecast: -1.0, previous: 3.4, surpriseDelta: -0.8, isBeat: true },
        { id: 'h-eia-3', date: getHistoricalDateStr(now, 3), actual: 3.4, forecast: 1.2, previous: -0.5, surpriseDelta: 2.2, isBeat: false },
        { id: 'h-eia-4', date: getHistoricalDateStr(now, 4), actual: -0.5, forecast: -0.2, previous: 1.1, surpriseDelta: -0.3, isBeat: true },
        { id: 'h-eia-5', date: getHistoricalDateStr(now, 5), actual: 1.1, forecast: 0.8, previous: -2.3, surpriseDelta: 0.3, isBeat: false },
        { id: 'h-eia-6', date: getHistoricalDateStr(now, 6), actual: -2.3, forecast: -1.5, previous: 0.4, surpriseDelta: -0.8, isBeat: true },
      ]
    },

    // ==========================================
    // 10. RECENTLY RELEASED EARLIER TODAY - ASIAN SESSION (BoJ Summary)
    // ==========================================
    {
      id: 'evt-boj-summary-opinions',
      title: 'BoJ Summary of Opinions',
      currency: 'JPY',
      country: 'Japan',
      countryCode: 'jp',
      timestamp: offsetTimestamp(-600), // 10h ago
      datetimeISO: new Date(offsetTimestamp(-600)).toISOString(),
      impact: 'MEDIUM',
      category: 'Central Bank',
      agency: 'Bank of Japan',
      frequency: '8 times per year',
      description: 'Comprehensive breakdown of views expressed by the nine Policy Board members during the recent monetary policy meeting.',
      whyTradersCare: 'Crucial clues on timeline for further interest rate hikes and quantitative tightening (JGB bond purchase reductions).',
      bullishScenario: 'Several board members calling for immediate interest rate hikes to defend the Yen.',
      bearishScenario: 'Cautious tone focusing on real wage stagnation, signaling prolonged ultra-low rate environment.',
      affectedAssets: [
        { symbol: 'USD/JPY', name: 'US Dollar / Yen', volatility: 'HIGH' },
        { symbol: 'Nikkei 225', name: 'Japan 225 Index', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: null,
      previous: null,
      unit: '',
      betterDirection: 'neutral',
      history: []
    },

    // ==========================================
    // 11. RECENTLY RELEASED EARLIER TODAY - AUSTRALIAN CONSUMER SENTIMENT
    // ==========================================
    {
      id: 'evt-aud-westpac-sentiment',
      title: 'Westpac Consumer Sentiment',
      currency: 'AUD',
      country: 'Australia',
      countryCode: 'au',
      timestamp: offsetTimestamp(-660), // 11h ago
      datetimeISO: new Date(offsetTimestamp(-660)).toISOString(),
      impact: 'LOW',
      category: 'Consumer',
      agency: 'Westpac Banking Corporation & Melbourne Institute',
      frequency: 'Monthly',
      description: 'Index based on survey of 1,200 Australian consumers measuring financial condition, family finances, and economic prospects.',
      whyTradersCare: 'Reflects household financial stress amidst high mortgage rates and sticky utility prices.',
      bullishScenario: 'Index above 100 denotes expansionary optimism and consumer readiness to spend.',
      bearishScenario: 'Contraction below 85 signals consumer belt-tightening and RBA rate cut pressure.',
      affectedAssets: [
        { symbol: 'AUD/USD', name: 'Aussie Dollar', volatility: 'MODERATE' },
        { symbol: 'AUD/NZD', name: 'Aussie / Kiwi', volatility: 'MODERATE' }
      ],
      actual: 89.8,
      forecast: 88.0,
      previous: 87.2,
      unit: 'pts',
      betterDirection: 'higher',
      history: [
        { id: 'h-aud-1', date: getHistoricalDateStr(now, 1), actual: 89.8, forecast: 88.0, previous: 87.2, surpriseDelta: 1.8, isBeat: true },
        { id: 'h-aud-2', date: getHistoricalDateStr(now, 2), actual: 87.2, forecast: 86.5, previous: 85.0, surpriseDelta: 0.7, isBeat: true },
        { id: 'h-aud-3', date: getHistoricalDateStr(now, 3), actual: 85.0, forecast: 86.0, previous: 84.4, surpriseDelta: -1.0, isBeat: false },
        { id: 'h-aud-4', date: getHistoricalDateStr(now, 4), actual: 84.4, forecast: 83.0, previous: 82.1, surpriseDelta: 1.4, isBeat: true },
        { id: 'h-aud-5', date: getHistoricalDateStr(now, 5), actual: 82.1, forecast: 83.5, previous: 84.0, surpriseDelta: -1.4, isBeat: false },
        { id: 'h-aud-6', date: getHistoricalDateStr(now, 6), actual: 84.0, forecast: 82.0, previous: 81.0, surpriseDelta: 2.0, isBeat: true },
      ]
    },

    // ==========================================
    // 12. TOMORROW MORNING - EUROPEAN CENTRAL BANK MAIN REFINANCING RATE
    // ==========================================
    {
      id: 'evt-ecb-rate-decision',
      title: 'ECB Main Refinancing Rate',
      currency: 'EUR',
      country: 'Eurozone',
      countryCode: 'eu',
      timestamp: offsetTimestamp(1440 - 180), // Tomorrow ~21 hours ahead
      datetimeISO: new Date(offsetTimestamp(1440 - 180)).toISOString(),
      impact: 'HIGH',
      category: 'Central Bank',
      agency: 'European Central Bank (ECB)',
      frequency: '8 times per year',
      description: 'The rate on main refinancing operations (MRO), which provide the bulk of liquidity to the banking system in the euro area.',
      whyTradersCare: 'Determines the risk-free rate of return in Europe and drives sovereign bond spreads (e.g., German Bund vs Italian BTP).',
      bullishScenario: 'ECB pauses rate cuts or signals reluctance to ease further due to sticky services inflation.',
      bearishScenario: 'ECB cuts rates by 50bps to combat German industrial stagnation.',
      affectedAssets: [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' },
        { symbol: 'EUR/GBP', name: 'Euro / Pound', volatility: 'HIGH' },
        { symbol: 'DAX 40', name: 'DAX Index', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 3.25,
      previous: 3.50,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-ecb-1', date: getHistoricalDateStr(now, 2), actual: 3.50, forecast: 3.50, previous: 3.75, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ecb-2', date: getHistoricalDateStr(now, 4), actual: 3.75, forecast: 3.75, previous: 4.00, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ecb-3', date: getHistoricalDateStr(now, 6), actual: 4.00, forecast: 4.00, previous: 4.00, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ecb-4', date: getHistoricalDateStr(now, 8), actual: 4.00, forecast: 4.00, previous: 4.00, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ecb-5', date: getHistoricalDateStr(now, 9), actual: 4.00, forecast: 4.00, previous: 3.75, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ecb-6', date: getHistoricalDateStr(now, 11), actual: 3.75, forecast: 3.75, previous: 3.50, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 13. TOMORROW AFTERNOON - US INITIAL JOBLESS CLAIMS
    // ==========================================
    {
      id: 'evt-us-initial-jobless',
      title: 'US Initial Jobless Claims',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(1440 - 60), // Tomorrow ~23h ahead
      datetimeISO: new Date(offsetTimestamp(1440 - 60)).toISOString(),
      impact: 'HIGH',
      category: 'Employment',
      agency: 'U.S. Department of Labor',
      frequency: 'Weekly',
      description: 'Measures the number of first-time claims for state unemployment insurance during the preceding week.',
      whyTradersCare: 'Highest frequency pulse on US labor market deterioration or resilience. A sharp spike above 250K sparks recession chatter.',
      bullishScenario: 'Claims < 210K demonstrates ongoing labor hoarding and negligible layoff momentum.',
      bearishScenario: 'Claims > 255K triggers rapid Fed rate cut pricing as unemployment risks materialise.',
      affectedAssets: [
        { symbol: 'USD/JPY', name: 'Dollar / Yen', volatility: 'HIGH' },
        { symbol: 'US02Y', name: 'US 2-Year Yield', volatility: 'HIGH' },
        { symbol: 'SPX', name: 'S&P 500', volatility: 'MODERATE' }
      ],
      actual: null,
      forecast: 221,
      previous: 216,
      unit: 'K',
      betterDirection: 'lower',
      history: [
        { id: 'h-ijc-1', date: getHistoricalDateStr(now, 1), actual: 216, forecast: 220, previous: 224, surpriseDelta: -4, isBeat: true },
        { id: 'h-ijc-2', date: getHistoricalDateStr(now, 1), actual: 224, forecast: 222, previous: 218, surpriseDelta: 2, isBeat: false },
        { id: 'h-ijc-3', date: getHistoricalDateStr(now, 2), actual: 218, forecast: 225, previous: 231, surpriseDelta: -7, isBeat: true },
        { id: 'h-ijc-4', date: getHistoricalDateStr(now, 2), actual: 231, forecast: 228, previous: 235, surpriseDelta: 3, isBeat: false },
        { id: 'h-ijc-5', date: getHistoricalDateStr(now, 3), actual: 235, forecast: 230, previous: 229, surpriseDelta: 5, isBeat: false },
        { id: 'h-ijc-6', date: getHistoricalDateStr(now, 3), actual: 229, forecast: 232, previous: 238, surpriseDelta: -3, isBeat: true },
      ]
    },

    // ==========================================
    // 14. TOMORROW - US PRODUCER PRICE INDEX (PPI Final Demand MoM)
    // ==========================================
    {
      id: 'evt-us-ppi-mom',
      title: 'US PPI Final Demand (MoM)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(1440 - 60),
      datetimeISO: new Date(offsetTimestamp(1440 - 60)).toISOString(),
      impact: 'MEDIUM',
      category: 'Inflation',
      agency: 'U.S. Bureau of Labor Statistics',
      frequency: 'Monthly',
      description: 'Measures the average change in selling prices received by domestic producers for their output.',
      whyTradersCare: 'Leading pipeline indicator for consumer price inflation. Feeds directly into PCE healthcare and airline ticket computations.',
      bullishScenario: 'Upstream price spikes indicate persistent pipeline costs that corporations pass on to consumers.',
      bearishScenario: 'Producer deflation provides relief to core PCE calculations.',
      affectedAssets: [
        { symbol: 'US10Y', name: 'US 10Y Yield', volatility: 'HIGH' },
        { symbol: 'EUR/USD', name: 'Euro / Dollar', volatility: 'MODERATE' }
      ],
      actual: null,
      forecast: 0.2,
      previous: 0.1,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-ppi-1', date: getHistoricalDateStr(now, 1), actual: 0.1, forecast: 0.2, previous: 0.2, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-ppi-2', date: getHistoricalDateStr(now, 2), actual: 0.2, forecast: 0.1, previous: 0.0, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-ppi-3', date: getHistoricalDateStr(now, 3), actual: 0.0, forecast: 0.1, previous: 0.3, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-ppi-4', date: getHistoricalDateStr(now, 4), actual: 0.3, forecast: 0.2, previous: 0.1, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-ppi-5', date: getHistoricalDateStr(now, 5), actual: 0.1, forecast: 0.2, previous: 0.2, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-ppi-6', date: getHistoricalDateStr(now, 6), actual: 0.2, forecast: 0.2, previous: 0.1, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 15. FRIDAY UPCOMING - US NON-FARM PAYROLLS (NFP)
    // The King of Economic Releases
    // ==========================================
    {
      id: 'evt-us-nfp-supercatalyst',
      title: 'US Non-Farm Payrolls (NFP)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(2880 + 360), // +2 days in future
      datetimeISO: new Date(offsetTimestamp(2880 + 360)).toISOString(),
      impact: 'HIGH',
      category: 'Employment',
      agency: 'U.S. Bureau of Labor Statistics',
      frequency: 'Monthly (First Friday)',
      description: 'Total number of paid workers in the US excluding farm employees, government officials, private domestic employees, and NGO volunteers.',
      whyTradersCare: 'Historically the single highest-volatility macro print for currency, interest rate, and commodity markets globally.',
      bullishScenario: 'Print > 220K signals blowout economic momentum, forcing sharp upward repricing of bond yields.',
      bearishScenario: 'Sub-100K print stokes severe labor market panic and accelerates Fed emergency cut odds.',
      affectedAssets: [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' },
        { symbol: 'USD/JPY', name: 'US Dollar / Yen', volatility: 'EXTREME' },
        { symbol: 'XAU/USD', name: 'Gold Spot', volatility: 'EXTREME' },
        { symbol: 'US10Y', name: '10Y Treasury', volatility: 'EXTREME' },
        { symbol: 'SPX', name: 'S&P 500', volatility: 'EXTREME' }
      ],
      actual: null,
      forecast: 175,
      previous: 223,
      unit: 'K',
      betterDirection: 'higher',
      history: [
        { id: 'h-nfp-1', date: getHistoricalDateStr(now, 1), actual: 223, forecast: 160, previous: 142, surpriseDelta: 63, isBeat: true },
        { id: 'h-nfp-2', date: getHistoricalDateStr(now, 2), actual: 142, forecast: 165, previous: 114, surpriseDelta: -23, isBeat: false },
        { id: 'h-nfp-3', date: getHistoricalDateStr(now, 3), actual: 114, forecast: 175, previous: 216, surpriseDelta: -61, isBeat: false },
        { id: 'h-nfp-4', date: getHistoricalDateStr(now, 4), actual: 216, forecast: 180, previous: 175, surpriseDelta: 36, isBeat: true },
        { id: 'h-nfp-5', date: getHistoricalDateStr(now, 5), actual: 175, forecast: 190, previous: 165, surpriseDelta: -15, isBeat: false },
        { id: 'h-nfp-6', date: getHistoricalDateStr(now, 6), actual: 165, forecast: 155, previous: 180, surpriseDelta: 10, isBeat: true },
      ]
    },

    // ==========================================
    // 16. FRIDAY UPCOMING - US UNEMPLOYMENT RATE
    // ==========================================
    {
      id: 'evt-us-unemployment-rate',
      title: 'US Unemployment Rate',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(2880 + 360),
      datetimeISO: new Date(offsetTimestamp(2880 + 360)).toISOString(),
      impact: 'HIGH',
      category: 'Employment',
      agency: 'U.S. Bureau of Labor Statistics',
      frequency: 'Monthly',
      description: 'Percentage of the total civilian labor force that is unemployed but actively seeking employment and willing to work.',
      whyTradersCare: 'The Sahm Rule trigger indicator. A rise of 0.50% above the minimum 3-month rolling average has historically signaled a US recession with 100% precision.',
      bullishScenario: 'Rate drops to 3.9% or lower, validating the soft-landing narrative.',
      bearishScenario: 'Rate rises to 4.3% or higher, triggering Sahm rule recession threshold.',
      affectedAssets: [
        { symbol: 'USD/JPY', name: 'US Dollar / Yen', volatility: 'EXTREME' },
        { symbol: 'US02Y', name: 'US 2Y Yield', volatility: 'EXTREME' }
      ],
      actual: null,
      forecast: 4.1,
      previous: 4.1,
      unit: '%',
      betterDirection: 'lower',
      history: [
        { id: 'h-uur-1', date: getHistoricalDateStr(now, 1), actual: 4.1, forecast: 4.2, previous: 4.3, surpriseDelta: -0.1, isBeat: true },
        { id: 'h-uur-2', date: getHistoricalDateStr(now, 2), actual: 4.3, forecast: 4.1, previous: 4.1, surpriseDelta: 0.2, isBeat: false },
        { id: 'h-uur-3', date: getHistoricalDateStr(now, 3), actual: 4.1, forecast: 4.0, previous: 4.0, surpriseDelta: 0.1, isBeat: false },
        { id: 'h-uur-4', date: getHistoricalDateStr(now, 4), actual: 4.0, forecast: 4.0, previous: 3.9, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-uur-5', date: getHistoricalDateStr(now, 5), actual: 3.9, forecast: 3.9, previous: 3.8, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-uur-6', date: getHistoricalDateStr(now, 6), actual: 3.8, forecast: 3.7, previous: 3.7, surpriseDelta: 0.1, isBeat: false },
      ]
    },

    // ==========================================
    // 17. FRIDAY UPCOMING - US AVERAGE HOURLY EARNINGS MoM
    // ==========================================
    {
      id: 'evt-us-hourly-earnings',
      title: 'US Average Hourly Earnings (MoM)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(2880 + 360),
      datetimeISO: new Date(offsetTimestamp(2880 + 360)).toISOString(),
      impact: 'HIGH',
      category: 'Employment',
      agency: 'U.S. Bureau of Labor Statistics',
      frequency: 'Monthly',
      description: 'Measures change in the price businesses pay for civilian labor excluding bonuses and stock compensation.',
      whyTradersCare: 'Wage-push inflation indicator. If wage growth exceeds productivity growth, service inflation remains entrenched.',
      bullishScenario: 'Earnings > 0.4% MoM suggests wage-price spiral concerns.',
      bearishScenario: 'Earnings < 0.2% validates disinflation in the services sector.',
      affectedAssets: [
        { symbol: 'US10Y', name: 'US 10-Year', volatility: 'HIGH' },
        { symbol: 'EUR/USD', name: 'Euro / Dollar', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 0.3,
      previous: 0.4,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-ahe-1', date: getHistoricalDateStr(now, 1), actual: 0.4, forecast: 0.3, previous: 0.3, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-ahe-2', date: getHistoricalDateStr(now, 2), actual: 0.3, forecast: 0.3, previous: 0.4, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ahe-3', date: getHistoricalDateStr(now, 3), actual: 0.4, forecast: 0.3, previous: 0.2, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-ahe-4', date: getHistoricalDateStr(now, 4), actual: 0.2, forecast: 0.3, previous: 0.3, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-ahe-5', date: getHistoricalDateStr(now, 5), actual: 0.3, forecast: 0.3, previous: 0.3, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-ahe-6', date: getHistoricalDateStr(now, 6), actual: 0.3, forecast: 0.2, previous: 0.3, surpriseDelta: 0.1, isBeat: true },
      ]
    },

    // ==========================================
    // 18. CANADIAN UNEMPLOYMENT RATE
    // ==========================================
    {
      id: 'evt-cad-unemployment',
      title: 'Canada Net Change in Employment',
      currency: 'CAD',
      country: 'Canada',
      countryCode: 'ca',
      timestamp: offsetTimestamp(2880 + 360),
      datetimeISO: new Date(offsetTimestamp(2880 + 360)).toISOString(),
      impact: 'HIGH',
      category: 'Employment',
      agency: 'Statistics Canada',
      frequency: 'Monthly',
      description: 'Change in the number of employed people in Canada during the reference month.',
      whyTradersCare: 'Directly influences Bank of Canada (BoC) rate easing velocity.',
      bullishScenario: 'Strong job addition > 40K sparks CAD short-covering rally.',
      bearishScenario: 'Job loss > 20K accelerates BoC 50bps rate cut probability.',
      affectedAssets: [
        { symbol: 'USD/CAD', name: 'Loonie', volatility: 'EXTREME' },
        { symbol: 'CAD/JPY', name: 'Canadian Dollar / Yen', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 25.0,
      previous: 46.7,
      unit: 'K',
      betterDirection: 'higher',
      history: [
        { id: 'h-cadj-1', date: getHistoricalDateStr(now, 1), actual: 46.7, forecast: 27.0, previous: -2.8, surpriseDelta: 19.7, isBeat: true },
        { id: 'h-cadj-2', date: getHistoricalDateStr(now, 2), actual: -2.8, forecast: 22.0, previous: -1.4, surpriseDelta: -24.8, isBeat: false },
        { id: 'h-cadj-3', date: getHistoricalDateStr(now, 3), actual: -1.4, forecast: 25.0, previous: 26.7, surpriseDelta: -26.4, isBeat: false },
        { id: 'h-cadj-4', date: getHistoricalDateStr(now, 4), actual: 26.7, forecast: 20.0, previous: 90.4, surpriseDelta: 6.7, isBeat: true },
        { id: 'h-cadj-5', date: getHistoricalDateStr(now, 5), actual: 90.4, forecast: 20.0, previous: -2.2, surpriseDelta: 70.4, isBeat: true },
        { id: 'h-cadj-6', date: getHistoricalDateStr(now, 6), actual: -2.2, forecast: 15.0, previous: 40.7, surpriseDelta: -17.2, isBeat: false },
      ]
    },

    // ==========================================
    // 19. YESTERDAY'S RELEASES - AUD CASH RATE (BoA / RBA Decision)
    // ==========================================
    {
      id: 'evt-rba-rate-decision-yesterday',
      title: 'RBA Interest Rate Decision',
      currency: 'AUD',
      country: 'Australia',
      countryCode: 'au',
      timestamp: offsetTimestamp(-1440 - 240), // Yesterday ~28h ago
      datetimeISO: new Date(offsetTimestamp(-1440 - 240)).toISOString(),
      impact: 'HIGH',
      category: 'Central Bank',
      agency: 'Reserve Bank of Australia (RBA)',
      frequency: '8 times per year',
      description: 'The cash rate target set by the RBA Board for overnight unsecured loans between financial institutions.',
      whyTradersCare: 'RBA has maintained one of the most hawkish stances among G10 central banks due to persistent services inflation.',
      bullishScenario: 'RBA highlights stubborn inflation and refuses to rule out further tightening.',
      bearishScenario: 'RBA softens statement forward guidance towards neutral.',
      affectedAssets: [
        { symbol: 'AUD/USD', name: 'Aussie Dollar', volatility: 'EXTREME' },
        { symbol: 'AUD/JPY', name: 'Aussie / Yen', volatility: 'HIGH' }
      ],
      actual: 4.35,
      forecast: 4.35,
      previous: 4.35,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-rba-1', date: getHistoricalDateStr(now, 2), actual: 4.35, forecast: 4.35, previous: 4.35, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rba-2', date: getHistoricalDateStr(now, 3), actual: 4.35, forecast: 4.35, previous: 4.35, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rba-3', date: getHistoricalDateStr(now, 5), actual: 4.35, forecast: 4.35, previous: 4.35, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rba-4', date: getHistoricalDateStr(now, 7), actual: 4.35, forecast: 4.35, previous: 4.35, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rba-5', date: getHistoricalDateStr(now, 8), actual: 4.35, forecast: 4.35, previous: 4.35, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rba-6', date: getHistoricalDateStr(now, 10), actual: 4.35, forecast: 4.35, previous: 4.10, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 20. YESTERDAY'S RELEASES - US ISM MANUFACTURING PMI
    // ==========================================
    {
      id: 'evt-ism-mfg-yesterday',
      title: 'US ISM Manufacturing PMI',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(-1440 + 120), // Yesterday ~22h ago
      datetimeISO: new Date(offsetTimestamp(-1440 + 120)).toISOString(),
      impact: 'HIGH',
      category: 'Manufacturing',
      agency: 'Institute for Supply Management (ISM)',
      frequency: 'Monthly',
      description: 'Survey of purchasing managers across 300+ manufacturing firms assessing production, new orders, inventories, and prices paid.',
      whyTradersCare: 'Widely regarded leading economic indicator. Readings above 50 signal expansion; below 50 signals manufacturing contraction.',
      bullishScenario: 'PMI breaking cleanly above 50 validates re-acceleration of the goods sector.',
      bearishScenario: 'PMI dropping below 47 signals prolonged factory sector stagnation.',
      affectedAssets: [
        { symbol: 'USD/JPY', name: 'Dollar / Yen', volatility: 'HIGH' },
        { symbol: 'US10Y', name: '10-Year Yield', volatility: 'HIGH' },
        { symbol: 'SPX', name: 'S&P 500', volatility: 'HIGH' }
      ],
      actual: 46.5,
      forecast: 47.6,
      previous: 47.2,
      unit: 'Index',
      betterDirection: 'higher',
      history: [
        { id: 'h-ism-1', date: getHistoricalDateStr(now, 1), actual: 46.5, forecast: 47.6, previous: 47.2, surpriseDelta: -1.1, isBeat: false },
        { id: 'h-ism-2', date: getHistoricalDateStr(now, 2), actual: 47.2, forecast: 47.5, previous: 46.8, surpriseDelta: -0.3, isBeat: false },
        { id: 'h-ism-3', date: getHistoricalDateStr(now, 3), actual: 46.8, forecast: 48.2, previous: 48.5, surpriseDelta: -1.4, isBeat: false },
        { id: 'h-ism-4', date: getHistoricalDateStr(now, 4), actual: 48.5, forecast: 49.0, previous: 49.2, surpriseDelta: -0.5, isBeat: false },
        { id: 'h-ism-5', date: getHistoricalDateStr(now, 5), actual: 49.2, forecast: 48.0, previous: 50.3, surpriseDelta: 1.2, isBeat: true },
        { id: 'h-ism-6', date: getHistoricalDateStr(now, 6), actual: 50.3, forecast: 49.9, previous: 47.8, surpriseDelta: 0.4, isBeat: true },
      ]
    },

    // ==========================================
    // 21. YESTERDAY'S RELEASES - GERMAN INDUSTRIAL PRODUCTION
    // ==========================================
    {
      id: 'evt-ger-industrial-yesterday',
      title: 'German Industrial Production (MoM)',
      currency: 'EUR',
      country: 'Eurozone',
      countryCode: 'eu',
      timestamp: offsetTimestamp(-1440 - 180),
      datetimeISO: new Date(offsetTimestamp(-1440 - 180)).toISOString(),
      impact: 'MEDIUM',
      category: 'Manufacturing',
      agency: 'Federal Statistical Office (Destatis)',
      frequency: 'Monthly',
      description: 'Measures output of factories, mines, and utilities in Germany, the economic engine of Europe.',
      whyTradersCare: 'Benchmark for European manufacturing export health.',
      bullishScenario: 'Strong industrial rebound indicates German competitiveness stabilizing.',
      bearishScenario: 'Continued decline raises structural de-industrialization risks in Germany.',
      affectedAssets: [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'MODERATE' },
        { symbol: 'DAX 40', name: 'DAX 40 Index', volatility: 'HIGH' }
      ],
      actual: -2.5,
      forecast: -1.0,
      previous: 2.9,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-gip-1', date: getHistoricalDateStr(now, 1), actual: -2.5, forecast: -1.0, previous: 2.9, surpriseDelta: -1.5, isBeat: false },
        { id: 'h-gip-2', date: getHistoricalDateStr(now, 2), actual: 2.9, forecast: 0.8, previous: -2.4, surpriseDelta: 2.1, isBeat: true },
        { id: 'h-gip-3', date: getHistoricalDateStr(now, 3), actual: -2.4, forecast: -0.3, previous: -1.6, surpriseDelta: -2.1, isBeat: false },
        { id: 'h-gip-4', date: getHistoricalDateStr(now, 4), actual: -1.6, forecast: 0.5, previous: 0.2, surpriseDelta: -2.1, isBeat: false },
        { id: 'h-gip-5', date: getHistoricalDateStr(now, 5), actual: 0.2, forecast: -0.2, previous: -0.1, surpriseDelta: 0.4, isBeat: true },
        { id: 'h-gip-6', date: getHistoricalDateStr(now, 6), actual: -0.1, forecast: 0.3, previous: 2.1, surpriseDelta: -0.4, isBeat: false },
      ]
    },

    // ==========================================
    // 22. EARLIER THIS WEEK - SWISS NATIONAL BANK (SNB) POLICY RATE
    // ==========================================
    {
      id: 'evt-snb-rate-decision',
      title: 'SNB Policy Rate Decision',
      currency: 'CHF',
      country: 'Switzerland',
      countryCode: 'ch',
      timestamp: offsetTimestamp(-2880 + 300), // 2 days ago
      datetimeISO: new Date(offsetTimestamp(-2880 + 300)).toISOString(),
      impact: 'HIGH',
      category: 'Central Bank',
      agency: 'Swiss National Bank (SNB)',
      frequency: 'Quarterly',
      description: 'The SNB target rate for secured call money on the Swiss franc money market (SARON).',
      whyTradersCare: 'Dictates Swiss franc safe-haven capital flows and SNB foreign currency market intervention.',
      bullishScenario: 'SNB holds rate and expresses concern over excessive Franc depreciation.',
      bearishScenario: 'SNB cuts 25bps and threatens active FX intervention to weaken the CHF.',
      affectedAssets: [
        { symbol: 'USD/CHF', name: 'Dollar / Swiss', volatility: 'EXTREME' },
        { symbol: 'EUR/CHF', name: 'Euro / Swiss', volatility: 'EXTREME' }
      ],
      actual: 1.00,
      forecast: 1.00,
      previous: 1.25,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-snb-1', date: getHistoricalDateStr(now, 3), actual: 1.00, forecast: 1.00, previous: 1.25, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-snb-2', date: getHistoricalDateStr(now, 6), actual: 1.25, forecast: 1.25, previous: 1.50, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-snb-3', date: getHistoricalDateStr(now, 9), actual: 1.50, forecast: 1.50, previous: 1.75, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-snb-4', date: getHistoricalDateStr(now, 12), actual: 1.75, forecast: 1.75, previous: 1.75, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-snb-5', date: getHistoricalDateStr(now, 15), actual: 1.75, forecast: 1.75, previous: 1.75, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-snb-6', date: getHistoricalDateStr(now, 18), actual: 1.75, forecast: 1.75, previous: 1.50, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 23. UPCOMING - NEW ZEALAND RBNZ RATE STATEMENT
    // ==========================================
    {
      id: 'evt-rbnz-rate-decision',
      title: 'RBNZ Official Cash Rate (OCR)',
      currency: 'NZD',
      country: 'New Zealand',
      countryCode: 'nz',
      timestamp: offsetTimestamp(2880 - 400), // +1.7 days
      datetimeISO: new Date(offsetTimestamp(2880 - 400)).toISOString(),
      impact: 'HIGH',
      category: 'Central Bank',
      agency: 'Reserve Bank of New Zealand',
      frequency: '7 times per year',
      description: 'The benchmark interest rate set by the Reserve Bank of New Zealand.',
      whyTradersCare: 'High-beta currency that reacts sharply to shifts in monetary tightening / easing posture.',
      bullishScenario: 'RBNZ holds rate or signals shallower easing cycle than market swaps anticipated.',
      bearishScenario: 'RBNZ delivers jumbo 50bps rate cut citing domestic demand softness.',
      affectedAssets: [
        { symbol: 'NZD/USD', name: 'Kiwi Dollar', volatility: 'EXTREME' },
        { symbol: 'AUD/NZD', name: 'Aussie / Kiwi Cross', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 4.25,
      previous: 4.75,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-rbnz-1', date: getHistoricalDateStr(now, 2), actual: 4.75, forecast: 4.75, previous: 5.25, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rbnz-2', date: getHistoricalDateStr(now, 4), actual: 5.25, forecast: 5.25, previous: 5.50, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rbnz-3', date: getHistoricalDateStr(now, 6), actual: 5.50, forecast: 5.50, previous: 5.50, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rbnz-4', date: getHistoricalDateStr(now, 8), actual: 5.50, forecast: 5.50, previous: 5.50, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rbnz-5', date: getHistoricalDateStr(now, 10), actual: 5.50, forecast: 5.50, previous: 5.50, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-rbnz-6', date: getHistoricalDateStr(now, 12), actual: 5.50, forecast: 5.50, previous: 5.25, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 24. UPCOMING - US RETAIL SALES (ADVANCE MoM)
    // ==========================================
    {
      id: 'evt-us-retail-sales',
      title: 'US Retail Sales (MoM)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(2880 - 120),
      datetimeISO: new Date(offsetTimestamp(2880 - 120)).toISOString(),
      impact: 'HIGH',
      category: 'Consumer',
      agency: 'U.S. Census Bureau',
      frequency: 'Monthly',
      description: 'Measures total receipts at retail and food service stores across the United States.',
      whyTradersCare: 'Consumer spending accounts for approximately 68% of US GDP. Direct read on economic vitality.',
      bullishScenario: 'Sales > 0.6% verifies consumers retain purchasing power despite higher borrowing costs.',
      bearishScenario: 'Negative reading confirms depletion of excess savings and consumer pullback.',
      affectedAssets: [
        { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', volatility: 'HIGH' },
        { symbol: 'SPX', name: 'S&P 500 Index', volatility: 'HIGH' },
        { symbol: 'US10Y', name: '10Y Yield', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 0.3,
      previous: 0.4,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-urs-1', date: getHistoricalDateStr(now, 1), actual: 0.4, forecast: 0.3, previous: 0.1, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-urs-2', date: getHistoricalDateStr(now, 2), actual: 0.1, forecast: 0.2, previous: 1.0, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-urs-3', date: getHistoricalDateStr(now, 3), actual: 1.0, forecast: 0.4, previous: -0.2, surpriseDelta: 0.6, isBeat: true },
        { id: 'h-urs-4', date: getHistoricalDateStr(now, 4), actual: -0.2, forecast: 0.1, previous: 0.3, surpriseDelta: -0.3, isBeat: false },
        { id: 'h-urs-5', date: getHistoricalDateStr(now, 5), actual: 0.3, forecast: 0.2, previous: 0.0, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-urs-6', date: getHistoricalDateStr(now, 6), actual: 0.0, forecast: -0.1, previous: 0.6, surpriseDelta: 0.1, isBeat: true },
      ]
    },

    // ==========================================
    // 25. UPCOMING - EUROZONE HARMONIZED INDEX OF CONSUMER PRICES (HICP YoY)
    // ==========================================
    {
      id: 'evt-eu-hicp-inflation',
      title: 'Eurozone Core HICP (YoY)',
      currency: 'EUR',
      country: 'Eurozone',
      countryCode: 'eu',
      timestamp: offsetTimestamp(2880 + 120),
      datetimeISO: new Date(offsetTimestamp(2880 + 120)).toISOString(),
      impact: 'HIGH',
      category: 'Inflation',
      agency: 'Eurostat (European Commission)',
      frequency: 'Monthly',
      description: 'Harmonized measure of inflation for the euro area according to a methodology that has been standardized across member states.',
      whyTradersCare: 'Governs European Central Bank interest rate setting to hit the 2.0% medium-term target.',
      bullishScenario: 'Sticky print > 2.8% forces ECB to suspend deposit facility rate cuts.',
      bearishScenario: 'Sub-2.4% print clears runway for aggressive consecutive ECB rate reductions.',
      affectedAssets: [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', volatility: 'EXTREME' },
        { symbol: 'EUR/JPY', name: 'Euro / Yen', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 2.7,
      previous: 2.7,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-hicp-1', date: getHistoricalDateStr(now, 1), actual: 2.7, forecast: 2.7, previous: 2.8, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-hicp-2', date: getHistoricalDateStr(now, 2), actual: 2.8, forecast: 2.8, previous: 2.9, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-hicp-3', date: getHistoricalDateStr(now, 3), actual: 2.9, forecast: 2.9, previous: 2.9, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-hicp-4', date: getHistoricalDateStr(now, 4), actual: 2.9, forecast: 2.8, previous: 2.7, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-hicp-5', date: getHistoricalDateStr(now, 5), actual: 2.7, forecast: 2.7, previous: 2.6, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-hicp-6', date: getHistoricalDateStr(now, 6), actual: 2.6, forecast: 2.5, previous: 2.4, surpriseDelta: 0.1, isBeat: true },
      ]
    },

    // ==========================================
    // 26. UPCOMING - BANK OF ENGLAND (BoE) MPC INTEREST RATE VOTE
    // ==========================================
    {
      id: 'evt-boe-official-bank-rate',
      title: 'BoE Official Bank Rate & Monetary Policy Summary',
      currency: 'GBP',
      country: 'United Kingdom',
      countryCode: 'gb',
      timestamp: offsetTimestamp(2880 + 600),
      datetimeISO: new Date(offsetTimestamp(2880 + 600)).toISOString(),
      impact: 'HIGH',
      category: 'Central Bank',
      agency: 'Bank of England (Monetary Policy Committee)',
      frequency: '8 times per year',
      description: 'The benchmark interest rate at which commercial banks hold deposits with the Bank of England, accompanied by the 9-member MPC vote tally.',
      whyTradersCare: 'MPC vote split (e.g., 8-1 vs 5-4) reveals internal hawkish vs dovish dissent within the Committee.',
      bullishScenario: 'Surprise vote split skewing towards keeping rates elevated.',
      bearishScenario: 'Multiple members unexpectedly vote for 50bps cut.',
      affectedAssets: [
        { symbol: 'GBP/USD', name: 'Cable', volatility: 'EXTREME' },
        { symbol: 'EUR/GBP', name: 'Euro / Pound', volatility: 'HIGH' },
        { symbol: 'GILT 10Y', name: 'UK 10Y Gilt', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 4.75,
      previous: 5.00,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-boe-1', date: getHistoricalDateStr(now, 2), actual: 5.00, forecast: 5.00, previous: 5.25, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-boe-2', date: getHistoricalDateStr(now, 4), actual: 5.25, forecast: 5.25, previous: 5.25, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-boe-3', date: getHistoricalDateStr(now, 5), actual: 5.25, forecast: 5.25, previous: 5.25, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-boe-4', date: getHistoricalDateStr(now, 7), actual: 5.25, forecast: 5.25, previous: 5.25, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-boe-5', date: getHistoricalDateStr(now, 9), actual: 5.25, forecast: 5.25, previous: 5.00, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-boe-6', date: getHistoricalDateStr(now, 11), actual: 5.00, forecast: 5.00, previous: 4.75, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 27. UPCOMING - US CORE PCE PRICE INDEX (Fed's Preferred Gauge)
    // ==========================================
    {
      id: 'evt-us-core-pce-price-index',
      title: 'US Core PCE Price Index (MoM)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(2880 + 780),
      datetimeISO: new Date(offsetTimestamp(2880 + 780)).toISOString(),
      impact: 'HIGH',
      category: 'Inflation',
      agency: 'U.S. Bureau of Economic Analysis (BEA)',
      frequency: 'Monthly',
      description: 'The personal consumption expenditures price index excluding food and energy. Officially designated by the Fed as their primary inflation benchmark.',
      whyTradersCare: 'More comprehensive than CPI because it accounts for consumer substitution effects across goods categories.',
      bullishScenario: 'Print >= 0.3% signals underlying inflation plateau above the 2.0% annual target.',
      bearishScenario: 'Print <= 0.1% confirms smooth glidepath to price stability.',
      affectedAssets: [
        { symbol: 'US10Y', name: 'US 10Y Yield', volatility: 'EXTREME' },
        { symbol: 'XAU/USD', name: 'Gold', volatility: 'EXTREME' },
        { symbol: 'EUR/USD', name: 'EUR/USD', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 0.3,
      previous: 0.2,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-pce-1', date: getHistoricalDateStr(now, 1), actual: 0.2, forecast: 0.2, previous: 0.2, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-pce-2', date: getHistoricalDateStr(now, 2), actual: 0.2, forecast: 0.2, previous: 0.3, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-pce-3', date: getHistoricalDateStr(now, 3), actual: 0.3, forecast: 0.3, previous: 0.1, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-pce-4', date: getHistoricalDateStr(now, 4), actual: 0.1, forecast: 0.2, previous: 0.3, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-pce-5', date: getHistoricalDateStr(now, 5), actual: 0.3, forecast: 0.2, previous: 0.2, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-pce-6', date: getHistoricalDateStr(now, 6), actual: 0.2, forecast: 0.2, previous: 0.2, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 28. UPCOMING - JAPAN NATIONAL CPI (YoY)
    // ==========================================
    {
      id: 'evt-jp-national-cpi',
      title: 'Japan National Core CPI (YoY)',
      currency: 'JPY',
      country: 'Japan',
      countryCode: 'jp',
      timestamp: offsetTimestamp(2880 + 1100),
      datetimeISO: new Date(offsetTimestamp(2880 + 1100)).toISOString(),
      impact: 'HIGH',
      category: 'Inflation',
      agency: 'Statistics Bureau of Japan',
      frequency: 'Monthly',
      description: 'Headline consumer price index for Japan excluding fresh food.',
      whyTradersCare: 'Crucial determinant of whether Bank of Japan (BoJ) Governor Ueda will implement additional rate hikes.',
      bullishScenario: 'CPI remaining above 2.5% forces BoJ to accelerate policy rate normalization.',
      bearishScenario: 'Deceleration below 2.0% dampens rate hike prospects, weakening JPY.',
      affectedAssets: [
        { symbol: 'USD/JPY', name: 'US Dollar / Yen', volatility: 'EXTREME' },
        { symbol: 'EUR/JPY', name: 'Euro / Yen', volatility: 'HIGH' }
      ],
      actual: null,
      forecast: 2.5,
      previous: 2.4,
      unit: '%',
      betterDirection: 'higher',
      history: [
        { id: 'h-jcpi-1', date: getHistoricalDateStr(now, 1), actual: 2.4, forecast: 2.4, previous: 2.5, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-jcpi-2', date: getHistoricalDateStr(now, 2), actual: 2.5, forecast: 2.6, previous: 2.8, surpriseDelta: -0.1, isBeat: false },
        { id: 'h-jcpi-3', date: getHistoricalDateStr(now, 3), actual: 2.8, forecast: 2.7, previous: 2.5, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-jcpi-4', date: getHistoricalDateStr(now, 4), actual: 2.5, forecast: 2.5, previous: 2.2, surpriseDelta: 0.0, isBeat: false },
        { id: 'h-jcpi-5', date: getHistoricalDateStr(now, 5), actual: 2.2, forecast: 2.1, previous: 2.4, surpriseDelta: 0.1, isBeat: true },
        { id: 'h-jcpi-6', date: getHistoricalDateStr(now, 6), actual: 2.4, forecast: 2.4, previous: 2.6, surpriseDelta: 0.0, isBeat: false },
      ]
    },

    // ==========================================
    // 29. RECENTLY RELEASED EARLIER - US BUILDING PERMITS
    // ==========================================
    {
      id: 'evt-us-building-permits',
      title: 'US Building Permits',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(-210), // 3.5 hours ago
      datetimeISO: new Date(offsetTimestamp(-210)).toISOString(),
      impact: 'LOW',
      category: 'Housing',
      agency: 'U.S. Census Bureau',
      frequency: 'Monthly',
      description: 'Number of new residential building permits issued across the United States.',
      whyTradersCare: 'Forward-looking indicator of construction sector health and mortgage demand sensitivity.',
      bullishScenario: 'Steady permit activity indicates resilient home builder confidence.',
      bearishScenario: 'Permit collapse signals freeze in residential construction and lumber demand.',
      affectedAssets: [
        { symbol: 'XHB', name: 'Homebuilders ETF', volatility: 'MODERATE' },
        { symbol: 'USD/CAD', name: 'USD/CAD', volatility: 'MODERATE' }
      ],
      actual: 1.43,
      forecast: 1.45,
      previous: 1.47,
      unit: 'M',
      betterDirection: 'higher',
      history: [
        { id: 'h-bp-1', date: getHistoricalDateStr(now, 1), actual: 1.43, forecast: 1.45, previous: 1.47, surpriseDelta: -0.02, isBeat: false },
        { id: 'h-bp-2', date: getHistoricalDateStr(now, 2), actual: 1.47, forecast: 1.46, previous: 1.44, surpriseDelta: 0.01, isBeat: true },
        { id: 'h-bp-3', date: getHistoricalDateStr(now, 3), actual: 1.44, forecast: 1.45, previous: 1.43, surpriseDelta: -0.01, isBeat: false },
        { id: 'h-bp-4', date: getHistoricalDateStr(now, 4), actual: 1.43, forecast: 1.42, previous: 1.46, surpriseDelta: 0.01, isBeat: true },
        { id: 'h-bp-5', date: getHistoricalDateStr(now, 5), actual: 1.46, forecast: 1.47, previous: 1.48, surpriseDelta: -0.01, isBeat: false },
        { id: 'h-bp-6', date: getHistoricalDateStr(now, 6), actual: 1.48, forecast: 1.45, previous: 1.44, surpriseDelta: 0.03, isBeat: true },
      ]
    },

    // ==========================================
    // 30. UPCOMING - MICHIGAN CONSUMER SENTIMENT PRELIMINARY
    // ==========================================
    {
      id: 'evt-us-uom-sentiment',
      title: 'UoM Consumer Sentiment (Prelim)',
      currency: 'USD',
      country: 'United States',
      countryCode: 'us',
      timestamp: offsetTimestamp(2880 + 480),
      datetimeISO: new Date(offsetTimestamp(2880 + 480)).toISOString(),
      impact: 'MEDIUM',
      category: 'Consumer',
      agency: 'University of Michigan Surveys of Consumers',
      frequency: 'Monthly (Preliminary)',
      description: 'Index based on telephone survey of 500 households assessing economic climate and personal finances, including the crucial 1-year and 5-year inflation expectations.',
      whyTradersCare: 'Fed closely monitors UoM 5-year inflation expectations to ensure long-term public expectations remain well-anchored.',
      bullishScenario: 'Higher headline confidence coupled with anchored inflation expectations.',
      bearishScenario: 'Drop in consumer sentiment combined with jump in inflation expectations (stagflationary).',
      affectedAssets: [
        { symbol: 'SPX', name: 'S&P 500 Index', volatility: 'HIGH' },
        { symbol: 'USD/JPY', name: 'US Dollar / Yen', volatility: 'MODERATE' }
      ],
      actual: null,
      forecast: 71.0,
      previous: 70.5,
      unit: 'pts',
      betterDirection: 'higher',
      history: [
        { id: 'h-uom-1', date: getHistoricalDateStr(now, 1), actual: 70.5, forecast: 69.0, previous: 67.9, surpriseDelta: 1.5, isBeat: true },
        { id: 'h-uom-2', date: getHistoricalDateStr(now, 2), actual: 67.9, forecast: 68.2, previous: 66.4, surpriseDelta: -0.3, isBeat: false },
        { id: 'h-uom-3', date: getHistoricalDateStr(now, 3), actual: 66.4, forecast: 67.5, previous: 69.1, surpriseDelta: -1.1, isBeat: false },
        { id: 'h-uom-4', date: getHistoricalDateStr(now, 4), actual: 69.1, forecast: 68.0, previous: 67.4, surpriseDelta: 1.1, isBeat: true },
        { id: 'h-uom-5', date: getHistoricalDateStr(now, 5), actual: 67.4, forecast: 67.0, previous: 65.6, surpriseDelta: 0.4, isBeat: true },
        { id: 'h-uom-6', date: getHistoricalDateStr(now, 6), actual: 65.6, forecast: 66.5, previous: 63.8, surpriseDelta: -0.9, isBeat: false },
      ]
    }
  ];

  // Sort events chronologically
  return events.sort((a, b) => a.timestamp - b.timestamp);
}

import { normalizeFFEvents, RawFFEvent } from './ffLiveAdapter';
import { 
  getCachedFeed, 
  saveCachedFeed, 
  applyActualOverrides, 
  checkManualSyncCooldown, 
  recordManualSyncTimestamp,
  saveActualOverride,
  removeActualOverride,
  getActualOverrides,
  CACHE_TTL_MS
} from './ffCache';
import { FeedMode, FeedTelemetry } from '../types/calendar';

/**
 * Service adapter interface
 */
export interface CalendarServiceAdapter {
  fetchCalendar(options?: { forceSync?: boolean }): Promise<MacroEvent[]>;
}

/**
 * Local Dynamic Mock Adapter
 */
export class MockCalendarAdapter implements CalendarServiceAdapter {
  async fetchCalendar(): Promise<MacroEvent[]> {
    // Simulate slight network latency
    await new Promise((resolve) => setTimeout(resolve, 100));
    const events = generateDynamicMockCalendar();
    return applyActualOverrides(events);
  }
}

/**
 * Live ForexFactory API Adapter with 15-minute intelligent caching,
 * 60-second manual sync cooldown guard, and graceful fallback.
 */
export class LiveCalendarAdapter implements CalendarServiceAdapter {
  private endpointUrl: string;
  private fallbackDirectUrl: string;

  constructor(
    endpointUrl = '/api/ff-calendar',
    fallbackDirectUrl = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json'
  ) {
    this.endpointUrl = endpointUrl;
    this.fallbackDirectUrl = fallbackDirectUrl;
  }

  async fetchCalendar(options: { forceSync?: boolean } = {}): Promise<MacroEvent[]> {
    const result = await this.fetchWithTelemetry(options);
    return result.events;
  }

  async fetchWithTelemetry(options: { forceSync?: boolean } = {}): Promise<{
    events: MacroEvent[];
    telemetry: FeedTelemetry;
  }> {
    const forceSync = !!options.forceSync;
    const cached = getCachedFeed();

    // 1. Serve immediately from cache if valid and not forcing sync
    if (!forceSync && cached && !cached.isStale && cached.events.length > 0) {
      const eventsWithOverrides = applyActualOverrides(cached.events);
      return {
        events: eventsWithOverrides,
        telemetry: {
          mode: 'live',
          source: 'cache',
          lastUpdated: cached.fetchedAt,
          isStale: false,
          itemCount: eventsWithOverrides.length,
        },
      };
    }

    // 2. If force syncing, check 60s cooldown
    if (forceSync) {
      const cooldown = checkManualSyncCooldown();
      if (!cooldown.allowed) {
        // Cooldown active: cannot hit upstream yet; return cache if available
        if (cached && cached.events.length > 0) {
          const eventsWithOverrides = applyActualOverrides(cached.events);
          return {
            events: eventsWithOverrides,
            telemetry: {
              mode: 'live',
              source: 'cache',
              lastUpdated: cached.fetchedAt,
              isStale: cached.isStale,
              error: `Sync cooldown active (${cooldown.remainingSec}s remaining). Serving cached data.`,
              itemCount: eventsWithOverrides.length,
            },
          };
        }
      }
    }

    // 3. Attempt upstream network fetch
    try {
      // 3A. If running inside standalone Desktop Electron environment, use native direct bridge
      if (typeof window !== 'undefined' && window.electronAPI?.fetchCalendarDirect) {
        try {
          const directRes = await window.electronAPI.fetchCalendarDirect();
          if (directRes.success && Array.isArray(directRes.data)) {
            const normalizedEvents = normalizeFFEvents(directRes.data as RawFFEvent[]);
            if (normalizedEvents.length > 0) {
              saveCachedFeed(normalizedEvents);
              if (forceSync) {
                recordManualSyncTimestamp();
              }
              const finalEvents = applyActualOverrides(normalizedEvents);
              return {
                events: finalEvents,
                telemetry: {
                  mode: 'live',
                  source: 'network',
                  lastUpdated: Date.now(),
                  isStale: false,
                  itemCount: finalEvents.length,
                },
              };
            }
          }
        } catch (desktopErr) {
          console.warn('[MacroRadar Desktop] Native IPC fetch error, falling back to web proxy:', desktopErr);
        }
      }

      // 3B. Web browser environment: fetch via Vite proxy or fallback
      let response: Response | null = null;
      let fetchError: Error | null = null;

      // Resolve relative URL safely across browser and node/test environments
      const targetUrl = this.endpointUrl.startsWith('http')
        ? this.endpointUrl
        : (typeof window !== 'undefined' && window.location?.origin)
          ? `${window.location.origin}${this.endpointUrl}`
          : this.fallbackDirectUrl;

      try {
        response = await fetch(targetUrl, {
          headers: { 'Accept': 'application/json' },
        });
      } catch (err) {
        fetchError = err as Error;
      }

      // If proxy route failed (e.g. non-200 or network error in direct test), try fallback url
      if (!response || !response.ok) {
        try {
          const fallbackRes = await fetch(this.fallbackDirectUrl, {
            headers: { 'Accept': 'application/json' },
          });
          if (fallbackRes.ok) {
            response = fallbackRes;
            fetchError = null;
          }
        } catch {
          // Keep original error
        }
      }

      if (!response || !response.ok) {
        const status = response ? response.status : 0;
        throw new Error(fetchError?.message || `ForexFactory feed returned HTTP ${status}`);
      }

      const rawJson = await response.json();
      if (!Array.isArray(rawJson)) {
        throw new Error('ForexFactory payload is not an array');
      }

      // 4. Normalize raw feed into MacroEvents
      const normalizedEvents = normalizeFFEvents(rawJson as RawFFEvent[]);
      if (normalizedEvents.length === 0) {
        throw new Error('Normalized 0 valid events from ForexFactory');
      }

      // 5. Persist to cache and update manual sync cooldown
      saveCachedFeed(normalizedEvents);
      if (forceSync) {
        recordManualSyncTimestamp();
      }

      // 6. Apply any persistent user Actual overrides
      const finalEvents = applyActualOverrides(normalizedEvents);

      return {
        events: finalEvents,
        telemetry: {
          mode: 'live',
          source: 'network',
          lastUpdated: Date.now(),
          isStale: false,
          itemCount: finalEvents.length,
        },
      };

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn('[MacroRadar Feed] Network fetch failed:', errorMessage);

      // Graceful fallback 1: Use cached data if available (even if expired/stale)
      if (cached && cached.events.length > 0) {
        const eventsWithOverrides = applyActualOverrides(cached.events);
        return {
          events: eventsWithOverrides,
          telemetry: {
            mode: 'live',
            source: 'cache',
            lastUpdated: cached.fetchedAt,
            isStale: true,
            error: `Live feed unavailable (${errorMessage}). Displaying CACHE FALLBACK.`,
            itemCount: eventsWithOverrides.length,
          },
        };
      }

      // Graceful fallback 2: Fall back to dynamic Mock Data Engine
      const mockEvents = applyActualOverrides(generateDynamicMockCalendar());
      return {
        events: mockEvents,
        telemetry: {
          mode: 'simulation',
          source: 'fallback_mock',
          lastUpdated: Date.now(),
          isStale: true,
          error: `Live feed failed (${errorMessage}) and no cache found. Serving SIMULATION MODE.`,
          itemCount: mockEvents.length,
        },
      };
    }
  }
}

// Singleton instances
const mockAdapter = new MockCalendarAdapter();
const liveAdapter = new LiveCalendarAdapter();

/**
 * High-level fetch function supporting 'live' and 'simulation' modes.
 * Backward compatible with existing signature fetchMacroCalendar().
 */
export async function fetchMacroCalendar(
  mode: FeedMode = 'live',
  options: { forceSync?: boolean } = {}
): Promise<MacroEvent[]> {
  if (mode === 'simulation') {
    return mockAdapter.fetchCalendar();
  }
  return liveAdapter.fetchCalendar(options);
}

/**
 * Fetch macro calendar with complete operational telemetry for HUD and status banners.
 */
export async function fetchMacroCalendarWithTelemetry(
  mode: FeedMode = 'live',
  options: { forceSync?: boolean } = {}
): Promise<{ events: MacroEvent[]; telemetry: FeedTelemetry }> {
  if (mode === 'simulation') {
    const events = await mockAdapter.fetchCalendar();
    return {
      events,
      telemetry: {
        mode: 'simulation',
        source: 'network',
        lastUpdated: Date.now(),
        isStale: false,
        itemCount: events.length,
      },
    };
  }

  return liveAdapter.fetchWithTelemetry(options);
}

// Re-export cache and override utilities for convenient UI access
export {
  saveActualOverride,
  removeActualOverride,
  getActualOverrides,
  checkManualSyncCooldown,
  CACHE_TTL_MS
};

