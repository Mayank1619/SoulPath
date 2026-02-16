export interface SessionUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "admin" | "user";
}

export interface Session {
    user?: SessionUser;
    expires?: string;
}

export async function getSession(): Promise<Session | null> {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
        return null;
    }

    try {
        return (await response.json()) as Session;
    } catch {
        return null;
    }
}

export function signIn() {
    window.location.href = "/api/auth/signin";
}

export function signOut() {
    window.location.href = "/api/auth/signout";
}
