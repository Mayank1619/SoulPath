import { useEffect } from "react";
import { Link } from "react-router-dom";
import { StepHeader } from "../components/StepHeader";

export function HowItWorks() {
    useEffect(() => {
        document.title = "SoulPath | How It Works";
    }, []);

    return (
        <section className="space-y-8">
            <StepHeader
                eyebrow="How It Works"
                title="Discover Your SoulPath"
                subtitle="Ancient wisdom meets modern insight"
            />

            <div className="glass-card px-8 py-10 space-y-6">
                <p className="text-base md:text-lg text-ink/80 leading-relaxed">
                    SoulPath blends ancient astrology, Vedic sciences, and palmistry to give you a deeper understanding of your life's journey. Using the details you provide, our system generates a personalized Past & Present Report—a foundation that helps you confirm whether the insights resonate with your experiences. This ensures the attributes we calculate are aligned with your unique story.
                </p>

                <p className="text-base md:text-lg text-ink/80 leading-relaxed">
                    Once you feel confident the reading reflects who you are, you can unlock detailed predictions for the year ahead and the next. These insights are crafted using time‑tested ancient systems, offering clarity on health, wellness, relationships, career, and overall life direction.
                </p>

                <p className="text-base md:text-lg text-ink/80 leading-relaxed">
                    If you're curious to explore further, SoulPath includes a <span className="font-semibold text-purple-600">free interactive AI‑powered consultation</span> trained on ancient Vedic knowledge. Simply sign in after viewing your predictions to unlock chat-based guidance. You can ask questions, dive deeper into your chart, or have a live conversation to understand your predictions in a more intuitive way—at no cost.
                </p>

                <p className="text-base md:text-lg text-ink/80 leading-relaxed font-semibold">
                    SoulPath is designed to help you reflect, realign, and move forward with confidence—rooted in wisdom that has guided generations.
                </p>
            </div>

            <div className="glass-card px-6 py-5 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-400/30">
                <h3 className="text-lg font-semibold text-ink mb-2">Quick Summary</h3>
                <ul className="space-y-2 text-sm text-ink/70">
                    <li>✓ Get your personalized predictions instantly—no sign-up required</li>
                    <li>✓ Review your Past & Present Report to confirm accuracy</li>
                    <li>✓ Unlock detailed future insights for the years ahead</li>
                    <li>✓ Sign in anytime for <span className="font-semibold text-purple-600">free AI chat consultation</span></li>
                </ul>
            </div>

            <div className="flex flex-wrap gap-3">
                <Link to="/categories" className="primary-button">
                    Get Started
                </Link>
                <Link to="/" className="ghost-button">
                    Back to Home
                </Link>
            </div>
        </section>
    );
}
