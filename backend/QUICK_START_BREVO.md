# 🚀 Brevo Quick Start Guide

## 1️⃣ Sign Up (2 minutes)

Go to: **https://www.brevo.com/**
- Click "Sign up free"
- Verify your email
- Complete account setup

## 2️⃣ Get API Key (1 minute)

Go to: **https://app.brevo.com/settings/keys/api**
- Click "Generate a new API key"
- Name it: "NSS Portal"
- Copy the key (save it!)

## 3️⃣ Verify Sender Email (2 minutes)

Go to: **https://app.brevo.com/senders**
- Click "Add a new sender"
- Enter your email
- Click verification link in email
- Wait for approval (instant)

## 4️⃣ Configure Backend (1 minute)

Edit `backend/.env`:
```env
BREVO_API_KEY=xkeysib-paste_your_key_here
BREVO_SENDER_EMAIL=your_verified_email@example.com
BREVO_SENDER_NAME=NSS Portal
```

## 5️⃣ Test (30 seconds)

```bash
cd backend
node utils/test-email.js
```

Expected output:
```
✅ Email sent successfully via Brevo!
```

## 6️⃣ Deploy

Add to your hosting platform's environment variables:
```
BREVO_API_KEY=xkeysib-your_key_here
BREVO_SENDER_EMAIL=your_email@example.com
BREVO_SENDER_NAME=NSS Portal
```

**Platforms:**
- **Render**: Settings → Environment
- **Heroku**: Settings → Config Vars
- **Vercel**: Settings → Environment Variables
- **Railway**: Variables tab

## ✅ Done!

Your emails will now work reliably in production!

---

**Total Time**: ~7 minutes  
**Cost**: Free (300 emails/day)  
**Support**: 24/7 available

**Questions?** Read `BREVO_SETUP_GUIDE.md` for detailed help.
