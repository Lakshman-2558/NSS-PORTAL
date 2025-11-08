# NSS Activity Portal - Deployment Guide

This guide will help you deploy the NSS Activity Portal with the backend on **Render** and frontend on **Vercel** or **Netlify**.

## 📋 Prerequisites

Before deploying, ensure you have:
- A MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- A Cloudinary account for image uploads (free tier at https://cloudinary.com)
- A Gemini API key (if using AI features)
- Email credentials (Gmail with App Password recommended)

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Prepare MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas and create a free account
2. Create a new cluster (free tier M0)
3. Create a database user with username and password
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/nss-portal`)

### Step 2: Deploy to Render

1. **Create Render Account**: Go to https://render.com and sign up
2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Stack-Hack-master` repository
   
3. **Configure Service**:
   - **Name**: `nss-portal-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables**:
   Click "Advanced" and add these environment variables:
   
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-random-secret-key>
   EMAIL_USER=<your-email@gmail.com>
   EMAIL_PASS=<your-gmail-app-password>
   FRONTEND_URL=<will-add-after-frontend-deployment>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   GEMINI_API_KEY=<your-gemini-api-key>
   PORT=5000
   ```

   **To generate JWT_SECRET**: Run this in terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Deploy**: Click "Create Web Service"
6. **Copy Backend URL**: After deployment, copy your backend URL (e.g., `https://nss-portal-backend.onrender.com`)

---

## 🎨 Part 2: Deploy Frontend to Vercel (Option A)

### Step 1: Update Environment Variables

1. Open `frontend/.env.production`
2. Replace `https://your-backend-url.onrender.com/api` with your actual Render backend URL + `/api`
   ```
   REACT_APP_API_URL=https://nss-portal-backend.onrender.com/api
   ```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com and sign up
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   - Add Environment Variable:
     - `REACT_APP_API_URL` = `https://nss-portal-backend.onrender.com/api`
   - Click "Deploy"

3. **Copy Frontend URL**: After deployment, copy your frontend URL (e.g., `https://nss-portal.vercel.app`)

### Step 3: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Save changes (this will redeploy the backend)

---

## 🎨 Part 2: Deploy Frontend to Netlify (Option B)

### Step 1: Update Environment Variables

Same as Vercel - update `frontend/.env.production` with your backend URL.

### Step 2: Deploy to Netlify

1. **Deploy via Netlify Dashboard**:
   - Go to https://www.netlify.com and sign up
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/build`
   - Add Environment Variable:
     - `REACT_APP_API_URL` = `https://nss-portal-backend.onrender.com/api`
   - Click "Deploy site"

2. **Copy Frontend URL**: After deployment, copy your frontend URL

3. **Update Backend**: Same as Vercel - update `FRONTEND_URL` in Render

---

## ✅ Verification

After deployment, verify everything works:

1. **Backend Health Check**: Visit `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"NSS Activity Portal API is running"}`

2. **Frontend**: Visit your frontend URL
   - Landing page should load
   - Try logging in
   - Check if notifications work (WebSocket connection)

---

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
- Verify MongoDB Atlas connection string
- Check if IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

**Environment Variables Not Loading**:
- Check all required variables are set in Render
- Redeploy the service after adding variables

### Frontend Issues

**API Requests Failing**:
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Ensure backend `FRONTEND_URL` matches your frontend URL

**WebSocket Connection Failed**:
- Check if backend URL in SocketContext is correct
- Verify Render service is running
- Check browser console for connection errors

### Free Tier Limitations

**Render Free Tier**:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for one service)

**Solution**: Consider upgrading to paid tier or use Render's "Keep Alive" feature

---

## 📝 Post-Deployment Tasks

1. **Update CORS**: Ensure backend CORS allows your frontend URL
2. **Test All Features**:
   - User registration/login
   - Event creation and management
   - File uploads (Cloudinary)
   - Email notifications
   - Certificate generation
   - AI assistant (if enabled)
3. **Monitor Logs**: Check Render logs for any errors
4. **Set Up Custom Domain** (optional):
   - Vercel/Netlify: Add custom domain in dashboard
   - Render: Add custom domain in service settings

---

## 🔐 Security Checklist

- ✅ All sensitive data in environment variables
- ✅ JWT_SECRET is strong and random
- ✅ MongoDB Atlas IP whitelist configured
- ✅ CORS properly configured
- ✅ Email credentials use App Password (not main password)
- ✅ API keys not exposed in frontend code

---

## 📞 Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test API endpoints directly using Postman or curl

---

## 🎉 Success!

Your NSS Activity Portal should now be live and accessible from anywhere! 🚀

**Backend**: https://your-backend-url.onrender.com
**Frontend**: https://your-frontend-url.vercel.app (or .netlify.app)
