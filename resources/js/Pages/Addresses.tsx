import { router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    Home,
    Loader2,
    MapPin,
    Pencil,
    Plus,
    Star,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
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

const INPUT_BASE = 'w-full rounded-xl border px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors';
const INPUT_NORMAL = `${INPUT_BASE} border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20`;
const INPUT_ERROR = `${INPUT_BASE} border-red-300 focus:border-red-500 focus:ring-red-200`;

function FormField({ label, required, error, children }: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{error}</p>}
        </div>
    );
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }: {
    address: Address;
    onEdit: () => void;
    onDelete: () => void;
    onSetDefault: () => void;
}) {
    return (
        <div className={`flex items-start gap-4 rounded-xl bg-white p-4 border ${
            address.is_default ? 'border-[#5E7052] ring-1 ring-[#5E7052]' : 'border-[#E5E5E5]'
        }`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5E7052]/10 flex-shrink-0 mt-0.5">
                <Home className="h-5 w-5 text-[#5E7052]" />
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

            <div className="flex items-center gap-1 flex-shrink-0">
                {!address.is_default && (
                    <button onClick={onSetDefault} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Establecer como predeterminada">
                        <Star className="h-4 w-4 text-[#999999]" />
                    </button>
                )}
                <button onClick={onEdit} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Editar dirección">
                    <Pencil className="h-4 w-4 text-[#5E7052]" />
                </button>
                <button onClick={onDelete} className="p-2 hover:bg-red-50 rounded-full transition-colors" title="Eliminar dirección">
                    <Trash2 className="h-4 w-4 text-red-500" />
                </button>
            </div>
        </div>
    );
}

