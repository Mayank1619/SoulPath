import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field } from "../components/Field";
import { StepHeader } from "../components/StepHeader";
import { useGuidance } from "../context/GuidanceContext";

export function BirthDetails() {
    const navigate = useNavigate();
    const { details, setDetails } = useGuidance();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof typeof details, value: string) => {
        setDetails({ ...details, [field]: value });
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!details.dateOfBirth) {
            next.dateOfBirth = "Date of birth is required.";
        }
        if (!details.timeOfBirth) {
            next.timeOfBirth = "Time of birth is required.";
        }
        if (!details.placeOfBirth.trim()) {
            next.placeOfBirth = "Place of birth is required.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleContinue = () => {
        if (!validate()) {
            return;
        }
        navigate("/palm-upload");
    };

    return (
        <section>
            <StepHeader
                eyebrow="Step 2"
                title="Share your birth details"
                subtitle="These inputs shape the celestial and palmistry insights we generate."
            />
            <div className="grid gap-5 md:grid-cols-2">
                <Field
                    label="Full Name (optional)"
                    id="full-name"
                    name="fullName"
                    placeholder="Your name"
                    value={details.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                />
                <Field
                    label="Date of Birth"
                    id="date-of-birth"
                    name="dateOfBirth"
                    type="date"
                    value={details.dateOfBirth}
                    onChange={(event) => handleChange("dateOfBirth", event.target.value)}
                    error={errors.dateOfBirth}
                />
                <Field
                    label="Time of Birth"
                    id="time-of-birth"
                    name="timeOfBirth"
                    type="time"
                    value={details.timeOfBirth}
                    onChange={(event) => handleChange("timeOfBirth", event.target.value)}
                    error={errors.timeOfBirth}
                />
                <Field
                    label="Place of Birth"
                    id="place-of-birth"
                    name="placeOfBirth"
                    placeholder="City, Country"
                    value={details.placeOfBirth}
                    onChange={(event) => handleChange("placeOfBirth", event.target.value)}
                    error={errors.placeOfBirth}
                />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="primary-button" onClick={handleContinue}>
                    Continue
                </button>
                <button
                    type="button"
                    className="ghost-button"
                    onClick={() => navigate("/categories")}
                >
                    Back
                </button>
            </div>
        </section>
    );
}
