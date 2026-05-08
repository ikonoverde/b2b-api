import { Link, router } from '@inertiajs/react';
import { Check, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import CustomerShell from '@/Layouts/CustomerShell';
import { formatCurrency } from '@/utils/currency';
import type { BreadcrumbItem, ProductDetail, RelatedProduct } from '@/types';

interface ProductShowProps {
    product: ProductDetail;
    related_products: RelatedProduct[];
}

export default function ProductShow({ product, related_products }: ProductShowProps) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    const unitPrice = product.price;
    const totalPrice = unitPrice * quantity;
    const stockReady = product.stock > 0 && product.is_active;

    function addToCart(): void {
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

    return (
        <CustomerShell title={product.name}>
            <Breadcrumbs breadcrumbs={product.breadcrumbs} />

            <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
                <ImageGallery images={product.images} alt={product.name} />

                <div className="flex flex-col gap-10">
                    <header className="flex flex-col gap-3">
                        <Link
                            href={`/catalog?category=${product.category.slug}`}
                            className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase hover:text-[var(--iko-accent-hover)]"
                        >
                            {product.category.name}
                        </Link>
                        <h1 className="font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                            {product.name}
                        </h1>
                        <div className="mt-2 flex items-baseline gap-3">
                            <span className="font-spec text-[1.75rem] tabular-nums text-[var(--iko-stone-ink)]">
                                {formatCurrency(unitPrice)}
                            </span>
                        </div>
                    </header>

                    <SpecBlock>
                        <SpecRow label="SKU" value={product.sku} mono />
                        <SpecRow
                            label="Stock"
                            value={
                                stockReady
                                    ? `${product.stock} ${product.stock === 1 ? 'unidad' : 'unidades'}`
                                    : 'Sin existencias'
                            }
                            mono
                        />
                        {product.weight_kg != null && (
                            <SpecRow label="Peso" value={`${product.weight_kg} kg`} mono />
                        )}
                        {(product.width_cm != null || product.height_cm != null || product.depth_cm != null) && (
                            <SpecRow
                                label="Dimensiones"
                                value={
                                    [product.width_cm, product.height_cm, product.depth_cm]
                                        .filter((v) => v != null)
                                        .join(' × ') + ' cm'
                                }
                                mono
                            />
                        )}
                    </SpecBlock>

                    <section aria-labelledby="qty-heading" className="flex flex-col gap-4">
                        <SectionTitle id="qty-heading" eyebrow="Cantidad">
                            ¿Cuántas unidades?
                        </SectionTitle>
                        <div className="flex flex-wrap items-center gap-6">
                            <QuantityStepper
                                quantity={quantity}
                                onIncrement={() => setQuantity((q) => q + 1)}
                                onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                            />
                            <div className="flex flex-col">
                                <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                                    Total
                                </span>
                                <span className="font-spec text-[1.25rem] tabular-nums text-[var(--iko-stone-ink)]">
                                    {formatCurrency(totalPrice)}
                                </span>
                            </div>
                        </div>
                    </section>

                    <AddToCartButton
                        loading={loading}
                        added={added}
                        disabled={!stockReady}
                        onClick={addToCart}
                    />

                    {!stockReady && (
                        <p className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)] uppercase">
                            Sin existencias · Producto no disponible para pedido
                        </p>
                    )}
                </div>
            </div>

            {product.description && (
                <section aria-labelledby="description-heading" className="mt-24">
                    <SectionHeader index="01" eyebrow="Producto" title="Descripción" headingId="description-heading" />
                    <div
                        className="prose prose-stone mt-8 max-w-[68ch] font-sans text-[15px] leading-[1.7] text-[var(--iko-stone-ink)]/85"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                </section>
            )}

            <RelatedProductsList products={related_products} />
        </CustomerShell>
    );
}

