# How SmartSolution Should Fetch Gallery Events

This document describes **exactly** what the SmartSolution (Smart Mumbai Solutions / smartsolutionsmumbai) frontend must do to fetch gallery events that are created in this app’s admin.

---

## Architecture (who does what)

The flow is correct by design:

```
Browser (on SmartSolution site)
  → GET https://smartsolution-domain/api/gallery/events   ← visible in browser Network tab
      → SmartSolution Next.js proxy (e.g. app/api/gallery/events/route.ts or rewrite)
          → GET https://loansarathi.com/api/gallery/events   ← server-side, NOT visible in browser
              → Loan Sarathi backend (this repo) responds
```

- **SmartSolution frontend is correct**: Gallery → /gallery → GallerySection → calls `/api/gallery/events`. The browser only talks to the SmartSolution server; the call to loansarathi.com happens server-side and does not appear in the browser Network tab.
- **If the response is 500**, the error is coming from **loansarathi.com’s backend** (this repo). The fix is on the Loan Sarathi / this repo side, not in SmartSolution’s frontend code.

---

## 1. Where gallery events come from

- Gallery events are **created and managed** in **this app’s admin**: `/admin/gallery`.
- When creating an event, the admin chooses **source**: either **Loan Sarathi** or **Smart Mumbai Solutions**.
- Events for SmartSolution must be created with **source = Smart Mumbai Solutions** (`smartmumbaisolutions`).
- Only **published** events are returned by the public API.

---

## 2. API base URL

- **If SmartSolution runs on the same Next.js app** (same domain as this frontend):  
  Use relative path: **`/api/gallery`**.  
  Next.js rewrites `/api/gallery/*` to the backend (`BACKEND_URL`).

- **If SmartSolution is a separate site** (different domain):  
  Call the **backend directly**, e.g. `https://your-backend-domain.com/api/gallery`.  
  The backend must allow the SmartSolution origin in CORS (see backend `ALLOWED_ORIGINS`).

---

## 3. How the backend knows it’s “SmartSolution”

The backend returns only events for the **detected source**. For SmartSolution it must detect **`smartmumbaisolutions`**.

Detection works in two ways:

1. **Header (recommended for cross-origin)**  
   Send:
   ```http
   X-Application-Source: smartmumbaisolutions
   ```
   (or `smartmumbai` — both map to `smartmumbaisolutions`.)

2. **Automatic from request URL**  
   If **Origin**, **Referer**, or **Host** contains any of:
   - `smartmumbaisolutions`
   - `smartmumbai`
   - `smartsolutionsmumbai`
   - `smartsolutions`  
   then the backend treats the request as SmartSolution.

If neither applies, the backend defaults to **`loan-sarathi`** and returns Loan Sarathi events only.

---

## 4. What SmartSolution should do (exact steps)

### Option A: Same Next.js app (e.g. same domain as this frontend)

1. **Request**
   - **Method:** `GET`
   - **URL:**  
     - All events: **`/api/gallery/events`**  
     - Featured only: **`/api/gallery/events?featured=true`**  
     - Pagination: **`/api/gallery/events?limit=20&offset=0`**

2. **Headers (optional but recommended)**  
   So the backend always returns SmartSolution events even if origin/referer differ (e.g. server-side fetch):
   ```http
   X-Application-Source: smartmumbaisolutions
   ```

3. **Example (browser)**
   ```javascript
   const res = await fetch('/api/gallery/events', {
     headers: {
       'X-Application-Source': 'smartmumbaisolutions',
     },
   });
   const data = await res.json();
   ```

### Option B: Separate SmartSolution site (different domain)

1. **Request**
   - **Method:** `GET`
   - **URL:** `https://<BACKEND_URL>/api/gallery/events`  
     (same query params as above: `?featured=true`, `?limit=20&offset=0`).

2. **Headers (required)**  
   So the backend knows to return SmartSolution events:
   ```http
   X-Application-Source: smartmumbaisolutions
   ```

