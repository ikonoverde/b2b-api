import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Download,
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
    pending: 'bg-muted text-muted-foreground',
    running: 'bg-accent text-accent-foreground',
    collecting: 'bg-accent text-accent-foreground',
    completed: 'bg-primary/10 text-primary',
    failed: 'bg-destructive/10 text-destructive',
};

function ActiveRunBanner({ run }: { run: BusinessScrapeRun }) {
    return (
        <div className="flex items-center gap-3 px-5 py-3 bg-accent border border-border rounded-xl">
            <Loader2 className="w-5 h-5 text-accent-foreground animate-spin" />
            <div className="flex flex-col">
                <span className="text-sm font-medium text-accent-foreground">
                    Scrape en progreso
                </span>
                <span className="text-xs text-accent-foreground">
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
        <div className="flex items-center gap-6 px-5 py-3 bg-background border border-border rounded-xl">
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Ultimo scrape</span>
                <span className="text-sm text-foreground">{date || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Encontrados</span>
                <span className="text-sm text-foreground">{run.total_found}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Nuevos</span>
                <span className="text-sm text-foreground">{run.total_imported}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Actualizados</span>
                <span className="text-sm text-foreground">{run.total_updated}</span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[run.status] || 'bg-muted text-foreground'}`}>
                {statusLabels[run.status] || run.status}
            </span>
            {run.error_message && (
                <span className="text-xs text-destructive truncate max-w-xs" title={run.error_message}>
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, categoria, direccion..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-background rounded-lg border border-border text-sm outline-none focus:border-primary transition-colors"
                />
            </div>
            <button
                type="submit"
                className="h-10 px-4 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary transition-colors"
            >
                Buscar
            </button>
        </form>
    );
}

function BusinessRow({ business }: { business: BusinessItem }) {
    return (
        <tr className="border-b border-border hover:bg-muted">
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                        {business.name}
                    </span>
                    {business.google_maps_url && (
                        <a
                            href={business.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                            <MapPin className="w-3 h-3" />
                            Ver en Maps
                        </a>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                    {business.category_name || '-'}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground line-clamp-2">
                    {business.address || '-'}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                    {business.phone || '-'}
                </span>
            </td>
            <td className="px-6 py-4">
                {business.rating !== null ? (
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-muted-foreground fill-yellow-500" />
                        <span className="text-sm font-medium text-foreground">
                            {Number(business.rating).toFixed(1)}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                )}
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">
                    {business.reviews_count}
                </span>
            </td>
            <td className="px-6 py-4">
                {business.website && (
                    <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
                Mostrando {businesses.from} a {businesses.to} de {businesses.total} negocios
            </span>
            <div className="flex items-center gap-2">
                <Link
                    href={`?page=${businesses.current_page - 1}`}
                    className={`p-2 rounded-lg border border-border ${
                        businesses.current_page === 1
                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                            : 'hover:bg-muted'
                    }`}
                    preserveScroll
                >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </Link>
                <span className="text-sm text-foreground">
                    {businesses.current_page} / {businesses.last_page}
                </span>
                <Link
                    href={`?page=${businesses.current_page + 1}`}
                    className={`p-2 rounded-lg border border-border ${
                        businesses.current_page === businesses.last_page
                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                            : 'hover:bg-muted'
                    }`}
                    preserveScroll
                >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
            </div>
        </div>
    );
}

export default function BusinessesIndex() {
    const { businesses, latestRun, activeRun, filters, flash } = usePage<Props>().props;
    const [scraping, setScraping] = useState(false);
    const exportUrl = filters.search
        ? `/admin/businesses/export?${new URLSearchParams({ search: filters.search }).toString()}`
        : '/admin/businesses/export';

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
                        <h1 className="text-[28px] font-semibold text-foreground">
                            Negocios
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Negocios de spa y masajes en Merida, Yucatan
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={exportUrl}
                            className="flex items-center gap-2 h-10 px-5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-background transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Exportar Meta CSV
                        </a>
                        <button
                            onClick={handleStartScrape}
                            disabled={scraping || !!activeRun}
                            className={`flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-medium text-white transition-colors ${
                                scraping || activeRun
                                    ? 'bg-muted-foreground cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary cursor-pointer'
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
                </div>

                {flash.success && (
                    <div className="px-5 py-3 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary">
                        {flash.success}
                    </div>
                )}

                {flash.error && (
                    <div className="px-5 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                        {flash.error}
                    </div>
                )}

                {activeRun && <ActiveRunBanner run={activeRun} />}

                {latestRun && latestRun.status !== 'pending' && latestRun.status !== 'running' && latestRun.status !== 'collecting' && (
                    <LastRunInfo run={latestRun} />
                )}

                <SearchBar filters={filters} />

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Nombre</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Categoria</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Direccion</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Telefono</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Rating</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Reviews</span>
                                </th>
                                <th className="text-left px-6 py-4">
                                    <span className="text-sm font-medium text-muted-foreground">Web</span>
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
                            <p className="text-sm text-muted-foreground">
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
