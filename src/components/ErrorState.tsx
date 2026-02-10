interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="glass-card flex flex-col gap-4 px-6 py-8">
            <p className="text-sm uppercase tracking-[0.3em] text-rosewood/80">
                Something went off-course
            </p>
            <p className="text-base text-ink/70">{message}</p>
            {onRetry ? (
                <button type="button" className="primary-button w-fit" onClick={onRetry}>
                    Try Again
                </button>
            ) : null}
        </div>
    );
}
