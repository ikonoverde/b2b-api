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
                <h1 className="text-[28px] font-semibold text-foreground">
                    {title}
                </h1>
                <div className="flex items-center gap-2 text-sm">
                    <Link
                        href="/admin/products"
                        className="text-muted-foreground hover:text-muted-foreground transition-colors"
                    >
                        Productos
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{breadcrumbLabel}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/admin/products"
                    className="flex items-center justify-center px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors disabled:opacity-50"
                >
                    <Save className="w-[18px] h-[18px]" />
                    {submitLabel}
                </button>
            </div>
        </div>
    );
}
