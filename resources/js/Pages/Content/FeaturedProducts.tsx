import { router, usePage } from '@inertiajs/react';
import { ArrowUp, ArrowDown, X, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import type { PageProps } from '@/types';

interface FeaturedProduct {
    id: number;
    name: string;
    sku: string;
    category: string | null;
    image_url: string | null;
    featured_order: number;
}

interface AvailableProduct {
    id: number;
    name: string;
    sku: string;
    category: string | null;
}

interface Props extends PageProps {
    featuredProducts: FeaturedProduct[];
    availableProducts: AvailableProduct[];
}

function swapItems<T>(items: T[], indexA: number, indexB: number): T[] {
    const updated = [...items];
    [updated[indexA], updated[indexB]] = [updated[indexB], updated[indexA]];
    return updated;
}

function useProductListActions(initialProducts: FeaturedProduct[]) {
    const [products, setProducts] = useState<FeaturedProduct[]>(initialProducts);
    const [saving, setSaving] = useState(false);

    const moveUp = (index: number) => {
        if (index === 0) return;
        setProducts(swapItems(products, index - 1, index));
    };

    const moveDown = (index: number) => {
        if (index === products.length - 1) return;
        setProducts(swapItems(products, index, index + 1));
    };

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const addProduct = (product: AvailableProduct) => {
        setProducts([
            ...products,
            { ...product, image_url: null, featured_order: products.length + 1 },
        ]);
    };

    const save = () => {
        setSaving(true);
        router.put(
            '/admin/featured-products',
            { products: products.map((p, i) => ({ id: p.id, featured_order: i + 1 })) },
            { onFinish: () => setSaving(false) },
        );
    };

    return { products, saving, moveUp, moveDown, removeProduct, addProduct, save };
}

function useProductSearch(availableProducts: AvailableProduct[], currentProducts: FeaturedProduct[]) {
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredAvailable = useMemo(
        () =>
            availableProducts
                .filter((p) => !currentProducts.some((fp) => fp.id === p.id))
                .filter(
                    (p) =>
                        p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase()),
                ),
        [availableProducts, currentProducts, search],
    );

    const resetSearch = () => {
        setSearch('');
        setShowDropdown(false);
    };

    return { search, setSearch, showDropdown, setShowDropdown, filteredAvailable, resetSearch };
}

export default function FeaturedProducts({ featuredProducts, availableProducts }: Props) {
    const { flash } = usePage<PageProps>().props;
    const listActions = useProductListActions(featuredProducts);
    const searchActions = useProductSearch(availableProducts, listActions.products);

    const handleAddProduct = (product: AvailableProduct) => {
        listActions.addProduct(product);
        searchActions.resetSearch();
    };

    const manager = {
        ...listActions,
        search: searchActions.search,
        setSearch: searchActions.setSearch,
        showDropdown: searchActions.showDropdown,
        setShowDropdown: searchActions.setShowDropdown,
        filteredAvailable: searchActions.filteredAvailable,
        addProduct: handleAddProduct,
    };

    return (
        <AppLayout title="Productos Destacados" active="featured-products">
            <div className="p-8">
                <div className="max-w-3xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Productos Destacados
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Administra los productos destacados en la página principal
                            </p>
                        </div>
                        <button
                            onClick={manager.save}
                            disabled={manager.saving}
                            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-primary transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {manager.saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-lg text-sm">
                            {flash.success}
                        </div>
                    )}

                    <ProductSearchDropdown
                        search={manager.search}
                        showDropdown={manager.showDropdown}
                        filteredAvailable={manager.filteredAvailable}
                        onSearchChange={(value) => {
                            manager.setSearch(value);
                            manager.setShowDropdown(true);
                        }}
                        onFocus={() => manager.setShowDropdown(true)}
                        onAddProduct={manager.addProduct}
                    />

                    <div className="bg-card rounded-xl border border-border divide-y divide-border">
                        {manager.products.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-muted-foreground text-sm">
                                    No hay productos destacados. Usa la búsqueda para agregar productos.
                                </p>
                            </div>
                        ) : (
                            manager.products.map((product, index) => (
                                <FeaturedProductItem
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    total={manager.products.length}
                                    onMoveUp={() => manager.moveUp(index)}
                                    onMoveDown={() => manager.moveDown(index)}
                                    onRemove={() => manager.removeProduct(index)}
                                />
                            ))
                        )}
                    </div>

                    <p className="mt-3 text-xs text-muted-foreground">
                        Máximo 20 productos. Arrastra para reordenar.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

function ProductSearchDropdown({
    search,
    showDropdown,
    filteredAvailable,
    onSearchChange,
    onFocus,
    onAddProduct,
}: {
    search: string;
    showDropdown: boolean;
    filteredAvailable: AvailableProduct[];
    onSearchChange: (value: string) => void;
    onFocus: () => void;
    onAddProduct: (product: AvailableProduct) => void;
}) {
    return (
        <div className="mb-6 relative">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar producto para agregar..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={onFocus}
                    className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
            </div>
            {showDropdown && search && filteredAvailable.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredAvailable.slice(0, 10).map((product) => (
                        <button
                            key={product.id}
                            onClick={() => onAddProduct(product)}
                            className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between cursor-pointer"
                        >
                            <div>
                                <span className="text-sm text-foreground">{product.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">{product.sku}</span>
                            </div>
                            <Plus className="w-4 h-4 text-primary" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function FeaturedProductItem({
    product,
    index,
    total,
    onMoveUp,
    onMoveDown,
    onRemove,
}: {
    product: FeaturedProduct;
    index: number;
    total: number;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onRemove: () => void;
}) {
    return (
        <div className="flex items-center gap-4 px-4 py-3">
            <span className="w-6 text-center text-sm font-medium text-muted-foreground">
                {index + 1}
            </span>
            <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden shrink-0">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5 h-5 bg-border rounded-full" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                    {product.sku}
                    {product.category && ` · ${product.category}`}
                </p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={onMoveUp} disabled={index === 0} className="p-1.5 rounded hover:bg-muted disabled:opacity-30 cursor-pointer">
                    <ArrowUp className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={onMoveDown} disabled={index === total - 1} className="p-1.5 rounded hover:bg-muted disabled:opacity-30 cursor-pointer">
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={onRemove} className="p-1.5 rounded hover:bg-destructive/10 cursor-pointer">
                    <X className="w-4 h-4 text-destructive" />
                </button>
            </div>
        </div>
    );
}
