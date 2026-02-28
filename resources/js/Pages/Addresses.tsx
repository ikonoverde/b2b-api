import { router } from '@inertiajs/react';
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
import type { Address, AddressFormData } from '@/types';

const MEXICO_STATES = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
    'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

function getCsrfToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    if (match) {
        try {
            return decodeURIComponent(match[2]);
        } catch {
            return match[2];
        }
    }
    return null;
}

export default function Addresses() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

    const [formData, setFormData] = useState<AddressFormData>({
        label: '',
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        phone: '',
        is_default: false,
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    async function loadAddresses() {
        try {
            const response = await fetch('/api/addresses', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAddresses(data.data || []);
            } else {
                setError('Error al cargar las direcciones.');
            }
        } catch {
            setError('Error de conexión. Por favor intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }

    function resetForm() {
        setFormData({
            label: '',
            name: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            phone: '',
            is_default: false,
        });
        setFormErrors({});
        setEditingAddress(null);
    }

    function openAddModal() {
        resetForm();
        setIsEditing(true);
    }

    function openEditModal(address: Address) {
        setEditingAddress(address);
        setFormData({
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
        setFormErrors({});
        setIsEditing(true);
    }

    function closeModal() {
        setIsEditing(false);
        setError('');
        resetForm();
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (formErrors[name as keyof AddressFormData]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setFormErrors({});

        try {
            const csrfToken = getCsrfToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }

            const url = editingAddress
                ? `/api/addresses/${editingAddress.id}`
                : '/api/addresses';
            const method = editingAddress ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers,
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(editingAddress ? 'Dirección actualizada exitosamente.' : 'Dirección agregada exitosamente.');
                loadAddresses();
                closeModal();
                setTimeout(() => setSuccess(''), 3000);
            } else if (response.status === 422) {
                setFormErrors(data.errors || {});
            } else {
                setError(data.message || 'Error al guardar la dirección.');
            }
        } catch {
            setError('Error de conexión. Por favor intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(addressId: number) {
        if (!confirm('¿Está seguro de que desea eliminar esta dirección?')) return;

        setError('');
        setSuccess('');

        try {
            const csrfToken = getCsrfToken();
            const headers: Record<string, string> = {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }

            const response = await fetch(`/api/addresses/${addressId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Dirección eliminada exitosamente.');
                setAddresses(prev => prev.filter(a => a.id !== addressId));
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Error al eliminar la dirección.');
            }
        } catch {
            setError('Error de conexión. Por favor intente nuevamente.');
        }
    }

    async function handleSetDefault(addressId: number) {
        setError('');
        setSuccess('');

        try {
            const csrfToken = getCsrfToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            };
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }

            const response = await fetch(`/api/addresses/${addressId}`, {
                method: 'PUT',
                credentials: 'include',
                headers,
                body: JSON.stringify({ is_default: true }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Dirección predeterminada actualizada.');
                setAddresses(prev =>
                    prev.map(a => ({
                        ...a,
                        is_default: a.id === addressId,
                    }))
                );
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.message || 'Error al establecer la dirección predeterminada.');
            }
        } catch {
            setError('Error de conexión. Por favor intente nuevamente.');
        }
    }

    return (
        <CustomerLayout title="Direcciones de Envío">
            <div className="px-6 py-8 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.visit('/account')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-[#5E7052]" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] font-[Outfit]">
                        Direcciones de Envío
                    </h1>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 font-[Outfit]">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700 font-[Outfit]">{error}</p>
                    </div>
                )}

                {/* Add New Button */}
                <button
                    onClick={openAddModal}
                    className="w-full mb-6 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#5E7052] bg-[#5E7052]/5 px-4 py-4 text-sm font-medium text-[#5E7052] hover:bg-[#5E7052]/10 transition-colors font-[Outfit]"
                >
                    <Plus className="h-5 w-5" />
                    Agregar Nueva Dirección
                </button>

                {/* Addresses List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[#5E7052]" />
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                        <MapPin className="h-12 w-12 text-[#CCCCCC] mx-auto mb-3" />
                        <p className="text-sm text-[#666666] font-[Outfit]">
                            No tiene direcciones guardadas.
                        </p>
                        <p className="text-xs text-[#999999] font-[Outfit] mt-1">
                            Agregue una dirección para facilitar sus envíos futuros.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`flex items-start gap-4 rounded-xl bg-white p-4 border ${
                                    address.is_default
                                        ? 'border-[#5E7052] ring-1 ring-[#5E7052]'
                                        : 'border-[#E5E5E5]'
                                }`}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5E7052]/10 flex-shrink-0 mt-0.5">
                                    <Home className="h-5 w-5 text-[#5E7052]" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-bold text-[#1A1A1A] font-[Outfit]">
                                            {address.label}
                                        </p>
                                        {address.is_default && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#5E7052] font-[Outfit]">
                                                <Star className="h-3 w-3 fill-current" />
                                                Predeterminada
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[#1A1A1A] font-[Outfit]">
                                        {address.name}
                                    </p>
                                    <p className="text-sm text-[#666666] font-[Outfit]">
                                        {address.address_line_1}
                                        {address.address_line_2 && `, ${address.address_line_2}`}
                                    </p>
                                    <p className="text-sm text-[#666666] font-[Outfit]">
                                        {address.city}, {address.state} {address.postal_code}
                                    </p>
                                    {address.phone && (
                                        <p className="text-xs text-[#999999] font-[Outfit] mt-1">
                                            Tel: {address.phone}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {!address.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            title="Establecer como predeterminada"
                                        >
                                            <Star className="h-4 w-4 text-[#999999]" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEditModal(address)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Editar dirección"
                                    >
                                        <Pencil className="h-4 w-4 text-[#5E7052]" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                        title="Eliminar dirección"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Address Modal */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl my-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">
                                    {editingAddress ? 'Editar Dirección' : 'Agregar Dirección'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    type="button"
                                >
                                    <X className="h-5 w-5 text-[#999999]" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Label */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                        Etiqueta <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="label"
                                        value={formData.label}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-xl border ${formErrors.label ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="Ej: Casa, Oficina, Sucursal"
                                        required
                                    />
                                    {formErrors.label && (
                                        <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{formErrors.label}</p>
                                    )}
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                        Nombre de contacto <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-xl border ${formErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="Nombre completo"
                                        required
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{formErrors.name}</p>
                                    )}
                                </div>

                                {/* Address Line 1 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                        Dirección <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address_line_1"
                                        value={formData.address_line_1}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-xl border ${formErrors.address_line_1 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="Calle y número"
                                        required
                                    />
                                    {formErrors.address_line_1 && (
                                        <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{formErrors.address_line_1}</p>
                                    )}
                                </div>

                                {/* Address Line 2 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                        Dirección (continuación)
                                    </label>
                                    <input
                                        type="text"
                                        name="address_line_2"
                                        value={formData.address_line_2}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-xl border ${formErrors.address_line_2 ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                        placeholder="Piso, departamento, referencias (opcional)"
                                    />
                                    {formErrors.address_line_2 && (
                                        <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{formErrors.address_line_2}</p>
                                    )}
                                </div>

                                {/* City and State */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                            Ciudad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border ${formErrors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="Ciudad"
                                            required
                                        />
                                        {formErrors.city && (
                                            <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{formErrors.city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                            Estado <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border ${formErrors.state ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors bg-white`}
                                            required
                                        >
                                            <option value="">Seleccionar...</option>
                                            {MEXICO_STATES.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        {formErrors.state && (
                                            <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{formErrors.state}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Postal Code and Phone */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                            Código Postal <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={formData.postal_code}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border ${formErrors.postal_code ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="00000"
                                            maxLength={5}
                                            required
                                        />
                                        {formErrors.postal_code && (
                                            <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{formErrors.postal_code}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`w-full rounded-xl border ${formErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="5551234567"
                                        />
                                        {formErrors.phone && (
                                            <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{formErrors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Is Default */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="is_default"
                                        id="is_default"
                                        checked={formData.is_default}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 rounded border-[#E5E5E5] text-[#5E7052] focus:ring-[#5E7052]"
                                    />
                                    <label htmlFor="is_default" className="text-sm text-[#1A1A1A] font-[Outfit]">
                                        Establecer como dirección predeterminada
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-medium text-[#666666] hover:bg-gray-50 transition-colors font-[Outfit]"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 rounded-xl bg-[#5E7052] px-4 py-3 text-sm font-bold text-white hover:bg-[#4A5A40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[Outfit]"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                        ) : (
                                            editingAddress ? 'Guardar Cambios' : 'Agregar Dirección'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
