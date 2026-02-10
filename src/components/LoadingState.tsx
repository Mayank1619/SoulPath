interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
    return (
        <div className="glass-card flex min-h-[220px] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="h-10 w-10 animate-floatSlow rounded-full border border-ember/60 bg-white/70" />
            <p className="text-sm uppercase tracking-[0.3em] text-rosewood/80">
                {message || "Analyzing your energies..."}
            </p>
        </div>
    );
}
