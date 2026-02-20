import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Cloud Function to set admin role for a user
 * Usage: Call via HTTP POST with user email
 * 
 * Example:
 * POST /setAdminRole
 * Body: { "email": "user@example.com" }
 */
export const setAdminRole = functions.https.onCall(async (data, context) => {
    // Check if requester is already an admin
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "User must be authenticated"
        );
    }

    // Verify requester is admin
    const requesterClaims = context.auth.token;
    if (requesterClaims.role !== "admin") {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Only admins can set admin roles"
        );
    }

    const { email } = data;

    if (!email) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Email is required"
        );
    }

    try {
        // Get user by email
        const user = await admin.auth().getUserByEmail(email);

        // Set custom claims
        await admin.auth().setCustomUserClaims(user.uid, {
            role: "admin",
        });

        return {
            success: true,
            message: `User ${email} has been granted admin role`,
            uid: user.uid,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new functions.https.HttpsError(
                "internal",
                `Error setting admin role: ${error.message}`
            );
        }
        throw new functions.https.HttpsError(
            "internal",
            "Error setting admin role"
        );
    }
});

/**
 * Cloud Function to remove admin role from a user
 */
export const removeAdminRole = functions.https.onCall(
    async (data, context) => {
        // Check if requester is authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "User must be authenticated"
            );
        }

        // Verify requester is admin
        const requesterClaims = context.auth.token;
        if (requesterClaims.role !== "admin") {
            throw new functions.https.HttpsError(
                "permission-denied",
                "Only admins can remove admin roles"
            );
        }

        const { email } = data;

        if (!email) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "Email is required"
            );
        }

        try {
            const user = await admin.auth().getUserByEmail(email);

            await admin.auth().setCustomUserClaims(user.uid, {
                role: null,
            });

            return {
                success: true,
                message: `Admin role removed from ${email}`,
                uid: user.uid,
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new functions.https.HttpsError(
                    "internal",
                    `Error removing admin role: ${error.message}`
                );
            }
            throw new functions.https.HttpsError(
                "internal",
                "Error removing admin role"
            );
        }
    }
);

/**
 * Cloud Function to get user's custom claims
 */
export const getUserClaims = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "User must be authenticated"
        );
    }

    const { uid } = data;

    if (!uid) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "UID is required"
        );
    }

    try {
        const user = await admin.auth().getUser(uid);

        return {
            uid: user.uid,
            email: user.email,
            customClaims: user.customClaims || null,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new functions.https.HttpsError(
                "internal",
                `Error getting user claims: ${error.message}`
            );
        }
        throw new functions.https.HttpsError(
            "internal",
            "Error getting user claims"
        );
    }
});
