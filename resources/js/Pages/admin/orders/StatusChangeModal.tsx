import { useForm } from '@inertiajs/react';
import { X, Check } from 'lucide-react';
import { FormEvent } from 'react';
import type { AdminOrder } from '@/types';
import { statusLabels, getStatusColor, allowedTransitions } from './helpers';

export default function StatusChangeModal({
    order,
    onClose,
}: {
    order: AdminOrder;
    onClose: () => void;
}) {
    const transitions = allowedTransitions[order.status] || [];
    const { data, setData, patch, processing } = useForm({
        status: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/admin/orders/${order.id}/status`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-card rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Cambiar Estado</h2>
                    <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Estado actual:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {statusLabels[order.status] || order.status}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {transitions.map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setData('status', status)}
                                className={`w-full px-4 py-3 rounded-lg border text-left transition-colors ${
                                    data.status === status
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:bg-muted'
                                }`}
                            >
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                    {statusLabels[status] || status}
                                </span>
                            </button>
                        ))}
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
                            disabled={processing || !data.status}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Actualizando...' : (
                                <>
                                    <Check className="w-4 h-4" />
                                    Confirmar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
