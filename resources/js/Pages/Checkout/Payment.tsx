import { useMemo, useState, type FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CustomerShell from '@/Layouts/CustomerShell';
import CheckoutStepIndicator from '@/Components/CheckoutStepIndicator';
import OrderSummary from '@/Components/OrderSummary';
import { formatCurrency } from '@/utils/currency';
import type { PaymentMethod } from '@/types';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    image: string | null;
}

interface PaymentProps {
    order: {
        id: number;
        total_amount: number;
        shipping_cost: number;
        items: OrderItem[];
    };
    client_secret: string;
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

function formatExpiry(method: PaymentMethod): string {
    return `${String(method.card.exp_month).padStart(2, '0')}/${String(method.card.exp_year).slice(-2)}`;
}

export default function Payment({ order, client_secret, stripe_key, payment_methods }: PaymentProps) {
    const stripePromise = useMemo(() => loadStripe(stripe_key), [stripe_key]);

    return (
        <CustomerShell title="Pago · Compra">
            <header className="flex flex-col gap-3">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Compra · Pago
                </span>
                <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                    Método de pago
                </h1>
                <p className="max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                    Elige una tarjeta guardada o introduce una nueva. Stripe procesa el pago con cifrado.
                </p>
            </header>

            <div className="mt-10">
                <CheckoutStepIndicator currentStep={2} />
            </div>

            <Elements
                stripe={stripePromise}
                options={{
                    clientSecret: client_secret,
                    appearance: {
                        theme: 'stripe',
                        variables: {
                            colorPrimary: '#0c5e6f',
                            colorText: '#0d262e',
                            colorBackground: '#f5f3ee',
                            borderRadius: '0px',
                            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
                            fontSizeBase: '15px',
                            spacingUnit: '4px',
                        },
                        rules: {
                            '.Input': {
                                border: '1px solid #d8d6d0',
                                boxShadow: 'none',
                            },
                            '.Input:focus': {
                                borderColor: '#0c5e6f',
                                boxShadow: '0 0 0 1px #0c5e6f',
                            },
                            '.Tab': {
                                border: '1px solid #d8d6d0',
                            },
                            '.Tab--selected': {
                                borderColor: '#0c5e6f',
                                color: '#0c5e6f',
                            },
                        },
                    },
                    locale: 'es',
                }}
            >
                <PaymentForm
                    order={order}
                    clientSecret={client_secret}
                    paymentMethods={payment_methods}
                />
            </Elements>
        </CustomerShell>
    );
}

function PaymentForm({
    order,
    clientSecret,
    paymentMethods,
}: {
    order: PaymentProps['order'];
    clientSecret: string;
    paymentMethods: PaymentMethod[];
}) {
    const stripe = useStripe();
    const elements = useElements();
    const defaultPaymentMethod = paymentMethods.find((method) => method.is_default);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(
        defaultPaymentMethod?.id ?? paymentMethods[0]?.id ?? 'new',
    );
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isUsingNewCard = selectedPaymentMethodId === 'new';
    const selectedPaymentMethod = paymentMethods.find(
        (method) => method.id === selectedPaymentMethodId,
    );

    async function handleSubmit(e: FormEvent): Promise<void> {
        e.preventDefault();

        if (!stripe) {
            return;
        }

        setProcessing(true);
        setError(null);

        if (!isUsingNewCard) {
            if (!selectedPaymentMethod) {
                setError('Selecciona una tarjeta guardada o usa una tarjeta nueva.');
                setProcessing(false);

                return;
            }

            const { error: savedCardError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: selectedPaymentMethod.id,
            });

            if (savedCardError) {
                setError(savedCardError.message ?? 'Ocurrió un error al procesar el pago.');
                setProcessing(false);

                return;
            }

            window.location.assign(`/checkout/thank-you?order=${order.id}`);

            return;
        }

        if (!elements) {
            setProcessing(false);

            return;
        }

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/thank-you?order=${order.id}`,
            },
        });

        if (submitError) {
            setError(submitError.message ?? 'Ocurrió un error al procesar el pago.');
            setProcessing(false);
        }
    }

    return (
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {paymentMethods.length > 0 && (
                    <section className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--iko-stone-hairline)] pb-3">
                            <h2 className="font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]">
                                Tarjetas guardadas
                            </h2>
                            <span className="font-spec text-[11px] tabular-nums tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase">
                                {String(paymentMethods.length).padStart(2, '0')} disponibles
                            </span>
                        </div>

                        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Método de pago">
                            {paymentMethods.map((method) => (
                                <PaymentMethodOption
                                    key={method.id}
                                    method={method}
                                    selected={selectedPaymentMethodId === method.id}
                                    onSelect={() => setSelectedPaymentMethodId(method.id)}
                                />
                            ))}

                            <label
                                className={`grid cursor-pointer grid-cols-[auto_1fr] gap-4 border px-5 py-4 transition-colors focus-within:ring-2 focus-within:ring-[var(--iko-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--iko-stone-paper)] ${
                                    isUsingNewCard
                                        ? 'border-[var(--iko-accent)] bg-[var(--iko-accent-soft)]'
                                        : 'border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] hover:border-[var(--iko-stone-mid)]'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="new"
                                    checked={isUsingNewCard}
                                    onChange={() => setSelectedPaymentMethodId('new')}
                                    className="mt-1 h-4 w-4 accent-[var(--iko-accent)]"
                                />
                                <span className="flex flex-col gap-1.5">
                                    <span className="font-display text-[1.05rem] leading-tight text-[var(--iko-stone-ink)]">
                                        Usar otra tarjeta
                                    </span>
                                    <span className="text-[13px] leading-[1.45] text-[var(--iko-stone-ink)]/70">
                                        Introduce los datos solo para este pago.
                                    </span>
                                </span>
                            </label>
                        </div>
                    </section>
                )}

