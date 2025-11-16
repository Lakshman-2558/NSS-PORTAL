const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { subscribeToTopic, unsubscribeFromTopic } = require('../services/firebaseService');

/**
 * Register a device token for push notifications
 * POST /api/push-notifications/register-device
 */
router.post('/register-device', auth, async (req, res) => {
  try {
    const { deviceToken, deviceType = 'web', deviceName } = req.body;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if token already exists
    const existingTokenIndex = user.deviceTokens.findIndex(
      dt => dt.token === deviceToken
    );

    if (existingTokenIndex !== -1) {
      // Update existing token
      user.deviceTokens[existingTokenIndex].lastUsedAt = new Date();
      user.deviceTokens[existingTokenIndex].isActive = true;
    } else {
      // Add new token
      user.deviceTokens.push({
        token: deviceToken,
        deviceType,
        deviceName,
        isActive: true,
        registeredAt: new Date(),
        lastUsedAt: new Date()
      });
    }

    await user.save();

    // Subscribe to user topic for targeted notifications
    const userTopic = `user-${user._id}`;
    await subscribeToTopic([deviceToken], userTopic);

    res.json({
      success: true,
      message: 'Device token registered successfully',
      totalDevices: user.deviceTokens.length
    });
  } catch (error) {
    console.error('Error registering device token:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering device',
      error: error.message
    });
  }
});

/**
 * Unregister a device token
 * POST /api/push-notifications/unregister-device
 */
router.post('/unregister-device', auth, async (req, res) => {
  try {
    const { deviceToken } = req.body;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove token
    user.deviceTokens = user.deviceTokens.filter(dt => dt.token !== deviceToken);
    await user.save();

    // Unsubscribe from user topic
    const userTopic = `user-${user._id}`;
    await unsubscribeFromTopic([deviceToken], userTopic);

    res.json({
      success: true,
      message: 'Device token unregistered successfully',
      totalDevices: user.deviceTokens.length
    });
  } catch (error) {
    console.error('Error unregistering device token:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering device',
      error: error.message
    });
  }
});

/**
 * Get all registered devices
 * GET /api/push-notifications/devices
 */
router.get('/devices', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      devices: user.deviceTokens.map(dt => ({
        deviceType: dt.deviceType,
        deviceName: dt.deviceName,
        isActive: dt.isActive,
        registeredAt: dt.registeredAt,
        lastUsedAt: dt.lastUsedAt
      })),
      totalDevices: user.deviceTokens.length
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching devices',
      error: error.message
    });
  }
});

/**
 * Update notification preferences
 * POST /api/push-notifications/preferences
 */
router.post('/preferences', auth, async (req, res) => {
  try {
    const { eventNotifications, participationUpdates, certificateNotifications, systemNotifications } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (eventNotifications !== undefined) user.notificationPreferences.eventNotifications = eventNotifications;
    if (participationUpdates !== undefined) user.notificationPreferences.participationUpdates = participationUpdates;
    if (certificateNotifications !== undefined) user.notificationPreferences.certificateNotifications = certificateNotifications;
    if (systemNotifications !== undefined) user.notificationPreferences.systemNotifications = systemNotifications;

    await user.save();

    res.json({
      success: true,
      message: 'Notification preferences updated',
      preferences: user.notificationPreferences
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
});

/**
 * Get notification preferences
 * GET /api/push-notifications/preferences
 */
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      preferences: user.notificationPreferences || {
        eventNotifications: true,
        participationUpdates: true,
        certificateNotifications: true,
        systemNotifications: true
      }
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching preferences',
      error: error.message
    });
  }
});

module.exports = router;
