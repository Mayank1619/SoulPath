#!/usr/bin/env node

/**
 * Quick script to set admin role for a user
 * This uses Firebase Admin SDK directly
 * 
 * Usage:
 *   node setAdmin.js user@example.com
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Get email from command line
const email = process.argv[2];

if (!email) {
    console.error("Usage: node setAdmin.js user@example.com");
    process.exit(1);
}

// Initialize Firebase Admin
const serviceAccountPath = path.join(
    __dirname,
    "soulpath-795e4-firebase-adminsdk.json"
);

if (!fs.existsSync(serviceAccountPath)) {
    console.error(`\n❌ Service Account key not found at:\n${serviceAccountPath}\n`);
    console.log("Instructions to get your service account key:\n");
    console.log("1. Go to: https://console.firebase.google.com/");
    console.log("2. Select 'soulpath-795e4' project");
    console.log("3. Go to Settings (gear icon) > Project Settings");
    console.log("4. Click 'Service Accounts' tab");
    console.log("5. Click 'Generate New Private Key'");
    console.log("6. Save the JSON file to: functions/soulpath-795e4-firebase-adminsdk.json\n");
    process.exit(1);
}

try {
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    const auth = admin.auth();

    async function setAdmin() {
        try {
            console.log(`\n🔍 Finding user with email: ${email}`);
            const user = await auth.getUserByEmail(email);

            console.log(`✅ User found: ${user.uid}`);
            console.log(`📝 Setting admin role...`);

            await auth.setCustomUserClaims(user.uid, { role: "admin" });

            console.log(`\n✅ SUCCESS!\n`);
            console.log(`User ${email} is now an admin.`);
            console.log(`\nℹ️  They may need to:`)
            console.log(`1. Log out and log back in`);
            console.log(`2. Refresh the page`);
            console.log(`3. Clear browser cache\n`);

            process.exit(0);
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                console.error(`\n❌ User not found: ${email}\n`);
            } else {
                console.error(`\n❌ Error: ${error.message}\n`);
            }
            process.exit(1);
        }
    }

    setAdmin();
} catch (error) {
    console.error(`\n❌ Error initializing Firebase: ${error.message}\n`);
    process.exit(1);
}
