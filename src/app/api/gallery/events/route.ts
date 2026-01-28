import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  GalleryEvent,
  GALLERY_EVENTS_COLLECTION,
  formatGalleryEventForResponse
} from '@/models/GalleryEvent';
import { detectSource } from '@/lib/source-detection';
import { apiCache, CACHE_TTL } from '@/lib/cache';

// Cache key prefix for gallery events
const CACHE_PREFIX = 'gallery_events';

/**
 * Generate a unique cache key based on query parameters
 */
function generateCacheKey(source: string, featured: string | null, limit: number, offset: number): string {
  return `${CACHE_PREFIX}:${source}:${featured || 'all'}:${limit}:${offset}`;
}

// GET /api/gallery/events - Get all published gallery events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = detectSource(request);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate cache key
    const cacheKey = generateCacheKey(source, featured, limit, offset);

    // Check cache first
    const cachedResponse = apiCache.get<{ success: boolean; total: number; events: any[] }>(cacheKey);
    if (cachedResponse) {
      // Return cached response with cache hit header
      const response = NextResponse.json(cachedResponse);
      response.headers.set('X-Cache', 'HIT');
      response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes
      return response;
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Build query
    const query: any = {
      source: source,
      isPublished: true,
    };

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Fetch events with projection (only fetch needed fields for better performance)
    // Using projection to reduce data transfer from MongoDB
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
        }
      })
      .sort({ eventDate: -1, displayOrder: 1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Count total (use estimated count if no filter for better performance)
    const total = await collection.countDocuments(query);

    // Format response
    const responseData = {
      success: true,
      total,
      events: events.map(formatGalleryEventForResponse),
    };

    // Store in cache with 5-minute TTL
    apiCache.set(cacheKey, responseData, CACHE_TTL.MEDIUM);

    // Return response with cache miss header
    const response = NextResponse.json(responseData);
    response.headers.set('X-Cache', 'MISS');
    response.headers.set('Cache-Control', 'private, max-age=300'); // 5 minutes
    return response;
  } catch (error) {
    console.error('[Gallery API] Error fetching gallery events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

