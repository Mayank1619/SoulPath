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
                    If you're curious to explore further, SoulPath includes an interactive AI‑powered guide trained on ancient Vedic knowledge. You can ask questions, dive deeper into your chart, or have a live chat session to understand your predictions in a more conversational and intuitive way.
                </p>

                <p className="text-base md:text-lg text-ink/80 leading-relaxed font-semibold">
                    SoulPath is designed to help you reflect, realign, and move forward with confidence—rooted in wisdom that has guided generations.
                </p>
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
