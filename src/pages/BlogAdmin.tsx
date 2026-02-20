import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    fetchAllBlogsAdmin,
    getBlogPostById,
    type BlogPost,
} from "../services/blogService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function BlogAdmin() {
    const { currentUser } = useAuth();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: "",
        slug: "",
        content: "",
        coverImageUrl: "",
        published: false,
        source: "manual",
    });

    // Check if user is authenticated
    const isAuthenticated = !!currentUser;

    useEffect(() => {
        if (!isAuthenticated) {
            setError("You must be logged in to access this page");
            setLoading(false);
            return;
        }

        loadBlogs();
    }, [isAuthenticated]);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedBlogs = await fetchAllBlogsAdmin();
            setBlogs(fetchedBlogs);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to load blogs";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.currentTarget;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.currentTarget as HTMLInputElement).checked
                    : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (!formData.title || !formData.slug || !formData.content) {
                setError("Title, slug, and content are required");
                return;
            }

            if (editingId) {
                await updateBlogPost(editingId, formData);
            } else {
                await createBlogPost(formData as Omit<BlogPost, "id" | "createdAt" | "updatedAt">);
            }

            setFormData({
                title: "",
                slug: "",
                content: "",
                coverImageUrl: "",
                published: false,
                source: "manual",
            });
            setEditingId(null);
            setIsFormOpen(false);
            loadBlogs();
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to save blog";
            setError(errorMessage);
        }
    };

    const handleEdit = async (id: string) => {
        try {
            const blog = await getBlogPostById(id);
            if (blog) {
                setFormData(blog);
                setEditingId(id);
                setIsFormOpen(true);
            }
        } catch (err) {
            setError("Failed to load blog for editing");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await deleteBlogPost(id);
                loadBlogs();
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Failed to delete blog";
                setError(errorMessage);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            title: "",
            slug: "",
            content: "",
            coverImageUrl: "",
            published: false,
            source: "manual",
        });
        setEditingId(null);
        setIsFormOpen(false);
    };

    if (!isAuthenticated) {
        return <ErrorState message="You must be logged in to access the admin panel" />;
    }

    if (loading && blogs.length === 0) {
        return <LoadingState message="Loading blog admin..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Blog Management</h1>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
                    >
                        {isFormOpen ? "Cancel" : "Create New Post"}
                    </button>
                </div>

                {/* Error Message */}
                {error && <ErrorState message={error} />}

                {/* Form */}
                {isFormOpen && (
                    <div className="bg-slate-800 rounded-lg p-8 mb-12 border border-slate-700">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {editingId ? "Edit Blog Post" : "Create New Blog Post"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="Enter blog title"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Slug (URL-friendly)
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="blog-post-slug"
                                    required
                                />
                            </div>

                            {/* Cover Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Cover Image URL
                                </label>
                                <input
                                    type="text"
                                    name="coverImageUrl"
                                    value={formData.coverImageUrl || ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Content (HTML or Markdown)
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content || ""}
                                    onChange={handleInputChange}
                                    rows={10}
                                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm"
                                    placeholder="Enter blog content..."
                                    required
                                />
                            </div>

                            {/* Published Toggle */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={formData.published || false}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 rounded focus:ring-2 focus:ring-indigo-500"
                                />
                                <label className="ml-3 text-sm font-medium text-gray-300">
                                    Publish this post
                                </label>
                            </div>

                            {/* Source */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Source
                                </label>
                                <select
                                    name="source"
                                    value={formData.source || "manual"}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    <option value="manual">Manual</option>
                                    <option value="make">Make.com</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
                                >
                                    {editingId ? "Update Post" : "Create Post"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Blog List */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">All Posts</h2>

                    {blogs.length === 0 ? (
                        <div className="bg-slate-800 rounded-lg p-8 text-center">
                            <p className="text-gray-400">No blog posts yet. Create your first one!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {blogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="bg-slate-800 rounded-lg p-6 flex items-center justify-between border border-slate-700"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">{blog.title}</h3>
                                        <p className="text-gray-400 text-sm mb-2">
                                            Slug: <code className="bg-slate-700 px-2 py-1 rounded">{blog.slug}</code>
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-full text-white ${blog.published ? "bg-green-600" : "bg-gray-600"
                                                    }`}
                                            >
                                                {blog.published ? "Published" : "Draft"}
                                            </span>
                                            <span className="text-gray-400">
                                                {blog.createdAt
                                                    ? new Date(blog.createdAt.toDate()).toLocaleDateString()
                                                    : "Unknown date"}
                                            </span>
                                            <span className="text-gray-400">Source: {blog.source}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(blog.id!)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id!)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