                {isUsingNewCard && (
                    <div className="border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] p-5">
                        <PaymentElement />
                    </div>
                )}

                {error && (
                    <div className="border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-4">
                        <p className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-error)] uppercase">
                            Pago no procesado
                        </p>
                        <p className="mt-1 text-[13px] text-[var(--iko-error)]">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing || !stripe || (isUsingNewCard && !elements)}
                    className="flex h-12 w-full items-center justify-center gap-3 bg-[var(--iko-accent)] px-6 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? (
                        <span
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)]"
                        />
                    ) : (
                        <>
                            {selectedPaymentMethod && !isUsingNewCard
                                ? `Pagar con ${formatCardBrand(selectedPaymentMethod.card.brand)}`
                                : 'Pagar'}
                            <span className="font-spec tabular-nums">
                                {formatCurrency(order.total_amount)}
                            </span>
                        </>
                    )}
                </button>
            </form>

            <OrderSummary
                items={order.items}
                totalAmount={order.total_amount}
                shippingCost={order.shipping_cost}
            />
        </div>
    );
}

function PaymentMethodOption({
    method,
    selected,
    onSelect,
}: {
    method: PaymentMethod;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <label
            className={`grid cursor-pointer grid-cols-[auto_1fr] gap-4 border px-5 py-4 transition-colors focus-within:ring-2 focus-within:ring-[var(--iko-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--iko-stone-paper)] ${
                selected
                    ? 'border-[var(--iko-accent)] bg-[var(--iko-accent-soft)]'
                    : 'border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] hover:border-[var(--iko-stone-mid)]'
            }`}
        >
            <input
                type="radio"
                name="payment_method"
                value={method.id}
                checked={selected}
                onChange={onSelect}
                className="mt-1 h-4 w-4 accent-[var(--iko-accent)]"
            />
            <span className="flex flex-col gap-2">
                <span className="flex flex-wrap items-baseline gap-3">
                    <span className="font-display text-[1.05rem] leading-tight text-[var(--iko-stone-ink)]">
                        {formatCardBrand(method.card.brand)}
                    </span>
                    <span className="font-spec text-[13px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)]">
                        ···· {method.card.last4}
                    </span>
                    {method.is_default && (
                        <span className="font-spec text-[10px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                            Predeterminada
                        </span>
                    )}
                </span>
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    Vence {formatExpiry(method)}
                </span>
            </span>
        </label>
    );
}
