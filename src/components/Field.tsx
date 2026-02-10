import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    helper?: string;
    error?: string;
}

export function Field({ label, helper, error, ...props }: FieldProps) {
    return (
        <label className="space-y-2 text-sm font-semibold uppercase tracking-[0.18em] text-rosewood/80">
            <span>{label}</span>
            <input
                {...props}
                className="focus-ring w-full rounded-xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-medium text-ink shadow-soft placeholder:text-ink/40"
            />
            {helper ? <p className="text-xs font-normal text-ink/60">{helper}</p> : null}
            {error ? (
                <p className="text-xs font-normal text-rosewood">{error}</p>
            ) : null}
        </label>
    );
}
