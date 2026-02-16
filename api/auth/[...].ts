import { Auth } from "@auth/core";
import { authConfig, buildAuthRequest, getBaseUrl } from "../_auth.js";

export default async function handler(req: any, res: any) {
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
}
