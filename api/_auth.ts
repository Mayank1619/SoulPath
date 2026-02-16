import { kv } from "@vercel/kv";
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
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!user?.id) {
                return false;
            }

            // Store user data in KV only if configured
            try {
                const record = {
                    id: user.id,
                    email: user.email ?? "",
                    name: user.name ?? "",
                    image: user.image ?? "",
                    signupSource: account?.provider ?? "unknown",
                    createdAt: new Date().toISOString(),
                };

                await kv.sadd("users", user.id);
                await kv.hset(`user:${user.id}`, record);
            } catch (err) {
                // KV not configured, continue without storing
                console.warn("KV not available:", err);
            }

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
    const url = new URL(req.url ?? "", baseUrl);
    const headers = new Headers();

    Object.entries(req.headers).forEach(([key, value]) => {
        if (!value) {
            return;
        }

        if (Array.isArray(value)) {
            headers.set(key, value.join(","));
        } else {
            headers.set(key, value);
        }
    });

    const method = req.method?.toUpperCase() ?? "GET";
    const body =
        method === "GET" || method === "HEAD"
            ? undefined
            : JSON.stringify(req.body ?? {});

    return new Request(url, {
        method,
        headers,
        body,
    });
}
