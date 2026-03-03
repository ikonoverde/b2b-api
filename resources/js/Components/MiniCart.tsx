import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { MiniCart as MiniCartType } from '@/types';

interface MiniCartProps {
    miniCart: MiniCartType;
}

export default function MiniCart({ miniCart }: MiniCartProps) {
    const { items, subtotal, totalCount: cartItemCount } = miniCart;
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleBlur = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
    };

    const handleFocus = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    return (
        <div
            className="relative"
            onBlur={handleBlur}
            onFocus={handleFocus}
        >
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 text-white/80 hover:text-white transition-colors"
            >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#D4A853] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {cartItemCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#E5E5E5] z-50">
                    {cartItemCount === 0 ? (
                        <div className="p-6 text-center">
                            <ShoppingCart className="w-8 h-8 text-[#999999] mx-auto mb-2" />
                            <p className="text-sm text-[#666666] font-[Outfit]">
                                Tu carrito está vacío
                            </p>
                            <Link
                                href="/catalog"
                                className="inline-block mt-3 text-sm text-[#5E7052] font-[Outfit] font-medium hover:underline"
                            >
                                Ver Catálogo
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-3 border-b border-[#E5E5E5]">
                                <h3 className="text-sm font-semibold text-[#1A1A1A] font-[Outfit]">
                                    Mi Carrito
                                    <span className="ml-1 text-xs font-normal text-[#999999]">
                                        ({cartItemCount} {cartItemCount === 1 ? 'producto' : 'productos'})
                                    </span>
                                </h3>
                            </div>

                            <ul className="divide-y divide-[#E5E5E5]">
                                {items.map((item) => (
                                    <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                                        <div className="w-10 h-10 rounded-full bg-[#F5F3F0] shrink-0 overflow-hidden flex items-center justify-center">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ShoppingCart className="w-4 h-4 text-[#999999]" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-[#1A1A1A] font-[Outfit] truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-[#999999] font-[Outfit]">
                                                {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit] shrink-0">
                                            ${item.subtotal.toFixed(2)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="px-4 py-3 border-t border-[#E5E5E5] flex items-center justify-between">
                                <span className="text-sm text-[#666666] font-[Outfit]">Subtotal</span>
                                <span className="text-sm font-semibold text-[#1A1A1A] font-[Outfit]">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="px-4 pb-4 flex gap-2">
                                <Link
                                    href="/cart"
                                    className="flex-1 text-center py-2 text-sm font-medium text-[#5E7052] border border-[#5E7052] rounded-lg font-[Outfit] hover:bg-[#5E7052]/5 transition-colors"
                                >
                                    Ver Carrito
                                </Link>
                                <Link
                                    href="/checkout"
                                    className="flex-1 text-center py-2 text-sm font-medium text-white bg-[#5E7052] rounded-lg font-[Outfit] hover:bg-[#4a5d42] transition-colors"
                                >
                                    Ir al Checkout
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
