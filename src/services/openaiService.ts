interface BackendResponse {
    content?: string;
    error?: string;
}

export async function requestGuidance(
    prompt: string,
    signal?: AbortSignal
): Promise<string> {
    const response = await fetch("/api/openai/guidance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal,
    });

    const data = (await response.json()) as BackendResponse;
    if (!response.ok) {
        throw new Error(data.error || "Guidance request failed.");
    }

    const content = data.content?.trim();
    if (!content) {
        throw new Error("Empty response from server.");
    }

    return content;
}

export async function chatWithAI(
    question: string,
    context: {
        birthDetails?: { dateOfBirth?: string; timeOfBirth?: string; placeOfBirth?: string };
        selectedCategories?: string[];
        guidance?: unknown;
    },
    signal?: AbortSignal
): Promise<string> {
    const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, context }),
        signal,
    });

    const data = (await response.json()) as BackendResponse;
    if (!response.ok) {
        throw new Error(data.error || "Chat request failed.");
    }

    const content = data.content?.trim();
    if (!content) {
        throw new Error("Empty response from server.");
    }

    return content;
}