3. **Example**
   ```javascript
   const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.yourdomain.com';
   const res = await fetch(`${BACKEND_URL}/api/gallery/events`, {
     headers: {
       'X-Application-Source': 'smartmumbaisolutions',
     },
   });
   const data = await res.json();
   ```

---

## 5. Query parameters

| Parameter  | Type   | Default | Description                          |
|-----------|--------|--------|--------------------------------------|
| `featured`| string | —      | `true` = only featured events        |
| `limit`   | number | 50     | Max number of events to return       |
| `offset`  | number | 0      | Skip first N events (pagination)     |

Examples:
- `/api/gallery/events`
- `/api/gallery/events?featured=true`
- `/api/gallery/events?limit=10&offset=20`

---

## 6. Response shape

### Success (200)

```json
{
  "success": true,
  "total": 5,
  "events": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Event title",
      "description": "Event description",
      "eventDate": "2024-01-15",
      "location": "Mumbai",
      "isFeatured": true,
      "isPublished": true,
      "source": "smartmumbaisolutions",
      "images": [
        {
          "id": "0",
          "imageUrl": "/uploads/gallery/eventId/image.jpg",
          "altText": "Alt text",
          "displayOrder": 0,
          "isFeatured": true
        }
      ],
      "createdAt": "2024-01-10T10:00:00.000Z",
      "updatedAt": "2024-01-10T10:00:00.000Z"
    }
  ]
}
```

- **`total`**: Total count of events matching the request (for pagination).
- **`events`**: Array of published events for the detected source (SmartSolution when header or origin/referer/host match).

### Single event: GET `/api/gallery/events/:id`

- **URL:** `/api/gallery/events/<eventId>`
- **Same headers:** `X-Application-Source: smartmumbaisolutions` when needed.
- **Response (200):**
  ```json
  {
    "success": true,
    "event": { ... }
  }
  ```

### Errors

- **500** – Server error (check backend logs or `details` if exposed).
- **503** – Backend DB not connected.
- **404** – Invalid event id or no event found for that source.

---

## 7. Checklist for SmartSolution

- [ ] Events for SmartSolution are created in admin with **source = Smart Mumbai Solutions** and are **published**.
- [ ] Requests use **GET** to **`/api/gallery/events`** (or backend base URL if different domain).
- [ ] **Header** `X-Application-Source: smartmumbaisolutions` is sent so the backend returns only SmartSolution events.
- [ ] If cross-origin: backend **CORS** allows the SmartSolution origin (e.g. in `ALLOWED_ORIGINS`).
- [ ] Image URLs in the response are used as given (relative to the app that serves uploads, or full URL if backend serves them).

---

## 8. Health check

To verify the gallery API is reachable:

- **Same app:** `GET /api/gallery/health`
- **Backend directly:** `GET https://<BACKEND_URL>/api/gallery/health`

Response includes `detectedSource` so you can confirm the backend sees the request as `smartmumbaisolutions` when you send the header or call from the expected origin.

---

## 9. Loan Sarathi backend (this repo) – why 500 happens and what to check

When SmartSolution gets a **500** on gallery events, the failure is on **loansarathi.com’s backend** (this repo). SmartSolution’s frontend and proxy are fine.

### We are not using SQL migrations

- This app uses **MongoDB**, not SQL/Sequelize.
- There is **no “gallery table migration”** to run. The `galleryEvents` collection is created automatically when the first event is created via admin (or when the backend first writes to it).
- An empty collection is fine: the API returns `{ success: true, total: 0, events: [] }`.

### What to verify on the loansarathi.com production server

1. **Gallery code is deployed**  
   The backend that serves `loansarathi.com` must be running the code from this repo that includes the gallery routes and the defensive fixes (e.g. safe date formatting in `backend/models/GalleryEvent.js`).

2. **Backend process restarted**  
   After deploying, the Node process that serves the API must be restarted so it loads the new code.

