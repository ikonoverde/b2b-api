import type { AdminOrder } from '@/types';
import { statusLabels, getStatusColor, formatDate } from './helpers';

export default function StatusHistoryTimeline({ order }: { order: AdminOrder }) {
    if (order.status_histories.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E5E5]">
                <h2 className="text-lg font-semibold text-[#1A1A1A] font-[Outfit]">Historial de Estado</h2>
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {order.status_histories.map((entry) => (
                        <div key={entry.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#4A5D4A] mt-1.5" />
                                <div className="w-px flex-1 bg-[#E5E5E5]" />
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {entry.from_status && (
                                        <>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.from_status)}`}>
                                                {statusLabels[entry.from_status] || entry.from_status}
                                            </span>
                                            <span className="text-xs text-[#999999]">&rarr;</span>
                                        </>
                                    )}
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.to_status)}`}>
                                        {statusLabels[entry.to_status] || entry.to_status}
                                    </span>
                                </div>
                                {entry.note && (
                                    <p className="text-sm text-[#666666] font-[Outfit] mt-1">{entry.note}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-[#999999] font-[Outfit]">{formatDate(entry.created_at)}</span>
                                    {entry.admin_name && (
                                        <span className="text-xs text-[#999999] font-[Outfit]">por {entry.admin_name}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
