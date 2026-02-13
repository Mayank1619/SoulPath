import { Auth } from "@auth/core";
import { authConfig, buildAuthRequest, getBaseUrl } from "../_auth.js";

export default async function handler(req: any, res: any) {
    try {
        if (!process.env.AUTH_SECRET) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "AUTH_SECRET not configured" }));
            return;
        }

        const baseUrl = getBaseUrl(req);
        const request = buildAuthRequest(req, baseUrl);
        const response = await Auth(request, authConfig);

        res.statusCode = response.status;

        // Copy headers from Auth response
        const headers = response.headers as any;
        if (headers && typeof headers.forEach === 'function') {
            headers.forEach((value: string, key: string) => {
                res.setHeader(key, value);
            });
        }

        const body = await response.text();
        res.end(body);
    } catch (error) {
        console.error("Auth error:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Auth endpoint failed" }));
    }
}
