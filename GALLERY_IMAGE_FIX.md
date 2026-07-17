# Gallery Image Loading - Troubleshooting Guide

## Issue Identified
Gallery images are not displaying on the admin page. This guide will help you fix and debug the issue.

## Fixes Applied

### 1. Fixed Route Handler Parameter Handling
**File**: `frontend/src/app/uploads/gallery/[...path]/route.ts`

**Issue**: The route handler wasn't properly awaiting and destructuring the params object in Next.js 15.

**Fix**: Updated parameter handling to correctly await and extract path segments:
```typescript
const resolvedParams = await context.params;
const pathSegments = resolvedParams.path;
```

### 2. Added Image Error Handling
**File**: `frontend/src/app/admin/gallery/page.tsx`

**Fix**: Added `onError` handler to images to show placeholder if loading fails.

### 3. Updated Next.js Config
**File**: `frontend/next.config.ts`

**Fix**: Added comment for image optimization configuration.

## How to Test

### Step 1: Restart the Frontend Server

```powershell
# Stop the frontend server (Ctrl+C if running)
# Then restart:
cd C:\Users\Neeraj\my-app\frontend
npm run dev
```

### Step 2: Test Image URL Directly

Open your browser and try to access an image directly:

```
http://localhost:3000/uploads/gallery/695f973abfa0beb7c00ff23b/1767872314556-myq5vj.png
```

**Expected**: The image should display or download

**If it fails**: Check the terminal for error messages

### Step 3: Check Browser Developer Console

1. Open the admin gallery page: http://localhost:3000/admin/gallery
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Look for any errors related to image loading
5. Go to the "Network" tab
6. Refresh the page
7. Look for failed requests (shown in red)
8. Click on a failed image request to see the error details

### Step 4: Verify File Paths

Run this command to check if images exist:

```powershell
# List all gallery images
Get-ChildItem -Path "C:\Users\Neeraj\my-app\frontend\public\uploads\gallery" -Recurse -File
```

### Step 5: Check Image URLs in Database

The image URLs should be in the format:
```
/uploads/gallery/{eventId}/{filename}
```

For example:
```
/uploads/gallery/695f973abfa0beb7c00ff23b/1767872314556-myq5vj.png
```

## Common Issues & Solutions

### Issue 1: 404 - File Not Found

**Symptoms**: Images show broken icon, Network tab shows 404 errors

**Causes**:
- Image URL in database doesn't match actual file path
- File was deleted or moved
- Incorrect path separators (Windows vs Unix)

**Solution**:
```powershell
# Check if file exists at expected path
Test-Path "C:\Users\Neeraj\my-app\frontend\public\uploads\gallery\{eventId}\{filename}"

# If file exists but URL is wrong, you may need to update the database
```

### Issue 2: 500 - Internal Server Error

**Symptoms**: Network tab shows 500 errors

**Causes**:
- Route handler error
- File permission issues
- Path resolution error

**Solution**:
1. Check terminal console for detailed error messages
2. Look at the route handler logs
3. Verify file permissions:
```powershell
# Check file permissions
Get-Acl "C:\Users\Neeraj\my-app\frontend\public\uploads\gallery"
```

### Issue 3: Images Loading Slowly

**Symptoms**: Images eventually load but take a long time

**Causes**:
- Large file sizes
- Route handler processing overhead

**Solution**:
1. Optimize images before upload (compress, resize)
2. Consider using Next.js Image component for automatic optimization
3. For production, use a CDN

### Issue 4: CORS Errors

**Symptoms**: Console shows CORS policy errors

**Causes**:
- Backend not allowing frontend origin
- Incorrect CORS configuration

**Solution**: Already fixed in the backend CORS configuration. If still occurs:
```javascript
// backend/server.js - verify CORS is configured for localhost:3000
```

## Debugging Commands

### Check Frontend Server Status
```powershell
# See if frontend is running
Get-Process -Name "node" | Where-Object {$_.Path -like "*my-app*"}
```

### View Frontend Logs in Real-Time
```powershell
cd C:\Users\Neeraj\my-app\frontend
npm run dev
# Watch for errors when accessing gallery page
```

### Test Image Route Handler
```powershell
# Test with curl or browser
curl http://localhost:3000/uploads/gallery/695f973abfa0beb7c00ff23b/1767872314556-myq5vj.png -o test.png
```

### Check MongoDB for Image URLs
```javascript
// Connect to MongoDB and check image URLs
use loan-sarathi
db.galleryEvents.find({}, {title: 1, images: 1}).pretty()

// Look for imageUrl format in the output
```

## Manual Fix: Update Image URLs in Database

If image URLs in database are incorrect, you can update them:

```javascript
// Connect to MongoDB
use loan-sarathi

// Check current image URLs
db.galleryEvents.find({}, {title: 1, "images.imageUrl": 1}).pretty()

// If URLs need to be fixed, update them:
db.galleryEvents.updateMany(
  {},
  {
    $set: {
      "images.$[].imageUrl": "correct-url-format"
    }
  }
)
```

## Expected Behavior

After applying fixes:

1. ✅ Images should load on admin gallery page
2. ✅ Clicking on events shows correct thumbnail
3. ✅ Edit page displays all event images
4. ✅ Direct image URLs are accessible
5. ✅ No errors in browser console
6. ✅ No 404/500 errors in Network tab

## Testing Checklist

- [ ] Frontend server restarted
- [ ] Admin gallery page loads without errors
- [ ] Images display correctly
- [ ] Browser console shows no errors
- [ ] Network tab shows successful image requests (200 OK)
- [ ] Direct image URL access works
- [ ] All three events show their images
- [ ] Featured images display correctly

## Next Steps

### If Images Still Don't Load

1. **Capture Error Details**:
   - Take screenshot of browser Dev Tools Console
   - Take screenshot of Network tab showing failed requests
   - Copy any error messages from terminal

2. **Verify Route Structure**:
```powershell
# Check if route file exists
Test-Path "C:\Users\Neeraj\my-app\frontend\src\app\uploads\gallery\[...path]\route.ts"
```

3. **Check Next.js Build**:
```powershell
# Clear Next.js cache and rebuild
cd C:\Users\Neeraj\my-app\frontend
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

4. **Verify File Encoding**:
   - Ensure image files are not corrupted
   - Try uploading a new test image
   - Check if new uploads work

### If Images Load Successfully

1. Clear browser cache (Ctrl+Shift+Delete)
2. Test on different browser
3. Test creating new gallery event with images
4. Test editing existing events
5. Test on public gallery page (if applicable)

## Production Deployment Notes

For production deployment, ensure:

1. **Static File Serving**: 
   - Images served via Nginx or CDN
   - Proper cache headers configured
   - Image optimization enabled

2. **Path Configuration**:
   - Update `NEXT_PUBLIC_BASE_URL` in .env.local
   - Ensure image URLs use absolute paths if needed
   - Configure CDN domain for image URLs

3. **Security**:
   - Route handler security checks are in place
   - File upload restrictions enforced
   - Directory traversal prevention active

## Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Static Assets](https://nextjs.org/docs/basic-features/static-file-serving)

## Support

If issues persist after following this guide:

1. Check the main deployment guide: `HOSTINGER_DEPLOYMENT_GUIDE.md`
2. Review security audit: `SECURITY_AUDIT.md`
3. Verify environment variables are set correctly
4. Check if database connection is working properly
5. Ensure MongoDB has the correct image URLs stored

---

**Last Updated**: February 16, 2026  
**Status**: Fixes Applied - Awaiting Testing
