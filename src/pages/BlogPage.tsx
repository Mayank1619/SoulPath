import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBlogBySlug, type BlogPost } from "../services/blogService";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function BlogPage() {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBlog = async () => {
            if (!slug) {
                setError("Blog slug not found");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const fetchedBlog = await fetchBlogBySlug(slug);

                if (!fetchedBlog) {
                    setError("Blog post not found");
                    setBlog(null);
                } else {
                    setBlog(fetchedBlog);
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Failed to load blog";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, [slug]);

    if (loading) {
        return <LoadingState message="Loading blog post..." />;
    }

    if (error || !blog) {
        return <ErrorState message={error || "Blog post not found"} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/blogs"
                    className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
                >
                    <span className="mr-2">←</span>
                    Back to Blog
                </Link>

                {/* Cover Image */}
                {blog.coverImageUrl && (
                    <div className="mb-12 rounded-lg overflow-hidden shadow-2xl">
                        <img
                            src={blog.coverImageUrl}
                            alt={blog.title}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                )}

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                            {blog.source === "make" ? "External" : "Article"}
                        </span>
                        <span className="text-gray-400 text-sm">
                            {blog.createdAt
                                ? new Date(blog.createdAt.toDate()).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "Unknown date"}
                        </span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">{blog.title}</h1>
                    <div className="h-1 w-24 bg-indigo-600 rounded"></div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none mb-12">
                    <div
                        className="text-gray-300 leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Footer */}
                <div className="border-t border-slate-700 pt-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">
                                Last updated{" "}
                                {blog.updatedAt
                                    ? new Date(blog.updatedAt.toDate()).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "Unknown date"}
                            </p>
                        </div>
                        <Link
                            to="/blogs"
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            More Articles
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