3. **Environment variables**  
   On production, `MONGO_URI` must be set. If it’s missing, the DB connection fails (the server may not start at all, or `getDb()` can be null and the API returns 503).

4. **See the real error**  
   - In the browser: on the failing request (e.g. from SmartSolution’s `/gallery`), open DevTools → Network → click the `api/gallery/events` request → **Response** tab. The body may include an error message.  
   - On the server: check the backend logs when the request hits. The route logs: `[Gallery API] Error fetching gallery events: <error>`.  
   - Optional: on the backend server set `EXPOSE_GALLERY_ERROR=true` and restart; then the 500 response body will include the error in `details` (turn off after debugging).

### Summary

- **SmartSolution**: Frontend and proxy are correct; no change needed there.
- **Loan Sarathi (this repo)**: Deploy the latest backend to production, restart the process, ensure `MONGO_URI` is set, and use logs or the 500 response body to fix whatever is still throwing on the server.

---

## 10. What to do on the server (so SmartSolution can fetch gallery)

Do these steps **on the machine that runs the Loan Sarathi backend** (the one that serves `loansarathi.com` or your API URL). After this, SmartSolution’s frontend will be able to fetch gallery events.

### Step 1: Deploy the latest backend code

- Pull the latest code from this repo (it includes the gallery routes and fixes).
- Ensure the **backend** app that handles `loansarathi.com` (or your backend domain) is running **this** code, not an old build.

```bash
# Example: on the server
cd /path/to/your/backend   # or your deployment root
git pull origin main      # or your branch
```

### Step 2: Set environment variables on the server

The backend **must** have these set where the Node process runs (e.g. `.env` or your host’s env config):

| Variable      | Required | Purpose |
|---------------|----------|---------|
| `MONGO_URI`   | **Yes**  | MongoDB connection string. Without it, DB calls fail (503 or crash). |
| `NODE_ENV`    | No       | Set to `production` on production. |
| `ALLOWED_ORIGINS` | No   | Comma-separated origins for CORS. If unset, production uses a default list that already includes SmartSolution domains. |
| `EXPOSE_GALLERY_ERROR` | No | Set to `true` only when debugging; then 500 responses include the error in `details`. |

Example `.env` on the server:

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
NODE_ENV=production
```

### Step 3: Restart the backend process

After pulling and setting env, **restart** the Node process so it loads the new code and env:

```bash
# Examples (use whatever you use on the server):
pm2 restart all
# or
systemctl restart your-backend-service
# or stop the process and start again (e.g. node server.js)
```

### Step 4: Confirm the API is up

From the server itself (or your laptop):

```bash
curl -s https://loansarathi.com/api/gallery/health
```

You should get JSON with `"success": true` and `"message": "Gallery API is working!"`. If this fails, the backend isn’t reachable or not running.

### Step 5: (Optional) Create at least one SmartSolution event

- In **this app’s admin**, go to **Gallery** and create an event with **source = Smart Mumbai Solutions** and **Publish** it.
- If you don’t create any, the API still works; it will return `{ success: true, total: 0, events: [] }`.

### Step 6: No CORS change needed for SmartSolution

SmartSolution’s **browser** only calls SmartSolution’s own domain. SmartSolution’s **server** then calls `loansarathi.com` in the background. That server-to-server request does not use CORS. The backend already allows common origins; you don’t need to change anything for SmartSolution to start fetching.

---

**Quick checklist on the server**

- [ ] Latest backend code deployed (with gallery routes).
- [ ] `MONGO_URI` set and backend starts without DB errors.
- [ ] Backend process **restarted** after deploy.
- [ ] `GET https://loansarathi.com/api/gallery/health` returns success.
- [ ] (Optional) At least one published gallery event with source **Smart Mumbai Solutions** for testing.

Once these are done, SmartSolution’s frontend can start fetching gallery events. If you still get 500, use backend logs or `EXPOSE_GALLERY_ERROR=true` to see the exact error (see section 9).
