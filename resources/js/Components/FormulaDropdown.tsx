import { ChevronDown } from 'lucide-react';

export interface Formula {
    id: number;
    name: string;
}

export default function FormulaDropdown({
    formulaId,
    formulas,
    isOpen,
    onToggle,
    onSelect,
    error,
}: {
    formulaId: string;
    formulas: Formula[];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (formulaId: string) => void;
    error?: string;
}) {
    const selectedFormula = formulas.find((f) => String(f.id) === formulaId);

    return (
        <div className="flex flex-col gap-2 relative">
            <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                F&oacute;rmula
            </label>
            <button
                type="button"
                onClick={onToggle}
                className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors flex items-center justify-between"
            >
                <span className={formulaId ? 'text-[#1A1A1A]' : 'text-[#999999]'}>
                    {selectedFormula?.name || 'Sin f\u00f3rmula'}
                </span>
                <ChevronDown className="w-[18px] h-[18px] text-[#999999]" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-10 max-h-48 overflow-y-auto">
                    <button
                        type="button"
                        onClick={() => onSelect('')}
                        className="w-full px-4 py-2.5 text-left text-sm text-[#999999] font-[Outfit] hover:bg-[#F5F3F0] transition-colors"
                    >
                        Sin f&oacute;rmula
                    </button>
                    {formulas.map((formula) => (
                        <button
                            key={formula.id}
                            type="button"
                            onClick={() => onSelect(String(formula.id))}
                            className="w-full px-4 py-2.5 text-left text-sm text-[#1A1A1A] font-[Outfit] hover:bg-[#F5F3F0] transition-colors"
                        >
                            {formula.name}
                        </button>
                    ))}
                </div>
            )}
            {error && (
                <span className="text-xs text-red-500 font-[Outfit]">{error}</span>
            )}
        </div>
    );
}
