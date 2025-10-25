# 🚀 Appwrite Deployment Guide for LocalAid Connect

## The Root Cause of "Page Not Found" Error

The issue occurs because:
1. **Appwrite's static hosting doesn't support Next.js App Router's server components natively**
2. **Trailing slashes in URLs** cause routing conflicts
3. **Missing proper fallback configuration** for SPA routing

## ✅ Fixes Applied

### 1. Removed Trailing Slashes
```typescript
// next.config.ts
trailingSlash: false  // Changed from true
```

### 2. Updated Routing Configuration
```json
// public/_routes.json - Appwrite routing rules
{
  "version": 2,
  "routes": [
    {
      "src": "^/_next/(.*)$",
      "dest": "/_next/$1"
    },
    {
      "src": "^/verify$",
      "dest": "/verify.html"
    },
    {
      "src": "^/(.*)$",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Added Redirect Rules
```
// public/_redirects - Netlify/Vercel style
/*    /index.html   200
```

## 📦 How to Deploy to Appwrite (Updated Method)

### Step 1: Build the Project

```bash
npm run build
```

This creates the `out` folder with:
- `index.html` (main page)
- `verify.html` (verification page)
- `404.html` (error page)
- `_next/` (static assets)
- `_routes.json` (routing config)

### Step 2: Deploy Using Appwrite CLI

1. **Install Appwrite CLI** (if not already installed)
```bash
npm install -g appwrite-cli
```

2. **Login to Appwrite**
```bash
appwrite login
```

3. **Initialize Project** (first time only)
```bash
appwrite init project
```

Select your project from the list or create a new one.

4. **Deploy Static Site**
```bash
appwrite deploy collection
```

Select the `out` directory when prompted.

### Step 3: Configure Appwrite Project

1. Go to **Appwrite Console** → Your Project
2. Navigate to **Settings** → **Platforms**
3. Click **Add Platform** → **Web App**
4. Add your deployment URL:
   - Name: `LocalAid Production`
   - Hostname: Your Appwrite hosting URL
   - (Example: `localaid-xxxxxx.appwrite.global`)

### Step 4: Update Environment Variables

If you deployed and the URL changed, update your `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_DATABASE_ID=localaid_db
NEXT_PUBLIC_APPWRITE_STORAGE_ID=localaid_storage

NEXT_PUBLIC_COLLECTION_REQUESTS=requests
NEXT_PUBLIC_COLLECTION_RESOURCES=resources
NEXT_PUBLIC_COLLECTION_USERS=users
NEXT_PUBLIC_COLLECTION_MATCHES=matches
```

Rebuild and redeploy after changes:
```bash
npm run build
appwrite deploy collection
```

## 🔍 Troubleshooting

### Issue: Still Getting "Page Not Found"

**Solution 1: Check Build Output**
```bash
# Verify these files exist in the out folder:
ls out/index.html
ls out/verify.html
ls out/_routes.json
```

**Solution 2: Clear Appwrite Cache**
- Go to Appwrite Console
- Delete the current deployment
- Redeploy with fresh build

**Solution 3: Verify Routing Rules**
- Ensure `_routes.json` is in the `out` folder
- Check that it's being uploaded to Appwrite

### Issue: Assets Not Loading (CSS/JS)

**Check:**
1. Verify `_next/` folder uploaded correctly
2. Check browser console for 404 errors on assets
3. Ensure `unoptimized: true` in `next.config.ts`

### Issue: Email Verification Not Working

**Fix:**
1. Add your Appwrite hosting domain to allowed origins
2. Go to **Auth** → **Security** → Add domain
3. Example: `https://localaid-xxxxxx.appwrite.global`

## 🎯 Best Practice: Use Vercel for Production

**Why Vercel?**
- Built by Next.js creators
- Perfect support for App Router
- Automatic deployments from GitHub
- Free SSL certificates
- Edge network for global performance

**Quick Vercel Deployment:**
1. Push to GitHub ✅ (already done)
2. Go to [vercel.com](https://vercel.com)
3. Import `shiv669/LocalAid` repository
4. Add environment variables
5. Deploy!

Then just use Appwrite for backend (Auth, Database, Realtime).

## 📊 Deployment Checklist

- [ ] Build completed successfully (`npm run build`)
- [ ] `out` folder contains `index.html` and `verify.html`
- [ ] `_routes.json` present in `out` folder
- [ ] Appwrite CLI installed and logged in
- [ ] Project initialized with correct project ID
- [ ] Deployed to Appwrite using CLI
- [ ] Platform added in Appwrite Console
- [ ] Deployment URL added to allowed origins
- [ ] Tested main page loads
- [ ] Tested `/verify` route works
- [ ] Tested real-time features work
- [ ] Tested authentication works

## 🆘 Still Having Issues?

If you're still experiencing the "Page Not Found" error after following all steps:

1. **Share your deployment URL** - Let me check the live site
2. **Check browser console** - Look for any JavaScript errors
3. **Verify Appwrite project settings** - Ensure all collections exist
4. **Try Vercel** - As a comparison to isolate the issue

The current fix should work for Appwrite's static hosting! 🎉

---

**Last Updated:** October 26, 2025 for Hacktoberfest 2025
