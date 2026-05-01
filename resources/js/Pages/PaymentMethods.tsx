import { router, usePage } from '@inertiajs/react';
import { Plus, Star, Trash2, X } from 'lucide-react';
import { loadStripe, type Stripe, type StripeCardElement } from '@stripe/stripe-js';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import AccountShell from '@/Layouts/AccountShell';
import type { PageProps, PaymentMethod } from '@/types';

interface PaymentMethodsProps {
    stripe_key: string;
    payment_methods: PaymentMethod[];
}

const BRAND_LABELS: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    jcb: 'JCB',
    diners: 'Diners Club',
    unionpay: 'UnionPay',
};

function formatCardBrand(brand: string): string {
    return BRAND_LABELS[brand.toLowerCase()] ?? brand.charAt(0).toUpperCase() + brand.slice(1);
}

export default function PaymentMethods({
    stripe_key,
    payment_methods,
}: PaymentMethodsProps) {
    const { flash } = usePage<PageProps>().props;
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setSuccess(flash.success);
            const timer = setTimeout(() => setSuccess(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    return (
        <AccountShell
            title="Métodos de pago"
            eyebrow="Cuenta · Métodos de pago"
            headline="Métodos de pago"
            sub="Tus tarjetas se guardan de forma segura en Stripe. La predeterminada se selecciona automáticamente al pagar."
            section="payment-methods"
        >
            {success && (
                <div className="mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]">
                    {success}
                </div>
            )}
            {(flash?.error || error) && (
                <div className="mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]">
                    {flash?.error || error}
                </div>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-4">
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {String(payment_methods.length).padStart(2, '0')}{' '}
                    {payment_methods.length === 1 ? 'tarjeta guardada' : 'tarjetas guardadas'}
                </span>
                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="inline-flex h-11 items-center gap-2 bg-[var(--iko-accent)] px-5 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                    Nueva tarjeta
                </button>
            </div>

            {payment_methods.length === 0 ? (
                <EmptyMethods onAdd={() => setIsAdding(true)} />
            ) : (
                <ol className="divide-y divide-[var(--iko-stone-hairline)] border-b border-[var(--iko-stone-hairline)]">
                    {payment_methods.map((method, idx) => (
                        <PaymentMethodRow
                            key={method.id}
                            method={method}
                            index={idx + 1}
                            onDelete={() => {
                                if (confirm('¿Eliminar esta tarjeta?')) {
                                    router.delete(`/account/payment-methods/${method.id}`, {
                                        preserveScroll: true,
                                    });
                                }
                            }}
                            onSetDefault={() =>
                                router.patch(
                                    `/account/payment-methods/${method.id}/default`,
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                        />
                    ))}
                </ol>
            )}

            {isAdding && (
                <AddCardModal
                    stripeKey={stripe_key}
                    onClose={() => {
                        setIsAdding(false);
                        setError('');
                    }}
                    onError={setError}
                />
            )}
        </AccountShell>
    );
}

function PaymentMethodRow({
    method,
    index,
    onDelete,
    onSetDefault,
}: {
    method: PaymentMethod;
    index: number;
    onDelete: () => void;
    onSetDefault: () => void;
}) {
    return (
        <li className="grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 py-6 sm:grid-cols-[3rem_1fr_auto] sm:gap-6">
            <span className="font-spec text-[11px] tabular-nums text-[var(--iko-accent)]">
                {String(index).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]">
                        {formatCardBrand(method.card.brand)}
                    </span>
                    <span className="font-spec text-[13px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)]">
                        ····{' '}
                        {method.card.last4}
                    </span>
                    {method.is_default && (
                        <span className="font-spec text-[10px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                            · Predeterminada
                        </span>
                    )}
                </div>
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    Vence{' '}
                    {String(method.card.exp_month).padStart(2, '0')}/{String(method.card.exp_year).slice(-2)}
                </span>
            </div>
            <div className="flex items-center gap-1">
                {!method.is_default && (
                    <IconButton onClick={onSetDefault} title="Predeterminar">
                        <Star className="h-4 w-4" strokeWidth={1.5} />
                    </IconButton>
                )}
                <IconButton onClick={onDelete} title="Eliminar" danger>
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </IconButton>
            </div>
        </li>
    );
}

function IconButton({
    onClick,
    title,
    danger = false,
    children,
}: {
    onClick: () => void;
    title: string;
    danger?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            aria-label={title}
            className={`flex h-9 w-9 items-center justify-center text-[var(--iko-stone-whisper)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] ${
                danger
                    ? 'hover:text-[var(--iko-error)]'
                    : 'hover:text-[var(--iko-accent)]'
            }`}
        >
            {children}
        </button>
    );
}

function EmptyMethods({ onAdd }: { onAdd: () => void }) {
    return (
        <section className="flex flex-col gap-5 border-y border-[var(--iko-stone-hairline)] py-16">
            <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                Sin tarjetas
            </span>
            <p className="max-w-[42ch] font-display text-[1.5rem] leading-[1.15] text-[var(--iko-stone-ink)]">
                Aún no has guardado tarjetas.
            </p>
            <p className="max-w-[58ch] text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                Guarda una tarjeta para hacer pedidos en un paso. Los datos se almacenan de forma
                segura en Stripe.
            </p>
            <div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex h-12 items-center gap-2 bg-[var(--iko-accent)] px-7 text-[14px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]"
                >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                    Agregar tarjeta
                </button>
            </div>
        </section>
    );
}

function AddCardModal({
    stripeKey,
    onClose,
    onError,
}: {
    stripeKey: string;
    onClose: () => void;
    onError: (msg: string) => void;
}) {
    const [submitting, setSubmitting] = useState(false);
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const cardElementRef = useRef<HTMLDivElement>(null);
    const cardElementInstance = useRef<StripeCardElement | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function init(): Promise<void> {
            try {
                const stripeInstance = await loadStripe(stripeKey);
                if (!stripeInstance || cancelled) {
                    return;
                }
                setStripe(stripeInstance);
                const cardElement = stripeInstance.elements().create('card', {
                    style: {
                        base: {
                            fontSize: '15px',
                            color: '#0d262e',
                            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                            '::placeholder': { color: '#7a7a7a' },
                        },
                    },
                });
                cardElementInstance.current = cardElement;
                if (cardElementRef.current) {
                    cardElement.mount(cardElementRef.current);
                }
            } catch {
                onError('Error al inicializar el sistema de pagos.');
            }
        }

        init();

        return () => {
            cancelled = true;
            if (cardElementInstance.current) {
                cardElementInstance.current.unmount();
                cardElementInstance.current = null;
            }
        };
    }, [stripeKey, onError]);

    async function handleSubmit(e: FormEvent): Promise<void> {
        e.preventDefault();
        if (!stripe || !cardElementInstance.current) {
            return;
        }

        setSubmitting(true);

        try {
            const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElementInstance.current,
            });

            if (stripeError) {
                onError(stripeError.message || 'Error al procesar la tarjeta.');
                setSubmitting(false);
                return;
            }

            router.post(
                '/account/payment-methods',
                {
                    payment_method_id: paymentMethod.id,
                    set_as_default: true,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => onClose(),
                    onError: () => onError('No fue posible agregar la tarjeta.'),
                    onFinish: () => setSubmitting(false),
                },
            );
        } catch {
            onError('Error de conexión. Intenta nuevamente.');
            setSubmitting(false);
        }
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-modal-heading"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--iko-stone-ink)]/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[28rem] border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] shadow-[0_24px_60px_-20px_rgba(13,38,46,0.25)]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b border-[var(--iko-stone-hairline)] px-6 py-5">
                    <h2
                        id="card-modal-heading"
                        className="font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]"
                    >
                        Nueva tarjeta
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]"
                        aria-label="Cerrar"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                            Datos de la tarjeta
                        </label>
                        <div className="border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] px-4 py-3.5">
                            <div ref={cardElementRef} />
                        </div>
                        <p className="font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]">
                            Procesado de forma segura por Stripe.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[var(--iko-stone-hairline)] py-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !stripe}
                            className="flex-1 bg-[var(--iko-accent)] py-3 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] disabled:opacity-60"
                        >
                            {submitting ? 'Guardando…' : 'Agregar tarjeta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
