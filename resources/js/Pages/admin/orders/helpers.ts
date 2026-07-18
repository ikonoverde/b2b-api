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
    return statusColors[status] || 'bg-muted text-foreground';
};

export const getPaymentStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        pending: 'bg-muted text-muted-foreground',
        completed: 'bg-primary/10 text-primary',
        failed: 'bg-destructive/10 text-destructive',
        refunded: 'bg-accent text-accent-foreground',
    };
    return colors[status] || 'bg-muted text-foreground';
};

export const allowedTransitions: Record<string, string[]> = {
    payment_pending: ['pending', 'cancelled'],
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
};
