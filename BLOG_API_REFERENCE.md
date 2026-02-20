# Blog System - Complete API Reference

## Overview
This document contains all API endpoints and service functions for the SoulPath blog system.

---

## Client-Side Service: `blogService.ts`

Located: `src/services/blogService.ts`

### Types

```typescript
interface BlogPost {
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
```

### Functions

#### `createBlogPost(postData)`
Create a new blog post (authenticated users only).

```typescript
const blogId = await createBlogPost({
  title: "My Blog Post",
  slug: "my-blog-post",
  content: "<h1>Content</h1>",
  coverImageUrl: "https://example.com/image.jpg",
  published: true,
  source: "manual"
});
```

**Parameters:**
- `postData`: Omit<BlogPost, "id" | "createdAt" | "updatedAt">

**Returns:** `Promise<string>` - Document ID

**Throws:** Error if not authenticated

---

#### `updateBlogPost(postId, postData)`
Update an existing blog post (author or admin only).

```typescript
await updateBlogPost("doc-id", {
  title: "Updated Title",
  published: false
});
```

**Parameters:**
- `postId`: string - Document ID
- `postData`: Partial<BlogPost> - Fields to update

**Returns:** `Promise<void>`

**Throws:** Error if not author or not authenticated

---

#### `deleteBlogPost(postId)`
Delete a blog post (author or admin only).

```typescript
await deleteBlogPost("doc-id");
```

**Parameters:**
- `postId`: string - Document ID

**Returns:** `Promise<void>`

**Throws:** Error if not author or not authenticated

---

#### `fetchAllBlogs()`
Get all published blog posts (public, no auth required).

```typescript
const blogs = await fetchAllBlogs();
// Returns: BlogPost[] sorted by createdAt (newest first)
```

**Parameters:** None

**Returns:** `Promise<BlogPost[]>` - Sorted by newest first

**Access:** Public (published posts only)

---

#### `fetchBlogBySlug(slug)`
Get a single blog post by slug (public, no auth required).

```typescript
const blog = await fetchBlogBySlug("my-blog-post");
// Returns: BlogPost or null if not found
```

**Parameters:**
- `slug`: string - URL-friendly identifier

**Returns:** `Promise<BlogPost | null>`

**Access:** Public (published posts only)

---

#### `fetchAllBlogsAdmin()`
Get all blog posts including drafts (admin/authenticated only).

```typescript
const allBlogs = await fetchAllBlogsAdmin();
// Returns: BlogPost[] including unpublished
```

**Parameters:** None

**Returns:** `Promise<BlogPost[]>` - All posts (published + drafts)

**Throws:** Error if not authenticated

**Access:** Authenticated users only

---

#### `getBlogPostById(postId)`
Get a blog post by its ID.

```typescript
const blog = await getBlogPostById("doc-id");
// Returns: BlogPost or null if not found
```

**Parameters:**
- `postId`: string - Document ID

**Returns:** `Promise<BlogPost | null>`

**Access:** Public (published posts), Auth required for drafts

---

## Server-Side Endpoint: `createFromMake.ts`

Located: `api/blogs/createFromMake.ts`

### Endpoint Details

**Method:** `POST`
**Path:** `/api/blogs/createFromMake`
**Authentication:** API key via `x-api-key` header

### Request Format

```bash
curl -X POST https://your-domain.vercel.app/api/blogs/createFromMake \
  -H "x-api-key: your-make-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Blog Post Title",
    "slug": "blog-post-slug",
    "content": "<h1>Content</h1>",
    "coverImageUrl": "https://example.com/image.jpg",
    "published": true,
    "source": "make"
  }'
```

### Request Body

```json
{
  "title": "string (required)",
  "slug": "string (required, must be unique)",
  "content": "string (required, HTML or Markdown)",
  "coverImageUrl": "string (optional)",
  "published": "boolean (default: true)",
  "source": "string (default: 'make')"
}
```

### Response Formats

#### Success (201 Created)

```json
{
  "success": true,
  "message": "Blog post created successfully",
  "id": "abc123xyz",
  "data": {
    "id": "abc123xyz",
    "title": "Blog Post Title",
    "slug": "blog-post-slug",
    "source": "make",
    "published": true
  }
}
```

#### Bad Request (400)

```json
{
  "error": "Missing required fields: title, slug, and content are required"
}
```

#### Conflict (409)

```json
{
  "error": "Blog post with slug \"already-exists\" already exists"
}
```

#### Unauthorized (401)

```json
{
  "error": "Unauthorized: Invalid API key"
}
```

#### Server Error (500)

```json
{
  "error": "Failed to create blog post",
  "details": "specific error message"
}
```

---

## Firestore Rules

Located: `firestore.rules`

### Access Levels

| Operation | Requirement |
|-----------|-------------|
| **Read published** | Anyone (public) |
| **Read draft** | Author or admin |
| **Create** | Admin only |
| **Update own** | Author or admin |
| **Delete own** | Author or admin |

### Rule Details

```
Read: (published == true) OR (author == currentUser) OR (admin == true)
Write: (admin == true)
Update: (admin == true) OR (author == currentUser)
Delete: (admin == true) OR (author == currentUser)
```

---

## React Components

### BlogsList Component

**Path:** `src/pages/BlogsList.tsx`
**Route:** `/blogs`
**Access:** Public

**Features:**
- Displays all published blog posts
- Sorted by newest first
- Shows cover image, title, excerpt, date
- Links to individual blog posts
- Responsive grid layout
- Loading and error states

**Props:** None (uses service functions)

**Example:**
```tsx
<Route path="/blogs" element={<BlogsList />} />
```

---

### BlogPage Component