function AddressFormModal({ editingAddress, form, onClose, onSubmit, onInputChange }: {
    editingAddress: Address | null;
    form: ReturnType<typeof useForm<AddressFormData>>;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl my-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">
                        {editingAddress ? 'Editar Dirección' : 'Agregar Dirección'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors" type="button">
                        <X className="h-5 w-5 text-[#999999]" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <FormField label="Etiqueta" required error={form.errors.label}>
                        <input type="text" name="label" value={form.data.label} onChange={onInputChange}
                            className={form.errors.label ? INPUT_ERROR : INPUT_NORMAL} placeholder="Ej: Casa, Oficina, Sucursal" required />
                    </FormField>

                    <FormField label="Nombre de contacto" required error={form.errors.name}>
                        <input type="text" name="name" value={form.data.name} onChange={onInputChange}
                            className={form.errors.name ? INPUT_ERROR : INPUT_NORMAL} placeholder="Nombre completo" required />
                    </FormField>

                    <FormField label="Dirección" required error={form.errors.address_line_1}>
                        <input type="text" name="address_line_1" value={form.data.address_line_1} onChange={onInputChange}
                            className={form.errors.address_line_1 ? INPUT_ERROR : INPUT_NORMAL} placeholder="Calle y número" required />
                    </FormField>

                    <FormField label="Dirección (continuación)" error={form.errors.address_line_2}>
                        <input type="text" name="address_line_2" value={form.data.address_line_2} onChange={onInputChange}
                            className={form.errors.address_line_2 ? INPUT_ERROR : INPUT_NORMAL} placeholder="Piso, departamento, referencias (opcional)" />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Ciudad" required error={form.errors.city}>
                            <input type="text" name="city" value={form.data.city} onChange={onInputChange}
                                className={form.errors.city ? INPUT_ERROR : INPUT_NORMAL} placeholder="Ciudad" required />
                        </FormField>
                        <FormField label="Estado" required error={form.errors.state}>
                            <select name="state" value={form.data.state} onChange={onInputChange}
                                className={`${form.errors.state ? INPUT_ERROR : INPUT_NORMAL} bg-white`} required>
                                <option value="">Seleccionar...</option>
                                {MEXICO_STATES.map(state => (<option key={state} value={state}>{state}</option>))}
                            </select>
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Código Postal" required error={form.errors.postal_code}>
                            <input type="text" name="postal_code" value={form.data.postal_code} onChange={onInputChange}
                                className={form.errors.postal_code ? INPUT_ERROR : INPUT_NORMAL} placeholder="00000" maxLength={5} required />
                        </FormField>
                        <FormField label="Teléfono" error={form.errors.phone}>
                            <input type="tel" name="phone" value={form.data.phone} onChange={onInputChange}
                                className={form.errors.phone ? INPUT_ERROR : INPUT_NORMAL} placeholder="5551234567" />
                        </FormField>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_default" id="is_default" checked={form.data.is_default} onChange={onInputChange}
                            className="h-4 w-4 rounded border-[#E5E5E5] text-[#5E7052] focus:ring-[#5E7052]" />
                        <label htmlFor="is_default" className="text-sm text-[#1A1A1A] font-[Outfit]">
                            Establecer como dirección predeterminada
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-medium text-[#666666] hover:bg-gray-50 transition-colors font-[Outfit]">
                            Cancelar
                        </button>
                        <button type="submit" disabled={form.processing}
                            className="flex-1 rounded-xl bg-[#5E7052] px-4 py-3 text-sm font-bold text-white hover:bg-[#4A5A40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[Outfit]">
                            {form.processing
                                ? <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                : editingAddress ? 'Guardar Cambios' : 'Agregar Dirección'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface AddressesProps {
    addresses: Address[];
}

function useAddressForm() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const form = useForm<AddressFormData>({ ...EMPTY_FORM });

    function openAddModal() {
        setEditingAddress(null);
        form.reset();
        form.clearErrors();
        setIsEditing(true);
    }

    function openEditModal(address: Address) {
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

    function closeModal() {
        setIsEditing(false);
        setEditingAddress(null);
        form.reset();
        form.clearErrors();
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        form.setData(name as keyof AddressFormData, type === 'checkbox' ? (checked as unknown as string) : value);
        if (form.errors[name as keyof AddressFormData]) {
            form.clearErrors(name as keyof AddressFormData);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => closeModal() };

        if (editingAddress) {
            form.put(`/account/addresses/${editingAddress.id}`, options);
        } else {
            form.post('/account/addresses', options);
        }
    }

    return {
        isEditing, editingAddress, form,
        openAddModal, openEditModal, closeModal,
        handleInputChange, handleSubmit,
    };
}

export default function Addresses({ addresses }: AddressesProps) {
    const { flash } = usePage<PageProps>().props;
    const [successMessage, setSuccessMessage] = useState('');
    const addressForm = useAddressForm();

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    return (
        <CustomerLayout title="Direcciones de Envío">
            <div className="px-6 py-8 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => router.visit('/account')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-[#5E7052]" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">Direcciones de Envío</h1>
                </div>

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 font-[Outfit]">{successMessage}</p>
                    </div>
                )}

                {flash?.error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700 font-[Outfit]">{flash.error}</p>
                    </div>
                )}

                <button onClick={addressForm.openAddModal}
                    className="w-full mb-6 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#5E7052] bg-[#5E7052]/5 px-4 py-4 text-sm font-medium text-[#5E7052] hover:bg-[#5E7052]/10 transition-colors font-[Outfit]">
                    <Plus className="h-5 w-5" />
                    Agregar Nueva Dirección
                </button>

                {addresses.length === 0 ? (
                    <div className="text-center py-12">
                        <MapPin className="h-12 w-12 text-[#CCCCCC] mx-auto mb-3" />
                        <p className="text-sm text-[#666666] font-[Outfit]">No tiene direcciones guardadas.</p>
                        <p className="text-xs text-[#999999] font-[Outfit] mt-1">Agregue una dirección para facilitar sus envíos futuros.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {addresses.map((address) => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                onEdit={() => addressForm.openEditModal(address)}
                                onDelete={() => {
                                    if (confirm('¿Está seguro de que desea eliminar esta dirección?')) {
                                        router.delete(`/account/addresses/${address.id}`, { preserveScroll: true });
                                    }
                                }}
                                onSetDefault={() => router.put(`/account/addresses/${address.id}`, { is_default: true }, { preserveScroll: true })}
                            />
                        ))}
                    </div>
                )}

                {addressForm.isEditing && (
                    <AddressFormModal
                        editingAddress={addressForm.editingAddress}
                        form={addressForm.form}
                        onClose={addressForm.closeModal}
                        onSubmit={addressForm.handleSubmit}
                        onInputChange={addressForm.handleInputChange}
                    />
                )}
            </div>
        </CustomerLayout>
    );
}
