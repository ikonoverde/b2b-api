import { MapPin, Phone, User } from 'lucide-react';
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
        <>
            <TextInput
                id="name"
                label="Nombre de contacto"
                value={data.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                placeholder="Nombre completo"
                icon={User}
                disabled={disabled}
                error={errors.name}
            />

            <TextInput
                id="address_line_1"
                label="Dirección"
                value={data.address_line_1}
                onChange={(e) => onFieldChange('address_line_1', e.target.value)}
                placeholder="Calle y número"
                icon={MapPin}
                disabled={disabled}
                error={errors.address_line_1}
            />

            <TextInput
                id="address_line_2"
                label="Colonia"
                value={data.address_line_2}
                onChange={(e) => onFieldChange('address_line_2', e.target.value)}
                placeholder="Colonia"
                disabled={disabled}
                error={errors.address_line_2}
            />

            <div className="grid grid-cols-2 gap-4">
                <TextInput
                    id="city"
                    label="Ciudad"
                    value={data.city}
                    onChange={(e) => onFieldChange('city', e.target.value)}
                    placeholder="Ciudad"
                    disabled={disabled}
                    error={errors.city}
                />
                <TextInput
                    id="state"
                    label="Estado"
                    value={data.state}
                    onChange={(e) => onFieldChange('state', e.target.value)}
                    placeholder="Estado"
                    disabled={disabled}
                    error={errors.state}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <TextInput
                    id="postal_code"
                    label="Código Postal"
                    value={data.postal_code}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                        onFieldChange('postal_code', value);
                    }}
                    placeholder="00000"
                    disabled={disabled}
                    error={errors.postal_code}
                />
                <TextInput
                    id="phone"
                    label="Teléfono"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => onFieldChange('phone', e.target.value)}
                    placeholder="10 dígitos"
                    icon={Phone}
                    disabled={disabled}
                    error={errors.phone}
                />
            </div>
        </>
    );
}
