import { AlertTriangle, CheckCircle2, CircleSlash, Clock, HelpCircle } from 'lucide-react';
import type { SocialPostStatus } from '@/types';
import { statusDescriptions, statusLabels, statusPillClasses } from './helpers';

const statusIcons: Record<SocialPostStatus, React.ComponentType<{ className?: string }>> = {
    pending: Clock,
    publishing: HelpCircle,
    published: CheckCircle2,
    rejected: CircleSlash,
    failed: AlertTriangle,
};

/**
 * Status is carried by an icon and a word, never by color alone. The buyer-facing brand rule applies
 * just as well here: the difference between "published" and "we do not know if this published" is the
 * most consequential thing on the page, and it cannot depend on the reader distinguishing green from
 * amber.
 */
export function StatusPill({ status }: { status: SocialPostStatus }) {
    const Icon = statusIcons[status] ?? HelpCircle;

    return (
        <span
            title={statusDescriptions[status]}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusPillClasses[status]}`}
        >
            <Icon className="h-3 w-3" />
            {statusLabels[status]}
        </span>
    );
}
