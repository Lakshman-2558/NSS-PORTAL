# 🔒 Security Setup Guide

## Environment Variables Setup

### Backend (.env)
```env
# Copy backend/.env.example to backend/.env and fill in your values
FIREBASE_CREDENTIALS={"type":"service_account",...your_firebase_service_account_json...}
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend (.env)
```env
# Copy frontend/.env.example to frontend/.env and fill in your values
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
```

## 🚨 Security Notes

1. **Never commit .env files** - They are in .gitignore
2. **Use environment variables** in production deployments
3. **Rotate keys regularly** for better security
4. **Firebase API keys** are safe for frontend use (they have domain restrictions)
5. **Service account JSON** must be kept secret (backend only)

## 🔧 Firebase Service Worker Config

The `firebase-messaging-sw.js` uses placeholders that should be replaced during build/deployment with actual values from environment variables.

## 📋 Deployment Checklist

- [ ] Set all environment variables in hosting platform
- [ ] Verify Firebase domain restrictions
- [ ] Test push notifications in production
- [ ] Monitor for any exposed secrets in logs
