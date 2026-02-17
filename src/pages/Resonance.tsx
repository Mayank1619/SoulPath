import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StepHeader } from "../components/StepHeader";
import { useGuidance } from "../context/GuidanceContext";

export function Resonance() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Astoya SoulPath | Resonance";
    }, []);

    const {
        details,
        traitsPreview,
        isPreviewLoading,
        previewError,
        generateTraitsPreview,
        setResonanceAccepted,
    } = useGuidance();

    const missingDetails =
        !details.dateOfBirth || !details.timeOfBirth || !details.placeOfBirth;

    useEffect(() => {
        if (!missingDetails && !traitsPreview && !isPreviewLoading && !previewError) {
            void generateTraitsPreview();
        }
    }, [
        missingDetails,
        traitsPreview,
        isPreviewLoading,
        previewError,
        generateTraitsPreview,
    ]);

    if (missingDetails) {
        return (
            <section>
                <StepHeader
                    eyebrow="Missing details"
                    title="We need a few more details"
                    subtitle="Complete the earlier steps before generating your preview."
                />
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate("/birth-details")}
                >
                    Return to Details
                </button>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <StepHeader
                eyebrow="Step 4"
                title="Do these traits feel familiar?"
                subtitle="We begin with a brief traits preview before opening the full guidance."
            />
            {isPreviewLoading ? (
                <LoadingState message="Reading your core traits..." />
            ) : null}
            {previewError ? (
                <ErrorState message={previewError} onRetry={generateTraitsPreview} />
            ) : null}
            {!isPreviewLoading && !previewError && traitsPreview ? (
                <div className="glass-card space-y-5 px-6 py-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-rosewood/70">
                                Traits preview
                            </p>
                            <h2 className="text-2xl font-semibold text-ink md:text-3xl">
                                A glimpse of your patterning
                            </h2>
                        </div>
                        <div className="text-xs uppercase tracking-[0.3em] text-rosewood/70">
                            {traitsPreview.palmUsed
                                ? "Palmistry used"
                                : "Palmistry not used"}
                        </div>
                    </div>
                    <p className="text-sm text-ink/60 md:text-base">
                        Confidence: {Math.round(traitsPreview.confidence * 100)}%
                    </p>
                    <div className="rounded-xl border border-ember/40 bg-white/70 px-5 py-4 text-lg text-ink/80 shadow-soft md:text-xl" style={{ borderLeftWidth: "6px" }}>
                        {traitsPreview.summary}
                    </div>
                    <div className="space-y-5 text-base text-ink/75 md:text-lg">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-rosewood/70">
                                Personality
                            </p>
                            <ul className="mt-2 space-y-2">
                                {traitsPreview.personality.map((trait, index) => (
                                    <li key={`personality-${index}`}>• {trait}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-rosewood/70">
                                Life Path
                            </p>
                            <ul className="mt-2 space-y-2">
                                {traitsPreview.life.map((trait, index) => (
                                    <li key={`life-${index}`}>• {trait}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-rosewood/70">
                                Career
                            </p>
                            <ul className="mt-2 space-y-2">
                                {traitsPreview.career.map((trait, index) => (
                                    <li key={`career-${index}`}>• {trait}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-rosewood/70">
                                Strengths
                            </p>
                            <ul className="mt-2 space-y-2">
                                {traitsPreview.strengths.map((trait, index) => (
                                    <li key={`strength-${index}`}>• {trait}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-rosewood/70">
                                Growth Areas
                            </p>
                            <ul className="mt-2 space-y-2">
                                {traitsPreview.growthAreas.map((trait, index) => (
                                    <li key={`growth-${index}`}>• {trait}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                        setResonanceAccepted(true);
                        navigate("/results");
                    }}
                    disabled={!traitsPreview}
                >
                    Yes, continue
                </button>
                <button
                    type="button"
                    className="ghost-button"
                    onClick={() => {
                        setResonanceAccepted(false);
                        navigate("/birth-details");
                    }}
                >
                    No, edit details
                </button>
                <button
                    type="button"
                    className="ghost-button"
                    onClick={() => navigate("/palm-upload")}
                >
                    Back
                </button>
            </div>
        </section>
    );
}
