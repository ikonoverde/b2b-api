import { router } from '@inertiajs/react';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { ProductDetail, PricingTier } from '@/types';

interface ProductShowProps {
    product: ProductDetail;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function ProductImage({ url, alt }: { url?: string; alt: string }) {
    return (
        <div className="overflow-hidden rounded-2xl bg-white border border-[#E5E5E5]">
            <div className="aspect-square overflow-hidden bg-[#F5F3F0]">
                {url ? (
                    <img src={url} alt={alt} className="h-full w-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 bg-[#E8E8E8] rounded-full" />
                    </div>
                )}
            </div>
        </div>
    );
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
                Agregar al Pedido &ndash; {formatCurrency(totalPrice)}
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

export default function ProductShow({ product }: ProductShowProps) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    const activeTier = useMemo(() => findActiveTier(product.pricing_tiers, quantity), [product.pricing_tiers, quantity]);

    const unitPrice = getUnitPrice(activeTier, product.price);
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

    const mainImage = product.images?.[0]?.url;

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ProductImage url={mainImage} alt={product.name} />

                    {/* Product Info */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <span className="text-xs font-semibold tracking-wide text-[#5E7052] uppercase font-[Outfit]">
                                {product.category}
                            </span>
                            <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mt-1">{product.name}</h1>
                            {product.description && (
                                <p className="mt-2 text-sm leading-relaxed text-[#666666] font-[Outfit]">{product.description}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="text-2xl font-bold text-[#8B6F47] font-[Outfit]">
                            {formatCurrency(unitPrice)}
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
            </div>
        </CustomerLayout>
    );
}
