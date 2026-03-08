import { Check } from 'lucide-react';

interface CheckoutStepIndicatorProps {
    currentStep: 1 | 2 | 3;
}

const steps = [
    { label: 'Envío', step: 1 },
    { label: 'Pago', step: 2 },
    { label: 'Confirmación', step: 3 },
] as const;

export default function CheckoutStepIndicator({ currentStep }: CheckoutStepIndicatorProps) {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map(({ label, step }, index) => {
                const isCompleted = currentStep > step;
                const isActive = currentStep === step;

                return (
                    <div key={step} className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold font-[Outfit] ${
                                    isCompleted
                                        ? 'bg-[#5E7052] text-white'
                                        : isActive
                                          ? 'bg-[#5E7052] text-white'
                                          : 'bg-[#E5E5E5] text-[#999999]'
                                }`}
                            >
                                {isCompleted ? <Check className="h-4 w-4" /> : step}
                            </div>
                            <span
                                className={`text-sm font-[Outfit] hidden sm:inline ${
                                    isActive ? 'font-semibold text-[#1A1A1A]' : 'text-[#999999]'
                                }`}
                            >
                                {label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`h-px w-8 sm:w-12 ${
                                    currentStep > step ? 'bg-[#5E7052]' : 'bg-[#E5E5E5]'
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
