export type CategoryKey =
    | "Health"
    | "Career"
    | "Relationships"
    | "Wealth"
    | "Spirituality";

export interface BirthDetails {
    name?: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
}

export interface PalmImages {
    leftFile?: File | null;
    rightFile?: File | null;
    leftPreview?: string | null;
    rightPreview?: string | null;
}

export interface GuidanceCategory {
    category: string;
    insights: string[];
}

export interface GuidanceResponse {
    categories: GuidanceCategory[];
}

export interface TraitsPreview {
    personality: string[];
    life: string[];
    career: string[];
    summary: string;
    strengths: string[];
    growthAreas: string[];
    confidence: number;
    palmUsed: boolean;
}
