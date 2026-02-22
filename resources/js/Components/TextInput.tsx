import type { LucideIcon } from 'lucide-react';
import type { ReactNode, ChangeEvent } from 'react';

interface TextInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    icon?: LucideIcon;
    className?: string;
    suffix?: ReactNode;
    autoFocus?: boolean;
    required?: boolean;
}

export default function TextInput({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    disabled,
    icon: Icon,
    className,
    suffix,
    autoFocus,
    required,
}: TextInputProps) {
    const hasIcon = !!Icon;
    const hasSuffix = !!suffix;

    const paddingClasses = hasIcon
        ? `pl-12 ${hasSuffix ? 'pr-12' : 'pr-4'}`
        : hasSuffix
            ? 'pl-4 pr-12'
            : 'px-4';

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full h-12 ${paddingClasses} rounded-lg border border-[#E5E5E5] bg-white text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#5E7052] focus:border-transparent font-[Outfit]${className ? ` ${className}` : ''}`}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    required={required}
                />
                {suffix}
            </div>
            {error && <span className="text-sm text-red-500 font-[Outfit]">{error}</span>}
        </div>
    );
}
