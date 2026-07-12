import { CircleSlash, Eye, Sigma } from 'lucide-react';
import type { MetricProvenance } from '@/types';
import {
    formatNumber,
    provenanceDescriptions,
    provenanceLabels,
    provenancePillClasses,
} from './helpers';

const provenanceIcons: Record<
    MetricProvenance,
    React.ComponentType<{ className?: string }>
> = {
    observed: Eye,
    estimated: Sigma,
    unknown: CircleSlash,
};

export function ProvenancePill({ provenance }: { provenance: MetricProvenance }) {
    const Icon = provenanceIcons[provenance] ?? CircleSlash;
    const label = provenanceLabels[provenance] ?? provenance;

    return (
        <span
            title={provenanceDescriptions[provenance]}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-[Outfit] text-xs font-medium ${
                provenancePillClasses[provenance] ?? provenancePillClasses.unknown
            }`}
        >
            <Icon className="h-3 w-3" />
            {label}
        </span>
    );
}

/**
 * The one place a headline number is rendered.
 *
 * Zero prints as a number, because zero is a measurement: somebody looked and there was nothing
 * there. Null prints as "sin dato" in words, because null is the absence of a measurement. An em
 * dash would collapse the two into the same grey mark and quietly undo the reason the column is
 * nullable in the first place.
 */
export function HeadlineValue({ value }: { value: number | null }) {
    if (value === null) {
        return (
            <span className="inline-flex items-center gap-1.5 font-[Outfit] text-xs text-[#999999]">
                <CircleSlash className="h-3 w-3" />
                Sin dato
            </span>
        );
    }

    return (
        <span className="font-mono text-sm tabular-nums text-[#1A1A1A]">
            {formatNumber(value)}
        </span>
    );
}
