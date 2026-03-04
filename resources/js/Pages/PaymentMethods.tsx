import { router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    CreditCard,
    Loader2,
    Plus,
    Star,
    Trash2,
    X,
} from 'lucide-react';
import { loadStripe, type Stripe, type StripeCardElement } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { PageProps, PaymentMethod } from '@/types';

interface PaymentMethodsProps {
    stripe_key: string;
    payment_methods: PaymentMethod[];
}

function formatCardBrand(brand: string): string {
    const brandMap: { [key: string]: string } = {
        visa: 'Visa',
        mastercard: 'Mastercard',
        amex: 'American Express',
        discover: 'Discover',
        jcb: 'JCB',
        diners: 'Diners Club',
        unionpay: 'UnionPay',
    };
    return brandMap[brand.toLowerCase()] || brand.charAt(0).toUpperCase() + brand.slice(1);
}

function PaymentMethodCard({ method, onDelete, onSetDefault }: {
    method: PaymentMethod;
    onDelete: () => void;
    onSetDefault: () => void;
}) {
    return (
        <div className={`flex items-center gap-4 rounded-xl bg-white p-4 border ${
            method.is_default ? 'border-[#5E7052] ring-1 ring-[#5E7052]' : 'border-[#E5E5E5]'
        }`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5E7052]/10 flex-shrink-0">
                <CreditCard className="h-5 w-5 text-[#5E7052]" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">
                    {formatCardBrand(method.card.brand)} &bull;&bull;&bull;&bull; {method.card.last4}
                </p>
                <p className="text-xs text-[#999999] font-[Outfit]">
                    Expira {String(method.card.exp_month).padStart(2, '0')}/{method.card.exp_year}
                </p>
                {method.is_default && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-[#5E7052] font-[Outfit]">
                        <Star className="h-3 w-3 fill-current" />
                        Predeterminada
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                {!method.is_default && (
                    <button onClick={onSetDefault} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Establecer como predeterminada">
                        <Star className="h-4 w-4 text-[#999999]" />
                    </button>
                )}
                <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-full transition-colors" title="Eliminar tarjeta">
                    <Trash2 className="h-4 w-4 text-red-500" />
                </button>
            </div>
        </div>
    );
}

function AddCardModal({ stripeKey, onClose, onError }: {
    stripeKey: string;
    onClose: () => void;
    onError: (msg: string) => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const cardElementRef = useRef<HTMLDivElement>(null);
    const cardElementInstance = useRef<StripeCardElement | null>(null);

    useEffect(() => {
        initializeStripe();

        return () => {
            if (cardElementInstance.current) {
                cardElementInstance.current.unmount();
                cardElementInstance.current = null;
            }
        };
    }, []);

    async function initializeStripe() {
        try {
            const stripeInstance = await loadStripe(stripeKey);
            if (!stripeInstance) return;

            setStripe(stripeInstance);
            const cardElement = stripeInstance.elements().create('card', {
                style: { base: { fontSize: '16px', color: '#1A1A1A', '::placeholder': { color: '#999999' } } },
            });
            cardElementInstance.current = cardElement;
            if (cardElementRef.current) {
                cardElement.mount(cardElementRef.current);
            }
        } catch {
            onError('Error al inicializar el sistema de pagos.');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!stripe || !cardElementInstance.current) return;

        setIsSubmitting(true);

        try {
            const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElementInstance.current,
            });

            if (stripeError) {
                onError(stripeError.message || 'Error al procesar la tarjeta.');
                setIsSubmitting(false);
                return;
            }

            router.post('/account/payment-methods', {
                payment_method_id: paymentMethod.id,
                set_as_default: true,
            }, {
                preserveScroll: true,
                onSuccess: () => onClose(),
                onError: () => onError('Error al agregar la tarjeta.'),
                onFinish: () => setIsSubmitting(false),
            });
        } catch {
            onError('Error de conexión. Por favor intente nuevamente.');
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">Agregar Tarjeta</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors" type="button">
                        <X className="h-5 w-5 text-[#999999]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-[Outfit]">
                            Información de la Tarjeta
                        </label>
                        <div className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 bg-white">
                            <div ref={cardElementRef} />
                        </div>
                        <p className="mt-2 text-xs text-[#999999] font-[Outfit]">
                            Sus datos de tarjeta son procesados de forma segura por Stripe.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-medium text-[#666666] hover:bg-gray-50 transition-colors font-[Outfit]">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting || !stripe}
                            className="flex-1 rounded-xl bg-[#5E7052] px-4 py-3 text-sm font-bold text-white hover:bg-[#4A5A40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[Outfit]">
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Agregar Tarjeta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PaymentMethods({ stripe_key, payment_methods }: PaymentMethodsProps) {
    const { flash } = usePage<PageProps>().props;
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    return (
        <CustomerLayout title="Métodos de Pago">
            <div className="px-6 py-8 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => router.visit('/account')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-[#5E7052]" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">Métodos de Pago</h1>
                </div>

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 font-[Outfit]">{successMessage}</p>
                    </div>
                )}

                {(flash?.error || error) && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700 font-[Outfit]">{flash?.error || error}</p>
                    </div>
                )}

                <button onClick={() => setIsAdding(true)}
                    className="w-full mb-6 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#5E7052] bg-[#5E7052]/5 px-4 py-4 text-sm font-medium text-[#5E7052] hover:bg-[#5E7052]/10 transition-colors font-[Outfit]">
                    <Plus className="h-5 w-5" />
                    Agregar Nueva Tarjeta
                </button>

                {payment_methods.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 text-[#CCCCCC] mx-auto mb-3" />
                        <p className="text-sm text-[#666666] font-[Outfit]">No tiene métodos de pago guardados.</p>
                        <p className="text-xs text-[#999999] font-[Outfit] mt-1">Agregue una tarjeta para facilitar sus compras futuras.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {payment_methods.map((method) => (
                            <PaymentMethodCard
                                key={method.id}
                                method={method}
                                onDelete={() => {
                                    if (confirm('¿Está seguro de que desea eliminar esta tarjeta?')) {
                                        router.delete(`/account/payment-methods/${method.id}`, { preserveScroll: true });
                                    }
                                }}
                                onSetDefault={() => router.patch(`/account/payment-methods/${method.id}/default`, {}, { preserveScroll: true })}
                            />
                        ))}
                    </div>
                )}

                {isAdding && (
                    <AddCardModal
                        stripeKey={stripe_key}
                        onClose={() => { setIsAdding(false); setError(''); }}
                        onError={(msg) => setError(msg)}
                    />
                )}
            </div>
        </CustomerLayout>
    );
}
