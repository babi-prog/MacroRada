import { describe, it, expect } from 'vitest';
import { 
  normalizeFFEvents, 
  parseNumericValue, 
  classifyCategory, 
  determinePolarity, 
  normalizeImpact,
  RawFFEvent 
} from '../services/ffLiveAdapter';

describe('ffLiveAdapter', () => {
  describe('parseNumericValue', () => {
    it('parses percentage values correctly', () => {
      expect(parseNumericValue('0.2%')).toEqual({ value: 0.2, unit: '%' });
      expect(parseNumericValue('-1.5%')).toEqual({ value: -1.5, unit: '%' });
      expect(parseNumericValue('+5.50%')).toEqual({ value: 5.5, unit: '%' });
    });

    it('parses thousands (K) and billions (B) correctly', () => {
      expect(parseNumericValue('224K')).toEqual({ value: 224, unit: 'K' });
      expect(parseNumericValue('-15K')).toEqual({ value: -15, unit: 'K' });
      expect(parseNumericValue('19.2B')).toEqual({ value: 19.2, unit: 'B' });
      expect(parseNumericValue('-1.5B')).toEqual({ value: -1.5, unit: 'B' });
    });

    it('parses basis points and index values', () => {
      expect(parseNumericValue('25bps')).toEqual({ value: 25, unit: 'bps' });
      expect(parseNumericValue('52.4 Index')).toEqual({ value: 52.4, unit: 'Index' });
    });

    it('handles empty and null values gracefully', () => {
      expect(parseNumericValue('')).toEqual({ value: null, unit: '' });
      expect(parseNumericValue(null)).toEqual({ value: null, unit: '' });
      expect(parseNumericValue('--')).toEqual({ value: null, unit: '' });
    });

    it('strips comparison prefix like < or >', () => {
      expect(parseNumericValue('<0.1%')).toEqual({ value: 0.1, unit: '%' });
      expect(parseNumericValue('>1.5%')).toEqual({ value: 1.5, unit: '%' });
    });
  });

  describe('normalizeImpact', () => {
    it('maps impact correctly', () => {
      expect(normalizeImpact('High')).toBe('HIGH');
      expect(normalizeImpact('Medium')).toBe('MEDIUM');
      expect(normalizeImpact('Low')).toBe('LOW');
      expect(normalizeImpact('Holiday')).toBe('LOW');
      expect(normalizeImpact('')).toBe('LOW');
    });
  });

  describe('classifyCategory', () => {
    it('classifies major economic categories accurately', () => {
      expect(classifyCategory('Core CPI m/m')).toBe('Inflation');
      expect(classifyCategory('PPI y/y')).toBe('Inflation');
      expect(classifyCategory('Non-Farm Employment Change')).toBe('Employment');
      expect(classifyCategory('Unemployment Rate')).toBe('Employment');
      expect(classifyCategory('FOMC Statement & Rate Decision')).toBe('Central Bank');
      expect(classifyCategory('BOE Gov Bailey Speaks')).toBe('Central Bank');
      expect(classifyCategory('GDP q/q')).toBe('Growth');
      expect(classifyCategory('Retail Sales m/m')).toBe('Consumer');
      expect(classifyCategory('ISM Manufacturing PMI')).toBe('Manufacturing');
      expect(classifyCategory('Building Permits')).toBe('Housing');
      expect(classifyCategory('Trade Balance')).toBe('Trade');
    });
  });

  describe('determinePolarity', () => {
    it('sets INVERTED ("lower") for unemployment and claims', () => {
      expect(determinePolarity('Unemployment Rate')).toBe('lower');
      expect(determinePolarity('Initial Jobless Claims')).toBe('lower');
      expect(determinePolarity('Claimant Count Change')).toBe('lower');
    });

    it('sets NEUTRAL ("neutral") for speeches and meetings', () => {
      expect(determinePolarity('BOE Gov Bailey Speaks')).toBe('neutral');
      expect(determinePolarity('FOMC Meeting Minutes')).toBe('neutral');
    });

    it('sets NORMAL ("higher") for economic beats', () => {
      expect(determinePolarity('CPI m/m')).toBe('higher');
      expect(determinePolarity('GDP q/q')).toBe('higher');
      expect(determinePolarity('Non-Farm Employment Change')).toBe('higher');
      expect(determinePolarity('Retail Sales m/m')).toBe('higher');
    });
  });

  describe('normalizeFFEvents', () => {
    const rawSample: RawFFEvent[] = [
      {
        title: 'Core CPI m/m',
        country: 'USD',
        date: '2026-11-11T08:30:00-05:00',
        impact: 'High',
        forecast: '0.3%',
        previous: '0.2%',
        actual: '0.4%',
      },
      {
        title: 'Unemployment Rate',
        country: 'USD',
        date: '2026-11-12T08:30:00-05:00',
        impact: 'High',
        forecast: '4.1%',
        previous: '4.0%',
        actual: '',
      },
      {
        title: 'German Trade Balance',
        country: 'EUR',
        date: '2026-11-09T02:00:00-05:00',
        impact: 'Low',
        forecast: '19.2B',
        previous: '19.5B',
        actual: '',
      },
      {
        title: 'Minor Currency Holiday',
        country: 'CNY', // Unsupported currency
        date: '2026-11-10T00:00:00-05:00',
        impact: 'Low',
        forecast: '',
        previous: '',
      },
    ];

    it('filters out unsupported currencies', () => {
      const normalized = normalizeFFEvents(rawSample);
      expect(normalized.length).toBe(3);
      expect(normalized.some(e => e.currency === 'CNY')).toBe(false);
    });

    it('maps country and currency codes with rich metadata', () => {
      const normalized = normalizeFFEvents(rawSample);
      const usdEvent = normalized.find(e => e.title === 'Core CPI m/m');
      expect(usdEvent).toBeDefined();
      expect(usdEvent?.currency).toBe('USD');
      expect(usdEvent?.country).toBe('United States');
      expect(usdEvent?.countryCode).toBe('us');
      expect(usdEvent?.impact).toBe('HIGH');
      expect(usdEvent?.actual).toBe(0.4);
      expect(usdEvent?.forecast).toBe(0.3);
      expect(usdEvent?.previous).toBe(0.2);
      expect(usdEvent?.unit).toBe('%');
      expect(usdEvent?.category).toBe('Inflation');
      expect(usdEvent?.betterDirection).toBe('higher');
      expect(usdEvent?.history.length).toBe(6);
      expect(usdEvent?.affectedAssets.length).toBeGreaterThan(0);
    });

    it('correctly sets inverted polarity for unemployment', () => {
      const normalized = normalizeFFEvents(rawSample);
      const unemp = normalized.find(e => e.title === 'Unemployment Rate');
      expect(unemp).toBeDefined();
      expect(unemp?.betterDirection).toBe('lower');
      expect(unemp?.actual).toBeNull();
      expect(unemp?.forecast).toBe(4.1);
      expect(unemp?.previous).toBe(4.0);
    });

    it('sorts events chronologically', () => {
      const normalized = normalizeFFEvents(rawSample);
      for (let i = 0; i < normalized.length - 1; i++) {
        expect(normalized[i].timestamp).toBeLessThanOrEqual(normalized[i + 1].timestamp);
      }
    });
  });
});
