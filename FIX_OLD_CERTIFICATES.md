# Fix Old Certificates - Migration Guide

## Problem
Students are seeing errors like:
```
Cannot GET /uploads/certificates/generated/cert_xxx.png
```

This happens because old certificates were stored locally and are trying to be accessed from the filesystem, which doesn't work in production.

## Solution

### Option 1: Run Migration Script (Recommended)

This script will automatically migrate all existing certificates from local storage to Cloudinary.

**Steps:**

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run the migration script:**
   ```bash
   node scripts/migrate-certificates-to-cloudinary.js
   ```

3. **Review the output:**
   The script will show:
   - How many certificates were migrated
   - How many were already on Cloudinary
   - How many files were not found (need regeneration)
   - Any errors

**Example Output:**
```
🚀 Starting certificate migration to Cloudinary...

✅ Connected to MongoDB

📋 Found 25 participations with certificates

📄 Processing: John Doe - Beach Cleanup Event
   Current URL: http://localhost:5000/uploads/certificates/generated/cert_xxx.png
   Local path: /backend/uploads/certificates/generated/cert_xxx.png
   ✅ File read successfully (245678 bytes)
   ☁️  Uploaded to Cloudinary: https://res.cloudinary.com/.../cert_xxx.png
   ✅ Database updated

============================================================
📊 Migration Summary:
============================================================
Total certificates found: 25
✅ Successfully migrated: 20
⏭️  Already on Cloudinary: 3
⚠️  Files not found: 2
❌ Failed: 0
============================================================
```

### Option 2: Regenerate Certificates via API

If the local files are missing or you want to regenerate certificates with updated templates:

**Using Postman/Thunder Client:**

1. **Login as Admin/Faculty** to get auth token

2. **POST** to regenerate certificates:
   ```
   POST http://localhost:5000/api/certificates/regenerate/:eventId
   Headers:
     Authorization: Bearer YOUR_AUTH_TOKEN
   ```

3. **Response:**
   ```json
   {
     "message": "Certificates regenerated successfully",
     "total": 15,
     "successful": 15,
     "failed": 0,
     "errors": []
   }
   ```

### Option 3: Manual Database Update (Quick Fix)

If you just want to clear old certificates and regenerate fresh ones:

**Using MongoDB Compass or Shell:**

```javascript
// Remove old certificate URLs
db.participations.updateMany(
  { 
    "certificate.url": { 
      $regex: "^http://localhost|^/uploads" 
    } 
  },
  { 
    $unset: { certificate: "" } 
  }
)

// Then regenerate certificates via admin panel
```

## Verification

After migration, verify certificates are working:

1. **Check Database:**
   ```javascript
   db.participations.find({
     "certificate.url": { $exists: true }
   }).limit(5)
   ```
   
   URLs should look like:
   ```
   https://res.cloudinary.com/your-cloud/image/upload/v1234567890/nss-certificates/cert_xxx.png
   ```

2. **Test Student Dashboard:**
   - Login as a student
   - Go to Dashboard or Profile
   - Check "My Certificates" section
   - Click "View" - should open certificate in new tab
   - Click "Download" - should download the certificate

3. **Test on Mobile:**
   - Open on mobile device
   - Certificates should open for viewing
   - Long press to save image

## Handling PDF Reports vs Image Certificates

### Certificates (PNG Images)
- Generated using Canvas
- Uploaded to Cloudinary as images
- Format: PNG
- Folder: `nss-certificates`
- View: Opens in browser
- Download: Uses `fl_attachment` flag

### Reports (PDF Documents)
- Generated using jsPDF
- Uploaded to Cloudinary as raw files
- Format: PDF
- Folder: `nss-reports`
- View: Opens in PDF viewer
- Download: Direct download link

### Frontend Handling

The download functions automatically detect file type:

```javascript
const handleDownload = (fileUrl, fileName) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isPDF = fileUrl.includes('.pdf') || fileUrl.includes('resource_type/raw');
  
  if (isMobile) {
    // Open in new tab for both PDF and images
    window.open(fileUrl, '_blank');
    toast.success(isPDF ? 'PDF opened!' : 'Certificate opened! Long press to save.');
  } else {
    // Desktop download
    let downloadUrl = fileUrl;
    
    if (fileUrl.includes('cloudinary.com')) {
      // Add attachment flag for Cloudinary
      downloadUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
    }
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.target = '_blank';
    link.click();
    
    toast.success('Download started!');
  }
};
```

## Troubleshooting

### Issue: Migration script can't find files

**Cause:** Local certificate files were deleted or never existed.

**Solution:** Use the regenerate endpoint to create new certificates.

### Issue: Cloudinary upload fails

**Cause:** Cloudinary credentials not configured or invalid.

**Solution:**
1. Check `backend/.env` has:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
2. Verify credentials at https://cloudinary.com/console
3. Restart backend server

### Issue: Certificates still showing old URLs

**Cause:** Database not updated or browser cache.

**Solution:**
1. Clear browser cache
2. Check database directly
3. Run migration script again
4. Regenerate certificates if needed

### Issue: Download not working on mobile

**Cause:** Mobile browsers handle downloads differently.

**Solution:** 
- The app opens certificates in new tab on mobile
- Users can long-press and save the image
- This is the standard mobile behavior

### Issue: PDF reports not downloading

**Cause:** PDF handling different from images.

**Solution:**
- PDFs use `resource_type: 'raw'` in Cloudinary
- Ensure proper MIME type handling
- Use `fl_attachment` flag for force download

## Prevention

To prevent this issue in the future:

1. ✅ **Always use Cloudinary** for file storage (already implemented)
2. ✅ **Never use local filesystem** for production files
3. ✅ **Test in production-like environment** before deploying
4. ✅ **Monitor Cloudinary usage** and quotas
5. ✅ **Backup Cloudinary credentials** securely

## Admin Panel Actions

Add these buttons to your admin certificate management page:

```javascript
// Regenerate certificates button
<button onClick={() => regenerateCertificates(eventId)}>
  🔄 Regenerate Certificates
</button>

// Function
const regenerateCertificates = async (eventId) => {
  try {
    const response = await api.post(`/certificates/regenerate/${eventId}`);
    toast.success(`Regenerated ${response.data.successful} certificates`);
  } catch (error) {
    toast.error('Failed to regenerate certificates');
  }
};
```

## Monitoring

Check Cloudinary dashboard regularly:

1. Go to https://cloudinary.com/console
2. Navigate to Media Library
3. Check `nss-certificates` folder
4. Verify certificates are being uploaded
5. Monitor storage usage and bandwidth

## Support

If issues persist:

1. Check backend logs for errors
2. Verify Cloudinary credentials
3. Test with a single certificate first
4. Check database for certificate URLs
5. Ensure event has certificate template configured

## Related Files

- `backend/scripts/migrate-certificates-to-cloudinary.js` - Migration script
- `backend/utils/certificateGenerator.js` - Certificate generation
- `backend/routes/certificates.js` - Certificate API endpoints
- `frontend/src/pages/Student/Dashboard.js` - Certificate display
- `frontend/src/pages/Student/Profile.js` - Certificate display
