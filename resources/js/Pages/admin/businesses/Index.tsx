import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Play,
    Loader2,
    Star,
    ExternalLink,
    MapPin,
} from 'lucide-react';
import { useState, FormEvent } from 'react';
import type { PageProps, BusinessItem, BusinessScrapeRun } from '@/types';

interface PaginatedBusinesses {
    data: BusinessItem[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props extends PageProps {
    businesses: PaginatedBusinesses;
    latestRun: BusinessScrapeRun | null;
    activeRun: BusinessScrapeRun | null;
    filters: { search?: string };
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    running: 'En progreso',
    collecting: 'Recopilando datos',
    completed: 'Completado',
    failed: 'Error',
};

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    collecting: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
};

function ActiveRunBanner({ run }: { run: BusinessScrapeRun }) {
    return (
        <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 border border-blue-200 rounded-xl">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div className="flex flex-col">
                <span className="text-sm font-medium text-blue-900 font-[Outfit]">
                    Scrape en progreso
                </span>
                <span className="text-xs text-blue-600 font-[Outfit]">
                    Estado: {statusLabels[run.status] || run.status} &middot; {run.search_terms} &middot; {run.location}
                </span>
            </div>
        </div>
    );
}

function LastRunInfo({ run }: { run: BusinessScrapeRun }) {
    const date = run.completed_at
        ? new Date(run.completed_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : null;

    return (
        <div className="flex items-center gap-6 px-5 py-3 bg-[#FBF9F7] border border-[#E5E5E5] rounded-xl">
            <div className="flex flex-col">
                <span className="text-xs text-[#999999] font-[Outfit]">Ultimo scrape</span>
                <span className="text-sm text-[#1A1A1A] font-[Outfit]">{date || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-[#999999] font-[Outfit]">Encontrados</span>
                <span className="text-sm text-[#1A1A1A] font-[Outfit]">{run.total_found}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-[#999999] font-[Outfit]">Nuevos</span>
                <span className="text-sm text-[#1A1A1A] font-[Outfit]">{run.total_imported}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-[#999999] font-[Outfit]">Actualizados</span>
                <span className="text-sm text-[#1A1A1A] font-[Outfit]">{run.total_updated}</span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[run.status] || 'bg-gray-100 text-gray-800'}`}>
                {statusLabels[run.status] || run.status}
            </span>
            {run.error_message && (
                <span className="text-xs text-red-600 font-[Outfit] truncate max-w-xs" title={run.error_message}>
                    {run.error_message}
                </span>
            )}
        </div>
    );
}

function SearchBar({ filters }: { filters: { search?: string } }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/businesses', { search }, { preserveState: true });
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, categoria, direccion..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-[#FBF9F7] rounded-lg border border-[#E5E5E5] text-sm font-[Outfit] outline-none focus:border-[#4A5D4A] transition-colors"
                />
            </div>
            <button
                type="submit"
                className="h-10 px-4 bg-[#4A5D4A] rounded-lg text-sm font-medium text-white font-[Outfit] hover:bg-[#3d4d3d] transition-colors"
            >
                Buscar
            </button>
        </form>
    );
}

function BusinessRow({ business }: { business: BusinessItem }) {
    return (
        <tr className="border-b border-[#E5E5E5] hover:bg-gray-50">
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                        {business.name}
                    </span>
                    {business.google_maps_url && (
                        <a
                            href={business.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-[#4A5D4A] hover:underline font-[Outfit]"
                        >
                            <MapPin className="w-3 h-3" />
                            Ver en Maps
                        </a>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-[#666666] font-[Outfit]">
                    {business.category_name || '-'}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-[#666666] font-[Outfit] line-clamp-2">
                    {business.address || '-'}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-[#666666] font-[Outfit]">
                    {business.phone || '-'}
                </span>
            </td>
            <td className="px-6 py-4">
                {business.rating !== null ? (
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                            {Number(business.rating).toFixed(1)}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-[#999999] font-[Outfit]">-</span>
                )}
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-[#666666] font-[Outfit]">
                    {business.reviews_count}
                </span>
            </td>
            <td className="px-6 py-4">
                {business.website && (
                    <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#4A5D4A] hover:underline font-[Outfit]"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Sitio
                    </a>
                )}
            </td>
        </tr>
    );
}

function Pagination({ businesses }: { businesses: PaginatedBusinesses }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
            <span className="text-sm text-[#666666] font-[Outfit]">
                Mostrando {businesses.from} a {businesses.to} de {businesses.total} negocios
            </span>
            <div className="flex items-center gap-2">
                <Link
                    href={`?page=${businesses.current_page - 1}`}
                    className={`p-2 rounded-lg border border-[#E5E5E5] ${
                        businesses.current_page === 1
                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                            : 'hover:bg-gray-50'
                    }`}
                    preserveScroll
                >
                    <ChevronLeft className="w-4 h-4 text-[#666666]" />
                </Link>
                <span className="text-sm text-[#1A1A1A] font-[Outfit]">
                    {businesses.current_page} / {businesses.last_page}
                </span>
                <Link
                    href={`?page=${businesses.current_page + 1}`}
                    className={`p-2 rounded-lg border border-[#E5E5E5] ${
                        businesses.current_page === businesses.last_page
                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                            : 'hover:bg-gray-50'
                    }`}
                    preserveScroll
                >
                    <ChevronRight className="w-4 h-4 text-[#666666]" />
                </Link>
            </div>
        </div>
    );
}

export default function BusinessesIndex() {
    const { businesses, latestRun, activeRun, filters, flash } = usePage<Props>().props;
    const [scraping, setScraping] = useState(false);

    const handleStartScrape = () => {
        setScraping(true);
        router.post('/admin/businesses/scrape', {}, {
            preserveState: true,
            onFinish: () => setScraping(false),
        });
    };

    return (
        <AppLayout title="Negocios" active="businesses">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-[28px] font-semibold text-[#1A1A1A] font-[Outfit]">
                            Negocios
                        </h1>
                        <p className="text-sm text-[#666666] font-[Outfit]">
                            Negocios de spa y masajes en Merida, Yucatan
                        </p>
                    </div>
                    <button
                        onClick={handleStartScrape}
                        disabled={scraping || !!activeRun}
                        className={`flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-white font-[Outfit] transition-colors ${
                            scraping || activeRun
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#4A5D4A] hover:bg-[#3d4d3d] cursor-pointer'
                        }`}
                    >
                        {scraping ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Play className="w-4 h-4" />
                        )}
                        Iniciar Scrape
                    </button>
                </div>

                {flash.success && (
                    <div className="px-5 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 font-[Outfit]">
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="px-5 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 font-[Outfit]">
                        {flash.error}
                    </div>
                )}

                {activeRun && <ActiveRunBanner run={activeRun} />}

                {latestRun && latestRun.status !== 'pending' && latestRun.status !== 'running' && latestRun.status !== 'collecting' && (
                    <LastRunInfo run={latestRun} />
                )}

                <SearchBar filters={filters} />

                <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E5E5]">
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-[#666666]">Nombre</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-[#666666]">Categoria</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-[#666666]">Direccion</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-[#666666]">Telefono</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-[#666666]">Rating</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-[#666666]">Reviews</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-[#666666]">Web</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {businesses.data.map((business) => (
                                <BusinessRow key={business.id} business={business} />
                            ))}
                        </tbody>
                    </table>

                    {businesses.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-[#666666] font-[Outfit]">
                                No hay negocios registrados. Inicia un scrape para importar datos.
                            </p>
                        </div>
                    )}

                    {businesses.last_page > 1 && (
                        <Pagination businesses={businesses} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
