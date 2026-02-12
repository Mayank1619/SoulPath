import { Auth } from "@auth/core";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authConfig, buildAuthRequest, getBaseUrl } from "../_auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const baseUrl = getBaseUrl(req);
    const request = buildAuthRequest(req, baseUrl);
    const response = await Auth(request, authConfig);

    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));

    const body = await response.text();
    res.end(body);
}
