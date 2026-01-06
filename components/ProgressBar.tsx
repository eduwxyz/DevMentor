interface ProgressBarProps {
    total: number;
    current: number;
}

export default function ProgressBar({ total, current }: ProgressBarProps) {
    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, index) => (
                <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${index < current
                            ? "bg-accent"
                            : "bg-background-tertiary border border-border"
                        }`}
                />
            ))}
        </div>
    );
}
