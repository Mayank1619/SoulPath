import { Auth } from "@auth/core";
import { authConfig, buildAuthRequest, getBaseUrl, isAdminEmail } from "../_auth.js";

async function getSession(req: any) {
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

export default async function handler(req: any, res: any) {
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

    // User storage not yet implemented
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
        users: [],
        message: "User tracking will be available soon. Currently using JWT-only sessions."
    }));
}
