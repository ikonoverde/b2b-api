import type { AdProposalListItem } from '@/types';
import { platformLabels } from './helpers';

export default function PlatformBadge({ platform }: { platform: AdProposalListItem['platform'] }) {
    const styles =
        platform === 'meta' ? 'bg-[#E7F0FE] text-[#1877F2]' : 'bg-[#FEF3E2] text-[#B06000]';

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 font-[Outfit] text-xs font-medium ${styles}`}>
            {platformLabels[platform] ?? platform}
        </span>
    );
}
