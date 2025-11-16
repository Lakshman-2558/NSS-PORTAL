# 🚀 Push Notifications - Quick Start Guide

## Status: ✅ Backend Implementation Complete

Your push notification system has been fully implemented! Follow these steps to get it running.

---

## 📋 Quick Setup (5 Steps)

### Step 1: Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create Project"**
3. Enter project name: `nss-portal`
4. Click **"Create Project"**

---

### Step 2: Get Backend Credentials (3 minutes)

1. In Firebase Console, click **⚙️ Settings** → **Project Settings**
2. Go to **"Service Accounts"** tab
3. Click **"Generate New Private Key"**
4. Save the JSON file
5. Open the JSON file and copy the entire content

---

### Step 3: Configure Backend .env (2 minutes)

In `backend/.env`, add:

```env
FIREBASE_CREDENTIALS='[PASTE_ENTIRE_JSON_HERE]'
```

**Example:**

```env
FIREBASE_CREDENTIALS='{"type":"service_account","project_id":"nss-portal-abc123","private_key_id":"key123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...","client_email":"firebase-adminsdk@nss-portal.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/certificates"}'
```

---

### Step 4: Get Frontend Credentials (5 minutes)

1. In Firebase Console, click **⚙️ Settings** → **Project Settings**
2. Scroll down and find your Web App
3. Copy your **Firebase config**
4. Also go to **"Cloud Messaging"** tab
5. Look for **"Web Push certificates"**
6. Click **"Generate Key Pair"** if needed
7. Copy the **Public Key** (this is your VAPID_KEY)

---

### Step 5: Configure Frontend .env.local (2 minutes)

Create `frontend/.env.local` and add:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyD...
REACT_APP_FIREBASE_AUTH_DOMAIN=nss-portal.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=nss-portal
REACT_APP_FIREBASE_STORAGE_BUCKET=nss-portal.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123...
REACT_APP_FIREBASE_VAPID_KEY=BF_JqKhI...
```

---

## ✅ Installation

### Backend

```bash
cd backend
npm install firebase-admin
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install firebase
npm install
npm start
```

---

## 🧪 Test Push Notifications

### Step 1: Open App

- Go to `http://localhost:3000`
- Look for **"🔔 Push Notifications"** section
- Grant notification permission when prompted

### Step 2: Verify Registration

- You should see **"Device Registered: ✅ Yes"**
- Check notification preferences

### Step 3: Send Test Notification

```bash
# From terminal in backend folder
node -e "
const { notifyUser } = require('./utils/notificationHelper');
const userId = 'YOUR_USER_ID_HERE'; // Replace with actual user ID
notifyUser(userId, 'system', '🧪 This is a test notification!', { type: 'test' })
  .then(() => console.log('Notification sent!'))
  .catch(err => console.error('Error:', err));
"
```

Or test via API endpoint (if added):

```bash
curl -X POST http://localhost:5000/api/push-notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Step 4: Check Results

- Notification should appear on your screen
- Click it to open the app

---

## 🎯 How It Works

```
User opens app → Requests permission → Gets device token →
Sends token to backend → Backend stores token with user →
When event created/participation approved/certificate ready →
Backend sends push notification via Firebase →
Notification appears on device screen → User clicks to open app
```

---

## 📱 Where Notifications Appear

- **Desktop**: Browser notification on screen
- **Mobile Web**: System notification on lock screen
- **Android App**: System notification in notification center
- **iOS App**: System notification on lock screen

---

## 🔔 Automatic Notifications

The system automatically sends push notifications for:

### 1. **New Events** 📅

- When admin/faculty creates new event
- All students receive notification

### 2. **Participation Approved** ✅

- When participation is approved
- Student receives notification

### 3. **Participation Rejected** ❌

- When participation is rejected
- Student receives notification

### 4. **Certificates Ready** 🏆

- When certificates are generated
- Student receives notification

---

## 📊 Check Device Registrations

### Get All Registered Devices

```bash
curl http://localhost:5000/api/push-notifications/devices \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response:

