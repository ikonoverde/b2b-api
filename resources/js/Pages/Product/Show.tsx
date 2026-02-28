import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Home, Minus, Plus, ShoppingCart, ZoomIn } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { ProductDetail, PricingTier, RelatedProduct } from '@/types';

interface ProductShowProps {
    product: ProductDetail;
    related_products: RelatedProduct[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function PricingTierRow({ tier, isActive }: { tier: PricingTier; isActive: boolean }) {
    const label = tier.max_qty
        ? `${tier.min_qty} – ${tier.max_qty} unidades`
        : `${tier.min_qty}+ unidades`;

    return (
        <div
            className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-200 ${
                isActive
                    ? 'bg-[#5E7052]/10 ring-1 ring-[#5E7052]/30'
                    : 'bg-white ring-1 ring-[#E5E5E5]'
            }`}
        >
            <span
                className={`text-sm font-semibold font-[Outfit] ${
                    isActive ? 'text-[#5E7052]' : 'text-[#999999]'
                }`}
            >
                {label}
            </span>
            <span
                className={`text-base font-bold font-[Outfit] ${
                    isActive ? 'text-[#8B6F47]' : 'text-[#999999]'
                }`}
            >
                {formatCurrency(tier.price)}
            </span>
        </div>
    );
}

function AddToCartButton({ loading, added, totalPrice, onClick }: {
    loading: boolean;
    added: boolean;
    totalPrice: number;
    onClick: () => void;
}) {
    let content;
    if (added) {
        content = (
            <>
                <Check className="h-5 w-5" strokeWidth={2.5} />
                Agregado al Pedido
            </>
        );
    } else if (loading) {
        content = (
            <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Agregando...
            </>
        );
    } else {
        content = (
            <>
                <ShoppingCart className="h-5 w-5" />
                Agregar al Pedido – {formatCurrency(totalPrice)}
            </>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={loading || added}
            className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 font-[Outfit] ${
                added ? 'bg-emerald-500' : 'bg-[#5E7052] hover:bg-[#4d5e43]'
            } ${loading ? 'opacity-80' : ''}`}
        >
            {content}
        </button>
    );
}

function findActiveTier(tiers: PricingTier[] | undefined, qty: number): PricingTier | null {
    if (!tiers?.length) return null;
    return tiers.find(
        (tier) => qty >= tier.min_qty && (tier.max_qty === null || qty <= tier.max_qty),
    ) ?? null;
}

function getUnitPrice(activeTier: PricingTier | null, basePrice: number): number {
    return activeTier?.price ?? basePrice;
}

function ImageGallery({ images, alt }: { images: { id: number; url: string; position: number }[]; alt: string }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const imageRef = useRef<HTMLDivElement>(null);

    const selectedImage = images[selectedIndex]?.url;

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!imageRef.current || !isZooming) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }

    function nextImage() {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    }

    function prevImage() {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image with Zoom */}
            <div
                ref={imageRef}
                className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E5E5] cursor-zoom-in"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
            >
                <div className="aspect-square overflow-hidden bg-[#F5F3F0]">
                    {selectedImage ? (
                        <div
                            className="h-full w-full transition-transform duration-200"
                            style={{
                                backgroundImage: `url(${selectedImage})`,
                                backgroundSize: isZooming ? '200%' : 'cover',
                                backgroundPosition: isZooming ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-20 h-20 bg-[#E8E8E8] rounded-full" />
                        </div>
                    )}
                </div>

                {/* Zoom indicator */}
                {selectedImage && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                        <ZoomIn className="h-4 w-4 text-[#5E7052]" />
                    </div>
                )}

                {/* Navigation arrows for mobile */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5 text-[#5E7052]" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors"
                        >
                            <ChevronRight className="h-5 w-5 text-[#5E7052]" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={img.id}
                            onClick={() => setSelectedIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                selectedIndex === idx
                                    ? 'border-[#5E7052] ring-2 ring-[#5E7052]/20'
                                    : 'border-[#E5E5E5] hover:border-[#5E7052]/50'
                            }`}
                        >
                            <img
                                src={img.url}
                                alt={`${alt} - vista ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function Breadcrumbs({ breadcrumbs }: { breadcrumbs: { name: string; url: string | null }[] }) {
    return (
        <nav className="flex items-center gap-2 text-sm font-[Outfit] mb-6 flex-wrap">
            {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index > 0 && <span className="text-[#999999]">/</span>}
                    {crumb.url ? (
                        <Link
                            href={crumb.url}
                            className="text-[#5E7052] hover:underline flex items-center gap-1"
                        >
                            {index === 0 && <Home className="h-3.5 w-3.5" />}
                            {crumb.name}
                        </Link>
                    ) : (
                        <span className="text-[#1A1A1A] font-medium">{crumb.name}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}

function TabContent({ activeTab, product }: { activeTab: string; product: ProductDetail }) {
    switch (activeTab) {
        case 'description':
            return (
                <div className="prose prose-sm max-w-none font-[Outfit]">
                    {product.description ? (
                        <p className="text-[#666666] leading-relaxed">{product.description}</p>
                    ) : (
                        <p className="text-[#999999] italic">No hay descripción disponible para este producto.</p>
                    )}
                </div>
            );
        case 'specifications':
            return (
                <div className="font-[Outfit]">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-[#E5E5E5]">
                            <tr className="py-2">
                                <td className="py-3 text-[#666666] font-medium w-1/3">SKU</td>
                                <td className="py-3 text-[#1A1A1A]">{product.sku}</td>
                            </tr>
                            <tr>
                                <td className="py-3 text-[#666666] font-medium">Categoría</td>
                                <td className="py-3 text-[#1A1A1A]">{product.category.name}</td>
                            </tr>
                            <tr>
                                <td className="py-3 text-[#666666] font-medium">Stock disponible</td>
                                <td className="py-3 text-[#1A1A1A]">{product.stock} unidades</td>
                            </tr>
                            <tr>
                                <td className="py-3 text-[#666666] font-medium">Estado</td>
                                <td className="py-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        product.is_active
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {product.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        case 'reviews':
            return (
                <div className="font-[Outfit]">
                    <p className="text-[#999999] italic">Las reseñas de clientes estarán disponibles próximamente.</p>
                </div>
            );
        default:
            return null;
    }
}

function RelatedProductsCarousel({ products }: { products: RelatedProduct[] }) {
    if (products.length === 0) return null;

    return (
        <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
            <h2 className="text-xl font-bold text-[#1A1A1A] font-[Outfit] mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="group block bg-white rounded-xl border border-[#E5E5E5] overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="aspect-square overflow-hidden bg-[#F5F3F0]">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-12 h-12 bg-[#E8E8E8] rounded-full" />
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <h3 className="text-sm font-semibold text-[#1A1A1A] font-[Outfit] line-clamp-2 group-hover:text-[#5E7052] transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-sm font-bold text-[#8B6F47] font-[Outfit] mt-1">
                                {formatCurrency(product.price)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function ProductShow({ product, related_products }: ProductShowProps) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    const activeTier = useMemo(() => findActiveTier(product.pricing_tiers, quantity), [product.pricing_tiers, quantity]);

    const unitPrice = getUnitPrice(activeTier, product.sale_price ?? product.price);
    const totalPrice = unitPrice * quantity;

    function decrement() {
        setQuantity((q) => Math.max(1, q - 1));
    }

    function increment() {
        setQuantity((q) => q + 1);
    }

    function addToCart() {
        router.post(
            '/cart/items',
            { product_id: product.id, quantity },
            {
                preserveScroll: true,
                preserveState: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2000);
                },
            },
        );
    }

    const tabs = [
        { id: 'description', label: 'Descripción' },
        { id: 'specifications', label: 'Especificaciones' },
        { id: 'reviews', label: 'Reseñas' },
    ];

    return (
        <CustomerLayout title={product.name}>
            <div className="px-6 py-8">
                {/* Back button */}
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm font-medium text-[#5E7052] hover:underline font-[Outfit] mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </button>

                {/* Breadcrumbs */}
                <Breadcrumbs breadcrumbs={product.breadcrumbs} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <ImageGallery images={product.images} alt={product.name} />

                    {/* Product Info */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <Link
                                href={`/catalog?category=${product.category.slug}`}
                                className="text-xs font-semibold tracking-wide text-[#5E7052] uppercase font-[Outfit] hover:underline"
                            >
                                {product.category.name}
                            </Link>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mt-1">{product.name}</h1>
                        </div>

                        {/* Price with discount badge */}
                        <div className="flex items-baseline gap-3 flex-wrap">
                            {product.sale_price && product.discount_percentage ? (
                                <>
                                    <span className="text-2xl font-bold text-[#8B6F47] font-[Outfit]">
                                        {formatCurrency(product.sale_price)}
                                    </span>
                                    <span className="text-lg text-[#999999] line-through font-[Outfit]">
                                        {formatCurrency(product.price)}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 font-[Outfit]">
                                        -{product.discount_percentage}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-[#8B6F47] font-[Outfit]">
                                    {formatCurrency(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Pricing Tiers */}
                        {product.pricing_tiers && product.pricing_tiers.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">Precios por Volumen</h2>
                                <div className="flex flex-col gap-2">
                                    {product.pricing_tiers.map((tier, idx) => (
                                        <PricingTierRow key={idx} tier={tier} isActive={activeTier === tier} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="flex flex-col gap-3">
                            <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">Cantidad</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={decrement}
                                    disabled={quantity <= 1}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#E5E5E5] transition-colors disabled:opacity-40 hover:bg-gray-50"
                                >
                                    <Minus className="h-4 w-4 text-[#5E7052]" />
                                </button>
                                <span className="min-w-[3ch] text-center text-lg font-bold text-[#1A1A1A] font-[Outfit]">{quantity}</span>
                                <button
                                    onClick={increment}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#E5E5E5] transition-colors hover:bg-gray-50"
                                >
                                    <Plus className="h-4 w-4 text-[#5E7052]" />
                                </button>
                            </div>
                        </div>

                        <AddToCartButton loading={loading} added={added} totalPrice={totalPrice} onClick={addToCart} />
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-12">
                    <div className="border-b border-[#E5E5E5]">
                        <div className="flex gap-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-semibold font-[Outfit] border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'text-[#5E7052] border-[#5E7052]'
                                            : 'text-[#999999] border-transparent hover:text-[#666666]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="py-6">
                        <TabContent activeTab={activeTab} product={product} />
                    </div>
                </div>

                {/* Related Products */}
                <RelatedProductsCarousel products={related_products} />
            </div>
        </CustomerLayout>
    );
}
