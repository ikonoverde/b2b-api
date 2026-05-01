import { InfiniteScroll, Link, router } from '@inertiajs/react';
import { Check, ChevronDown, Minus, Plus, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import CustomerShell from '@/Layouts/CustomerShell';
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
    stock: number;
    image: string | null;
    is_featured: boolean;
}

interface PaginatedProducts {
    data: CatalogProduct[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

const SORT_LABELS: Record<SortOption, string> = {
    newest: 'Más recientes',
    oldest: 'Más antiguos',
    price_asc: 'Precio: menor a mayor',
    price_desc: 'Precio: mayor a menor',
    name_asc: 'Nombre: A–Z',
    name_desc: 'Nombre: Z–A',
};

interface CatalogProps {
    products: PaginatedProducts;
    categories: Category[];
    selectedCategoryId: number | null;
    selectedSort: SortOption | null;
    selectedSearch: string | null;
}

type CartState = 'loading' | 'added';

export default function Catalog({
    products,
    categories,
    selectedCategoryId,
    selectedSort,
    selectedSearch,
}: CatalogProps) {
    const [cartStates, setCartStates] = useState<Record<number, CartState>>({});
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const filters = useFilters(selectedCategoryId, selectedSort, selectedSearch);

    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(clearTimeout);
        };
    }, []);

    const setQty = useCallback((productId: number, next: number) => {
        setQuantities((s) => ({ ...s, [productId]: Math.max(1, next) }));
    }, []);

    const addToCart = useCallback(
        (productId: number) => {
            const quantity = quantities[productId] ?? 1;
            router.post(
                '/cart/items',
                { product_id: productId, quantity },
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
                            setQuantities((q) => {
                                const next = { ...q };
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
        },
        [quantities],
    );

    const hasFilters =
        Boolean(filters.search) || Boolean(selectedCategoryId) || Boolean(selectedSort);
    const showingCount = products.total ?? products.data.length;

    return (
        <CustomerShell title="Catálogo">
            <PageHeader count={showingCount} />

            <Toolbar
                search={filters.search}
                onSearchChange={filters.setSearch}
                onClearSearch={filters.handleClearSearch}
                sort={selectedSort}
                onSelectSort={filters.handleSortSelect}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={filters.handleCategorySelect}
            />

            {products.data.length === 0 ? (
                <EmptyState
                    search={filters.search}
                    hasFilters={hasFilters}
                    onClear={filters.handleClearAll}
                />
            ) : (
                <InfiniteScroll
                    data="products"
                    preserveUrl
                    loading={
                        <ol className="border-t border-[var(--iko-stone-hairline)]">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <RowSkeleton key={idx} />
                            ))}
                        </ol>
                    }
                >
                    <ol className="border-t border-[var(--iko-stone-hairline)]">
                        {products.data.map((product, idx) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                index={idx + 1}
                                quantity={quantities[product.id] ?? 1}
                                onQuantityChange={(q) => setQty(product.id, q)}
                                onAddToCart={() => addToCart(product.id)}
                                cartState={cartStates[product.id]}
                            />
                        ))}
                    </ol>
                </InfiniteScroll>
            )}
        </CustomerShell>
    );
}

function PageHeader({ count }: { count: number }) {
    return (
        <header className="flex items-baseline justify-between gap-6 border-b border-[var(--iko-stone-hairline)] pb-6">
            <div className="flex items-baseline gap-6">
                <span className="hidden font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)] uppercase sm:inline">
                    01 · Tienda
                </span>
                <h1 className="font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                    Catálogo
                </h1>
            </div>
            <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                {count} {count === 1 ? 'producto' : 'productos'}
            </span>
        </header>
    );
}

interface ToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
    sort: SortOption | null;
    onSelectSort: (sort: SortOption) => void;
    categories: Category[];
    selectedCategoryId: number | null;
    onSelectCategory: (id: number | null) => void;
}

function Toolbar({
    search,
    onSearchChange,
    onClearSearch,
    sort,
    onSelectSort,
    categories,
    selectedCategoryId,
    onSelectCategory,
}: ToolbarProps) {
    return (
        <div className="mt-8 flex flex-col gap-4 border-b border-[var(--iko-stone-hairline)] pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <SearchInput value={search} onChange={onSearchChange} onClear={onClearSearch} />
                <SortDropdown selected={sort} onSelect={onSelectSort} />
            </div>
            <CategoryStrip
                categories={categories}
                selectedId={selectedCategoryId}
                onSelect={onSelectCategory}
            />
        </div>
    );
}

