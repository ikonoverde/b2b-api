import { useForm } from '@inertiajs/react';
import { Loader2, MapPin, Phone, User } from 'lucide-react';
import type { FormEvent } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { Cart } from '@/types';

interface CheckoutProps {
    cart: Cart;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default function Checkout({ cart }: CheckoutProps) {
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
        form.post('/checkout');
    }

    return (
        <CustomerLayout title="Checkout">
            <div className="px-6 py-8">
                <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mb-6">Finalizar Pedido</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Shipping Form */}
                    <form onSubmit={submit} className="lg:col-span-2 flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">Dirección de Envío</h2>

                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                Nombre de contacto
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Nombre completo"
                                    className="w-full h-12 pl-12 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                    disabled={form.processing}
                                />
                            </div>
                            {form.errors.name && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.name}</span>}
                        </div>

                        {/* Address Line 1 */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="address_line_1" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                Dirección
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    id="address_line_1"
                                    value={form.data.address_line_1}
                                    onChange={(e) => form.setData('address_line_1', e.target.value)}
                                    placeholder="Calle y número"
                                    className="w-full h-12 pl-12 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                    disabled={form.processing}
                                />
                            </div>
                            {form.errors.address_line_1 && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.address_line_1}</span>}
                        </div>

                        {/* Address Line 2 */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="address_line_2" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                Dirección línea 2 (opcional)
                            </label>
                            <input
                                type="text"
                                id="address_line_2"
                                value={form.data.address_line_2}
                                onChange={(e) => form.setData('address_line_2', e.target.value)}
                                placeholder="Interior, colonia, etc."
                                className="w-full h-12 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                disabled={form.processing}
                            />
                            {form.errors.address_line_2 && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.address_line_2}</span>}
                        </div>

                        {/* City & State */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="city" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Ciudad
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    value={form.data.city}
                                    onChange={(e) => form.setData('city', e.target.value)}
                                    placeholder="Ciudad"
                                    className="w-full h-12 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                    disabled={form.processing}
                                />
                                {form.errors.city && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.city}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="state" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    value={form.data.state}
                                    onChange={(e) => form.setData('state', e.target.value)}
                                    placeholder="Estado"
                                    className="w-full h-12 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                    disabled={form.processing}
                                />
                                {form.errors.state && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.state}</span>}
                            </div>
                        </div>

                        {/* Postal Code & Phone */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="postal_code" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Código Postal
                                </label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    value={form.data.postal_code}
                                    onChange={(e) => form.setData('postal_code', e.target.value)}
                                    placeholder="00000"
                                    className="w-full h-12 px-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                    disabled={form.processing}
                                />
                                {form.errors.postal_code && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.postal_code}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="phone" className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                                    Teléfono
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={form.data.phone}
                                        onChange={(e) => form.setData('phone', e.target.value)}
                                        placeholder="10 dígitos"
                                        className="w-full h-12 pl-12 pr-4 rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]"
                                        disabled={form.processing}
                                    />
                                </div>
                                {form.errors.phone && <span className="text-sm text-red-500 font-[Outfit]">{form.errors.phone}</span>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="h-12 bg-[#5E7052] text-white font-semibold rounded-xl hover:bg-[#4d5e43] transition-colors disabled:opacity-50 font-[Outfit] mt-2"
                        >
                            {form.processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirmar Pedido'}
                        </button>
                    </form>

                    {/* Order Summary */}
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
                                        <span className="font-medium text-[#1A1A1A]">{formatCurrency(item.subtotal)}</span>
                                    </div>
                                ))}
                                <div className="border-t border-[#E5E5E5] pt-2 mt-1">
                                    <div className="flex justify-between text-sm font-[Outfit]">
                                        <span className="text-[#999999]">Subtotal</span>
                                        <span className="font-medium text-[#1A1A1A]">{formatCurrency(cart.totals.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-[Outfit]">
                                        <span className="text-[#999999]">Envío</span>
                                        <span className="font-medium text-[#1A1A1A]">{formatCurrency(cart.totals.shipping)}</span>
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
