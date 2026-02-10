interface OpenAIMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface OpenAIResponse {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
}

export async function requestGuidance(
    prompt: string,
    signal?: AbortSignal
): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing OpenAI API key.");
    }

    const messages: OpenAIMessage[] = [
        { role: "system", content: "You provide spiritual guidance." },
        { role: "user", content: prompt },
    ];

    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), 60000);

    if (signal) {
        if (signal.aborted) {
            controller.abort();
        } else {
            signal.addEventListener("abort", () => controller.abort(), {
                once: true,
            });
        }
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages,
                temperature: 0.6,
            }),
            signal: controller.signal,
        });

        const rawText = await response.text();
        let data: OpenAIResponse = {};

        if (rawText) {
            try {
                data = JSON.parse(rawText) as OpenAIResponse;
            } catch {
                data = { error: { message: rawText } };
            }
        }

        if (!response.ok) {
            throw new Error(data.error?.message || "OpenAI request failed.");
        }

        const content = data.choices?.[0]?.message?.content?.trim();

        if (!content) {
            throw new Error("Empty response from OpenAI.");
        }

        return content;
    } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
            throw new Error("Request timed out. Please try again.");
        }
        throw err;
    } finally {
        globalThis.clearTimeout(timeoutId);
    }
}
