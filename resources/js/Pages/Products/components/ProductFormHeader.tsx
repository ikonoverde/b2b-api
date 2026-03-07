import { Link } from '@inertiajs/react';
import { Save } from 'lucide-react';

export default function ProductFormHeader({
    title,
    breadcrumbLabel,
    submitLabel,
    processing,
}: {
    title: string;
    breadcrumbLabel: string;
    submitLabel: string;
    processing: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <h1 className="text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]">
                    {title}
                </h1>
                <div className="flex items-center gap-2 text-sm font-[Outfit]">
                    <Link
                        href="/admin/products"
                        className="text-[#999999] hover:text-[#666666] transition-colors"
                    >
                        Productos
                    </Link>
                    <span className="text-[#999999]">/</span>
                    <span className="text-[#666666]">{breadcrumbLabel}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/admin/products"
                    className="flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#E5E5E5] text-sm font-medium text-[#1A1A1A] font-[Outfit] hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50"
                >
                    <Save className="w-[18px] h-[18px]" />
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}
