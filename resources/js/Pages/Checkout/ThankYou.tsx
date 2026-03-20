import { Link } from '@inertiajs/react';
import { CheckCircle, Clock, Package } from 'lucide-react';
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

interface ThankYouProps {
    order: {
        id: number;
        status: string;
        payment_status: string;
        total_amount: number;
        shipping_cost: number;
        shipping_address: Record<string, string> | null;
        created_at: string;
        items: OrderItem[];
    };
}

export default function ThankYou({ order }: ThankYouProps) {
    const isProcessing = order.payment_status === 'pending';

    return (
        <CustomerLayout title="Pedido Confirmado">
            <div className="px-6 py-8">
                <CheckoutStepIndicator currentStep={3} />

                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        {isProcessing ? (
                            <>
                                <Clock className="h-16 w-16 text-[#8B6F47] mx-auto mb-4" />
                                <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mb-2">
                                    Procesando tu pago
                                </h1>
                                <p className="text-[#999999] font-[Outfit]">
                                    Tu pago está siendo confirmado. Te notificaremos cuando se complete.
                                </p>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-16 w-16 text-[#5E7052] mx-auto mb-4" />
                                <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit] mb-2">
                                    ¡Pedido Confirmado!
                                </h1>
                                <p className="text-[#999999] font-[Outfit]">
                                    Tu pedido #{order.id} ha sido recibido exitosamente.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="rounded-2xl bg-white p-6 border border-[#E5E5E5] mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="h-5 w-5 text-[#5E7052]" />
                            <h2 className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">
                                Pedido #{order.id}
                            </h2>
                        </div>

                        <OrderSummary
                            items={order.items}
                            totalAmount={order.total_amount}
                            shippingCost={order.shipping_cost}
                            showCard={false}
                        />

                        {order.shipping_address && (
                            <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                                <h3 className="text-sm font-bold text-[#1A1A1A] font-[Outfit] mb-1">
                                    Dirección de envío
                                </h3>
                                <p className="text-sm text-[#999999] font-[Outfit]">
                                    {order.shipping_address.name}
                                    <br />
                                    {order.shipping_address.address_line_1}
                                    {order.shipping_address.address_line_2 && (
                                        <>, {order.shipping_address.address_line_2}</>
                                    )}
                                    <br />
                                    {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                    {order.shipping_address.postal_code}
                                    {order.shipping_address.phone && (
                                        <>
                                            <br />
                                            Tel: {order.shipping_address.phone}
                                        </>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href={`/account/orders/${order.id}`}
                            className="flex-1 text-center py-3 text-sm font-semibold text-[#5E7052] border border-[#5E7052] rounded-xl font-[Outfit] hover:bg-[#5E7052]/5 transition-colors"
                        >
                            Ver pedido
                        </Link>
                        <Link
                            href="/catalog"
                            className="flex-1 text-center py-3 text-sm font-semibold text-white bg-[#5E7052] rounded-xl font-[Outfit] hover:bg-[#4d5e43] transition-colors"
                        >
                            Seguir comprando
                        </Link>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
