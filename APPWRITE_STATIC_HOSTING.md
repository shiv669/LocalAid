# Appwrite Static Hosting Deployment Guide

## ⚠️ Important Update (October 2025)

Appwrite now supports static site hosting! This guide shows you how to deploy your Next.js static export to Appwrite.

## Prerequisites

- Appwrite Cloud account or self-hosted Appwrite instance
- Your project already configured in Appwrite Console
- Git repository connected

## Configuration Files

The project includes the following configuration files for Appwrite deployment:

### 1. `.appwrite.json` (Build Configuration)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "rootDirectory": "."
}
```

### 2. `next.config.ts` (Next.js Configuration)
```typescript
{
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: false,
  distDir: 'out'
}
```

### 3. `public/_routes.json` (Routing Configuration)
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}
```

### 4. `public/_redirects` (SPA Redirects)
```
/*    /index.html   200
```

## Deployment Steps

### Option 1: Deploy from Appwrite Console

1. **Go to Appwrite Console**
   - Navigate to https://cloud.appwrite.io/console
   - Select your project

2. **Enable Static Hosting**
   - Go to **Settings** > **Hosting** (or **Static Sites**)
   - Click **Connect Git Repository**
   - Select your GitHub repository: `shiv669/LocalAid`
   - Choose branch: `main`

3. **Configure Build Settings**
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
   - **Root Directory**: `.` (leave empty or set to root)
   - **Install Command**: `npm install` (auto-detected)

4. **Deploy**
   - Click **Deploy**
   - Wait for build to complete (usually 2-5 minutes)
   - Your site will be available at: `https://<project-id>.appwrite.app`

### Option 2: Deploy via Appwrite CLI

1. **Install Appwrite CLI**
   ```bash
   npm install -g appwrite-cli
   ```

2. **Login to Appwrite**
   ```bash
   appwrite login
   ```

3. **Initialize Project**
   ```bash
   appwrite init project
   ```
   - Select your project from the list
   - Configure as needed

4. **Deploy Static Site**
   ```bash
   npm run build
   appwrite deploy collection
   ```

### Option 3: Manual Upload (Testing)

1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Go to Appwrite Console > Storage**
   - Create a new bucket called `website`
   - Set permissions to allow public read access

3. **Upload the `out/` folder contents**
   - Upload all files from the `out` directory
   - Ensure `index.html` is at the root level

## Troubleshooting

### Issue: "Page not found" (404 Error)

**Symptoms:**
- GET request to `/?appwrite-preview=1` returns 404
- Error: `router_path_not_found`
- Status code: 404

**Solutions:**

1. **Check Build Output**
   ```bash
   # Verify index.html exists
   ls out/index.html
   
   # Check the out directory structure
   ls out/
   ```

2. **Verify Routing Configuration**
   - Ensure `public/_routes.json` has correct format (version 1)
   - Ensure `public/_redirects` exists with SPA redirect rule
   - Check `trailingSlash: false` in `next.config.ts`

3. **Rebuild and Redeploy**
   ```bash
   # Clean build
   rm -rf out .next
   
   # Rebuild
   npm run build
   
   # Check output
   ls out/
   
   # Redeploy to Appwrite
   ```

4. **Check Appwrite Console Settings**
   - Go to **Settings** > **Hosting**
   - Verify **Output Directory** is set to `out`
   - Verify **Root Directory** is `.` or empty
   - Click **Redeploy** to trigger new deployment

5. **Environment Variables**
   - In Appwrite Console, go to **Settings** > **Environment Variables**
   - Add all variables from `.env.local`:
     ```
     NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
     NEXT_PUBLIC_APPWRITE_PROJECT_ID=68fcedbf001c29286f39
     NEXT_PUBLIC_APPWRITE_DATABASE_ID=localaid_db
     NEXT_PUBLIC_APPWRITE_COLLECTION_USERS=users
     NEXT_PUBLIC_APPWRITE_COLLECTION_REQUESTS=requests
     NEXT_PUBLIC_APPWRITE_COLLECTION_RESOURCES=resources
     NEXT_PUBLIC_APPWRITE_COLLECTION_MATCHES=matches
     ```

### Issue: Assets not loading (CSS/JS 404)

**Solution:**
```json
// Update public/_routes.json to include assets
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/_next/*", "/static/*"]
}
```

### Issue: Client-side routing not working

**Solution:**
- Ensure `_redirects` file is in `public/` folder
- Content should be: `/*    /index.html   200`
- This tells Appwrite to serve `index.html` for all routes (SPA behavior)

### Issue: Build fails on Appwrite

**Check Build Logs:**
1. Go to Appwrite Console > Your Project > Deployments
2. Click on the failed deployment
3. View build logs

**Common fixes:**
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility (Appwrite uses Node 18+)
- Verify build command is `npm run build`

## Alternative: Deploy to Vercel (Recommended for Production)

Since Appwrite static hosting is newer, you might want to use Vercel for more reliability:

### Deploy to Vercel

1. **Push to GitHub** (already done)

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click **Import Project**
   - Select `shiv669/LocalAid`
   - Vercel auto-detects Next.js configuration

3. **Add Environment Variables**
   - Add all variables from `.env.local`

4. **Deploy**
   - Click **Deploy**
   - Your site will be live at `https://localaid-connect.vercel.app`

### Benefits of Vercel:
- ✅ Automatic deployments on push
- ✅ Preview deployments for PRs
- ✅ Edge network for fast global delivery
- ✅ Better Next.js optimization
- ✅ Built-in analytics

## Current Status

- ✅ Local build successful (`npm run build`)
- ✅ Static export configured
- ✅ Appwrite configuration files created
- ⚠️ Appwrite deployment: Needs manual configuration in Console
- ✅ Ready for Vercel deployment

## Next Steps

1. **Try Appwrite Console Deployment**
   - Follow "Option 1" above
   - Check deployment logs if it fails
   - Share error messages for debugging

2. **Or Deploy to Vercel** (Faster & Easier)
   - More reliable for Next.js apps
   - Better developer experience
   - Automatic HTTPS and CDN

## Support

If you continue to experience issues:
1. Check Appwrite deployment logs in Console
2. Verify all configuration files are committed to Git
3. Try Vercel as an alternative (it works perfectly with Next.js)
4. Open an issue on GitHub with error logs

---

**Last Updated:** October 26, 2025
**Build Status:** ✅ Successful
**Deployment Target:** Appwrite Cloud / Vercel
