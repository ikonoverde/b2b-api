import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    Loader2,
    User,
} from 'lucide-react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import type { PageProps } from '@/types';
import { apiFetch } from '@/utils/api';
import { useState } from 'react';

interface ProfileProps {
    user: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
}

interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
}

export default function Profile({ user }: ProfileProps) {
    const { flash } = usePage<PageProps>().props;
    const [formData, setFormData] = useState<ProfileFormData>({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(flash?.success || '');

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof ProfileFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        if (successMessage) {
            setSuccessMessage('');
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await apiFetch('/account/profile', {
                method: 'PUT',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccessMessage('Perfil actualizado exitosamente.');
                router.reload({ only: ['user'] });
            } else if (response.status === 422) {
                const data = await response.json();
                setErrors(data.errors || {});
            } else {
                setErrors({ name: 'Error al actualizar el perfil.' });
            }
        } catch {
            setErrors({ name: 'Error de conexión. Por favor intente nuevamente.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <CustomerLayout title="Editar Perfil">
            <div className="px-6 py-8 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href="/account"
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-[#666666]" />
                    </Link>
                    <h1 className="text-xl font-bold text-[#1A1A1A] font-[Outfit]">Editar Perfil</h1>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-700 font-[Outfit]">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {flash?.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700 font-[Outfit]">{flash.error}</p>
                    </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5E7052]/10">
                                <User className="h-6 w-6 text-[#5E7052]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#1A1A1A] font-[Outfit]">Información Personal</h2>
                                <p className="text-sm text-[#999999] font-[Outfit]">Actualice sus datos de contacto</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <ProfileFormInput label="Nombre Completo" type="text" name="name" value={formData.name} error={errors.name} placeholder="Ingrese su nombre completo" onChange={handleInputChange} />
                            <ProfileFormInput label="Correo Electrónico" type="email" name="email" value={formData.email} error={errors.email} placeholder="Ingrese su correo electrónico" onChange={handleInputChange} />
                            <ProfileFormInput label="Teléfono" type="tel" name="phone" value={formData.phone} error={errors.phone} placeholder="Ingrese su número de teléfono" onChange={handleInputChange} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link
                            href="/account"
                            className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3.5 text-center text-sm font-medium text-[#666666] hover:bg-gray-50 transition-colors font-[Outfit]"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 rounded-xl bg-[#5E7052] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#4A5A40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[Outfit] flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </CustomerLayout>
    );
}

function ProfileFormInput({ label, type, name, value, error, placeholder, onChange }: {
    label: string;
    type: string;
    name: string;
    value: string;
    error?: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-[#1A1A1A] mb-1.5 font-[Outfit]">
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full rounded-xl border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#E5E5E5] focus:border-[#5E7052] focus:ring-[#5E7052]/20'} px-4 py-3 text-sm font-[Outfit] focus:outline-none focus:ring-2 transition-colors`}
                placeholder={placeholder}
                required
            />
            {error && <p className="mt-1.5 text-xs text-red-600 font-[Outfit]">{error}</p>}
        </div>
    );
}
