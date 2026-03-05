export { statusLabels, statusColors } from '@/utils/order';
export { formatCurrency } from '@/utils/currency';
export { formatDate, formatDateShort } from '@/utils/date';
import { statusColors } from '@/utils/order';

export const paymentStatusLabels: Record<string, string> = {
    pending: 'Pendiente',
    completed: 'Completado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
};

export const getStatusColor = (status: string): string => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getPaymentStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

export const allowedTransitions: Record<string, string[]> = {
    payment_pending: ['pending', 'cancelled'],
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
};
