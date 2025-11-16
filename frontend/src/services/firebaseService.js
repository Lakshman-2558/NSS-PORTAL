import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration - Note: Firebase client keys are safe for public use
// They are restricted by domain and have built-in security rules
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDWPP4KxT5pBiKhlcisWlp7146Nq0yoMb4",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "nssnotify-efe66.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "nssnotify-efe66",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "nssnotify-efe66.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "869691422272",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:869691422272:web:4dd1eebe5c24bf714811a5"
};

let app;
let messaging;

try {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async () => {
  try {
    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported in this browser');
      return null;
    }

    // Check if notification permission is supported
    if (!('Notification' in window)) {
      console.warn('Notifications are not supported in this browser');
      return null;
    }

    // Check current permission status
    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied by user');
      return null;
    }

    // Request permission if not granted
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('User denied notification permission');
        return null;
      }
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' }
    );
    console.log('Service Worker registered:', registration);

    // Get FCM token
    if (messaging) {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY || "BJ90JOZSFaV1fnpLj47sbadE-9DxxKlRzc456SJ0NRwUG_JPSiqHGCHv2Isy1ZwAro_fNKgGsVZpr9x14z2M80c"
      });
      console.log('FCM Token:', token);
      return token;
    }

    return null;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * Setup foreground message handler
 */
export const setupForegroundMessageHandler = (onMessageCallback) => {
  if (!messaging) {
    console.warn('Firebase messaging not initialized');
    return;
  }

  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);

    if (onMessageCallback) {
      onMessageCallback(payload);
    }

    // Show notification in foreground
    if (payload.notification) {
      new Notification(payload.notification.title, {
        icon: '/logo-nss.png',
        body: payload.notification.body,
        tag: 'nss-portal-notification',
        data: payload.data
      });
    }
  });
};

/**
 * Register device with backend
 */
export const registerDeviceToken = async (token, deviceType = 'web', deviceName = '') => {
  try {
    const response = await fetch('/api/push-notifications/register-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        deviceToken: token,
        deviceType,
        deviceName: deviceName || `${navigator.userAgent.substring(0, 50)}`
      })
    });

    const data = await response.json();
    if (data.success) {
      console.log('✅ Device registered successfully:', data.message);
      return true;
    } else {
      console.error('❌ Failed to register device:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error registering device:', error);
    return false;
  }
};

/**
 * Unregister device token
 */
export const unregisterDeviceToken = async (token) => {
  try {
    const response = await fetch('/api/push-notifications/unregister-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ deviceToken: token })
    });

    const data = await response.json();
    if (data.success) {
      console.log('✅ Device unregistered successfully');
      return true;
    } else {
      console.error('❌ Failed to unregister device');
      return false;
    }
  } catch (error) {
    console.error('Error unregistering device:', error);
    return false;
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await fetch('/api/push-notifications/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(preferences)
    });

    const data = await response.json();
    if (data.success) {
      console.log('✅ Preferences updated');
      return data.preferences;
    } else {
      console.error('❌ Failed to update preferences');
      return null;
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
    return null;
  }
};

/**
 * Get notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await fetch('/api/push-notifications/preferences', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();
    if (data.success) {
      return data.preferences;
    } else {
      console.error('❌ Failed to fetch preferences');
      return null;
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return null;
  }
};

/**
 * Get all registered devices
 */
export const getRegisteredDevices = async () => {
  try {
    const response = await fetch('/api/push-notifications/devices', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await response.json();
    if (data.success) {
      return data.devices;
    } else {
      console.error('❌ Failed to fetch devices');
      return [];
    }
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};

const firebaseServiceExports = {
  requestNotificationPermission,
  setupForegroundMessageHandler,
  registerDeviceToken,
  unregisterDeviceToken,
  updateNotificationPreferences,
  getNotificationPreferences,
  getRegisteredDevices
};

export default firebaseServiceExports;
