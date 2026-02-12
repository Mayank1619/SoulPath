import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Session } from "../services/authService";
import { getSession, signIn, signOut } from "../services/authService";

interface PageShellProps {
    children: ReactNode;
    theme: "light" | "dark";
    onToggleTheme: () => void;
}

export function PageShell({
    children,
    theme,
    onToggleTheme,
}: Readonly<PageShellProps>) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const loadSession = async () => {
            const current = await getSession();
            setSession(current);
        };

        void loadSession();
    }, []);

    const isAdmin = session?.user?.role === "admin";

    return (
        <div className="shell">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
                <header className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.4em] text-rosewood/80">
                    <Link to="/" className="hover:text-rosewood transition-colors cursor-pointer">
                        SoulPath
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline">Astrology + Palmistry</span>
                        {isAdmin ? (
                            <Link
                                to="/admin"
                                className="ghost-button px-4 py-2 text-[0.6rem] tracking-[0.3em]"
                            >
                                Admin
                            </Link>
                        ) : null}
                        <button
                            type="button"
                            className="ghost-button px-4 py-2 text-[0.6rem] tracking-[0.3em]"
                            onClick={session?.user ? signOut : signIn}
                        >
                            {session?.user ? "Sign Out" : "Sign In"}
                        </button>
                        <button
                            type="button"
                            className="ghost-button px-4 py-2 text-[0.6rem] tracking-[0.3em]"
                            onClick={onToggleTheme}
                            aria-pressed={theme === "dark"}
                        >
                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </header>
                <main className="mt-10 flex-1 animate-fadeUp">{children}</main>
                <footer className="mt-10 flex flex-col items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-rosewood/70">
                    <div>Grounded guidance, gentle insights</div>
                    <div className="text-[0.7rem] tracking-wider">Powered by <a href="https://netfroot.com" target="_blank" rel="noopener noreferrer" className="text-rosewood/90 hover:text-rosewood transition">netfroot.com</a></div>
                </footer>
            </div>
        </div>
    );
}
