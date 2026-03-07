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
            <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                Categor&iacute;a
            </label>
            <button
                type="button"
                onClick={onToggle}
                className="h-11 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors flex items-center justify-between"
            >
                <span className={categoryId ? 'text-[#1A1A1A]' : 'text-[#999999]'}>
                    {selectedCategory?.name || 'Seleccionar categor\u00eda'}
                </span>
                <ChevronDown className="w-[18px] h-[18px] text-[#999999]" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-[#E5E5E5] shadow-lg z-10 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelect(String(cat.id))}
                            className="w-full px-4 py-2.5 text-left text-sm text-[#1A1A1A] font-[Outfit] hover:bg-[#F5F3F0] transition-colors"
                        >
                            {cat.name}
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
