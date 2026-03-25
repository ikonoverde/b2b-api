import { useEffect, useRef, useState } from 'react';
import type { Address } from '@/types';

type FormData = {
    name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    quote_id: string;
    rate_id: string;
};

interface UseSavedAddressOptions {
    addresses: Address[];
    setFormData: (data: FormData) => void;
    resetForm: () => void;
    onAddressReady?: (data: FormData) => void;
}

function addressToFormData(address: Address): FormData {
    return {
        name: address.name,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 ?? '',
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        phone: address.phone ?? '',
        quote_id: '',
        rate_id: '',
    };
}

export default function useSavedAddress({
    addresses,
    setFormData,
    resetForm,
    onAddressReady,
}: UseSavedAddressOptions) {
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const initialized = useRef(false);

    function selectAddress(address: Address) {
        const data = addressToFormData(address);
        setFormData(data);
        setSelectedAddressId(address.id);
        onAddressReady?.(data);
    }

    function clearSelection() {
        setSelectedAddressId(null);
        resetForm();
    }

    useEffect(() => {
        if (initialized.current || addresses.length === 0) {
            return;
        }
        initialized.current = true;
        const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];
        selectAddress(defaultAddress);
    }, [addresses]);

    return { selectedAddressId, selectAddress, clearSelection };
}
