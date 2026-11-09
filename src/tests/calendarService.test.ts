import { describe, it, expect } from 'vitest';
import { 
  generateDynamicMockCalendar, 
  fetchMacroCalendar, 
  MockCalendarAdapter 
} from '../services/calendarService';

describe('calendarService', () => {
  it('generates dynamic mock calendar with ~30 rich events', () => {
    const events = generateDynamicMockCalendar();
    expect(events.length).toBeGreaterThanOrEqual(25);
  });

  it('contains an imminent HIGH impact event anchored ~14 mins in the future', () => {
    const events = generateDynamicMockCalendar();
    const now = Date.now();

    const imminent = events.find(e => 
      e.impact === 'HIGH' && 
      e.timestamp > now && 
      e.timestamp - now <= 20 * 60 * 1000
    );

    expect(imminent).toBeDefined();
    expect(imminent?.currency).toBe('USD');
    expect(imminent?.category).toBe('Inflation');
  });

  it('contains past events with populated actual figures for deviation meter verification', () => {
    const events = generateDynamicMockCalendar();
    const released = events.filter(e => e.actual !== null && e.forecast !== null);
    
    expect(released.length).toBeGreaterThanOrEqual(4);
    const ukGdp = released.find(e => e.id === 'evt-uk-gdp-mom');
    expect(ukGdp).toBeDefined();
    expect(ukGdp?.actual).toBe(0.4);
    expect(ukGdp?.forecast).toBe(0.1);
  });

  it('contains full historical release series and asset volatility matrices', () => {
    const events = generateDynamicMockCalendar();
    const cpiEvent = events.find(e => e.id === 'evt-cpi-yoy-primary');

    expect(cpiEvent).toBeDefined();
    expect(cpiEvent?.history.length).toBe(6);
    expect(cpiEvent?.affectedAssets.length).toBeGreaterThanOrEqual(3);
    expect(cpiEvent?.bullishScenario).toBeTruthy();
    expect(cpiEvent?.bearishScenario).toBeTruthy();
  });

  it('fetches calendar asynchronously through adapter', async () => {
    const data = await fetchMacroCalendar();
    expect(data.length).toBeGreaterThanOrEqual(25);
  });
});
