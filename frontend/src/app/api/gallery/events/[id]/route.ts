import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  GALLERY_EVENTS_COLLECTION,
  formatGalleryEventForResponse,
} from '@/models/GalleryEvent';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json(
        { success: false, error: 'Event not found (Invalid ID)' },
        { status: 404 }
      );
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection(GALLERY_EVENTS_COLLECTION);

    const event = await collection.findOne({
      _id: objectId,
      isPublished: true,
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const formatted = formatGalleryEventForResponse(event);
    if (!formatted) {
      return NextResponse.json(
        { success: false, error: 'Failed to format gallery event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      event: formatted,
    });
  } catch (error) {
    console.error('[Gallery API] Error fetching gallery event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery event',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