function SearchInput({
    value,
    onChange,
    onClear,
}: {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}) {
    return (
        <div className="relative flex-1">
            <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--iko-stone-whisper)]"
                strokeWidth={1.5}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Buscar por nombre, SKU o categoría"
                className="h-11 w-full border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] pr-10 pl-9 text-[14px] text-[var(--iko-stone-ink)] placeholder:text-[var(--iko-stone-whisper)] focus:border-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
            />
            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)]"
                    aria-label="Borrar búsqueda"
                >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
            )}
        </div>
    );
}

function SortDropdown({
    selected,
    onSelect,
}: {
    selected: SortOption | null;
    onSelect: (sort: SortOption) => void;
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }
        const handleClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    const entries = Object.entries(SORT_LABELS) as [SortOption, string][];

    return (
        <div ref={containerRef} className="relative shrink-0">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex h-11 w-full items-center justify-between gap-3 border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] px-4 text-[14px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] sm:w-60"
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                <span className="flex items-baseline gap-2">
                    <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                        Ordenar
                    </span>
                    <span>{selected ? SORT_LABELS[selected] : SORT_LABELS.newest}</span>
                </span>
                <ChevronDown
                    className={`h-4 w-4 text-[var(--iko-stone-whisper)] transition-transform ${
                        open ? 'rotate-180' : ''
                    }`}
                    strokeWidth={1.5}
                />
            </button>
            {open && (
                <ol
                    role="listbox"
                    className="absolute right-0 z-20 mt-1 w-full min-w-60 border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)]"
                >
                    {entries.map(([value, label], idx) => {
                        const active = selected === value || (!selected && value === 'newest');
                        return (
                            <li key={value}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                        setOpen(false);
                                        onSelect(value);
                                    }}
                                    className={`flex w-full items-baseline gap-3 border-b border-[var(--iko-stone-hairline)] px-4 py-2.5 text-left text-[13px] transition-colors last:border-b-0 hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none ${
                                        active
                                            ? 'text-[var(--iko-stone-ink)]'
                                            : 'text-[var(--iko-stone-whisper)]'
                                    }`}
                                >
                                    <span
                                        className={`font-spec text-[11px] tabular-nums ${
                                            active
                                                ? 'text-[var(--iko-accent)]'
                                                : 'text-[var(--iko-stone-mid)]'
                                        }`}
                                    >
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <span className="flex-1">{label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            )}
        </div>
    );
}

function CategoryStrip({
    categories,
    selectedId,
    onSelect,
}: {
    categories: Category[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
}) {
    const items: { id: number | null; label: string }[] = [
        { id: null, label: 'Todas' },
        ...categories.map((c) => ({ id: c.id, label: c.name })),
    ];

    return (
        <nav aria-label="Categorías" className="-mx-1">
            <ol className="flex flex-wrap items-baseline">
                {items.map((item, idx) => {
                    const active = selectedId === item.id;
                    return (
                        <li key={item.id ?? 'all'} className="flex items-baseline">
                            {idx > 0 && (
                                <span
                                    aria-hidden="true"
                                    className="mx-3 text-[var(--iko-stone-mid)]"
                                >
                                    ·
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => onSelect(item.id)}
                                aria-pressed={active}
                                className={`group flex items-baseline gap-1.5 px-1 py-1 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] ${
                                    active
                                        ? 'text-[var(--iko-accent)]'
                                        : 'text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]'
                                }`}
                            >
                                <span
                                    className={`font-spec text-[10px] tabular-nums tracking-[0.04em] ${
                                        active
                                            ? 'text-[var(--iko-accent)]'
                                            : 'text-[var(--iko-stone-mid)]'
                                    }`}
                                >
                                    {String(idx).padStart(2, '0')}
                                </span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

interface ProductRowProps {
    product: CatalogProduct;
    index: number;
    quantity: number;
    onQuantityChange: (qty: number) => void;
    onAddToCart: () => void;
    cartState?: CartState;
}

function ProductRow({
    product,
    index,
    quantity,
    onQuantityChange,
    onAddToCart,
    cartState,
}: ProductRowProps) {
    const inStock = product.stock > 0;
    const stockLabel = inStock
        ? `${product.stock} en stock`
        : 'Sin existencias';

    const detailHref = `/products/${product.slug}`;

    const specLine = (
        <p className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
            <span className="tabular-nums">{product.sku}</span>
            {product.is_featured && (
                <span className="text-[var(--iko-accent)]"> · DESTACADO</span>
            )}
            <span> · {product.category}</span>
            <span
                className={
                    inStock
                        ? ' text-[var(--iko-stone-whisper)]'
                        : ' text-[var(--iko-error)]'
                }
            >
                {' · '}
                {stockLabel}
            </span>
        </p>
    );

    const indexLabel = String(index).padStart(2, '0');

    return (
        <li className="border-b border-[var(--iko-stone-hairline)] last:border-b-0">
            {/* Mobile layout */}
            <div className="flex flex-col gap-3 py-4 md:hidden">
                <Link
                    href={detailHref}
                    className="group flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                >
                    <ProductImage product={product} size={64} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <h2 className="font-display text-[16px] leading-tight text-[var(--iko-stone-ink)] transition-colors group-hover:text-[var(--iko-accent)] group-focus-visible:text-[var(--iko-accent)]">
                            {product.name}
                        </h2>
                        {specLine}
                        <span className="mt-1 font-spec text-[15px] tabular-nums text-[var(--iko-stone-ink)]">
                            {formatCurrency(product.price)}
                        </span>
                    </div>
                </Link>
                <RowActions
                    quantity={quantity}
                    onQuantityChange={onQuantityChange}
                    onAddToCart={onAddToCart}
                    cartState={cartState}
                    inStock={inStock}
                />
            </div>

            {/* Desktop layout */}
            <div className="hidden items-center gap-6 py-5 md:grid md:grid-cols-[2.5rem_5rem_minmax(0,1fr)_8rem_auto_auto]">
                <span className="font-spec text-[11px] tabular-nums text-[var(--iko-stone-mid)]">
                    {indexLabel}
                </span>
                <Link
                    href={detailHref}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    <ProductImage product={product} size={80} />
                </Link>
                <Link
                    href={detailHref}
                    className="group flex min-w-0 flex-col gap-1 focus-visible:outline-none"
                >
                    <h2 className="font-display text-[17px] leading-tight text-[var(--iko-stone-ink)] truncate transition-colors group-hover:text-[var(--iko-accent)] group-focus-visible:text-[var(--iko-accent)]">
                        {product.name}
                    </h2>
                    {specLine}
                </Link>
                <span className="text-right font-spec text-[15px] tabular-nums text-[var(--iko-stone-ink)]">
                    {formatCurrency(product.price)}
                </span>
                <RowActions
                    quantity={quantity}
                    onQuantityChange={onQuantityChange}
                    onAddToCart={onAddToCart}
                    cartState={cartState}
                    inStock={inStock}
                />
            </div>
        </li>
    );
}

function ProductImage({ product, size }: { product: CatalogProduct; size: number }) {
    return (
        <span
            className="block shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40"
            style={{ width: size, height: size }}
        >
            {product.image ? (
                <img
                    src={product.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            ) : null}
        </span>
    );
}

function RowActions({
    quantity,
    onQuantityChange,
    onAddToCart,
    cartState,
    inStock,
}: {
    quantity: number;
    onQuantityChange: (qty: number) => void;
    onAddToCart: () => void;
    cartState?: CartState;
    inStock: boolean;
}) {
    if (!inStock) {
        return (
            <div className="flex items-center justify-end md:contents">
                <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)] uppercase md:col-span-2 md:text-right">
                    Sin existencias
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-end gap-3 md:contents">
            <QuantityStepper quantity={quantity} onChange={onQuantityChange} />
            <AddButton state={cartState} quantity={quantity} onClick={onAddToCart} />
        </div>
    );
}

function QuantityStepper({
    quantity,
    onChange,
}: {
    quantity: number;
    onChange: (qty: number) => void;
}) {
    return (
        <div className="inline-flex items-center border border-[var(--iko-stone-hairline)]">
            <button
                type="button"
                onClick={() => onChange(quantity - 1)}
                disabled={quantity <= 1}
                className="flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset"
                aria-label="Reducir cantidad"
            >
                <Minus className="h-3 w-3" strokeWidth={1.5} />
            </button>
            <span className="flex h-9 min-w-[2.75rem] items-center justify-center border-x border-[var(--iko-stone-hairline)] font-spec text-[14px] tabular-nums text-[var(--iko-stone-ink)]">
                {quantity}
            </span>
            <button
                type="button"
                onClick={() => onChange(quantity + 1)}
                className="flex h-9 w-9 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset"
                aria-label="Aumentar cantidad"
            >
                <Plus className="h-3 w-3" strokeWidth={1.5} />
            </button>
        </div>
    );
}

function AddButton({
    state,
    quantity,
    onClick,
}: {
    state?: CartState;
    quantity: number;
    onClick: () => void;
}) {
    let label: ReactNode;
    if (state === 'added') {
        label = (
            <>
                <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>
                    Agregado · <span className="font-spec tabular-nums">{quantity}</span>
                </span>
            </>
        );
    } else if (state === 'loading') {
        label = (
            <>
                <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)] motion-reduce:animate-none"
                />
                <span>Agregando…</span>
            </>
        );
    } else {
        label = 'Agregar';
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={state === 'loading' || state === 'added'}
            className="inline-flex h-9 min-w-[6.5rem] items-center justify-center gap-2 bg-[var(--iko-accent)] px-4 text-[13px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-70"
        >
            {label}
        </button>
    );
}

function RowSkeleton() {
    return (
        <li className="border-b border-[var(--iko-stone-hairline)] last:border-b-0">
            <div className="flex items-center gap-4 py-5 sm:gap-6">
                <span className="hidden h-3 w-6 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse md:block" />
                <span
                    className="h-16 w-16 shrink-0 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse sm:h-20 sm:w-20"
                    aria-hidden="true"
                />
                <span className="flex flex-1 flex-col gap-2">
                    <span className="h-4 w-3/5 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse" />
                    <span className="h-3 w-2/5 bg-[var(--iko-stone-mid)]/30 motion-safe:animate-pulse" />
                </span>
                <span className="hidden h-4 w-20 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse md:block" />
                <span className="hidden h-9 w-28 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse md:block" />
                <span className="hidden h-9 w-24 bg-[var(--iko-stone-mid)]/40 motion-safe:animate-pulse md:block" />
            </div>
        </li>
    );
}

function EmptyState({
    search,
    hasFilters,
    onClear,
}: {
    search: string;
    hasFilters: boolean;
    onClear: () => void;
}) {
    return (
        <div className="border-t border-[var(--iko-stone-hairline)] py-20">
            <div className="flex flex-col gap-3">
                <h2 className="font-display text-[1.875rem] leading-tight text-[var(--iko-stone-ink)]">
                    Sin resultados
                </h2>
                <p className="font-spec text-[12px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {search ? (
                        <>
                            Para «<span className="text-[var(--iko-stone-ink)]">{search}</span>»
                        </>
                    ) : (
                        'Ningún producto coincide con los filtros aplicados'
                    )}
                </p>
                {hasFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="mt-3 self-start text-[13px] text-[var(--iko-accent)] underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                        Quitar filtros
                    </button>
                )}
            </div>
        </div>
    );
}

function buildQuery(
    categoryId: number | null,
    sort: SortOption | null,
    search: string | null,
): Record<string, string> {
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

function useFilters(
    selectedCategoryId: number | null,
    selectedSort: SortOption | null,
    selectedSearch: string | null,
) {
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
            router.get(
                window.location.pathname,
                buildQuery(id, selectedSort, search || null),
                { preserveState: true },
            );
        },
        [selectedSort, search],
    );

    const handleSortSelect = useCallback(
        (sort: SortOption) => {
            const newSort = sort === selectedSort || sort === 'newest' ? null : sort;
            router.get(
                window.location.pathname,
                buildQuery(selectedCategoryId, newSort, search || null),
                { preserveState: true },
            );
        },
        [selectedSort, selectedCategoryId, search],
    );

    const handleClearSearch = useCallback(() => {
        clearTimeout(debounceRef.current);
        setSearch('');
        router.get(
            window.location.pathname,
            buildQuery(selectedCategoryId, selectedSort, null),
            { preserveState: true },
        );
    }, [selectedCategoryId, selectedSort]);

    const handleClearAll = useCallback(() => {
        clearTimeout(debounceRef.current);
        setSearch('');
        router.get(window.location.pathname, {}, { preserveState: true });
    }, []);

    return {
        search,
        setSearch,
        handleCategorySelect,
        handleSortSelect,
        handleClearSearch,
        handleClearAll,
    };
}
