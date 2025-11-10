# Email Migration Checklist - Gmail to Brevo

## ✅ Completed Changes

### 1. Package Installation
- [x] Installed `@getbrevo/brevo` package
- [x] Updated `package.json` dependencies

### 2. Code Updates
- [x] Updated `backend/utils/notifications.js` to use Brevo API
- [x] Updated `backend/utils/certificateGenerator.js` to use Brevo API
- [x] Updated `backend/utils/test-email.js` for Brevo testing
- [x] Updated `backend/server.js` to show Brevo configuration status
- [x] Updated `backend/.env.example` with Brevo configuration

### 3. Documentation
- [x] Created `BREVO_SETUP_GUIDE.md` with detailed setup instructions
- [x] Created this migration checklist

## 🔧 Required Actions (You Need to Do This!)

### 1. Get Brevo API Key
- [ ] Sign up at [https://www.brevo.com/](https://www.brevo.com/)
- [ ] Go to [https://app.brevo.com/settings/keys/api](https://app.brevo.com/settings/keys/api)
- [ ] Generate a new API key
- [ ] Copy the API key (save it somewhere safe!)

### 2. Verify Sender Email
- [ ] Go to [https://app.brevo.com/senders](https://app.brevo.com/senders)
- [ ] Add your sender email address
- [ ] Click the verification link in the email Brevo sends you
- [ ] Wait for verification (usually instant)

### 3. Update Your .env File
- [ ] Open `backend/.env` file
- [ ] Add these lines:
```env
BREVO_API_KEY=your_actual_api_key_here
BREVO_SENDER_EMAIL=your_verified_email@example.com
BREVO_SENDER_NAME=NSS Portal
```

### 4. Test Email Configuration
- [ ] Run: `cd backend && node utils/test-email.js`
- [ ] Verify you receive the test email
- [ ] Check spam folder if you don't see it

### 5. Deploy to Production
- [ ] Add Brevo environment variables to your hosting platform:
  - Render: Settings → Environment → Add variables
  - Heroku: Settings → Config Vars → Add variables
  - Vercel: Settings → Environment Variables → Add variables
  - Railway: Variables → Add variables
- [ ] Redeploy your application
- [ ] Test email functionality in production

## 📝 Environment Variables Reference

### Required Variables
```env
BREVO_API_KEY=xkeysib-your_api_key_here
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=NSS Portal
```

### Optional Variables
```env
TEST_EMAIL=your_test_email@example.com
```

### Old Variables (Can be removed)
```env
# These are no longer needed
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🎯 Benefits of This Migration

1. **Better Deliverability**: Emails won't go to spam as often
2. **No Authentication Issues**: No need for app-specific passwords
3. **Works in Production**: Reliable in deployed environments
4. **Free Tier**: 300 emails/day for free
5. **Professional**: Email tracking and analytics included
6. **Easy Setup**: Just API key, no SMTP configuration

## 🔍 Testing Checklist

After setup, test these features:

- [ ] Registration confirmation email
- [ ] Approval notification email
- [ ] Event reminder email
- [ ] Contribution verified email
- [ ] New event notification (to all students)
- [ ] Certificate email with attachment

## 📊 Monitoring

Check your Brevo dashboard regularly:
- **Email Statistics**: [https://app.brevo.com/](https://app.brevo.com/)
- **Delivery Rate**: Should be >95%
- **Bounce Rate**: Should be <5%
- **Daily Limit**: 300 emails/day on free plan

## 🆘 Need Help?

1. Read `BREVO_SETUP_GUIDE.md` for detailed instructions
2. Check [Brevo Help Center](https://help.brevo.com/)
3. Contact Brevo support (24/7 available)

## 🚀 Next Steps

Once everything is working:
1. Monitor email delivery for a few days
2. Check spam rates in Brevo dashboard
3. Consider upgrading if you need more than 300 emails/day
4. Set up email templates in Brevo for better branding (optional)

---

**Status**: Migration code complete ✅  
**Action Required**: Configure Brevo account and update .env file ⚠️
