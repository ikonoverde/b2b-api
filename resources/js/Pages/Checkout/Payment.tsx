import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import CheckoutStepIndicator from '@/Components/CheckoutStepIndicator';
import OrderSummary from '@/Components/OrderSummary';

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

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function PaymentForm({ order }: { order: PaymentProps['order'] }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-4">
                <div className="rounded-2xl bg-white p-5 border border-[#E5E5E5]">
                    <PaymentElement />
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-800 font-[Outfit]">{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing || !stripe}
                    className="h-12 bg-[#5E7052] text-white font-semibold rounded-xl hover:bg-[#4d5e43] transition-colors disabled:opacity-50 font-[Outfit]"
                >
                    {processing ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                        `Pagar ${formatCurrency(order.total_amount)}`
                    )}
                </button>
            </form>

            <div className="lg:col-span-1">
                <OrderSummary
                    items={order.items}
                    totalAmount={order.total_amount}
                    shippingCost={order.shipping_cost}
                />
            </div>
        </div>
    );
}

export default function Payment({ order, client_secret, stripe_key }: PaymentProps) {
    const stripePromise = loadStripe(stripe_key);

    return (
        <CustomerLayout title="Pago - Checkout">
            <div className="px-6 py-8">
                <CheckoutStepIndicator currentStep={2} />

                <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mb-6">Método de Pago</h1>

                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret: client_secret,
                        appearance: {
                            theme: 'stripe',
                            variables: {
                                colorPrimary: '#5E7052',
                                borderRadius: '12px',
                            },
                        },
                        locale: 'es',
                    }}
                >
                    <PaymentForm order={order} />
                </Elements>
            </div>
        </CustomerLayout>
    );
}
