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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">Cambiar Estado</h2>
                    <button onClick={onClose} className="p-1.5 text-[#999999] hover:text-[#666666] hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm font-[Outfit]">
                        <span className="text-[#999999]">Estado actual:</span>
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
                                        ? 'border-[#4A5D4A] bg-[#4A5D4A]/5'
                                        : 'border-[#E5E5E5] hover:bg-gray-50'
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
                            className="px-5 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.status}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50"
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
