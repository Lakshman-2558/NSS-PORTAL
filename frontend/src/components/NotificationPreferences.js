import React, { useState, useEffect } from 'react';
import usePushNotifications from '../hooks/usePushNotifications';
import toast from 'react-hot-toast';
import '../styles/NotificationPreferences.css';

const NotificationPreferences = () => {
  const {
    notificationSupported,
    notificationPermission,
    isRegistered,
    preferences,
    loading,
    error,
    updatePreferences
  } = usePushNotifications();

  const [localPreferences, setLocalPreferences] = useState({
    eventNotifications: true,
    participationUpdates: true,
    certificateNotifications: true,
    systemNotifications: true
  });

  // Load preferences when they're fetched
  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handlePreferenceChange = async (key) => {
    const newPreferences = {
      ...localPreferences,
      [key]: !localPreferences[key]
    };
    
    setLocalPreferences(newPreferences);
    
    const success = await updatePreferences(newPreferences);
    if (success) {
      toast.success('Notification preference updated');
    } else {
      toast.error('Failed to update preference');
      setLocalPreferences(localPreferences);
    }
  };

  if (!notificationSupported) {
    return (
      <div className="notification-preferences">
        <div className="alert alert-warning">
          <p>📱 Push notifications are not supported in your browser.</p>
          <p className="small">Try using a modern browser like Chrome, Firefox, or Edge.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-preferences">
      <div className="notification-header">
        <h3>🔔 Push Notifications</h3>
        <p className="subtitle">Receive notifications even when you're not using the app</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <p>⚠️ {error}</p>
        </div>
      )}

      <div className="notification-status">
        <div className="status-item">
          <span className="status-label">Notification Permission:</span>
          <span className={`status-value status-${notificationPermission}`}>
            {notificationPermission === 'granted' ? '✅ Granted' : 
             notificationPermission === 'denied' ? '❌ Denied' :
             '❓ Not decided'}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Device Registered:</span>
          <span className={`status-value ${isRegistered ? 'status-granted' : 'status-default'}`}>
            {isRegistered ? '✅ Yes' : '❌ No'}
          </span>
        </div>
      </div>

      {notificationPermission === 'granted' && isRegistered && (
        <div className="preferences-section">
          <h4>Notification Types</h4>
          <p className="section-subtitle">Choose which notifications you want to receive</p>

          <div className="preference-item">
            <label className="preference-label">
              <input
                type="checkbox"
                checked={localPreferences.eventNotifications}
                onChange={() => handlePreferenceChange('eventNotifications')}
                disabled={loading}
              />
              <span className="checkbox-label">
                <span className="icon">📅</span>
                <span className="text">Event Notifications</span>
              </span>
            </label>
            <p className="preference-description">Get notified about new events and updates</p>
          </div>

          <div className="preference-item">
            <label className="preference-label">
              <input
                type="checkbox"
                checked={localPreferences.participationUpdates}
                onChange={() => handlePreferenceChange('participationUpdates')}
                disabled={loading}
              />
              <span className="checkbox-label">
                <span className="icon">👥</span>
                <span className="text">Participation Updates</span>
              </span>
            </label>
            <p className="preference-description">Get notified about your participation status (approved/rejected)</p>
          </div>

          <div className="preference-item">
            <label className="preference-label">
              <input
                type="checkbox"
                checked={localPreferences.certificateNotifications}
                onChange={() => handlePreferenceChange('certificateNotifications')}
                disabled={loading}
              />
              <span className="checkbox-label">
                <span className="icon">🏆</span>
                <span className="text">Certificate Notifications</span>
              </span>
            </label>
            <p className="preference-description">Get notified when your certificates are ready</p>
          </div>

          <div className="preference-item">
            <label className="preference-label">
              <input
                type="checkbox"
                checked={localPreferences.systemNotifications}
                onChange={() => handlePreferenceChange('systemNotifications')}
                disabled={loading}
              />
              <span className="checkbox-label">
                <span className="icon">⚙️</span>
                <span className="text">System Notifications</span>
              </span>
            </label>
            <p className="preference-description">Get notified about important system messages</p>
          </div>
        </div>
      )}

      {notificationPermission === 'denied' && (
        <div className="alert alert-info">
          <p>🔒 You have blocked notifications for this site.</p>
          <p className="small">To enable notifications, go to your browser settings and allow notifications for NSS Portal.</p>
        </div>
      )}

      {notificationPermission === 'default' && (
        <div className="alert alert-info">
          <p>ℹ️ Click enable when prompted to receive push notifications.</p>
        </div>
      )}

      <div className="info-box">
        <h5>💡 How it works:</h5>
        <ul>
          <li>When you register a device, you'll receive notifications even when the app is closed</li>
          <li>Notifications appear on your device's home screen or lock screen</li>
          <li>You can control which types of notifications you want to receive</li>
          <li>Your device information is securely stored and never shared</li>
        </ul>
      </div>

      {loading && (
        <div className="loading-indicator">
          <span className="spinner"></span> Updating...
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences;
