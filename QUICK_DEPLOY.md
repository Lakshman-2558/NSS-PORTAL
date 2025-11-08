# 🚀 Quick Deployment Guide

## Choose Your Deployment Method

### 🎯 Recommended: Vercel (Frontend) + Render (Backend)

This is the easiest and most reliable free option.

---

## 📦 Step-by-Step Deployment

### Part 1: Deploy Backend to Render (5 minutes)

1. **Go to [Render.com](https://render.com)** and sign up with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect your repository** and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables** (click "Advanced"):
   ```
   MONGODB_URI=<get-from-mongodb-atlas>
   JWT_SECRET=<generate-random-string>
   EMAIL_USER=<your-email>
   EMAIL_PASS=<gmail-app-password>
   FRONTEND_URL=<will-add-later>
   CLOUDINARY_CLOUD_NAME=<from-cloudinary>
   CLOUDINARY_API_KEY=<from-cloudinary>
   CLOUDINARY_API_SECRET=<from-cloudinary>
   GEMINI_API_KEY=<from-google-ai>
   ```

5. **Click "Create Web Service"** and wait for deployment

6. **Copy your backend URL** (e.g., `https://your-app.onrender.com`)

---

### Part 2: Deploy Frontend to Vercel (3 minutes)

1. **Update `frontend/.env.production`**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Go to [Vercel.com](https://vercel.com)** and sign up with GitHub

3. **Click "Add New" → "Project"**

4. **Import your repository** and configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Add Environment Variable**:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`

6. **Click "Deploy"**

7. **Copy your frontend URL** (e.g., `https://your-app.vercel.app`)

---

### Part 3: Update Backend with Frontend URL (1 minute)

1. Go back to **Render Dashboard**
2. Click on your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` with your Vercel URL
5. **Save** (this will redeploy)

---

## ✅ Verify Deployment

1. **Backend Health Check**: 
   Visit `https://your-backend-url.onrender.com/api/health`
   Should see: `{"status":"OK",...}`

2. **Frontend**: 
   Visit your Vercel URL and try logging in

---

## 🔑 Getting Required Services

### MongoDB Atlas (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist all IPs: `0.0.0.0/0`
5. Get connection string

### Cloudinary (Free)
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Get credentials from dashboard

### Gemini API (Free)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key

### Gmail App Password
1. Enable 2-factor authentication on Gmail
2. Go to Google Account → Security → App Passwords
3. Generate new app password

---

## 🎉 Done!

Your app is now live! Share your Vercel URL with users.

**Note**: Render free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

For detailed troubleshooting, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
