import { useEffect } from "react";
import { Link } from "react-router-dom";
import { StepHeader } from "../components/StepHeader";
import { useAuth } from "../context/AuthContext";

export function Landing() {
    const { currentUser } = useAuth();

    useEffect(() => {
        document.title = "Astroya SoulPath | Home";
    }, []);

    return (
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-10">
                <StepHeader
                    eyebrow="Astroya SoulPath"
                    title="A calm compass for your next chapter"
                    subtitle="Blend Vedic astrology and palmistry to surface gentle, grounded guidance for health, career, relationships, wealth, and spiritual growth."
                />
                <div className="flex flex-wrap gap-4">
                    {currentUser ? (
                        <Link to="/categories" className="primary-button">
                            Get Your Guidance
                        </Link>
                    ) : (
                        <>
                            <Link to="/categories" className="primary-button">
                                Get Started
                            </Link>
                            <Link to="/login" className="ghost-button">
                                Sign In
                            </Link>
                        </>
                    )}
                    <Link to="/how-it-works" className="ghost-button">
                        How it Works
                    </Link>
                </div>
            </div>
            <div className="glass-card flex flex-col justify-between gap-6 px-8 py-10">
                <p className="text-xs uppercase tracking-[0.3em] text-rosewood/80">
                    Your Session
                </p>
                <div className="space-y-4 text-ink/70">
                    <p className="text-lg font-semibold text-ink">What you will share</p>
                    <ul className="space-y-2 text-sm">
                        <li>Birth date, time, and place</li>
                        <li>Guidance categories you choose</li>
                        <li>Optional palm images for nuance</li>
                    </ul>
                </div>
                <div className="rounded-xl border border-purple-400/40 bg-purple-50/80 dark:bg-purple-900/20 px-5 py-4 text-sm text-ink">
                    <p className="font-semibold mb-1">✨ Free AI Consultation</p>
                    <p className="text-ink/70">Sign in after viewing your predictions to get free chat-based consultation powered by ancient Vedic wisdom.</p>
                </div>
                <div className="rounded-xl border border-ember/40 bg-white/80 px-5 py-4 text-sm text-ink/70">
                    SoulPath never stores your details. Your inputs are used only to craft the
                    guidance you see.
                </div>
            </div>
        </section>
    );
}
