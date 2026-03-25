import { Home, Plus, Star } from 'lucide-react';
import type { Address } from '@/types';

interface SavedAddressSelectorProps {
    addresses: Address[];
    selectedAddressId: number | null;
    onSelect: (address: Address) => void;
    onNewAddress: () => void;
}

function SelectableAddressCard({
    address,
    selected,
    onSelect,
}: {
    address: Address;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex items-start gap-3 rounded-xl bg-white p-4 border text-left w-full transition-colors ${
                selected
                    ? 'border-[#5E7052] ring-1 ring-[#5E7052]'
                    : 'border-[#E5E5E5] hover:border-[#5E7052]/40'
            }`}
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5E7052]/10 flex-shrink-0 mt-0.5">
                <Home className="h-4 w-4 text-[#5E7052]" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">{address.label}</p>
                    {address.is_default && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#5E7052] font-[Outfit]">
                            <Star className="h-3 w-3 fill-current" />
                            Predeterminada
                        </span>
                    )}
                </div>
                <p className="text-sm text-[#1A1A1A] font-[Outfit]">{address.name}</p>
                <p className="text-sm text-[#666666] font-[Outfit]">
                    {address.address_line_1}
                    {address.address_line_2 && `, ${address.address_line_2}`}
                </p>
                <p className="text-sm text-[#666666] font-[Outfit]">
                    {address.city}, {address.state} {address.postal_code}
                </p>
                {address.phone && (
                    <p className="text-xs text-[#999999] font-[Outfit] mt-1">Tel: {address.phone}</p>
                )}
            </div>
        </button>
    );
}

export default function SavedAddressSelector({
    addresses,
    selectedAddressId,
    onSelect,
    onNewAddress,
}: SavedAddressSelectorProps) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-[13px] font-medium text-stripe-text font-body">
                Direcciones guardadas
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((address) => (
                    <SelectableAddressCard
                        key={address.id}
                        address={address}
                        selected={selectedAddressId === address.id}
                        onSelect={() => onSelect(address)}
                    />
                ))}

                <button
                    type="button"
                    onClick={onNewAddress}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-sm font-medium transition-colors font-[Outfit] min-h-[88px] ${
                        selectedAddressId === null
                            ? 'border-[#5E7052] bg-[#5E7052]/10 text-[#5E7052]'
                            : 'border-[#E5E5E5] text-[#999999] hover:border-[#5E7052]/40 hover:text-[#5E7052]'
                    }`}
                >
                    <Plus className="h-5 w-5" />
                    Nueva dirección
                </button>
            </div>
        </div>
    );
}
