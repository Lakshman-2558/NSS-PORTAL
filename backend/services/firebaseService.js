const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let db;
let messaging;

const initializeFirebase = () => {
  try {
    // Check if Firebase credentials are provided via environment variable
    const firebaseCredentials = process.env.FIREBASE_CREDENTIALS;
    
    if (!firebaseCredentials) {
      console.warn('⚠️  FIREBASE_CREDENTIALS not set in environment. Push notifications will be disabled.');
      console.warn('   To enable push notifications, please set FIREBASE_CREDENTIALS in .env');
      return false;
    }

    const serviceAccount = JSON.parse(firebaseCredentials);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    messaging = admin.messaging();
    db = admin.firestore();
    
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error.message);
    return false;
  }
};

/**
 * Send a push notification to a specific device token
 */
const sendNotificationToDevice = async (deviceToken, title, body, data = {}) => {
  if (!messaging) {
    console.warn('⚠️  Firebase messaging not initialized');
    return null;
  }

  try {
    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      token: deviceToken
    };

    const response = await messaging.send(message);
    console.log('✅ Notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    
    // If token is invalid, return error code for cleanup
    if (error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered') {
      return { error: 'INVALID_TOKEN' };
    }
    
    return null;
  }
};

/**
 * Send a push notification to multiple devices
 */
const sendNotificationToMultipleDevices = async (deviceTokens, title, body, data = {}) => {
  if (!messaging) {
    console.warn('⚠️  Firebase messaging not initialized');
    return [];
  }

  try {
    const messages = deviceTokens.map(token => ({
      notification: {
        title,
        body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      token
    }));

    const response = await messaging.sendAll(messages);
    console.log(`✅ Sent ${response.successCount} notifications, ${response.failureCount} failed`);
    
    return response;
  } catch (error) {
    console.error('❌ Error sending multiple notifications:', error);
    return null;
  }
};

/**
 * Send a multicast notification (to max 500 devices at once)
 */
const sendMulticastNotification = async (deviceTokens, title, body, data = {}) => {
  if (!messaging) {
    console.warn('⚠️  Firebase messaging not initialized');
    return null;
  }

  try {
    // Firebase has a limit of 500 tokens per multicast
    const chunks = [];
    for (let i = 0; i < deviceTokens.length; i += 500) {
      chunks.push(deviceTokens.slice(i, i + 500));
    }

    let totalSuccessCount = 0;
    let totalFailureCount = 0;
    const invalidTokens = [];

    for (const chunk of chunks) {
      const message = {
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      };

      const response = await messaging.sendMulticast({
        ...message,
        tokens: chunk
      });

      totalSuccessCount += response.successCount;
      totalFailureCount += response.failureCount;

      // Collect invalid tokens
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          if (resp.error.code === 'messaging/invalid-registration-token' ||
              resp.error.code === 'messaging/registration-token-not-registered') {
            invalidTokens.push(chunk[idx]);
          }
        }
      });
    }

    console.log(`✅ Multicast sent to ${totalSuccessCount} devices, ${totalFailureCount} failed`);
    
    return {
      successCount: totalSuccessCount,
      failureCount: totalFailureCount,
      invalidTokens
    };
  } catch (error) {
    console.error('❌ Error sending multicast notification:', error);
    return null;
  }
};

/**
 * Subscribe a user token to a topic
 */
const subscribeToTopic = async (tokens, topic) => {
  if (!messaging) {
    console.warn('⚠️  Firebase messaging not initialized');
    return null;
  }

  try {
    const response = await messaging.subscribeToTopic(tokens, topic);
    console.log(`✅ Successfully subscribed to topic '${topic}'`);
    return response;
  } catch (error) {
    console.error(`❌ Error subscribing to topic '${topic}':`, error);
    return null;
  }
};

/**
 * Unsubscribe a user token from a topic
 */
const unsubscribeFromTopic = async (tokens, topic) => {
  if (!messaging) {
    console.warn('⚠️  Firebase messaging not initialized');
    return null;
  }

  try {
    const response = await messaging.unsubscribeFromTopic(tokens, topic);
    console.log(`✅ Successfully unsubscribed from topic '${topic}'`);
    return response;
  } catch (error) {
    console.error(`❌ Error unsubscribing from topic '${topic}':`, error);
    return null;
  }
};

/**
 * Send a notification to a topic (useful for broadcasts)
 */
const sendNotificationToTopic = async (topic, title, body, data = {}) => {
  if (!messaging) {
    console.warn('⚠️  Firebase messaging not initialized');
    return null;
  }

  try {
    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      topic
    };

    const response = await messaging.send(message);
    console.log(`✅ Notification sent to topic '${topic}':`, response);
    return response;
  } catch (error) {
    console.error(`❌ Error sending notification to topic '${topic}':`, error);
    return null;
  }
};

/**
 * Get Firebase messaging instance
 */
const getMessaging = () => messaging;

/**
 * Check if Firebase is initialized
 */
const isFirebaseInitialized = () => {
  return messaging !== undefined && messaging !== null;
};

module.exports = {
  initializeFirebase,
  sendNotificationToDevice,
  sendNotificationToMultipleDevices,
  sendMulticastNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendNotificationToTopic,
  getMessaging,
  isFirebaseInitialized
};