**Path:** `src/pages/BlogPage.tsx`
**Route:** `/blog/:slug`
**Access:** Public

**Features:**
- Dynamic routing by blog slug
- Full HTML content rendering
- Shows cover image and metadata
- Back navigation to blog list
- Loading and error states

**Route Parameters:**
- `slug`: string - Blog post slug

**Example:**
```tsx
<Route path="/blog/:slug" element={<BlogPage />} />
```

---

### BlogAdmin Component

**Path:** `src/pages/BlogAdmin.tsx`
**Route:** `/admin/blogs`
**Access:** Protected (authenticated users only)

**Features:**
- Create new blog posts
- Edit existing posts
- Delete posts
- Toggle publish status
- Show all posts (published + drafts)
- Form validation
- Shows blog list with metadata

**Example:**
```tsx
<Route
  path="/admin/blogs"
  element={
    <ProtectedRoute>
      <BlogAdmin />
    </ProtectedRoute>
  }
/>
```

---

## Data Flow Diagrams

### User Creates Blog Post

```
User → BlogAdmin.tsx
  ↓
handleSubmit() → formData
  ↓
createBlogPost(formData)
  ↓
blogService.ts → Firebase Auth (verify user)
  ↓
Firestore → Save document to 'blogs' collection
  ↓
UI → Show success message & reload list
```

### Make.com Creates Blog Post

```
Make.com → POST /api/blogs/createFromMake
  ↓
createFromMake.ts → Verify API key
  ↓
Validate required fields
  ↓
Check slug uniqueness in Firestore
  ↓
Firebase Admin SDK → Create document
  ↓
Response → JSON with success/error
```

### User Reads Blog List

```
User → /blogs
  ↓
BlogsList.tsx → fetchAllBlogs()
  ↓
blogService.ts → Firestore query
  ↓
Query: collection('blogs').where('published', '==', true).orderBy('createdAt', 'desc')
  ↓
UI → Render posts in grid
```

### User Reads Single Blog

```
User → /blog/my-post-slug
  ↓
BlogPage.tsx → fetchBlogBySlug('my-post-slug')
  ↓
blogService.ts → Firestore query
  ↓
Query: collection('blogs').where('slug', '==', slug).where('published', '==', true)
  ↓
UI → Render full post with content
```

---

## Error Handling

### Frontend Errors

All components handle errors with:
- Loading state during data fetching
- Error message display via ErrorState component
- User-friendly error messages
- Try-catch blocks in async functions

### Backend Errors

API endpoint returns appropriate HTTP status codes:
- `201` - Created successfully
- `400` - Bad request (missing fields)
- `401` - Unauthorized (invalid API key)
- `409` - Conflict (slug already exists)
- `500` - Server error

---

## Security Considerations

### Authentication
- ✅ Firestore rules enforce authentication for write operations
- ✅ Custom claims (`role: "admin"`) required for create/update/delete
- ✅ Author can only modify their own posts

### API Key Protection
- ✅ Make.com endpoint uses API key in header
- ✅ Key stored in Vercel environment variables
- ✅ Never committed to GitHub

### Data Validation
- ✅ Required fields validated on backend
- ✅ Slug uniqueness checked before creating
- ✅ Content is user-provided but rendered safely

### Access Control
- ✅ Published posts readable by anyone
- ✅ Draft posts only visible to author
- ✅ Only admins can create/modify blogs
- ✅ Admin role verified via Firebase custom claims

---

## Environment Variables

### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

### Backend (Vercel)
```env
MAKE_API_KEY=your-secret-key
```

### Server-Side Functions
```env
FIREBASE_PROJECT_ID=soulpath-795e4
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

---

## Rate Limiting

Currently not implemented. Consider for future:
- Rate limit Make.com requests per API key
- Rate limit blog creation per admin
- Cache published blog list

---

## Pagination

Currently not implemented. For large blog libraries, consider:
- Implement cursor-based pagination
- Load 10 posts per page
- Use Firestore's `startAfter()` method

---

## Search & Filtering

Currently not implemented. Consider for future:
- Filter blogs by date range
- Search blogs by title/content
- Filter by source (manual vs make)
- Tag-based filtering

---

## Backup & Recovery

Consider implementing:
- Regular Firestore backups
- Blog post versioning
- Soft deletes (archive instead of delete)
- Audit logs for compliance

---

## Testing

### Unit Tests (Example)

```typescript
import { fetchAllBlogs, createBlogPost } from "../blogService";

describe("blogService", () => {
  test("fetchAllBlogs returns published posts", async () => {
    const blogs = await fetchAllBlogs();
    expect(blogs).toBeInstanceOf(Array);
    expect(blogs[0].published).toBe(true);
  });

  test("createBlogPost requires authentication", async () => {
    expect(async () => {
      await createBlogPost({ /* ... */ });
    }).rejects.toThrow("User must be authenticated");
  });
});
```

---

## Performance Tips

1. **Caching**: Cache published blogs client-side for faster navigation
2. **Lazy Loading**: Load blog content only when needed
3. **Image Optimization**: Optimize cover images before uploading
4. **Indexing**: Firestore automatically indexes `slug` field (unique queries are fast)
5. **Pagination**: Limit results returned from Firestore

---

## Monitoring & Analytics

Consider tracking:
- Blog post views
- Most popular posts
- Make.com integration usage
- API endpoint response times
- Error rates

---

## Future Enhancements

- [ ] Comments system
- [ ] Blog categories/tags
- [ ] Author profiles
- [ ] Newsletter subscription
- [ ] Social media sharing
- [ ] Related posts
- [ ] Blog search
- [ ] Analytics dashboard
- [ ] Scheduled publishing
- [ ] Version history

---

**Last Updated:** February 2026
**Version:** 1.0
