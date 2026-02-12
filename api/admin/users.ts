import { Auth } from "@auth/core";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";
import { authConfig, buildAuthRequest, getBaseUrl, isAdminEmail } from "../_auth";

async function getSession(req: VercelRequest) {
    const baseUrl = getBaseUrl(req);
    const sessionRequest = buildAuthRequest(
        {
            url: "/api/auth/session",
            method: "GET",
            headers: req.headers,
        },
        baseUrl
    );

    const response = await Auth(sessionRequest, authConfig);
    if (!response.ok) {
        return null;
    }

    try {
        return (await response.json()) as { user?: { email?: string } };
    } catch {
        return null;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Allow", "GET");
        res.end("Method Not Allowed");
        return;
    }

    const session = await getSession(req);
    const email = session?.user?.email;

    if (!isAdminEmail(email)) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Unauthorized" }));
        return;
    }

    const userIds = await kv.smembers("users");
    const users = await Promise.all(
        userIds.map(async (id) => {
            const record = await kv.hgetall<Record<string, string>>(`user:${id}`);
            return record ?? { id };
        })
    );

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ users }));
}
