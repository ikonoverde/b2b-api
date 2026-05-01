import { useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import CustomerShell from '@/Layouts/CustomerShell';
import AddressForm from '@/Components/AddressForm';
import CheckoutStepIndicator from '@/Components/CheckoutStepIndicator';
import SavedAddressSelector from '@/Components/SavedAddressSelector';
import ShippingQuoteSelector from '@/Components/ShippingQuoteSelector';
import CheckoutSummary from '@/Components/CheckoutSummary';
import useSavedAddress from '@/hooks/useSavedAddress';
import useShippingQuotes from '@/hooks/useShippingQuotes';
import type { Address, Cart, PageProps } from '@/types';

interface ShippingProps {
    cart: Cart;
    addresses: Address[];
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

export default function Shipping({ cart, addresses }: ShippingProps) {
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
        quote_id: '',
        rate_id: '',
    });

    function fetchQuotesIfReady(data: Record<string, string>): void {
        if (canFetchQuotes(data)) {
            fetchQuotes({
                postal_code: data.postal_code,
                city: data.city,
                state: data.state,
                neighborhood: data.address_line_2,
            });
        }
    }

    const { selectedAddressId, selectAddress, clearSelection } = useSavedAddress({
        addresses,
        setFormData: (data) => form.setData(data),
        resetForm: () => form.reset(),
        onAddressReady: fetchQuotesIfReady,
    });

    const selectedQuote = quotes.find((q) => q.rate_id === form.data.rate_id) ?? null;
    const shippingCost = selectedQuote?.price ?? null;
    const total = shippingCost !== null ? cart.totals.subtotal + shippingCost : null;

    function handleFieldChange(field: string, value: string): void {
        const updated = { ...form.data, [field]: value };

        if (QUOTE_FIELDS.has(field) && canFetchQuotes(updated)) {
            form.setData({ ...updated, quote_id: '', rate_id: '' });
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

    function submit(e: FormEvent): void {
        e.preventDefault();
        form.post('/checkout/shipping');
    }

    const stockErrors = errors.stock
        ? Array.isArray(errors.stock)
            ? errors.stock
            : [errors.stock]
        : null;

    return (
        <CustomerShell title="Envío · Compra">
            <header className="flex flex-col gap-3">
                <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Compra · Envío
                </span>
                <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-[var(--iko-stone-ink)]">
                    Dirección de envío
                </h1>
                <p className="max-w-[58ch] text-[15px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                    Selecciona una dirección guardada o ingresa una nueva. Las tarifas y tiempos de
                    entrega se calculan en tiempo real.
                </p>
            </header>

            <div className="mt-10">
                <CheckoutStepIndicator currentStep={1} />
            </div>

            {stockErrors && (
                <div className="mt-8 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-4">
                    <p className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-error)] uppercase">
                        Existencias insuficientes
                    </p>
                    <ul className="mt-2 flex flex-col gap-1">
                        {stockErrors.map((msg, i) => (
                            <li key={i} className="text-[13px] text-[var(--iko-error)]">
                                {msg}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem]">
                <form onSubmit={submit} className="flex flex-col gap-10">
                    {addresses.length > 0 && (
                        <SavedAddressSelector
                            addresses={addresses}
                            selectedAddressId={selectedAddressId}
                            onSelect={selectAddress}
                            onNewAddress={clearSelection}
                        />
                    )}

                    <AddressForm
                        data={form.data}
                        errors={form.errors}
                        disabled={form.processing}
                        onFieldChange={handleFieldChange}
                    />

                    <ShippingQuoteSelector
                        quotes={quotes}
                        selectedRateId={form.data.rate_id}
                        loading={loading}
                        fetched={fetched}
                        error={error}
                        validationError={form.errors.rate_id}
                        onSelect={(quote) =>
                            form.setData({
                                ...form.data,
                                quote_id: quote.quote_id,
                                rate_id: quote.rate_id,
                            })
                        }
                    />

                    <button
                        type="submit"
                        disabled={form.processing || !form.data.rate_id}
                        className="flex h-12 w-full items-center justify-center bg-[var(--iko-accent)] px-6 text-[14px] font-medium tracking-[0.01em] text-[var(--iko-accent-on)] transition-colors hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {form.processing ? (
                            <span
                                aria-hidden="true"
                                className="h-4 w-4 animate-spin rounded-full border border-[var(--iko-accent-on)]/40 border-t-[var(--iko-accent-on)]"
                            />
                        ) : (
                            'Continuar al pago'
                        )}
                    </button>
                </form>

                <CheckoutSummary
                    items={cart.items}
                    subtotal={cart.totals.subtotal}
                    shippingCost={shippingCost}
                    total={total}
                />
            </div>
        </CustomerShell>
    );
}
