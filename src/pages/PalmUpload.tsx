import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StepHeader } from "../components/StepHeader";
import { useGuidance } from "../context/GuidanceContext";

export function PalmUpload() {
    const navigate = useNavigate();
    const { palms, setPalms, resetResponse, resetPreview } = useGuidance();

    useEffect(() => {
        document.title = "SoulPath | Palm Upload";
    }, []);

    const handleFileChange =
        (side: "left" | "right") => (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                if (side === "left") {
                    setPalms({
                        ...palms,
                        leftFile: file,
                        leftPreview: reader.result as string,
                    });
                } else {
                    setPalms({
                        ...palms,
                        rightFile: file,
                        rightPreview: reader.result as string,
                    });
                }
            };
            reader.readAsDataURL(file);
        };

    const handleContinue = () => {
        resetResponse();
        resetPreview();
        navigate("/resonance");
    };

    return (
        <section>
            <StepHeader
                eyebrow="Step 3"
                title="Add optional palm images"
                subtitle="Palm images are optional but can add nuance. Upload clearly lit photos or skip this step."
            />
            <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-card space-y-4 px-6 py-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rosewood/80">
                        Left hand
                    </p>
                    <input
                        id="left-palm"
                        name="leftPalm"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange("left")}
                        className="text-sm"
                    />
                    {palms.leftPreview ? (
                        <img
                            src={palms.leftPreview}
                            alt="Left palm preview"
                            className="h-48 w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-48 items-center justify-center rounded-xl border border-dune/60 bg-white/60 text-sm text-ink/50">
                            No image uploaded
                        </div>
                    )}
                </div>
                <div className="glass-card space-y-4 px-6 py-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rosewood/80">
                        Right hand
                    </p>
                    <input
                        id="right-palm"
                        name="rightPalm"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange("right")}
                        className="text-sm"
                    />
                    {palms.rightPreview ? (
                        <img
                            src={palms.rightPreview}
                            alt="Right palm preview"
                            className="h-48 w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-48 items-center justify-center rounded-xl border border-dune/60 bg-white/60 text-sm text-ink/50">
                            No image uploaded
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="primary-button" onClick={handleContinue}>
                    Generate Guidance
                </button>
                <button type="button" className="ghost-button" onClick={handleContinue}>
                    Continue Without Palm Images
                </button>
                <button
                    type="button"
                    className="ghost-button"
                    onClick={() => navigate("/birth-details")}
                >
                    Back
                </button>
            </div>
        </section>
    );
}
