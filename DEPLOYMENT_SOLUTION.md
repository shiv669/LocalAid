# Deployment Configuration for Appwrite

## Important: Static Site Deployment

This Next.js app is configured for **static export** (`output: 'export'` in `next.config.ts`).

### The Problem with Appwrite's Auto-Deployment

Appwrite's deployment system detects Next.js and tries to deploy it as an **SSR function**, which causes the "Page not found" error because it's looking for a Node.js server that doesn't exist in static exports.

### Solution: Manual Static Deployment

Instead of using Appwrite's "Deploy from Git" feature, you need to:

#### Option 1: Deploy Manually via Appwrite Console

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Go to Appwrite Console** → Your Project → **Storage**

3. **Create a bucket** for static hosting:
   - Bucket ID: `website`
   - Name: `Website Files`
   - Permissions: Read access for `any`

4. **Upload the `out` folder contents** to the bucket

5. **Configure bucket** to serve as website:
   - Enable "File Security"
   - Set default file to `index.html`

**However**, this approach is limited because Appwrite Storage isn't designed for website hosting with routing.

#### Option 2: Use Appwrite Functions with Custom Routing (Advanced)

Create a serverless function that serves static files:

1. **Create function** in Appwrite
2. **Upload a simple Node.js server** that reads files from the `out` folder
3. **Configure routing** to handle SPA behavior

This is complex and not recommended.

#### Option 3: Use Vercel (RECOMMENDED) ✅

Vercel is built for Next.js and handles static exports perfectly:

1. **Already pushed to GitHub** ✅
2. **Go to [vercel.com](https://vercel.com)**
3. **Import repository:** `shiv669/LocalAid`
4. **Add environment variables:**
   ```
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=localaid_db
   NEXT_PUBLIC_APPWRITE_STORAGE_ID=localaid_storage
   NEXT_PUBLIC_COLLECTION_REQUESTS=requests
   NEXT_PUBLIC_COLLECTION_RESOURCES=resources
   NEXT_PUBLIC_COLLECTION_USERS=users
   NEXT_PUBLIC_COLLECTION_MATCHES=matches
   ```
5. **Deploy!**

Then:
- Add Vercel URL to Appwrite **Platforms** (Settings → Platforms → Web App)
- Keep using Appwrite for backend (Auth, Database, Realtime)

### Why This Separation Works Best

- **Frontend (Vercel):** Perfect for Next.js static exports, automatic deployments, global CDN
- **Backend (Appwrite):** Perfect for auth, database, real-time, storage

This is actually the recommended architecture for production apps!

## Current Build Configuration

```json
{
  "output": "export",           // Static export mode
  "distDir": "out",             // Output directory
  "trailingSlash": false,       // Clean URLs for hosting
  "images": {
    "unoptimized": true         // Required for static export
  }
}
```

## Files Deployed

After `npm run build`, the `out/` folder contains:
- `index.html` - Main page
- `verify.html` - Email verification page
- `404.html` - Error page
- `_next/` - Static assets (JS, CSS)
- `_routes.json` - Routing configuration
- `_redirects` - Fallback rules

## Deployment Checklist

- [x] Build completes successfully
- [x] Static files generated in `out/`
- [x] Routing configuration included
- [x] Environment variables configured
- [ ] Deploy to Vercel (recommended)
- [ ] Add deployment URL to Appwrite platforms
- [ ] Test all features work

---

**Recommendation:** Deploy to Vercel for the best experience. Appwrite's static hosting is still in beta and has limitations with Next.js App Router.
