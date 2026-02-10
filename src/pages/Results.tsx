import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StepHeader } from "../components/StepHeader";
import { useGuidance } from "../context/GuidanceContext";

export function Results() {
    const navigate = useNavigate();
    const {
        details,
        categories,
        response,
        isLoading,
        error,
        generateGuidance,
        resonanceAccepted,
    } = useGuidance();
    const [openSections, setOpenSections] = useState<string[]>([]);

    useEffect(() => {
        if (!response && !isLoading) {
            void generateGuidance();
        }
    }, [response, isLoading, generateGuidance]);

    useEffect(() => {
        if (response?.categories.length && openSections.length === 0) {
            setOpenSections([response.categories[0].category]);
        }
    }, [response, openSections.length]);

    const toggleSection = (category: string) => {
        setOpenSections((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    };

    if (!categories.length || !details.dateOfBirth || !details.timeOfBirth || !details.placeOfBirth) {
        return (
            <section>
                <StepHeader
                    eyebrow="Missing details"
                    title="We need a few more details"
                    subtitle="Complete the earlier steps before generating your guidance."
                />
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate("/categories")}
                >
                    Return to Start
                </button>
            </section>
        );
    }

    if (resonanceAccepted !== true) {
        return (
            <section>
                <StepHeader
                    eyebrow="Resonance check"
                    title="Confirm the traits preview"
                    subtitle="Review the traits preview and confirm it resonates before opening the full guidance."
                />
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate("/resonance")}
                >
                    Go to Traits Preview
                </button>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <StepHeader
                eyebrow="Your Reading"
                title="SoulPath Guidance"
                subtitle="Breathe slowly and read each insight as a gentle invitation, not a fixed destiny."
            />
            {isLoading ? <LoadingState /> : null}
            {error ? <ErrorState message={error} onRetry={generateGuidance} /> : null}
            {!isLoading && !error && response ? (
                <div className="space-y-5">
                    {response.categories.map((category) => {
                        const isOpen = openSections.includes(category.category);
                        return (
                            <div key={category.category} className="glass-card px-6 py-6">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between gap-4 text-left"
                                    aria-expanded={isOpen}
                                    onClick={() => toggleSection(category.category)}
                                >
                                    <div>
                                        <h2 className="text-3xl font-semibold text-ink md:text-4xl">
                                            {category.category}
                                        </h2>
                                        <p className="mt-2 text-base text-ink/60 md:text-lg">
                                            {isOpen ? "Hide insights" : "Show insights"}
                                        </p>
                                    </div>
                                    <span className="text-sm uppercase tracking-[0.3em] text-rosewood/70">
                                        {isOpen ? "Open" : "Closed"}
                                    </span>
                                </button>
                                {isOpen ? (
                                    <ul className="mt-5 space-y-3 text-base text-ink/75 md:text-lg">
                                        {category.insights.map((insight, index) => (
                                            <li key={`${category.category}-${index}`}>
                                                • {insight}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate("/categories")}
                >
                    Start New Reading
                </button>
                <button
                    type="button"
                    className="ghost-button"
                    onClick={() => navigate("/palm-upload")}
                >
                    Update Palms
                </button>
            </div>
        </section>
    );
}
