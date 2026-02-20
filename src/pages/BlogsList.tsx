import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllBlogs, type BlogPost } from "../services/blogService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function BlogsList() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedBlogs = await fetchAllBlogs();
                setBlogs(fetchedBlogs);
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Failed to load blogs";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadBlogs();
    }, []);

    if (loading) {
        return <LoadingState message="Loading blog posts..." />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
                    <p className="text-gray-300 text-lg">
                        Explore insights about astrology, numerology, and spiritual guidance
                    </p>
                </div>

                {/* Blog Posts Grid */}
                {blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-xl">No blog posts available yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
                        {blogs.map((blog) => (
                            <Link
                                key={blog.id}
                                to={`/blog/${blog.slug}`}
                                className="group bg-slate-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Cover Image */}
                                    {blog.coverImageUrl && (
                                        <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                                            <img
                                                src={blog.coverImageUrl}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        {/* Badge */}
                                        <div className="mb-3">
                                            <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                                                {blog.source === "make" ? "External" : "Article"}
                                            </span>
                                        </div>

                                        {/* Title and Excerpt */}
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                                                {blog.title}
                                            </h2>
                                            <p className="text-gray-400 line-clamp-2 mb-4">
                                                {blog.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                                            </p>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>
                                                {blog.createdAt
                                                    ? new Date(blog.createdAt.toDate()).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )
                                                    : "Unknown date"}
                                            </span>
                                            <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                                                Read More →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
