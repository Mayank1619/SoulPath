import type { VercelRequest, VercelResponse } from "@vercel/node";

interface OpenAIResponse {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const { prompt } = req.body ?? {};
    if (!prompt || typeof prompt !== "string") {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Missing prompt." }));
        return;
    }

    const messages = [
        { role: "system", content: "You provide spiritual guidance." },
        { role: "user", content: prompt },
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
            temperature: 0.6,
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
