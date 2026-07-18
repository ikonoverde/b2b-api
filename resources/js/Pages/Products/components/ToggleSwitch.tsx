export default function ToggleSwitch({
    enabled,
    onToggle,
    label,
    description,
}: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    description: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                    {label}
                </span>
                <span className="text-[13px] text-muted-foreground">
                    {description}
                </span>
            </div>
            <button
                type="button"
                onClick={onToggle}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                    enabled ? 'bg-primary' : 'bg-muted border border-border'
                }`}
            >
                <div
                    className={`w-5 h-5 bg-card rounded-full shadow transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    } ${!enabled ? 'border border-border' : ''}`}
                />
            </button>
        </div>
    );
}
