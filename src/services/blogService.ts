import { db, auth } from "../config/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    Timestamp,
} from "firebase/firestore";

export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    content: string;
    coverImageUrl: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    published: boolean;
    authorId: string;
    source: "manual" | "make";
}

const BLOGS_COLLECTION = "blogs";

/**
 * Create a new blog post
 */
export const createBlogPost = async (
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated to create blog posts");
    }

    const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
        ...postData,
        authorId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    });

    return docRef.id;
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (
    postId: string,
    postData: Partial<BlogPost>
): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated to update blog posts");
    }

    const postRef = doc(db, BLOGS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
        throw new Error("Blog post not found");
    }

    // Only allow authors or admins to update
    const post = postSnap.data() as BlogPost;
    if (post.authorId !== user.uid) {
        throw new Error("You can only update your own posts");
    }

    await updateDoc(postRef, {
        ...postData,
        updatedAt: Timestamp.now(),
    });
};

/**
 * Delete a blog post
 */
export const deleteBlogPost = async (postId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated to delete blog posts");
    }

    const postRef = doc(db, BLOGS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
        throw new Error("Blog post not found");
    }

    const post = postSnap.data() as BlogPost;
    if (post.authorId !== user.uid) {
        throw new Error("You can only delete your own posts");
    }

    await deleteDoc(postRef);
};

/**
 * Fetch all published blog posts, sorted by newest first
 */
export const fetchAllBlogs = async (): Promise<BlogPost[]> => {
    const q = query(
        collection(db, BLOGS_COLLECTION),
        where("published", "==", true),
        orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as BlogPost));
};

/**
 * Fetch a blog post by slug
 */
export const fetchBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
    const q = query(
        collection(db, BLOGS_COLLECTION),
        where("slug", "==", slug),
        where("published", "==", true)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
    } as BlogPost;
};

/**
 * Fetch all blog posts for admin (published and unpublished)
 */
export const fetchAllBlogsAdmin = async (): Promise<BlogPost[]> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated to access admin blogs");
    }

    const q = query(
        collection(db, BLOGS_COLLECTION),
        orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as BlogPost));
};

/**
 * Get blog post by ID
 */
export const getBlogPostById = async (postId: string): Promise<BlogPost | null> => {
    const postRef = doc(db, BLOGS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
        return null;
    }

    return {
        id: postSnap.id,
        ...postSnap.data(),
    } as BlogPost;
};
