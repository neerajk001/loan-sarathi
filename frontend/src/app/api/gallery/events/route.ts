import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  GALLERY_EVENTS_COLLECTION,
  formatGalleryEventForResponse,
} from '@/models/GalleryEvent';
import { apiCache, CACHE_TTL } from '@/lib/cache';

const CACHE_PREFIX = 'gallery_events';

function generateCacheKey(featured: string | null, limit: number, offset: number): string {
  return `${CACHE_PREFIX}:${featured || 'all'}:${limit}:${offset}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50', 10) || 50;
    const offset = parseInt(searchParams.get('offset') || '0', 10) || 0;

    const cacheKey = generateCacheKey(featured, limit, offset);

    let cachedResponse = null;
    try {
      cachedResponse = apiCache.get(cacheKey);
    } catch (cacheErr: any) {
      console.warn('[Gallery API] Cache get failed:', cacheErr?.message);
    }
    if (cachedResponse) {
      const response = NextResponse.json(cachedResponse);
      response.headers.set('X-Cache', 'HIT');
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return response;
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection(GALLERY_EVENTS_COLLECTION);

    const query: any = { isPublished: true };
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
    } catch (cacheErr: any) {
      console.warn('[Gallery API] Cache set failed:', cacheErr?.message);
    }

    const response = NextResponse.json(responseData);
    response.headers.set('X-Cache', 'MISS');
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error) {
    console.error('[Gallery API] Error fetching gallery events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery events',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
