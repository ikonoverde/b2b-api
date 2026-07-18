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
            <label className="text-sm font-medium text-foreground">
                F&oacute;rmula
            </label>
            <button
                type="button"
                onClick={onToggle}
                className="h-11 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors flex items-center justify-between"
            >
                <span className={formulaId ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedFormula?.name || 'Sin f\u00f3rmula'}
                </span>
                <ChevronDown className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-10 max-h-48 overflow-y-auto">
                    <button
                        type="button"
                        onClick={() => onSelect('')}
                        className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                        Sin f&oacute;rmula
                    </button>
                    {formulas.map((formula) => (
                        <button
                            key={formula.id}
                            type="button"
                            onClick={() => onSelect(String(formula.id))}
                            className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors"
                        >
                            {formula.name}
                        </button>
                    ))}
                </div>
            )}
            {error && (
                <span className="text-xs text-destructive">{error}</span>
            )}
        </div>
    );
}
