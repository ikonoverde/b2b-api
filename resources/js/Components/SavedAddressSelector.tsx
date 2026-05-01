import { Plus } from 'lucide-react';
import type { Address } from '@/types';

interface SavedAddressSelectorProps {
    addresses: Address[];
    selectedAddressId: number | null;
    onSelect: (address: Address) => void;
    onNewAddress: () => void;
}

export default function SavedAddressSelector({
    addresses,
    selectedAddressId,
    onSelect,
    onNewAddress,
}: SavedAddressSelectorProps) {
    return (
        <section aria-labelledby="saved-addresses-heading" className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between border-b border-[var(--iko-stone-hairline)] pb-2">
                <h3
                    id="saved-addresses-heading"
                    className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-accent)] uppercase"
                >
                    Direcciones guardadas
                </h3>
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {String(addresses.length).padStart(2, '0')} {addresses.length === 1 ? 'guardada' : 'guardadas'}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-px bg-[var(--iko-stone-hairline)] sm:grid-cols-2">
                {addresses.map((address) => (
                    <SelectableAddressRow
                        key={address.id}
                        address={address}
                        selected={selectedAddressId === address.id}
                        onSelect={() => onSelect(address)}
                    />
                ))}

                <button
                    type="button"
                    onClick={onNewAddress}
                    aria-pressed={selectedAddressId === null}
                    className={`flex items-center justify-center gap-2 bg-[var(--iko-stone-paper)] px-4 py-5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset ${
                        selectedAddressId === null
                            ? 'text-[var(--iko-accent)]'
                            : 'text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]'
                    }`}
                >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                    Nueva dirección
                </button>
            </div>
        </section>
    );
}

function SelectableAddressRow({
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
            aria-pressed={selected}
            className={`flex flex-col gap-1.5 bg-[var(--iko-stone-paper)] px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-inset ${
                selected
                    ? 'bg-[var(--iko-accent-soft)]'
                    : 'hover:bg-[var(--iko-stone-mid)]/15'
            }`}
        >
            <span className="flex items-baseline gap-3">
                <span
                    className={`font-spec text-[11px] tracking-[0.08em] uppercase ${
                        selected ? 'text-[var(--iko-accent)]' : 'text-[var(--iko-stone-whisper)]'
                    }`}
                >
                    {address.label}
                </span>
                {address.is_default && (
                    <span className="font-spec text-[10px] tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                        · Predeterminada
                    </span>
                )}
            </span>
            <span className="text-[14px] leading-snug text-[var(--iko-stone-ink)]">
                {address.name}
            </span>
            <span className="text-[13px] leading-[1.5] text-[var(--iko-stone-whisper)]">
                {address.address_line_1}
                {address.address_line_2 && `, ${address.address_line_2}`}
                <br />
                {address.city}, {address.state} {address.postal_code}
            </span>
            {address.phone && (
                <span className="font-spec text-[11px] tabular-nums tracking-[0.02em] text-[var(--iko-stone-whisper)]">
                    Tel · {address.phone}
                </span>
            )}
        </button>
    );
}