```json
{
  "success": true,
  "devices": [
    {
      "deviceType": "web",
      "deviceName": "Mozilla/5.0 (Windows NT...)",
      "isActive": true,
      "registeredAt": "2025-01-15T10:30:00Z",
      "lastUsedAt": "2025-01-15T10:35:00Z"
    }
  ],
  "totalDevices": 1
}
```

---

## 🎛️ Control Notification Preferences

### Get Preferences

```bash
curl http://localhost:5000/api/push-notifications/preferences \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Preferences

```bash
curl -X POST http://localhost:5000/api/push-notifications/preferences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventNotifications": true,
    "participationUpdates": true,
    "certificateNotifications": true,
    "systemNotifications": false
  }'
```

---

## 🐛 Troubleshooting

### Problem: "Permission Denied"

**Solution:** Browser has blocked notifications

- Click lock icon in address bar
- Find "Notifications" setting
- Change to "Allow"
- Refresh page

### Problem: "Device not registering"

**Solution:** Check Firebase setup

1. Verify `FIREBASE_CREDENTIALS` in backend .env
2. Verify Firebase config in frontend .env.local
3. Check browser console for errors
4. Look at backend logs for Firebase errors

### Problem: "Notification not showing"

**Solution:** Check these in order

1. Is permission granted? (see app UI)
2. Is device registered? (check "✅ Yes")
3. Is notification type enabled? (check preferences)
4. Check browser DevTools > Application > Service Workers
5. Look at browser console for errors

### Problem: "Firebase initialization error"

**Solution:** Check credentials format

- JSON should be minified (no line breaks)
- All special characters must be properly escaped
- Test with JSON validator: https://jsonlint.com/

---

## 📚 Next Steps

1. ✅ **Complete Setup** - Follow steps above
2. ✅ **Test Notifications** - Send test notification
3. 📱 **Test on Mobile** - Try on Android/iOS
4. 👥 **Invite Users** - Have students test
5. 📊 **Monitor Delivery** - Check logs
6. 🎯 **Gather Feedback** - Improve based on usage

---

## 🔐 Security Checklist

- [ ] Never commit .env files with credentials
- [ ] Use strong Firebase security rules
- [ ] Only send to authenticated users
- [ ] Validate user permissions before sending
- [ ] Encrypt device tokens in transit (HTTPS)
- [ ] Regularly rotate service account keys
- [ ] Monitor for suspicious activity

---

## 📖 Additional Resources

- **Setup Details:** `PUSH_NOTIFICATIONS_SETUP.md`
- **Integration Examples:** `PUSH_NOTIFICATIONS_INTEGRATION.md`
- **Complete Summary:** `PUSH_NOTIFICATIONS_IMPLEMENTATION_SUMMARY.md`
- **Firebase Docs:** https://firebase.google.com/docs/cloud-messaging

---

## 💡 Pro Tips

1. **Batch Notifications** - Send to multiple users at once
2. **Respect Preferences** - Check user settings
3. **Test Thoroughly** - Test on multiple devices
4. **Monitor Delivery** - Track success/failure rates
5. **Keep Tokens Fresh** - Regularly refresh registrations
6. **Avoid Spam** - Don't send too many notifications

---

## ✨ Features Implemented

✅ Push notifications to devices
✅ Device token management
✅ User notification preferences
✅ Real-time service worker
✅ Multiple device support
✅ Deep linking to app pages
✅ Automatic invalid token cleanup
✅ Email + push combined
✅ Socket.IO + Firebase combined
✅ Batch sending support
✅ Topic-based broadcasting

---

## 🎉 You're All Set!

Your push notification system is ready to go!

**Next:** Create Firebase project and complete the configuration steps above.

**Questions?** Check the detailed guides or Firebase documentation.

**Need Help?** Check console logs for error messages.

---

**Last Updated:** November 15, 2025
**Version:** 1.0.0
