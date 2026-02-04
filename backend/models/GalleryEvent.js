const { ObjectId } = require('mongodb');

const GALLERY_EVENTS_COLLECTION = 'galleryEvents';

function validateGalleryEvent(data) {
    const errors = {};

    if (!data.title || typeof data.title !== 'string') {
        errors.title = 'Title is required';
    } else if (data.title.length < 5 || data.title.length > 255) {
        errors.title = 'Title must be between 5 and 255 characters';
    }

    if (!data.description || typeof data.description !== 'string') {
        errors.description = 'Description is required';
    } else if (data.description.length < 10 || data.description.length > 5000) {
        errors.description = 'Description must be between 10 and 5000 characters';
    }

    if (!data.eventDate) {
        errors.eventDate = 'Event date is required';
    } else {
        const date = new Date(data.eventDate);
        if (isNaN(date.getTime())) {
            errors.eventDate = 'Invalid date format';
        }
    }

    if (!data.location || typeof data.location !== 'string') {
        errors.location = 'Location is required';
    } else if (data.location.length < 3 || data.location.length > 255) {
        errors.location = 'Location must be between 3 and 255 characters';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
}

async function getNextGalleryEventSequenceNumber(db) {
    const counters = db.collection('counters');
    const result = await counters.findOneAndUpdate(
        { _id: 'galleryEventId' },
        { $inc: { sequence: 1 } },
        { upsert: true, returnDocument: 'after' }
    );
    return result.sequence; // In MongoDB driver v4+, returnDocument: 'after' returns the doc in value
}

function generateGalleryEventId(sequenceNumber) {
    const paddedNumber = sequenceNumber.toString().padStart(5, '0');
    return `LS-GE-${new Date().getFullYear()}-${paddedNumber}`;
}

function formatGalleryEventForResponse(event) {
    return {
        id: event._id?.toString(),
        title: event.title,
        description: event.description,
        eventDate: event.eventDate.toISOString().split('T')[0],
        location: event.location,
        isFeatured: event.isFeatured,
        isPublished: event.isPublished,
        source: event.source,
        images: event.images ? event.images.map((img, index) => ({
            id: img._id?.toString() || index.toString(),
            imageUrl: img.imageUrl,
            altText: img.altText,
            displayOrder: img.displayOrder,
            isFeatured: img.isFeatured,
        })) : [],
        createdAt: event.createdAt ? event.createdAt.toISOString() : null,
        updatedAt: event.updatedAt ? event.updatedAt.toISOString() : null,
    };
}

module.exports = {
    GALLERY_EVENTS_COLLECTION,
    validateGalleryEvent,
    getNextGalleryEventSequenceNumber,
    generateGalleryEventId,
    formatGalleryEventForResponse,
};
