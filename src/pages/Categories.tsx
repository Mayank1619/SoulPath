import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "../components/CategoryCard";
import { StepHeader } from "../components/StepHeader";
import { useGuidance } from "../context/GuidanceContext";
import type { CategoryKey } from "../types";

const CATEGORY_OPTIONS: CategoryKey[] = [
    "Health",
    "Career",
    "Relationships",
    "Wealth",
    "Spirituality",
];

export function Categories() {
    const navigate = useNavigate();
    const { categories, setCategories } = useGuidance();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Astroya SoulPath | Categories";
    }, []);

    const selected = useMemo(() => new Set(categories), [categories]);

    const toggleCategory = (category: CategoryKey) => {
        const next = new Set(selected);
        if (next.has(category)) {
            next.delete(category);
        } else {
            next.add(category);
        }
        setCategories(Array.from(next));
    };

    const handleContinue = () => {
        if (!categories.length) {
            setError("Select at least one category to continue.");
            return;
        }
        setError(null);
        navigate("/birth-details");
    };

    return (
        <section>
            <StepHeader
                eyebrow="Step 1"
                title="Choose your guidance focus"
                subtitle="Select the areas you want gentle insight on. You can mix multiple focuses to shape your reading."
            />
            <div className="grid gap-4 md:grid-cols-2">
                {CATEGORY_OPTIONS.map((category) => (
                    <CategoryCard
                        key={category}
                        label={category}
                        selected={selected.has(category)}
                        onToggle={() => toggleCategory(category)}
                    />
                ))}
            </div>
            {error ? (
                <p className="mt-4 text-sm text-rosewood">{error}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="primary-button" onClick={handleContinue}>
                    Continue
                </button>
                <button
                    type="button"
                    className="ghost-button"
                    onClick={() => navigate("/")}
                >
                    Back
                </button>
            </div>
        </section>
    );
}
