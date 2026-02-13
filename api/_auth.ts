import type { AuthConfig } from "@auth/core";
import Google from "@auth/core/providers/google";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const authConfig: AuthConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    pages: {
        signIn: "/",
        error: "/",
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user }) {
            if (!user?.id) {
                return false;
            }
            // User tracking will be added later with proper storage
            return true;
        },
        async session({ session, user }) {
            const email = session.user?.email ?? user?.email ?? "";
            const isAdmin = isAdminEmail(email);

            return {
                ...session,
                user: {
                    ...session.user,
                    id: user?.id ?? session.user?.id,
                    role: isAdmin ? "admin" : "user",
                },
            };
        },
    },
};

export function isAdminEmail(email?: string | null) {
    if (!email) {
        return false;
    }

    return adminEmails.includes(email.toLowerCase());
}

export function getBaseUrl(req: {
    headers: Record<string, string | string[] | undefined>;
}) {
    const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "";
    const proto = req.headers["x-forwarded-proto"] ?? "https";
    return `${proto}://${host}`;
}

export function buildAuthRequest(
    req: {
        url?: string;
        method?: string;
        headers: Record<string, string | string[] | undefined>;
        body?: unknown;
    },
    baseUrl: string
) {
    // Get the path from the request
    const path = req.url || "/api/auth/signin";
    const fullUrl = `${baseUrl}${path}`;

    const url = new URL(fullUrl);
    const headers = new Headers();

    // Copy relevant headers
    const headersToInclude = [
        "host",
        "user-agent",
        "accept",
        "content-type",
        "cookie",
        "referer",
    ];

    Object.entries(req.headers).forEach(([key, value]) => {
        if (!value || !headersToInclude.includes(key.toLowerCase())) {
            return;
        }

        if (Array.isArray(value)) {
            headers.set(key, value.join(","));
        } else {
            headers.set(key, value);
        }
    });

    const method = req.method?.toUpperCase() ?? "GET";
    let body: BodyInit | undefined;

    if (method !== "GET" && method !== "HEAD") {
        if (req.body) {
            body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        }
    }

    return new Request(url, {
        method,
        headers,
        body,
    });
}
