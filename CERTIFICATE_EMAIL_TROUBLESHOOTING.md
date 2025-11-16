# Certificate Email Troubleshooting Guide

## Issues Fixed

### 1. ✅ Certificate URL Not Saved When Email Fails
**Problem:** If email sending failed, the certificate URL was never saved to the database, even though the certificate was generated and saved to the file system.

**Solution:** Modified `certificateGenerator.js` to save the certificate URL to the database BEFORE attempting to send the email. This ensures students can access their certificates even if email delivery fails.

### 2. ✅ Improved Error Logging
**Problem:** Insufficient logging made it difficult to diagnose email sending issues.

**Solution:** Added comprehensive logging throughout the email sending process:
- Brevo configuration status
- API instance availability
- Student email validation
- Sender details
- Attachment size
- Detailed error messages with response bodies

## Common Issues & Solutions

### Issue 1: Brevo API Key Not Configured
**Symptoms:**
- Console shows: "⚠️ Brevo not configured. Skipping certificate email."
- Certificates are generated but not emailed

**Solution:**
Check your `backend/.env` file has:
```env
BREVO_API_KEY=xkeysib-your_actual_api_key_here
BREVO_SENDER_EMAIL=your_verified_email@example.com
BREVO_SENDER_NAME=NSS Portal
```

**Verify:**
```bash
cd backend
node -e "require('dotenv').config(); console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? 'Set' : 'NOT SET');"
```

### Issue 2: Sender Email Not Verified in Brevo
**Symptoms:**
- Error: "Sender email not verified"
- Email sending fails with 400/403 errors

**Solution:**
1. Go to https://app.brevo.com/settings/senders
2. Add and verify your sender email
3. Update `BREVO_SENDER_EMAIL` in `.env` to match the verified email

### Issue 3: Students Have No Email Address
**Symptoms:**
- Console shows: "⚠️ Student [name] has no email address"
- Certificate generated but not sent

**Solution:**
Ensure all student accounts have valid email addresses in the database.

### Issue 4: Brevo API Rate Limiting
**Symptoms:**
- First few emails succeed, then fail
- Error: "Too many requests"

**Solution:**
The code already includes a 500ms delay between emails. If you have many students:
- Upgrade your Brevo plan for higher limits
- Or increase the delay in `certificateGenerator.js` line 340

### Issue 5: Certificate Template Not Found
**Symptoms:**
- Error: "Template file not found at: [path]"
- Certificate generation fails

**Solution:**
1. Ensure certificate template is uploaded via the admin panel
2. Check that the file exists in `backend/uploads/certificates/templates/`
3. Verify file permissions

## Testing Email Configuration

Run the test script:
```bash
cd backend
node utils/test-email.js
```

This will:
- Check if Brevo API key is configured
- Verify sender email settings
- Send a test email
- Display detailed diagnostics

## Checking Certificate Generation Status

### View Backend Logs
When generating certificates, look for these log messages:

**✅ Success:**
```
📜 ===== GENERATING CERTIFICATES FOR EVENT: [eventId] =====
✅ Event found: [Event Name]
📋 Found X students to receive certificates
📄 Generating certificate for: [Student Name]
💾 Certificate URL saved to database for [Student Name]
📧 Sending certificate email via Brevo to [email]
✅ Certificate email sent successfully to [email]
   Message ID: [id]
```

**⚠️ Email Failed (but certificate saved):**
```
💾 Certificate URL saved to database for [Student Name]
❌ Failed to send certificate email to [email]
   Error: [error message]
⚠️ Certificate generated but email failed for [Student Name]
```

### Check Database
Verify certificates were saved:
```javascript
// In MongoDB shell or Compass
db.participations.find({
  event: ObjectId("your_event_id"),
  "certificate.url": { $exists: true }
})
```

## Manual Email Resend (Future Enhancement)

If emails fail, students can still:
1. Download certificates from their profile/participation page
2. Admin can manually resend emails (feature to be implemented)

## Brevo Dashboard

Check email delivery status:
1. Go to https://app.brevo.com/
2. Click "Transactional" → "Email Logs"
3. Search for recent certificate emails
4. Check delivery status and any bounce/error messages

## Environment Variables Checklist

Required in `backend/.env`:
- [x] `BREVO_API_KEY` - Your Brevo API key
- [x] `BREVO_SENDER_EMAIL` - Verified sender email
- [ ] `BREVO_SENDER_NAME` - Sender name (optional, defaults to "NSS Portal")
- [ ] `BACKEND_URL` - Your backend URL (for certificate download links)

## Support

If issues persist:
1. Check Brevo account status and quota
2. Verify sender email is verified in Brevo
3. Check backend server logs for detailed error messages
4. Test with a single student first before bulk sending
5. Ensure students have valid email addresses in the database

## Recent Changes

**Date:** Nov 15, 2025

**Changes Made:**
1. Certificate URL now saved to database BEFORE email sending attempt
2. Enhanced error logging with detailed diagnostics
3. Better handling of email failures (certificate still accessible)
4. Added student email validation before sending
5. Improved console output for debugging

**Impact:**
- Students can now access certificates even if email delivery fails
- Easier to diagnose email sending issues
- More reliable certificate generation process
