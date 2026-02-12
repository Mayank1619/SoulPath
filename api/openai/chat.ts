interface OpenAIResponse {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
}

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Allow", "POST");
        res.end("Method Not Allowed");
        return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Missing OpenAI API key." }));
        return;
    }

    const { question, context } = req.body ?? {};
    if (!question || typeof question !== "string") {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Missing question." }));
        return;
    }

    let systemPrompt =
        "You are a wise and compassionate spiritual guide helping someone understand their SoulPath reading. " +
        "You provide thoughtful, personalized insights based on their astrological guidance. " +
        "Be warm, supportive, and specific in your responses.";

    if (context?.birthDetails) {
        const { dateOfBirth, timeOfBirth, placeOfBirth } = context.birthDetails;
        systemPrompt += `\n\nUser's birth details: Born on ${dateOfBirth || "unknown date"} at ${timeOfBirth || "unknown time"} in ${placeOfBirth || "unknown location"}.`;
    }

    if (Array.isArray(context?.selectedCategories) && context.selectedCategories.length > 0) {
        systemPrompt += `\n\nThe user is interested in: ${context.selectedCategories.join(", ")}.`;
    }

    if (context?.guidance) {
        systemPrompt += `\n\nTheir guidance summary: ${JSON.stringify(context.guidance).substring(0, 1000)}...`;
    }

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.7,
        }),
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
        res.statusCode = response.status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: data.error?.message || "OpenAI request failed." }));
        return;
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Empty response from OpenAI." }));
        return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ content }));
}
