import { useForm, usePage } from '@inertiajs/react';
import { Loader2, MapPin, Phone, User } from 'lucide-react';
import type { FormEvent } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import TextInput from '@/Components/TextInput';
import CheckoutStepIndicator from '@/Components/CheckoutStepIndicator';
import type { Cart, PageProps } from '@/types';

interface ShippingProps {
    cart: Cart;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function Shipping({ cart }: ShippingProps) {
    const { errors } = usePage<PageProps & { errors: Record<string, string | string[]> }>().props;

    const form = useForm({
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        phone: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        form.post('/checkout/shipping');
    }

    return (
        <CustomerLayout title="Envío - Checkout">
            <div className="px-6 py-8">
                <CheckoutStepIndicator currentStep={1} />

                <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mb-6">Dirección de Envío</h1>

                {errors.stock && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-800 font-[Outfit]">
                            Algunos productos no tienen suficiente stock:
                        </p>
                        <ul className="mt-1 list-disc pl-5 text-sm text-red-700 font-[Outfit]">
                            {(Array.isArray(errors.stock) ? errors.stock : [errors.stock]).map(
                                (error: string, i: number) => (
                                    <li key={i}>{error}</li>
                                ),
                            )}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <form onSubmit={submit} className="lg:col-span-2 flex flex-col gap-4">
                        <TextInput
                            id="name"
                            label="Nombre de contacto"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Nombre completo"
                            icon={User}
                            disabled={form.processing}
                            error={form.errors.name}
                        />

                        <TextInput
                            id="address_line_1"
                            label="Dirección"
                            value={form.data.address_line_1}
                            onChange={(e) => form.setData('address_line_1', e.target.value)}
                            placeholder="Calle y número"
                            icon={MapPin}
                            disabled={form.processing}
                            error={form.errors.address_line_1}
                        />

                        <TextInput
                            id="address_line_2"
                            label="Dirección línea 2 (opcional)"
                            value={form.data.address_line_2}
                            onChange={(e) => form.setData('address_line_2', e.target.value)}
                            placeholder="Interior, colonia, etc."
                            disabled={form.processing}
                            error={form.errors.address_line_2}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                id="city"
                                label="Ciudad"
                                value={form.data.city}
                                onChange={(e) => form.setData('city', e.target.value)}
                                placeholder="Ciudad"
                                disabled={form.processing}
                                error={form.errors.city}
                            />
                            <TextInput
                                id="state"
                                label="Estado"
                                value={form.data.state}
                                onChange={(e) => form.setData('state', e.target.value)}
                                placeholder="Estado"
                                disabled={form.processing}
                                error={form.errors.state}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                id="postal_code"
                                label="Código Postal"
                                value={form.data.postal_code}
                                onChange={(e) => form.setData('postal_code', e.target.value)}
                                placeholder="00000"
                                disabled={form.processing}
                                error={form.errors.postal_code}
                            />
                            <TextInput
                                id="phone"
                                label="Teléfono"
                                type="tel"
                                value={form.data.phone}
                                onChange={(e) => form.setData('phone', e.target.value)}
                                placeholder="10 dígitos"
                                icon={Phone}
                                disabled={form.processing}
                                error={form.errors.phone}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="h-12 bg-[#5E7052] text-white font-semibold rounded-xl hover:bg-[#4d5e43] transition-colors disabled:opacity-50 font-[Outfit] mt-2"
                        >
                            {form.processing ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                'Continuar al Pago'
                            )}
                        </button>
                    </form>

                    <div className="lg:col-span-1">
                        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 border border-[#E5E5E5] sticky top-20">
                            <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">
                                Resumen ({cart.items.length} productos)
                            </h2>
                            <div className="flex flex-col gap-2">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm font-[Outfit]">
                                        <span className="text-[#999999]">
                                            {item.name} x{item.quantity}
                                        </span>
                                        <span className="font-medium text-[#1A1A1A]">
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-[#E5E5E5] pt-2 mt-1">
                                    <div className="flex justify-between text-sm font-[Outfit]">
                                        <span className="text-[#999999]">Subtotal</span>
                                        <span className="font-medium text-[#1A1A1A]">
                                            {formatCurrency(cart.totals.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm font-[Outfit]">
                                        <span className="text-[#999999]">Envío</span>
                                        <span className="font-medium text-[#1A1A1A]">
                                            {formatCurrency(cart.totals.shipping)}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex justify-between">
                                        <span className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">Total</span>
                                        <span className="text-lg font-bold text-[#8B6F47] font-[Outfit]">
                                            {formatCurrency(cart.totals.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
