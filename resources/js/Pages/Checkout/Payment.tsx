import { useState, type FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CustomerShell from '@/Layouts/CustomerShell';
import CheckoutStepIndicator from '@/Components/CheckoutStepIndicator';
import OrderSummary from '@/Components/OrderSummary';
import { formatCurrency } from '@/utils/currency';

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
}

export default function Payment({ order, client_secret, stripe_key }: PaymentProps) {
    const stripePromise = loadStripe(stripe_key);

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
                    Pago procesado por Stripe. Tu información se transmite cifrada.
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
                <PaymentForm order={order} />
            </Elements>
        </CustomerShell>
    );
}

function PaymentForm({ order }: { order: PaymentProps['order'] }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent): Promise<void> {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

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
                <div className="border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] p-5">
                    <PaymentElement />
                </div>

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
                    disabled={processing || !stripe}
                    className="flex h-12 w-full items-center justify-center gap-3 bg-[var(--iko-accent)] px-6 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? (
                        <span
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)]"
                        />
                    ) : (
                        <>
                            Pagar
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