function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Migas de pan" className="-mx-1 flex flex-wrap items-center text-[12px]">
            {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center">
                    {index > 0 && (
                        <span aria-hidden="true" className="mx-2 text-[var(--iko-stone-mid)]">
                            /
                        </span>
                    )}
                    {crumb.url ? (
                        <Link
                            href={crumb.url}
                            className="text-[var(--iko-stone-whisper)] transition-colors hover:text-[var(--iko-accent)]"
                        >
                            {crumb.name}
                        </Link>
                    ) : (
                        <span className="text-[var(--iko-stone-ink)]">{crumb.name}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

function ImageGallery({
    images,
    alt,
}: {
    images: { id: number; url: string; position?: number }[];
    alt: string;
}) {
    const [selected, setSelected] = useState(0);
    const selectedImage = images[selected]?.url;

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden bg-[var(--iko-stone-mid)]/40">
                {selectedImage ? (
                    <img
                        src={selectedImage}
                        alt={`${alt} — vista ${selected + 1}`}
                        className="h-full w-full object-cover"
                    />
                ) : null}
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() =>
                                setSelected((prev) => (prev - 1 + images.length) % images.length)
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] hover:bg-[var(--iko-accent)] hover:text-[var(--iko-accent-on)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                            aria-label="Imagen anterior"
                        >
                            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelected((prev) => (prev + 1) % images.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-[var(--iko-stone-paper)] text-[var(--iko-stone-ink)] hover:bg-[var(--iko-accent)] hover:text-[var(--iko-accent-on)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                            aria-label="Imagen siguiente"
                        >
                            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                    {images.map((img, idx) => (
                        <button
                            key={img.id}
                            type="button"
                            onClick={() => setSelected(idx)}
                            className={`relative h-20 w-20 shrink-0 overflow-hidden border transition-colors ${
                                selected === idx
                                    ? 'border-[var(--iko-accent)]'
                                    : 'border-[var(--iko-stone-hairline)] hover:border-[var(--iko-stone-mid)]'
                            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]`}
                            aria-label={`Vista ${idx + 1}`}
                        >
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function SpecBlock({ children }: { children: ReactNode }) {
    return (
        <dl className="border-y border-[var(--iko-stone-hairline)]">
            {children}
        </dl>
    );
}

function SpecRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="grid grid-cols-[8rem_1fr] items-baseline gap-4 border-b border-[var(--iko-stone-hairline)] py-3 last:border-b-0">
            <dt className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                {label}
            </dt>
            <dd
                className={`text-[14px] text-[var(--iko-stone-ink)] ${
                    mono ? 'font-spec tabular-nums' : ''
                }`}
            >
                {value}
            </dd>
        </div>
    );
}

function QuantityStepper({
    quantity,
    onIncrement,
    onDecrement,
}: {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}) {
    return (
        <div className="inline-flex items-center border border-[var(--iko-stone-hairline)]">
            <button
                type="button"
                onClick={onDecrement}
                disabled={quantity <= 1}
                className="flex h-11 w-11 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset"
                aria-label="Reducir cantidad"
            >
                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <span className="flex h-11 min-w-[3.5rem] items-center justify-center border-x border-[var(--iko-stone-hairline)] font-spec text-[15px] tabular-nums text-[var(--iko-stone-ink)]">
                {quantity}
            </span>
            <button
                type="button"
                onClick={onIncrement}
                className="flex h-11 w-11 items-center justify-center text-[var(--iko-stone-ink)] transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset"
                aria-label="Aumentar cantidad"
            >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
        </div>
    );
}

function AddToCartButton({
    loading,
    added,
    disabled,
    onClick,
}: {
    loading: boolean;
    added: boolean;
    disabled: boolean;
    onClick: () => void;
}) {
    let label: ReactNode;
    if (added) {
        label = (
            <>
                <Check className="h-4 w-4" strokeWidth={1.75} />
                Agregado al pedido
            </>
        );
    } else if (loading) {
        label = (
            <>
                <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)]"
                />
                Agregando…
            </>
        );
    } else {
        label = 'Agregar al pedido';
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading || added || disabled}
            className="flex h-12 w-full items-center justify-center gap-2 bg-[var(--iko-accent)] px-6 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {label}
        </button>
    );
}

function SectionTitle({
    id,
    eyebrow,
    children,
}: {
    id?: string;
    eyebrow: string;
    children: ReactNode;
}) {
    return (
        <div className="flex items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-3">
            <h2 id={id} className="font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]">
                {children}
            </h2>
            <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                {eyebrow}
            </span>
        </div>
    );
}

function SectionHeader({
    index,
    eyebrow,
    title,
    headingId,
}: {
    index: string;
    eyebrow: string;
    title: string;
    headingId?: string;
}) {
    return (
        <div className="flex items-baseline gap-6 border-b border-[var(--iko-stone-hairline)] pb-4">
            <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-accent)]">
                {index}
            </span>
            <div className="flex flex-1 items-baseline justify-between gap-6">
                <h2
                    id={headingId}
                    className="font-display text-[1.875rem] leading-tight text-[var(--iko-stone-ink)]"
                >
                    {title}
                </h2>
                <span className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                    {eyebrow}
                </span>
            </div>
        </div>
    );
}

function RelatedProductsList({ products }: { products: RelatedProduct[] }) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section aria-labelledby="related-heading" className="mt-24">
            <SectionHeader
                index="02"
                eyebrow="Catálogo"
                title="También en esta categoría"
                headingId="related-heading"
            />

            <ol className="mt-10 border-t border-[var(--iko-stone-hairline)]">
                {products.map((product, idx) => (
                    <li key={product.id}>
                        <Link
                            href={`/products/${product.slug}`}
                            className="group grid grid-cols-[3rem_4rem_1fr_auto] items-center gap-4 border-b border-[var(--iko-stone-hairline)] py-5 transition-colors hover:bg-[var(--iko-accent-soft)] focus-visible:bg-[var(--iko-accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset sm:grid-cols-[3rem_5rem_1fr_auto] sm:gap-6"
                        >
                            <span className="font-spec text-[11px] tabular-nums text-[var(--iko-accent)]">
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="h-14 w-14 shrink-0 overflow-hidden bg-[var(--iko-stone-mid)]/40 sm:h-16 sm:w-16">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                            </span>
                            <span className="font-display text-[1rem] leading-tight text-[var(--iko-stone-ink)] truncate">
                                {product.name}
                            </span>
                            <span className="font-spec text-[13px] tabular-nums text-[var(--iko-stone-whisper)] group-hover:text-[var(--iko-accent)]">
                                {formatCurrency(product.price)}
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}
