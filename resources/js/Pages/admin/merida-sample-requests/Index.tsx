import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Mail,
    Phone,
    Search,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import type { MeridaSampleRequestItem, PageProps } from '@/types';

interface PaginatedSampleRequests {
    data: MeridaSampleRequestItem[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props extends PageProps {
    sampleRequests: PaginatedSampleRequests;
    filters: {
        search?: string;
        status?: string;
    };
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    contacted: 'Contactado',
    approved: 'Aprobado',
    rejected: 'Rechazado',
};

function buildPageUrl(page: number, filters: Props['filters']) {
    const params = new URLSearchParams();

    params.set('page', String(page));

    if (filters.search) {
        params.set('search', filters.search);
    }

    if (filters.status) {
        params.set('status', filters.status);
    }

    return `/admin/sample-requests?${params.toString()}`;
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function SearchAndFilters({ filters }: { filters: Props['filters'] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            '/admin/sample-requests',
            { search, status },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
                <input
                    type="text"
                    placeholder="Buscar negocio, contacto, correo o telefono..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-10 w-full rounded-lg border border-[#E5E5E5] bg-[#FBF9F7] pl-10 pr-4 font-[Outfit] text-sm outline-none transition-colors focus:border-[#4A5D4A]"
                />
            </div>
            <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-lg border border-[#E5E5E5] bg-[#FBF9F7] px-3 font-[Outfit] text-sm text-[#1A1A1A] outline-none transition-colors focus:border-[#4A5D4A]"
            >
                <option value="">Todos los estados</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            <button
                type="submit"
                className="h-10 rounded-lg bg-[#4A5D4A] px-5 font-[Outfit] text-sm font-medium text-white transition-colors hover:bg-[#3d4d3d]"
            >
                Filtrar
            </button>
        </form>
    );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="font-[Outfit] text-[11px] font-medium text-[#999999]">{title}</span>
            <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                    <span
                        key={item}
                        className="rounded-full border border-[#E5E5E5] bg-[#FBF9F7] px-2 py-1 font-[Outfit] text-xs text-[#666666]"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

function SampleRequestRow({ sampleRequest }: { sampleRequest: MeridaSampleRequestItem }) {
    return (
        <tr className="border-b border-[#E5E5E5] align-top hover:bg-gray-50">
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                    <span className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">
                        {sampleRequest.business_name}
                    </span>
                    <span className="font-[Outfit] text-xs text-[#666666]">
                        {sampleRequest.business_type} · {sampleRequest.client_volume}
                    </span>
                    {sampleRequest.social_url && (
                        <a
                            href={sampleRequest.social_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-[Outfit] text-xs text-[#4A5D4A] hover:underline"
                        >
                            <ExternalLink className="h-3 w-3" />
                            Perfil social
                        </a>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1.5">
                    <span className="font-[Outfit] text-sm font-medium text-[#1A1A1A]">
                        {sampleRequest.contact_name}
                    </span>
                    <a
                        href={`mailto:${sampleRequest.email}`}
                        className="inline-flex items-center gap-1 font-[Outfit] text-xs text-[#666666] hover:text-[#1A1A1A]"
                    >
                        <Mail className="h-3 w-3" />
                        {sampleRequest.email}
                    </a>
                    {sampleRequest.phone && (
                        <a
                            href={`tel:${sampleRequest.phone}`}
                            className="inline-flex items-center gap-1 font-[Outfit] text-xs text-[#666666] hover:text-[#1A1A1A]"
                        >
                            <Phone className="h-3 w-3" />
                            {sampleRequest.phone}
                        </a>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex min-w-[260px] flex-col gap-3">
                    <DetailList title="Productos" items={sampleRequest.products_interested} />
                    <DetailList title="Busca mejorar" items={sampleRequest.improvement_goals} />
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-[#F5F3F0] px-2.5 py-1 font-[Outfit] text-xs font-medium text-[#666666]">
                    {statusLabels[sampleRequest.status] || sampleRequest.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                    <span className="font-[Outfit] text-sm text-[#666666]">
                        {formatDate(sampleRequest.created_at)}
                    </span>
                    {sampleRequest.user && (
                        <span className="font-[Outfit] text-xs text-[#999999]">
                            Usuario: {sampleRequest.user.name}
                        </span>
                    )}
                </div>
            </td>
        </tr>
    );
}

function Pagination({ sampleRequests, filters }: { sampleRequests: PaginatedSampleRequests; filters: Props['filters'] }) {
    return (
        <div className="flex items-center justify-between border-t border-[#E5E5E5] px-6 py-4">
            <span className="font-[Outfit] text-sm text-[#666666]">
                Mostrando {sampleRequests.from} a {sampleRequests.to} de {sampleRequests.total} solicitudes
            </span>
            <div className="flex items-center gap-2">
                <Link
                    href={buildPageUrl(sampleRequests.current_page - 1, filters)}
                    className={`rounded-lg border border-[#E5E5E5] p-2 ${
                        sampleRequests.current_page === 1
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-gray-50'
                    }`}
                    preserveScroll
                >
                    <ChevronLeft className="h-4 w-4 text-[#666666]" />
                </Link>
                <span className="font-[Outfit] text-sm text-[#1A1A1A]">
                    {sampleRequests.current_page} / {sampleRequests.last_page}
                </span>
                <Link
                    href={buildPageUrl(sampleRequests.current_page + 1, filters)}
                    className={`rounded-lg border border-[#E5E5E5] p-2 ${
                        sampleRequests.current_page === sampleRequests.last_page
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-gray-50'
                    }`}
                    preserveScroll
                >
                    <ChevronRight className="h-4 w-4 text-[#666666]" />
                </Link>
            </div>
        </div>
    );
}

export default function MeridaSampleRequestsIndex() {
    const { sampleRequests, filters } = usePage<Props>().props;

    return (
        <AppLayout title="Muestras gratis" active="sample-requests">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex flex-col gap-1">
                    <h1 className="font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]">
                        Muestras gratis
                    </h1>
                    <p className="font-[Outfit] text-sm text-[#666666]">
                        Negocios que solicitaron muestras gratuitas en Merida.
                    </p>
                </div>

                <SearchAndFilters filters={filters} />

                <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                            <thead>
                                <tr className="border-b border-[#E5E5E5]">
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-sm font-medium text-[#666666]">Negocio</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-sm font-medium text-[#666666]">Contacto</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-sm font-medium text-[#666666]">Interes</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-sm font-medium text-[#666666]">Estado</span>
                                    </th>
                                    <th className="px-6 py-4 text-left">
                                        <span className="text-sm font-medium text-[#666666]">Solicitado</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sampleRequests.data.map((sampleRequest) => (
                                    <SampleRequestRow key={sampleRequest.id} sampleRequest={sampleRequest} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {sampleRequests.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="font-[Outfit] text-sm text-[#666666]">
                                No hay solicitudes de muestras con estos filtros.
                            </p>
                        </div>
                    )}

                    {sampleRequests.last_page > 1 && (
                        <Pagination sampleRequests={sampleRequests} filters={filters} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
