import NodeCache from 'node-cache';
import { isDevelopment } from './app.utilities';

// This utility provides a simple caching mechanism using node-cache
// It allows you to store, retrieve, and manage cache entries with a default TTL (time-to-live).
// You can customize the TTL and other options as needed.
const cache = new NodeCache({
  stdTTL: 60, // Default time-to-live for cache entries in seconds
  checkperiod: 120, // Period to check for expired entries in seconds
  useClones: false, // Disable cloning to improve performance
});
// Handle cache errors
cache.on('error', (err) => {
  if (isDevelopment) console.error('Cache error:', err);
});
// Handle cache hits
cache.on('hit', (key) => {
  if (isDevelopment) console.info(`Cache hit: ${key}`);
});
// Handle cache misses
cache.on('miss', (key) => {
  if (isDevelopment) console.info(`Cache miss: ${key}`);
});
// Handle cache expiration
cache.on('expired', (key) => {
  if (isDevelopment) console.info(`Cache expired: ${key}`);
});

// Importing NodeCache from node-cache package
// Get a value from the cache
export const getCache = (key: string) => {
  return cache.get(key);
};
// Set a value in the cache
export const setCache = (
  key: string,
  value: unknown,
  ttl?: number,
): boolean => {
  if (ttl !== undefined) {
    return cache.set(key, value, ttl);
  }
  return cache.set(key, value);
};
// Delete a value from the cache
export const delCache = (key: string): number => {
  return cache.del(key);
};
// Get all keys in the cache
export const getAllCacheKeys = (): string[] => {
  return cache.keys();
};
// Clear the cache
export const clearCache = (): void => {
  cache.flushAll();
};
// Check if a key exists in the cache
export const hasCache = (key: string): boolean => {
  return cache.has(key);
};
// Delete multiple keys from the cache
export const delMultipleCache = (keys: string[]): number => {
  return cache.del(keys);
};
// Get multiple values from the cache
export const getMultipleCache = (keys: string[]) => {
  const resultObj = cache.mget(keys);
  return keys.map((key) => resultObj[key]);
};
// Set multiple values in the cache
export const setMultipleCache = (
  entries: Record<string, unknown>,
  ttl?: number,
): boolean => {
  const msetEntries = Object.entries(entries).map(([key, val]) =>
    ttl !== undefined ? { key, val, ttl } : { key, val },
  );
  return cache.mset(msetEntries);
};
// Get the number of keys in the cache
export const getCacheSize = (): number => {
  return cache.keys().length;
};
// Get the cache statistics
export const getCacheStats = (): NodeCache.Stats => {
  return cache.getStats();
};
// Reset the TTL of a key
export const resetCacheTTL = (key: string, ttl: number): boolean => {
  return cache.ttl(key, ttl);
};
// Get the TTL of a key
export const getCacheTTL = (key: string): number | undefined => {
  const ttl = cache.getTtl(key);
  return typeof ttl === 'number'
    ? Math.floor((ttl - Date.now()) / 1000)
    : undefined;
};
// Get the cache keys with a specific prefix
export const getCacheKeysWithPrefix = (prefix: string): string[] => {
  const allKeys = cache.keys();
  return allKeys.filter((key) => key.startsWith(prefix));
};
// Clear the cache keys with a specific prefix
export const clearCacheWithPrefix = (prefix: string): void => {
  const keysWithPrefix = getCacheKeysWithPrefix(prefix);
  if (keysWithPrefix.length > 0) {
    cache.del(keysWithPrefix);
  } else {
    if (isDevelopment)
      console.warn(`No cache keys found with prefix: ${prefix}`);
  }
};
// Clear the cache keys with a specific prefix
export const clearCacheKeysWithPrefix = (prefix: string): void => {
  const keysWithPrefix = getCacheKeysWithPrefix(prefix);
  if (keysWithPrefix.length > 0) {
    cache.del(keysWithPrefix);
  } else {
    if (isDevelopment)
      console.warn(`No cache keys found with prefix: ${prefix}`);
  }
};

// Export the cache instance for use in other modules
export default cache;
