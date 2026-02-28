import { router } from '@inertiajs/react';
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
import type { PaymentMethod } from '@/types';

interface PaymentMethodsProps {
    stripe_key: string;
}

function getCsrfToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    if (match) {
        try {
            return decodeURIComponent(match[2]);
        } catch {
            return match[2];
        }
    }
    return null;
}

function getCardIcon(brand: string): string {
    const icons: { [key: string]: string } = {
        visa: '💳',
        mastercard: '💳',
        amex: '💳',
        discover: '💳',
        jcb: '💳',
        diners: '💳',
        unionpay: '💳',
    };
    return icons[brand.toLowerCase()] || '💳';
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

export default function PaymentMethods({ stripe_key }: PaymentMethodsProps) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const cardElementRef = useRef<HTMLDivElement>(null);
    const cardElementInstance = useRef<StripeCardElement | null>(null);

    // Load payment methods
    useEffect(() => {
        loadPaymentMethods();
    }, []);

    // Initialize Stripe when adding a new card
    useEffect(() => {
        if (isAdding && stripe_key) {
            initializeStripe();
        }
    }, [isAdding, stripe_key]);

    async function loadPaymentMethods() {
        try {
            const response = await fetch('/api/payment-methods', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPaymentMethods(data.payment_methods || []);
            } else {
                setError('Error al cargar los métodos de pago.');
            }
        } catch {
            setError('Error de conexión. Por favor intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }

    async function initializeStripe() {
        try {
            const stripeInstance = await loadStripe(stripe_key);
            if (stripeInstance) {
                setStripe(stripeInstance);
                const elementsInstance = stripeInstance.elements();
                
                // Create card element
                const cardElement = elementsInstance.create('card', {
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#1A1A1A',
                            '::placeholder': {
                                color: '#999999',
                            },
                        },
                    },
                });
                
                cardElementInstance.current = cardElement;
                
                if (cardElementRef.current) {
                    cardElement.mount(cardElementRef.current);
                }
            }
        } catch {
            setError('Error al inicializar el sistema de pagos.');
        }
    }

    async function handleAddPaymentMethod(e: React.FormEvent) {
        e.preventDefault();
        if (!stripe || !cardElementInstance.current) return;

        setIsSubmitting(true);
        setError('');

        try {
            // Create payment method with Stripe
            const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElementInstance.current,
            });

            if (stripeError) {
                setError(stripeError.message || 'Error al procesar la tarjeta.');
                setIsSubmitting(false);
                return;
            }

            // Send to backend
            const csrfToken = getCsrfToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }
            
            const response = await fetch('/api/payment-methods', {
                method: 'POST',
                credentials: 'include',
                headers,
                body: JSON.stringify({
                    payment_method_id: paymentMethod.id,
                    set_as_default: true,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Tarjeta agregada exitosamente.');
                setPaymentMethods(prev => [...prev, data.payment_method]);
                setIsAdding(false);
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Error al agregar la tarjeta.');
            }
        } catch {
            setError('Error de conexión. Por favor intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(paymentMethodId: string) {
        if (!confirm('¿Está seguro de que desea eliminar esta tarjeta?')) return;

        setError('');
        setSuccess('');

        try {
            const csrfToken = getCsrfToken();
            const headers: Record<string, string> = {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }
            
            const response = await fetch(`/api/payment-methods/${paymentMethodId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Tarjeta eliminada exitosamente.');
                setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Error al eliminar la tarjeta.');
            }
        } catch {
            setError('Error de conexión. Por favor intente nuevamente.');
        }
    }

    async function handleSetDefault(paymentMethodId: string) {
        setError('');
        setSuccess('');

        try {
            const csrfToken = getCsrfToken();
            const headers: Record<string, string> = {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }
            
            const response = await fetch(`/api/payment-methods/${paymentMethodId}/default`, {
                method: 'PATCH',
                credentials: 'include',
                headers,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Método de pago predeterminado actualizado.');
                setPaymentMethods(prev =>
                    prev.map(pm => ({
                        ...pm,
                        is_default: pm.id === paymentMethodId,
                    }))
                );
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Error al establecer el método predeterminado.');
            }
        } catch {
            setError('Error de conexión. Por favor intente nuevamente.');
        }
    }

    function closeAddModal() {
        setIsAdding(false);
        setError('');
        // Unmount card element
        if (cardElementInstance.current) {
            cardElementInstance.current.unmount();
            cardElementInstance.current = null;
        }
        setStripe(null);
    }

    return (
        <CustomerLayout title="Métodos de Pago">
            <div className="px-6 py-8 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.visit('/account')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-[#5E7052]" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">
                        Métodos de Pago
                    </h1>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 font-[Outfit]">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700 font-[Outfit]">{error}</p>
                    </div>
                )}

                {/* Add New Button */}
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full mb-6 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#5E7052] bg-[#5E7052]/5 px-4 py-4 text-sm font-medium text-[#5E7052] hover:bg-[#5E7052]/10 transition-colors font-[Outfit]"
                >
                    <Plus className="h-5 w-5" />
                    Agregar Nueva Tarjeta
                </button>

                {/* Payment Methods List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#5E7052]" />
                    </div>
                ) : paymentMethods.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard className="h-12 w-12 text-[#CCCCCC] mx-auto mb-3" />
                        <p className="text-sm text-[#666666] font-[Outfit]">
                            No tiene métodos de pago guardados.
                        </p>
                        <p className="text-xs text-[#999999] font-[Outfit] mt-1">
                            Agregue una tarjeta para facilitar sus compras futuras.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`flex items-center gap-4 rounded-xl bg-white p-4 border ${
                                    method.is_default
                                        ? 'border-[#5E7052] ring-1 ring-[#5E7052]'
                                        : 'border-[#E5E5E5]'
                                }`}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5E7052]/10 flex-shrink-0">
                                    <span className="text-xl">{getCardIcon(method.card.brand)}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">
                                        {formatCardBrand(method.card.brand)} •••• {method.card.last4}
                                    </p>
                                    <p className="text-xs text-[#999999] font-[Outfit]">
                                        Expira {String(method.card.exp_month).padStart(2, '0')}/
                                        {method.card.exp_year}
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
                                        <button
                                            onClick={() => handleSetDefault(method.id)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            title="Establecer como predeterminada"
                                        >
                                            <Star className="h-4 w-4 text-[#999999]" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(method.id)}
                                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                        title="Eliminar tarjeta"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Payment Method Modal */}
                {isAdding && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">
                                    Agregar Tarjeta
                                </h2>
                                <button
                                    onClick={closeAddModal}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    type="button"
                                >
                                    <X className="h-5 w-5 text-[#999999]" />
                                </button>
                            </div>

                            <form onSubmit={handleAddPaymentMethod} className="space-y-4">
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
                                    <button
                                        type="button"
                                        onClick={closeAddModal}
                                        className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-medium text-[#666666] hover:bg-gray-50 transition-colors font-[Outfit]"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !stripe}
                                        className="flex-1 rounded-xl bg-[#5E7052] px-4 py-3 text-sm font-bold text-white hover:bg-[#4A5A40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[Outfit]"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                        ) : (
                                            'Agregar Tarjeta'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
