import { Link, router } from '@inertiajs/react';
import { LayoutGrid, List, PackageOpen, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatCurrency } from '@/utils/currency';

interface Category {
    id: number;
    name: string;
}

interface CatalogProduct {
    id: number;
    slug: string;
    name: string;
    sku: string;
    category: string;
    category_id: number;
    price: number;
    image: string | null;
    is_featured: boolean;
}

interface CatalogProps {
    products: CatalogProduct[];
    categories: Category[];
    selectedCategoryId: number | null;
}

export default function Catalog({ products, categories, selectedCategoryId }: CatalogProps) {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('catalog-view', 'grid');

    function handleCategorySelect(id: number | null) {
        const query: Record<string, string> = {};
        if (id) {
            query.category_id = String(id);
        }
        router.get(window.location.pathname, query, { preserveState: true });
    }

    const filtered = useMemo(() => {
        if (!search.trim()) return products;

        const q = search.toLowerCase();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q),
        );
    }, [products, search]);

    return (
        <CustomerLayout title="Catálogo">
            <div className="px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">Catálogo</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#999999] font-[Outfit]">
                            {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                        </span>
                        <div className="flex overflow-hidden rounded-lg border border-[#E5E5E5]">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-[#5E7052] text-white'
                                        : 'bg-white text-[#999999] hover:text-[#666666]'
                                }`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex h-8 w-8 items-center justify-center transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-[#5E7052] text-white'
                                        : 'bg-white text-[#999999] hover:text-[#666666]'
                                }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#999999]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar producto, categoría o SKU..."
                        className="w-full h-12 pl-12 pr-10 rounded-xl border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052]/30 focus:border-transparent font-[Outfit] text-sm"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Category Chips */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => handleCategorySelect(null)}
                        className={`shrink-0 rounded-full border px-4 py-2 font-[Outfit] text-sm font-medium transition-colors ${
                            !selectedCategoryId
                                ? 'border-[#5E7052] bg-[#5E7052] text-white'
                                : 'border-[#E5E5E5] bg-white text-[#666666] hover:border-[#5E7052] hover:text-[#5E7052]'
                        }`}
                    >
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category.id)}
                            className={`shrink-0 rounded-full border px-4 py-2 font-[Outfit] text-sm font-medium transition-colors ${
                                selectedCategoryId === category.id
                                    ? 'border-[#5E7052] bg-[#5E7052] text-white'
                                    : 'border-[#E5E5E5] bg-white text-[#666666] hover:border-[#5E7052] hover:text-[#5E7052]'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {filtered.length > 0 ? (
                    <div
                        className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                                : 'flex flex-col gap-3'
                        }
                    >
                        {filtered.map((product) =>
                            viewMode === 'grid' ? (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                                >
                                    <div className="h-40 lg:h-48 bg-[#F5F3F0] relative">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-12 h-12 bg-[#E8E8E8] rounded-full" />
                                            </div>
                                        )}
                                        <span className="absolute top-2 left-2 bg-white/90 text-[#666666] font-[Outfit] text-xs font-medium px-2 py-1 rounded-full">
                                            {product.category}
                                        </span>
                                        {product.is_featured && (
                                            <span className="absolute top-2 right-2 bg-[#D4A853] text-white font-[Outfit] text-xs font-medium px-2 py-1 rounded-full">
                                                Destacado
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col gap-2 flex-1">
                                        <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm leading-snug line-clamp-2">
                                            {product.name}
                                        </span>
                                        <span className="font-[Outfit] font-bold text-[#8B6F47] text-sm mt-auto">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="flex items-center gap-4 bg-white rounded-2xl border border-[#E5E5E5] p-3 hover:shadow-md transition-shadow"
                                >
                                    <div className="h-20 w-20 shrink-0 rounded-xl bg-[#F5F3F0] overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-8 h-8 bg-[#E8E8E8] rounded-full" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <span className="font-[Outfit] text-xs font-medium text-[#999999]">
                                            {product.category}
                                        </span>
                                        <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm leading-snug line-clamp-2">
                                            {product.name}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-[Outfit] font-bold text-[#8B6F47] text-sm">
                                                {formatCurrency(product.price)}
                                            </span>
                                            {product.is_featured && (
                                                <span className="bg-[#D4A853] text-white font-[Outfit] text-xs font-medium px-2 py-0.5 rounded-full">
                                                    Destacado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ),
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 py-16">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4E5D0]">
                            <PackageOpen className="h-8 w-8 text-[#5E7052]" />
                        </div>
                        <p className="text-center text-sm text-[#666666] font-[Outfit]">
                            No se encontraron productos
                            {search && (
                                <>
                                    {' '}
                                    para &ldquo;<span className="font-semibold text-[#5E7052]">{search}</span>&rdquo;
                                </>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
