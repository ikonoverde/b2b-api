import { router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import AccountShell from '@/Layouts/AccountShell';
import TextInput from '@/Components/TextInput';
import type { Address, AddressFormData, PageProps } from '@/types';

const MEXICO_STATES = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
    'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

const EMPTY_FORM: AddressFormData = {
    label: '',
    name: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    is_default: false,
};

interface AddressesProps {
    addresses: Address[];
}

export default function Addresses({ addresses }: AddressesProps) {
    const { flash } = usePage<PageProps>().props;
    const [success, setSuccess] = useState('');
    const formState = useAddressForm();

    useEffect(() => {
        if (flash?.success) {
            setSuccess(flash.success);
            const timer = setTimeout(() => setSuccess(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    return (
        <AccountShell
            title="Direcciones"
            eyebrow="Cuenta · Direcciones"
            headline="Direcciones de envío"
            sub="Gestiona las direcciones que aparecen en el checkout. La predeterminada se selecciona automáticamente al pagar."
            section="addresses"
        >
            {success && (
                <div className="mb-2 border border-[var(--iko-accent)] bg-[var(--iko-accent-soft)] px-5 py-3 text-[13px] text-[var(--iko-stone-ink)]">
                    {success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-2 border border-[var(--iko-error)]/40 bg-[var(--iko-error)]/5 px-5 py-3 text-[13px] text-[var(--iko-error)]">
                    {flash.error}
                </div>
            )}

            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--iko-stone-hairline)] pb-4">
                <span className="font-spec text-[11px] tabular-nums tracking-[0.04em] text-[var(--iko-stone-whisper)] uppercase">
                    {String(addresses.length).padStart(2, '0')}{' '}
                    {addresses.length === 1 ? 'dirección guardada' : 'direcciones guardadas'}
                </span>
                <button
                    type="button"
                    onClick={formState.openAddModal}
                    className="inline-flex h-11 items-center gap-2 bg-[var(--iko-accent)] px-5 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)]"
                >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                    Nueva dirección
                </button>
            </div>

            {addresses.length === 0 ? (
                <EmptyAddresses onAdd={formState.openAddModal} />
            ) : (
                <ol className="divide-y divide-[var(--iko-stone-hairline)] border-b border-[var(--iko-stone-hairline)]">
                    {addresses.map((address, idx) => (
                        <AddressRow
                            key={address.id}
                            address={address}
                            index={idx + 1}
                            onEdit={() => formState.openEditModal(address)}
                            onDelete={() => {
                                if (confirm('¿Eliminar esta dirección?')) {
                                    router.delete(`/account/addresses/${address.id}`, {
                                        preserveScroll: true,
                                    });
                                }
                            }}
                            onSetDefault={() =>
                                router.put(
                                    `/account/addresses/${address.id}`,
                                    { is_default: true },
                                    { preserveScroll: true },
                                )
                            }
                        />
                    ))}
                </ol>
            )}

            {formState.isEditing && (
                <AddressFormModal
                    editingAddress={formState.editingAddress}
                    form={formState.form}
                    onClose={formState.closeModal}
                    onSubmit={formState.handleSubmit}
                    onChange={formState.handleChange}
                />
            )}
        </AccountShell>
    );
}

function AddressRow({
    address,
    index,
    onEdit,
    onDelete,
    onSetDefault,
}: {
    address: Address;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
    onSetDefault: () => void;
}) {
    return (
        <li className="grid grid-cols-[2.5rem_1fr_auto] items-start gap-4 py-6 sm:grid-cols-[3rem_1fr_auto] sm:gap-6">
            <span className="font-spec text-[11px] tabular-nums text-[var(--iko-accent)]">
                {String(index).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-3">
                    <span className="font-display text-[1.125rem] leading-tight text-[var(--iko-stone-ink)]">
                        {address.label}
                    </span>
                    {address.is_default && (
                        <span className="font-spec text-[10px] tracking-[0.08em] text-[var(--iko-accent)] uppercase">
                            · Predeterminada
                        </span>
                    )}
                </div>
                <span className="text-[14px] text-[var(--iko-stone-ink)]">
                    {address.name}
                </span>
                <span className="text-[13px] leading-[1.55] text-[var(--iko-stone-whisper)]">
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
            </div>
            <div className="flex items-center gap-1">
                {!address.is_default && (
                    <IconButton onClick={onSetDefault} title="Predeterminar">
                        <Star className="h-4 w-4" strokeWidth={1.5} />
                    </IconButton>
                )}
                <IconButton onClick={onEdit} title="Editar">
                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                </IconButton>
                <IconButton onClick={onDelete} title="Eliminar" danger>
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </IconButton>
            </div>
        </li>
    );
}

function IconButton({
    onClick,
    title,
    danger = false,
    children,
}: {
    onClick: () => void;
    title: string;
    danger?: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            aria-label={title}
            className={`flex h-9 w-9 items-center justify-center text-[var(--iko-stone-whisper)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iko-stone-paper)] ${
                danger
                    ? 'hover:text-[var(--iko-error)]'
                    : 'hover:text-[var(--iko-accent)]'
            }`}
        >
            {children}
        </button>
    );
}

function EmptyAddresses({ onAdd }: { onAdd: () => void }) {
    return (
        <section className="flex flex-col gap-5 border-y border-[var(--iko-stone-hairline)] py-16">
            <span className="font-spec text-[11px] tracking-[0.12em] text-[var(--iko-stone-whisper)] uppercase">
                Sin direcciones
            </span>
            <p className="max-w-[42ch] font-display text-[1.5rem] leading-[1.15] text-[var(--iko-stone-ink)]">
                Aún no has guardado direcciones.
            </p>
            <p className="max-w-[58ch] text-[14px] leading-[1.55] text-[var(--iko-stone-ink)]/75">
                Guarda direcciones de envío para acelerar tus próximos pedidos. Una sola dirección
                puede ser predeterminada.
            </p>
            <div>
                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex h-12 items-center gap-2 bg-[var(--iko-accent)] px-7 text-[14px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)]"
                >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                    Agregar dirección
                </button>
            </div>
        </section>
    );
}

function useAddressForm() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const form = useForm<AddressFormData>({ ...EMPTY_FORM });

    function openAddModal(): void {
        setEditingAddress(null);
        form.reset();
        form.clearErrors();
        setIsEditing(true);
    }

    function openEditModal(address: Address): void {
        setEditingAddress(address);
        form.setData({
            label: address.label,
            name: address.name,
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2 || '',
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            phone: address.phone || '',
            is_default: address.is_default,
        });
        form.clearErrors();
        setIsEditing(true);
    }

    function closeModal(): void {
        setIsEditing(false);
        setEditingAddress(null);
        form.reset();
        form.clearErrors();
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
        const target = e.target;
        const name = target.name as keyof AddressFormData;

        if (target.type === 'checkbox') {
            form.setData(name, (target as HTMLInputElement).checked as unknown as string);
        } else {
            form.setData(name, target.value);
        }

        if (form.errors[name]) {
            form.clearErrors(name);
        }
    }

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => closeModal() };
        if (editingAddress) {
            form.put(`/account/addresses/${editingAddress.id}`, options);
        } else {
            form.post('/account/addresses', options);
        }
    }

    return {
        isEditing,
        editingAddress,
        form,
        openAddModal,
        openEditModal,
        closeModal,
        handleChange,
        handleSubmit,
    };
}

function AddressFormModal({
    editingAddress,
    form,
    onClose,
    onSubmit,
    onChange,
}: {
    editingAddress: Address | null;
    form: ReturnType<typeof useForm<AddressFormData>>;
    onClose: () => void;
    onSubmit: (e: FormEvent) => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-modal-heading"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--iko-stone-ink)]/40 p-4"
            onClick={onClose}
        >
            <div
                className="my-8 w-full max-w-[32rem] border border-[var(--iko-stone-hairline)] bg-[var(--iko-stone-paper)] shadow-[0_24px_60px_-20px_rgba(13,38,46,0.25)]"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b border-[var(--iko-stone-hairline)] px-6 py-5">
                    <h2
                        id="address-modal-heading"
                        className="font-display text-[1.25rem] leading-tight text-[var(--iko-stone-ink)]"
                    >
                        {editingAddress ? 'Editar dirección' : 'Nueva dirección'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[var(--iko-stone-whisper)] hover:text-[var(--iko-stone-ink)]"
                        aria-label="Cerrar"
                    >
                        <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                </header>

                <form onSubmit={onSubmit} className="flex flex-col gap-6 p-6">
                    <TextInput
                        id="label"
                        label="Etiqueta"
                        value={form.data.label}
                        onChange={(e) => {
                            form.setData('label', e.target.value);
                            if (form.errors.label) form.clearErrors('label');
                        }}
                        placeholder="Ej. Bodega, Oficina, Sucursal centro"
                        error={form.errors.label}
                        required
                    />
                    <TextInput
                        id="name"
                        label="Nombre de contacto"
                        value={form.data.name}
                        onChange={(e) => {
                            form.setData('name', e.target.value);
                            if (form.errors.name) form.clearErrors('name');
                        }}
                        error={form.errors.name}
                        autoComplete="name"
                        required
                    />
                    <TextInput
                        id="address_line_1"
                        label="Calle y número"
                        value={form.data.address_line_1}
                        onChange={(e) => {
                            form.setData('address_line_1', e.target.value);
                            if (form.errors.address_line_1) form.clearErrors('address_line_1');
                        }}
                        error={form.errors.address_line_1}
                        autoComplete="address-line1"
                        required
                    />
                    <TextInput
                        id="address_line_2"
                        label="Colonia / referencias"
                        value={form.data.address_line_2}
                        onChange={(e) => {
                            form.setData('address_line_2', e.target.value);
                            if (form.errors.address_line_2) form.clearErrors('address_line_2');
                        }}
                        error={form.errors.address_line_2}
                        autoComplete="address-line2"
                    />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <TextInput
                            id="city"
                            label="Ciudad"
                            value={form.data.city}
                            onChange={(e) => {
                                form.setData('city', e.target.value);
                                if (form.errors.city) form.clearErrors('city');
                            }}
                            error={form.errors.city}
                            autoComplete="address-level2"
                            required
                        />
                        <SelectField
                            id="state"
                            label="Estado"
                            value={form.data.state}
                            error={form.errors.state}
                            onChange={onChange}
                            options={MEXICO_STATES}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[8rem_1fr]">
                        <TextInput
                            id="postal_code"
                            label="C.P."
                            value={form.data.postal_code}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                                form.setData('postal_code', value);
                                if (form.errors.postal_code) form.clearErrors('postal_code');
                            }}
                            error={form.errors.postal_code}
                            autoComplete="postal-code"
                            inputMode="numeric"
                            required
                        />
                        <TextInput
                            id="phone"
                            label="Teléfono"
                            type="tel"
                            value={form.data.phone}
                            onChange={(e) => {
                                form.setData('phone', e.target.value);
                                if (form.errors.phone) form.clearErrors('phone');
                            }}
                            error={form.errors.phone}
                            autoComplete="tel"
                            inputMode="tel"
                        />
                    </div>

                    <label className="flex items-center gap-3 text-[13px] text-[var(--iko-stone-ink)]">
                        <input
                            type="checkbox"
                            name="is_default"
                            checked={form.data.is_default}
                            onChange={onChange}
                            className="h-4 w-4 border border-[var(--iko-stone-hairline)] accent-[var(--iko-accent)] rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iko-accent)]"
                        />
                        Establecer como dirección predeterminada
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[var(--iko-stone-hairline)] py-3 text-[13px] text-[var(--iko-stone-ink)] hover:border-[var(--iko-accent)]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="flex-1 bg-[var(--iko-accent)] py-3 text-[13px] font-medium text-[var(--iko-accent-on)] hover:bg-[var(--iko-accent-hover)] disabled:opacity-60"
                        >
                            {form.processing ? 'Guardando…' : editingAddress ? 'Guardar cambios' : 'Agregar dirección'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SelectField({
    id,
    label,
    value,
    error,
    onChange,
    options,
}: {
    id: string;
    label: string;
    value: string;
    error?: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}) {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="font-spec text-[11px] tracking-[0.08em] text-[var(--iko-stone-whisper)] uppercase"
            >
                {label}
                <span aria-hidden="true" className="ml-1 opacity-50">*</span>
            </label>
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required
                className={`h-12 w-full appearance-none border-b bg-transparent pr-6 font-sans text-[15px] text-[var(--iko-stone-ink)] focus-visible:outline-none focus-visible:border-[var(--iko-accent)] ${
                    error ? 'border-[var(--iko-error)]' : 'border-[var(--iko-stone-hairline)]'
                }`}
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none' stroke='%237a7a7a'><path d='M1 1l4 4 4-4'/></svg>\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0 center',
                    backgroundSize: '10px',
                }}
            >
                <option value="">Seleccionar…</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            {error && (
                <span className="font-spec text-[11px] tracking-[0.04em] text-[var(--iko-error)]">
                    {error}
                </span>
            )}
        </div>
    );
}
