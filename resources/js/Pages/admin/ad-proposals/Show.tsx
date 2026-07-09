import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import type { AdProposalDetail, AdProposalPreview, PageProps } from '@/types';
import GoogleAdPreview from './GoogleAdPreview';
import MetaAdPreview from './MetaAdPreview';
import { DetailCard } from './JsonDetails';
import PlatformBadge from './PlatformBadge';
import { formatBudget, formatDate, statusLabels } from './helpers';

interface Props extends PageProps {
    proposal: AdProposalDetail;
    preview: AdProposalPreview;
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="font-[Outfit] text-[11px] font-medium uppercase tracking-wide text-[#999999]">
                {label}
            </span>
            <span className="font-[Outfit] text-sm text-[#1A1A1A]">{value ?? '—'}</span>
        </div>
    );
}

function DateRange({ proposal }: { proposal: AdProposalDetail }) {
    if (!proposal.start_date && !proposal.end_date) {
        return <>Sin definir</>;
    }

    return (
        <>
            {proposal.start_date ? formatDate(proposal.start_date) : 'Sin inicio'} —{' '}
            {proposal.end_date ? formatDate(proposal.end_date) : 'Sin fin'}
        </>
    );
}

export default function AdProposalShow() {
    const { proposal, preview } = usePage<Props>().props;

    return (
        <AppLayout title={proposal.name} active="ad-proposals">
            <div className="flex flex-col gap-6 p-10 pr-12">
                <Link
                    href="/admin/ad-proposals"
                    className="flex w-fit items-center gap-2 font-[Outfit] text-sm text-[#666666] hover:text-[#1A1A1A]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Propuestas de anuncios
                </Link>

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-[Outfit] text-[28px] font-semibold text-[#1A1A1A]">
                            {proposal.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <PlatformBadge platform={proposal.platform} />
                            <span className="inline-flex rounded-full bg-[#F5F3F0] px-2.5 py-1 font-[Outfit] text-xs font-medium text-[#666666]">
                                {statusLabels[proposal.status] ?? proposal.status}
                            </span>
                            {proposal.created_by_agent && (
                                <span className="inline-flex items-center gap-1 font-[Outfit] text-xs text-[#999999]">
                                    <Sparkles className="h-3 w-3" />
                                    Generado por agente
                                </span>
                            )}
                        </div>
                    </div>

                    {proposal.landing_page_url && (
                        <a
                            href={proposal.landing_page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-4 py-2 font-[Outfit] text-sm text-[#4A5D4A] transition-colors hover:bg-gray-50"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Landing page
                        </a>
                    )}
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="flex flex-col gap-6">
                        <section className="flex flex-col gap-4">
                            <h2 className="font-[Outfit] text-sm font-semibold text-[#1A1A1A]">
                                Vista previa del anuncio
                            </h2>
                            {proposal.platform === 'meta' ? (
                                <MetaAdPreview creatives={preview.meta} brand={preview.brand} />
                            ) : (
                                <GoogleAdPreview creatives={preview.google} />
                            )}
                            <p className="font-[Outfit] text-xs text-[#999999]">
                                Simulación con fines internos. Las plataformas pueden recortar textos y rotar
                                combinaciones de forma distinta.
                            </p>
                        </section>

                        <DetailCard title="Estructura de campaña" value={proposal.campaign_structure} />
                        <DetailCard title="Grupos de anuncios" value={proposal.ad_groups} />
                        <DetailCard title="Palabras clave negativas" value={proposal.negative_keywords} />
                        <DetailCard title="Plan de medición" value={proposal.tracking_plan} />
                        <DetailCard title="Métricas de éxito" value={proposal.success_metrics} />
                        <DetailCard title="Supuestos" value={proposal.assumptions} />
                        <DetailCard title="Notas" value={proposal.notes} />
                    </div>

                    <aside className="flex flex-col gap-5 self-start rounded-xl border border-[#E5E5E5] bg-white p-6">
                        <SummaryRow label="Objetivo" value={proposal.objective} />
                        <SummaryRow
                            label="Presupuesto"
                            value={formatBudget(
                                proposal.budget_amount,
                                proposal.currency,
                                proposal.budget_period,
                            )}
                        />
                        <SummaryRow label="Periodo" value={<DateRange proposal={proposal} />} />
                        <SummaryRow label="Geografía" value={proposal.geography} />
                        <SummaryRow label="Audiencia" value={proposal.audience} />
                        <SummaryRow label="Oferta" value={proposal.offer} />
                        <SummaryRow label="Creada" value={formatDate(proposal.created_at)} />
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
