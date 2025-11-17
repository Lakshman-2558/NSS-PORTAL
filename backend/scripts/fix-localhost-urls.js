/**
 * Fix localhost URLs in certificate database
 * 
 * This script updates certificate URLs from localhost to production backend URL
 * 
 * Usage: node scripts/fix-localhost-urls.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Participation = require('../models/Participation');

async function fixLocalhostUrls() {
    try {
        console.log('\n🔧 Starting localhost URL fix...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all participations with localhost URLs
        const participations = await Participation.find({
            'certificate.url': {
                $regex: '^http://localhost:5000'
            }
        }).populate('student', 'name email').populate('event', 'title');

        console.log(`📋 Found ${participations.length} certificates with localhost URLs\n`);

        if (participations.length === 0) {
            console.log('✅ No localhost URLs found - all certificates are already fixed!');
            return;
        }

        let fixed = 0;
        const productionBackendUrl = 'https://nss-portal-backend.onrender.com';

        for (const participation of participations) {
            try {
                const oldUrl = participation.certificate.url;
                const newUrl = oldUrl.replace('http://localhost:5000', productionBackendUrl);

                console.log(`📄 Fixing: ${participation.student.name} - ${participation.event.title}`);
                console.log(`   Old: ${oldUrl}`);
                console.log(`   New: ${newUrl}`);

                // Update the URL
                participation.certificate.url = newUrl;
                await participation.save();

                console.log(`   ✅ Fixed\n`);
                fixed++;

            } catch (error) {
                console.error(`   ❌ Failed to fix ${participation.student.name}:`, error.message);
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   Fixed: ${fixed}`);
        console.log(`   Total: ${participations.length}`);
        console.log('\n✅ URL fix completed!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📡 Disconnected from MongoDB');
    }
}

// Run the fix
if (require.main === module) {
    fixLocalhostUrls();
}

module.exports = { fixLocalhostUrls };
