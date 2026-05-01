import { Check } from 'lucide-react';

interface CheckoutStepIndicatorProps {
    currentStep: 1 | 2 | 3;
}

const STEPS = [
    { label: 'Envío', step: 1 },
    { label: 'Pago', step: 2 },
    { label: 'Confirmación', step: 3 },
] as const;

export default function CheckoutStepIndicator({ currentStep }: CheckoutStepIndicatorProps) {
    return (
        <ol
            aria-label="Progreso de la compra"
            className="flex items-stretch border-y border-[var(--iko-stone-hairline)]"
        >
            {STEPS.map(({ label, step }, index) => {
                const isCompleted = currentStep > step;
                const isActive = currentStep === step;
                const status = isCompleted ? 'completed' : isActive ? 'active' : 'pending';

                return (
                    <li
                        key={step}
                        className={`flex flex-1 items-center gap-3 py-4 ${
                            index === 0 ? '' : 'border-l border-[var(--iko-stone-hairline)] pl-5'
                        } pr-5`}
                        aria-current={isActive ? 'step' : undefined}
                    >
                        <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center border ${
                                status === 'completed'
                                    ? 'border-[var(--iko-accent)] bg-[var(--iko-accent)] text-[var(--iko-accent-on)]'
                                    : status === 'active'
                                    ? 'border-[var(--iko-accent)] text-[var(--iko-accent)]'
                                    : 'border-[var(--iko-stone-hairline)] text-[var(--iko-stone-mid)]'
                            }`}
                        >
                            {status === 'completed' ? (
                                <Check className="h-3.5 w-3.5" strokeWidth={2} />
                            ) : (
                                <span className="font-spec text-[11px] tabular-nums">
                                    {String(step).padStart(2, '0')}
                                </span>
                            )}
                        </span>
                        <span className="flex flex-col gap-0.5">
                            <span
                                className={`font-spec text-[10px] tracking-[0.08em] uppercase ${
                                    status === 'pending'
                                        ? 'text-[var(--iko-stone-mid)]'
                                        : 'text-[var(--iko-stone-whisper)]'
                                }`}
                            >
                                Paso {step}
                            </span>
                            <span
                                className={`text-[13px] ${
                                    status === 'active'
                                        ? 'text-[var(--iko-stone-ink)]'
                                        : status === 'completed'
                                        ? 'text-[var(--iko-stone-ink)]'
                                        : 'text-[var(--iko-stone-whisper)]'
                                }`}
                            >
                                {label}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
