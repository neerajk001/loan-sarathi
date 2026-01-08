# Smart Mumbai Solutions - Frontend Integration Guide

## Overview
Your backend API is already configured to serve loan products and gallery data to Smart Mumbai Solutions. Follow this guide to integrate on your frontend.

---

## 1. Backend API Base URL
```
https://your-vps-domain.com
```

---

## 2. Loan Products API Integration

### API Endpoint
```
GET https://your-vps-domain.com/api/loan-products
```

### Headers Required
```javascript
{
  'x-application-source': 'smartmumbaisolutions'
}
```

### Frontend Implementation

```javascript
// Example: Fetch loan products
const fetchLoanProducts = async () => {
  try {
    const response = await fetch('https://your-vps-domain.com/api/loan-products', {
      headers: {
        'x-application-source': 'smartmumbaisolutions'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      // data.products = array of loan products
      return data.products;
    }
  } catch (error) {
    console.error('Error fetching loan products:', error);
  }
};
```

### Response Format
```json
{
  "success": true,
  "products": [
    {
      "slug": "personal-loan",
      "title": "Personal Loan",
      "maxAmount": "Loans up to ₹50 Lakhs",
      "interestRate": "Interest rates starting @ 10.49% p.a."
    },
    {
      "slug": "business-loan",
      "title": "Business Loan",
      "maxAmount": "Loans up to ₹2 Crores",
      "interestRate": "Interest rates starting @ 14.00% p.a."
    }
    // ... more products
  ]
}
```

### Display on Product Cards

```javascript
// Extract ROI from interestRate string
const extractROI = (interestRate) => {
  const match = interestRate.match(/@(\d+\.?\d*)%/);
  if (match) {
    return `@${match[1]}% ROI`;
  }
  return interestRate;
};

// Example: Display product card
products.forEach(product => {
  const roi = extractROI(product.interestRate); // "@10.49% ROI"
  const amount = product.maxAmount; // "Loans up to ₹50 Lakhs"
  
  // Render your card with roi and amount
});
```

---

## 3. Gallery API Integration

### API Endpoint
```
GET https://your-vps-domain.com/api/gallery/events
```

### Headers Required
```javascript
{
  'x-application-source': 'smartmumbaisolutions'
}
```

### Query Parameters
- `featured=true` - Get only featured events
- `limit=10` - Limit number of results (default: 50)
- `offset=0` - Pagination offset

### Frontend Implementation

```javascript
// Example: Fetch gallery events
const fetchGalleryEvents = async () => {
  try {
    const response = await fetch('https://your-vps-domain.com/api/gallery/events?featured=true&limit=10', {
      headers: {
        'x-application-source': 'smartmumbaisolutions'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.events;
    }
  } catch (error) {
    console.error('Error fetching gallery:', error);
  }
};
```

### Response Format
```json
{
  "success": true,
  "total": 5,
  "events": [
    {
      "id": "event-id",
      "title": "Event Name",
      "description": "Event description",
      "eventDate": "2026-01-15T00:00:00.000Z",
      "location": "Mumbai",
      "isFeatured": true,
      "images": [
        {
          "id": "image-id",
          "imageUrl": "/uploads/gallery/event-id/1234567890-abc123.jpg",
          "altText": "Image description",
          "displayOrder": 0,
          "isFeatured": true
        }
      ]
    }
  ]
}
```

### Display Images

```javascript
const BACKEND_URL = 'https://your-vps-domain.com';

events.forEach(event => {
  event.images.forEach(image => {
    const fullImageUrl = `${BACKEND_URL}${image.imageUrl}`;
    
    // Example: Display image
    // <img src={fullImageUrl} alt={image.altText} />
  });
});
```

---

## 4. CORS Configuration

Your backend is already configured to allow requests from:
- `http://localhost:3001` (development)
- `https://smartmumbaisolutions.com` (production)
- `https://www.smartmumbaisolutions.com`
- `https://smartmumbai.com`
- `https://www.smartmumbai.com`

**No additional CORS setup needed!**

---

## 5. Admin Updates

When you update loan products or gallery from the admin panel at `https://your-vps-domain.com/admin`:
- Smart Mumbai Solutions will **automatically** see the updated ROI and amounts
- Gallery images will **automatically** appear on Smart Mumbai Solutions

**No manual sync required** - changes are instant!

---

## 6. Development Testing

Run your Smart Mumbai Solutions frontend on:
```
http://localhost:3001
```

Test with:
```javascript
fetch('http://localhost:3000/api/loan-products', {
  headers: {
    'x-application-source': 'smartmumbaisolutions'
  }
})
```

Replace `http://localhost:3000` with your VPS domain for production.

---

## Summary Checklist

- [ ] Set backend base URL in your frontend config
- [ ] Add `x-application-source: smartmumbaisolutions` header to all API calls
- [ ] Fetch loan products from `/api/loan-products`
- [ ] Extract ROI from `interestRate` field
- [ ] Fetch gallery events from `/api/gallery/events`
- [ ] Prepend backend URL to image paths
- [ ] Test on `localhost:3001` first
- [ ] Deploy and test with production domain

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify the `x-application-source` header is being sent
3. Check CORS errors (should be pre-configured)
4. Verify VPS permissions are set: `chmod -R 755 public/uploads`
