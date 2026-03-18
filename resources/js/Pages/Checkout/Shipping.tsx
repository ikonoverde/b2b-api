import { useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import type { FormEvent } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import AddressForm from '@/Components/AddressForm';
import CheckoutStepIndicator from '@/Components/CheckoutStepIndicator';
import ShippingQuoteSelector from '@/Components/ShippingQuoteSelector';
import CheckoutSummary from '@/Components/CheckoutSummary';
import useShippingQuotes from '@/hooks/useShippingQuotes';
import type { Cart, PageProps } from '@/types';

interface ShippingProps {
    cart: Cart;
}

const QUOTE_FIELDS = new Set(['postal_code', 'city', 'state', 'address_line_2']);

function canFetchQuotes(data: Record<string, string>): boolean {
    return (
        data.postal_code.length === 5 &&
        !!data.city.trim() &&
        !!data.state.trim() &&
        !!data.address_line_2.trim()
    );
}

export default function Shipping({ cart }: ShippingProps) {
    const { errors } = usePage<PageProps & { errors: Record<string, string | string[]> }>().props;
    const { quotes, loading, error, fetched, fetch: fetchQuotes } = useShippingQuotes();

    const form = useForm({
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        phone: '',
        shipping_quote_id: '',
    });

    const selectedQuote = quotes.find((q) => q.quote_id === form.data.shipping_quote_id) ?? null;
    const shippingCost = selectedQuote?.price ?? null;
    const total = shippingCost !== null ? cart.totals.subtotal + shippingCost : null;

    function handleFieldChange(field: string, value: string) {
        const updated = { ...form.data, [field]: value };

        if (QUOTE_FIELDS.has(field) && canFetchQuotes(updated)) {
            form.setData({ ...updated, shipping_quote_id: '' });
            fetchQuotes({
                postal_code: updated.postal_code,
                city: updated.city,
                state: updated.state,
                neighborhood: updated.address_line_2,
            });
        } else {
            form.setData(field as keyof typeof form.data, value);
        }
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/checkout/shipping');
    }

    return (
        <CustomerLayout title="Envío - Checkout">
            <div className="px-6 py-8">
                <CheckoutStepIndicator currentStep={1} />

                <h1 className="text-2xl font-bold text-stripe-text font-body mb-6">Dirección de Envío</h1>

                {errors.stock && (
                    <div className="mb-5 rounded-xl border border-stripe-border bg-white p-4 shadow-[0_1px_1px_0_rgba(0,0,0,0.03)]">
                        <p className="text-[13px] font-medium text-stripe-error font-body">
                            Algunos productos no tienen suficiente stock:
                        </p>
                        <ul className="mt-1 list-disc pl-5 text-[13px] text-stripe-error font-body">
                            {(Array.isArray(errors.stock) ? errors.stock : [errors.stock]).map(
                                (error: string, i: number) => (
                                    <li key={i}>{error}</li>
                                ),
                            )}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <form onSubmit={submit} className="lg:col-span-2 flex flex-col gap-5">
                        <AddressForm
                            data={form.data}
                            errors={form.errors}
                            disabled={form.processing}
                            onFieldChange={handleFieldChange}
                        />

                        <ShippingQuoteSelector
                            quotes={quotes}
                            selectedQuoteId={form.data.shipping_quote_id}
                            loading={loading}
                            fetched={fetched}
                            error={error}
                            validationError={form.errors.shipping_quote_id}
                            onSelect={(quote) => form.setData('shipping_quote_id', quote.quote_id)}
                        />

                        <button
                            type="submit"
                            disabled={form.processing || !form.data.shipping_quote_id}
                            className="h-12 bg-primary text-white font-semibold rounded-xl hover:bg-[#4d5e43] transition-all disabled:opacity-50 font-body mt-1 shadow-[0_1px_1px_0_rgba(0,0,0,0.03),0_1px_3px_0_rgba(0,0,0,0.08)] hover:shadow-[0_1px_1px_0_rgba(0,0,0,0.03),0_3px_7px_0_rgba(0,0,0,0.12)]"
                        >
                            {form.processing ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                'Continuar al Pago'
                            )}
                        </button>
                    </form>

                    <div className="lg:col-span-1">
                        <CheckoutSummary
                            items={cart.items}
                            subtotal={cart.totals.subtotal}
                            shippingCost={shippingCost}
                            total={total}
                        />
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
