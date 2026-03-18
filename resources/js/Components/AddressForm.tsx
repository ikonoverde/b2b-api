import type { ChangeEvent } from 'react';

interface AddressFormData {
    name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
}

interface AddressFormProps {
    data: AddressFormData;
    errors: Partial<Record<keyof AddressFormData, string>>;
    disabled: boolean;
    onFieldChange: (field: keyof AddressFormData, value: string) => void;
}

interface FloatingInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    hasError?: boolean;
}

function FloatingInput({ id, label, type = 'text', value, onChange, disabled, hasError }: FloatingInputProps) {
    return (
        <div className="relative">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder=" "
                className={`peer w-full h-[52px] pt-5 pb-1.5 px-3 bg-transparent text-[15px] placeholder-transparent focus:outline-none disabled:text-[#8e8e93] font-body ${
                    hasError ? 'text-stripe-error' : 'text-stripe-text'
                }`}
            />
            <label
                htmlFor={id}
                className={`absolute left-3 pointer-events-none transition-all duration-150 font-body
                    peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-[15px]
                    peer-focus:top-[6px] peer-focus:text-[11px]
                    top-[6px] text-[11px]
                    ${
                        hasError
                            ? 'text-stripe-error peer-placeholder-shown:text-stripe-error peer-focus:text-stripe-error'
                            : 'text-stripe-muted peer-focus:text-primary'
                    }`}
            >
                {label}
            </label>
        </div>
    );
}

function FieldRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={`focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-primary focus-within:rounded-[3px] ${className}`}
        >
            {children}
        </div>
    );
}

function ErrorList({ errors }: { errors: (string | undefined)[] }) {
    const filtered = errors.filter(Boolean) as string[];
    if (filtered.length === 0) return null;

    return (
        <div className="mt-1.5 flex flex-col gap-0.5">
            {filtered.map((err, i) => (
                <p key={i} className="text-[13px] text-stripe-error font-body">
                    {err}
                </p>
            ))}
        </div>
    );
}

export default function AddressForm({ data, errors, disabled, onFieldChange }: AddressFormProps) {
    return (
        <div className="flex flex-col gap-5">
            {/* Contact info group */}
            <div>
                <p className="text-[13px] font-medium text-stripe-text font-body mb-2">
                    Información de contacto
                </p>
                <div className="rounded-xl border border-stripe-border bg-white overflow-hidden shadow-[0_1px_1px_0_rgba(0,0,0,0.03)]">
                    <FieldRow>
                        <FloatingInput
                            id="name"
                            label="Nombre completo"
                            value={data.name}
                            onChange={(e) => onFieldChange('name', e.target.value)}
                            disabled={disabled}
                            hasError={!!errors.name}
                        />
                    </FieldRow>
                    <FieldRow className="border-t border-stripe-border">
                        <FloatingInput
                            id="phone"
                            label="Teléfono"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => onFieldChange('phone', e.target.value)}
                            disabled={disabled}
                            hasError={!!errors.phone}
                        />
                    </FieldRow>
                </div>
                <ErrorList errors={[errors.name, errors.phone]} />
            </div>

            {/* Address group */}
            <div>
                <p className="text-[13px] font-medium text-stripe-text font-body mb-2">Dirección de envío</p>
                <div className="rounded-xl border border-stripe-border bg-white overflow-hidden shadow-[0_1px_1px_0_rgba(0,0,0,0.03)]">
                    <FieldRow>
                        <FloatingInput
                            id="address_line_1"
                            label="Calle y número"
                            value={data.address_line_1}
                            onChange={(e) => onFieldChange('address_line_1', e.target.value)}
                            disabled={disabled}
                            hasError={!!errors.address_line_1}
                        />
                    </FieldRow>
                    <FieldRow className="border-t border-stripe-border">
                        <FloatingInput
                            id="address_line_2"
                            label="Colonia"
                            value={data.address_line_2}
                            onChange={(e) => onFieldChange('address_line_2', e.target.value)}
                            disabled={disabled}
                            hasError={!!errors.address_line_2}
                        />
                    </FieldRow>
                    <div className="grid grid-cols-2 divide-x divide-stripe-border border-t border-stripe-border">
                        <FieldRow>
                            <FloatingInput
                                id="city"
                                label="Ciudad"
                                value={data.city}
                                onChange={(e) => onFieldChange('city', e.target.value)}
                                disabled={disabled}
                                hasError={!!errors.city}
                            />
                        </FieldRow>
                        <FieldRow>
                            <FloatingInput
                                id="state"
                                label="Estado"
                                value={data.state}
                                onChange={(e) => onFieldChange('state', e.target.value)}
                                disabled={disabled}
                                hasError={!!errors.state}
                            />
                        </FieldRow>
                    </div>
                    <FieldRow className="border-t border-stripe-border">
                        <FloatingInput
                            id="postal_code"
                            label="Código postal"
                            value={data.postal_code}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                                onFieldChange('postal_code', value);
                            }}
                            disabled={disabled}
                            hasError={!!errors.postal_code}
                        />
                    </FieldRow>
                </div>
                <ErrorList
                    errors={[
                        errors.address_line_1,
                        errors.address_line_2,
                        errors.city,
                        errors.state,
                        errors.postal_code,
                    ]}
                />
            </div>
        </div>
    );
}
