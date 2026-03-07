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
                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                    {label}
                </span>
                <span className="text-[13px] text-[#999999] font-[Outfit]">
                    {description}
                </span>
            </div>
            <button
                type="button"
                onClick={onToggle}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                    enabled ? 'bg-[#4A5D4A]' : 'bg-[#F5F3F0] border border-[#E5E5E5]'
                }`}
            >
                <div
                    className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                    } ${!enabled ? 'border border-[#E5E5E5]' : ''}`}
                />
            </button>
        </div>
    );
}
