import { useForm } from '@inertiajs/react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { FormEvent } from 'react';
import type { AdminOrder } from '@/types';
import { formatCurrency } from './helpers';

export default function RefundModal({
    order,
    onClose,
}: {
    order: AdminOrder;
    onClose: () => void;
}) {
    const remaining = order.total_amount - order.refunded_amount;
    const { data, setData, post, processing, errors } = useForm({
        amount: remaining.toString(),
        reason: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/admin/orders/${order.id}/refund`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Procesar Reembolso</h2>
                    <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-xl border border-border">
                        <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            Esta accion procesara un reembolso a traves de Stripe y no se puede deshacer.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">
                            Monto (max: {formatCurrency(remaining)})
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={remaining}
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="h-10 px-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
                        />
                        {errors.amount && (
                            <span className="text-xs text-destructive">{errors.amount}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-foreground">Razon (opcional)</label>
                        <textarea
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            rows={2}
                            placeholder="Motivo del reembolso..."
                            className="px-4 py-3 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors resize-none"
                        />
                        {errors.reason && (
                            <span className="text-xs text-destructive">{errors.reason}</span>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-destructive rounded-lg text-sm font-medium text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Procesando...' : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Confirmar Reembolso
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
