class MemoryCache {
    constructor() {
        this.cache = new Map();
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 60 * 1000);
    }

    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }

    set(key, value, ttlMs = 5 * 60 * 1000) {
        this.cache.set(key, {
            data: value,
            expiresAt: Date.now() + ttlMs,
        });
    }

    delete(key) {
        return this.cache.delete(key);
    }

    deletePattern(pattern) {
        let deleted = 0;
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
                deleted++;
            }
        }
        return deleted;
    }

    clear() {
        this.cache.clear();
    }

    size() {
        return this.cache.size;
    }

    cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
    
    // Destroy method for graceful shutdown
    destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.cache.clear();
    }
}

const apiCache = new MemoryCache();

const CACHE_TTL = {
    SHORT: 1 * 60 * 1000,
    MEDIUM: 5 * 60 * 1000,
    LONG: 15 * 60 * 1000,
};

// Cleanup on process exit
process.on('SIGINT', () => {
    apiCache.destroy();
});

process.on('SIGTERM', () => {
    apiCache.destroy();
});

module.exports = { apiCache, CACHE_TTL };
