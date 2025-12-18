# Render.com Backend Deployment Guide

## Step-by-Step Instructions

### 1. Prepare Your Repository
✅ Make sure all code is committed and pushed to GitHub:
```bash
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

### 2. Go to Render Dashboard
1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**

### 3. Connect Your GitHub Repository
1. Click **Connect account** if you haven't connected GitHub yet
2. Authorize Render to access your GitHub account
3. Select your repository: `sai8768734-tech/react-participant-registration`
4. Click **Connect**

### 4. Configure Web Service Settings

**Name:** `training-registration-backend` (or your preferred name)

**Region:** Choose closest to your users (e.g., `Oregon (US West)`)

**Branch:** `main`

**Root Directory:** `server`

**Environment:** `Node`

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### 5. Set Environment Variables

Click **Advanced** → **Add Environment Variable** and add:

**Variable:** `NODE_ENV`  
**Value:** `production`

**Variable:** `PORT`  
**Value:** `10000` (Render sets this automatically, but good to have)

**Variable:** `ALLOWED_ORIGINS`  
**Value:** `http://localhost:5173,https://your-cloudflare-pages-url.pages.dev`

**Important:** Replace `your-cloudflare-pages-url.pages.dev` with your actual Cloudflare Pages URL after you deploy the frontend.

**Example:**
```
http://localhost:5173,https://react-participant-registration.pages.dev
```

### 6. Select Plan
- Choose **Free** plan (or paid if you need more resources)

### 7. Deploy
1. Click **Create Web Service**
2. Render will start building and deploying your backend
3. Wait for deployment to complete (usually 2-5 minutes)

### 8. Get Your Backend URL
Once deployed, Render will provide you with a URL like:
- `https://training-registration-backend.onrender.com`

**Save this URL!** You'll need it for the frontend environment variable.

### 9. Update Frontend Environment Variable

After getting your Render backend URL:

1. Go to **Cloudflare Pages** dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to your Render backend URL:
   ```
   https://training-registration-backend.onrender.com
   ```
5. Trigger a new deployment (or it will auto-deploy)

### 10. Update Backend CORS (If Needed)

If you get CORS errors, update the `ALLOWED_ORIGINS` environment variable in Render:

1. Go to Render dashboard → Your service → **Environment**
2. Edit `ALLOWED_ORIGINS` to include your Cloudflare Pages URL:
   ```
   http://localhost:5173,https://react-participant-registration.pages.dev
   ```
3. Save and redeploy

## Important Notes

### Render Free Tier Limitations
- **Spins down after 15 minutes of inactivity** - First request after spin-down takes ~30 seconds
- **512MB RAM limit**
- **100GB bandwidth/month**

For production use, consider upgrading to a paid plan.

### Data Persistence
⚠️ **Important:** Render's free tier uses **ephemeral filesystem**. This means:
- Data in `participants.json` will be **lost** when the service restarts or redeploys
- For production, consider using a database (MongoDB, PostgreSQL, etc.)

For now, the JSON file will work for testing, but data won't persist across deployments.

### Socket.IO on Render
Socket.IO works on Render, but make sure:
- Your frontend uses the correct backend URL
- CORS is properly configured
- Both HTTP and WebSocket connections are allowed

## Troubleshooting

**Build fails:**
- Check that `server/package.json` exists
- Verify Node.js version (Render uses Node 18+ by default)

**Service won't start:**
- Check logs in Render dashboard
- Verify `startCommand` is correct: `npm start`
- Ensure `server.js` exists in the `server` directory

**CORS errors:**
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check that both HTTP and WebSocket origins match
- Make sure there are no trailing slashes in URLs

**Socket.IO not working:**
- Verify WebSocket support is enabled (should work by default on Render)
- Check browser console for connection errors
- Ensure `VITE_API_URL` in frontend matches backend URL exactly

## Quick Deploy Checklist

- [ ] Code pushed to GitHub (main branch)
- [ ] Render account created
- [ ] Web Service created
- [ ] Root Directory set to `server`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment variables set (NODE_ENV, PORT, ALLOWED_ORIGINS)
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Frontend `VITE_API_URL` updated in Cloudflare Pages
- [ ] Frontend redeployed

## Next Steps

1. Deploy backend to Render (follow steps above)
2. Deploy frontend to Cloudflare Pages
3. Update `VITE_API_URL` in Cloudflare Pages with Render backend URL
4. Update `ALLOWED_ORIGINS` in Render with Cloudflare Pages URL
5. Test the full application!

