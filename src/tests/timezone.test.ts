import { describe, it, expect } from 'vitest';
import { 
  getLiveClockString, 
  formatEventTime, 
  formatEventDate, 
  getMinuteOfDay, 
  getRelativeTimeBadge, 
  formatCountdown, 
  isSameDayInTimezone 
} from '../utils/timezone';

describe('timezone utility', () => {
  const fixedDate = new Date('2026-11-09T18:30:00Z');
  const fixedMs = fixedDate.getTime();

  it('generates valid HH:MM:SS clock strings for NY and EAT', () => {
    const nyClock = getLiveClockString('America/New_York', fixedDate);
    const eatClock = getLiveClockString('Africa/Addis_Ababa', fixedDate);

    expect(nyClock).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(eatClock).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('formats event time in active timezone mode (NY and EAT)', () => {
    const timeNY = formatEventTime(fixedMs, 'NY');
    const timeEAT = formatEventTime(fixedMs, 'EAT');

    expect(timeNY).toMatch(/^\d{2}:\d{2}$/);
    expect(timeEAT).toMatch(/^\d{2}:\d{2}$/);
    // EAT is 7 hours ahead of NY (UTC+3 vs UTC-4)
    expect(timeNY).not.toBe(timeEAT);
  });

  it('formats event date with weekday and month', () => {
    const dateNY = formatEventDate(fixedMs, 'NY');
    expect(dateNY).toContain('Nov');
  });

  it('calculates minute of the day accurately (0 to 1439)', () => {
    const minNY = getMinuteOfDay(fixedMs, 'NY');
    const minEAT = getMinuteOfDay(fixedMs, 'EAT');

    expect(minNY).toBeGreaterThanOrEqual(0);
    expect(minNY).toBeLessThan(1440);
    expect(minEAT).toBeGreaterThanOrEqual(0);
    expect(minEAT).toBeLessThan(1440);
  });

  it('calculates imminent status within 15 minutes', () => {
    const now = Date.now();
    const imminentTs = now + 12 * 60 * 1000; // in 12m
    const notImminentTs = now + 45 * 60 * 1000; // in 45m
    const pastTs = now - 30 * 60 * 1000; // 30m ago

    const imminentBadge = getRelativeTimeBadge(imminentTs, now);
    expect(imminentBadge.isImminent).toBe(true);
    expect(imminentBadge.isUpcoming).toBe(true);
    expect(imminentBadge.text).toBe('in 12m');

    const notImminentBadge = getRelativeTimeBadge(notImminentTs, now);
    expect(notImminentBadge.isImminent).toBe(false);
    expect(notImminentBadge.text).toBe('in 45m');

    const pastBadge = getRelativeTimeBadge(pastTs, now);
    expect(pastBadge.isUpcoming).toBe(false);
    expect(pastBadge.text).toBe('30m ago');
  });

  it('formats remaining countdown string HH:MM:SS', () => {
    const target = fixedMs + 3600 * 1000 + 14 * 60 * 1000 + 22 * 1000; // +1h 14m 22s
    const countdown = formatCountdown(target, fixedMs);
    expect(countdown).toBe('01h 14m 22s');
  });

  it('correctly determines same calendar day in timezone', () => {
    const ts1 = fixedMs;
    const ts2 = fixedMs + 30 * 60 * 1000; // 30 mins later
    const ts3 = fixedMs + 36 * 3600 * 1000; // 36 hours later

    expect(isSameDayInTimezone(ts1, ts2, 'NY')).toBe(true);
    expect(isSameDayInTimezone(ts1, ts3, 'NY')).toBe(false);
  });
});
