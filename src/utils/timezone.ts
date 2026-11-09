import { TimezoneMode } from '../types/calendar';

/**
 * Returns formatted HH:MM:SS string for a specific IANA timezone
 */
export function getLiveClockString(tz: 'America/New_York' | 'Africa/Addis_Ababa', date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Formats a timestamp into HH:mm in the chosen timezone
 */
export function formatEventTime(timestamp: number, mode: TimezoneMode): string {
  const tz = mode === 'NY' ? 'America/New_York' : 'Africa/Addis_Ababa';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(timestamp));
}

/**
 * Formats a timestamp into short day and date (e.g., "Mon, Nov 9") in the chosen timezone
 */
export function formatEventDate(timestamp: number, mode: TimezoneMode): string {
  const tz = mode === 'NY' ? 'America/New_York' : 'Africa/Addis_Ababa';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
}

/**
 * Returns the minute of the day (0 - 1439) in the given timezone
 */
export function getMinuteOfDay(timestamp: number, mode: TimezoneMode): number {
  const tz = mode === 'NY' ? 'America/New_York' : 'Africa/Addis_Ababa';
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(new Date(timestamp));
  const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
  
  return (hour % 24) * 60 + minute;
}

/**
 * Formats relative time badge (e.g. "in 14m", "in 2h 10m", "45m ago", "Just now")
 */
export function getRelativeTimeBadge(timestamp: number, nowMs = Date.now()): {
  text: string;
  isUpcoming: boolean;
  isRecent: boolean;
  isImminent: boolean;
} {
  const diffMs = timestamp - nowMs;
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHour / 24);

  const isUpcoming = diffMs > 0;
  const isImminent = isUpcoming && diffMs <= 15 * 60 * 1000;
  const isRecent = !isUpcoming && Math.abs(diffMs) <= 60 * 60 * 1000;

  if (Math.abs(diffMs) < 60 * 1000) {
    return {
      text: isUpcoming ? 'in <1m' : 'Just now',
      isUpcoming,
      isRecent: true,
      isImminent: isUpcoming,
    };
  }

  if (diffMin < 60) {
    return {
      text: isUpcoming ? `in ${diffMin}m` : `${diffMin}m ago`,
      isUpcoming,
      isRecent,
      isImminent,
    };
  }

  if (diffHour < 24) {
    const remMin = diffMin % 60;
    const text = isUpcoming
      ? remMin > 0 ? `in ${diffHour}h ${remMin}m` : `in ${diffHour}h`
      : remMin > 0 ? `${diffHour}h ${remMin}m ago` : `${diffHour}h ago`;
    return {
      text,
      isUpcoming,
      isRecent: false,
      isImminent: false,
    };
  }

  return {
    text: isUpcoming ? `in ${diffDays}d` : `${diffDays}d ago`,
    isUpcoming,
    isRecent: false,
    isImminent: false,
  };
}

/**
 * Format remaining time countdown HH:MM:SS
 */
export function formatCountdown(targetTimestamp: number, nowMs = Date.now()): string {
  const diffMs = Math.max(0, targetTimestamp - nowMs);
  const totalSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

/**
 * Checks if two timestamps fall on the same calendar day in the given timezone
 */
export function isSameDayInTimezone(ts1: number, ts2: number, mode: TimezoneMode): boolean {
  const tz = mode === 'NY' ? 'America/New_York' : 'Africa/Addis_Ababa';
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(new Date(ts1)) === fmt.format(new Date(ts2));
}

/**
 * Get weekday name in timezone
 */
export function getWeekdayName(timestamp: number, mode: TimezoneMode): string {
  const tz = mode === 'NY' ? 'America/New_York' : 'Africa/Addis_Ababa';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    weekday: 'short',
  }).format(new Date(timestamp));
}
