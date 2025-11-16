const User = require('../models/User');
const Notification = require('../models/Notification');
const { 
  sendNotificationToDevice, 
  sendMulticastNotification,
  sendNotificationToTopic 
} = require('../services/firebaseService');

/**
 * Send notification to a specific user (both in-app and push)
 */
const notifyUser = async (userId, type, message, data = {}) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`User ${userId} not found`);
      return null;
    }

    // Check user notification preferences
    const preferences = user.notificationPreferences || {};
    let shouldSend = true;

    if (type === 'new-event' && !preferences.eventNotifications) shouldSend = false;
    if ((type === 'participation-approved' || type === 'participation-rejected') && !preferences.participationUpdates) shouldSend = false;
    if (type === 'contribution-verified' && !preferences.certificateNotifications) shouldSend = false;
    if (type === 'system' && !preferences.systemNotifications) shouldSend = false;

    if (!shouldSend) {
      console.log(`Notification disabled for user ${userId}, type: ${type}`);
      return null;
    }

    // Create in-app notification
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      data
    });

    // Send push notifications to all user devices
    if (user.deviceTokens && user.deviceTokens.length > 0) {
      const activeTokens = user.deviceTokens
        .filter(dt => dt.isActive)
        .map(dt => dt.token);

      if (activeTokens.length > 0) {
        // Prepare notification title based on type
        let title = 'NSS Portal';
        if (type === 'new-event') title = '📅 New Event';
        if (type === 'participation-approved') title = '✅ Participation Approved';
        if (type === 'participation-rejected') title = '❌ Participation Rejected';
        if (type === 'contribution-verified') title = '🎓 Certificate Ready';
        if (type === 'certificate-issued') title = '🏆 New Certificate';

        const pushResult = await sendMulticastNotification(
          activeTokens,
          title,
          message,
          { ...data, type, userId: userId.toString() }
        );

        // Clean up invalid tokens
        if (pushResult && pushResult.invalidTokens && pushResult.invalidTokens.length > 0) {
          user.deviceTokens = user.deviceTokens.filter(
            dt => !pushResult.invalidTokens.includes(dt.token)
          );
          await user.save();
          console.log(`Removed ${pushResult.invalidTokens.length} invalid tokens for user ${userId}`);
        }
      }
    }

    // Emit socket.io event if io available
    if (global.io) {
      global.io.to(`user-${userId}`).emit('notification', {
        id: notification._id,
        type,
        message,
        data,
        createdAt: notification.createdAt
      });
    }

    return notification;
  } catch (error) {
    console.error('Error notifying user:', error);
    return null;
  }
};

/**
 * Notify multiple users
 */
const notifyUsers = async (userIds, type, message, data = {}) => {
  const results = [];
  for (const userId of userIds) {
    const result = await notifyUser(userId, type, message, data);
    results.push(result);
  }
  return results;
};

/**
 * Notify all users of a certain role
 */
const notifyUsersByRole = async (role, type, message, data = {}) => {
  try {
    const users = await User.find({ role, isActive: true });
    const userIds = users.map(u => u._id);
    return await notifyUsers(userIds, type, message, data);
  } catch (error) {
    console.error('Error notifying users by role:', error);
    return null;
  }
};

/**
 * Notify all students
 */
const notifyAllStudents = async (type, message, data = {}) => {
  return await notifyUsersByRole('student', type, message, data);
};

/**
 * Broadcast to a topic (useful for large scale notifications)
 */
const broadcastNotification = async (topic, title, body, data = {}) => {
  try {
    return await sendNotificationToTopic(topic, title, body, data);
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    return null;
  }
};

module.exports = {
  notifyUser,
  notifyUsers,
  notifyUsersByRole,
  notifyAllStudents,
  broadcastNotification
};
