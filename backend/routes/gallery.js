const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const { detectSource } = require('../utils/sourceDetection');
const { apiCache, CACHE_TTL } = require('../utils/cache');
const {
    GALLERY_EVENTS_COLLECTION,
    formatGalleryEventForResponse,
} = require('../models/GalleryEvent');

const CACHE_PREFIX = 'gallery_events';

function generateCacheKey(source, featured, limit, offset) {
    return `${CACHE_PREFIX}:${source}:${featured || 'all'}:${limit}:${offset}`;
}

// GET /health
router.get('/health', (req, res) => {
    try {
        const source = detectSource(req);
        const headers = {
            origin: req.headers['origin'] || 'none',
            referer: req.headers['referer'] || 'none',
            host: req.headers['host'] || 'none',
            'x-application-source': req.headers['x-application-source'] || 'none',
        };

        res.json({
            success: true,
            message: 'Gallery API is working!',
            timestamp: new Date().toISOString(),
            detectedSource: source,
            requestHeaders: headers,
            endpoints: {
                getAllEvents: '/api/gallery/events',
                getFeaturedEvents: '/api/gallery/events?featured=true',
                getSingleEvent: '/api/gallery/events/:id',
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Health check failed',
            details: error.message || 'Unknown error',
        });
    }
});

// GET /events
router.get('/events', async (req, res) => {
    try {
        let source = 'loan-sarathi';
        try {
            source = detectSource(req);
        } catch (detectErr) {
            console.warn('[Gallery API] detectSource failed, using default:', detectErr?.message);
        }

        const { featured } = req.query;
        const limit = parseInt(req.query.limit || '50', 10) || 50;
        const offset = parseInt(req.query.offset || '0', 10) || 0;

        const cacheKey = generateCacheKey(source, featured, limit, offset);

        let cachedResponse = null;
        try {
            cachedResponse = apiCache.get(cacheKey);
        } catch (cacheErr) {
            console.warn('[Gallery API] Cache get failed:', cacheErr?.message);
        }
        if (cachedResponse) {
            res.set('X-Cache', 'HIT');
            res.set('Cache-Control', 'private, max-age=300');
            return res.json(cachedResponse);
        }

        const db = getDb();
        if (!db) {
            console.error('[Gallery API] Database not connected');
            return res.status(503).json({
                success: false,
                error: 'Service temporarily unavailable',
                details: 'Database not connected',
            });
        }
        const collection = db.collection(GALLERY_EVENTS_COLLECTION);

        const query = {
            source: source,
            isPublished: true,
        };

        if (featured === 'true') {
            query.isFeatured = true;
        }

        const events = await collection
            .find(query, {
                projection: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    eventDate: 1,
                    location: 1,
                    isFeatured: 1,
                    isPublished: 1,
                    displayOrder: 1,
                    images: 1,
                    source: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            })
            .sort({ eventDate: -1, displayOrder: 1 })
            .skip(offset)
            .limit(limit)
            .toArray();

        const total = await collection.countDocuments(query);

        const formatted = events.map(formatGalleryEventForResponse).filter(Boolean);
        const responseData = {
            success: true,
            total,
            events: formatted,
        };

        try {
            apiCache.set(cacheKey, responseData, CACHE_TTL.MEDIUM);
        } catch (cacheErr) {
            console.warn('[Gallery API] Cache set failed:', cacheErr?.message);
        }

        res.set('X-Cache', 'MISS');
        res.set('Cache-Control', 'private, max-age=300');
        res.json(responseData);
    } catch (error) {
        console.error('[Gallery API] Error fetching gallery events:', error);
        const exposeDetails = process.env.NODE_ENV !== 'production' || process.env.EXPOSE_GALLERY_ERROR === 'true';
        res.status(500).json({
            success: false,
            error: 'Failed to fetch gallery events',
            details: exposeDetails ? (error.message || String(error)) : 'Unknown error',
        });
    }
});

// GET /events/:id
router.get('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let source = 'loan-sarathi';
        try {
            source = detectSource(req);
        } catch (detectErr) {
            console.warn('[Gallery API] detectSource failed (single event), using default:', detectErr?.message);
        }

        const db = getDb();
        if (!db) {
            return res.status(503).json({
                success: false,
                error: 'Service temporarily unavailable',
                details: 'Database not connected',
            });
        }
        const collection = db.collection(GALLERY_EVENTS_COLLECTION);

        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (e) {
            return res.status(404).json({ success: false, error: 'Event not found (Invalid ID)' });
        }

        const event = await collection.findOne({
            _id: objectId,
            source: source,
            isPublished: true,
        });

        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        const formatted = formatGalleryEventForResponse(event);
        if (!formatted) {
            return res.status(500).json({
                success: false,
                error: 'Failed to format gallery event',
            });
        }
        res.json({
            success: true,
            event: formatted,
        });
    } catch (error) {
        console.error('[Gallery API] Error fetching gallery event:', error);
        const exposeDetails = process.env.NODE_ENV !== 'production' || process.env.EXPOSE_GALLERY_ERROR === 'true';
        res.status(500).json({
            success: false,
            error: 'Failed to fetch gallery event',
            details: exposeDetails ? (error.message || String(error)) : 'Unknown error',
        });
    }
});

module.exports = router;
