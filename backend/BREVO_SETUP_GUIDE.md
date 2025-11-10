# Brevo Email Service Setup Guide

## Why Brevo?

Brevo (formerly Sendinblue) is a reliable email service provider that offers:
- ✅ Better deliverability than Gmail SMTP
- ✅ 300 free emails per day
- ✅ No need for app-specific passwords
- ✅ Works reliably in production/deployment
- ✅ Professional email tracking and analytics
- ✅ No SMTP authentication issues

## Step-by-Step Setup

### 1. Create a Brevo Account

1. Go to [https://www.brevo.com/](https://www.brevo.com/)
2. Click **"Sign up free"**
3. Fill in your details and verify your email address
4. Complete the account setup

### 2. Get Your API Key

1. Log in to your Brevo account
2. Go to [https://app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)
3. Click **"Generate a new API key"**
4. Give it a name (e.g., "NSS Portal")
5. Copy the API key (you won't be able to see it again!)

### 3. Verify Your Sender Email

**Important:** You must verify the email address you want to send from.

1. Go to [https://app.brevo.com/senders](https://app.brevo.com/senders)
2. Click **"Add a new sender"**
3. Enter your email address (e.g., `noreply@yourdomain.com` or your personal email)
4. Brevo will send a verification email
5. Click the verification link in the email
6. Wait for approval (usually instant)

### 4. Configure Your Backend

Add these variables to your `backend/.env` file:

```env
# Brevo Email Configuration
BREVO_API_KEY=xkeysib-your_actual_api_key_here
BREVO_SENDER_EMAIL=your_verified_email@example.com
BREVO_SENDER_NAME=NSS Portal

# Test Email (optional - for testing)
TEST_EMAIL=your_test_recipient@example.com
```

**Example:**
```env
BREVO_API_KEY=xkeysib-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
BREVO_SENDER_EMAIL=noreply@nssportal.com
BREVO_SENDER_NAME=NSS Portal
TEST_EMAIL=admin@example.com
```

### 5. Test Your Configuration

Run the test email script to verify everything is working:

```bash
cd backend
node utils/test-email.js
```

You should see:
```
✅ Email sent successfully via Brevo!
Message ID: <some-message-id>
💡 Check your inbox (and spam folder) for the test email.
```

## Troubleshooting

### ❌ "Brevo API key not found"
- Make sure you added `BREVO_API_KEY` to your `.env` file
- Check that the `.env` file is in the `backend/` directory
- Restart your server after adding the key

### ❌ "Sender email not verified"
- Go to [https://app.brevo.com/senders](https://app.brevo.com/senders)
- Verify that your sender email is listed and has a green checkmark
- If not verified, click the verification link in the email Brevo sent you

### ❌ "Authentication failed"
- Double-check that you copied the entire API key correctly
- Make sure there are no extra spaces before or after the key
- Try generating a new API key

### ❌ "Daily sending limit exceeded"
- Free accounts have a limit of 300 emails per day
- Check your usage at [https://app.brevo.com/](https://app.brevo.com/)
- Consider upgrading your plan if you need more emails

### ❌ Emails going to spam
- Make sure your sender email is verified
- Use a professional sender name (e.g., "NSS Portal" not "test123")
- Avoid spam trigger words in subject lines
- Consider setting up SPF/DKIM records for your domain

## Email Features in NSS Portal

The following email notifications are sent automatically:

1. **Registration Confirmation** - When a student registers for an event
2. **Approval Notification** - When a registration is approved
3. **Event Reminder** - Reminder before event starts
4. **Contribution Verified** - When volunteer hours are added
5. **New Event Notification** - When a new event is created (sent to all students)
6. **Certificate Email** - Certificate sent as attachment after event completion

## Brevo Free Plan Limits

- ✅ 300 emails per day
- ✅ Unlimited contacts
- ✅ Email templates
- ✅ Real-time statistics
- ✅ 24/7 support

## Upgrading to Paid Plan

If you need more emails:
1. Go to [https://app.brevo.com/settings/plan](https://app.brevo.com/settings/plan)
2. Choose a plan based on your needs
3. Paid plans start at $25/month for 20,000 emails

## Additional Resources

- **Brevo Documentation:** [https://developers.brevo.com/](https://developers.brevo.com/)
- **API Reference:** [https://developers.brevo.com/reference](https://developers.brevo.com/reference)
- **Support:** [https://help.brevo.com/](https://help.brevo.com/)

## Migration Notes

### What Changed?

- ❌ Removed: `nodemailer` with Gmail SMTP
- ✅ Added: `@getbrevo/brevo` SDK
- ✅ Updated: `notifications.js` to use Brevo API
- ✅ Updated: `certificateGenerator.js` to use Brevo API
- ✅ Updated: `test-email.js` for Brevo testing

### Why the Switch?

Gmail SMTP often fails in production because:
- Requires app-specific passwords
- Has strict rate limits
- Gets blocked by many hosting providers
- Less reliable for automated emails

Brevo is designed for transactional emails and works reliably in production environments.

---

**Need Help?** Check the [Brevo Help Center](https://help.brevo.com/) or contact their support team.
