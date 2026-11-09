import { MacroEvent } from '../types/calendar';

export const CACHE_STORAGE_KEY = 'macroradar_ff_cache_v1';
export const MANUAL_SYNC_KEY = 'macroradar_last_manual_sync';
export const ACTUAL_OVERRIDES_KEY = 'macroradar_actual_overrides';

// 15-minute Cache TTL in milliseconds
export const CACHE_TTL_MS = 15 * 60 * 1000;

// 60-second cooldown between manual syncs
export const MANUAL_SYNC_COOLDOWN_MS = 60 * 1000;

export interface CachedFeedPayload {
  fetchedAt: number;
  events: MacroEvent[];
  version: string;
}

export interface ActualOverrideRecord {
  actual: number;
  unit?: string;
  updatedAt: number;
}

// In-memory fallback for environments without window.localStorage (Node/SSR/Vitest)
const memoryStorage = new Map<string, string>();

function getStorageItem(key: string): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return memoryStorage.get(key) ?? null;
}

function setStorageItem(key: string, value: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  } else {
    memoryStorage.set(key, value);
  }
}

function removeStorageItem(key: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  } else {
    memoryStorage.delete(key);
  }
}

/**
 * Retrieve cached ForexFactory feed if present
 */
export function getCachedFeed(): { fetchedAt: number; events: MacroEvent[]; isStale: boolean } | null {
  try {
    const raw = getStorageItem(CACHE_STORAGE_KEY);
    if (!raw) return null;

    const parsed: CachedFeedPayload = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.events) || typeof parsed.fetchedAt !== 'number') {
      return null;
    }

    const age = Date.now() - parsed.fetchedAt;
    const isStale = age >= CACHE_TTL_MS;

    return {
      fetchedAt: parsed.fetchedAt,
      events: parsed.events,
      isStale,
    };
  } catch (err) {
    console.warn('[MacroRadar Cache] Failed to read cached feed:', err);
    return null;
  }
}

/**
 * Save freshly fetched events to cache
 */
export function saveCachedFeed(events: MacroEvent[]): void {
  try {
    const payload: CachedFeedPayload = {
      fetchedAt: Date.now(),
      events,
      version: '1.0',
    };
    setStorageItem(CACHE_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[MacroRadar Cache] Failed to write cache (quota exceeded?):', err);
  }
}

/**
 * Clear cached feed
 */
export function clearCachedFeed(): void {
  try {
    removeStorageItem(CACHE_STORAGE_KEY);
  } catch (err) {
    console.warn('[MacroRadar Cache] Failed to clear cache:', err);
  }
}

/**
 * Check if a manual sync is allowed under the 60-second cooldown policy
 */
export function checkManualSyncCooldown(): { allowed: boolean; remainingSec: number } {
  try {
    const lastSyncStr = getStorageItem(MANUAL_SYNC_KEY);
    if (!lastSyncStr) {
      return { allowed: true, remainingSec: 0 };
    }

    const lastSync = parseInt(lastSyncStr, 10);
    if (isNaN(lastSync)) {
      return { allowed: true, remainingSec: 0 };
    }

    const elapsed = Date.now() - lastSync;
    if (elapsed >= MANUAL_SYNC_COOLDOWN_MS) {
      return { allowed: true, remainingSec: 0 };
    }

    const remainingSec = Math.ceil((MANUAL_SYNC_COOLDOWN_MS - elapsed) / 1000);
    return { allowed: false, remainingSec };
  } catch {
    return { allowed: true, remainingSec: 0 };
  }
}

/**
 * Record that a manual sync was performed now
 */
export function recordManualSyncTimestamp(): void {
  try {
    setStorageItem(MANUAL_SYNC_KEY, Date.now().toString());
  } catch (err) {
    console.warn('[MacroRadar Cache] Failed to save manual sync timestamp:', err);
  }
}

/**
 * Get all persisted custom Actual overrides
 */
export function getActualOverrides(): Record<string, ActualOverrideRecord> {
  try {
    const raw = getStorageItem(ACTUAL_OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (err) {
    console.warn('[MacroRadar Cache] Failed to load actual overrides:', err);
    return {};
  }
}

/**
 * Save a custom Actual override for an event
 */
export function saveActualOverride(eventId: string, actualValue: number, unit?: string): void {
  try {
    const current = getActualOverrides();
    current[eventId] = {
      actual: actualValue,
      unit,
      updatedAt: Date.now(),
    };
    setStorageItem(ACTUAL_OVERRIDES_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('[MacroRadar Cache] Failed to save actual override:', err);
  }
}

/**
 * Remove a custom Actual override for an event
 */
export function removeActualOverride(eventId: string): void {
  try {
    const current = getActualOverrides();
    delete current[eventId];
    setStorageItem(ACTUAL_OVERRIDES_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('[MacroRadar Cache] Failed to remove actual override:', err);
  }
}

/**
 * Apply custom Actual overrides onto a list of MacroEvents
 */
export function applyActualOverrides(events: MacroEvent[]): MacroEvent[] {
  const overrides = getActualOverrides();
  if (Object.keys(overrides).length === 0) return events;

  return events.map(evt => {
    const override = overrides[evt.id];
    if (override !== undefined) {
      return {
        ...evt,
        actual: override.actual,
        unit: override.unit || evt.unit,
        isSimulated: evt.isSimulated,
      };
    }
    return evt;
  });
}
