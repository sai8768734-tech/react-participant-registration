# Cloudflare Pages Deployment Guide

## Step-by-Step Instructions

### 1. Prepare Your Repository
✅ Make sure all code is committed and pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin main
```

### 2. Go to Cloudflare Dashboard
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Create a project** → **Connect to Git**

### 3. Connect Your GitHub Repository
1. Authorize Cloudflare to access your GitHub account (if not already done)
2. Select your repository: `sai8768734-tech/react-participant-registration`
3. Click **Begin setup**

### 4. Configure Build Settings

**Project name:** `react-participant-registration` (or your preferred name)

**Production branch:** `main`

**Build command:**
```
npm run build
```

**Build output directory:**
```
client/dist
```

**Root directory:** Leave empty (or set to `/`)

### 5. Set Environment Variables (Important!)

Click **Environment variables** and add:

**Variable name:** `VITE_API_URL`  
**Value:** Your backend server URL (e.g., `https://your-backend.railway.app` or `https://your-backend.render.com`)

**Note:** If you haven't deployed the backend yet, you can set this later. For now, you can use a placeholder, but the app won't work until you set the correct backend URL.

### 6. Deploy
1. Click **Save and Deploy**
2. Cloudflare will start building your project
3. Wait for the build to complete (usually 2-5 minutes)

### 7. Access Your Deployed Site
Once deployment is complete, Cloudflare will provide you with a URL like:
- `https://react-participant-registration.pages.dev`

You can also set up a custom domain if you have one.

## Important Notes

### Backend Deployment Required
⚠️ **The backend (Node.js server) must be deployed separately** on a Node.js hosting service:
- **Render** (recommended): See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **Fly.io**: https://fly.io

**For Render deployment:** Follow the step-by-step guide in `RENDER_DEPLOYMENT.md`

After deploying the backend, update the `VITE_API_URL` environment variable in Cloudflare Pages to point to your backend URL.

### Backend CORS Configuration
Make sure to update `server/server.js` to allow your Cloudflare Pages domain in CORS:

```javascript
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://your-app.pages.dev",  // Add your Cloudflare Pages URL
      "https://your-custom-domain.com"  // Add your custom domain if applicable
    ],
    methods: ["GET", "POST"]
  }
});
```

### Troubleshooting

**Build fails with "package.json not found":**
- Make sure you've pushed the latest commit with the root `package.json`
- Check that the build command is `npm run build` (not `cd client && npm run build`)

**Build succeeds but site shows blank page:**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Make sure backend is deployed and accessible

**API calls fail:**
- Verify backend CORS settings include your Cloudflare Pages URL
- Check that `VITE_API_URL` environment variable is set correctly
- Ensure backend server is running and accessible

## Quick Deploy Checklist

- [ ] Code pushed to GitHub (main branch)
- [ ] Root `package.json` exists with build script
- [ ] Cloudflare Pages project created
- [ ] Build command: `npm run build`
- [ ] Build output: `client/dist`
- [ ] Environment variable `VITE_API_URL` set
- [ ] Backend deployed separately
- [ ] Backend CORS updated with frontend URL

