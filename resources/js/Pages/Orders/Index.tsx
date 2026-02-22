import { Link } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function OrdersIndex() {
    return (
        <CustomerLayout title="Mis Pedidos">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D4E5D0]">
                    <ClipboardList className="h-10 w-10 text-[#5E7052]" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-xl font-bold text-[#1A1A1A] font-[Outfit]">Próximamente</h1>
                    <p className="text-center text-sm text-[#999999] font-[Outfit]">
                        El historial de pedidos estará disponible pronto.
                    </p>
                </div>
                <div className="flex gap-3 pt-2">
                    <Link
                        href="/dashboard"
                        className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#5E7052] border border-[#E5E5E5] font-[Outfit] hover:bg-gray-50 transition-colors"
                    >
                        Ir al Inicio
                    </Link>
                    <Link
                        href="/catalog"
                        className="rounded-xl bg-[#5E7052] px-5 py-2.5 text-sm font-semibold text-white font-[Outfit] hover:bg-[#4d5e43] transition-colors"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </div>
        </CustomerLayout>
    );
}
