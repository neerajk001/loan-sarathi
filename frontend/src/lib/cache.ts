/**
 * Simple in-memory cache with TTL support for API response caching.
 * This helps reduce database load for frequently accessed endpoints.
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

class MemoryCache {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Run cleanup every 60 seconds to remove expired entries
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 60 * 1000);
    }

    /**
     * Get a cached value by key
     * @param key - Cache key
     * @returns The cached value or null if not found/expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if entry has expired
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Set a value in the cache with TTL
     * @param key - Cache key
     * @param value - Value to cache
     * @param ttlMs - Time-to-live in milliseconds (default: 5 minutes)
     */
    set<T>(key: string, value: T, ttlMs: number = 5 * 60 * 1000): void {
        const entry: CacheEntry<T> = {
            data: value,
            expiresAt: Date.now() + ttlMs,
        };
        this.cache.set(key, entry);
    }

    /**
     * Delete a specific cache entry
     * @param key - Cache key to delete
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Delete all cache entries matching a pattern
     * @param pattern - String pattern to match against keys
     */
    deletePattern(pattern: string): number {
        let deleted = 0;
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
                deleted++;
            }
        }
        return deleted;
    }

    /**
     * Clear all cache entries
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get current cache size
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Remove expired entries from cache
     */
    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}

// Export a singleton instance
export const apiCache = new MemoryCache();

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
    SHORT: 1 * 60 * 1000,      // 1 minute
    MEDIUM: 5 * 60 * 1000,     // 5 minutes
    LONG: 15 * 60 * 1000,      // 15 minutes
} as const;
