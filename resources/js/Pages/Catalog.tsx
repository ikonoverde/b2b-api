import { Link, router } from '@inertiajs/react';
import { PackageOpen, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';

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

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function Catalog({ products, categories, selectedCategoryId }: CatalogProps) {
    const [search, setSearch] = useState('');

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
                    <span className="text-sm font-medium text-[#999999] font-[Outfit]">
                        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                    </span>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                            >
                                {/* Image */}
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

                                {/* Details */}
                                <div className="p-4 flex flex-col gap-2 flex-1">
                                    <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm leading-snug line-clamp-2">
                                        {product.name}
                                    </span>
                                    <span className="font-[Outfit] font-bold text-[#8B6F47] text-sm mt-auto">
                                        {formatCurrency(product.price)}
                                    </span>
                                </div>
                            </Link>
                        ))}
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
