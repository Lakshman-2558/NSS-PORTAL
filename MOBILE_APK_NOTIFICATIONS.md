# 📱 Mobile APK Push Notifications Setup

## Current Issue
Your APK is a WebView wrapper that doesn't support Firebase Cloud Messaging (FCM) for web.

## Solution: Capacitor + FCM Plugin

### 1. Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "NSS Portal" "com.nss.portal"
```

### 2. Add FCM Plugin
```bash
npm install @capacitor/push-notifications
npm install @capacitor-firebase/messaging
```

### 3. Configure Android
```bash
npx cap add android
npx cap sync android
```

### 4. Update capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.nss.portal',
  appName: 'NSS Portal',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
```

### 5. Add Firebase Config to Android
- Copy `google-services.json` to `android/app/`
- Update `android/app/build.gradle`

### 6. Update Code for Native FCM
```javascript
import { PushNotifications } from '@capacitor/push-notifications';

// Register for push notifications
const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();
  
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }
  
  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }
  
  await PushNotifications.register();
};

// Listen for registration
PushNotifications.addListener('registration', (token) => {
  console.log('Push registration success, token: ' + token.value);
  // Send token to your backend
});

// Listen for push notifications
PushNotifications.addListener('pushNotificationReceived', (notification) => {
  console.log('Push received: ', notification);
});
```

### 7. Build APK
```bash
npm run build
npx cap copy android
npx cap open android
# Build APK in Android Studio
```

## Alternative: Use PWA Instead
- Users install from browser (Add to Home Screen)
- Full notification support
- No APK rebuild needed
- Works immediately with your current code
