# Push Notification Setup Guide

## Overview

This guide will help you set up Firebase Cloud Messaging (FCM) to enable push notifications in the NSS Portal app. Push notifications allow students to receive important updates even when they're not actively using the app.

## Prerequisites

- Firebase project created
- Firebase Admin SDK credentials
- Firebase project credentials for frontend

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: `nss-portal` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

## Step 2: Set Up Firebase Admin SDK (Backend)

### Generate Service Account Key

1. In Firebase Console, click the gear icon (⚙️) → Project Settings
2. Go to the "Service Accounts" tab
3. Click "Generate New Private Key"
4. A JSON file will download - keep it safe!
5. Copy the entire JSON content

### Add Firebase Credentials to Backend .env

In `backend/.env`, add:

```env
# Firebase Cloud Messaging
FIREBASE_CREDENTIALS='{"type":"service_account","project_id":"YOUR_PROJECT_ID","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"YOUR_PRIVATE_KEY","client_email":"YOUR_CLIENT_EMAIL","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"YOUR_CERT_URL"}'
```

⚠️ **Note:** Make sure to escape the JSON properly or use a JSON minifier.

### Install Backend Dependencies

```bash
cd backend
npm install firebase-admin
npm install
```

## Step 3: Set Up Firebase Web Config (Frontend)

### Get Web App Configuration

1. In Firebase Console, click the gear icon → Project Settings
2. Click the "Web" option (or add a new web app if needed)
3. Copy the firebase config object

### Add Firebase Config to Frontend .env

Create `frontend/.env.local` with:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY
```

### Get VAPID Key

1. In Firebase Console, go to Cloud Messaging tab
2. Look for "Web Push certificates"
3. Click "Generate Key Pair" if not already created
4. Copy the Public key - this is your VAPID_KEY

### Install Frontend Dependencies

```bash
cd frontend
npm install firebase
npm install
```

## Step 4: Enable Cloud Messaging in Firebase

1. Go to Firebase Console
2. Click on "Cloud Messaging" in the left menu
3. Make sure the Cloud Messaging API is enabled
4. Configure the "Default notification display" settings if needed

## Step 5: Add Notification Component to Your App

In your main App.js or appropriate component:

```javascript
import NotificationPreferences from "./components/NotificationPreferences";

function App() {
  return (
    <div>
      {/* Your existing content */}
      <NotificationPreferences />
      {/* Rest of your app */}
    </div>
  );
}
```

## Step 6: Start Sending Notifications

### From Backend API

Import and use the notification helper:

```javascript
const { notifyUser } = require("./utils/notificationHelper");

// Send notification to a specific user
await notifyUser(userId, "new-event", "A new event has been created!", {
  eventId: "event123",
  eventName: "Beach Cleanup",
});
```

### Notification Types Available

- `new-event` - New event notification
- `participation-approved` - Participation approved
- `participation-rejected` - Participation rejected
- `contribution-verified` - Certificate/contribution verified
- `certificate-issued` - New certificate available
- `system` - System messages

### Example: Send to Multiple Users

```javascript
const { notifyUsers } = require("./utils/notificationHelper");

const userIds = ["user1", "user2", "user3"];
await notifyUsers(userIds, "new-event", "Event registration opens tomorrow!", {
  eventDate: "2024-01-15",
});
```

### Example: Broadcast to All Students

```javascript
const { notifyAllStudents } = require("./utils/notificationHelper");

await notifyAllStudents(
  "system",
  "Important: Portfolio submission deadline extended",
  {
    deadline: "2024-01-20",
  }
);
```

## Step 7: Test Push Notifications

1. Open the app in your browser
2. Look for the "🔔 Push Notifications" section
3. Grant notification permission when prompted
4. You should see "Device Registered: ✅ Yes"
5. Send a test notification from the backend
6. The notification should appear on your device screen

## Troubleshooting

### Notifications not showing?

- Check that you've granted notification permission
- Verify Firebase credentials are set in .env files
- Check browser console for errors
- Make sure Service Worker is registered (look in DevTools > Application > Service Workers)

### "Firebase initialization error"?

- Verify all Firebase config values in frontend .env
- Check that FIREBASE_CREDENTIALS is valid JSON in backend .env
- Ensure Firebase Admin SDK is installed: `npm install firebase-admin`

### Service Worker registration fails?

- Make sure `firebase-messaging-sw.js` is in the `public` folder
- Check browser console for CORS issues
- Try clearing browser cache and reloading

### Invalid tokens being removed?

- This is normal! Firebase cleans up invalid tokens automatically
- The system will remove tokens that are no longer valid

## API Endpoints

### Register Device Token

```
POST /api/push-notifications/register-device
Body: { deviceToken, deviceType, deviceName }
```

### Unregister Device Token

```
POST /api/push-notifications/unregister-device
Body: { deviceToken }
```

### Get Registered Devices

```
GET /api/push-notifications/devices
```

### Update Notification Preferences

```
POST /api/push-notifications/preferences
Body: { eventNotifications, participationUpdates, certificateNotifications, systemNotifications }
```

### Get Notification Preferences

```
GET /api/push-notifications/preferences
```

## Security Notes

1. **Never commit .env files** with sensitive credentials
2. **Use environment variables** for all sensitive data
3. **Restrict Firebase rules** to authenticated users only
4. **Store device tokens securely** in your database
5. **Validate user permissions** before sending notifications
6. **Use HTTPS only** in production for secure communication

## Next Steps

- Integrate notifications into event creation flow
- Add notifications for participation status changes
- Add notifications when certificates are ready
- Create admin dashboard for sending broadcast notifications
- Set up notification analytics

## Support

For more information, visit:

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Web Setup Guide](https://firebase.google.com/docs/web/setup)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
