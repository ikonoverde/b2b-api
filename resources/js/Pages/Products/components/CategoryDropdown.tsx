import { ChevronDown } from 'lucide-react';
import type { Category } from '../types';

export default function CategoryDropdown({
    categoryId,
    categories,
    isOpen,
    onToggle,
    onSelect,
    error,
}: {
    categoryId: string;
    categories: Category[];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (categoryId: string) => void;
    error?: string;
}) {
    const selectedCategory = categories.find((cat) => String(cat.id) === categoryId);

    return (
        <div className="flex-1 flex flex-col gap-2 relative">
            <label className="text-sm font-medium text-foreground">
                Categor&iacute;a
            </label>
            <button
                type="button"
                onClick={onToggle}
                className="h-11 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors flex items-center justify-between"
            >
                <span className={categoryId ? 'text-foreground' : 'text-muted-foreground'}>
                    {selectedCategory?.name || 'Seleccionar categor\u00eda'}
                </span>
                <ChevronDown className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-10 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelect(String(cat.id))}
                            className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors"
                        >
                            {cat.name}
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
