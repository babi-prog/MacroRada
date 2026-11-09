import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getCachedFeed, 
  saveCachedFeed, 
  clearCachedFeed, 
  checkManualSyncCooldown, 
  recordManualSyncTimestamp,
  saveActualOverride,
  removeActualOverride,
  getActualOverrides,
  applyActualOverrides,
  CACHE_TTL_MS
} from '../services/ffCache';
import { MacroEvent } from '../types/calendar';

describe('ffCache & Overrides Layer', () => {
  beforeEach(() => {
    clearCachedFeed();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  const dummyEvent: MacroEvent = {
    id: 'evt-test-1',
    title: 'Test Indicator',
    currency: 'USD',
    country: 'United States',
    countryCode: 'us',
    timestamp: Date.now(),
    datetimeISO: new Date().toISOString(),
    impact: 'HIGH',
    category: 'Inflation',
    agency: 'BLS',
    frequency: 'Monthly',
    description: 'Test description',
    whyTradersCare: 'Test importance',
    bullishScenario: 'Bullish scenario',
    bearishScenario: 'Bearish scenario',
    affectedAssets: [],
    actual: null,
    forecast: 2.5,
    previous: 2.3,
    unit: '%',
    betterDirection: 'higher',
    history: [],
    isSimulated: false,
  };

  it('saves and retrieves cached feed within 15-minute TTL', () => {
    saveCachedFeed([dummyEvent]);
    const cached = getCachedFeed();
    expect(cached).not.toBeNull();
    expect(cached?.events.length).toBe(1);
    expect(cached?.events[0].title).toBe('Test Indicator');
    expect(cached?.isStale).toBe(false);
  });

  it('enforces 60-second cooldown on manual syncs', () => {
    expect(checkManualSyncCooldown().allowed).toBe(true);
    recordManualSyncTimestamp();
    const cooldown = checkManualSyncCooldown();
    expect(cooldown.allowed).toBe(false);
    expect(cooldown.remainingSec).toBeGreaterThan(0);
    expect(cooldown.remainingSec).toBeLessThanOrEqual(60);
  });

  it('saves, applies, and removes user Actual overrides', () => {
    saveActualOverride('evt-test-1', 3.0, '%');
    const overrides = getActualOverrides();
    expect(overrides['evt-test-1']?.actual).toBe(3.0);

    const updated = applyActualOverrides([dummyEvent]);
    expect(updated[0].actual).toBe(3.0);

    removeActualOverride('evt-test-1');
    const cleared = applyActualOverrides([dummyEvent]);
    expect(cleared[0].actual).toBeNull();
  });
});
