# Article Links Not Working in Production - Troubleshooting Guide

## Current Status

**Issue**: Article links are clickable on localhost but not working in production.

## Changes Made

### 1. Added Event Handling
- Added `e.stopPropagation()` to prevent parent elements from interfering
- Added `relative z-10` to ensure the link is on top of other elements

### 2. Code Update
```tsx
<a 
  href={article.url} 
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => {
    e.stopPropagation();
  }}
  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors mt-auto group/link relative z-10"
>
  Read Full Article <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
</a>
```

## Deployment Steps

### 1. Clear Build Cache
```bash
cd frontend
rm -rf .next
npm run build
```

### 2. Hard Refresh on Production
After deploying, users need to do a **hard refresh** to clear cached JavaScript:
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### 3. Clear Browser Cache
If hard refresh doesn't work:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## Additional Troubleshooting

### If Links Still Don't Work:

#### 1. Check Browser Console
Open DevTools (F12) → Console tab
Look for any JavaScript errors

#### 2. Check Network Tab
- Open DevTools (F12) → Network tab
- Click on an article link
- See if any request is being blocked

#### 3. Check if JavaScript is Loaded
In the browser console, type:
```javascript
console.log(document.querySelector('a[target="_blank"]'));
```
This should show the link element. If it's `null`, the component isn't rendering correctly.

#### 4. Test with Different Browsers
- Try Chrome, Firefox, and Safari
- If it works in one but not others, it's a browser-specific issue

#### 5. Check Production Logs
```bash
pm2 logs frontend
```
Look for any errors during rendering

### Common Causes:

1. **Cached JavaScript** (Most likely)
   - Solution: Hard refresh or clear cache

2. **Build Issues**
   - Solution: Delete `.next` folder and rebuild

3. **CSP Headers Blocking**
   - Check if Content-Security-Policy headers are too strict
   - Look in Network tab → Response Headers

4. **Ad Blockers**
   - Some ad blockers block external links
   - Test in incognito mode with extensions disabled

5. **JavaScript Errors**
   - Check browser console for errors
   - One error can break all JavaScript on the page

## Verification Checklist

After deployment:
- [ ] Hard refresh the page (Ctrl+Shift+R)
- [ ] Check browser console for errors
- [ ] Test clicking on multiple articles
- [ ] Test in different browsers
- [ ] Test in incognito mode
- [ ] Verify links open in new tabs

## Quick Test

Run this in the browser console on the production site:
```javascript
// Test if links are present
const links = document.querySelectorAll('a[target="_blank"]');
console.log(`Found ${links.length} external links`);

// Test if they're clickable
links.forEach((link, i) => {
  console.log(`Link ${i + 1}:`, link.href, 'Clickable:', !link.style.pointerEvents || link.style.pointerEvents !== 'none');
});
```

## Files Modified

- `frontend/src/components/NewsSection.tsx` - Added stopPropagation and z-index

## Next Steps

1. **Deploy the changes** to production
2. **Clear the build cache** before deploying
3. **Instruct users** to hard refresh their browsers
4. **Monitor** for any console errors

## If Problem Persists

If the issue continues after all these steps, please provide:
1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of Network tab when clicking a link
3. Browser and version being used
4. Any error messages from production logs

This will help diagnose the exact cause of the issue.
