import { VercelRequest, VercelResponse } from "@vercel/node";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK (uses environment variables)
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        } as admin.ServiceAccount),
    });
}

const db = admin.firestore();

interface CreateBlogPayload {
    title: string;
    slug: string;
    content: string;
    coverImageUrl: string;
    published: boolean;
    source: "manual" | "make";
    apiKey?: string;
}

/**
 * Cloud Function for Make.com to create blog posts
 * Expects:
 * - API key authentication via header or body
 * - POST payload with blog data
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Verify API key
        const apiKey =
            req.headers["x-api-key"] ||
            req.headers["authorization"]?.replace("Bearer ", "") ||
            (req.body as CreateBlogPayload).apiKey;

        const expectedApiKey = process.env.MAKE_API_KEY;

        if (!apiKey || apiKey !== expectedApiKey) {
            return res.status(401).json({ error: "Unauthorized: Invalid API key" });
        }

        // Extract blog data from request body
        const { title, slug, content, coverImageUrl, published = true, source = "make" } =
            req.body as CreateBlogPayload;

        // Validate required fields
        if (!title || !slug || !content) {
            return res.status(400).json({
                error: "Missing required fields: title, slug, and content are required",
            });
        }

        // Check if slug already exists
        const existingPost = await db
            .collection("blogs")
            .where("slug", "==", slug)
            .limit(1)
            .get();

        if (!existingPost.empty) {
            return res.status(409).json({
                error: `Blog post with slug "${slug}" already exists`,
            });
        }

        // Create blog post document
        const docRef = await db.collection("blogs").add({
            title,
            slug,
            content,
            coverImageUrl: coverImageUrl || "",
            published,
            source,
            authorId: "make-automation", // Special author ID for Make.com posts
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            id: docRef.id,
            data: {
                id: docRef.id,
                title,
                slug,
                source,
                published,
            },
        });
    } catch (error) {
        console.error("Error creating blog post:", error);

        return res.status(500).json({
            error: "Failed to create blog post",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
