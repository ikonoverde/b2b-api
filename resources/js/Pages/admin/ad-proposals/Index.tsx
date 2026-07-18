import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import type { AdProposalListItem, PageProps } from '@/types';
import { platformLabels, statusLabels, formatBudget, formatDate } from './helpers';
import PlatformBadge from './PlatformBadge';

interface PaginatedProposals {
    data: AdProposalListItem[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface Props extends PageProps {
    proposals: PaginatedProposals;
    filters: {
        search?: string;
        platform?: string;
        status?: string;
    };
}

function buildPageUrl(page: number, filters: Props['filters']) {
    const params = new URLSearchParams();

    params.set('page', String(page));

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        }
    });

    return `/admin/ad-proposals?${params.toString()}`;
}

function SearchAndFilters({ filters }: { filters: Props['filters'] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [platform, setPlatform] = useState(filters.platform || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        router.get(
            '/admin/ad-proposals',
            { search, platform, status },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar nombre, objetivo u oferta..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
                />
            </div>
            <select
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            >
                <option value="">Todas las plataformas</option>
                {Object.entries(platformLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            >
                <option value="">Todos los estados</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
            <button
                type="submit"
                className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary"
            >
                Filtrar
            </button>
        </form>
    );
}

function ProposalRow({ proposal }: { proposal: AdProposalListItem }) {
    return (
        <tr className="border-b border-border hover:bg-muted">
            <td className="px-6 py-4">
                <Link
                    href={`/admin/ad-proposals/${proposal.id}`}
                    className="flex flex-col gap-1"
                >
                    <span className="text-sm font-medium text-foreground hover:underline">
                        {proposal.name}
                    </span>
                    {proposal.created_by_agent && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Sparkles className="h-3 w-3" />
                            Generado por agente
                        </span>
                    )}
                </Link>
            </td>
            <td className="px-6 py-4">
                <PlatformBadge platform={proposal.platform} />
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">{proposal.objective}</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-foreground">
                    {formatBudget(proposal.budget_amount, proposal.currency, proposal.budget_period)}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {statusLabels[proposal.status] ?? proposal.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">{formatDate(proposal.created_at)}</span>
            </td>
        </tr>
    );
}

function Pagination({ proposals, filters }: { proposals: PaginatedProposals; filters: Props['filters'] }) {
    return (
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <span className="text-sm text-muted-foreground">
                Mostrando {proposals.from} a {proposals.to} de {proposals.total} propuestas
            </span>
            <div className="flex items-center gap-2">
                <Link
                    href={buildPageUrl(proposals.current_page - 1, filters)}
                    className={`rounded-lg border border-border p-2 ${
                        proposals.current_page === 1
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-muted'
                    }`}
                    preserveScroll
                >
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </Link>
                <span className="text-sm text-foreground">
                    {proposals.current_page} / {proposals.last_page}
                </span>
                <Link
                    href={buildPageUrl(proposals.current_page + 1, filters)}
                    className={`rounded-lg border border-border p-2 ${
                        proposals.current_page === proposals.last_page
                            ? 'pointer-events-none cursor-not-allowed opacity-50'
                            : 'hover:bg-muted'
                    }`}
                    preserveScroll
                >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
            </div>
        </div>
    );
}

export default function AdProposalsIndex() {
    const { proposals, filters } = usePage<Props>().props;

    return (
        <AppLayout title="Propuestas de anuncios" active="ad-proposals">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[28px] font-semibold text-foreground">
                        Propuestas de anuncios
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Borradores internos para Google Ads y Meta Ads. Nada se publica en las plataformas.
                    </p>
                </div>

                <SearchAndFilters filters={filters} />

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-border">
                                    {['Propuesta', 'Plataforma', 'Objetivo', 'Presupuesto', 'Estado', 'Creada'].map(
                                        (heading) => (
                                            <th key={heading} className="px-6 py-4 text-left">
                                                <span className="text-sm font-medium text-muted-foreground">{heading}</span>
                                            </th>
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {proposals.data.map((proposal) => (
                                    <ProposalRow key={proposal.id} proposal={proposal} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {proposals.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-sm text-muted-foreground">
                                No hay propuestas de anuncios con estos filtros.
                            </p>
                        </div>
                    )}

                    {proposals.last_page > 1 && <Pagination proposals={proposals} filters={filters} />}
                </div>
            </div>
        </AppLayout>
    );
}
