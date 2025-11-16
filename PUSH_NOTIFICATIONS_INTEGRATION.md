# Push Notifications Integration Examples

This document shows how to integrate push notifications into your existing routes.

## Example 1: Notify Students When New Event is Created

**File:** `backend/routes/events.js`

```javascript
const { notifyAllStudents } = require("../utils/notificationHelper");

// In your POST /api/events route (create event):
router.post("/", auth, authorize(["admin", "faculty"]), async (req, res) => {
  try {
    // ... your existing event creation code ...

    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      // ... other fields ...
    });

    // Send push notification to all students
    await notifyAllStudents("new-event", `📅 New Event: ${event.title}`, {
      eventId: event._id.toString(),
      eventTitle: event.title,
      eventDate: event.eventDate,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Example 2: Notify Student About Participation Status

**File:** `backend/routes/participations.js`

```javascript
const { notifyUser } = require("../utils/notificationHelper");

// In your participation approval endpoint:
router.put(
  "/:id/approve",
  auth,
  authorize(["admin", "faculty"]),
  async (req, res) => {
    try {
      const participation = await Participation.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      ).populate("student");

      // Send notification to student
      await notifyUser(
        participation.student._id,
        "participation-approved",
        `✅ Your participation for "${participation.eventTitle}" has been approved!`,
        {
          participationId: participation._id.toString(),
          eventTitle: participation.eventTitle,
        }
      );

      res.json(participation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Reject participation:
router.put(
  "/:id/reject",
  auth,
  authorize(["admin", "faculty"]),
  async (req, res) => {
    try {
      const participation = await Participation.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      ).populate("student");

      // Send notification to student
      await notifyUser(
        participation.student._id,
        "participation-rejected",
        `❌ Your participation for "${participation.eventTitle}" was not approved.`,
        {
          participationId: participation._id.toString(),
          eventTitle: participation.eventTitle,
          reason: req.body.reason,
        }
      );

      res.json(participation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
```

## Example 3: Notify When Certificate is Generated

**File:** `backend/routes/certificates.js`

```javascript
const { notifyUser } = require("../utils/notificationHelper");

// In your certificate generation endpoint:
router.post(
  "/generate/:userId",
  auth,
  authorize(["admin", "faculty"]),
  async (req, res) => {
    try {
      // ... your existing certificate generation code ...

      const certificate = await Certificate.create({
        user: userId,
        eventTitle: req.body.eventTitle,
        // ... other fields ...
      });

      // Send notification to user
      await notifyUser(
        userId,
        "certificate-issued",
        `🏆 Your certificate for "${req.body.eventTitle}" is ready!`,
        {
          certificateId: certificate._id.toString(),
          eventTitle: req.body.eventTitle,
        }
      );

      res.json(certificate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
```

## Example 4: Notify Multiple Users

**File:** `backend/routes/notifications.js` (or any admin route)

```javascript
const { notifyUsers } = require("../utils/notificationHelper");

// Send notification to specific users:
router.post("/send-bulk", auth, authorize(["admin"]), async (req, res) => {
  try {
    const { userIds, title, message, data } = req.body;

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ error: "userIds must be a non-empty array" });
    }

    if (!title || !message) {
      return res.status(400).json({ error: "title and message are required" });
    }

    // Send notifications
    const results = await notifyUsers(userIds, "system", message, {
      title,
      ...data,
    });

    res.json({
      success: true,
      sentTo: userIds.length,
      message: `Notification sent to ${userIds.length} users`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Example 5: Broadcast System Announcement

**File:** `backend/routes/admin.js` (or similar)

```javascript
const { broadcastNotification } = require("../utils/notificationHelper");

// Send announcement to all users via topic:
router.post("/broadcast", auth, authorize(["admin"]), async (req, res) => {
  try {
    const { title, message } = req.body;

    // Send to all users
    const result = await broadcastNotification(
      "system-announcements",
      title,
      message,
      { type: "system-announcement" }
    );

    res.json({
      success: true,
      message: "Announcement sent to all users",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Example 6: Scheduled Notifications

**File:** `backend/utils/scheduledNotifications.js` (new file)

```javascript
const cron = require("node-cron");
const Event = require("../models/Event");
const User = require("../models/User");
const { notifyUsers } = require("./notificationHelper");

/**
 * Send reminder notifications 24 hours before event
 */
const scheduleEventReminders = () => {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find events happening tomorrow
      const events = await Event.find({
        eventDate: {
          $gte: new Date(
            tomorrow.getFullYear(),
            tomorrow.getMonth(),
            tomorrow.getDate()
          ),
          $lt: new Date(
            tomorrow.getFullYear(),
            tomorrow.getMonth(),
            tomorrow.getDate() + 1
          ),
        },
        status: "published",
      }).populate("registeredStudents");

      for (const event of events) {
        const studentIds = event.registeredStudents.map((s) => s._id);

        if (studentIds.length > 0) {
          await notifyUsers(
            studentIds,
            "event-reminder",
            `⏰ Reminder: "${event.title}" is happening tomorrow!`,
            {
              eventId: event._id.toString(),
              eventTitle: event.title,
              eventDate: event.eventDate,
            }
          );
        }
      }
    } catch (error) {
      console.error("Error scheduling event reminders:", error);
    }
  });
};

/**
 * Send notifications for certificates expiring soon
 */
const scheduleCertificateExpiryNotifications = () => {
  // Run daily at 9 AM
  cron.schedule("0 9 * * *", async () => {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const Certificate = require("../models/Notification");

      // Find certificates expiring in 30 days
      const expiringCertificates = await Certificate.find({
        expiryDate: {
          $gte: new Date(),
          $lte: thirtyDaysFromNow,
        },
        notificationSent: false,
      });

      for (const cert of expiringCertificates) {
        await notifyUser(
          cert.user,
          "certificate-expiry",
          `⚠️ Your certificate "${cert.eventTitle}" will expire soon!`,
          {
            certificateId: cert._id.toString(),
            expiryDate: cert.expiryDate,
          }
        );

        // Mark as notified
        cert.notificationSent = true;
        await cert.save();
      }
    } catch (error) {
      console.error(
        "Error scheduling certificate expiry notifications:",
        error
      );
    }
  });
};

module.exports = {
  scheduleEventReminders,
  scheduleCertificateExpiryNotifications,
};
```

Then initialize in `server.js`:

```javascript
const {
  scheduleEventReminders,
  scheduleCertificateExpiryNotifications,
} = require("./utils/scheduledNotifications");

// After other initializations:
scheduleEventReminders();
scheduleCertificateExpiryNotifications();
```

## Best Practices

1. **Always check user preferences** before sending notifications

   ```javascript
   const user = await User.findById(userId);
   if (!user.notificationPreferences.eventNotifications) {
     return; // Skip notification
   }
   ```

2. **Use meaningful notification types** for analytics
3. **Include relevant data** for deep linking (opening correct page when tapped)
4. **Avoid notification spam** - don't send too many at once
5. **Test thoroughly** before pushing to production
6. **Monitor notification delivery** - log success/failure

## Testing

Use this simple test endpoint:

```javascript
router.post("/test-notification", auth, async (req, res) => {
  try {
    const { notifyUser } = require("../utils/notificationHelper");

    await notifyUser(req.user.id, "system", "🧪 This is a test notification!", {
      type: "test",
    });

    res.json({ success: true, message: "Test notification sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Then call:

```
POST /api/test-notification
```

## Troubleshooting Integration

- **Notifications not sending?** Check that Firebase is initialized
- **Device tokens getting cleaned up?** This is normal - users on multiple devices will have multiple tokens
- **Preferences not working?** Make sure to check user preferences before sending
- **Errors in logs?** Check Firebase service account credentials in .env
