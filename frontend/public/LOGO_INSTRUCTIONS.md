# Logo Setup Instructions

Please save the following images to complete the landing page setup:

## Required Images:

1. **NSS Logo** (`logo-nss.png`)
   - Save the NSS (National Service Scheme) logo
   - Location: `frontend/public/logo-nss.png`
   - This is the circular orange and white wheel logo
   - Used in the header section

2. **UEAC Logo** (`logo-ueac.png`) ⭐ PRIMARY LOGO
   - Save the UEAC (University Extension Activity Council) logo
   - Location: `frontend/public/logo-ueac.png`
   - This is the shield-shaped logo with the orange NSS wheel in the center
   - Has "UEAC" text at the bottom
   - Features: Navy blue shield border with orange NSS emblem
   - Used prominently in the UEAC section of the landing page
   - Dimensions: Recommended 400x400px or higher for best quality

## UEAC Logo Details:
The logo consists of:
- A shield/badge shape with navy blue border
- NSS wheel emblem (orange) in the center
- "UEAC" text at the bottom
- Clean, professional design

## How to Add Images:

1. **Extract the UEAC logo** from the provided image
   - Crop the logo carefully to include the full shield
   - Remove any white/background space around it
   - Ensure the logo is centered

2. **Save as PNG files**
   - Use PNG format with transparent background (if possible)
   - Recommended size: 400x400px minimum
   - Keep aspect ratio to avoid distortion

3. **Place in the correct location**
   - Save to `frontend/public/` folder
   - Use exact filenames: `logo-nss.png` and `logo-ueac.png`

4. **Restart the development server** if it's already running
   ```bash
   npm start
   ```

5. **Verify the logo displays correctly**
   - The UEAC logo will appear in a dedicated section below the features
   - It will have a blue border and animated glow effect
   - If the image doesn't load, a fallback SVG icon will display

## Current Status:

The landing page has fallback SVG icons that will automatically be replaced once you add the actual logo files. The page is fully functional with or without the actual logos.

## Need Help?

If the logos don't appear after adding them:
1. Check the file names match exactly (case-sensitive)
2. Verify the files are in `frontend/public/` directory
3. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
4. Restart the development server
