import { Link, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { Cart, CartItem } from '@/types';

interface CartPageProps {
    cart: Cart;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function CartItemRow({ item }: { item: CartItem }) {
    function updateQuantity(newQty: number) {
        if (newQty < 1) return;
        router.post(`/cart/items/${item.id}`, { quantity: newQty }, { preserveScroll: true });
    }

    function remove() {
        router.delete(`/cart/items/${item.id}`, { preserveScroll: true });
    }

    return (
        <div className="flex gap-4 rounded-2xl bg-white p-4 border border-[#E5E5E5]">
            {/* Image */}
            <div className="w-20 h-20 rounded-xl bg-[#F5F3F0] shrink-0 overflow-hidden">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-[#E8E8E8] rounded-full" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <span className="font-[Outfit] font-semibold text-[#1A1A1A] text-sm leading-snug line-clamp-2">
                        {item.name}
                    </span>
                    <button
                        onClick={remove}
                        className="text-[#999999] hover:text-red-500 transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F3F0] transition-colors disabled:opacity-40 hover:bg-[#E5E5E5]"
                        >
                            <Minus className="h-3 w-3 text-[#5E7052]" />
                        </button>
                        <span className="min-w-[2ch] text-center text-sm font-bold text-[#1A1A1A] font-[Outfit]">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F3F0] transition-colors hover:bg-[#E5E5E5]"
                        >
                            <Plus className="h-3 w-3 text-[#5E7052]" />
                        </button>
                    </div>

                    <span className="font-[Outfit] font-bold text-[#8B6F47] text-sm">
                        {formatCurrency(item.subtotal)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function CartPage({ cart }: CartPageProps) {
    const isEmpty = cart.items.length === 0;

    function clearCart() {
        if (!confirm('¿Vaciar todo el carrito?')) return;
        router.delete('/cart', { preserveScroll: true });
    }

    return (
        <CustomerLayout title="Carrito">
            <div className="px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">Mi Carrito</h1>
                    {!isEmpty && (
                        <button
                            onClick={clearCart}
                            className="flex items-center gap-1.5 text-sm font-medium text-[#999999] hover:text-red-500 transition-colors font-[Outfit]"
                        >
                            <Trash2 className="h-4 w-4" />
                            Vaciar
                        </button>
                    )}
                </div>

                {isEmpty ? (
                    <div className="flex flex-col items-center gap-4 py-16">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D4E5D0]">
                            <ShoppingCart className="h-8 w-8 text-[#5E7052]" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-base font-semibold text-[#1A1A1A] font-[Outfit]">Carrito vacío</span>
                            <span className="text-sm text-[#999999] font-[Outfit]">Agrega productos desde el catálogo</span>
                        </div>
                        <Link
                            href="/catalog"
                            className="rounded-xl bg-[#5E7052] px-6 py-2.5 text-sm font-semibold text-white font-[Outfit] hover:bg-[#4d5e43] transition-colors"
                        >
                            Explorar Catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 flex flex-col gap-3">
                            {cart.items.map((item) => (
                                <CartItemRow key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 border border-[#E5E5E5] sticky top-20">
                                <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">Resumen del Pedido</h2>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm font-[Outfit]">
                                        <span className="text-[#999999]">Subtotal</span>
                                        <span className="font-medium text-[#1A1A1A]">{formatCurrency(cart.totals.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-[Outfit]">
                                        <span className="text-[#999999]">Envío</span>
                                        <span className="font-medium text-[#1A1A1A]">{formatCurrency(cart.totals.shipping)}</span>
                                    </div>
                                    <div className="border-t border-[#E5E5E5] pt-3 mt-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">Total</span>
                                            <span className="text-lg font-bold text-[#8B6F47] font-[Outfit]">
                                                {formatCurrency(cart.totals.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout/shipping"
                                    className="flex items-center justify-center rounded-xl bg-[#5E7052] px-6 py-3 text-sm font-bold text-white font-[Outfit] hover:bg-[#4d5e43] transition-colors"
                                >
                                    Realizar Pedido
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
