import { useEffect, useState } from "react";
import { StepHeader } from "../components/StepHeader";
import { getSession } from "../services/authService";

interface UserRecord {
    id?: string;
    email?: string;
    name?: string;
    signupSource?: string;
    createdAt?: string;
}

export function Admin() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "SoulPath | Admin";
    }, []);

    useEffect(() => {
        const load = async () => {
            const session = await getSession();
            if (session?.user?.role !== "admin") {
                setError("You do not have access to this page.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/admin/users");
                const data = (await response.json()) as { users?: UserRecord[]; error?: string };

                if (!response.ok) {
                    throw new Error(data.error || "Failed to load users.");
                }

                setUsers(data.users ?? []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load users.");
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, []);

    if (isLoading) {
        return (
            <section>
                <StepHeader
                    eyebrow="Admin"
                    title="Loading users"
                    subtitle="Fetching recent signups"
                />
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <StepHeader
                    eyebrow="Admin"
                    title="Access restricted"
                    subtitle={error}
                />
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <StepHeader
                eyebrow="Admin"
                title="User signups"
                subtitle="View recent SoulPath signups"
            />
            <div className="glass-card px-6 py-6">
                {users.length === 0 ? (
                    <p className="text-sm text-ink/60">No signups yet.</p>
                ) : (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <div
                                key={user.id ?? user.email}
                                className="flex flex-col gap-1 border-b border-ink/10 pb-3 last:border-b-0"
                            >
                                <p className="text-base text-ink">
                                    {user.name || "Unnamed"}
                                </p>
                                <p className="text-sm text-ink/60">
                                    {user.email || "No email"}
                                </p>
                                <div className="flex flex-wrap gap-4 text-xs text-ink/50">
                                    <span>Source: {user.signupSource || "unknown"}</span>
                                    <span>Joined: {user.createdAt || "unknown"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
