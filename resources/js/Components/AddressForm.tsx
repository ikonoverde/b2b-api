import TextInput from '@/Components/TextInput';

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

export default function AddressForm({ data, errors, disabled, onFieldChange }: AddressFormProps) {
    return (
        <div className="flex flex-col gap-10">
            <fieldset className="flex flex-col gap-6">
                <legend className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Contacto
                </legend>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <TextInput
                        id="name"
                        label="Nombre completo"
                        value={data.name}
                        onChange={(e) => onFieldChange('name', e.target.value)}
                        error={errors.name}
                        disabled={disabled}
                        autoComplete="name"
                        required
                    />
                    <TextInput
                        id="phone"
                        label="Teléfono"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => onFieldChange('phone', e.target.value)}
                        error={errors.phone}
                        disabled={disabled}
                        autoComplete="tel"
                        inputMode="tel"
                    />
                </div>
            </fieldset>

            <fieldset className="flex flex-col gap-6">
                <legend className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase">
                    Dirección de envío
                </legend>
                <TextInput
                    id="address_line_1"
                    label="Calle y número"
                    value={data.address_line_1}
                    onChange={(e) => onFieldChange('address_line_1', e.target.value)}
                    error={errors.address_line_1}
                    disabled={disabled}
                    autoComplete="address-line1"
                    required
                />
                <TextInput
                    id="address_line_2"
                    label="Colonia"
                    value={data.address_line_2}
                    onChange={(e) => onFieldChange('address_line_2', e.target.value)}
                    error={errors.address_line_2}
                    disabled={disabled}
                    autoComplete="address-line2"
                    required
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_1fr_8rem]">
                    <TextInput
                        id="city"
                        label="Ciudad"
                        value={data.city}
                        onChange={(e) => onFieldChange('city', e.target.value)}
                        error={errors.city}
                        disabled={disabled}
                        autoComplete="address-level2"
                        required
                    />
                    <TextInput
                        id="state"
                        label="Estado"
                        value={data.state}
                        onChange={(e) => onFieldChange('state', e.target.value)}
                        error={errors.state}
                        disabled={disabled}
                        autoComplete="address-level1"
                        required
                    />
                    <TextInput
                        id="postal_code"
                        label="C.P."
                        value={data.postal_code}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                            onFieldChange('postal_code', value);
                        }}
                        error={errors.postal_code}
                        disabled={disabled}
                        autoComplete="postal-code"
                        inputMode="numeric"
                        required
                    />
                </div>
            </fieldset>
        </div>
    );
}
