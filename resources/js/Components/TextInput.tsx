import type { ReactNode, ChangeEvent } from 'react';

interface TextInputProps {
    id: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'tel';
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    suffix?: ReactNode;
    autoFocus?: boolean;
    required?: boolean;
    readOnly?: boolean;
    autoComplete?: string;
    inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'none';
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
    suffix,
    autoFocus,
    required,
    readOnly,
    autoComplete,
    inputMode,
}: TextInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase"
            >
                {label}
                {required && (
                    <span aria-hidden="true" className="ml-1 opacity-50">*</span>
                )}
            </label>

            <div className="relative">
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full h-12 ${suffix ? 'pr-12' : ''} border-b border-[var(--iko-stone-hairline)] bg-transparent text-[var(--iko-stone-ink)] placeholder:text-[var(--iko-stone-whisper)] focus-visible:outline-none focus-visible:border-[var(--iko-accent)] disabled:opacity-50 font-sans text-[15px] transition-colors ${error ? 'border-[var(--iko-error)]' : ''}`}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    required={required}
                    readOnly={readOnly}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                {suffix}
            </div>

            {error && (
                <span
                    id={`${id}-error`}
                    className="flex items-center gap-1.5 font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]"
                >
                    <ErrorGlyph aria-hidden="true" />
                    {error}
                </span>
            )}
        </div>
    );
}

function ErrorGlyph() {
    return (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="6" cy="6" r="5.5" />
            <line x1="6" y1="3" x2="6" y2="7" strokeWidth="1.25" />
            <circle cx="6" cy="9" r="0.6" fill="currentColor" />
        </svg>
    );
}
