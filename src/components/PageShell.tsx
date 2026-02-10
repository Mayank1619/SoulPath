import type { ReactNode } from "react";

interface PageShellProps {
    children: ReactNode;
    theme: "light" | "dark";
    onToggleTheme: () => void;
}

export function PageShell({ children, theme, onToggleTheme }: PageShellProps) {
    return (
        <div className="shell">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
                <header className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.4em] text-rosewood/80">
                    <span>SoulPath</span>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline">Astrology + Palmistry</span>
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
                <footer className="mt-10 text-xs uppercase tracking-[0.3em] text-rosewood/70">
                    Grounded guidance, gentle insights
                </footer>
            </div>
        </div>
    );
}
