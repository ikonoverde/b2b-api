import IkonoverdeMark from '@/Components/IkonoverdeMark';

/**
 * Ikonoverde wordmark lockup: brand mark + typeset wordmark.
 *
 * The mark and the literal "verde" of the wordmark are the only places
 * green ever appears in the system (Verde-In-Wordmark Rule, DESIGN.md §2).
 *
 * Sizes are driven by the `size` prop so the lockup keeps a stable optical
 * relationship between the mark and the type at every scale.
 */
export default function Wordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const dims = SIZE_MAP[size];

    return (
        <span className="inline-flex items-center gap-2.5" aria-label="Ikonoverde">
            <IkonoverdeMark
                style={{ width: dims.mark, height: dims.mark }}
                className="text-[var(--iko-verde)] shrink-0"
            />
            <span
                className="font-display leading-none tracking-[-0.01em]"
                style={{ fontSize: dims.text }}
            >
                <span className="text-[var(--iko-stone-ink)]">Ikono</span>
                <span className="text-[var(--iko-verde)]">verde</span>
            </span>
        </span>
    );
}

const SIZE_MAP = {
    sm: { mark: '16px', text: '16px' },
    md: { mark: '22px', text: '22px' },
    lg: { mark: '32px', text: '32px' },
} as const;
