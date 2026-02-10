import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import type {
    BirthDetails,
    CategoryKey,
    GuidanceResponse,
    PalmImages,
    TraitsPreview,
} from "../types";
import { buildGuidancePrompt, buildTraitsPreviewPrompt } from "../utils/promptBuilder";
import { requestGuidance } from "../services/openaiService";

interface GuidanceState {
    details: BirthDetails;
    categories: CategoryKey[];
    palms: PalmImages;
    response: GuidanceResponse | null;
    isLoading: boolean;
    error: string | null;
    traitsPreview: TraitsPreview | null;
    isPreviewLoading: boolean;
    previewError: string | null;
    resonanceAccepted: boolean | null;
}

interface GuidanceContextValue extends GuidanceState {
    setDetails: (details: BirthDetails) => void;
    setCategories: (categories: CategoryKey[]) => void;
    setPalms: (palms: PalmImages) => void;
    generateGuidance: () => Promise<void>;
    generateTraitsPreview: () => Promise<void>;
    resetResponse: () => void;
    resetPreview: () => void;
    setResonanceAccepted: (value: boolean | null) => void;
}

const GuidanceContext = createContext<GuidanceContextValue | undefined>(
    undefined
);

const initialDetails: BirthDetails = {
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
};

export function GuidanceProvider({ children }: { children: ReactNode }) {
    const [details, setDetails] = useState<BirthDetails>(initialDetails);
    const [categories, setCategories] = useState<CategoryKey[]>([]);
    const [palms, setPalms] = useState<PalmImages>({
        leftFile: null,
        rightFile: null,
        leftPreview: null,
        rightPreview: null,
    });
    const [response, setResponse] = useState<GuidanceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [traitsPreview, setTraitsPreview] = useState<TraitsPreview | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [resonanceAccepted, setResonanceAccepted] = useState<boolean | null>(null);

    const resetResponse = useCallback(() => {
        setResponse(null);
        setError(null);
    }, []);

    const resetPreview = useCallback(() => {
        setTraitsPreview(null);
        setPreviewError(null);
        setResonanceAccepted(null);
    }, []);

    const generateTraitsPreview = useCallback(async () => {
        setIsPreviewLoading(true);
        setPreviewError(null);

        const controller = new AbortController();
        const timeoutId = globalThis.setTimeout(() => controller.abort(), 60000);

        try {
            if (!details.dateOfBirth || !details.timeOfBirth || !details.placeOfBirth) {
                throw new Error("Birth details are incomplete.");
            }
            const prompt = buildTraitsPreviewPrompt({ details, categories, palms });
            const content = await requestGuidance(prompt, controller.signal);
            const parsed = JSON.parse(content) as TraitsPreview;

            if (
                !parsed?.personality?.length ||
                !parsed?.life?.length ||
                !parsed?.career?.length ||
                !parsed?.summary ||
                !parsed?.strengths?.length ||
                !parsed?.growthAreas?.length ||
                typeof parsed.confidence !== "number"
            ) {
                throw new Error("The preview response could not be parsed.");
            }

            setTraitsPreview(parsed);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unable to generate preview.";
            setPreviewError(message);
            setTraitsPreview(null);
        } finally {
            globalThis.clearTimeout(timeoutId);
            setIsPreviewLoading(false);
        }
    }, [details, categories, palms]);

    const generateGuidance = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = globalThis.setTimeout(() => controller.abort(), 60000);

        try {
            if (!categories.length) {
                throw new Error("Select at least one category.");
            }
            if (!details.dateOfBirth || !details.timeOfBirth || !details.placeOfBirth) {
                throw new Error("Birth details are incomplete.");
            }
            const prompt = buildGuidancePrompt({ details, categories, palms });
            const content = await requestGuidance(prompt, controller.signal);

            let parsed: GuidanceResponse | null = null;

            try {
                parsed = JSON.parse(content) as GuidanceResponse;
            } catch (parseError) {
                const fallback = content
                    .split("\n")
                    .map((line) => line.replace(/^[-*]\s*/, "").trim())
                    .filter(Boolean);

                parsed = {
                    categories: [
                        {
                            category: "Guidance",
                            insights: fallback.slice(0, 5).map((text) => ({
                                insight: text,
                                time_window: "Ongoing",
                                action_step: "Reflect on this guidance daily.",
                            })),
                        },
                    ],
                };
            }

            if (!parsed?.categories?.length) {
                throw new Error("The response could not be parsed.");
            }

            setResponse(parsed);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Unable to generate guidance.";
            setError(message);
            setResponse(null);
        } finally {
            globalThis.clearTimeout(timeoutId);
            setIsLoading(false);
        }
    }, [details, categories, palms]);

    const value = useMemo(
        () => ({
            details,
            categories,
            palms,
            response,
            isLoading,
            error,
            traitsPreview,
            isPreviewLoading,
            previewError,
            resonanceAccepted,
            setDetails,
            setCategories,
            setPalms,
            generateGuidance,
            generateTraitsPreview,
            resetResponse,
            resetPreview,
            setResonanceAccepted,
        }),
        [
            details,
            categories,
            palms,
            response,
            isLoading,
            error,
            traitsPreview,
            isPreviewLoading,
            previewError,
            resonanceAccepted,
            generateGuidance,
            generateTraitsPreview,
            resetResponse,
            resetPreview,
            setResonanceAccepted,
        ]
    );

    return (
        <GuidanceContext.Provider value={value}>
            {children}
        </GuidanceContext.Provider>
    );
}

export function useGuidance() {
    const context = useContext(GuidanceContext);

    if (!context) {
        throw new Error("useGuidance must be used within GuidanceProvider.");
    }

    return context;
}
