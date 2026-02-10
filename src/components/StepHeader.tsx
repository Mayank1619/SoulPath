interface StepHeaderProps {
    eyebrow: string;
    title: string;
    subtitle?: string;
}

export function StepHeader({ eyebrow, title, subtitle }: StepHeaderProps) {
    return (
        <div className="mb-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-rosewood/80">
                {eyebrow}
            </p>
            <h1 className="text-4xl font-semibold text-ink md:text-5xl">{title}</h1>
            {subtitle ? (
                <p className="max-w-2xl text-base text-ink/70 md:text-lg">{subtitle}</p>
            ) : null}
        </div>
    );
}
