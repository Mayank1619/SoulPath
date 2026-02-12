import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StepHeader } from "../components/StepHeader";
import { useGuidance } from "../context/GuidanceContext";
import { chatWithAI } from "../services/openaiService";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export function Chatbot() {
    const navigate = useNavigate();
    const { details, categories, response } = useGuidance();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        document.title = "SoulPath | Chat";
    }, []);

    useEffect(() => {
        // Initial welcome message
        if (messages.length === 0) {
            setMessages([
                {
                    role: "assistant",
                    content: "Welcome! I'm here to help answer any questions about your SoulPath reading. Feel free to ask me anything about the insights you received, or dive deeper into specific aspects of your guidance.",
                    timestamp: new Date(),
                },
            ]);
        }
    }, [messages.length]);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        return () => {
            // Cleanup: abort any pending requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setError(null);

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
            // Build context from user's reading
            const context = {
                birthDetails: details,
                selectedCategories: categories,
                guidance: response,
            };

            const aiResponse = await chatWithAI(
                userMessage.content,
                context,
                abortControllerRef.current.signal
            );

            const assistantMessage: Message = {
                role: "assistant",
                content: aiResponse,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to get response";
            setError(errorMessage);

            // Add error message to chat
            const errorMsg: Message = {
                role: "assistant",
                content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const handleNewReading = () => {
        navigate("/categories");
    };

    const handleBackToResults = () => {
        navigate("/results");
    };

    if (!response || !categories.length) {
        return (
            <section>
                <StepHeader
                    eyebrow="Chatbot"
                    title="Complete Your Reading First"
                    subtitle="You need to complete your reading before asking follow-up questions."
                />
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate("/results")}
                >
                    Go to Results
                </button>
            </section>
        );
    }

    return (
        <section className="flex flex-col h-[calc(100vh-12rem)]">
            <StepHeader
                eyebrow="Ask Questions"
                title="Chat with Your Guide"
                subtitle="Ask specific questions about your reading or explore deeper insights."
            />

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.map((message, index) => (
                    <div
                        key={`${message.role}-${message.timestamp.getTime()}-${index}`}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.role === "user"
                                ? "bg-rosewood text-paper"
                                : "glass-card text-ink"
                                }`}
                        >
                            <p className="text-sm md:text-base whitespace-pre-wrap">
                                {message.content}
                            </p>
                            <p
                                className={`text-xs mt-2 ${message.role === "user"
                                    ? "text-paper/60"
                                    : "text-ink/50"
                                    }`}
                            >
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="glass-card px-4 py-3 rounded-2xl">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-rosewood/60 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-rosewood/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-rosewood/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-auto">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your reading..."
                        className="flex-1 px-4 py-3 rounded-xl border border-ink/20 bg-paper/50 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-rosewood/50"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="primary-button px-6"
                    >
                        Send
                    </button>
                </div>
            </form>

            {/* Error Display */}
            {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
                <button
                    type="button"
                    className="ghost-button"
                    onClick={handleBackToResults}
                >
                    Back to Results
                </button>
                <button
                    type="button"
                    className="ghost-button"
                    onClick={handleNewReading}
                >
                    Start New Reading
                </button>
            </div>
        </section>
    );
}
