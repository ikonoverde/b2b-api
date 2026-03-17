import { InfiniteScroll, Link, router } from '@inertiajs/react';
import { ArrowUpDown, Check, LayoutGrid, List, PackageOpen, Plus, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
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

interface PaginatedProducts {
    data: CatalogProduct[];
}

type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

const SORT_LABELS: Record<SortOption, string> = {
    newest: 'Más recientes',
    oldest: 'Más antiguos',
    price_asc: 'Precio: menor a mayor',
    price_desc: 'Precio: mayor a menor',
    name_asc: 'Nombre: A-Z',
    name_desc: 'Nombre: Z-A',
};

interface CatalogProps {
    products: PaginatedProducts;
    categories: Category[];
    selectedCategoryId: number | null;
    selectedSort: SortOption | null;
    selectedSearch: string | null;
}

function SortDropdown({ selected, onSelect }: { selected: SortOption | null; onSelect: (sort: SortOption) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative shrink-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex h-10 items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 font-[Outfit] text-sm font-medium text-[#666666] transition-colors hover:border-[#5E7052] hover:text-[#5E7052]"
            >
                <ArrowUpDown className="h-4 w-4" />
                <span>{selected ? SORT_LABELS[selected] : 'Ordenar'}</span>
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-xl border border-[#E5E5E5] bg-white py-1 shadow-lg">
                        {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
                            <button
                                key={value}
                                onClick={() => {
                                    setOpen(false);
                                    onSelect(value);
                                }}
                                className={`w-full px-4 py-2 text-left font-[Outfit] text-sm transition-colors hover:bg-[#F5F3F0] ${
                                    selected === value || (!selected && value === 'newest')
                                        ? 'font-semibold text-[#5E7052]'
                                        : 'text-[#666666]'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

type CartState = 'loading' | 'added';

function AddToCartButton({ state, onClick }: { state?: CartState; onClick: (e: React.MouseEvent) => void }) {
    return (
        <button
            onClick={onClick}
            disabled={!!state}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                state === 'added'
                    ? 'scale-95 bg-emerald-500 text-white'
                    : 'bg-[#5E7052] text-white hover:bg-[#4a5c42] active:scale-90'
            } ${state ? 'opacity-80' : ''}`}
        >
            {state === 'added' ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
            ) : state === 'loading' ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
                <Plus className="h-4 w-4" strokeWidth={2.5} />
            )}
        </button>
    );
}

function ProductGridCard({
    product,
    cartState,
    onAddToCart,
}: {
    product: CatalogProduct;
    cartState?: CartState;
    onAddToCart: (e: React.MouseEvent, id: number) => void;
}) {
    return (
        <Link
            href={`/products/${product.slug}`}
            className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden flex flex-col hover:shadow-md transition-shadow"
        >
            <div className="h-40 lg:h-48 bg-[#F5F3F0] relative">
                {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
                <div className="mt-auto flex items-end justify-between gap-2">
                    <span className="font-[Outfit] font-bold text-[#8B6F47] text-sm">
                        {formatCurrency(product.price)}
                    </span>
                    <AddToCartButton state={cartState} onClick={(e) => onAddToCart(e, product.id)} />
                </div>
            </div>
        </Link>
    );
}

function ProductListCard({
    product,
    cartState,
    onAddToCart,
}: {
    product: CatalogProduct;
    cartState?: CartState;
    onAddToCart: (e: React.MouseEvent, id: number) => void;
}) {
    return (
        <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-4 bg-white rounded-2xl border border-[#E5E5E5] p-3 hover:shadow-md transition-shadow"
        >
            <div className="h-20 w-20 shrink-0 rounded-xl bg-[#F5F3F0] overflow-hidden">
                {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-[#E8E8E8] rounded-full" />
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="font-[Outfit] text-xs font-medium text-[#999999]">{product.category}</span>
                <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm leading-snug line-clamp-2">
                    {product.name}
                </span>
                <div className="flex items-center justify-between gap-2">
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
                    <AddToCartButton state={cartState} onClick={(e) => onAddToCart(e, product.id)} />
                </div>
            </div>
        </Link>
    );
}

function SearchBar({ search, onSearchChange, onClear }: { search: string; onSearchChange: (value: string) => void; onClear: () => void }) {
    return (
        <div className="relative mb-8">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#999999]" />
            <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar producto, categoría o SKU..."
                className="w-full h-12 pl-12 pr-10 rounded-xl border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052]/30 focus:border-transparent font-[Outfit] text-sm"
            />
            {search && (
                <button onClick={onClear} className="absolute top-1/2 right-4 -translate-y-1/2 text-[#999999] hover:text-[#666666]">
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}

function CategoryChip({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`shrink-0 rounded-full border px-4 py-2 font-[Outfit] text-sm font-medium transition-colors ${
                isSelected
                    ? 'border-[#5E7052] bg-[#5E7052] text-white'
                    : 'border-[#E5E5E5] bg-white text-[#666666] hover:border-[#5E7052] hover:text-[#5E7052]'
            }`}
        >
            {label}
        </button>
    );
}

function CategoryChips({ categories, selectedId, onSelect }: { categories: Category[]; selectedId: number | null; onSelect: (id: number | null) => void }) {
    return (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <CategoryChip label="Todos" isSelected={!selectedId} onClick={() => onSelect(null)} />
            {categories.map((category) => (
                <CategoryChip key={category.id} label={category.name} isSelected={selectedId === category.id} onClick={() => onSelect(category.id)} />
            ))}
        </div>
    );
}

function buildQuery(categoryId: number | null, sort: SortOption | null, search: string | null): Record<string, string> {
    const query: Record<string, string> = {};
    if (categoryId) {
        query.category_id = String(categoryId);
    }
    if (sort) {
        query.sort = sort;
    }
    if (search) {
        query.search = search;
    }
    return query;
}

function ProductList({
    products,
    viewMode,
    cartStates,
    onAddToCart,
}: {
    products: CatalogProduct[];
    viewMode: 'grid' | 'list';
    cartStates: Record<number, CartState>;
    onAddToCart: (e: React.MouseEvent, id: number) => void;
}) {
    const Card = viewMode === 'grid' ? ProductGridCard : ProductListCard;

    return (
        <div
            className={
                viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'flex flex-col gap-3'
            }
        >
            {products.map((product) => (
                <Card key={product.id} product={product} cartState={cartStates[product.id]} onAddToCart={onAddToCart} />
            ))}
        </div>
    );
}

function EmptyState({ search }: { search: string }) {
    return (
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
    );
}

function LoadingIndicator() {
    return (
        <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#5E7052]/30 border-t-[#5E7052]" />
        </div>
    );
}

function useFilters(selectedCategoryId: number | null, selectedSort: SortOption | null, selectedSearch: string | null) {
    const [search, setSearch] = useState(selectedSearch ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const filtersRef = useRef({ categoryId: selectedCategoryId, sort: selectedSort });
    filtersRef.current = { categoryId: selectedCategoryId, sort: selectedSort };

    useEffect(() => {
        if (search === (selectedSearch ?? '')) {
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                window.location.pathname,
                buildQuery(filtersRef.current.categoryId, filtersRef.current.sort, search || null),
                { preserveState: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [search, selectedSearch]);

    const handleCategorySelect = useCallback(
        (id: number | null) => {
            router.get(window.location.pathname, buildQuery(id, selectedSort, search || null), { preserveState: true });
        },
        [selectedSort, search],
    );

    const handleSortSelect = useCallback(
        (sort: SortOption) => {
            const newSort = sort === selectedSort || sort === 'newest' ? null : sort;
            router.get(window.location.pathname, buildQuery(selectedCategoryId, newSort, search || null), { preserveState: true });
        },
        [selectedSort, selectedCategoryId, search],
    );

    const handleClearSearch = useCallback(() => {
        clearTimeout(debounceRef.current);
        setSearch('');
        router.get(window.location.pathname, buildQuery(selectedCategoryId, selectedSort, null), { preserveState: true });
    }, [selectedCategoryId, selectedSort]);

    return { search, setSearch, handleCategorySelect, handleSortSelect, handleClearSearch };
}

export default function Catalog({ products, categories, selectedCategoryId, selectedSort, selectedSearch }: CatalogProps) {
    const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('catalog-view', 'grid');
    const [cartStates, setCartStates] = useState<Record<number, CartState>>({});
    const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const filters = useFilters(selectedCategoryId, selectedSort, selectedSearch);

    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(clearTimeout);
        };
    }, []);

    const addToCart = useCallback((e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        e.stopPropagation();

        router.post(
            '/cart/items',
            { product_id: productId, quantity: 1 },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => setCartStates((s) => ({ ...s, [productId]: 'loading' })),
                onSuccess: () => {
                    setCartStates((s) => ({ ...s, [productId]: 'added' }));
                    clearTimeout(timersRef.current[productId]);
                    timersRef.current[productId] = setTimeout(() => {
                        setCartStates((s) => {
                            const next = { ...s };
                            delete next[productId];
                            return next;
                        });
                        delete timersRef.current[productId];
                    }, 1500);
                },
                onError: () => {
                    setCartStates((s) => {
                        const next = { ...s };
                        delete next[productId];
                        return next;
                    });
                },
            },
        );
    }, []);

    return (
        <CustomerLayout title="Catálogo">
            <div className="px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">Catálogo</h1>
                    <div className="flex items-center gap-3">
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

                <SearchBar search={filters.search} onSearchChange={filters.setSearch} onClear={filters.handleClearSearch} />

                <div className="mb-6 flex items-center gap-4">
                    <SortDropdown selected={selectedSort} onSelect={filters.handleSortSelect} />
                </div>

                <CategoryChips categories={categories} selectedId={selectedCategoryId} onSelect={filters.handleCategorySelect} />

                {/* Product Grid with Infinite Scroll */}
                {products.data.length === 0 ? (
                    <EmptyState search={filters.search} />
                ) : (
                    <InfiniteScroll
                        data="products"
                        preserveUrl
                        loading={<LoadingIndicator />}
                    >
                        <ProductList
                            products={products.data}
                            viewMode={viewMode}
                            cartStates={cartStates}
                            onAddToCart={addToCart}
                        />
                    </InfiniteScroll>
                )}
            </div>
        </CustomerLayout>
    );
}
