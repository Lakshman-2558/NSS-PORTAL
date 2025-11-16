/**
 * Migration Script: Move existing certificates from local storage to Cloudinary
 * 
 * This script:
 * 1. Finds all participations with local certificate URLs
 * 2. Checks if the certificate file exists locally
 * 3. Uploads to Cloudinary
 * 4. Updates the database with new Cloudinary URL
 * 
 * Usage: node scripts/migrate-certificates-to-cloudinary.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const cloudinary = require('../config/cloudinary');
const Participation = require('../models/Participation');

async function migrateCertificatesToCloudinary() {
    try {
        console.log('\n🚀 Starting certificate migration to Cloudinary...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all participations with certificate URLs
        const participations = await Participation.find({
            'certificate.url': { $exists: true, $ne: null }
        }).populate('student', 'name email').populate('event', 'title');

        console.log(`📋 Found ${participations.length} participations with certificates\n`);

        let migrated = 0;
        let alreadyCloudinary = 0;
        let failed = 0;
        let notFound = 0;

        for (const participation of participations) {
            try {
                const certUrl = participation.certificate.url;

                // Skip if already on Cloudinary
                if (certUrl.includes('cloudinary.com')) {
                    console.log(`⏭️  Skipping ${participation.student.name} - Already on Cloudinary`);
                    alreadyCloudinary++;
                    continue;
                }

                console.log(`\n📄 Processing: ${participation.student.name} - ${participation.event.title}`);
                console.log(`   Current URL: ${certUrl}`);

                // Extract local file path
                let localPath;
                if (certUrl.startsWith('http')) {
                    // Extract path from full URL
                    const urlPath = new URL(certUrl).pathname;
                    localPath = path.join(__dirname, '..', urlPath);
                } else if (certUrl.startsWith('/uploads')) {
                    localPath = path.join(__dirname, '..', certUrl);
                } else {
                    localPath = path.join(__dirname, '..', 'uploads', certUrl);
                }

                console.log(`   Local path: ${localPath}`);

                // Check if file exists
                try {
                    await fs.access(localPath);
                } catch (err) {
                    console.log(`   ⚠️  File not found locally - will need to regenerate`);
                    notFound++;
                    continue;
                }

                // Read the file
                const fileBuffer = await fs.readFile(localPath);
                console.log(`   ✅ File read successfully (${fileBuffer.length} bytes)`);

                // Upload to Cloudinary
                const base64File = fileBuffer.toString('base64');
                const dataUri = `data:image/png;base64,${base64File}`;

                const uploadResult = await cloudinary.uploader.upload(dataUri, {
                    folder: 'nss-certificates',
                    public_id: `cert_${participation.student._id}_${participation.event._id}_${Date.now()}`,
                    resource_type: 'image',
                    format: 'png'
                });

                console.log(`   ☁️  Uploaded to Cloudinary: ${uploadResult.secure_url}`);

                // Update database
                participation.certificate.url = uploadResult.secure_url;
                participation.certificate.publicId = uploadResult.public_id;
                await participation.save();

                console.log(`   ✅ Database updated`);
                migrated++;

                // Optional: Delete local file after successful migration
                // await fs.unlink(localPath);
                // console.log(`   🗑️  Local file deleted`);

            } catch (error) {
                console.error(`   ❌ Error processing ${participation.student.name}:`, error.message);
                failed++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 Migration Summary:');
        console.log('='.repeat(60));
        console.log(`Total certificates found: ${participations.length}`);
        console.log(`✅ Successfully migrated: ${migrated}`);
        console.log(`⏭️  Already on Cloudinary: ${alreadyCloudinary}`);
        console.log(`⚠️  Files not found: ${notFound}`);
        console.log(`❌ Failed: ${failed}`);
        console.log('='.repeat(60) + '\n');

        if (notFound > 0) {
            console.log('⚠️  Note: Certificates with missing files need to be regenerated.');
            console.log('   Use the certificate regeneration endpoint for those events.\n');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('✅ Database connection closed');
    }
}

// Run migration
migrateCertificatesToCloudinary();
