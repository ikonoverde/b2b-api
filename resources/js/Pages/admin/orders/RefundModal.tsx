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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">Procesar Reembolso</h2>
                    <button onClick={onClose} className="p-1.5 text-[#999999] hover:text-[#666666] hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-sm text-amber-800 font-[Outfit]">
                            Esta accion procesara un reembolso a traves de Stripe y no se puede deshacer.
                        </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                            Monto (max: {formatCurrency(remaining)})
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            max={remaining}
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="h-10 px-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                        />
                        {errors.amount && (
                            <span className="text-xs text-red-500 font-[Outfit]">{errors.amount}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">Razon (opcional)</label>
                        <textarea
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            rows={2}
                            placeholder="Motivo del reembolso..."
                            className="px-4 py-3 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors resize-none"
                        />
                        {errors.reason && (
                            <span className="text-xs text-red-500 font-[Outfit]">{errors.reason}</span>
                        )}
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
                            disabled={processing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-red-700 transition-colors disabled:opacity-50"
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
