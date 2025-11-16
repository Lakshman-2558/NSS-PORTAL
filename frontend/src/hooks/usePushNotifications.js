import { useEffect, useState, useCallback } from 'react';
import {
  requestNotificationPermission,
  setupForegroundMessageHandler,
  registerDeviceToken,
  getNotificationPreferences,
  updateNotificationPreferences
} from '../services/firebaseService';

/**
 * Custom hook to handle push notifications
 */
export const usePushNotifications = () => {
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission || 'default');
  const [deviceToken, setDeviceToken] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if notifications are supported
  useEffect(() => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setNotificationSupported(supported);
  }, []);

  // Initialize push notifications
  useEffect(() => {
    if (!notificationSupported) return;

    const initializeNotifications = async () => {
      try {
        setLoading(true);
        
        // Request permission and get token
        const token = await requestNotificationPermission();
        
        if (token) {
          setDeviceToken(token);
          
          // Register device token with backend
          const registered = await registerDeviceToken(token, 'web');
          setIsRegistered(registered);
          
          // Fetch notification preferences
          const prefs = await getNotificationPreferences();
          if (prefs) {
            setPreferences(prefs);
          }
          
          // Setup foreground message handler
          setupForegroundMessageHandler((payload) => {
            console.log('Notification received:', payload);
            // You can emit custom events or update UI here
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error initializing notifications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();
  }, [notificationSupported]);

  // Update notification permission when it changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPermission = Notification.permission;
      if (currentPermission !== notificationPermission) {
        setNotificationPermission(currentPermission);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [notificationPermission]);

  // Update preferences
  const handleUpdatePreferences = useCallback(async (newPreferences) => {
    try {
      setLoading(true);
      const updated = await updateNotificationPreferences(newPreferences);
      if (updated) {
        setPreferences(updated);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notificationSupported,
    notificationPermission,
    deviceToken,
    isRegistered,
    preferences,
    loading,
    error,
    updatePreferences: handleUpdatePreferences
  };
};

export default usePushNotifications;
