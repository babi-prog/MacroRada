import { describe, it, expect } from 'vitest';
import { 
  computeSurprise, 
  formatValue, 
  getCurrencyMeta, 
  getImpactMeta, 
  getCategoryBadge 
} from '../utils/formatters';

describe('formatters utility', () => {
  describe('formatValue', () => {
    it('formats percentages with sign', () => {
      expect(formatValue(3.1, '%')).toBe('+3.1%');
      expect(formatValue(-0.5, '%')).toBe('-0.5%');
    });

    it('formats thousands (K)', () => {
      expect(formatValue(223, 'K')).toBe('223K');
    });

    it('formats billions (B)', () => {
      expect(formatValue(2.1, 'B')).toBe('$2.1B');
    });

    it('formats index or pts', () => {
      expect(formatValue(46.5, 'Index')).toBe('46.5');
    });

    it('handles null / undefined values gracefully', () => {
      expect(formatValue(null, '%')).toBe('--');
      expect(formatValue(undefined, 'K')).toBe('--');
    });
  });

  describe('computeSurprise', () => {
    it('correctly calculates a beat when higher is better (e.g. GDP, Retail Sales)', () => {
      const result = computeSurprise(0.4, 0.1, 'higher', '%');
      expect(result).not.toBeNull();
      expect(result?.isBeat).toBe(true);
      expect(result?.isMiss).toBe(false);
      expect(result?.delta).toBe(0.3);
      expect(result?.badgeLabel).toBe('+0.3% BEAT');
      expect(result?.direction).toBe('beat');
    });

    it('correctly calculates a miss when higher is better and actual is below forecast', () => {
      const result = computeSurprise(18.2, 22.5, 'higher', 'Index');
      expect(result).not.toBeNull();
      expect(result?.isBeat).toBe(false);
      expect(result?.isMiss).toBe(true);
      expect(result?.delta).toBe(-4.3);
      expect(result?.badgeLabel).toBe('-4.3 MISS');
      expect(result?.direction).toBe('miss');
    });

    it('correctly calculates a beat when lower is better (e.g. Unemployment Rate, Jobless Claims)', () => {
      // 12.4K actual vs 28.0K forecast -> lower claims is a beat!
      const result = computeSurprise(12.4, 28.0, 'lower', 'K');
      expect(result).not.toBeNull();
      expect(result?.isBeat).toBe(true);
      expect(result?.isMiss).toBe(false);
      expect(result?.badgeLabel).toBe('-15.6K BEAT');
      expect(result?.direction).toBe('beat');
    });

    it('correctly handles in-line consensus prints', () => {
      const result = computeSurprise(4.35, 4.35, 'higher', '%');
      expect(result).not.toBeNull();
      expect(result?.isInLine).toBe(true);
      expect(result?.badgeLabel).toBe('IN-LINE');
      expect(result?.direction).toBe('inline');
    });

    it('returns null if actual or forecast is null', () => {
      expect(computeSurprise(null, 3.1, 'higher', '%')).toBeNull();
      expect(computeSurprise(3.1, null, 'higher', '%')).toBeNull();
    });
  });

  describe('getCurrencyMeta', () => {
    it('returns correct country flag and details for G10 currencies', () => {
      expect(getCurrencyMeta('USD').flag).toBe('🇺🇸');
      expect(getCurrencyMeta('EUR').flag).toBe('🇪🇺');
      expect(getCurrencyMeta('GBP').flag).toBe('🇬🇧');
      expect(getCurrencyMeta('JPY').flag).toBe('🇯🇵');
      expect(getCurrencyMeta('CAD').flag).toBe('🇨🇦');
      expect(getCurrencyMeta('AUD').flag).toBe('🇦🇺');
      expect(getCurrencyMeta('CHF').flag).toBe('🇨🇭');
      expect(getCurrencyMeta('NZD').flag).toBe('🇳🇿');
    });
  });

  describe('getImpactMeta', () => {
    it('returns distinct styles for HIGH, MEDIUM, and LOW impact', () => {
      expect(getImpactMeta('HIGH').label).toBe('HIGH');
      expect(getImpactMeta('MEDIUM').label).toBe('MED');
      expect(getImpactMeta('LOW').label).toBe('LOW');
    });
  });

  describe('getCategoryBadge', () => {
    it('returns styling for categories', () => {
      expect(getCategoryBadge('Inflation').label).toBe('Inflation');
      expect(getCategoryBadge('Central Bank').label).toBe('Central Bank');
      expect(getCategoryBadge('Employment').label).toBe('Employment');
    });
  });
});
