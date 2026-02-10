interface CategoryCardProps {
    label: string;
    selected: boolean;
    onToggle: () => void;
}

export function CategoryCard({ label, selected, onToggle }: CategoryCardProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`glass-card focus-ring w-full rounded-xl px-6 py-6 text-left transition ${selected
                ? "border-ember/60 shadow-lift"
                : "border-transparent hover:-translate-y-1 hover:border-ink/10"
                }`}
        >
            <p className="text-lg font-semibold text-ink">{label}</p>
            <p className="mt-2 text-sm text-ink/60">
                Tap to {selected ? "remove" : "add"} focus
            </p>
        </button>
    );
}
