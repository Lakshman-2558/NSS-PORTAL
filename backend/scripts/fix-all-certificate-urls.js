/**
 * Comprehensive Certificate URL Fix
 * 
 * This script fixes various certificate URL issues:
 * 1. localhost URLs -> production backend URLs
 * 2. relative paths -> full URLs
 * 3. broken URLs -> regenerate certificates
 * 
 * Usage: node scripts/fix-all-certificate-urls.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Participation = require('../models/Participation');

async function fixAllCertificateUrls() {
    try {
        console.log('\n🔧 Starting comprehensive certificate URL fix...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const productionBackendUrl = 'https://nss-portal-backend.onrender.com';

        // Find all participations with certificates
        const participations = await Participation.find({
            'certificate.url': { $exists: true, $ne: null }
        }).populate('student', 'name email').populate('event', 'title');

        console.log(`📋 Found ${participations.length} certificates to check\n`);

        let fixed = 0;
        let alreadyGood = 0;
        let needsRegeneration = 0;

        for (const participation of participations) {
            try {
                const oldUrl = participation.certificate.url;
                let newUrl = oldUrl;
                let needsUpdate = false;

                console.log(`📄 Checking: ${participation.student.name} - ${participation.event.title}`);
                console.log(`   Current URL: ${oldUrl}`);

                // Case 1: localhost URLs
                if (oldUrl.includes('localhost:5000')) {
                    newUrl = oldUrl.replace('http://localhost:5000', productionBackendUrl);
                    needsUpdate = true;
                    console.log(`   🔧 Fixed localhost URL`);
                }
                // Case 2: relative paths starting with /uploads
                else if (oldUrl.startsWith('/uploads')) {
                    newUrl = `${productionBackendUrl}${oldUrl}`;
                    needsUpdate = true;
                    console.log(`   🔧 Fixed relative path`);
                }
                // Case 3: already Cloudinary URLs (good)
                else if (oldUrl.includes('cloudinary.com')) {
                    console.log(`   ✅ Already on Cloudinary - good!`);
                    alreadyGood++;
                }
                // Case 4: already production backend URLs (good)
                else if (oldUrl.includes('nss-portal-backend.onrender.com')) {
                    console.log(`   ✅ Already production URL - good!`);
                    alreadyGood++;
                }
                // Case 5: unknown format - might need regeneration
                else {
                    console.log(`   ⚠️  Unknown URL format - might need regeneration`);
                    needsRegeneration++;
                }

                // Update if needed
                if (needsUpdate) {
                    participation.certificate.url = newUrl;
                    await participation.save();
                    console.log(`   ✅ Updated to: ${newUrl}`);
                    fixed++;
                } else if (!oldUrl.includes('cloudinary.com') && !oldUrl.includes('nss-portal-backend.onrender.com')) {
                    console.log(`   ❓ No action taken`);
                }

                console.log(''); // Empty line for readability

            } catch (error) {
                console.error(`   ❌ Failed to process ${participation.student.name}:`, error.message);
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   Fixed URLs: ${fixed}`);
        console.log(`   Already good: ${alreadyGood}`);
        console.log(`   Need regeneration: ${needsRegeneration}`);
        console.log(`   Total checked: ${participations.length}`);
        console.log('\n✅ Certificate URL fix completed!');

        if (needsRegeneration > 0) {
            console.log('\n💡 Tip: For certificates that need regeneration, use:');
            console.log('   POST /api/certificates/regenerate/:eventId');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📡 Disconnected from MongoDB');
    }
}

// Run the fix
if (require.main === module) {
    fixAllCertificateUrls();
}

module.exports = { fixAllCertificateUrls };
