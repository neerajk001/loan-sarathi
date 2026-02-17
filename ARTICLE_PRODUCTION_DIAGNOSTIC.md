# Production Diagnostic Steps

## Issue: Article links appear grayed out (disabled) in production

This means the articles have `url === '#'`, which indicates they're mock articles, not real ones from the News API.

## Step 1: Check Browser Console

1. Open your production website
2. Press **F12** to open DevTools
3. Go to the **Console** tab
4. Look for these messages:

### Expected Messages:

**If API is working:**
```
Fetching news from API...
News API response: {status: "ok", totalResults: 123, articles: Array(12)}
Fetched 12 valid articles from API
```

**If API key is missing:**
```
News API key not found, using mock data
```

**If API fails:**
```
News API response not OK: 429 Too Many Requests
Error fetching news: Error: Network response was not ok
```

**If API returns no articles:**
```
No articles in API response, using mock data
```

## Step 2: Common Issues & Solutions

### Issue A: "News API key not found"
**Cause**: Environment variable not set in production
**Solution**: 
```bash
# Add to your production .env file or hosting platform
NEXT_PUBLIC_NEWS_API_KEY=your-actual-api-key-here
```

### Issue B: "News API response not OK: 429"
**Cause**: News API rate limit exceeded (100 requests/day on free plan)
**Solution**: 
1. Upgrade News API plan, OR
2. Use mock data temporarily, OR
3. Implement caching to reduce API calls

### Issue C: "Only X articles found, using mock data instead"
**Cause**: API returned fewer than 4 valid articles
**Solution**: 
- Check if the API domains are returning results
- Try broadening the search query
- Check if articles have valid URLs

### Issue D: CORS Error
**Cause**: News API blocking requests from your domain
**Solution**: 
- News API should work from client-side, but check console for CORS errors
- If present, you may need to proxy through your backend

## Step 3: Test API Manually

Run this in your browser console on the production site:

```javascript
// Replace YOUR_API_KEY with your actual key
fetch('https://newsapi.org/v2/everything?q=bank+loan+insurance+finance&language=en&sortBy=publishedAt&domains=economictimes.indiatimes.com,livemint.com,business-standard.com,moneycontrol.com&pageSize=12&apiKey=YOUR_API_KEY')
  .then(res => res.json())
  .then(data => {
    console.log('API Status:', data.status);
    console.log('Total Results:', data.totalResults);
    console.log('Articles:', data.articles?.length);
    console.log('First article URL:', data.articles?.[0]?.url);
  })
  .catch(err => console.error('API Error:', err));
```

## Step 4: Check Environment Variables

### On your server:
```bash
# SSH into your production server
cd /path/to/your/app/frontend

# Check if env var is set
echo $NEXT_PUBLIC_NEWS_API_KEY

# If empty, add it to .env.local or .env.production
nano .env.local
# Add: NEXT_PUBLIC_NEWS_API_KEY=your-key-here

# Rebuild
npm run build

# Restart
pm2 restart frontend
```

## Step 5: Verify the Fix

After making changes:

1. **Rebuild** the frontend
2. **Restart** the server
3. **Hard refresh** the browser (Ctrl+Shift+R)
4. **Check console** for the new log messages
5. **Test clicking** on article links

## Quick Fix: Use Mock Data with Real URLs

If you want to temporarily show clickable mock articles while debugging the API:

Edit `frontend/src/components/NewsSection.tsx` and change the mock article URLs from `"#"` to actual news URLs:

```typescript
const mockNewsArticles: Article[] = [
  {
    id: '1',
    title: "RBI keeps repo rate unchanged at 6.5%",
    // ... other fields ...
    url: "https://www.financialexpress.com/market/banking-finance/"  // Real URL instead of "#"
  },
  // ... update all mock articles
];
```

## Expected Behavior After Fix

✅ Console shows: "Fetched X valid articles from API"
✅ All article links are **blue** (not gray)
✅ Clicking opens article in new tab
✅ No mock articles are shown (unless API fails)

## Need More Help?

If the issue persists, please provide:
1. Screenshot of browser console messages
2. Your News API plan (free/paid)
3. How many requests you're making per day
4. Any error messages from the console
