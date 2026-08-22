/**
 * Client-side immediate cache manager to eliminate Flash of Default/Old Content (FOUC)
 * on page refresh before Firestore real-time stream delivers.
 */

export const CACHE_KEYS = {
  ABOUT: 'kfc_cache_about',
  JOURNEYS: 'kfc_cache_journeys',
  AWARDS: 'kfc_cache_awards',
  SKILLS: 'kfc_cache_skills',
  PROJECTS: 'kfc_cache_projects',
} as const;

export function getCachedData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed !== null && parsed !== undefined) {
        return parsed as T;
      }
    }
  } catch (err) {
    console.warn(`[Cache] Error reading ${key}:`, err);
  }
  return fallback;
}

export function setCachedData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[Cache] Error writing ${key}:`, err);
  }
}

export function removeCachedData(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Cache] Error removing ${key}:`, err);
  }
}
